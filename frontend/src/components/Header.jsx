"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaVoteYea, FaUserShield } from "react-icons/fa"

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaVoteYea className="text-2xl text-yellow-300" />
            <span className="text-xl font-bold">FUO Voting</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`hover:text-yellow-300 transition-colors ${
                    isActive("/dashboard") ? "text-yellow-300" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/results"
                  className={`hover:text-yellow-300 transition-colors ${isActive("/results") ? "text-yellow-300" : ""}`}
                >
                  Results
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className={`hover:text-yellow-300 transition-colors flex items-center space-x-1 ${
                      isActive("/admin") ? "text-yellow-300" : ""
                    }`}
                  >
                    <FaUserShield />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
                    <FaUser />
                    <span>{user.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 hover:text-yellow-300 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`hover:text-yellow-300 transition-colors ${isActive("/") ? "text-yellow-300" : ""}`}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className={`hover:text-yellow-300 transition-colors ${isActive("/login") ? "text-yellow-300" : ""}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-800 px-4 py-2 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-teal-500">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="block py-2 hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/results"
                  className="block py-2 hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Results
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-2 hover:text-yellow-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block py-2 hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block py-2 hover:text-yellow-300 transition-colors text-left w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/"
                  className="block py-2 hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="block py-2 hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 hover:text-yellow-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
