"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock } from "lucide-react"

interface Goal {
  id: number
  userId: number
  title: string
  subject: string
  description: string
  status: "Not Started" | "In Progress" | "Completed"
  createdAt: string
}

interface Child {
  id: number
  name: string
}

export default function PendingGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchChildDetails() {
      try {
        const response = await fetch("/api/fetch-child-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setChildren(data.children) // Assuming response contains child details
          if (data.children.length > 0) {
            setSelectedChildId(data.children[0].id) // Select first child by default
          }
        } else {
          console.error("Failed to fetch child details")
        }
      } catch (error) {
        console.error("Error fetching child details:", error)
      }
    }

    fetchChildDetails()
  }, [])

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/fetch-goals")
        const data = await response.json()
        setGoals(data)
      } catch (error) {
        console.error("Error fetching goals:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGoals()
  }, [])

  const markAsCompleted = async (id: number) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id ? { ...goal, status: "Completed" } : goal
      )
    )
  }

  if (loading) return <p>Loading...</p>

  const filteredGoals = selectedChildId
    ? goals.filter((goal) => goal.userId === selectedChildId)
    : []

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Learning Goals</h3>

      {/* Child Selection Dropdown */}
      {children.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Child:</label>
          <select
            value={selectedChildId ?? ""}
            onChange={(e) => setSelectedChildId(Number(e.target.value))}
            className="mt-1 p-2 border rounded w-full"
          >
            {children.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {filteredGoals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No goals found for the selected child.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
                goal.status === "Completed"
                  ? "bg-green-50 border-l-4 border-green-500"
                  : "bg-white border-l-4 border-violet-500 hover:shadow-lg"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {goal.status === "Completed" ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Clock className="h-6 w-6 text-violet-500" />
                  )}
                  <div>
                    <h4 className="font-semibold text-lg">{goal.title}</h4>
                    <p className="text-sm text-gray-600">Subject: {goal.subject}</p>
                    <p className="text-sm text-gray-500">Description: {goal.description}</p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(goal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {goal.status !== "Completed" && (
                  <button
                    onClick={() => markAsCompleted(goal.id)}
                    className="px-3 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
