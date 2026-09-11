import { useState } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import Results from './components/Results'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAskQuestion = async (question) => {
    setLoading(true)

    setQuestions((prev) => [...prev, { type: 'user', text: question }])

    setTimeout(() => {
      setQuestions((prev) => [
        ...prev,
        {
          type: 'assistant',
          text: `I’ve reviewed the compliance context. Here’s a quick BIS-focused response for: “${question}”. I can help with standards mapping, product classifications, and certification guidance next.`
        }
      ])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="main-content">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow">AI-Powered Standards Desk</span>
            <h1>Ask. Understand. Certify.</h1>
            <p>
              Search standards, decode compliance requirements, and move from uncertainty to
              action with a smarter BIS support experience.
            </p>

            <div className="quick-badges" aria-label="Quick highlights">
              <span>Standards</span>
              <span>Certification</span>
              <span>Compliance</span>
            </div>
          </div>

          <div className="hero-metrics" aria-label="Inspection summary">
            <div className="metric-card accent">
              <strong>8.4K+</strong>
              <span>standards indexed</span>
            </div>
            <div className="metric-card">
              <strong>4.8x</strong>
              <span>faster guidance</span>
            </div>
            <div className="metric-card">
              <strong>24/7</strong>
              <span>compliance support</span>
            </div>
          </div>
        </section>

        <section className="feature-strip" aria-label="Key capabilities">
          <article className="feature-card">
            <span className="feature-icon">◎</span>
            <div>
              <h3>Standards mapping</h3>
              <p>Find the exact IS references and what they mean for your product.</p>
            </div>
          </article>
          <article className="feature-card">
            <span className="feature-icon">△</span>
            <div>
              <h3>Certification path</h3>
              <p>Understand licensing, testing, and approval steps with clarity.</p>
            </div>
          </article>
          <article className="feature-card">
            <span className="feature-icon">✦</span>
            <div>
              <h3>Risk insight</h3>
              <p>Spot compliance gaps early and get practical next actions.</p>
            </div>
          </article>
        </section>

        <SearchBar onAsk={handleAskQuestion} disabled={loading} />
        <Results questions={questions} />
      </main>
    </div>
  )
}

export default App