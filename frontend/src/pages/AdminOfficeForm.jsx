"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useElection } from "../context/ElectionContext"
import { FaSave, FaArrowLeft, FaPlus, FaEdit, FaTrash } from "react-icons/fa"

const AdminOfficeForm = () => {
  const { electionId, officeId } = useParams()
  const navigate = useNavigate()
  const { getElectionById, addOffice, loading } = useElection()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    maxVotes: 1,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [election, setElection] = useState(null)
  const isEditMode = !!officeId

  useEffect(() => {
    if (!loading) {
      const foundElection = getElectionById(Number.parseInt(electionId))
      if (foundElection) {
        setElection(foundElection)

        if (isEditMode) {
          const office = foundElection.offices.find((o) => o.id === Number.parseInt(officeId))
          if (office) {
            setFormData({
              title: office.title,
              description: office.description,
              maxVotes: office.maxVotes || 1,
            })
          } else {
            navigate(`/admin/elections/edit/${electionId}`)
          }
        }
      } else {
        navigate("/admin/elections")
      }
    }
  }, [electionId, officeId, isEditMode, loading, getElectionById, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "maxVotes" ? Number.parseInt(value) : value,
    })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Office title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (formData.maxVotes < 1) {
      newErrors.maxVotes = "Maximum votes must be at least 1"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      if (isEditMode) {
        // Update office logic would go here
        console.log("Update office:", formData)
      } else {
        await addOffice(Number.parseInt(electionId), formData)
      }
      navigate(`/admin/elections/edit/${electionId}`)
    } catch (error) {
      console.error("Error saving office:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !election) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to={`/admin/elections/edit/${electionId}`}
          className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Election</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-teal-500">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Office" : "Add New Office"}</h1>
            <p className="text-gray-600">
              {isEditMode ? "Update the office details" : "Create a new office for this election"}
            </p>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg">
            <h3 className="font-semibold text-teal-800">{election.title}</h3>
            <p className="text-teal-600 text-sm">{election.description}</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
            <h2 className="text-xl font-semibold text-white">Office Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Office Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., President, Vice President, Secretary"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe the responsibilities and role of this office"
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Max Votes */}
              <div>
                <label htmlFor="maxVotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Votes per Voter
                </label>
                <select
                  id="maxVotes"
                  name="maxVotes"
                  value={formData.maxVotes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                >
                  <option value={1}>1 (Single Choice)</option>
                  <option value={2}>2 (Choose up to 2)</option>
                  <option value={3}>3 (Choose up to 3)</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">How many candidates can a voter select for this office?</p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave />
                      <span>{isEditMode ? "Update Office" : "Create Office"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Candidates Section (Edit mode only) */}
        {isEditMode && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Office Candidates</h2>
              <Link
                to={`/admin/elections/${electionId}/offices/${officeId}/candidates/new`}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <FaPlus />
                <span>Add Candidate</span>
              </Link>
            </div>

            {election.offices.find((o) => o.id === Number.parseInt(officeId))?.candidates.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {election.offices
                        .find((o) => o.id === Number.parseInt(officeId))
                        ?.candidates.map((candidate) => (
                          <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={candidate.photo || "/placeholder.svg?height=40&width=40"}
                                  alt={candidate.name}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                  <div className="text-sm text-gray-500">{candidate.matricNo}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{candidate.department}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{candidate.level}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Link
                                  to={`/admin/elections/${electionId}/offices/${officeId}/candidates/${candidate.id}/edit`}
                                  className="text-teal-600 hover:text-teal-900 bg-teal-100 p-2 rounded transition-colors"
                                  title="Edit Candidate"
                                >
                                  <FaEdit />
                                </Link>
                                <button
                                  className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded transition-colors"
                                  title="Delete Candidate"
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
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Candidates Added Yet</h3>
                <p className="text-gray-600 mb-4">Add candidates who will run for this office position.</p>
                <Link
                  to={`/admin/elections/${electionId}/offices/${officeId}/candidates/new`}
                  className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                >
                  Add Your First Candidate
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOfficeForm
