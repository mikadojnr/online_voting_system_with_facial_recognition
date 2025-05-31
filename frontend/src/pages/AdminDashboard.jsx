"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useElection } from "../context/ElectionContext"
import {
  FaUsers,
  FaVoteYea,
  FaChartBar,
  FaCog,
  FaUserPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaSearch,
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa"

const AdminDashboard = () => {
  const { elections, loading } = useElection()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock data for voters
  const mockVoters = [
    {
      id: 1,
      name: "John Doe",
      studentId: "FUO/2020/001",
      email: "john.doe@student.fuotuoke.edu.ng",
      department: "Computer Science",
      hasVoted: true,
      registeredAt: "2024-11-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      studentId: "FUO/2020/002",
      email: "jane.smith@student.fuotuoke.edu.ng",
      department: "Engineering",
      hasVoted: false,
      registeredAt: "2024-11-16",
    },
    {
      id: 3,
      name: "Mike Johnson",
      studentId: "FUO/2021/003",
      email: "mike.johnson@student.fuotuoke.edu.ng",
      department: "Medicine",
      hasVoted: true,
      registeredAt: "2024-11-17",
    },
  ]

  // Calculate stats
  const stats = {
    totalElections: elections.length,
    activeElections: elections.filter((e) => e.status === "active").length,
    totalVoters: elections.reduce((sum, election) => sum + election.totalVoters, 0),
    totalVotes: elections.reduce((sum, election) => sum + election.votedCount, 0),
    totalCandidates: elections.reduce(
      (sum, election) => sum + election.offices.reduce((officeSum, office) => officeSum + office.candidates.length, 0),
      0,
    ),
    avgTurnout:
      elections.length > 0
        ? (
            elections.reduce(
              (sum, election) =>
                sum + (election.totalVoters > 0 ? (election.votedCount / election.totalVoters) * 100 : 0),
              0,
            ) / elections.length
          ).toFixed(1)
        : 0,
  }

  const filteredVoters = mockVoters.filter((voter) => {
    const matchesSearch =
      voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voter.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "voted" && voter.hasVoted) ||
      (filterStatus === "not-voted" && !voter.hasVoted)
    return matchesSearch && matchesFilter
  })

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-lg">
              <FaCalendarAlt className="text-2xl text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Elections</h3>
              <p className="text-3xl font-bold text-teal-600">{stats.totalElections}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
              <FaVoteYea className="text-2xl text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Active Elections</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeElections}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-lg">
              <FaUsers className="text-2xl text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Voters</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalVoters}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
              <FaChartBar className="text-2xl text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Votes</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalVotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
              <FaUserPlus className="text-2xl text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Candidates</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.totalCandidates}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-lg shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-3 rounded-lg">
              <FaChartBar className="text-2xl text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Avg Turnout</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.avgTurnout}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/elections/new"
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-4 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-3 shadow-lg"
          >
            <FaPlus />
            <span>Create Election</span>
          </Link>
          <Link
            to="/admin/elections"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-3 shadow-lg"
          >
            <FaCalendarAlt />
            <span>Manage Elections</span>
          </Link>
          <Link
            to="/results"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-3 shadow-lg"
          >
            <FaChartBar />
            <span>View Results</span>
          </Link>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-3 shadow-lg">
            <FaDownload />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Recent Elections */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
          <h2 className="text-xl font-semibold text-white">Recent Elections</h2>
        </div>
        <div className="p-6">
          {elections.slice(0, 5).map((election) => (
            <div
              key={election.id}
              className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <h3 className="font-semibold text-gray-800">{election.title}</h3>
                <p className="text-sm text-gray-600">{election.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      election.status === "active"
                        ? "bg-green-100 text-green-800"
                        : election.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {election.votedCount} / {election.totalVoters} votes
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/admin/elections/edit/${election.id}`}
                  className="text-teal-600 hover:text-teal-800 bg-teal-100 p-2 rounded transition-colors"
                >
                  <FaEdit />
                </Link>
                <Link
                  to={`/results/${election.id}`}
                  className="text-blue-600 hover:text-blue-800 bg-blue-100 p-2 rounded transition-colors"
                >
                  <FaEye />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderVoters = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search voters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Voters</option>
              <option value="voted">Voted</option>
              <option value="not-voted">Not Voted</option>
            </select>
            <button className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 shadow-lg">
              <FaDownload />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Voters Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVoters.map((voter) => (
                <tr key={voter.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                      <div className="text-sm text-gray-500">{voter.studentId}</div>
                      <div className="text-sm text-gray-500">{voter.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        voter.hasVoted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {voter.hasVoted ? "Voted" : "Not Voted"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voter.registeredAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-teal-600 hover:text-teal-900 bg-teal-100 p-2 rounded transition-colors">
                        <FaEye />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 bg-blue-100 p-2 rounded transition-colors">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded transition-colors">
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
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage elections, voters, and system settings</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8 border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview", icon: FaChartBar },
                { id: "voters", label: "Voters", icon: FaUsers },
                { id: "settings", label: "Settings", icon: FaCog },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-teal-500 text-teal-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "overview" && renderOverview()}
          {activeTab === "voters" && renderVoters()}
          {activeTab === "settings" && (
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">System Settings</h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-teal-800 mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Face Recognition Required</h4>
                        <p className="text-sm text-gray-600">Require facial verification for voting</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">System Maintenance</h3>
                  <div className="space-y-4">
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg">
                      Backup Database
                    </button>
                    <button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-2 rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all duration-200 shadow-lg ml-4">
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
