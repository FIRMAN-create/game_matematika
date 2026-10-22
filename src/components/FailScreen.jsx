import React from 'react'
import { formatTime } from '../utils/helpers.js'
import { LEVELS } from '../data/levels.js'
import AudioControl from './AudioControl.jsx'
import './EndScreen.css'

export default function FailScreen({ result, onRetry, onMenu }) {
  const score = result?.score ?? 0
  const hintsUsed = result?.hintsUsed ?? 0

  return (
    <div className="end-screen grid-bg fail-screen">
      <div className="end-content anim-slide-up">
        <div className="fail-icon">⏰</div>
        <h1 className="neon-title fail-title">MISI GAGAL</h1>
        <p className="win-subtitle" style={{ color: 'var(--red)' }}>
          Waktu habis! Sistem keamanan mengunci semua akses.
        </p>
        <p className="win-subtitle" style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          Kamu tidak berhasil keluar sebelum timer mencapai nol.
        </p>

        {/* Stats */}
        <div className="stats-grid glass-card">
          <div className="stat-item">
            <div className="stat-label">SKOR DIPEROLEH</div>
            <div className="stat-value" style={{ color: 'var(--orange)' }}>{score} / 100</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">WAKTU TERSISA</div>
            <div className="stat-value neon-red">00:00</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">HINT DIGUNAKAN</div>
            <div className="stat-value" style={{ color: 'var(--text-secondary)' }}>{hintsUsed}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">LEVEL TERCAPAI</div>
            <div className="stat-value" style={{ color: 'var(--cyan)' }}>
              {LEVELS.findIndex((_, i) => score < LEVELS.slice(0, i + 1).reduce((a, l) => a + l.maxScore, 0)) + 1 || LEVELS.length} / {LEVELS.length}
            </div>
          </div>
        </div>

        {/* Motivational message */}
        <div className="glass-card" style={{ padding: '16px 20px', textAlign: 'center', marginTop: 0 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.7 }}>
            💡 Pelajari kembali materi <strong style={{ color: 'var(--cyan)' }}>Fungsi Komposisi</strong> dan{' '}
            <strong style={{ color: 'var(--cyan)' }}>Fungsi Invers</strong>, lalu coba lagi!
          </p>
        </div>

        <div className="end-audio-row">
          <AudioControl compact={false} autoStart={false} />
        </div>

        <div className="end-actions">
          <button className="btn btn-primary" id="btn-fail-retry" onClick={onRetry}>🔄 COBA LAGI</button>
          <button className="btn btn-secondary" id="btn-fail-menu" onClick={onMenu}>🏠 MENU UTAMA</button>
        </div>
      </div>
    </div>
  )
}
