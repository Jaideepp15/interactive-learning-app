"use client"

import { useState, useEffect } from "react"
import { MessageSquare, Star, Filter, Search, CheckCircle, Clock } from "lucide-react"

interface Feedback {
  id: number;
  providerId: number;
  receiverId: number;
  title: string;
  text: string;
  rating: number;
  providerrole: "teacher" | "parent";
}

export default function FeedbackReader() {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "parent" | "teacher">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)

  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch("/api/feedback", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored in localStorage
          },
        }); // Replace with actual API URL
        const data: Feedback[] = await response.json()
        setFeedbackList(data)
        setFilteredFeedback(data)
      } catch (error) {
        console.error("Error fetching feedback:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  useEffect(() => {
    let result: Feedback[] = [...feedbackList]

    if (filter === "parent") {
      result = result.filter((item) => item.providerrole === "parent")
    } else if (filter === "teacher") {
      result = result.filter((item) => item.providerrole === "teacher")
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.text.toLowerCase().includes(query),
      )
    }

    setFilteredFeedback(result)
  }, [filter, searchQuery, feedbackList])

  const handleFeedbackClick = (feedback: Feedback) => {
    setSelectedFeedback(feedback)
  }

  const closeDetailView = () => {
    setSelectedFeedback(null)
  }

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2 text-violet-600" />
          My Feedback
        </h2>

        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search feedback..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Feedback</option>
              <option value="parent">From Parents</option>
              <option value="teacher">From Teachers</option>
            </select>
          </div>
        </div>
      </div>

      {selectedFeedback ? (
        <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{selectedFeedback.title}</h3>
              <p className="text-gray-600">From: {selectedFeedback.providerrole}</p>
            </div>
            <div>
              <div className="flex">{renderStars(selectedFeedback.rating)}</div>
              <button
                onClick={closeDetailView}
                className="mt-2 px-3 py-1 bg-violet-100 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
              >
                Back to list
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-100">
            <p className="text-gray-800 whitespace-pre-line">{selectedFeedback.text}</p>
          </div>
        </div>
      ) : (
        <>
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600">No feedback found</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map((feedback) => (
                <div
                  key={feedback.id.toString()}
                  onClick={() => handleFeedbackClick(feedback)}
                  className="ml-2 px-2 py-0.5 bg-violet-100 text-violet-800 text-xs rounded-lg shadow-sm border-l-4 cursor-pointer transition-all hover:shadow-md bg-white border-violet-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{feedback.title}</h3>
                      <p className="text-gray-600 font-semibold text-sm">
                        From: {feedback.providerrole}
                      </p>
                      <p className="mt-2 text-gray-700 line-clamp-2">{feedback.text}</p>
                    </div>

                    <div className="flex flex-col items-end ml-4">
                      <div className="flex mb-1">{renderStars(feedback.rating)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
