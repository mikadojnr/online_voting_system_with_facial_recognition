"use client"
import { FaVoteYea, FaUser, FaCheck } from "react-icons/fa"

const CandidateCard = ({ candidate, election, office, onVote, disabled = false, isSelected = false }) => {
  // Safety check for candidate
  if (!candidate) {
    return null
  }

  const handleCardClick = () => {
    if (!disabled && onVote) {
      onVote(candidate, office)
    }
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border-2 ${
        isSelected ? "border-teal-500 bg-teal-50" : "border-gray-100"
      } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-teal-300"}`}
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={candidate.photo || "/placeholder.svg?height=200&width=300"}
          alt={candidate.name || "Candidate"}
          className="w-full h-48 object-cover"
        />
        {isSelected && (
          <div className="absolute top-2 left-2 bg-green-500 text-white p-2 rounded-full">
            <FaCheck />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{candidate.name || "Unknown Candidate"}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaUser className="mr-2" />
            <span className="text-sm">{candidate.department || "N/A"}</span>
          </div>
          {candidate.level && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Level:</span> {candidate.level}
            </div>
          )}
          {candidate.matricNo && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Matric No:</span> {candidate.matricNo}
            </div>
          )}
        </div>

        {candidate.manifesto && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Manifesto:</h4>
            <p className="text-sm text-gray-600 line-clamp-3">{candidate.manifesto}</p>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleCardClick()
          }}
          disabled={disabled}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : isSelected
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
          }`}
        >
          <FaVoteYea />
          <span>{isSelected ? "Selected" : "View Details & Select"}</span>
        </button>
      </div>
    </div>
  )
}

export default CandidateCard
