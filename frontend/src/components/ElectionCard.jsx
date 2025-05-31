import { Link } from "react-router-dom"
import { FaClock, FaUsers, FaCalendarAlt, FaCheckCircle, FaHourglassHalf } from "react-icons/fa"

const ElectionCard = ({ election }) => {
  // Calculate time remaining or time passed
  const now = new Date()
  const isActive = election.status === "active"
  const isUpcoming = election.status === "upcoming"
  const isCompleted = election.status === "completed"

  // Format dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate voting progress percentage
  const votingProgress = (election.votedCount / election.totalVoters) * 100 || 0

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div
        className={`p-4 text-white ${
          isActive
            ? "bg-gradient-to-r from-green-600 to-emerald-600"
            : isUpcoming
              ? "bg-gradient-to-r from-teal-600 to-cyan-600"
              : "bg-gradient-to-r from-gray-600 to-gray-700"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{election.title}</h3>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-20">
            {isActive ? "Active" : isUpcoming ? "Upcoming" : "Completed"}
          </span>
        </div>
        <p className="text-sm mt-1 text-white text-opacity-90">{election.description}</p>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {/* Date Information */}
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-teal-600" />
            <div className="text-sm">
              <span className="font-medium">{isCompleted ? "Held on: " : isActive ? "Ends: " : "Starts: "}</span>
              {formatDate(isCompleted || isActive ? election.endDate : election.startDate)}
            </div>
          </div>

          {/* Offices */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">Positions: </span>
            {election.offices.length} {election.offices.length === 1 ? "office" : "offices"}
          </div>

          {/* Voter Stats */}
          <div className="flex items-center text-gray-600">
            <FaUsers className="mr-2 text-teal-600" />
            <div className="text-sm">
              <span className="font-medium">Voters: </span>
              {election.votedCount} / {election.totalVoters}
            </div>
          </div>

          {/* Progress Bar */}
          {(isActive || isCompleted) && (
            <div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    isCompleted
                      ? "bg-gradient-to-r from-gray-500 to-gray-600"
                      : "bg-gradient-to-r from-green-500 to-emerald-500"
                  }`}
                  style={{ width: `${votingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{votingProgress.toFixed(1)}% turnout</span>
                {isCompleted && <span>Completed</span>}
              </div>
            </div>
          )}

          {/* Status Indicator */}
          <div className="flex items-center">
            {isActive && (
              <div className="flex items-center text-green-600">
                <FaClock className="mr-2" />
                <span className="text-sm font-medium">Voting in progress</span>
              </div>
            )}
            {isUpcoming && (
              <div className="flex items-center text-teal-600">
                <FaHourglassHalf className="mr-2" />
                <span className="text-sm font-medium">Coming soon</span>
              </div>
            )}
            {isCompleted && (
              <div className="flex items-center text-gray-600">
                <FaCheckCircle className="mr-2" />
                <span className="text-sm font-medium">Results available</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <Link
            to={isCompleted ? `/results/${election.id}` : `/election/${election.id}`}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg ${
              isActive
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                : isUpcoming
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700"
                  : "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800"
            }`}
          >
            <span>{isActive ? "Vote Now" : isUpcoming ? "View Details" : "View Results"}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ElectionCard
