// This file will handle all API calls to your backend

const API_BASE_URL = 'http://localhost:5000/api' // Change this to your backend URL

export const askQuestion = async (question) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      throw new Error('Failed to get response from backend')
    }

    const data = await response.json()
    return data.answer
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}