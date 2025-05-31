import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "./context/AuthContext"
import { ElectionProvider } from "./context/ElectionContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Header from "./components/Header"
import Footer from "./components/Footer"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegistrationPage from "./pages/RegistrationPage"
import VotingDashboard from "./pages/VotingDashboard"
import ElectionDetail from "./pages/ElectionDetail"
import VotingConfirmation from "./pages/VotingConfirmation"
import ResultsPage from "./pages/ResultsPage"
import ProfilePage from "./pages/ProfilePage"
import AdminDashboard from "./pages/AdminDashboard"
import AdminElections from "./pages/AdminElections"
import AdminElectionForm from "./pages/AdminElectionForm"
import AdminOfficeForm from "./pages/AdminOfficeForm"
import AdminCandidateForm from "./pages/AdminCandidateForm"

function App() {
  return (
    <AuthProvider>
      <ElectionProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <VotingDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/election/:id"
                  element={
                    <ProtectedRoute>
                      <ElectionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vote-confirm/:electionId/:officeId/:candidateId"
                  element={
                    <ProtectedRoute>
                      <VotingConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results"
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/:id"
                  element={
                    <ProtectedRoute>
                      <ResultsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/elections"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminElections />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/elections/new"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminElectionForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/elections/edit/:id"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminElectionForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/elections/:electionId/offices/new"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminOfficeForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/elections/:electionId/offices/:officeId/edit"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminOfficeForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/elections/:electionId/offices/:officeId/candidates/new"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminCandidateForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/elections/:electionId/offices/:officeId/candidates/:candidateId/edit"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminCandidateForm />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
      </ElectionProvider>
    </AuthProvider>
  )
}

export default App
