import { Bot, Check, Copy, LoaderCircle, UserRound } from 'lucide-react'
import { useState } from 'react'

function Results({ questions, loading }) {
  const [copiedIndex, setCopiedIndex] = useState(null)

  const copyAnswer = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      window.setTimeout(() => setCopiedIndex(null), 1600)
    } catch {
      setCopiedIndex(null)
    }
  }

  return (
    <div className="results-container" aria-live="polite">
      {questions.length === 0 ? (
        <div className="no-results">
          <span className="empty-mark"><Bot size={20} strokeWidth={1.6} /></span>
          <div><strong>Your findings will appear here.</strong><p>Ask a question to begin a standards research thread.</p></div>
        </div>
      ) : (
        <div className="conversation">
          {questions.map((item, index) => (
            <div key={index} className={`message ${item.type}`}>
              <div className="message-avatar" aria-hidden="true">
                {item.type === 'user' ? <UserRound size={15} /> : <Bot size={16} />}
              </div>
              <div className="message-body">
                <div className="message-header">{item.type === 'user' ? 'YOU' : 'BIS SARTHI'}<span>{item.type === 'assistant' ? 'RESEARCH RESPONSE' : 'QUESTION'}</span></div>
                <div className="message-content">{item.text}</div>
                {item.type === 'assistant' && (
                  <button className="copy-answer" onClick={() => copyAnswer(item.text, index)} title="Copy answer" aria-label="Copy answer">
                    {copiedIndex === index ? <Check size={13} /> : <Copy size={13} />}
                    {copiedIndex === index ? 'Copied' : 'Copy response'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant loading-message">
              <div className="message-avatar"><Bot size={16} /></div>
              <div className="message-body">
                <div className="message-header">BIS SARTHI<span>SEARCHING THE KNOWLEDGE BASE</span></div>
                <div className="loading-answer"><LoaderCircle size={15} /> Preparing a response</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Results
