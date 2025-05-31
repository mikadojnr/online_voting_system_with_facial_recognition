"use client"

import { useState, useEffect } from "react"
import { FaTrophy, FaUsers, FaChartBar, FaDownload, FaSync } from "react-icons/fa"

const ResultsPage = () => {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPosition, setSelectedPosition] = useState("President")

  // Mock results data
  const mockResults = {
    President: {
      totalVotes: 1523,
      candidates: [
        {
          id: 1,
          name: "Sarah Johnson",
          department: "Computer Science",
          votes: 892,
          percentage: 58.6,
          photo: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 2,
          name: "Michael Adebayo",
          department: "Engineering",
          votes: 631,
          percentage: 41.4,
          photo: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
    "Vice President": {
      totalVotes: 1523,
      candidates: [
        {
          id: 3,
          name: "Grace Okoro",
          department: "Medicine",
          votes: 823,
          percentage: 54.0,
          photo: "/placeholder.svg?height=100&width=100",
        },
        {
          id: 4,
          name: "David Okafor",
          department: "Business Administration",
          votes: 700,
          percentage: 46.0,
          photo: "/placeholder.svg?height=100&width=100",
        },
      ],
    },
  }

  const electionStats = {
    totalRegisteredVoters: 2847,
    totalVotesCast: 1523,
    turnoutPercentage: 53.5,
    electionDate: "December 15, 2024",
    resultsDeclaredAt: "December 16, 2024 - 10:30 AM",
  }

  useEffect(() => {
    // Simulate API call to fetch results
    const fetchResults = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResults(mockResults)
      setLoading(false)
    }

    fetchResults()
  }, [])

  const refreshResults = () => {
    setResults(null)
    setLoading(true)
    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
    }, 1000)
  }

  const downloadResults = () => {
    // Mock download functionality
    const dataStr = JSON.stringify(results, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "election_results.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading election results...</p>
        </div>
      </div>
    )
  }

  const currentResults = results[selectedPosition]
  const winner = currentResults.candidates.reduce((prev, current) => (prev.votes > current.votes ? prev : current))

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Election Results</h1>
          <p className="text-gray-600">Student Union Government Election 2024</p>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={refreshResults}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2"
            >
              <FaSync />
              <span>Refresh</span>
            </button>
            <button
              onClick={downloadResults}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
            >
              <FaDownload />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Election Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaUsers className="text-3xl text-blue-900 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{electionStats.totalRegisteredVoters}</div>
            <div className="text-sm text-gray-600">Registered Voters</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaChartBar className="text-3xl text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-gray-800">{electionStats.totalVotesCast}</div>
            <div className="text-sm text-gray-600">Votes Cast</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl text-yellow-500 mx-auto mb-3">📊</div>
            <div className="text-2xl font-bold text-gray-800">{electionStats.turnoutPercentage}%</div>
            <div className="text-sm text-gray-600">Voter Turnout</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl text-purple-500 mx-auto mb-3">📅</div>
            <div className="text-lg font-bold text-gray-800">{electionStats.electionDate}</div>
            <div className="text-sm text-gray-600">Election Date</div>
          </div>
        </div>

        {/* Position Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Position</h2>
          <div className="flex space-x-4">
            {Object.keys(results).map((position) => (
              <button
                key={position}
                onClick={() => setSelectedPosition(position)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  selectedPosition === position
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {position}
              </button>
            ))}
          </div>
        </div>

        {/* Winner Announcement */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-lg p-8 mb-8 text-center">
          <FaTrophy className="text-4xl text-yellow-800 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">🎉 Winner - {selectedPosition} 🎉</h2>
          <div className="flex items-center justify-center space-x-6">
            <img
              src={winner.photo || "/placeholder.svg?height=80&width=80"}
              alt={winner.name}
              className="w-20 h-20 rounded-full border-4 border-yellow-800"
            />
            <div className="text-left">
              <h3 className="text-xl font-bold text-yellow-800">{winner.name}</h3>
              <p className="text-yellow-700">{winner.department}</p>
              <p className="text-lg font-semibold text-yellow-800">
                {winner.votes} votes ({winner.percentage}%)
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-900 text-white p-6">
            <h2 className="text-xl font-semibold">Detailed Results - {selectedPosition}</h2>
            <p className="text-blue-100">Total Votes: {currentResults.totalVotes}</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {currentResults.candidates
                .sort((a, b) => b.votes - a.votes)
                .map((candidate, index) => (
                  <div key={candidate.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <img
                            src={candidate.photo || "/placeholder.svg?height=60&width=60"}
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center">
                              <FaTrophy className="text-sm" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
                          <p className="text-gray-600">{candidate.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{candidate.votes}</div>
                        <div className="text-sm text-gray-600">votes</div>
                      </div>
                    </div>

                    {/* Vote Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Vote Share</span>
                        <span>{candidate.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ${
                            index === 0 ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${candidate.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Results Declaration */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Official Results Declaration</h3>
          <p className="text-green-700">
            Results declared on: <strong>{electionStats.resultsDeclaredAt}</strong>
          </p>
          <p className="text-green-600 text-sm mt-2">
            These results have been verified and are final. Thank you for participating in the democratic process.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
