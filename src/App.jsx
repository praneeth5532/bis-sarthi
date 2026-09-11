import { useState } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/searchbar'
import Results from './components/Results'
import { askQuestion } from './services/api'
import './App.css'

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAskQuestion = async (question) => {
    setLoading(true)
    setQuestions((previous) => [...previous, { type: 'user', text: question }])
    try {
      const response = await askQuestion(question)
      setQuestions((previous) => [...previous, { type: 'assistant', text: response.answer, sources: response.sources }])
    } catch (error) {
      setQuestions((previous) => [...previous, { type: 'assistant error', text: error.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <h2>BIS Standards Assistant</h2>
        <p>Ask questions about the BIS documents included in this demo.</p>
        <SearchBar onAsk={handleAskQuestion} disabled={loading} />
        <Results questions={questions} />
      </main>
    </div>
  )
}

export default App
