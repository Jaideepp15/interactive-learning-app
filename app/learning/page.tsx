"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlayCircle, BookOpen, BarChart, LogOut, User, Gamepad2, ClipboardList, Flame, MessageSquare, Target } from "lucide-react";
import VideoLessons from "./VideoLessons";
import Quizzes from "./Quizzes";
import Progress from "./Progress";
import Games from "./game";
import Assignments from "./Assignments";
import FeedbackReader from "./feedback-reader";
import LearningGoals from "./learninggoals";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img alt="Your Company" src="/vite.svg" className="h-10 w-auto" />
      <span className="font-black text-2xl text-violet-600">Learnify</span>
    </div>
  );
}

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const updateStreak = async () => {
      try {
        const userRes = await fetch("/api/fetch-details", {
          method: "GET",
          headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const userData = await userRes.json();
      console.log("Fetched User Data:", userData);
      setUserId(userData.userId);
        const response = await fetch("/api/streak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userData.userId }),
        });

        if (!response.ok) throw new Error("Failed to update streak");

        const data = await response.json();
        setStreak(data.streak);
      } catch (error) {
        console.error("Error updating streak:", error);
      }
    };

    updateStreak();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-800">
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <Logo />
        <div className="flex gap-6">
          {["videos", "quizzes", "games", "progress", "assignments", "feedback", "goals"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition duration-300 shadow-md ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-200 text-zinc-700 hover:bg-violet-500 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "videos" && <PlayCircle className="mr-2 inline-block" />}
              {tab === "quizzes" && <BookOpen className="mr-2 inline-block" />}
              {tab === "games" && <Gamepad2 className="mr-2 inline-block" />}
              {tab === "progress" && <BarChart className="mr-2 inline-block" />}
              {tab === "assignments" && <ClipboardList className="mr-2 inline-block" />}
              {tab === "feedback" && <MessageSquare className="mr-2 inline-block" />}
              {tab === "goals" && <Target className="mr-2 inline-block" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="relative flex items-center profile-dropdown">
          {/* Streak Tracker */}
          <div className="flex items-center gap-2 bg-orange-100 px-3 py-2 rounded-md shadow-md border border-orange-400">
            <Flame className="text-orange-500" />
            <span className="font-semibold text-orange-700">{streak} Day Streak</span>
          </div>

          {/* Profile Dropdown */}
          <div className="ml-4 relative">
            <img
              src="/profile.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-violet-500 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white text-zinc-800 rounded-lg shadow-xl z-10 border border-zinc-200"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-zinc-100 transition"
                  onClick={() => router.push("../ProfilePage")}
                >
                  <User className="w-5 h-5" /> Update Profile
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-zinc-100 transition"
                  onClick={() => {
                    localStorage.removeItem("chatMessages"); // Clear chat history
                    localStorage.setItem("signOut", "true"); // Mark sign out event
                    router.push("/");
                  }}
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="p-8 mx-auto max-w-4xl bg-white rounded-xl shadow-md mt-6">
        {activeTab === "videos" && <VideoLessons />}
        {activeTab === "quizzes" && <Quizzes />}
        {activeTab === "games" && <Games />}
        {activeTab === "progress" && <Progress />}
        {activeTab === "assignments" && <Assignments />}
        {activeTab === "feedback" && <FeedbackReader />}
        {activeTab === "goals" && <LearningGoals />}
      </div>
    </div>
  );
}
