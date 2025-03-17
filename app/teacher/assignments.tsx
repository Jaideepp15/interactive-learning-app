"use client";

import { useState, useEffect } from "react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  openDate: string;
  dueDate: string;
  subject: string;
}

interface StudentSubmission {
  id: number;
  name: string;
  status: string;
  fileUrl: string | null;
}

export default function Assignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studentSubmissions, setStudentSubmissions] = useState<StudentSubmission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [selectedStudentFile, setSelectedStudentFile] = useState<string | null>(null);
  const [teacherSubject, setTeacherSubject] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", dueDate: "" });

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const teacherRes = await fetch("/api/fetch-teacher-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const teacherData = await teacherRes.json();
        setTeacherSubject(teacherData.subject);

        const assignmentRes = await fetch("/api/assignment");
        const assignmentData = await assignmentRes.json();
        const filteredAssignments = assignmentData.filter((a: Assignment) => a.subject === teacherData.subject);
        setAssignments(filteredAssignments);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    }
    fetchAssignments();
  }, []);

  useEffect(() => {
    async function fetchSubmissions() {
      if (!selectedAssignment) return;
      try {
        const response = await fetch(`/api/assignment-submission?assignmentId=${selectedAssignment}`);
        if (!response.ok) throw new Error("Failed to fetch submissions");
        const data: StudentSubmission[] = await response.json();
        setStudentSubmissions(data);
      } catch (error) {
        console.error("Error fetching assignment submissions:", error);
      }
    }
    fetchSubmissions();
  }, [selectedAssignment]);

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate) return;

    try {
      const response = await fetch("/api/create-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newAssignment.title,
          description: newAssignment.description,
          dueDate: newAssignment.dueDate,
          subject: teacherSubject,
          openDate: new Date().toISOString().split("T")[0], // Set today's date as open date
        }),
      });

      if (!response.ok) throw new Error("Failed to create assignment");

      const createdAssignment = await response.json();
      setAssignments([...assignments, createdAssignment]);

      // Reset form
      setNewAssignment({ title: "", description: "", dueDate: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-zinc-800 p-8 pb-2">
      <h1 className="text-3xl font-bold mb-6 text-center">Assignments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="border rounded-md shadow-md p-4 bg-gray-100 cursor-pointer"
            onClick={() => setSelectedAssignment(assignment.id)}
          >
            <h2 className="text-lg font-semibold">{assignment.title}</h2>
            <p className="text-base text-gray-700 mt-1">{assignment.description}</p>
            <p className="text-base text-gray-600 mt-2">Open: {new Date(assignment.openDate).toISOString().split("T")[0]}</p>
            <p className="text-base text-red-600">Due: {new Date(assignment.dueDate).toISOString().split("T")[0]}</p>
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-6 py-2 bg-violet-600 text-white rounded-md shadow-md hover:bg-violet-700"
        onClick={() => setShowForm((prev) => !prev)} // Toggles visibility
      >
        {showForm ? "Cancel" : "+ New Assignment"}
      </button>

      {showForm && (
        <div className="mt-4 w-full max-w-lg p-6 bg-gray-200 rounded-md shadow-md">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 mb-2 border rounded-md"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 mb-2 border rounded-md"
            value={newAssignment.description}
            onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
          />
          <input
            type="date"
            className="w-full p-2 mb-2 border rounded-md"
            value={newAssignment.dueDate}
            onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
          />
          <button
            className="w-full px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
            onClick={handleCreateAssignment}
          >
            Publish Assignment
          </button>
        </div>
      )}

      {selectedAssignment !== null && (
        <div className="mt-6 w-full max-w-lg p-6 bg-gray-100 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Submission Details</h2>

          <p className="text-sm text-green-700 mt-2">Students Submitted:</p>
          <ul className="list-disc list-inside text-sm">
            {studentSubmissions
              .filter((s) => s.status !== "Not Submitted")
              .map((student) => (
                <li
                  key={student.id}
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => setSelectedStudentFile(student.fileUrl || null)}
                >
                  {student.name} {student.status === "Submitted (Late)" ? "(Late)" : ""}
                </li>
              ))}
          </ul>

          <p className="text-sm text-red-700 mt-2">Students Yet to Submit:</p>
          <ul className="list-disc list-inside text-sm">
            {studentSubmissions
              .filter((s) => s.status === "Not Submitted")
              .map((student) => (
                <li key={student.id}>{student.name}</li>
              ))}
          </ul>

          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => setSelectedAssignment(null)}
          >
            Close
          </button>
        </div>
      )}

      {selectedStudentFile && (
        <div className="mt-6 w-full max-w-lg p-6 bg-white rounded-md shadow-md">
          <h2 className="text-lg font-semibold">Submitted File</h2>
          <a href={selectedStudentFile} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View File
          </a>
    <div className="flex justify-end">
      <button className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600" 
          onClick={() => setSelectedStudentFile(null)}>
        Close
      </button>
    </div>
        </div>
      )}
    </div>
  );
}
