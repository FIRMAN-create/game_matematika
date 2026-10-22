import React from 'react'
import './InfoPage.css'

export default function Credits({ onBack }) {
  return (
    <div className="info-page grid-bg">
      <div className="info-header">
        <button className="btn btn-secondary" id="btn-back-credits" onClick={onBack}>← KEMBALI</button>
        <h2 className="neon-title info-title">KREDIT</h2>
        <div style={{width:'100px'}} />
      </div>
      <div className="info-content scrollable">
        <div className="info-section glass-card" style={{textAlign:'center'}}>
          <div style={{fontSize:'3rem', marginBottom:'12px'}}>🔐</div>
          <h3 className="neon-title" style={{fontSize:'1.4rem', marginBottom:'8px'}}>BREAK THE CODE</h3>
          <p style={{color:'var(--text-dim)', marginBottom:'20px', fontSize:'0.85rem'}}>Escape Room Matematika — Versi 1.0</p>
          <div className="info-section glass-card" style={{textAlign:'left', marginBottom:0}}>
            <div className="info-list" style={{listStyle:'none', paddingLeft:0}}>
              <div style={{marginBottom:'10px'}}>
                <span style={{color:'var(--cyan)', fontFamily:'Orbitron, monospace', fontSize:'0.75rem'}}>JENIS GAME</span>
                <p className="info-text" style={{marginBottom:0}}>Game Edukasi 2D — Escape Room Matematika</p>
              </div>
              <div style={{marginBottom:'10px'}}>
                <span style={{color:'var(--cyan)', fontFamily:'Orbitron, monospace', fontSize:'0.75rem'}}>MATERI</span>
                <p className="info-text" style={{marginBottom:0}}>Fungsi Komposisi & Invers — SMA Kelas XI</p>
              </div>
              <div style={{marginBottom:'10px'}}>
                <span style={{color:'var(--cyan)', fontFamily:'Orbitron, monospace', fontSize:'0.75rem'}}>TEKNOLOGI</span>
                <p className="info-text" style={{marginBottom:0}}>React + Vite + Canvas 2D API</p>
              </div>
              <div>
                <span style={{color:'var(--cyan)', fontFamily:'Orbitron, monospace', fontSize:'0.75rem'}}>FONT</span>
                <p className="info-text" style={{marginBottom:0}}>Orbitron, Share Tech Mono, Inter — Google Fonts</p>
              </div>
            </div>
          </div>
        </div>
        <div className="info-section glass-card" style={{textAlign:'center'}}>
          <p className="info-text">
            Game ini dibuat sebagai media pembelajaran interaktif untuk membantu siswa
            memahami konsep fungsi, komposisi fungsi, dan fungsi invers melalui
            pengalaman bermain yang menyenangkan.
          </p>
          <p style={{color:'var(--cyan)', fontFamily:'Share Tech Mono, monospace', fontSize:'0.8rem'}}>
            "Mathematics is the language in which God has written the universe." — Galileo
          </p>
        </div>
      </div>
    </div>
  )
}
