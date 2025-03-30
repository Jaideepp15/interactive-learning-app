"use client";

import { useState, useEffect } from "react";

const subjects = ["Math", "Science", "History"];

export default function LearningGoals() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [completedSubtopics, setCompletedSubtopics] = useState<any[]>([]);
  const [allSubtopics, setAllSubtopics] = useState<Record<string, string[]>>({});
  const [pendingSubtopics, setPendingSubtopics] = useState<Record<string, any[]>>({});
  const [goalMessage, setGoalMessage] = useState<string>("");
  const [visibleSubtopics, setVisibleSubtopics] = useState<Record<string, boolean>>({});
  const [selectedSubtopics, setSelectedSubtopics] = useState<Record<string, string[]>>({});  // Track selected subtopics

  const categoryIds: Record<string, number> = {
    Math: 1,
    Science: 2,
    History: 3,
  };

  // Fetch children details once the component mounts
  useEffect(() => {
    async function fetchChildDetails() {
      try {
        const response = await fetch("/api/fetch-child-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChildren(data.children); // Assuming the response contains child details
        } else {
          console.error("Failed to fetch child details");
        }
      } catch (error) {
        console.error("Error fetching child details:", error);
      }
    }

    fetchChildDetails();
  }, []);

  // Fetch all subtopics when the selected child changes
  useEffect(() => {
    async function fetchSubtopics() {
      const fetchedSubtopics: Record<string, string[]> = {};
      for (const [category, id] of Object.entries(categoryIds)) {
        try {
          const response = await fetch(`/api/progress/${id}/fetch-subtopics`);
          if (!response.ok) {
            console.error(`Failed to fetch subtopics for ${category}`);
            continue;
          }
          const data: string[] = await response.json();
          fetchedSubtopics[category] = data;
        } catch (error) {
          console.error(`Error fetching subtopics for ${category}:`, error);
        }
      }
      setAllSubtopics(fetchedSubtopics); // Update all subtopics first
  
      if (selectedChild) {
        const child = children.find((child) => Number(child.id) === Number(selectedChild));
        if (child) {
          setCompletedSubtopics(child.completedSubtopics.map((entry:any) => entry.subtopic) || []);
        }
      }
    }
  
    if (selectedChild) {
      fetchSubtopics();
    }
  }, [selectedChild, children]);  

  // Handle showing or hiding subtopics when subject button is clicked
  const handleSubjectChange = (subject: string) => {

    if (selectedChild && allSubtopics[subject]) {
        // Filter out completed subtopics
        const filteredPendingSubtopics = allSubtopics[subject].filter(
            (subtopic) => !completedSubtopics.includes(subtopic)
        );

        setPendingSubtopics((prevState) => ({
            ...prevState,
            [subject]: filteredPendingSubtopics,
        }));

        // Toggle visibility for the selected subject
        setVisibleSubtopics((prevState) => ({
            ...prevState,
            [subject]: !prevState[subject], // If visible, hide it; if hidden, show it
        }));
    }
};


  // Handle subtopic selection
  const handleSubtopicSelection = (subject: string, subtopic: string) => {
    setSelectedSubtopics((prevState) => {
      const currentSelected = prevState[subject] || [];
      if (currentSelected.includes(subtopic)) {
        // Deselect subtopic
        return {
          ...prevState,
          [subject]: currentSelected.filter((item) => item !== subtopic),
        };
      } else {
        // Select subtopic
        return {
          ...prevState,
          [subject]: [...currentSelected, subtopic],
        };
      }
    });
  };

  // Handle form submission to save learning goals
  const handleSubmit = async () => {
    if (!selectedChild) {
      alert('Please select a child.');
      return;
    }
  
    // Collect the selected subtopics for the learning goals
    const selectedGoals = Object.keys(selectedSubtopics)
  .filter((subject) => selectedSubtopics[subject].length > 0)
  .map((subject) => ({
    subject,
    subtopics: selectedSubtopics[subject], // Only selected subtopics
  }));
  
    if (selectedGoals.length === 0) {
      alert('Please select at least one subject to set goals.');
      return;
    }
  
    try {
      const response = await fetch('/api/save-learning-goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          childId: Number(selectedChild),
          goals: selectedGoals,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setGoalMessage(data.message); // Display success message
      } else {
        setGoalMessage(data.error); // Display error message
      }
    } catch (error) {
      console.error('Error saving learning goals:', error);
      setGoalMessage('Failed to save learning goals');
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-4">Set Learning Goals for Your Child</h3>

      {/* Select Child */}
      <div className="mb-4">
        <label className="block mb-2">Select Child:</label>
        <select
          value={selectedChild || ""}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="" disabled>
            Select a child
          </option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Pending Subtopics for Learning Goals */}
      {selectedChild && Object.keys(allSubtopics).length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Pending Subtopics</h4>
          {subjects.map((subject) => (
            <div key={subject} className="mb-4">
              <h5 className="font-semibold">{subject}</h5>
              <button
                onClick={() => handleSubjectChange(subject)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md mb-2"
              >
                {visibleSubtopics[subject] ? "Hide" : "Show"} Pending Subtopics for {subject}
              </button>

              {/* Show or hide the subtopics for the selected subject */}
              {visibleSubtopics[subject] && pendingSubtopics[subject] && pendingSubtopics[subject].length > 0 ? (
                pendingSubtopics[subject].map((subtopic, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={subtopic}
                      name={subtopic}
                      onChange={() => handleSubtopicSelection(subject, subtopic)}
                    />
                    <label htmlFor={subtopic} className="ml-2">
                      {subtopic}
                    </label>
                  </div>
                ))
              ) : visibleSubtopics[subject] ? (
                <p>No pending subtopics for {subject}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* Save Learning Goals */}
      <button onClick={handleSubmit} className="px-6 py-2 bg-violet-600 text-white rounded-md">
        Save Learning Goals
      </button>

      {goalMessage && <p className="mt-4 text-green-600">{goalMessage}</p>}
    </div>
  );
}
