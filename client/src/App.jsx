import {
  useState,
  useCallback,
  useEffect,
} from "react"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"

import { auth } from "./firebase"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

import axios from "axios"
import { useDropzone } from "react-dropzone"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] =
    useState("")

  const [file, setFile] = useState(null)
  const [result, setResult] = useState("")
  const [skills, setSkills] = useState([])

  const [missingSkills, setMissingSkills] =
    useState([])

  const [score, setScore] = useState(0)

  const [aiSuggestions, setAiSuggestions] =
    useState("")

  const [jobDescription, setJobDescription] =
    useState("")

  const [matchScore, setMatchScore] =
    useState(0)

  const [loading, setLoading] = useState(false)

  const [darkMode, setDarkMode] =
    useState(false)

  const [user, setUser] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0])
  }, [])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  })

  const chartData = [
    {
      name: "ATS Score",
      value: score,
    },
    {
      name: "Match Score",
      value: matchScore,
    },
  ]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      alert("Signup Successful")
    } catch (error) {
      alert(error.message)
    }
  }

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      )

      alert("Login Successful")
    } catch (error) {
      alert(error.message)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)

    alert("Logged Out")
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume first")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()

      formData.append("resume", file)

      formData.append(
        "jobDescription",
        jobDescription
      )

      const response = await axios.post(
        "https://ai-resume-analyzer-j1jb.onrender.com/upload",
        formData
      )

      setResult(response.data.extractedText)

      setSkills(response.data.skills)

      setMissingSkills(
        response.data.missingSkills
      )

      setScore(response.data.atsScore)

      setMatchScore(
        response.data.matchScore
      )

      setAiSuggestions(
        response.data.aiSuggestions
      )

      alert("Resume Uploaded Successfully")
    } catch (error) {
      console.log(error)

      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
          : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-black"
      }`}
    >
      <div
        className={`p-8 rounded-2xl shadow-2xl max-w-5xl w-full transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 text-white"
            : "bg-white text-black"
        }`}
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center">
          AI Resume Analyzer 🚀
        </h1>

        <p className="text-center mb-6 text-gray-500">
          Smart ATS Resume Scanner &
          Job Match Analyzer
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className={`w-full p-3 rounded-lg border mb-3 outline-none ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-black border-gray-300"
          }`}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className={`w-full p-3 rounded-lg border mb-4 outline-none ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
              : "bg-white text-black border-gray-300"
          }`}
        />

        {/* Auth Buttons */}
        {!user ? (
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleSignup}
              className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-3 rounded-lg w-full"
            >
              Signup
            </button>

            <button
              onClick={handleLogin}
              className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-3 rounded-lg w-full"
            >
              Login
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-3 rounded-lg w-full mb-4"
          >
            Logout
          </button>
        )}

        {/* Dark Mode */}
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="mb-6 w-full bg-black hover:bg-gray-900 transition text-white py-3 rounded-lg"
        >
          {darkMode
            ? "Light Mode ☀️"
            : "Dark Mode 🌙"}
        </button>

        {user ? (
          <>
            {/* Upload Box */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer mb-4 transition ${
                isDragActive
                  ? "border-blue-500 bg-blue-100 text-black"
                  : darkMode
                  ? "border-gray-600 bg-gray-700 text-white"
                  : "border-gray-300 bg-gray-50 text-black"
              }`}
            >
              <input {...getInputProps()} />

              {file ? (
                <p className="text-green-500 font-semibold">
                  {file.name}
                </p>
              ) : isDragActive ? (
                <p>
                  Drop the resume here...
                </p>
              ) : (
                <p>
                  Drag & drop your
                  resume here, or click
                  to select
                </p>
              )}
            </div>

            {/* Job Description */}
            <textarea
              placeholder="Paste Job Description Here..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(
                  e.target.value
                )
              }
              className={`w-full border p-4 rounded-lg mb-4 outline-none ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600 placeholder-gray-300"
                  : "bg-white text-black border-gray-300"
              }`}
              rows={5}
            />

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-3 rounded-lg w-full"
            >
              {loading
                ? "Analyzing..."
                : "Upload Resume"}
            </button>

            {/* Resume Text */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                Extracted Resume Text
              </h2>

              <div
                className={`p-4 rounded-lg h-[200px] overflow-y-scroll text-sm ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {result}
              </div>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                Detected Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {skills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Match Score */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                Resume Match Score
              </h2>

              <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-purple-600 h-full text-white text-center"
                  style={{
                    width: `${matchScore}%`,
                  }}
                >
                  {matchScore}%
                </div>
              </div>
            </div>

            {/* ATS Score */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                ATS Score
              </h2>

              <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                <div
                  className="bg-green-500 h-full text-white text-center"
                  style={{
                    width: `${score}%`,
                  }}
                >
                  {score}%
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                Missing Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {missingSkills.map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Charts */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                Score Analytics
              </h2>

              <div
                className={`p-4 rounded-xl ${
                  darkMode
                    ? "bg-gray-700"
                    : "bg-gray-100"
                }`}
              >
                <ResponsiveContainer
                  width="100%"
                  height={250}
                >
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />

                    <Bar
                      dataKey="value"
                      fill="#6366f1"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Resume Tips */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                Resume Tips
              </h2>

              <div
                className={`p-4 rounded-xl text-sm ${
                  darkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                <ul className="list-disc ml-5 space-y-2">
                  <li>
                    Keep your resume
                    limited to 1–2 pages.
                  </li>

                  <li>
                    Add GitHub and
                    LinkedIn profile
                    links.
                  </li>

                  <li>
                    Highlight measurable
                    achievements.
                  </li>

                  <li>
                    Mention real-world
                    projects clearly.
                  </li>

                  <li>
                    Use clean formatting
                    for ATS systems.
                  </li>
                </ul>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="mt-6">
              <h2 className="font-bold mb-2 text-lg">
                AI Suggestions
              </h2>

              <div
                className={`border p-4 rounded-xl text-sm whitespace-pre-wrap ${
                  darkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
              >
                {aiSuggestions}
              </div>
            </div>

            {/* Download PDF */}
            <button
              onClick={() =>
                window.open(
                  "https://ai-resume-analyzer-j1jb.onrender.com/download-report"
                )
              }
              className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-3 rounded-lg w-full mt-6"
            >
              Download Analysis PDF
            </button>
          </>
        ) : (
          <p className="text-center text-red-500 font-bold mt-6">
            Please login first to use
            the app
          </p>
        )}
      </div>
    </div>
  )
}

export default App