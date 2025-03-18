"use client";

import { useState } from "react";

const subjects = ["Math", "Science", "History", "Chemistry", "English", "Geography"];

export default function LearningGoals() {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [goalMessage, setGoalMessage] = useState<string>("");

  const handleSubjectChange = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((item) => item !== subject) : [...prev, subject]
    );
  };

  const handleSubmit = async () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }

    // Predefined message for demonstration purposes
    setGoalMessage("Learning goals saved for your child! Goals include Math, Science, and History.");
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Set Learning Goals for Your Child</h3>
      <p className="mb-4">Select subjects that need more focus:</p>

      <div className="mb-4">
        {subjects.map((subject) => (
          <div key={subject} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={subject}
              name={subject}
              checked={selectedSubjects.includes(subject)}
              onChange={() => handleSubjectChange(subject)}
            />
            <label htmlFor={subject} className="ml-2">{subject}</label>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="px-6 py-2 bg-violet-600 text-white rounded-md">
        Save Learning Goals
      </button>

      {goalMessage && <p className="mt-4 text-green-600">{goalMessage}</p>}
    </div>
  );
}