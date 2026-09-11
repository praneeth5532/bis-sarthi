import { useState } from 'react'
import Navbar from './components/navbar'
import SearchBar from './components/SearchBar'
import Results from './components/Results'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAskQuestion = async (question) => {
    setLoading(true)

    setQuestions([...questions, { type: 'user', text: question }])

    setTimeout(() => {
      setQuestions((prev) => [...prev, { type: 'assistant', text: 'Processing your question...' }])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">AI-Powered Standards Desk</span>
            <h2>Ask. Understand. Comply.</h2>
            <p>
              Search standards, decode requirements, and get quick answers on BIS norms,
              certification paths, and compliance support.
            </p>
          </div>

          <div className="hero-pills" aria-label="Quick highlights">
            <span>Standards</span>
            <span>Certification</span>
            <span>Compliance</span>
          </div>
        </section>

        <SearchBar onAsk={handleAskQuestion} disabled={loading} />
        <Results questions={questions} />
      </main>
    </div>
  )
}

export default App