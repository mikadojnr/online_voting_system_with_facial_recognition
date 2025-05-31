"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useElection } from "../context/ElectionContext"
import ElectionCard from "../components/ElectionCard"
import { FaVoteYea, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"

const VotingDashboard = () => {
  const { user } = useAuth()
  const { getActiveElections, getUpcomingElections, getCompletedElections, loading } = useElection()
  const [activeElections, setActiveElections] = useState([])
  const [upcomingElections, setUpcomingElections] = useState([])
  const [completedElections, setCompletedElections] = useState([])

  useEffect(() => {
    if (!loading) {
      setActiveElections(getActiveElections())
      setUpcomingElections(getUpcomingElections())
      setCompletedElections(getCompletedElections())
    }
  }, [loading, getActiveElections, getUpcomingElections, getCompletedElections])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading elections...</p>
        </div>
      </div>
    )
  }

  // Count how many elections the user has voted for
  const votedElectionsCount =
    user?.votedOffices?.reduce((acc, vote) => {
      if (!acc.includes(vote.electionId)) {
        acc.push(vote.electionId)
      }
      return acc
    }, []).length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Student Voting Dashboard</h1>
          <p className="text-gray-600">View active elections and cast your vote securely</p>
        </div>

        {/* User Voting Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-3 rounded-full mr-4">
                <FaVoteYea className="text-2xl text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your Voting Status</h2>
                <p className="text-gray-600">
                  You have participated in {votedElectionsCount} {votedElectionsCount === 1 ? "election" : "elections"}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              {votedElectionsCount > 0 ? (
                <div className="flex items-center text-green-600">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-medium">Active Participant</span>
                </div>
              ) : activeElections.length > 0 ? (
                <div className="flex items-center text-orange-600">
                  <FaExclamationTriangle className="mr-2" />
                  <span className="font-medium">Ready to Vote</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <span className="font-medium">No active elections</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Elections */}
        {activeElections.length > 0 && (
          <div className="mb-12 shadow-md p-4 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Active Elections</h2>
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Vote Now
              </div>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {activeElections.map((election) => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Elections */}
        {upcomingElections.length > 0 && (
          <div className="mb-12 shadow-md p-4 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Elections</h2>
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                Coming Soon
              </div>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {upcomingElections.map((election) => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completed Elections */}
        {completedElections.length > 0 && (
          <div className="mb-8 shadow-md p-4 bg-white">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Past Elections</h2>
              <Link to="/results" className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors">
                View All Results
              </Link>
            </div>

            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                {completedElections.slice(0, 3).map((election) => (
                  <ElectionCard key={election.id} election={election} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Elections Message */}
        {activeElections.length === 0 && upcomingElections.length === 0 && completedElections.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-100">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Elections Available</h3>
            <p className="text-gray-600 mb-4">There are currently no active, upcoming, or past elections to display.</p>
            <p className="text-gray-500 text-sm">
              Please check back later or contact the election administrator for more information.
            </p>
          </div>
        )}

        {/* Voting Instructions */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-teal-800 mb-3">Voting Instructions</h3>
          <ul className="space-y-2 text-teal-700">
            <li>• Select one candidate per office in each election</li>
            <li>• Review all your selections before final submission</li>
            <li>• Facial verification is required only once during final submission</li>
            <li>• Once submitted, you cannot vote again for that election</li>
            <li>• Results will be available after the election ends</li>
            <li>• If you encounter any issues, please contact the election administrator</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VotingDashboard
