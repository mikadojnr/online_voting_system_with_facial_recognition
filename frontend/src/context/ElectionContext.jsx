"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "react-toastify"

const ElectionContext = createContext()

export const useElection = () => {
  const context = useContext(ElectionContext)
  if (!context) {
    throw new Error("useElection must be used within an ElectionProvider")
  }
  return context
}

export const ElectionProvider = ({ children }) => {
  // Mock elections data
  const initialElections = [
    {
      id: 1,
      title: "Student Union Government Election 2024",
      description: "Annual election for SUG executive positions",
      startDate: new Date("2024-12-15T08:00:00"),
      endDate: new Date("2024-12-15T18:00:00"),
      status: "active", // active, upcoming, completed
      offices: [
        {
          id: 1,
          title: "President",
          description: "Chief executive officer of the student union",
          maxVotes: 1,
          candidates: [
            {
              id: 1,
              name: "Sarah Johnson",
              department: "Computer Science",
              level: "400 Level",
              matricNo: "FUO/2021/CS/001",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "I promise to bring innovative solutions to student welfare, improve campus infrastructure, and create more opportunities for academic and personal growth. Together, we can build a stronger student community.",
              votes: 0,
            },
            {
              id: 2,
              name: "Michael Adebayo",
              department: "Engineering",
              level: "400 Level",
              matricNo: "FUO/2021/ENG/045",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "My vision is to enhance student representation, improve communication between students and administration, and establish programs that prepare students for successful careers after graduation.",
              votes: 0,
            },
          ],
        },
        {
          id: 2,
          title: "Vice President",
          description: "Deputy to the president and oversees internal affairs",
          maxVotes: 1,
          candidates: [
            {
              id: 3,
              name: "Grace Okoro",
              department: "Medicine",
              level: "300 Level",
              matricNo: "FUO/2022/MED/012",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "I will focus on student health and wellness programs, academic support systems, and creating an inclusive environment where every student can thrive and reach their full potential.",
              votes: 0,
            },
            {
              id: 4,
              name: "David Okafor",
              department: "Business Administration",
              level: "300 Level",
              matricNo: "FUO/2022/BUS/089",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "My commitment is to improve student services, enhance campus security, and create more recreational facilities that will make our university experience more enjoyable and memorable.",
              votes: 0,
            },
          ],
        },
        {
          id: 3,
          title: "General Secretary",
          description: "Responsible for records and communication",
          maxVotes: 1,
          candidates: [
            {
              id: 5,
              name: "Amina Ibrahim",
              department: "Law",
              level: "300 Level",
              matricNo: "FUO/2022/LAW/023",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "I will ensure transparent communication between the student government and the student body, maintain accurate records, and advocate for student rights and welfare.",
              votes: 0,
            },
            {
              id: 6,
              name: "Emmanuel Obi",
              department: "Political Science",
              level: "300 Level",
              matricNo: "FUO/2022/POL/056",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "My goal is to improve information dissemination, create a digital archive of student government activities, and ensure that student voices are heard and documented.",
              votes: 0,
            },
          ],
        },
      ],
      totalVoters: 2847,
      votedCount: 1523,
    },
    {
      id: 2,
      title: "Faculty of Science Election 2024",
      description: "Election for faculty representatives",
      startDate: new Date("2024-11-10T09:00:00"),
      endDate: new Date("2024-11-10T16:00:00"),
      status: "completed",
      offices: [
        {
          id: 1,
          title: "Faculty President",
          description: "Represents the faculty in university affairs",
          maxVotes: 1,
          candidates: [
            {
              id: 7,
              name: "James Wilson",
              department: "Physics",
              level: "300 Level",
              matricNo: "FUO/2022/PHY/034",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "I will represent the interests of science students and work to improve laboratory facilities and research opportunities.",
              votes: 245,
            },
            {
              id: 8,
              name: "Blessing Eze",
              department: "Chemistry",
              level: "400 Level",
              matricNo: "FUO/2021/CHM/028",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "My focus will be on enhancing the academic experience of science students through workshops, seminars, and industry connections.",
              votes: 189,
            },
          ],
        },
      ],
      totalVoters: 500,
      votedCount: 434,
    },
    {
      id: 3,
      title: "Department Representatives Election 2025",
      description: "Election for departmental representatives",
      startDate: new Date("2025-01-20T10:00:00"),
      endDate: new Date("2025-01-20T15:00:00"),
      status: "upcoming",
      offices: [
        {
          id: 1,
          title: "Computer Science Rep",
          description: "Represents Computer Science students",
          maxVotes: 1,
          candidates: [
            {
              id: 9,
              name: "Peter Okonkwo",
              department: "Computer Science",
              level: "200 Level",
              matricNo: "FUO/2023/CS/045",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto: "I will advocate for better computing facilities and more practical programming courses.",
              votes: 0,
            },
            {
              id: 10,
              name: "Faith Adeyemi",
              department: "Computer Science",
              level: "300 Level",
              matricNo: "FUO/2022/CS/067",
              photo: "/placeholder.svg?height=200&width=300",
              manifesto:
                "I plan to organize coding competitions, tech talks, and create mentorship opportunities with industry professionals.",
              votes: 0,
            },
          ],
        },
      ],
      totalVoters: 150,
      votedCount: 0,
    },
  ]

  const [elections, setElections] = useState(initialElections)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching elections from API
    const fetchElections = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setElections(initialElections)
      } catch (error) {
        console.error("Error fetching elections:", error)
        toast.error("Failed to load elections")
      } finally {
        setLoading(false)
      }
    }

    fetchElections()
  }, [])

  // Get active elections
  const getActiveElections = () => {
    return elections.filter((election) => election.status === "active")
  }

  // Get upcoming elections
  const getUpcomingElections = () => {
    return elections.filter((election) => election.status === "upcoming")
  }

  // Get completed elections
  const getCompletedElections = () => {
    return elections.filter((election) => election.status === "completed")
  }

  // Get election by ID
  const getElectionById = (id) => {
    return elections.find((election) => election.id === id)
  }

  // Create new election (admin only)
  const createElection = async (electionData) => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newElection = {
        id: elections.length + 1,
        ...electionData,
        offices: [],
        totalVoters: 0,
        votedCount: 0,
      }

      setElections([...elections, newElection])
      toast.success("Election created successfully")
      return { success: true, election: newElection }
    } catch (error) {
      toast.error("Failed to create election")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Update election (admin only)
  const updateElection = async (id, electionData) => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedElections = elections.map((election) =>
        election.id === id ? { ...election, ...electionData } : election,
      )

      setElections(updatedElections)
      toast.success("Election updated successfully")
      return { success: true }
    } catch (error) {
      toast.error("Failed to update election")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Delete election (admin only)
  const deleteElection = async (id) => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedElections = elections.filter((election) => election.id !== id)
      setElections(updatedElections)
      toast.success("Election deleted successfully")
      return { success: true }
    } catch (error) {
      toast.error("Failed to delete election")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Add office to election (admin only)
  const addOffice = async (electionId, officeData) => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedElections = elections.map((election) => {
        if (election.id === electionId) {
          const newOffice = {
            id: election.offices.length + 1,
            ...officeData,
            candidates: [],
          }
          return {
            ...election,
            offices: [...election.offices, newOffice],
          }
        }
        return election
      })

      setElections(updatedElections)
      toast.success("Office added successfully")
      return { success: true }
    } catch (error) {
      toast.error("Failed to add office")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Add candidate to office (admin only)
  const addCandidate = async (electionId, officeId, candidateData) => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedElections = elections.map((election) => {
        if (election.id === electionId) {
          const updatedOffices = election.offices.map((office) => {
            if (office.id === officeId) {
              const newCandidate = {
                id: office.candidates.length + 1,
                ...candidateData,
                votes: 0,
              }
              return {
                ...office,
                candidates: [...office.candidates, newCandidate],
              }
            }
            return office
          })
          return {
            ...election,
            offices: updatedOffices,
          }
        }
        return election
      })

      setElections(updatedElections)
      toast.success("Candidate added successfully")
      return { success: true }
    } catch (error) {
      toast.error("Failed to add candidate")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  // Cast vote for a candidate
  const castVote = async (electionId, officeId, candidateId) => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedElections = elections.map((election) => {
        if (election.id === electionId) {
          const updatedOffices = election.offices.map((office) => {
            if (office.id === officeId) {
              const updatedCandidates = office.candidates.map((candidate) => {
                if (candidate.id === candidateId) {
                  return {
                    ...candidate,
                    votes: candidate.votes + 1,
                  }
                }
                return candidate
              })
              return {
                ...office,
                candidates: updatedCandidates,
              }
            }
            return office
          })
          return {
            ...election,
            offices: updatedOffices,
            votedCount: election.votedCount + 1,
          }
        }
        return election
      })

      setElections(updatedElections)
      return { success: true }
    } catch (error) {
      toast.error("Failed to cast vote")
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    elections,
    loading,
    getActiveElections,
    getUpcomingElections,
    getCompletedElections,
    getElectionById,
    createElection,
    updateElection,
    deleteElection,
    addOffice,
    addCandidate,
    castVote,
  }

  return <ElectionContext.Provider value={value}>{children}</ElectionContext.Provider>
}
