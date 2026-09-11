import { useState } from 'react'

function SearchBar({ onAsk, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = (event) => {
    event?.preventDefault()
    if (input.trim() === '') {
      alert('Please enter a question')
      return
    }
    onAsk(input)
    setInput('') // Clear input after sending
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask your question about BIS standards..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        className="search-input"
      />
      <button type="submit" disabled={disabled} className="ask-button">
        {disabled ? 'Loading...' : 'Ask'}
      </button>
    </form>
  )
}

export default SearchBar
