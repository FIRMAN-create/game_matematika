import React, { useEffect, useRef } from 'react'
import AudioControl from './AudioControl.jsx'
import './MainMenu.css'

export default function MainMenu({ onStart, onHowToPlay, onMathMaterial, onCredits }) {
  const particlesRef = useRef(null)

  useEffect(() => {
    const canvas = particlesRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }))

    let raf
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="main-menu grid-bg scanline-overlay">
      <canvas ref={particlesRef} className="particles-canvas" />

      {/* Decorative lines */}
      <div className="deco-line deco-line-top" />
      <div className="deco-line deco-line-bottom" />

      <div className="menu-container anim-fade">
        {/* Logo area */}
        <div className="logo-area">
          <div className="lock-icon anim-float">🔐</div>
          <div className="glitch-wrapper">
            <h1 className="neon-title game-title" data-text="BREAK THE CODE">
              BREAK THE CODE
            </h1>
          </div>
          <p className="game-subtitle">ESCAPE ROOM MATEMATIKA</p>
          <p className="game-tagline">Solve the Math. Crack the Code. Escape the Lab.</p>
        </div>

        {/* Story blurb */}
        <div className="story-box glass-card">
          <p>
            Kamu terjebak di laboratorium digital. Pecahkan tiga sistem keamanan menggunakan
            matematika, buka semua pintu, dan temukan kode untuk melarikan diri.
          </p>
        </div>

        {/* Menu buttons */}
        <nav className="menu-buttons">
          <button id="btn-start" className="btn btn-primary btn-menu" onClick={onStart}>
            ▶ MULAI MISI
          </button>
          <button id="btn-how" className="btn btn-secondary btn-menu" onClick={onHowToPlay}>
            📖 CARA BERMAIN
          </button>
          <button id="btn-math" className="btn btn-secondary btn-menu" onClick={onMathMaterial}>
            📐 MATERI MATEMATIKA
          </button>
          <button id="btn-credits" className="btn btn-secondary btn-menu" onClick={onCredits}>
            ℹ KREDIT
          </button>
        </nav>

        {/* Audio control — full mode on main menu */}
        <AudioControl compact={false} autoStart={false} />

        {/* Footer badges */}
        <div className="menu-footer">
          <span className="badge badge-cyan">LEVEL 1–3</span>
          <span className="badge badge-orange">⏱ 10 MENIT</span>
          <span className="badge badge-green">SMA KELAS XI</span>
        </div>
      </div>
    </div>
  )
}
