import React, { useEffect, useRef } from 'react'
import { formatTime } from '../utils/helpers.js'
import { LEVELS } from '../data/levels.js'
import AudioControl from './AudioControl.jsx'
import './EndScreen.css'

export default function WinScreen({ result, onRestart, onMenu }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Firework particles
    const particles = []
    function spawnBurst(x, y) {
      const colors = ['#00e5ff', '#00e676', '#ff9100', '#4fc3f7', '#ffffff']
      for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2 / 30) * i
        const speed = 2 + Math.random() * 4
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 3 + 1,
        })
      }
    }

    let burstTimer = 0
    let raf
    function draw(t) {
      ctx.fillStyle = 'rgba(2, 4, 8, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (t - burstTimer > 800) {
        burstTimer = t
        spawnBurst(Math.random() * canvas.width, Math.random() * canvas.height * 0.7)
      }

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy + 0.05
        p.vx *= 0.97
        p.life -= 0.018
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // Remove dead particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].life <= 0) particles.splice(i, 1)
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  const score = result?.score ?? 0
  const timeLeft = result?.timeLeft ?? 0
  const hintsUsed = result?.hintsUsed ?? 0

  return (
    <div className="end-screen grid-bg win-screen">
      <canvas ref={canvasRef} className="end-canvas" />
      <div className="end-content anim-slide-up">
        <div className="win-badge">🏆</div>
        <h1 className="neon-title win-title">MISSION COMPLETED!</h1>
        <p className="win-subtitle">Kamu berhasil memecahkan seluruh kode matematika.</p>
        <p className="win-subtitle" style={{ color: 'var(--cyan)', fontFamily: 'Share Tech Mono, monospace' }}>
          KUNCI LABORATORIUM DITEMUKAN — KAMU BEBAS!
        </p>

        {/* Stats */}
        <div className="stats-grid glass-card">
          <div className="stat-item">
            <div className="stat-label">TOTAL SKOR</div>
            <div className="stat-value neon-green">{score} / 100</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">WAKTU TERSISA</div>
            <div className="stat-value" style={{ color: 'var(--cyan)' }}>{formatTime(timeLeft)}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">HINT DIGUNAKAN</div>
            <div className="stat-value" style={{ color: hintsUsed > 0 ? 'var(--orange)' : 'var(--green)' }}>
              {hintsUsed} × (-5 poin)
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">PENALTI HINT</div>
            <div className="stat-value neon-red">-{Math.min(hintsUsed * 5, 100)}</div>
          </div>
        </div>

        {/* Level summary */}
        <div className="level-summary-win glass-card">
          <div className="summary-title">RINGKASAN LEVEL</div>
          {LEVELS.map((lv, i) => (
            <div key={i} className="summary-row">
              <span className="badge" style={{ background: `${lv.color}22`, color: lv.color, border: `1px solid ${lv.color}55` }}>
                {lv.subtitle}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{lv.title}</span>
              <span className="neon-green" style={{ marginLeft: 'auto', fontFamily: 'Orbitron, monospace', fontSize: '0.85rem' }}>
                +{lv.maxScore}
              </span>
              <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>✅</span>
            </div>
          ))}
        </div>

        <div className="end-audio-row">
          <AudioControl compact={false} autoStart={false} />
        </div>

        <div className="end-actions">
          <button className="btn btn-primary" id="btn-win-restart" onClick={onRestart}>🔄 MAIN LAGI</button>
          <button className="btn btn-secondary" id="btn-win-menu" onClick={onMenu}>🏠 MENU UTAMA</button>
        </div>
      </div>
    </div>
  )
}
