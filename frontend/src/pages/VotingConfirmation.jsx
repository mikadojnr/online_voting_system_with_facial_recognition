"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useElection } from "../context/ElectionContext"
import FaceRecognition from "../components/FaceRecognition"
import { FaCheckCircle, FaExclamationTriangle, FaVoteYea, FaArrowLeft, FaHome } from "react-icons/fa"

const VotingConfirmation = () => {
  const [showFaceVerification, setShowFaceVerification] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [votingComplete, setVotingComplete] = useState(false)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(5)

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { submitVotes } = useElection()

  const { selectedCandidates, electionId } = location.state || {}

  // Redirect countdown after successful voting
  useEffect(() => {
    if (votingComplete && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (votingComplete && countdown === 0) {
      navigate("/dashboard")
    }
  }, [votingComplete, countdown, navigate])

  // Redirect if no voting data
  useEffect(() => {
    if (!selectedCandidates || !electionId) {
      navigate("/dashboard")
    }
  }, [selectedCandidates, electionId, navigate])

  const handleConfirmVoting = () => {
    setShowFaceVerification(true)
  }

  const handleFaceVerificationSuccess = async () => {
    setShowFaceVerification(false)
    setIsSubmitting(true)
    setError(null)

    try {
      // Simulate API call to submit votes
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real implementation, call the API
      // const result = await submitVotes(electionId, selectedCandidates)

      // Mock successful submission
      const result = { success: true, message: "Votes submitted successfully" }

      if (result.success) {
        setVotingComplete(true)
        setIsSubmitting(false)
      } else {
        throw new Error(result.message || "Failed to submit votes")
      }
    } catch (error) {
      console.error("Voting submission error:", error)
      setError(error.message || "Failed to submit votes. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleFaceVerificationCancel = () => {
    setShowFaceVerification(false)
  }

  const handleBackToVoting = () => {
    navigate(-1)
  }

  const handleGoHome = () => {
    navigate("/dashboard")
  }

  if (!selectedCandidates || !electionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Voting Data Found</h2>
          <p className="text-gray-600 mb-4">Please start the voting process again.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Success screen after voting
  if (votingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Vote Submitted Successfully!</h2>
            <p className="text-gray-600">
              Thank you for participating in the democratic process. Your vote has been securely recorded.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Voting Confirmation</h3>
            <div className="text-sm text-green-700 space-y-1">
              <p>
                <strong>Voter:</strong> {user?.name}
              </p>
              <p>
                <strong>Student ID:</strong> {user?.studentId}
              </p>
              <p>
                <strong>Time:</strong> {new Date().toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> Verified & Recorded
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Redirecting to dashboard in <span className="font-bold text-blue-600">{countdown}</span> seconds...
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleGoHome}
                className="flex-1 bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
              >
                <FaHome />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigate("/results")}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                View Results
              </button>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Your vote is anonymous and cannot be traced back to you.</p>
            <p>Election results will be available after the voting period ends.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Confirm Your Vote</h1>
            <p className="text-gray-600">Please review your selections before submitting</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <FaExclamationTriangle />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Voter Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Voter Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                <p className="text-gray-900">{user?.studentId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Voting Time</label>
                <p className="text-gray-900">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Selected Candidates */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Selections</h2>
            <div className="space-y-4">
              {Object.entries(selectedCandidates).map(([officeId, candidateId]) => {
                // Mock data for display - replace with actual data from context
                const officeName = `Office ${officeId}`
                const candidateName = `Candidate ${candidateId}`

                return (
                  <div key={officeId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{officeName}</h3>
                        <p className="text-blue-600 font-medium">{candidateName}</p>
                      </div>
                      <FaCheckCircle className="text-green-500 text-xl" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Warning Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-yellow-500 text-xl mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800">Important Notice</h3>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• Once submitted, your vote cannot be changed</li>
                  <li>• Face verification is required to complete voting</li>
                  <li>• Your vote is anonymous and secure</li>
                  <li>• Make sure all selections are correct before proceeding</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleBackToVoting}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <FaArrowLeft />
              <span>Back to Voting</span>
            </button>

            <button
              onClick={handleConfirmVoting}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaVoteYea />
                  <span>Submit Vote</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Face Recognition Modal */}
      {showFaceVerification && (
        <FaceRecognition
          mode="verify"
          onSuccess={handleFaceVerificationSuccess}
          onCancel={handleFaceVerificationCancel}
        />
      )}
    </div>
  )
}

export default VotingConfirmation
