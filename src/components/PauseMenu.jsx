import React from 'react'
import AudioControl from './AudioControl.jsx'
import './PauseMenu.css'

export default function PauseMenu({ onResume, onMaterial, onRetryLevel, onMenu }) {
  return (
    <div className="overlay">
      <div className="pause-panel glass-card anim-slide-up">
        <div className="pause-header">
          <div className="pause-icon">⏸</div>
          <h2 className="neon-title" style={{ fontSize: '1.4rem', letterSpacing: 3 }}>GAME DIJEDA</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: 4 }}>Timer berhenti selama dijeda</p>
        </div>

        {/* Volume control in pause menu */}
        <div className="pause-audio">
          <AudioControl compact={false} autoStart={false} />
        </div>

        <div className="pause-buttons">
          <button className="btn btn-primary btn-pause-item" id="btn-resume" onClick={onResume}>▶ LANJUTKAN</button>
          <button className="btn btn-secondary btn-pause-item" id="btn-material-pause" onClick={onMaterial}>📐 MATERI MATEMATIKA</button>
          <button className="btn btn-secondary btn-pause-item" id="btn-retry" onClick={onRetryLevel}>🔄 ULANGI LEVEL</button>
          <button className="btn btn-danger btn-pause-item" id="btn-menu-pause" onClick={onMenu}>🏠 KEMBALI KE MENU</button>
        </div>
      </div>
    </div>
  )
}
