"use client"

import { FaCheckCircle, FaArrowRight, FaTimes } from "react-icons/fa"

const VoteSuccessModal = ({ isOpen, onClose, submittedVotes, electionTitle, onGoToDashboard }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FaCheckCircle className="text-3xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Vote Submitted Successfully!</h2>
          <p className="text-gray-600">Your votes have been securely recorded for</p>
          <p className="text-blue-900 font-semibold">{electionTitle}</p>
        </div>

        {/* Vote Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 text-center">Your Votes Summary</h3>
          <div className="space-y-3">
            {submittedVotes.map((vote, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{vote.office}</div>
                    <div className="text-sm text-gray-600">{vote.candidate}</div>
                    {vote.department && <div className="text-xs text-gray-500">{vote.department}</div>}
                  </div>
                  <FaCheckCircle className="text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thank You Message */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-center">
            <strong>Thank you for participating in the democratic process!</strong>
          </p>
          <p className="text-blue-700 text-sm text-center mt-2">
            Your votes are confidential and have been encrypted for security. Results will be available after the
            election ends.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onGoToDashboard}
            className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 font-semibold"
          >
            <span>Go to Dashboard</span>
            <FaArrowRight />
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">Vote ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <p className="text-xs text-gray-500 mt-1">Submitted on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}

export default VoteSuccessModal
