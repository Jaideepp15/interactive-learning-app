"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Send, CheckCircle } from "lucide-react"

export default function ParentFeedback() {
  const [children, setChildren] = useState<any[]>([])  // Store the fetched children data
  const [selectedChild, setSelectedChild] = useState<string>("")
  const [feedbackTitle, setFeedbackTitle] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [providerId, setProviderId] = useState<string | null>(null)  // Store the logged-in parent's userId

  useEffect(() => {
    async function fetchParentDetails() {
      try {
        const response = await fetch("/api/fetch-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setProviderId(data.userId)  // Assuming the response has the userId field
          fetchChildDetails(data.userId)  // Pass providerId to fetch children's details
        } else {
          console.error("Failed to fetch parent details")
        }
      } catch (error) {
        console.error("Error fetching parent details:", error)
      }
    }

    async function fetchChildDetails(parentId: string) {
      try {
        const response = await fetch("/api/fetch-child-details", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setChildren(data.children)
          setSelectedChild(data.children[0]?.id || "") // Set the first child as the default selection
        } else {
          console.error("Failed to fetch child details")
        }
      } catch (error) {
        console.error("Error fetching child details:", error)
      }
    }

    fetchParentDetails()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedChild || !feedbackTitle.trim() || !feedbackText.trim() || rating === 0) {
      alert("Please select a student and provide title, feedback text, and a rating.")
      return
    }

    setLoading(true)

    const feedbackdata = {
      providerId: Number(providerId), // Use the providerId fetched from /api/fetch-details
      receiverId: Number(selectedChild),
      title: feedbackTitle,
      text: feedbackText,
      rating: rating,
      providerrole: "parent",
    }

    try {
      const response = await fetch("/api/submit-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackdata),
      })

      if (!response.ok) {
        throw new Error("Failed to send feedback")
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedChild("")
    setFeedbackTitle("")
    setFeedbackText("")
    setRating(0)
    setSubmitted(false)
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Submit Parent Feedback</h3>

      {submitted ? (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-green-700 mb-2">Feedback Submitted Successfully!</h4>
          <p className="text-gray-600 mb-6">
            Your feedback has been recorded for {children.find((c) => c.id === selectedChild)?.name}.
          </p>
          <button
            onClick={resetForm}
            className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Child */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Child</label>
            <select
              value={selectedChild}
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

          {/* Feedback Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter a title for your feedback"
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              required
            />
          </div>

          {/* Feedback Text */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              placeholder="Share your feedback about your child's learning experience..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rate Your Experience</label>
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

          {/* Submit & Clear Buttons */}
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
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Feedback</span>
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
  )
}
