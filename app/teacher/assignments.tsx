"use client";

import { useState } from "react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  openDate: string;
  dueDate: string;
  subject: string;
}

interface StudentSubmission {
  assignmentId: number;
  submitted: string[];
  notSubmitted: string[];
}

const initialAssignments: Assignment[] = [
  { id: 1, title: "Math Homework", description: "Solve 10 algebra problems.", openDate: "2025-03-10", dueDate: "2025-03-15", subject: "Mathematics" },
  { id: 2, title: "Science Project", description: "Prepare a model on solar energy.", openDate: "2025-03-12", dueDate: "2025-03-20", subject: "Science" },
  { id: 3, title: "History Essay", description: "Write an essay on World War II.", openDate: "2025-03-08", dueDate: "2025-03-14", subject: "History" },
  { id: 4, title: "English Literature", description: "Analyze a Shakespearean play.", openDate: "2025-03-11", dueDate: "2025-03-18", subject: "English" },
];

const teacherSubject = "Mathematics"; // John Doe's subject
const filteredAssignments = initialAssignments.filter(a => a.subject === teacherSubject);

const studentSubmissions: StudentSubmission[] = [
  { assignmentId: 1, submitted: ["Alice", "Bob"], notSubmitted: ["Charlie", "David"] },
  { assignmentId: 2, submitted: ["Charlie"], notSubmitted: ["Alice", "Bob", "David"] },
  { assignmentId: 3, submitted: ["David", "Alice"], notSubmitted: ["Bob", "Charlie"] },
  { assignmentId: 4, submitted: [], notSubmitted: ["Alice", "Bob", "Charlie", "David"] },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [newAssignment, setNewAssignment] = useState({ title: "", description: "", dueDate: "" });
  const [showForm, setShowForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);

  // Filter assignments based on teacher's subject
  const filteredAssignments = assignments.filter((assignment) => assignment.subject === teacherSubject);

  const handleCreateAssignment = () => {
    if (!newAssignment.title || !newAssignment.description || !newAssignment.dueDate) return;
    const newId = assignments.length + 1;
    setAssignments([...assignments, { id: newId, ...newAssignment, openDate: new Date().toISOString().split("T")[0], subject: teacherSubject }]);
    setNewAssignment({ title: "", description: "", dueDate: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-zinc-800 p-8 pb-2">
      <h1 className="text-3xl font-bold mb-6 text-center">Assignments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="border rounded-md shadow-md p-4 bg-gray-100 cursor-pointer"
            onClick={() => setSelectedAssignment(assignment.id)}
          >
            <h2 className="text-lg font-semibold">{assignment.title}</h2>
            <p className="text-sm text-gray-700 mt-1">{assignment.description}</p>
            <p className="text-sm text-gray-600 mt-2">Open: {assignment.openDate}</p>
            <p className="text-sm text-red-600">Due: {assignment.dueDate}</p>
          </div>
        ))}
      </div>
      <button
        className="mt-6 px-6 py-2 bg-violet-600 text-white rounded-md shadow-md hover:bg-violet-700"
        onClick={() => setShowForm(true)}
      >
        + New Assignment
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
            {studentSubmissions.find((s) => s.assignmentId === selectedAssignment)?.submitted.map((student) => (
              <li key={student}>{student}</li>
            )) || <p>None</p>}
          </ul>
          <p className="text-sm text-red-700 mt-2">Students Yet to Submit:</p>
          <ul className="list-disc list-inside text-sm">
            {studentSubmissions.find((s) => s.assignmentId === selectedAssignment)?.notSubmitted.map((student) => (
              <li key={student}>{student}</li>
            )) || <p>None</p>}
          </ul>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => setSelectedAssignment(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
