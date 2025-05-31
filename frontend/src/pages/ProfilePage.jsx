"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import FaceRecognition from "../components/FaceRecognition"
import { FaUser, FaEnvelope, FaPhone, FaIdCard, FaCamera, FaEdit, FaSave, FaTimes, FaCheckCircle } from "react-icons/fa"

const ProfilePage = () => {
  const { user, updateFace } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showFaceUpdate, setShowFaceUpdate] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Mock API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
      // In real implementation, update user context here
    } catch (error) {
      console.error("Profile update error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    })
    setIsEditing(false)
  }

  const handleFaceUpdateSuccess = async (faceData) => {
    setIsLoading(true)
    await updateFace(faceData)
    setShowFaceUpdate(false)
  }

  const handleFaceUpdateCancel = () => {
    setShowFaceUpdate(false)
  }

  const votingHistory = [
    {
      id: 1,
      election: "Student Union Government Election 2024",
      date: "December 15, 2024",
      status: "Completed",
      position: "President & Vice President",
    },
    {
      id: 2,
      election: "Faculty Representative Election 2024",
      date: "October 20, 2024",
      status: "Completed",
      position: "Faculty Representative",
    },
    {
      id: 3,
      election: "Sports Committee Election 2024",
      date: "September 10, 2024",
      status: "Completed",
      position: "Sports Director",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and voting history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-900 text-white p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors flex items-center space-x-2"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          <FaSave />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50"
                        >
                          <FaTimes />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                          {user?.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaIdCard className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
                        {user?.studentId}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Student ID cannot be changed</p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="block w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="block w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                          {user?.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Voting History */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mt-8">
                <div className="bg-green-500 text-white p-6">
                  <h2 className="text-xl font-semibold">Voting History</h2>
                </div>

                <div className="p-6">
                  {votingHistory.length > 0 ? (
                    <div className="space-y-4">
                      {votingHistory.map((election) => (
                        <div key={election.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-800">{election.election}</h3>
                              <p className="text-sm text-gray-600">Position: {election.position}</p>
                              <p className="text-sm text-gray-500">Date: {election.date}</p>
                            </div>
                            <div className="flex items-center space-x-2 text-green-600">
                              <FaCheckCircle />
                              <span className="font-medium">{election.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No voting history available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Picture & Face Recognition */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Picture</h3>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <FaUser className="text-4xl text-gray-400" />
                  </div>
                  <button
                    onClick={() => setShowFaceUpdate(true)}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <FaCamera />
                    <span>Update Face</span>
                  </button>
                  <p className="text-xs text-gray-500 mt-2">Update your facial recognition data</p>
                </div>
              </div>

              {/* Account Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Face Registered</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {user?.faceRegistered ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Voting Status</span>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user?.hasVoted ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {user?.hasVoted ? "Voted" : "Not Voted"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
                <div className="space-y-3">
                  <button className="w-full text-left text-blue-600 hover:text-blue-500 transition-colors">
                    Change Password
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-500 transition-colors">
                    Two-Factor Authentication
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-500 transition-colors">
                    Login History
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Face Recognition Modal */}
      {showFaceUpdate && (
        <FaceRecognition mode="register" onSuccess={handleFaceUpdateSuccess} onCancel={handleFaceUpdateCancel} />
      )}
    </div>
  )
}

export default ProfilePage
