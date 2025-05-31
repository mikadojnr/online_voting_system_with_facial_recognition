"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useElection } from "../context/ElectionContext"
import { FaSave, FaArrowLeft, FaCamera, FaUser } from "react-icons/fa"

const AdminCandidateForm = () => {
  const { electionId, officeId, candidateId } = useParams()
  const navigate = useNavigate()
  const { getElectionById, addCandidate, loading } = useElection()

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    level: "",
    matricNo: "",
    manifesto: "",
    photo: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [election, setElection] = useState(null)
  const [office, setOffice] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const isEditMode = !!candidateId

  useEffect(() => {
    if (!loading) {
      const foundElection = getElectionById(Number.parseInt(electionId))
      if (foundElection) {
        setElection(foundElection)

        const foundOffice = foundElection.offices.find((o) => o.id === Number.parseInt(officeId))
        if (foundOffice) {
          setOffice(foundOffice)

          if (isEditMode) {
            const candidate = foundOffice.candidates.find((c) => c.id === Number.parseInt(candidateId))
            if (candidate) {
              setFormData({
                name: candidate.name,
                department: candidate.department,
                level: candidate.level,
                matricNo: candidate.matricNo,
                manifesto: candidate.manifesto,
                photo: candidate.photo || "",
              })
              setPhotoPreview(candidate.photo)
            } else {
              navigate(`/admin/elections/${electionId}/offices/${officeId}/edit`)
            }
          }
        } else {
          navigate(`/admin/elections/edit/${electionId}`)
        }
      } else {
        navigate("/admin/elections")
      }
    }
  }, [electionId, officeId, candidateId, isEditMode, loading, getElectionById, navigate])

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
        setFormData({
          ...formData,
          photo: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Candidate name is required"
    }

    if (!formData.department.trim()) {
      newErrors.department = "Department is required"
    }

    if (!formData.level.trim()) {
      newErrors.level = "Level is required"
    }

    if (!formData.matricNo.trim()) {
      newErrors.matricNo = "Matriculation number is required"
    }

    if (!formData.manifesto.trim()) {
      newErrors.manifesto = "Manifesto is required"
    } else if (formData.manifesto.length < 50) {
      newErrors.manifesto = "Manifesto must be at least 50 characters long"
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
        // Update candidate logic would go here
        console.log("Update candidate:", formData)
      } else {
        await addCandidate(Number.parseInt(electionId), Number.parseInt(officeId), formData)
      }
      navigate(`/admin/elections/${electionId}/offices/${officeId}/edit`)
    } catch (error) {
      console.error("Error saving candidate:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !election || !office) {
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
          to={`/admin/elections/${electionId}/offices/${officeId}/edit`}
          className="flex items-center text-teal-600 hover:text-teal-800 mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back to Office</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-teal-500">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Candidate" : "Add New Candidate"}</h1>
            <p className="text-gray-600">
              {isEditMode ? "Update the candidate details" : "Add a new candidate for this office"}
            </p>
          </div>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg">
            <h3 className="font-semibold text-teal-800">{election.title}</h3>
            <p className="text-teal-600 text-sm">
              {office.title} - {office.description}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6">
            <h2 className="text-xl font-semibold text-white">Candidate Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Photo Upload Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Candidate Photo</label>
                  <div className="relative">
                    <div className="w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      {photoPreview ? (
                        <img
                          src={photoPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUser className="text-6xl text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="photo"
                      className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-3 rounded-full cursor-pointer hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 shadow-lg"
                    >
                      <FaCamera />
                    </label>
                    <input type="file" id="photo" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </div>
                  <p className="text-sm text-gray-500 mt-4">Upload a clear photo of the candidate</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter candidate's full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Department and Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                      Department*
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.department ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Medicine">Medicine</option>
                      <option value="Law">Law</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Political Science">Political Science</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                    </select>
                    {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                      Level*
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.level ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Level</option>
                      <option value="100 Level">100 Level</option>
                      <option value="200 Level">200 Level</option>
                      <option value="300 Level">300 Level</option>
                      <option value="400 Level">400 Level</option>
                      <option value="500 Level">500 Level</option>
                      <option value="600 Level">600 Level</option>
                    </select>
                    {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                  </div>
                </div>

                {/* Matriculation Number */}
                <div>
                  <label htmlFor="matricNo" className="block text-sm font-medium text-gray-700 mb-1">
                    Matriculation Number*
                  </label>
                  <input
                    type="text"
                    id="matricNo"
                    name="matricNo"
                    value={formData.matricNo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                      errors.matricNo ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., FUO/2021/CS/001"
                  />
                  {errors.matricNo && <p className="mt-1 text-sm text-red-600">{errors.matricNo}</p>}
                </div>

                {/* Manifesto */}
                <div>
                  <label htmlFor="manifesto" className="block text-sm font-medium text-gray-700 mb-1">
                    Manifesto*
                  </label>
                  <textarea
                    id="manifesto"
                    name="manifesto"
                    value={formData.manifesto}
                    onChange={handleInputChange}
                    rows="6"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                      errors.manifesto ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Write the candidate's manifesto, vision, and plans for the office..."
                  ></textarea>
                  <div className="flex justify-between items-center mt-1">
                    {errors.manifesto && <p className="text-sm text-red-600">{errors.manifesto}</p>}
                    <p className="text-sm text-gray-500 ml-auto">{formData.manifesto.length} characters (minimum 50)</p>
                  </div>
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
                        <span>{isEditMode ? "Update Candidate" : "Add Candidate"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminCandidateForm
