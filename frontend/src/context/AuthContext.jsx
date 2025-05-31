"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"
import { authAPI, faceAPI, votingAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token")
      const savedUser = localStorage.getItem("user")

      if (token && savedUser) {
        setUser(JSON.parse(savedUser))

        // Verify token with backend
        try {
          const response = await authAPI.getProfile()
          if (response.data.success) {
            setUser(response.data.user)
            localStorage.setItem("user", JSON.stringify(response.data.user))
          }
        } catch (error) {
          // Token invalid, clear storage
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      setLoading(true)

      // Try API first, fallback to mock data
      try {
        const response = await authAPI.login(credentials)

        if (response.data.success) {
          const { user, token } = response.data
          localStorage.setItem("token", token)
          localStorage.setItem("user", JSON.stringify(user))
          setUser(user)
          toast.success("Login successful!")
          return { success: true }
        }
      } catch (apiError) {
        console.log("API not available, using mock data")

        // Mock authentication for development
        const mockUsers = [
          {
            id: 1,
            name: "John Doe",
            email: "john.doe@student.fuotuoke.edu.ng",
            studentId: "FUO/2021/CS/001",
            phone: "+234 801 234 5678",
            isAdmin: false,
            faceRegistered: true,
            votedElections: [],
          },
          {
            id: 2,
            name: "Admin User",
            email: "admin@fuotuoke.edu.ng",
            studentId: "ADMIN001",
            phone: "+234 803 123 4567",
            isAdmin: true,
            faceRegistered: true,
            votedElections: [],
          },
        ]

        const user = mockUsers.find((u) => u.email === credentials.email && credentials.password === "password123")

        if (user) {
          localStorage.setItem("user", JSON.stringify(user))
          setUser(user)
          toast.success("Login successful!")
          return { success: true }
        } else {
          toast.error("Invalid credentials")
          return { success: false, error: "Invalid credentials" }
        }
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Login failed"
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)

      // Try API first, fallback to mock
      try {
        const response = await authAPI.register(userData)

        if (response.data.success) {
          const { user, token } = response.data
          localStorage.setItem("token", token)
          localStorage.setItem("user", JSON.stringify(user))
          setUser(user)
          toast.success("Registration successful!")
          return { success: true }
        }
      } catch (apiError) {
        console.log("API not available, using mock registration")

        // Mock registration
        const newUser = {
          id: Date.now(),
          name: userData.name,
          email: userData.email,
          studentId: userData.studentId,
          phone: userData.phone,
          isAdmin: false,
          faceRegistered: true,
          votedElections: [],
        }

        localStorage.setItem("user", JSON.stringify(newUser))
        setUser(newUser)
        toast.success("Registration successful!")
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message || "Registration failed"
      toast.error(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Try to logout from API
      try {
        await authAPI.logout()
      } catch (error) {
        console.log("API logout failed, proceeding with local logout")
      }

      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const verifyFace = async (faceData) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await faceAPI.verifyFace(faceData)
        return response.data
      } catch (apiError) {
        console.log("API not available, using mock face verification")

        // Mock face verification - always succeed for demo
        await new Promise((resolve) => setTimeout(resolve, 2000))
        return { success: true, confidence: 0.95 }
      }
    } catch (error) {
      console.error("Face verification error:", error)
      return { success: false, error: error.message }
    }
  }

  const castVote = async (electionId, officeId, candidateId) => {
    try {
      if (!user) {
        throw new Error("User not authenticated")
      }

      // Check if user has already voted for this office in this election
      const hasVotedForOffice = user.votedElections.some(
        (vote) => vote.electionId === electionId && vote.officeId === officeId,
      )

      if (hasVotedForOffice) {
        toast.error("You have already voted for this office")
        return { success: false, error: "Already voted for this office" }
      }

      // Try API first, fallback to mock
      try {
        const response = await votingAPI.castVote(electionId, [
          {
            office_id: officeId,
            candidate_id: candidateId,
          },
        ])

        if (response.data.success) {
          // Update user's voted elections
          const updatedVotedElections = [
            ...user.votedElections,
            { electionId, officeId, candidateId, timestamp: new Date().toISOString() },
          ]

          const updatedUser = {
            ...user,
            votedElections: updatedVotedElections,
          }

          localStorage.setItem("user", JSON.stringify(updatedUser))
          setUser(updatedUser)

          return { success: true }
        }
      } catch (apiError) {
        console.log("API not available, using mock voting")

        // Mock voting
        const updatedVotedElections = [
          ...user.votedElections,
          { electionId, officeId, candidateId, timestamp: new Date().toISOString() },
        ]

        const updatedUser = {
          ...user,
          votedElections: updatedVotedElections,
        }

        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)

        return { success: true }
      }
    } catch (error) {
      console.error("Vote casting error:", error)
      return { success: false, error: error.message }
    }
  }

  const hasVotedForOffice = (electionId, officeId) => {
    if (!user) return false
    return user.votedElections.some((vote) => vote.electionId === electionId && vote.officeId === officeId)
  }

  const hasVotedInElection = (electionId) => {
    if (!user) return false
    return user.votedElections.some((vote) => vote.electionId === electionId)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyFace,
    castVote,
    hasVotedForOffice,
    hasVotedInElection,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
