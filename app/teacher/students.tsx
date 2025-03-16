"use client";

import { useState } from "react";

const students = [
  { 
    name: "Alice Johnson", 
    email: "alice@example.com", 
    phone: "9876543210", 
    parent: { name: "Robert Johnson", phone: "9123456789", email: "robert@example.com" } 
  },
  { 
    name: "Bob Smith", 
    email: "bob@example.com", 
    phone: "9871234567", 
    parent: null 
  },
  { 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    phone: "7894561230", 
    parent: { name: "Linda Brown", phone: "9543217890", email: "linda@example.com" } 
  },
  { 
    name: "David White", 
    email: "david@example.com", 
    phone: "9658741230", 
    parent: null 
  }
];

export default function Students() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-zinc-800 p-8">
      <h1 className="text-3xl font-bold mb-4">Students</h1>
      <div className="w-full max-w-2xl">
        {students.map((student) => (
          <div key={student.name} className="w-full mb-2">
            <button
              className={`w-full px-4 py-4 border rounded-md shadow-md text-left text-lg ${selectedStudent === student.name ? "bg-violet-600 text-white" : "bg-zinc-200 text-zinc-700 hover:bg-violet-500 hover:text-white"}`}
              onClick={() => setSelectedStudent(selectedStudent === student.name ? null : student.name)}
            >
              {student.name}
            </button>
            {selectedStudent === student.name && (
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
