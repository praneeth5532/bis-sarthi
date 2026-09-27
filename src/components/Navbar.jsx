import { ArrowUpRight, RotateCcw, ShieldCheck } from 'lucide-react'

function Navbar({ onClear, hasSession }) {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-title-wrap">
          <div className="logo-mark"><ShieldCheck size={21} strokeWidth={1.7} /></div>
          <div>
            <h1 className="navbar-title">BIS Sarthi</h1>
            <p className="navbar-subtitle">Bureau of Indian Standards <span>/</span> Assistant</p>
          </div>
        </div>
        <div className="navbar-actions">
          <span className="navbar-context">STANDARDS INTELLIGENCE</span>
          <button className="reset-button" onClick={onClear} disabled={!hasSession} title="Clear session" aria-label="Clear session">
            <RotateCcw size={15} />
          </button>
          <a className="navbar-link" href="#research">Open desk <ArrowUpRight size={14} /></a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar