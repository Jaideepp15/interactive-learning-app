"use client";

import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion } from "framer-motion";

interface Progress {
  id: number;
  categoryId: number;
  categoryName: string;
  completedSubtopics: number;
  totalSubtopics: number;
}

interface Subtopic {
  id: number;
  name: string;
}

const badges = [
  { id: "subtopics", name: "Master of Subtopics", icon: "📜", color: "bg-yellow-500" },
  { id: "math", name: "Maths Champion", icon: "🔢", color: "bg-blue-500" },
  { id: "science", name: "Science Explorer", icon: "🔬", color: "bg-green-500" },
  { id: "history", name: "History Expert", icon: "🏛️", color: "bg-red-500" },
];

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [completedSubtopics, setCompletedSubtopics] = useState<Subtopic[]>([]);
  const [subtopicLoading, setSubtopicLoading] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required.");
          setLoading(false);
          return;
        }

        const response = await fetch("/api/progress", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }

        const data = await response.json();
        setProgressData(data);
        unlockBadges(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleCategoryClick = async (categoryId: number, progress: number) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      setCompletedSubtopics([]);
      return;
    }

    if (progress === 0) {
      setSelectedCategory(categoryId);
      setCompletedSubtopics([]);
      return;
    }

    setSubtopicLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required.");
        return;
      }

      const response = await fetch(`/api/progress/${categoryId}/subtopics`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subtopics");
      }

      const data = await response.json();
      setCompletedSubtopics(data);
      setSelectedCategory(categoryId);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubtopicLoading(false);
    }
  };

  const unlockBadges = (progressData: Progress[]) => {
    let newUnlockedBadges: string[] = [];

    const allSubtopicsCompleted = progressData.every(p => p.completedSubtopics === p.totalSubtopics && p.totalSubtopics > 0);
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
          progressData.map(({ id, categoryId, categoryName, completedSubtopics, totalSubtopics }) => {
            const progress = totalSubtopics > 0 
              ? Math.round((completedSubtopics / totalSubtopics) * 100) 
              : 0;

            return (
              <div
                key={id}
                className={`flex flex-col items-center p-6 bg-gray-100 rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105 cursor-pointer ${selectedCategory === categoryId ? "border-2 border-blue-500" : ""}`}
                onClick={() => handleCategoryClick(categoryId, progress)}
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
          })
        )}
      </div>

      {/* Selected Category Subtopics */}
      {selectedCategory !== null && (
        <div className="mt-8 p-6 bg-white shadow-lg rounded-xl">
          <h3 className="text-xl font-bold mb-4">
            Completed Subtopics for {progressData.find(p => p.categoryId === selectedCategory)?.categoryName}
          </h3>
          {subtopicLoading ? (
            <p>Loading subtopics...</p>
          ) : completedSubtopics.length > 0 ? (
            <ul className="list-disc pl-5">
              {completedSubtopics.map(subtopic => (
                <li key={subtopic.id} className="text-lg">{subtopic.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-red-500">No subtopics completed.</p>
          )}
        </div>
      )}

      {/* Achievement Badges */}
      <div className="mt-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-2 gap-6">
          {badges.map(badge => (
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
