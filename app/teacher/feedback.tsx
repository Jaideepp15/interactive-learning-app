"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Send, CheckCircle } from "lucide-react";

interface ParentDetails {
  id: number;
  username: string;
  name: string;
  phone: string;
  email: string;
}

interface Student {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  parent: ParentDetails | null;
}

export default function TeacherFeedback() {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [feedbackTitle, setFeedbackTitle] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [teacherId, setTeacherId] = useState<number | null>(null);

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
          setTeacherId(data.id);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent || !feedbackTitle.trim() || !feedbackText.trim() || rating === 0) {
      alert("Please select a student and provide title, feedback text, and a rating.");
      return;
    }

    setLoading(true);

    const feedbackdata={
      providerId: Number(teacherId), // Replace with the logged-in teacher's ID
      receiverId: Number(selectedStudent),
      title: feedbackTitle,
      text: feedbackText,
      rating: rating,
      providerrole: "teacher",
    };

    try {
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackdata),
      });

      console.log(feedbackdata)
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to send feedback");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedStudent("");
    setFeedbackTitle("");
    setFeedbackText("");
    setRating(0);
    setSubmitted(false);
  };

  console.log("Students",students);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Send Student Feedback</h3>

      {submitted ? (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-green-700 mb-2">Feedback Sent Successfully!</h4>
          <p className="text-gray-600 mb-2">
            Your feedback <strong>"{feedbackTitle}"</strong> has been sent to {students.find((s) => s.id === Number(selectedStudent))?.name}.
          </p>
          <button
            onClick={resetForm}
            className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
          >
            Send Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="" disabled>
                Select a student
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              placeholder="Enter a short title for the feedback..."
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              placeholder="Provide constructive feedback about the student's performance, areas of improvement, and strengths..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Performance Rating</label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    rating >= star ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 bg-violet-600 text-white rounded-md flex items-center space-x-2 transition ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:bg-violet-700"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Feedback</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
