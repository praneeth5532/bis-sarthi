function Results({ questions }) {
  return (
    <div className="results-container">
      {questions.length === 0 ? (
        <p className="no-results">No questions asked yet. Start by asking a question above!</p>
      ) : (
        <div className="conversation">
          {questions.map((item, index) => (
            <div key={index} className={`message ${item.type}`}>
              <div className="message-header">
                {item.type === 'user' ? 'You' : 'BIS Assistant'}
              </div>
              <div className="message-content">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Results