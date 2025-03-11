"use client";
import { useState, useEffect } from "react";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch("./api/quizzes");
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      }
    }
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (quizStarted && timeRemaining === 0) {
      handleSubmit(); // Auto-submit when timer reaches zero
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining]);

  const handleQuizClick = (quiz: any) => {
    setSelectedQuiz(quiz);
    setShowInstructions(true);
  };

  const startQuiz = () => {
    if (selectedQuiz) {
      setTimeRemaining(selectedQuiz.duration);
      setQuizStarted(true);
      setShowInstructions(false);
      setScore(null);
      setSelectedAnswers({});
    }
  };

  const handleAnswerSelect = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const [totalQuestions, setTotalQuestions] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!selectedQuiz) return;
  
    let calculatedScore = 0;
    selectedQuiz.questions.forEach((question: any) => {
      if (selectedAnswers[question.id] === question.answer) {
        calculatedScore += 1;
      }
    });
  
    setScore(calculatedScore);
    setTotalQuestions(selectedQuiz.questions.length); // Store total questions
    setQuizStarted(false);
    setSelectedQuiz(null); // Reset selected quiz
    setShowInstructions(false);
  };

  return (
    <div>
      {!selectedQuiz && !showInstructions && !quizStarted && score === null && (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center">Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-xl shadow-lg bg-zinc-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleQuizClick(quiz)}
              >
                <h3 className="text-2xl font-semibold text-primary mb-2">{quiz.title}</h3>
                <p className="text-accent">Subject: {quiz.subject}</p>
                <p className="text-accent">Difficulty: {quiz.difficulty}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {showInstructions && selectedQuiz && (
        <div>
          <h2 className="text-xl font-bold mb-2">{selectedQuiz.title}</h2>
          <ul className="mb-4">
            <li>- Read each question carefully.</li>
            <li>- Choose the best answer.</li>
            <li>- You cannot go back to previous questions.</li>
            <li>- Your progress will be automatically saved.</li>
          </ul>
          <p className="font-semibold">
            Duration: {Math.floor(selectedQuiz.duration / 60)} min {selectedQuiz.duration % 60} sec
          </p>
          <button onClick={startQuiz} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Continue
          </button>
        </div>
      )}

      {quizStarted && selectedQuiz && (
        <div>
          <div className="w-full bg-zinc-100 h-4 rounded overflow-hidden mb-4">
            <div
              className="bg-green-500 h-full transition-all duration-1000"
              style={{
                width: `${((selectedQuiz.duration - timeRemaining) / selectedQuiz.duration) * 100}%`,
              }}
            ></div>
          </div>
          <p>Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, "0")}</p>

          <h2 className="text-xl font-bold mt-4">{selectedQuiz.title}</h2>

          {selectedQuiz.questions.map((question: any, index: number) => (
            <div key={index} className="mt-2">
              <p className="font-semibold">{question.text}</p>
              {question.options.map((option: string, i: number) => (
                <div key={i}>
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={option}
                    checked={selectedAnswers[question.id] === option}
                    onChange={() => handleAnswerSelect(question.id, option)}
                  />{" "}
                  {option}
                </div>
              ))}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-6 p-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {score !== null && (
        <div className="text-center">
          <h2 className="text-3xl font-bold">Quiz Completed!</h2>
          <p className="text-xl">Your Score: {score} / {totalQuestions}</p>
          <button
            onClick={() => setScore(null)}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
}
