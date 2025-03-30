"use client";

import { useState, useEffect } from "react";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/student-details");
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        setStudents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading students...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-zinc-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Students</h1>
      <div className="w-full max-w-2xl">
        {students.map((student: any) => (
          <div key={student.email} className="w-full mb-2">
            <button
              className={`w-full px-4 py-4 border rounded-md shadow-md text-left text-lg ${selectedStudent === student.email ? "bg-violet-600 text-white" : "bg-zinc-200 text-zinc-700 hover:bg-violet-500 hover:text-white"}`}
              onClick={() => setSelectedStudent(selectedStudent === student.email ? null : student.email)}
            >
              {student.name}
            </button>
            {selectedStudent === student.email && (
              <div className="mt-2 p-4 bg-gray-100 rounded-md shadow-md w-full">
                <p><strong>Email:</strong> {student.email}</p>
                <p><strong>Phone:</strong> {student.phone}</p>
                {student.parent ? (
                  <div className="mt-2">
                    <p><strong>Parent Name:</strong> {student.parent.name}</p>
                    <p><strong>Parent Phone:</strong> {student.parent.phone}</p>
                    <p><strong>Parent Email:</strong> {student.parent.email}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-red-500">Parent not registered</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
