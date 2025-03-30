"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock } from "lucide-react";

interface Goal {
  id: number;
  userId: number;
  title: string;
  subject: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  createdAt: string;
}

const CATEGORY_MAPPING: Record<string, number> = {
  Math: 1,
  Science: 2,
  History: 3,
};

export default function LearningGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [completedSubtopics, setCompletedSubtopics] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch("/api/fetch-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setUserId(data.userId);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserDetails();
  }, []);

  useEffect(() => {
    async function fetchGoals() {
      try {
        const response = await fetch("/api/fetch-goals");
        if (!response.ok) throw new Error("Failed to fetch goals");
        const data: Goal[] = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    }

    async function fetchCompletedSubtopics() {
        const updatedSubtopics: Record<number, string[]> = {};
      
        await Promise.all(
          Object.entries(CATEGORY_MAPPING).map(async ([_, categoryId]) => {
            try {
              const response = await fetch(`/api/progress/${categoryId}/subtopics`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              });
      
              if (!response.ok) throw new Error(`Failed to fetch subtopics for category ${categoryId}`);
      
              const data: { id: number; name: string }[] = await response.json(); // Correctly typing response
              updatedSubtopics[categoryId] = data.map((subtopic) => subtopic.name); // Extract only names
      
            } catch (error) {
              console.error(`Error fetching completed subtopics for category ${categoryId}:`, error);
            }
          })
        );
      
        console.log("UPDATED:", updatedSubtopics);
        setCompletedSubtopics({ ...updatedSubtopics });
      }      

    fetchGoals();
    fetchCompletedSubtopics();
  }, []);

  function checkIfGoalCompleted(description: string, subject: string) {
  
    const subtopics = description.split(",").map((s) => s.trim()); // Split and trim subtopics
  
    const categoryId = CATEGORY_MAPPING[subject];
  
    if (!categoryId) {
      return false;
    }
  
    const completedList = completedSubtopics[categoryId];
    console.log(completedList);
  
    if (!completedList || completedList.length === 0) {
      return false;
    }
  
    const allCompleted = subtopics.every((subtopic) => completedList.includes(subtopic));
  
    return allCompleted;
  }  

  const filteredGoals = userId
  ? goals.map((goal) => ({ ...goal, completed: checkIfGoalCompleted(goal.description, goal.subject) }))
      .filter((goal) => goal.userId === userId)
  : [];

  useEffect(() => {
    async function updateGoalStatus(goalId: number) {
      try {
        await fetch(`/api/update-goal/${goalId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: "Completed" }),
        });
      } catch (error) {
        console.error(`Error updating goal ${goalId} status:`, error);
      }
    }
  
    filteredGoals.forEach((goal) => {
      if (goal.completed && goal.status !== "Completed") {
        updateGoalStatus(goal.id);
      }
    });
  }, [filteredGoals]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold flex items-center mb-6">
        <CheckCircle className="mr-2 text-violet-600" /> Learning Goals
      </h2>
      {filteredGoals.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">No learning goals found</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className={`px-4 py-3 rounded-lg shadow-md border-l-4 transition-all ${
                goal.completed ? "border-green-500 bg-green-100" : "border-violet-300 bg-white"
              }`}
            >
              <h3 className="font-semibold text-lg">{goal.title}</h3>
              <p className="text-gray-600 text-sm">{goal.description || "No subtopics"}</p>
              <p
                className={`mt-2 font-semibold ${
                  goal.completed ? "text-green-600" : "text-violet-600"
                }`}
              >
                {goal.completed ? "Completed" : "In Progress"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}