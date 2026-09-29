import { useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BookOpenCheck,
  Boxes,
  Compass,
  FileSearch,
  FlaskConical,
  HardHat,
  Layers3,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import Results from './components/Results'
import { askQuestion } from './services/api'
import './App.css'
import './theme.css'

const knowledgeAreas = [
  {
    title: 'Helmets',
    detail: 'Protective equipment',
    icon: HardHat,
    prompt: 'What BIS standards and certification requirements apply to protective helmets in India?',
  },
  {
    title: 'Flasks & bottles',
    detail: 'Food-contact products',
    icon: FlaskConical,
    prompt: 'What should I check in BIS standards for flasks and bottles?',
  },
  {
    title: 'Toy safety',
    detail: 'Safety & manufacturing',
    icon: Boxes,
    prompt: 'Explain the BIS toy safety requirements and the steps a manufacturer should take.',
  },
]

function App() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAskQuestion = async (question) => {
    if (loading || !question.trim()) return

    setLoading(true)
    setQuestions((prev) => [...prev, { type: 'user', text: question }])

    try {
      const answer = await askQuestion(question)
      setQuestions((prev) => [
        ...prev,
        {
          type: 'assistant',
          text: answer,
        },
      ])
    } catch {
      setQuestions((prev) => [
        ...prev,
        {
          type: 'assistant',
          text: 'I could not get a response from the BIS backend. Please make sure the backend is running and the API key is configured.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const clearSession = () => setQuestions([])
  const answerCount = questions.filter((item) => item.type === 'assistant').length

  return (
    <div className="app-shell">
      <Navbar onClear={clearSession} hasSession={questions.length > 0} />

      <div className="workspace-layout">
        <aside className="side-rail" aria-label="Workspace navigation">
          <div className="rail-label">WORKSPACE</div>
          <a className="rail-link active" href="#research">
            <Compass size={17} strokeWidth={1.8} />
            <span>Research desk</span>
            <ArrowUpRight className="rail-arrow" size={14} />
          </a>
          <a className="rail-link" href="#knowledge-areas">
            <Layers3 size={17} strokeWidth={1.8} />
            <span>Knowledge areas</span>
          </a>
          <a className="rail-link" href="#session">
            <BookOpenCheck size={17} strokeWidth={1.8} />
            <span>Session notes</span>
            <span className="rail-count">{answerCount}</span>
          </a>

          <div className="rail-divider" />
          <div className="rail-label">COLLECTIONS</div>
          {knowledgeAreas.map(({ title, icon: Icon, prompt }) => (
            <button
              className="collection-link"
              key={title}
              onClick={() => handleAskQuestion(prompt)}
              disabled={loading}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{title}</span>
              <ArrowDownRight size={13} className="collection-arrow" />
            </button>
          ))}

          <div className="rail-footnote">
            <span className="footnote-mark"><ShieldCheck size={16} /></span>
            <p>Standards guidance, organized around the product you make.</p>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-overline">
            <span>STANDARDS INTELLIGENCE</span>
            <span className="overline-rule" />
            <span>INDIA</span>
          </div>

          <section className="intro-panel" id="research">
            <div className="intro-copy">
              <div className="intro-kicker"><Sparkles size={14} /> YOUR BIS RESEARCH WORKSPACE</div>
              <h1>Make sense of<br /><em>the standard.</em></h1>
              <p>Ask a precise question. Get a clear route through the requirements, terminology, and next steps that matter.</p>
            </div>
            <div className="intro-index" aria-label="Workspace capabilities">
              <div className="index-heading"><span>RESEARCH LENS</span><Activity size={16} /></div>
              <div className="lens-row"><span className="lens-number">01</span><span>Find the relevant requirement</span></div>
              <div className="lens-row"><span className="lens-number">02</span><span>Translate technical language</span></div>
              <div className="lens-row"><span className="lens-number">03</span><span>Identify a practical next step</span></div>
              <div className="index-foot">AI-assisted · Ask in plain language</div>
            </div>
          </section>

          <div className="workspace-grid">
            <section className="research-column" aria-labelledby="ask-heading">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">01 / ASK</span>
                  <h2 id="ask-heading">What are you working on?</h2>
                </div>
                <span className="session-state"><span className="state-dot" /> RESEARCH READY</span>
              </div>
              <SearchBar onAsk={handleAskQuestion} disabled={loading} />
              <div className="prompt-caption"><span>START WITH A QUESTION</span><span>OR PICK A COLLECTION →</span></div>
              <div className="topic-list" id="knowledge-areas">
                {knowledgeAreas.map(({ title, detail, icon: Icon, prompt }, index) => (
                  <button
                    className="topic-row"
                    key={title}
                    onClick={() => handleAskQuestion(prompt)}
                    disabled={loading}
                  >
                    <span className={`topic-icon topic-icon-${index + 1}`}><Icon size={19} strokeWidth={1.7} /></span>
                    <span className="topic-copy"><strong>{title}</strong><small>{detail}</small></span>
                    <span className="topic-action">Explore <ArrowUpRight size={14} /></span>
                  </button>
                ))}
              </div>

              <section className="session-section" id="session">
                <div className="section-heading session-heading">
                  <div>
                    <span className="section-kicker">02 / WORKING NOTES</span>
                    <h2>Your research session</h2>
                  </div>
                  {questions.length > 0 && (
                    <button className="text-action" onClick={clearSession} title="Clear research session">
                      <RotateCcw size={14} /> Clear
                    </button>
                  )}
                </div>
                <Results questions={questions} loading={loading} />
              </section>
            </section>

            <aside className="reference-column" aria-label="Research context">
              <section className="reference-block">
                <div className="reference-heading">
                  <span className="section-kicker">FIELD GUIDE</span>
                  <FileSearch size={17} />
                </div>
                <h3>Good questions<br />make good evidence.</h3>
                <p>Include the product, its intended use, and the decision you need to make. The answer can then focus on what is relevant.</p>
                <div className="example-question">
                  <span>TRY THIS FORMAT</span>
                  <p>“I manufacture [product]. Which BIS requirements should I review before sale?”</p>
                </div>
              </section>

              <section className="collection-index">
                <div className="collection-index-head">
                  <div><span className="section-kicker">IN THIS WORKSPACE</span><h3>Knowledge areas</h3></div>
                  <span className="collection-total">03</span>
                </div>
                {knowledgeAreas.map(({ title, detail, icon: Icon }, index) => (
                  <a href="#knowledge-areas" className="index-row" key={title}>
                    <span className="index-row-icon"><Icon size={16} /></span>
                    <span><strong>{title}</strong><small>{detail}</small></span>
                    <span className="index-number">0{index + 1}</span>
                  </a>
                ))}
                <div className="index-note">Choose an area to start a focused question.</div>
              </section>

              <div className="support-note">
                <span className="support-icon"><ShieldCheck size={17} /></span>
                <p>Use the response as a research aid. Confirm final decisions against the applicable BIS publication.</p>
              </div>
            </aside>
          </div>
          <footer className="workspace-footer"><span>BIS SARTHI</span><span>Standards research workspace</span><span>Session answers are not a substitute for official publications.</span></footer>
        </main>
      </div>
      </div>
  )
}

export default App
