import { Link } from "react-router-dom"
import { FaShieldAlt, FaEye, FaChartBar, FaLock, FaUsers, FaVoteYea, FaArrowRight } from "react-icons/fa"

const LandingPage = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-3xl text-teal-600" />,
      title: "Facial Recognition Security",
      description: "Advanced CNN-based facial recognition ensures only verified students can vote.",
    },
    {
      icon: <FaLock className="text-3xl text-teal-600" />,
      title: "Secure Voting",
      description: "End-to-end encryption and secure protocols protect your vote integrity.",
    },
    {
      icon: <FaChartBar className="text-3xl text-teal-600" />,
      title: "Real-time Results",
      description: "View live election results and statistics as votes are counted.",
    },
    {
      icon: <FaEye className="text-3xl text-teal-600" />,
      title: "Transparent Process",
      description: "Complete transparency in the voting process with audit trails.",
    },
    {
      icon: <FaUsers className="text-3xl text-teal-600" />,
      title: "Student-Centered",
      description: "Designed specifically for Federal University Otuoke students.",
    },
    {
      icon: <FaVoteYea className="text-3xl text-teal-600" />,
      title: "Easy to Use",
      description: "Intuitive interface makes voting simple and accessible for everyone.",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-t from-teal-600 via-teal-700 to-cyan-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Secure Online Voting with
              <span className="text-yellow-300"> Facial Recognition</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-teal-100">
              Empowering Federal University Otuoke students with a secure, transparent, and efficient voting system for
              SUG elections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-800 px-8 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Login to Vote</span>
                <FaArrowRight />
              </Link>
              <Link
                to="/register"
                className="border-2 border-yellow-300 text-yellow-300 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 hover:text-teal-800 transition-all duration-200 shadow-lg"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Our Voting System?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to ensure the highest standards of security, transparency, and user
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to cast your vote securely</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Register & Verify</h3>
                <p className="text-gray-600">Create your account and register your face for secure authentication.</p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Login & Authenticate</h3>
                <p className="text-gray-600">
                  Login with your credentials and verify your identity using facial recognition.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Vote Securely</h3>
                <p className="text-gray-600">Browse candidates and cast your vote with confidence and security.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make Your Voice Heard?</h2>
          <p className="text-xl mb-8 text-teal-100">
            Join thousands of FUO students in shaping the future of our university.
          </p>
          <Link
            to="/register"
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-teal-800 px-8 py-3 rounded-lg font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 inline-flex items-center space-x-2 shadow-lg"
          >
            <span>Get Started Today</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
