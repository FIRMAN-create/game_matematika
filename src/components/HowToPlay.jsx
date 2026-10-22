import React from 'react'
import './InfoPage.css'

export default function HowToPlay({ onBack }) {
  return (
    <div className="info-page grid-bg">
      <div className="info-header">
        <button className="btn btn-secondary" id="btn-back-howto" onClick={onBack}>← KEMBALI</button>
        <h2 className="neon-title info-title">CARA BERMAIN</h2>
        <div style={{width:'100px'}} />
      </div>

      <div className="info-content scrollable">
        <div className="info-section glass-card">
          <h3 className="section-heading">🎮 Kontrol Keyboard</h3>
          <div className="control-grid">
            <div className="control-item">
              <span className="key-badge">W</span><span className="key-badge">↑</span>
              <span className="key-desc">Gerak Atas</span>
            </div>
            <div className="control-item">
              <span className="key-badge">S</span><span className="key-badge">↓</span>
              <span className="key-desc">Gerak Bawah</span>
            </div>
            <div className="control-item">
              <span className="key-badge">A</span><span className="key-badge">←</span>
              <span className="key-desc">Gerak Kiri</span>
            </div>
            <div className="control-item">
              <span className="key-badge">D</span><span className="key-badge">→</span>
              <span className="key-desc">Gerak Kanan</span>
            </div>
            <div className="control-item">
              <span className="key-badge">E</span>
              <span className="key-desc">Interaksi dengan terminal/objek</span>
            </div>
            <div className="control-item">
              <span className="key-badge">ESC</span>
              <span className="key-desc">Pause / Buka menu jeda</span>
            </div>
          </div>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">📱 Kontrol Sentuh (Mobile)</h3>
          <p className="info-text">Gunakan tombol arah virtual yang muncul di layar. Tombol <strong>E</strong> muncul saat pemain dekat terminal. Tombol <strong>⏸</strong> untuk jeda permainan.</p>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">🎯 Tujuan Permainan</h3>
          <ol className="info-list">
            <li>Gerakkan karakter untuk menjelajahi ruangan laboratorium.</li>
            <li>Dekati terminal komputer hingga muncul prompt <strong>"Tekan E untuk berinteraksi"</strong>.</li>
            <li>Tekan <strong>E</strong> untuk membuka panel soal matematika.</li>
            <li>Jawab soal dengan benar untuk mendapatkan kode akses pintu.</li>
            <li>Pintu akan terbuka — maju ke level berikutnya!</li>
            <li>Selesaikan semua 3 level sebelum timer 10 menit habis.</li>
          </ol>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">💡 Sistem Petunjuk (HINT)</h3>
          <p className="info-text">Setiap soal memiliki tombol <span style={{color:'var(--orange)'}}>HINT</span>. Setiap penggunaan hint mengurangi <strong>5 poin</strong> dari skor akhir. Skor tidak akan turun di bawah 0.</p>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">⏱ Timer & Skor</h3>
          <ul className="info-list">
            <li>Timer 10 menit berjalan terus selama gameplay aktif.</li>
            <li>Timer berhenti saat game dijeda.</li>
            <li>Skor maksimal: <strong>100 poin</strong> (Level 1: 20, Level 2: 30, Level 3: 50).</li>
            <li>Jawaban salah tidak mengakhiri permainan — timer tetap berjalan.</li>
          </ul>
        </div>

        <div className="info-section glass-card">
          <h3 className="section-heading">📋 Ringkasan Level</h3>
          <div className="level-summary">
            <div className="level-chip">
              <span className="badge badge-cyan">Level 1</span>
              <span>Basic Access — Nilai Fungsi Sederhana</span>
            </div>
            <div className="level-chip">
              <span className="badge badge-orange">Level 2</span>
              <span>Double Encryption — Fungsi Komposisi</span>
            </div>
            <div className="level-chip">
              <span className="badge badge-green">Level 3</span>
              <span>Final Decryption — Komposisi + Invers Fungsi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
