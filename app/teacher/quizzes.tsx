"use client";

import { useState } from "react";

interface Question {
  question: string;
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

const teacherSubject = "Mathematics";

const initialQuizzes: Quiz[] = [
  {
    id: 1,
    title: "Algebra Basics",
    subject: "Mathematics",
    difficulty: "Medium",
    timeLimit: 30,
    questions: [
      { question: "Solve for x: 2x + 3 = 7", options: ["x = 2", "x = 3", "x = 4"], answer: "x = 2" },
      { question: "Factorize x^2 - 4", options: ["(x - 2)(x + 2)", "(x - 4)(x + 1)", "x(x - 4)"], answer: "(x - 2)(x + 2)" },
    ],
    studentScores: [
      { name: "Alice", score: 85 },
      { name: "Bob", score: 92 },
      { name: "Charlie" },
    ],
  },
  {
    id: 2,
    title: "Probability Theory",
    subject: "Mathematics",
    difficulty: "Hard",
    timeLimit: 45,
    questions: [
      { question: "What is the probability of rolling a 6 on a fair die?", options: ["1/6", "1/3", "1/2"], answer: "1/6" },
    ],
    studentScores: [
      { name: "Alice", score: 78 },
      { name: "Bob" },
      { name: "Charlie", score: 88 },
    ],
  },
];

export default function Quizzes() {
    const [quizzes, setQuizzes] = useState(initialQuizzes.filter(q => q.subject === teacherSubject));
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [viewMode, setViewMode] = useState<"questions" | "scores" | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newQuiz, setNewQuiz] = useState({ title: "", difficulty: "", timeLimit: 10, questions: [] as any[] });
    const [newQuestion, setNewQuestion] = useState({ question: "", options: ["", "", "", ""], answer: "" });
  
    const addQuestion = () => {
      setNewQuiz({ ...newQuiz, questions: [...newQuiz.questions, newQuestion] });
      setNewQuestion({ question: "", options: ["", "", "", ""], answer: "" });
    };
  
    const saveQuiz = () => {
      setQuizzes([...quizzes, { ...newQuiz, id: quizzes.length + 1, subject: teacherSubject ,studentScores:[{ name: "Alice"},{ name: "Bob"},{ name: "Charlie"},]}]);
      setShowForm(false);
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
          <button
            className="mt-6 px-6 py-2 bg-violet-600 text-white rounded-md shadow-md hover:bg-violet-700"
            onClick={() => setShowForm(true)}
          >
            + New Quiz
          </button>
          {showForm && (
            <div className="p-6 bg-gray-200 rounded-md shadow-md mt-4">
              <h2 className="text-xl font-bold">Create New Quiz</h2>
              <input
                type="text"
                placeholder="Title"
                className="block border p-2 w-full mt-2"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
              />
              <select
                className="block border p-2 w-full mt-2"
                value={newQuiz.difficulty}
                onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <input
                type="number"
                placeholder="Time Limit (minutes)"
                className="block border p-2 w-full mt-2"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: Number(e.target.value) })}
              />
              <h3 className="text-lg font-semibold mt-4">Add Questions</h3>
              <input
                type="text"
                placeholder="Question"
                className="block border p-2 w-full mt-2"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
              />
              {newQuestion.options.map((opt, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  className="block border p-2 w-full mt-2"
                  value={opt}
                  onChange={(e) => {
                    const updatedOptions = [...newQuestion.options];
                    updatedOptions[index] = e.target.value;
                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                  }}
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                className="block border p-2 w-full mt-2"
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
              />
              <button onClick={addQuestion} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                + Add Question
              </button>
              <button onClick={saveQuiz} className="mt-4 ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Save Quiz
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full max-w-3xl p-6 bg-gray-200 rounded-md shadow-md">
          <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
          <p className="text-sm text-gray-700">Time Limit: {selectedQuiz.timeLimit} mins</p>
          <div className="flex gap-4 mt-4">
            <button
              className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
              onClick={() => setViewMode("questions")}
            >
              View Questions
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => setViewMode("scores")}
            >
              View Scores
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={() => setSelectedQuiz(null)}
            >
              Back
            </button>
          </div>
          {viewMode === "questions" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Questions & Answers:</h3>
              <ul>
                {selectedQuiz.questions.map((q, index) => (
                  <li key={index} className="mt-2">
                    <p className="font-medium">Q: {q.question}</p>
                    <ul className="list-disc pl-4">
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                    <p className="text-gray-700">Answer: {q.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {viewMode === "scores" && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Student Scores:</h3>
              <ul>
                {selectedQuiz.studentScores.map((s, index) => (
                  <li key={index} className="mt-2">
                    <p>{s.name}: {s.score !== undefined ? `${s.score}%` : "Not Attempted"}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}