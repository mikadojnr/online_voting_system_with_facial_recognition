"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useElection } from "../context/ElectionContext"
import { FaSave, FaArrowLeft, FaPlus, FaEdit, FaTrash, FaUsers } from "react-icons/fa"

const AdminElectionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getElectionById, createElection, updateElection, loading } = useElection()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "upcoming",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const isEditMode = !!id

  useEffect(() => {
    if (isEditMode && !loading) {
      const election = getElectionById(Number.parseInt(id))
      if (election) {
        // Format dates for datetime-local input
        const formatDateForInput = (dateString) => {
          const date = new Date(dateString)
          return date.toISOString().slice(0, 16)
        }

        setFormData({
          title: election.title,
          description: election.description,
          startDate: formatDateForInput(election.startDate),
          endDate: formatDateForInput(election.endDate),
          status: election.status,
        })
      } else {
        navigate("/admin/elections")
      }
    }
  }, [isEditMode, id, loading, getElectionById, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
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
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)

      if (start >= end) {
        newErrors.endDate = "End date must be after start date"
      }
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
        await updateElection(Number.parseInt(id), formData)
      } else {
        await createElection(formData)
      }
      navigate("/admin/elections")
    } catch (error) {
      console.error("Error saving election:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentElection = isEditMode ? getElectionById(Number.parseInt(id)) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/admin/elections"
          className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Elections</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-teal-500">
          <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Election" : "Create New Election"}</h1>
          <p className="text-gray-600">
            {isEditMode ? "Update the details of this election" : "Fill in the details to create a new election"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
            <h2 className="text-xl font-semibold text-white">Election Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Election Title*
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
                  placeholder="e.g., Student Union Government Election 2024"
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
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Provide a brief description of this election"
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date and Time*
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                      errors.startDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date and Time*
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                      errors.endDate ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
                </div>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
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
                      <span>{isEditMode ? "Update Election" : "Create Election"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Offices Section (Edit mode only) */}
        {isEditMode && currentElection && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Election Offices</h2>
              <Link
                to={`/admin/elections/${id}/offices/new`}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg"
              >
                <FaPlus />
                <span>Add Office</span>
              </Link>
            </div>

            {currentElection.offices.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Office Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Candidates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentElection.offices.map((office) => (
                        <tr key={office.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{office.title}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2">{office.description}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <FaUsers className="mr-2 text-teal-600" />
                              {office.candidates.length} {office.candidates.length === 1 ? "candidate" : "candidates"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/admin/elections/${id}/offices/${office.id}/edit`}
                                className="text-teal-600 hover:text-teal-900 bg-teal-100 p-2 rounded transition-colors"
                                title="Edit Office"
                              >
                                <FaEdit />
                              </Link>
                              <Link
                                to={`/admin/elections/${id}/offices/${office.id}/candidates/new`}
                                className="text-green-600 hover:text-green-900 bg-green-100 p-2 rounded transition-colors"
                                title="Add Candidate"
                              >
                                <FaPlus />
                              </Link>
                              <button
                                className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded transition-colors"
                                title="Delete Office"
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
              <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-100">
                <div className="text-6xl mb-4">🗳️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Offices Added Yet</h3>
                <p className="text-gray-600 mb-4">
                  Add offices to this election so candidates can run for these positions.
                </p>
                <Link
                  to={`/admin/elections/${id}/offices/new`}
                  className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                >
                  Add Your First Office
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminElectionForm
