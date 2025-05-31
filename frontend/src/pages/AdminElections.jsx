"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useElection } from "../context/ElectionContext"
import { FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt, FaUsers, FaCheck, FaClock } from "react-icons/fa"

const AdminElections = () => {
  const { elections, loading, deleteElection } = useElection()
  const [isDeleting, setIsDeleting] = useState(false)
  const [electionToDelete, setElectionToDelete] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredElections = elections.filter((election) => {
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || election.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleDeleteClick = (election) => {
    setElectionToDelete(election)
  }

  const confirmDelete = async () => {
    if (!electionToDelete) return

    setIsDeleting(true)
    try {
      await deleteElection(electionToDelete.id)
    } catch (error) {
      console.error("Error deleting election:", error)
    } finally {
      setIsDeleting(false)
      setElectionToDelete(null)
    }
  }

  const cancelDelete = () => {
    setElectionToDelete(null)
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading elections...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Manage Elections</h1>
            <p className="text-gray-600">Create, edit, and manage all elections</p>
          </div>
          <Link
            to="/admin/elections/new"
            className="mt-4 md:mt-0 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2 w-full md:w-auto"
          >
            <FaPlus />
            <span>Create New Election</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Elections</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Elections List */}
        {filteredElections.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Election
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredElections.map((election) => (
                    <tr key={election.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{election.title}</div>
                            <div className="text-sm text-gray-500">{election.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {election.offices.length} {election.offices.length === 1 ? "office" : "offices"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaCalendarAlt className="text-blue-900 mr-2" />
                            <span>Start: {formatDate(election.startDate)}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <FaCalendarAlt className="text-red-900 mr-2" />
                            <span>End: {formatDate(election.endDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            election.status,
                          )}`}
                        >
                          {election.status === "active" && <FaClock className="mr-1" />}
                          {election.status === "upcoming" && <FaCalendarAlt className="mr-1" />}
                          {election.status === "completed" && <FaCheck className="mr-1" />}
                          {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaUsers className="text-blue-900 mr-2" />
                            <span>
                              {election.votedCount} / {election.totalVoters} voters
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${
                                election.status === "completed" ? "bg-gray-500" : "bg-green-500"
                              }`}
                              style={{
                                width: `${
                                  election.totalVoters > 0 ? (election.votedCount / election.totalVoters) * 100 : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/elections/edit/${election.id}`}
                            className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded"
                            title="Edit Election"
                          >
                            <FaEdit />
                          </Link>
                          <Link
                            to={`/results/${election.id}`}
                            className="text-green-600 hover:text-green-900 bg-green-100 p-2 rounded"
                            title="View Results"
                          >
                            <FaEye />
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(election)}
                            className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded"
                            title="Delete Election"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Elections Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== "all"
                ? "No elections match your search criteria."
                : "There are no elections in the system yet."}
            </p>
            <Link
              to="/admin/elections/new"
              className="inline-block bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Create Your First Election
            </Link>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {electionToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the election "{electionToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    "Delete Election"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminElections
