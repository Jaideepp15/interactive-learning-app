"use client"

import type React from "react"

import { useState } from "react"
import { Send, CheckCircle } from "lucide-react"

export default function Feedback() {
  const [feedbackText, setFeedbackText] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!feedbackText.trim() || rating === 0) {
      alert("Please provide both feedback text and a rating.")
      return
    }

    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1500)
  }

  const resetForm = () => {
    setFeedbackText("")
    setRating(0)
    setSubmitted(false)
  }

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">Send Feedback</h3>

      {submitted ? (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-green-700 mb-2">Thank You for Your Feedback!</h4>
          <p className="text-gray-600 mb-6">Your feedback has been submitted successfully and will help us improve.</p>
          <button
            onClick={resetForm}
            className="px-6 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition"
          >
            Send Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="feedback"
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              placeholder="Please share your thoughts, suggestions, or concerns about your child's learning experience..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />
          </div>

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
              onClick={() => {
                setFeedbackText("")
                setRating(0)
              }}
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

