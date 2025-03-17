"use client";

import { useState, useEffect } from "react";

interface Question {
  text: string;
  options: string[];
  answer: string;
}

interface Quiz {
  id: number;
  title: string;
  subject: string;
  difficulty: string;
  timeLimit: number;
  questions: Question[];
  studentScores: { name: string; score?: number }[];
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [viewMode, setViewMode] = useState<"questions" | "scores" | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState({ title: "", difficulty: "", timeLimit: 10, questions: [] as any[] });
  const [newQuestion, setNewQuestion] = useState({ text: "", options: ["", "", "", ""], answer: "" });
  const [teacherSubject, setTeacherSubject] = useState<string>("");
  const [studentScores, setStudentScores] = useState<{ name: string; score?: number | string }[]>([]);

  useEffect(() => {
    async function fetchTeacherAndQuizzes() {
      try {
        const teacherRes = await fetch("/api/fetch-teacher-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const teacherData = await teacherRes.json();
        setTeacherSubject(teacherData.subject);

        const quizzesRes = await fetch("/api/quizzes");
        const quizzesData = await quizzesRes.json();
        const filteredQuizzes = quizzesData.filter((q: Quiz) => q.subject === teacherData.subject);
        setQuizzes(filteredQuizzes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchTeacherAndQuizzes();
  }, []);

  const fetchScores = async (quizId: number) => {
    try {
      const response = await fetch(`./api/fetch-quiz-score?quizId=${quizId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch scores");
      }
      const scoresData = await response.json();
      setStudentScores(scoresData.map((data : any) => ({ name: data.studentName, score: data.score })));
    } catch (error) {
      console.error("Error fetching student scores:", error);
    }
  };

  const addQuestion = () => {
    setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, newQuestion] });
    setNewQuestion({ text: "", options: ["", "", "", ""], answer: "" });
  };

  const saveQuiz = async () => {
    const quizData = {
      title: newQuiz.title,
      subject: teacherSubject, // Use the teacher's subject
      difficulty: newQuiz.difficulty,
      duration: newQuiz.timeLimit,
      questions: newQuiz.questions,
    };
  
    try {
      const response = await fetch("./api/create-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }
  
      // Fetch updated quizzes
      const updatedQuizzesRes = await fetch("./api/quizzes");
      const updatedQuizzes = await updatedQuizzesRes.json();
  
      // Filter quizzes by the teacher's subject
      const filteredQuizzes = updatedQuizzes.filter((q: Quiz) => q.subject === teacherSubject);
      setQuizzes(filteredQuizzes);
      setShowForm(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center bg-white text-zinc-800 p-8 pb-2">
      <h1 className="text-3xl font-bold mb-6 text-center">Quizzes</h1>
      {!selectedQuiz ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="border rounded-md shadow-md p-4 bg-gray-100 cursor-pointer"
                onClick={() => setSelectedQuiz(quiz)}
              >
                <h2 className="text-lg font-semibold">{quiz.title}</h2>
                <p className="text-sm text-gray-700">Subject: {quiz.subject}</p>
                <p className="text-sm text-gray-600">Difficulty: {quiz.difficulty}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 px-6 py-2 bg-violet-600 text-white rounded-md shadow-md hover:bg-violet-700" onClick={() => setShowForm(true)}>+ New Quiz</button>
          {showForm && (
            <div className="p-6 bg-gray-200 rounded-md shadow-md mt-4">
              <h2 className="text-xl font-bold">Create New Quiz</h2>
              <input type="text" placeholder="Title" className="block border p-2 w-full mt-2" value={newQuiz.title} onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })} />
              <select className="block border p-2 w-full mt-2" value={newQuiz.difficulty} onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}>
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <input type="number" placeholder="Time Limit (minutes)" className="block border p-2 w-full mt-2" value={newQuiz.timeLimit} onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: Number(e.target.value) })} />
              <h3 className="text-lg font-semibold mt-4">Add Questions</h3>
              <input type="text" placeholder="Question" className="block border p-2 w-full mt-2" value={newQuestion.text} onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })} />
              {newQuestion.options.map((opt, index) => (
                <input key={index} type="text" placeholder={`Option ${index + 1}`} className="block border p-2 w-full mt-2" value={opt} onChange={(e) => {
                  const updatedOptions = [...newQuestion.options];
                  updatedOptions[index] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: updatedOptions });
                }} />
              ))}
              <input type="text" placeholder="Correct Answer" className="block border p-2 w-full mt-2" value={newQuestion.answer} onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })} />
              <button onClick={addQuestion} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Add Question</button>
              <button onClick={saveQuiz} className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save Quiz</button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full max-w-3xl p-6 bg-gray-200 rounded-md shadow-md">
          <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
          <p className="text-sm text-gray-700">Time Limit: {selectedQuiz.timeLimit} mins</p>
          <div className="flex gap-4 mt-4">
            <button className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700" onClick={() => setViewMode("questions")}>View Questions</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" onClick={() => {setViewMode("scores");fetchScores(selectedQuiz.id);}}>View Scores</button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => { setSelectedQuiz(null); setViewMode(null); }}>Back</button>
          </div>

          {viewMode === "questions" && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Quiz Questions</h3>
              {selectedQuiz.questions.map((q, index) => (
                <div key={index} className="mb-4 p-4 bg-white rounded-md shadow-md">
                  <p className="font-medium">{index + 1}. {q.text}</p>
                  <ul className="list-disc pl-5 mt-2">
                    {q.options.map((opt, optIndex) => (
                      <li key={optIndex} className="text-gray-700">{opt}</li>
                    ))}
                  </ul>
                  <p className="mt-2 text-green-600">Answer: {q.answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

{viewMode === "scores" && (
  <div className="mt-6">
    <h3 className="text-lg font-semibold mb-4">Student Scores</h3>
    {studentScores.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentScores.map((s, index) => {
          let scoreColor = "text-gray-700"; 
          if (typeof s.score === "number") {
            scoreColor = s.score >= 75 ? "text-green-600" : s.score >= 50 ? "text-orange-500" : "text-red-600";
          }
          return (
            <div key={index} className="p-4 bg-white rounded-md shadow-md border border-gray-300">
              <p className="font-medium">{s.name}</p>
              <p className={`mt-2 ${scoreColor}`}>
                {s.score !== "Not Attempted" ? `${s.score}%` : "Not Attempted"}
              </p>
            </div>
          );
        })}
      </div>
    ) : (
      <p className="text-gray-600">No scores available for this quiz yet.</p>
    )}
  </div>
)}

    </div>
  );
}
