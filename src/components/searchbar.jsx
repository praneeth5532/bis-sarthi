import { useState } from 'react'
import { ArrowUpRight, CornerDownLeft, Search } from 'lucide-react'

function SearchBar({ onAsk, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!input.trim() || disabled) return
    onAsk(input.trim())
    setInput('')
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-symbol"><Search size={19} strokeWidth={1.8} /></div>
      <textarea
        rows="2"
        aria-label="Ask a question about BIS standards"
        placeholder="Ask about a product, requirement, test, or certification step..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) handleSubmit(event)
        }}
        disabled={disabled}
        className="search-input"
      />
      <div className="search-controls">
        <span className="key-hint"><CornerDownLeft size={12} /> Enter to ask</span>
        <button type="submit" disabled={disabled || !input.trim()} className="ask-button" title="Ask the standards desk">
          {disabled ? 'Working' : 'Ask'} <ArrowUpRight size={16} />
        </button>
      </div>
    </form>
  )
}

export default SearchBar
