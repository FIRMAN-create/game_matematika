import React, { useState, useEffect } from 'react'
import { getAudioManager } from '../utils/AudioManager.js'
import './AudioControl.css'

/**
 * AudioControl — volume panel
 * Props:
 *   compact  : boolean — icon button + popover (untuk status bar game)
 *   autoStart: boolean — mulai musik saat komponen mount
 */
export default function AudioControl({ compact = false, autoStart = false }) {
  const am = getAudioManager()

  // Sync state dari instance singleton (supaya semua komponen AudioControl konsisten)
  const [volume, setVolume] = useState(am.volume)
  const [muted,  setMuted]  = useState(am.muted)
  const [open,   setOpen]   = useState(false)

  // Auto-start musik saat komponen mount (GameView pakai ini)
  useEffect(() => {
    if (autoStart) {
      am.start().catch(() => {})
    }
  }, []) // eslint-disable-line

  // ── Helpers ───────────────────────────────────────────────────────────────
  // Mulai audio kalau belum jalan (tidak async — fire-and-forget)
  function kickStart() {
    if (!am.isPlaying) {
      am.start().catch(() => {})
    }
  }

  function handleMute() {
    kickStart()
    const nowMuted = am.toggleMute()
    setMuted(nowMuted)
  }

  // Slider selalu menampilkan volume ASLI (bukan 0 saat mute),
  // sehingga user bisa lihat dan sesuaikan posisi slider kapanpun.
  function handleVolume(e) {
    kickStart()
    const v = parseFloat(e.target.value)
    // Jika sedang mute dan user gerakkan slider → auto unmute
    if (am.muted) {
      am.muted = false
      if (am.masterGain && am.ctx) {
        am.masterGain.gain.setTargetAtTime(v, am.ctx.currentTime, 0.05)
      }
      setMuted(false)
    }
    am.setVolume(v)
    setVolume(v)
  }

  // Icon berdasarkan kondisi mute dan level volume
  const icon = (muted || volume === 0) ? '🔇' : volume < 0.35 ? '🔉' : '🔊'
  const pct  = muted ? 0 : Math.round(volume * 100)

  // ── Tampilan FULL (menu utama, pause, win/fail) ───────────────────────────
  if (!compact) {
    return (
      <div className="audio-control-full">
        <div className="ac-label">
          <span className="ac-music-icon">🎵</span>
          <span>MUSIK</span>
        </div>

        <button
          id="btn-mute"
          className={`ac-mute-btn ${muted ? 'ac-muted' : ''}`}
          onClick={handleMute}
          title={muted ? 'Nyalakan musik' : 'Matikan musik'}
        >
          {icon}
        </button>

        <input
          id="volume-slider"
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={volume}            /* Selalu tampilkan nilai volume asli */
          onChange={handleVolume}
          className="ac-slider"
          title={`Volume: ${pct}%`}
        />

        <span className="ac-vol-pct">{pct}%</span>
      </div>
    )
  }

  // ── Tampilan COMPACT (status bar game) — ikon + popover ──────────────────
  return (
    <div className="audio-control-compact">
      <button
        id="btn-audio-compact"
        className={`ac-icon-btn ${muted ? 'ac-muted' : ''}`}
        title="Kontrol musik"
        onClick={() => {
          kickStart()
          setOpen(o => !o)
        }}
      >
        {icon}
      </button>

      {open && (
        <div className="ac-popover glass-card">
          <div className="ac-pop-header">
            <span>🎵 MUSIK</span>
            <button
              className="ac-pop-close"
              onClick={() => setOpen(false)}
              title="Tutup"
            >✕</button>
          </div>

          <div className="ac-pop-row">
            <button
              className={`ac-mute-btn-sm ${muted ? 'ac-muted' : ''}`}
              onClick={handleMute}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {icon}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}         /* Selalu tampilkan volume asli */
              onChange={handleVolume}
              className="ac-slider"
            />

            <span className="ac-vol-pct">{pct}%</span>
          </div>
        </div>
      )}
    </div>
  )
}
