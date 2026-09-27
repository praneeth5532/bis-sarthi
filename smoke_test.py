"""Run a local API smoke test after building the document index.

Without GEMINI_API_KEY, the ask test intentionally verifies the clear 503 setup error.
"""
from fastapi.testclient import TestClient

import api

client = TestClient(api.app)

root = client.get("/")
assert root.status_code == 200, root.text
print("PASS website route")

health = client.get("/api/health")
assert health.status_code == 200, health.text
assert health.json()["index_chunks"] > 0, health.text
print("PASS health:", health.json())

preflight = client.options(
    "/api/ask",
    headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
    },
)
assert preflight.status_code == 200, preflight.text
assert preflight.headers.get("access-control-allow-origin") == "http://localhost:5173"
print("PASS CORS preflight")

for question in [
    "What standard applies to helmets?",
    "What is IS 4151?",
    "What are the requirements for protective helmets?",
    "How does BIS certification work?",
    "What is the standard for electric flying skateboards?",
]:
    _, sources = api.retrieve(question)
    assert sources, question
    print(f"PASS retrieval: {question} -> {sources}")

answer = client.post("/api/ask", json={"question": "What standard applies to helmets?"})
if health.json()["gemini_configured"]:
    assert answer.status_code == 200, answer.text
    assert answer.json()["sources"], answer.text
    print("PASS grounded answer:", answer.json()["sources"])
else:
    assert answer.status_code == 503, answer.text
    assert "GEMINI_API_KEY" in answer.json()["detail"], answer.text
    print("PASS missing-key error handling")
