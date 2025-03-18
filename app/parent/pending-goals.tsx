"use client"

import { useState } from "react"
import { CheckCircle, Clock } from "lucide-react"

interface Goal {
  subject: string
  status: "pending" | "completed"
  dueDate: string
}

export default function PendingGoals() {
  // Mock data for pending goals based on selected subjects
  const [goals, setGoals] = useState<Goal[]>([
    { subject: "Math", status: "pending", dueDate: "2025-04-15" },
    { subject: "Science", status: "pending", dueDate: "2025-04-20" },
    { subject: "History", status: "completed", dueDate: "2025-04-10" },
    { subject: "English", status: "pending", dueDate: "2025-04-25" },
  ])

  const markAsCompleted = (index: number) => {
    const updatedGoals = [...goals]
    updatedGoals[index].status = "completed"
    setGoals(updatedGoals)
  }

  // Calculate days remaining
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Pending Learning Goals</h3>

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pending goals found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const daysRemaining = getDaysRemaining(goal.dueDate)

            return (
              <div
                key={index}
                className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
                  goal.status === "completed"
                    ? "bg-green-50 border-l-4 border-green-500"
                    : "bg-white border-l-4 border-violet-500 hover:shadow-lg"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {goal.status === "completed" ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Clock className="h-6 w-6 text-violet-500" />
                    )}
                    <div>
                      <h4 className="font-semibold text-lg">{goal.subject}</h4>
                      <p className="text-sm text-gray-600">
                        Due: {new Date(goal.dueDate).toLocaleDateString()}
                        {goal.status === "pending" && daysRemaining > 0 && (
                          <span className={`ml-2 ${daysRemaining <= 3 ? "text-red-500" : "text-gray-500"}`}>
                            ({daysRemaining} days remaining)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {goal.status === "pending" && (
                    <button
                      onClick={() => markAsCompleted(index)}
                      className="px-3 py-1 bg-violet-600 text-white text-sm rounded-md hover:bg-violet-700 transition"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
        <h4 className="font-semibold text-violet-700 mb-2">Goal Progress</h4>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-violet-600 h-2.5 rounded-full"
              style={{ width: `${(goals.filter((g) => g.status === "completed").length / goals.length) * 100}%` }}
            ></div>
          </div>
          <span className="ml-3 text-sm font-medium">
            {goals.filter((g) => g.status === "completed").length}/{goals.length} completed
          </span>
        </div>
      </div>
    </div>
  )
}

