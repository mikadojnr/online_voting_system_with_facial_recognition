"use client"
import { FaTimes, FaUser, FaGraduationCap, FaIdCard, FaVoteYea, FaCheck } from "react-icons/fa"

const CandidateDetailsModal = ({
  candidate,
  isOpen,
  onClose,
  onSelect,
  isSelected = false,
  disabled = false,
  officeTitle = "",
}) => {
  if (!isOpen || !candidate) return null

  const handleSelect = () => {
    if (onSelect && !disabled) {
      onSelect()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Candidate Details</h2>
            {officeTitle && <p className="text-sm text-gray-600 mt-1">Running for: {officeTitle}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2">
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Candidate Photo and Basic Info */}
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={candidate.photo || "/placeholder.svg?height=200&width=200"}
                  alt={candidate.name || "Candidate"}
                  className="w-48 h-48 object-cover rounded-lg border-4 border-gray-200"
                />
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white p-3 rounded-full shadow-lg">
                    <FaCheck className="text-lg" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">{candidate.name || "Unknown Candidate"}</h3>

              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FaUser className="mr-3 text-teal-600" />
                  <div>
                    <span className="font-medium">Department:</span>
                    <span className="ml-2">{candidate.department || "N/A"}</span>
                  </div>
                </div>

                {candidate.level && (
                  <div className="flex items-center text-gray-700">
                    <FaGraduationCap className="mr-3 text-teal-600" />
                    <div>
                      <span className="font-medium">Level:</span>
                      <span className="ml-2">{candidate.level}</span>
                    </div>
                  </div>
                )}

                {candidate.matricNo && (
                  <div className="flex items-center text-gray-700">
                    <FaIdCard className="mr-3 text-teal-600" />
                    <div>
                      <span className="font-medium">Matric No:</span>
                      <span className="ml-2">{candidate.matricNo}</span>
                    </div>
                  </div>
                )}

                {candidate.email && (
                  <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-teal-600">@</span>
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{candidate.email}</span>
                    </div>
                  </div>
                )}

                {candidate.phone && (
                  <div className="flex items-center text-gray-700">
                    <span className="mr-3 text-teal-600">📞</span>
                    <div>
                      <span className="font-medium">Phone:</span>
                      <span className="ml-2">{candidate.phone}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Manifesto Section */}
          {candidate.manifesto && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📋</span>
                Manifesto
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.manifesto}</p>
              </div>
            </div>
          )}

          {/* Experience Section (if available) */}
          {candidate.experience && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">💼</span>
                Experience
              </h4>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.experience}</p>
              </div>
            </div>
          )}

          {/* Achievements Section (if available) */}
          {candidate.achievements && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🏆</span>
                Achievements
              </h4>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.achievements}</p>
              </div>
            </div>
          )}

          {/* Vision Section (if available) */}
          {candidate.vision && (
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Vision
              </h4>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{candidate.vision}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
            >
              Close
            </button>

            {!disabled && (
              <button
                onClick={handleSelect}
                className={`flex-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
                  isSelected
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                    : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
                }`}
              >
                <FaVoteYea />
                <span>{isSelected ? "Selected ✓" : `Select ${candidate.name}`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDetailsModal
