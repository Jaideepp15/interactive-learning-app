"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart, LogOut, User } from "lucide-react";
import Analytics from "./analytics";
import Students from "./students";
import Assignments from "./assignments";
import Quizzes from "./quizzes";
import VideosPage from "./videos";

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img alt="Your Company" src="/vite.svg" className="h-10 w-auto" />
      <span className="font-black text-2xl text-violet-600">Learnify</span>
    </div>
  );
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState<{ name: string; subject: string; categoryid: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchTeacherDetails() {
      try {
        const response = await fetch("/api/fetch-teacher-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token is stored in localStorage
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTeacherInfo({ name: data.name, subject: data.subject, categoryid: data.categoryid });
        } else {
          console.error("Failed to fetch teacher details");
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    }

    fetchTeacherDetails();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-800">
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <Logo />
        <div className="flex gap-6">
          {["analytics", "students", "assignments", "quizzes", "videos"].map((tab) => (
            <button
              key={tab}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition duration-300 shadow-md ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-200 text-zinc-700 hover:bg-violet-500 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative profile-dropdown">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-violet-500 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-zinc-800 rounded-lg shadow-xl z-10 border border-zinc-200" onClick={(e) => e.stopPropagation()}>
              <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-zinc-100 transition" onClick={() => router.push("../ProfilePage")}>
                <User className="w-5 h-5" /> Update Profile
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-3 hover:bg-zinc-100 transition" onClick={() => router.push("/")}>
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-8 mx-auto max-w-4xl bg-white rounded-xl shadow-md mt-6">
        {teacherInfo ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {teacherInfo.name} - {teacherInfo.subject}
            </h2>
            {activeTab === "analytics" && <Analytics />}
            {activeTab === "students" && <Students />}
            {activeTab === "assignments" && <Assignments />}
            {activeTab === "quizzes" && <Quizzes />}
            {activeTab === "videos" && <VideosPage />}
          </>
        ) : (
          <p className="text-center text-lg">Loading teacher details...</p>
        )}
      </div>
    </div>
  );
}
