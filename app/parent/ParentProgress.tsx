import React, { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { FaTasks, FaClipboardList } from "react-icons/fa";

interface Subtopic {
  subtopic: string;
  category: string;
}

interface QuizScore {
  quizTitle: string;
  score: number;
}

interface Child {
  name: string;
  completedSubtopics: Subtopic[];
  completedAssignments: string[];
  quizScores: QuizScore[];
}

interface CategoryData {
  name: string;
  value: number;
}

const ParentProgress: React.FC = () => {
  const categoryIds: Record<string, number> = {
    Math: 1,
    Science: 2,
    History: 3,
  };

  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [view, setView] = useState<string>("overall");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allSubtopics, setAllSubtopics] = useState<Record<string, string[]>>({});
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState<string[]>([]);

  useEffect(() => {
    async function fetchChildDetails() {
      try {
        const response = await fetch("/api/fetch-child-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setChildrenData(data.children);
          setSelectedChild(data.children[0] || null);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

    fetchChildDetails();
  }, []);

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
      setAllSubtopics(fetchedSubtopics);
    }

    fetchSubtopics();
  }, []);

  useEffect(() => {
    // Fetch the assignment data from the API
    const fetchAssignments = async () => {
      const response = await fetch('/api/assignment');
      const data = await response.json();
      
      // Set the fetched assignment titles
      setAssignments(data.map((assignment:any) => assignment.title));
    };

    fetchAssignments();
  }, []);

  useEffect(() => {
    // Fetch quizzes from the API
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('/api/fetch-quizzes');
        if (!response.ok) {
          throw new Error('Error fetching quizzes');
        }
        const data = await response.json();

        // Map over the fetched quizzes to get only the titles
        const quizTitles = data.map((quiz: { title: string }) => quiz.title);

        // Set the titles to the state
        setQuizzes(quizTitles);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizzes();
  }, []);

  if (!selectedChild) return <p>Loading...</p>;

  const getCategoryData = (category: string): CategoryData[] => {
    const total = allSubtopics[category]?.length || 0;
    const completed = selectedChild.completedSubtopics.filter(sub => sub.category === category).length;
    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: total - completed }
    ];
  };

  const getOverallData = (): CategoryData[] => {
    const total = Object.values(allSubtopics).flat().length;
    const completed = selectedChild.completedSubtopics.length;
    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: total - completed }
    ];
  };

  
  const completedAssignmentstitle = selectedChild.completedAssignments.map((assignment:any) => assignment.title);

  const nonAttemptedQuizzes = quizzes.filter(q => !selectedChild.quizScores.some(s => s.quizTitle === q));
  const pendingAssignments = assignments.filter(a => !completedAssignmentstitle.includes(a));

  const COLORS = ["#0088FE", "#FF8042"];
  const categories = Object.keys(allSubtopics);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Parent Progress Dashboard</h1>

      <label className="text-lg font-semibold">Select Student: </label>
      <select
        className="border p-2 rounded-md ml-2"
        onChange={(e) => setSelectedChild(childrenData.find(child => child.name === e.target.value) || null)}
        value={selectedChild.name}
      >
        {childrenData.map((child, index) => (
          <option key={index} value={child.name}>{child.name}</option>
        ))}
      </select>

      {view === "overall" && (
        <div className="flex flex-col items-center mt-6">
          <h3 className="text-lg font-semibold">Overall Progress</h3>
          <PieChart width={300} height={300}>
            <Pie data={getOverallData()} cx={150} cy={150} outerRadius={100} fill="#8884d8" dataKey="value" onClick={() => setView("categories")}>
              {getOverallData().map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <p className="text-center text-sm text-gray-500">Click to view category-wise progress</p>
        </div>
      )}

{view === "categories" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {categories.map((category, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => { setView("subtopics"); setSelectedCategory(category); }}>
              <h3 className="text-lg font-semibold">{category} Progress</h3>
              <PieChart width={250} height={250}>
                <Pie data={getCategoryData(category)} cx={125} cy={125} outerRadius={80} fill="#8884d8" dataKey="value">
                  {getCategoryData(category).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
              <p className="text-center text-sm text-gray-500">Click to view completed subtopics</p>
            </div>
          ))}
        </div>
      )}

      {view === "subtopics" && (
        <div className="mt-6">
          <button className="mb-4 text-blue-500 hover:underline" onClick={() => setView("categories")}>← Back to Categories</button>
          <h3 className="text-lg font-semibold">Completed Subtopics in {selectedCategory}</h3>
          <ul className="list-disc pl-5">
            {selectedChild.completedSubtopics.filter(sub => sub.category === selectedCategory).map((sub, i) => <li key={i}>{sub.subtopic}</li>)}
          </ul>
        </div>
      )}

<div className="mt-8 flex justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">Quiz Scores</h3>
          <BarChart width={600} height={300} data={selectedChild.quizScores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="quizTitle" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      {/* Pending Assignments & Quizzes */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold flex items-center"><FaTasks className="mr-2 text-red-500" /> Pending Assignments</h3>
          <ul className="list-disc pl-5 text-red-600 mt-2">
            {pendingAssignments.length > 0 ? pendingAssignments.map((assignment, i) => <li key={i}>{assignment}</li>) : <p>All assignments completed! 🎉</p>}
          </ul>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold flex items-center"><FaClipboardList className="mr-2 text-blue-500" /> Pending Quizzes</h3>
          <ul className="list-disc pl-5 text-blue-600 mt-2">
            {nonAttemptedQuizzes.length > 0 ? nonAttemptedQuizzes.map((quiz, i) => <li key={i}>{quiz}</li>) : <p>All quizzes attempted! ✅</p>}
          </ul>
        </div>
      </div>
    </div>

  );
};

export default ParentProgress;
