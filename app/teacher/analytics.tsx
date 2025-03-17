"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const [studentsProgress, setStudentsProgress] = useState<
    { id: string; name: string; progress: number; subtopics: string[] }[]
  >([]);
  const [averageProgress, setAverageProgress] = useState<number>(0);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTeacherDetails() {
      try {
        const response = await fetch("/api/fetch-teacher-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("API Response:", data); // Check the full response
          setCategoryId(data.categoryid);
          console.log("Fetched Category ID:", data.categoryid); // Log categoryId here
        } else {
          console.error("Failed to fetch teacher details");
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    }

    fetchTeacherDetails();
  }, []);

  useEffect(() => {
    if (categoryId) {
      console.log("Using Category ID:", categoryId); // Log categoryId when used in API call

      async function fetchProgress() {
        try {
          const response = await fetch(`/api/progress/${categoryId}/teacher-analytics`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (!response.ok) throw new Error(`API request failed with status: ${response.status}`);

          const data = await response.json();

          if (!Array.isArray(data) || data.length === 0) {
            console.warn("No student progress data received.");
            return;
          }

          setStudentsProgress(data);

          const avgProgress = Math.round(
            data.reduce((sum, student) => sum + (student.progress || 0), 0) / data.length
          );
          setAverageProgress(avgProgress);
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
      }

      fetchProgress();
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-zinc-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Analytics</h1>
      <p className="text-lg font-semibold mb-2">Class Average: {averageProgress}%</p>
      <div className="w-64 h-64 flex items-center justify-center relative mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: "Progress", value: averageProgress },
                { name: "Remaining", value: 100 - averageProgress },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={3}
              dataKey="value"
            >
              <Cell key="progress" fill="#4CAF50" />
              <Cell key="remaining" fill="#E0E0E0" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-xl font-bold text-zinc-800">{averageProgress}%</div>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold mb-2">Student Progress</h2>
        <div className="flex flex-col gap-2 w-full">
          {studentsProgress.map((student) => (
            <div key={student.id} className="w-full">
              <button
                className={`w-full px-4 py-4 border rounded-md shadow-md text-left text-lg ${
                  selectedStudent === student.name
                    ? "bg-violet-600 text-white"
                    : "bg-zinc-200 text-zinc-700 hover:bg-violet-500 hover:text-white"
                }`}
                onClick={() =>
                  setSelectedStudent(selectedStudent === student.name ? null : student.name)
                }
              >
                {student.name}
              </button>
              {selectedStudent === student.name && (
                <div className="mt-2 p-6 bg-gray-100 rounded-md shadow-md w-full">
                  <div className="w-40 h-40 mx-auto flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Progress", value: student.progress },
                            { name: "Remaining", value: 100 - student.progress },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          <Cell key="progress" fill="#4CAF50" />
                          <Cell key="remaining" fill="#E0E0E0" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute text-lg font-bold text-zinc-800">
                      {student.progress}%
                    </div>
                  </div>
                  <h4 className="text-md font-medium mt-2">Completed Subtopics:</h4>
                  <ul className="list-disc list-inside text-sm">
                    {student.subtopics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
