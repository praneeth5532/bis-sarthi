const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const askQuestion = async (question) => {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.detail || 'The BIS Sarthi backend could not answer right now.')
  }
  return data
}
