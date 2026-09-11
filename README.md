# BIS Sarthi 🇮🇳

### AI Assistant for Verified BIS Standards and Certification Information

**BIS Sarthi** is a Retrieval-Augmented Generation (RAG) based AI assistant that helps users access reliable information about **Indian Standards and BIS services**.



---

## 🎯 Problem

BIS standards and certification information is often contained in lengthy technical documents, making it difficult for users to quickly find relevant information.

BIS Sarthi provides a conversational interface where users can ask questions and receive answers based on relevant BIS documentation.

---

##  How It Works

BIS Sarthi uses **Retrieval-Augmented Generation (RAG)**:

```text
User
  ↓
Frontend / Chatbot
  ↓
Backend API
  ↓
RAG Retrieval
  ↓
Relevant BIS Document Chunks
  ↓
Gemini
  ↓
Grounded Response
```

The system retrieves relevant information from the document collection and provides it as context to the AI model before generating a response.

---

##  Features

*  AI-powered conversational interface
*  Retrieval from BIS documents
*  Context-grounded responses
*  Focus on two-wheeler helmet standards
*  BIS certification-related information
*  Extensible RAG architecture for additional standards

---

## Technology Stack

**Frontend**

* React
* Vite
* JavaScript

**Backend**

* Python
* FastAPI

**AI / RAG**

* Retrieval-Augmented Generation
* Gemini
* Document processing
* Vector-based retrieval

---

## 📁 Project Structure

```text
bis-sarthi/
│
├── backend/          # Backend components
├── data/helmets/     # Helmet-related data
├── documents/        # BIS source documents
├── public/            # Frontend assets
├── src/               # Frontend source
│
├── api.py             # API entry point
├── ingest.py          # Document ingestion
├── build_rag.py       # RAG knowledge-base construction
├── search_rag.py      # RAG retrieval
├── rag_gemini.py      # RAG + Gemini integration
│
├── package.json       # Frontend dependencies
├── requirements.txt   # Python dependencies
├── vite.config.js     # Vite configuration
└── README.md
```

---

## 🚀 Getting Started

### Clone the repository

```bash
git clone https://github.com/praneeth5532/bis-sarthi.git
cd bis-sarthi
```

### Install Python dependencies

```bash
python -m venv venv
```

Windows:

```powershell
venv\Scripts\activate
```

```bash
pip install -r requirements.txt
```

### Install frontend dependencies

```bash
npm install
```

### Configure API Key

Configure the required Gemini API key using an environment variable.

**Never commit API keys or other secrets to the repository.**

### Run the frontend

```bash
npm run dev
```

Run the backend using the API entry point configured in the project.

---

## 💬 Example Queries

```text
What BIS standard applies to two-wheeler helmets?

What are the requirements for helmets under the applicable standard?

What certification information is required for helmets?
```

---

##  Future Scope

* Expand to additional BIS standards and product categories
* Improve document and section-level citations
* Improve retrieval accuracy
* Add more BIS services and certification workflows

---

##  Disclaimer

BIS Sarthi is an AI-assisted information retrieval system. Users should verify important certification, regulatory, safety, or compliance information against the latest official BIS documentation.

---

##
