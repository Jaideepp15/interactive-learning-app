"use client";

import { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";

// Predefined progress data for the child
const predefinedProgressData = [
  {
    id: 1,
    categoryId: 1,
    categoryName: "Math",
    completedSubtopics: 3,
    totalSubtopics: 5,
  },
  {
    id: 2,
    categoryId: 2,
    categoryName: "Science",
    completedSubtopics: 2,
    totalSubtopics: 5,
  },
  {
    id: 3,
    categoryId: 3,
    categoryName: "History",
    completedSubtopics: 4,
    totalSubtopics: 5,
  },
];

const badges = [
  { id: "subtopics", name: "Master of Subtopics", icon: "📜", color: "bg-yellow-500" },
  { id: "math", name: "Maths Champion", icon: "🔢", color: "bg-blue-500" },
  { id: "science", name: "Science Explorer", icon: "🔬", color: "bg-green-500" },
  { id: "history", name: "History Expert", icon: "🏛️", color: "bg-red-500" },
];

export default function ParentProgress({ childUsername }: { childUsername: string }) {
  const [progressData, setProgressData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    // Using predefined data instead of fetching
    setProgressData(predefinedProgressData);
    unlockBadges(predefinedProgressData);
  }, []);

  const unlockBadges = (progressData: any[]) => {
    let newUnlockedBadges: string[] = [];

    const allSubtopicsCompleted = progressData.every(
      (p) => p.completedSubtopics === p.totalSubtopics && p.totalSubtopics > 0
    );
    if (allSubtopicsCompleted) newUnlockedBadges.push("subtopics");

    progressData.forEach(({ categoryName, completedSubtopics, totalSubtopics }) => {
      if (completedSubtopics === totalSubtopics && totalSubtopics > 0) {
        if (categoryName.toLowerCase() === "math") newUnlockedBadges.push("math");
        if (categoryName.toLowerCase() === "science") newUnlockedBadges.push("science");
        if (categoryName.toLowerCase() === "history") newUnlockedBadges.push("history");
      }
    });

    setUnlockedBadges(newUnlockedBadges);
  };

  if (loading) return <p>Loading progress...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Progress Tracking</h2>

      {/* Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {progressData.length === 0 ? (
          <p>No progress recorded yet.</p>
        ) : (
          progressData.map(
            ({ id, categoryId, categoryName, completedSubtopics, totalSubtopics }) => {
              const progress = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;

              return (
                <div
                  key={id}
                  className={`flex flex-col items-center p-6 bg-gray-100 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer ${categoryId === 1 ? "border-2 border-blue-500" : ""}`}
                >
                  <h3 className="text-2xl font-semibold mb-4">{categoryName || "Unknown"}</h3>
                  <div className="w-32 h-32">
                    <CircularProgressbar
                      value={progress}
                      text={`${progress}%`}
                      styles={buildStyles({
                        textColor: "#000000",
                        pathColor: "#7289da",
                        trailColor: "#d1d5db",
                      })}
                    />
                  </div>
                </div>
              );
            }
          )
        )}
      </div>

      {/* Achievement Badges */}
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-2 gap-6">
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              className={`w-24 h-24 flex flex-col items-center justify-center rounded-full shadow-lg cursor-pointer transition-all duration-300 ${
                unlockedBadges.includes(badge.id)
                  ? `${badge.color} text-white`
                  : "bg-gray-300 text-gray-500"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="text-3xl">{badge.icon}</span>
              <p className="text-xs text-center mt-1">{badge.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}