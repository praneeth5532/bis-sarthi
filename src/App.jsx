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
    
    // Add user question to the list
    setQuestions([...questions, { type: 'user', text: question }])
    
    // TODO: Call API to get answer from backend
    // For now, we'll add a placeholder response
    setTimeout(() => {
      setQuestions(prev => [...prev, { type: 'assistant', text: 'Processing your question...' }])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <h2>BIS Standards Assistant</h2>
        <p>Ask questions about Indian Standards and BIS services</p>
        <SearchBar onAsk={handleAskQuestion} disabled={loading} />
        <Results questions={questions} />
      </div>
    </div>
  )
}

export default App