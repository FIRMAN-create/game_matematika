import React, { useState, useRef } from 'react'
import { validateAnswer } from '../data/levels.js'
import './QuestionPanel.css'

export default function QuestionPanel({ level, stage, stageIndex, totalStages, onCorrect, onHint, onClose }) {
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState('idle') // idle | correct | wrong
  const [feedback, setFeedback] = useState('')
  const [hintsShown, setHintsShown] = useState([])
  const [showExplanation, setShowExplanation] = useState(false)
  const inputRef = useRef(null)

  function handleCheck() {
    if (!answer.trim()) return
    if (validateAnswer(stage, answer)) {
      setStatus('correct')
      setFeedback(stage.explanation)
      setShowExplanation(true)
    } else {
      setStatus('wrong')
      setFeedback(stage.wrongFeedback)
      setTimeout(() => setStatus('idle'), 1500)
    }
  }

  function handleHint() {
    const nextIdx = hintsShown.length
    if (nextIdx < stage.hints.length) {
      setHintsShown([...hintsShown, nextIdx])
      onHint()
    }
  }

  function handleNext() {
    onCorrect()
    setAnswer('')
    setStatus('idle')
    setFeedback('')
    setShowExplanation(false)
    setHintsShown([])
  }

  function handleKey(e) {
    if (e.key === 'Enter' && status !== 'correct') handleCheck()
  }

  const borderColor = status === 'correct' ? 'var(--green)' : status === 'wrong' ? 'var(--red)' : level.color

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && status !== 'correct' && onClose()}>
      <div className="question-panel glass-card anim-slide-up" style={{ borderColor: borderColor, boxShadow: `0 0 30px ${borderColor}33` }}>
        {/* Header */}
        <div className="qp-header" style={{ borderBottomColor: borderColor }}>
          <div>
            <div className="qp-level-badge" style={{ color: level.color }}>{level.subtitle}: {level.title}</div>
            <h3 className="qp-title">{stage.title}</h3>
          </div>
          <div className="qp-stage-indicator">
            {Array.from({ length: totalStages }, (_, i) => (
              <div key={i} className={`stage-dot ${i < stageIndex ? 'done' : i === stageIndex ? 'active' : ''}`} style={{ background: i <= stageIndex ? level.color : undefined }} />
            ))}
          </div>
        </div>

        {/* Problem */}
        <div className="qp-body">
          <div className="math-box qp-problem">
            {stage.problem.split('\n').map((line, i) => (
              <div key={i} className={line.trim() === '' ? 'problem-gap' : 'problem-line'}>
                {line}
              </div>
            ))}
          </div>

          {/* Cipher helper for L3S3 */}
          {stage.cipherData && (
            <div className="cipher-table">
              <div className="cipher-header">Tabel Dekripsi E⁻¹(x) = (x-5)/6</div>
              <div className="cipher-row cipher-row-header">
                <span>Cipher</span>
                {stage.cipherData.ciphers.map(c => <span key={c}>{c}</span>)}
              </div>
              <div className="cipher-row">
                <span>Angka</span>
                {stage.cipherData.decrypted.map((d, i) => <span key={i} className="cipher-num">{d}</span>)}
              </div>
              <div className="cipher-row">
                <span>Huruf</span>
                {stage.cipherData.letters.map((l, i) => <span key={i} className="cipher-letter">{l}</span>)}
              </div>
            </div>
          )}

          {/* Hints shown */}
          {hintsShown.map((idx) => (
            <div key={idx} className="hint-box">
              <span className="hint-label">💡 HINT {idx + 1}:</span> {stage.hints[idx]}
            </div>
          ))}

          {/* Feedback */}
          {feedback && !showExplanation && (
            <div className={`feedback-box ${status === 'wrong' ? 'feedback-wrong' : ''} anim-slide-up`}>
              {feedback}
            </div>
          )}

          {/* Explanation after correct */}
          {showExplanation && (
            <div className="feedback-box feedback-correct anim-slide-up">
              <div className="feedback-correct-title">✅ JAWABAN BENAR!</div>
              <div className="math-box" style={{ marginTop: 8 }}>
                {stage.explanation.split('\n').map((l, i) => <div key={i}>{l}</div>)}
              </div>
            </div>
          )}

          {/* Input */}
          {!showExplanation && (
            <div className="qp-input-row">
              <input
                ref={inputRef}
                id="answer-input"
                className={`cyber-input ${status === 'correct' ? 'correct' : status === 'wrong' ? 'wrong' : ''}`}
                type="text"
                placeholder={stage.type === 'numeric' ? 'Masukkan angka...' : stage.type === 'text' ? 'Masukkan kata...' : 'Masukkan ekspresi...'}
                value={answer}
                onChange={(e) => { setAnswer(e.target.value); setStatus('idle'); setFeedback('') }}
                onKeyDown={handleKey}
                autoFocus
                autoComplete="off"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="qp-actions">
          {!showExplanation ? (
            <>
              <button className="btn btn-hint" id="btn-hint" onClick={handleHint} disabled={hintsShown.length >= stage.hints.length}>
                💡 HINT {hintsShown.length < stage.hints.length ? `(${stage.hints.length - hintsShown.length} sisa)` : '(Habis)'}
              </button>
              <div style={{ flex: 1 }} />
              <button className="btn btn-secondary" id="btn-close-question" onClick={onClose}>TUTUP</button>
              <button className="btn btn-primary" id="btn-check" onClick={handleCheck} disabled={!answer.trim()}>
                🔍 PERIKSA KODE
              </button>
            </>
          ) : (
            <>
              <div style={{ flex: 1 }} />
              <button className="btn btn-success" id="btn-next" onClick={handleNext}>
                {stageIndex < totalStages - 1 ? '→ LANJUT' : '🚪 BUKA PINTU'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
