"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LogOut, User, BarChart, Target, MessageSquare, Clock } from "lucide-react"
import ParentProgress from "./ParentProgress" // Parent Progress component to show child's progress
import LearningGoals from "./learning-goals" // Learning Goals component
import PendingGoals from "./pending-goals" // New Pending Goals component
import Feedback from "./feedback" // New Feedback component

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <img alt="Your Company" src="/vite.svg" className="h-10 w-auto" />
      <span className="font-black text-2xl text-violet-600">Learnify</span>
    </div>
  )
}

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("progress")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Hardcoded parent details
  const [parentInfo, setParentInfo] = useState<{ name: string; childUsername: string }>({
    name: "John Doe", // Example parent name
    childUsername: "child123", // Example child username
  })

  const [childProgress, setChildProgress] = useState<any>(null)
  const [error, setError] = useState<string>("") // Error state for API issues
  const router = useRouter()

  useEffect(() => {
    // No API call needed, we are using hardcoded values now
    if (parentInfo && parentInfo.childUsername) {
      setChildProgress({
        progress: [
          { categoryName: "Math", progress: 60 },
          { categoryName: "Science", progress: 50 },
          { categoryName: "History", progress: 40 },
        ],
      })
    }
  }, [parentInfo])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropdownOpen) setDropdownOpen(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [dropdownOpen])

  const tabs = [
    { id: "progress", label: "Student Progress", icon: <BarChart className="w-4 h-4" /> },
    { id: "learning-goals", label: "Set Learning Goals", icon: <Target className="w-4 h-4" /> },
    { id: "pending-goals", label: "Pending Goals", icon: <Clock className="w-4 h-4" /> },
    { id: "feedback", label: "Send Feedback", icon: <MessageSquare className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-800">
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
        <Logo />
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition duration-300 shadow-md flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-violet-600 text-white"
                  : "bg-zinc-200 text-zinc-700 hover:bg-violet-500 hover:text-white"
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative profile-dropdown">
          <img
            src="/profile.png"
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-violet-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              setDropdownOpen(!dropdownOpen)
            }}
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
                onClick={() => router.push("/")}
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="p-8 mx-auto max-w-4xl bg-white rounded-xl shadow-md mt-6">
        {parentInfo ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">
              {parentInfo.name} - Monitoring {parentInfo.childUsername}'s Progress
            </h2>
            {activeTab === "progress" && <ParentProgress childUsername={parentInfo.childUsername} />}
            {activeTab === "learning-goals" && <LearningGoals />}
            {activeTab === "pending-goals" && <PendingGoals />}
            {activeTab === "feedback" && <Feedback />}
          </>
        ) : (
          <p className="text-center text-lg">{error || "Loading parent details..."}</p>
        )}
      </div>
    </div>
  )
}

