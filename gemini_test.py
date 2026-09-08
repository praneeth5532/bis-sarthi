import os
from google import genai

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

interaction = client.interactions.create(
    model="gemini-3.6-flash",
    input="Explain in one sentence what BIS is."
)

print("\nGemini response:")
print(interaction.output_text)

