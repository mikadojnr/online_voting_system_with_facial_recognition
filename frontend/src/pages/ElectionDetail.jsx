"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useElection } from "../context/ElectionContext"
import CandidateCard from "../components/CandidateCard"
import FaceRecognition from "../components/FaceRecognition"
import {
  FaClock,
  FaUsers,
  FaVoteYea,
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCheck,
  FaTimes,
  FaHome,
} from "react-icons/fa"

const ElectionDetail = () => {
  const { id } = useParams()
  const electionId = Number.parseInt(id)
  const navigate = useNavigate()
  const { user, castVote } = useAuth()
  const { getElectionById, castVote: updateElectionVotes, loading } = useElection()
  const [election, setElection] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [selectedVotes, setSelectedVotes] = useState({}) // Store selected candidates per office
  const [showCandidateModal, setShowCandidateModal] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [selectedOffice, setSelectedOffice] = useState(null)
  const [showFaceVerification, setShowFaceVerification] = useState(false)
  const [isSubmittingVotes, setIsSubmittingVotes] = useState(false)
  const [voteSubmissionStatus, setVoteSubmissionStatus] = useState(null) // 'success', 'error', null
  const [submittedVotes, setSubmittedVotes] = useState([])
  const [errorMessage, setErrorMessage] = useState("")

  // Check if user has already voted for this election
  const hasVotedForElection = user?.votedOffices?.some((vote) => vote.electionId === electionId)

  useEffect(() => {
    if (!loading) {
      const foundElection = getElectionById(electionId)
      if (foundElection) {
        setElection(foundElection)
      } else {
        navigate("/dashboard")
      }
    }
  }, [electionId, loading, getElectionById, navigate])

  // Calculate time remaining
  useEffect(() => {
    if (!election) return

    const timer = setInterval(() => {
      const now = new Date()
      const endDate = new Date(election.endDate)
      const difference = endDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeRemaining({ days, hours, minutes, seconds })
      } else {
        setTimeRemaining(null)
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [election])

  const handleCandidateClick = (candidate, office) => {
    console.log("Candidate clicked:", candidate.name, "Office:", office.title) // Debug log

    // Prevent selection if already voted or election not active
    if (hasVotedForElection || !isActive || voteSubmissionStatus === "success") {
      console.log(
        "Voting disabled - hasVoted:",
        hasVotedForElection,
        "isActive:",
        isActive,
        "status:",
        voteSubmissionStatus,
      )
      return
    }

    setSelectedCandidate(candidate)
    setSelectedOffice(office)
    setShowCandidateModal(true)
    console.log("Modal should open now") // Debug log
  }

  const handleConfirmSelection = () => {
    console.log("Confirming selection:", selectedCandidate.name, "for", selectedOffice.title)
    setSelectedVotes({
      ...selectedVotes,
      [selectedOffice.id]: selectedCandidate,
    })
    setShowCandidateModal(false)
    setSelectedCandidate(null)
    setSelectedOffice(null)
  }

  const handleCancelSelection = () => {
    console.log("Canceling selection")
    setShowCandidateModal(false)
    setSelectedCandidate(null)
    setSelectedOffice(null)
  }

  const handleRemoveSelection = (officeId) => {
    if (hasVotedForElection || voteSubmissionStatus === "success") {
      return
    }

    const newSelectedVotes = { ...selectedVotes }
    delete newSelectedVotes[officeId]
    setSelectedVotes(newSelectedVotes)
  }

  const handleFinalSubmit = () => {
    if (Object.keys(selectedVotes).length === 0 || hasVotedForElection || voteSubmissionStatus === "success") return
    setShowFaceVerification(true)
  }

  const handleFaceVerificationSuccess = async () => {
    setShowFaceVerification(false)
    setIsSubmittingVotes(true)
    setVoteSubmissionStatus(null)
    setErrorMessage("")

    try {
      const votesToSubmit = []

      // Submit all votes
      for (const [officeId, candidate] of Object.entries(selectedVotes)) {
        const result = await castVote(electionId, Number.parseInt(officeId), candidate.id)

        if (result.success) {
          await updateElectionVotes(electionId, Number.parseInt(officeId), candidate.id)
          const office = election.offices.find((o) => o.id === Number.parseInt(officeId))
          votesToSubmit.push({
            office: office?.title,
            candidate: candidate.name,
            department: candidate.department,
          })
        } else {
          throw new Error(result.message || "Failed to submit vote")
        }
      }

      if (votesToSubmit.length > 0) {
        setSubmittedVotes(votesToSubmit)
        setVoteSubmissionStatus("success")
        setSelectedVotes({}) // Clear selections after successful submission
      } else {
        throw new Error("No votes were successfully submitted")
      }
    } catch (error) {
      console.error("Vote submission error:", error)
      setVoteSubmissionStatus("error")
      setErrorMessage(error.message || "An error occurred while submitting your votes. Please try again.")
    } finally {
      setIsSubmittingVotes(false)
    }
  }

  const handleFaceVerificationCancel = () => {
    setShowFaceVerification(false)
  }

  const handleGoToDashboard = () => {
    navigate("/dashboard")
  }

  if (loading || !election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading election details...</p>
        </div>
      </div>
    )
  }

  // Check if election is active
  const isActive = election.status === "active"
  const isUpcoming = election.status === "upcoming"

  // Calculate voting progress
  const votingProgress = (election.votedCount / election.totalVoters) * 100 || 0

  // Check if voting is disabled (already voted or votes submitted successfully)
  const isVotingDisabled = hasVotedForElection || voteSubmissionStatus === "success" || !isActive

  console.log(
    "Render state - showModal:",
    showCandidateModal,
    "selectedCandidate:",
    selectedCandidate?.name,
    "selectedOffice:",
    selectedOffice?.title,
  ) // Debug log

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-teal-500">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{election.title}</h1>
              <p className="text-gray-600">{election.description}</p>
            </div>
            <div className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 px-4 py-2 rounded-lg text-center">
              <div className="text-sm font-medium mb-1">Status</div>
              <div className="text-lg font-bold">{isActive ? "Active" : isUpcoming ? "Upcoming" : "Completed"}</div>
            </div>
          </div>
        </div>

        {/* Vote Submission Success */}
        {voteSubmissionStatus === "success" && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-8 mb-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-green-800 mb-2">Vote Submitted Successfully!</h2>
              <p className="text-green-700 text-lg">
                Thank you for participating in the {election.title}. Your votes have been securely recorded.
              </p>
            </div>

            {/* Vote Summary */}
            <div className="bg-white rounded-lg p-6 mb-6 border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Vote Summary</h3>
              <div className="space-y-3">
                {submittedVotes.map((vote, index) => (
                  <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <div className="text-left">
                      <div className="font-medium text-gray-800">{vote.office}</div>
                      <div className="text-sm text-gray-600">
                        {vote.candidate} - {vote.department}
                      </div>
                    </div>
                    <FaCheckCircle className="text-green-500" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-green-200 text-sm text-gray-600">
                <p>Vote ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p>Submitted: {new Date().toLocaleString()}</p>
              </div>
            </div>

            <button
              onClick={handleGoToDashboard}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-8 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg text-lg"
            >
              <FaHome />
              <span>Go to Dashboard</span>
            </button>
          </div>
        )}

        {/* Vote Submission Error */}
        {voteSubmissionStatus === "error" && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg p-8 mb-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimes className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-red-800 mb-2">Vote Submission Failed</h2>
              <p className="text-red-700 text-lg mb-4">
                We encountered an error while submitting your votes. Please try again.
              </p>
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <p className="text-red-600 font-medium">{errorMessage}</p>
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setVoteSubmissionStatus(null)}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={handleGoToDashboard}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-colors flex items-center space-x-2"
              >
                <FaHome />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        )}

        {/* Only show election content if not in success state */}
        {voteSubmissionStatus !== "success" && (
          <>
            {/* Election Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Time Remaining */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaClock className="text-2xl text-teal-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {isActive ? "Time Remaining" : isUpcoming ? "Starts In" : "Ended"}
                  </h3>
                </div>
                {timeRemaining && isActive ? (
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-2xl font-bold text-teal-600">{timeRemaining.days}</div>
                      <div className="text-xs text-gray-600">Days</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-600">{timeRemaining.hours}</div>
                      <div className="text-xs text-gray-600">Hours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-600">{timeRemaining.minutes}</div>
                      <div className="text-xs text-gray-600">Minutes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-teal-600">{timeRemaining.seconds}</div>
                      <div className="text-xs text-gray-600">Seconds</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {isUpcoming ? (
                      <div className="text-teal-600 font-semibold">Not Started Yet</div>
                    ) : !isActive ? (
                      <div className="text-red-600 font-semibold">Election Ended</div>
                    ) : (
                      <div className="text-teal-600 font-semibold">Active Now</div>
                    )}
                  </div>
                )}
              </div>

              {/* Voting Progress */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaUsers className="text-2xl text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Voting Progress</h3>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Votes Cast</span>
                    <span>
                      {election.votedCount} / {election.totalVoters}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${votingProgress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-500">{votingProgress.toFixed(1)}%</div>
              </div>

              {/* Your Status */}
              <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <FaVoteYea className="text-2xl text-yellow-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Your Status</h3>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Student ID: {user.studentId}</div>
                  <div className="text-sm text-gray-600">
                    Selected: {Object.keys(selectedVotes).length} / {election.offices.length} offices
                  </div>
                  {hasVotedForElection ? (
                    <div className="flex items-center text-green-600 mt-2">
                      <FaCheckCircle className="mr-2" />
                      <span className="font-medium">Already Voted</span>
                    </div>
                  ) : !isActive ? (
                    <div className="flex items-center text-orange-600 mt-2">
                      <FaExclamationTriangle className="mr-2" />
                      <span className="font-medium">{isUpcoming ? "Voting not started yet" : "Voting closed"}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Election not active warning */}
            {!isActive && !hasVotedForElection && (
              <div
                className={`${isUpcoming ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"} border rounded-lg p-4 mb-8`}
              >
                <div className="flex items-center">
                  <div
                    className={`${isUpcoming ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"} rounded-full p-2 mr-3`}
                  >
                    <FaExclamationTriangle />
                  </div>
                  <div>
                    <h4 className={`font-semibold ${isUpcoming ? "text-blue-800" : "text-gray-800"}`}>
                      {isUpcoming ? "Election Not Started Yet" : "Election Has Ended"}
                    </h4>
                    <p className={`text-sm ${isUpcoming ? "text-blue-700" : "text-gray-700"}`}>
                      {isUpcoming
                        ? `This election will start on ${new Date(election.startDate).toLocaleString()}.`
                        : `This election ended on ${new Date(election.endDate).toLocaleString()}. You can view the results.`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Already Voted Message */}
            {hasVotedForElection && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-800 rounded-full p-2 mr-3">
                    <FaCheckCircle />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">Vote Successfully Submitted</h4>
                    <p className="text-sm text-green-700">
                      You have already cast your vote for this election. Thank you for participating!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-teal-800 mb-3">Voting Instructions</h3>
              <ul className="space-y-2 text-teal-700">
                <li>• Click on any candidate card to view their full details</li>
                <li>• Select one candidate per office from the modal</li>
                <li>• Review your selections in the summary below</li>
                <li>• Click "Submit All Votes" to finalize your choices</li>
                <li>• Facial verification is required before final submission</li>
                <li>• Once submitted, your votes cannot be changed</li>
              </ul>
            </div>

            {/* Offices and Candidates */}
            {election.offices.map((office) => (
              <div key={office.id} className="mb-12 bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{office.title}</h2>

                  {/* Show if user has selected a candidate for this office */}
                  {selectedVotes[office.id] && (
                    <div className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <FaCheck className="mr-1" />
                      <span>Selected: {selectedVotes[office.id].name}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-gray-700">{office.description}</p>
                </div>

                <div className="flex justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                    {office.candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        election={election}
                        office={office}
                        onVote={handleCandidateClick}
                        disabled={isVotingDisabled}
                        isSelected={selectedVotes[office.id]?.id === candidate.id}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Selected Votes Summary */}
            {Object.keys(selectedVotes).length > 0 && isActive && !hasVotedForElection && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-teal-500">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Selected Votes</h3>
                <div className="space-y-3">
                  {Object.entries(selectedVotes).map(([officeId, candidate]) => {
                    const office = election.offices.find((o) => o.id === Number.parseInt(officeId))
                    return (
                      <div key={officeId} className="flex items-center justify-between bg-teal-50 p-3 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-800">{office.title}</div>
                          <div className="text-sm text-gray-600">{candidate.name}</div>
                        </div>
                        <button
                          onClick={() => handleRemoveSelection(Number.parseInt(officeId))}
                          className="text-red-600 hover:text-red-800 text-sm"
                          disabled={isVotingDisabled}
                        >
                          Remove
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleFinalSubmit}
                    disabled={isSubmittingVotes || isVotingDisabled}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg"
                  >
                    {isSubmittingVotes ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting Votes...</span>
                      </>
                    ) : (
                      <>
                        <FaVoteYea />
                        <span>Submit All Votes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Candidate Details Modal */}
      {showCandidateModal && selectedCandidate && selectedOffice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <img
                src={selectedCandidate.photo || "/placeholder.svg?height=150&width=150"}
                alt={selectedCandidate.name}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-teal-500"
              />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedCandidate.name}</h3>
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 px-3 py-1 rounded-full inline-block mb-4">
                {selectedOffice.title}
              </div>
              <div className="text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Department:</span> {selectedCandidate.department}
                </p>
                <p>
                  <span className="font-medium">Level:</span> {selectedCandidate.level}
                </p>
                <p>
                  <span className="font-medium">Matric No:</span> {selectedCandidate.matricNo}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Manifesto:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{selectedCandidate.manifesto}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCancelSelection}
                className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmSelection}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-3 px-6 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Face Recognition Modal */}
      {showFaceVerification && (
        <FaceRecognition
          mode="verify"
          onSuccess={handleFaceVerificationSuccess}
          onCancel={handleFaceVerificationCancel}
        />
      )}
    </div>
  )
}

export default ElectionDetail
