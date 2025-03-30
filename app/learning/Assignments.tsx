"use client";

import { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

interface Assignment {
    id: number;
    title: string;
    description: string;
    openDate: string;
    dueDate: string;
    subject: string;
}

interface CompletedAssignment {
    id: number;
    assignmentId: number;
    userId: number;
    fileUrl: string;
    submissionDate: string; // Added submission date field
}

export default function Assignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [completedAssignments, setCompletedAssignments] = useState<CompletedAssignment[]>([]);
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch assignments
                const assignmentsRes = await fetch("/api/assignment");
                if (!assignmentsRes.ok) throw new Error("Failed to fetch assignments");
                const assignmentsData: Assignment[] = await assignmentsRes.json();
                setAssignments(assignmentsData);

                // Fetch user ID
                const userRes = await fetch("/api/fetch-details", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (!userRes.ok) throw new Error("Failed to fetch user");
                const userData = await userRes.json();
                console.log("Fetched User Data:", userData);
                setUserId(userData.userId);

                // Fetch completed assignments
                const completedRes = await fetch(`/api/completed-assignment?userId=${userData.userId}`);
                if (!completedRes.ok) throw new Error("Failed to fetch completed assignments");
                const completedData: CompletedAssignment[] = await completedRes.json();
                setCompletedAssignments(completedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !selectedAssignment || !userId) return;

        const file = event.target.files[0];
        setUploadedFile(file);

        // Upload file to the server
        const formData = new FormData();
        formData.append("file", file);
        formData.append("assignmentId", selectedAssignment.id.toString());
        formData.append("userId", userId.toString());

        try {
            const response = await fetch("/api/upload-assignment", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("File upload failed");

            const uploadedData: CompletedAssignment = await response.json();
            setCompletedAssignments([...completedAssignments, uploadedData]);
        } catch (error) {
            console.error("File upload error:", error);
        }
    };

    return (
        <div className="p-6">
            {!selectedAssignment ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map((assignment) => {
                        const completed = completedAssignments.find(
                            (completed) => completed.assignmentId === assignment.id
                        );
                        const isLate = completed
                            ? new Date(completed.submissionDate) > new Date(assignment.dueDate)
                            : false;

                        return (
                            <div
                                key={assignment.id}
                                className="p-6 rounded-xl shadow-lg bg-zinc-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                                onClick={() => setSelectedAssignment(assignment)}
                            >
                                <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                                <p className="text-base text-gray-700 mt-2">{assignment.description}</p>
                                <p className="text-base text-red-700 mt-1 font-medium">
                                    Due: {new Date(assignment.dueDate).toISOString().split("T")[0]}
                                </p>
                                {completed && (
                                    <p className="text-sm text-green-600 mt-2">
                                        ✔ Submitted {isLate ? "(Late)" : ""}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800">{selectedAssignment.title}</h2>
                    <p className="text-base text-gray-700 mt-2">{selectedAssignment.description}</p>
                    <p className="text-base text-red-700 mt-1 font-medium">
                        Due: {new Date(selectedAssignment.dueDate).toISOString().split("T")[0]}
                    </p>
                    <b className="text-base text-black-700 mt-2">SUBMIT .txt FILES ONLY</b>

                    {completedAssignments.some((c) => c.assignmentId === selectedAssignment.id) ? (
                        // Show uploaded file if the assignment is already completed
                        <div className="mt-4">
                            <p className="text-green-600 font-medium">
                                Assignment Submitted{" "}
                                {new Date(
                                    completedAssignments.find((c) => c.assignmentId === selectedAssignment.id)!
                                        .submissionDate
                                ) > new Date(selectedAssignment.dueDate)
                                    ? "(Late)"
                                    : ""}
                            </p>
                            <a
                                href={
                                    completedAssignments.find((c) => c.assignmentId === selectedAssignment.id)?.fileUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                View Submitted File
                            </a>
                        </div>
                    ) : (
                        // Show upload button if the assignment is not completed
                        <label className="mt-4 block cursor-pointer text-gray-600 font-semibold flex items-center gap-2">
                            <UploadCloud className="w-5 h-5" /> Upload Submission
                            <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                    )}

                    <button
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => setSelectedAssignment(null)}
                    >
                        Back to Assignments
                    </button>
                </div>
            )}
        </div>
    );
}
