import { useState } from 'react'

function SearchBar({ onAsk, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = () => {
    if (input.trim() === '') {
      alert('Please enter a question')
      return
    }
    onAsk(input)
    setInput('') // Clear input after sending
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Ask your question about BIS standards..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        className="search-input"
      />
      <button onClick={handleSubmit} disabled={disabled} className="ask-button">
        {disabled ? 'Loading...' : 'Ask'}
      </button>
    </div>
  )
}

export default SearchBar