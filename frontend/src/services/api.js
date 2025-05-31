import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  verifyFace: (faceData) => api.post("/auth/verify-face", { face_data: faceData }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
}

// Elections API endpoints
export const electionsAPI = {
  getAll: () => api.get("/elections"),
  getById: (id) => api.get(`/elections/${id}`),
  getActive: () => api.get("/elections/active"),
  getUpcoming: () => api.get("/elections/upcoming"),
  getCompleted: () => api.get("/elections/completed"),
}

// Voting API endpoints
export const votingAPI = {
  castVote: (electionId, votes) => api.post(`/voting/elections/${electionId}/vote`, { votes }),
  getVotingHistory: () => api.get("/voting/history"),
  checkVotingStatus: (electionId) => api.get(`/voting/elections/${electionId}/status`),
}

// Admin API endpoints
export const adminAPI = {
  // Elections
  createElection: (data) => api.post("/admin/elections", data),
  updateElection: (id, data) => api.put(`/admin/elections/${id}`, data),
  deleteElection: (id) => api.delete(`/admin/elections/${id}`),

  // Offices
  createOffice: (electionId, data) => api.post(`/admin/elections/${electionId}/offices`, data),
  updateOffice: (officeId, data) => api.put(`/admin/offices/${officeId}`, data),
  deleteOffice: (officeId) => api.delete(`/admin/offices/${officeId}`),

  // Candidates
  createCandidate: (officeId, data) => api.post(`/admin/offices/${officeId}/candidates`, data),
  updateCandidate: (candidateId, data) => api.put(`/admin/candidates/${candidateId}`, data),
  deleteCandidate: (candidateId) => api.delete(`/admin/candidates/${candidateId}`),

  // Analytics
  getElectionStats: (electionId) => api.get(`/admin/elections/${electionId}/stats`),
  getSystemStats: () => api.get("/admin/stats"),

  // Users
  getUsers: () => api.get("/admin/users"),
  updateUser: (userId, data) => api.put(`/admin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
}

// Face Recognition API endpoints
export const faceAPI = {
  registerFace: (faceData) => api.post("/face/register", { face_data: faceData }),
  verifyFace: (faceData) => api.post("/face/verify", { face_data: faceData }),
  updateFace: (faceData) => api.put("/face/update", { face_data: faceData }),
}

// Results API endpoints
export const resultsAPI = {
  getElectionResults: (electionId) => api.get(`/results/elections/${electionId}`),
  getAllResults: () => api.get("/results"),
  exportResults: (electionId, format = "json") => api.get(`/results/elections/${electionId}/export?format=${format}`),
}

export default api
