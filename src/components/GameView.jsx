import React, { useEffect, useRef, useState, useCallback } from 'react'
import { TOTAL_TIME, formatTime } from '../utils/helpers.js'
import { LEVELS } from '../data/levels.js'
import PauseMenu from './PauseMenu.jsx'
import QuestionPanel from './QuestionPanel.jsx'
import MathMaterial from './MathMaterial.jsx'
import AudioControl from './AudioControl.jsx'
import { getAudioManager } from '../utils/AudioManager.js'
import './GameView.css'

export default function GameView({ onGameOver, onMenu }) {
  // Guard: prevent double-init (important when HMR or parent re-renders)
  const initGuardRef = useRef(false)
  const gameRef = useRef(null)
  const timerRef = useRef(null)

  const stateRef = useRef({
    currentLevel: 0,
    currentStage: 0,
    score: 0,
    hintsUsed: 0,
    timeLeft: TOTAL_TIME,
    paused: false,
    showMaterial: false,
    levelScoreAwarded: [false, false, false],
    stageCompleted: [[false], [false, false], [false, false, false]],
    doorOpen: [false, false, false],
    nearTerminal: false,
    showQuestion: false,
    ended: false,
  })

  const [uiState, setUiState] = useState({
    timeLeft: TOTAL_TIME,
    score: 0,
    currentLevel: 0,
    paused: false,
    showQuestion: false,
    showPause: false,
    showMaterial: false,
    nearTerminal: false,
    hintsUsed: 0,
  })

  const updateUI = useCallback(() => {
    const s = stateRef.current
    setUiState({
      timeLeft: s.timeLeft,
      score: s.score,
      currentLevel: s.currentLevel,
      paused: s.paused,
      showQuestion: s.showQuestion,
      showPause: s.paused,
      showMaterial: s.showMaterial,
      nearTerminal: s.nearTerminal,
      hintsUsed: s.hintsUsed,
    })
  }, [])

  // ── Timer ──────────────────────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) return
    timerRef.current = setInterval(() => {
      const s = stateRef.current
      if (s.paused || s.ended) return
      s.timeLeft--
      if (s.timeLeft <= 0) {
        s.timeLeft = 0
        s.ended = true
        stopTimer()
        updateUI()
        onGameOver({ win: false, score: s.score, timeLeft: 0, hintsUsed: s.hintsUsed })
      } else {
        updateUI()
      }
    }, 1000)
  }, [onGameOver, stopTimer, updateUI])

  // ── Score ──────────────────────────────────────────────────────────────────
  const awardScore = useCallback((levelIdx) => {
    const s = stateRef.current
    if (!s.levelScoreAwarded[levelIdx]) {
      s.levelScoreAwarded[levelIdx] = true
      s.score = Math.min(100, s.score + LEVELS[levelIdx].maxScore)
      updateUI()
    }
  }, [updateUI])

  // ── Callbacks passed to Phaser scenes ─────────────────────────────────────
  const openQuestion = useCallback(() => {
    const s = stateRef.current
    if (s.ended || s.paused) return
    s.showQuestion = true
    updateUI()
  }, [updateUI])

  const updateNearTerminal = useCallback((near) => {
    stateRef.current.nearTerminal = near
    updateUI()
  }, [updateUI])

  const advanceLevel = useCallback(() => {
    const s = stateRef.current
    if (s.currentLevel >= LEVELS.length - 1) {
      s.ended = true
      stopTimer()
      onGameOver({ win: true, score: s.score, timeLeft: s.timeLeft, hintsUsed: s.hintsUsed })
      return
    }
    s.currentLevel++
    s.currentStage = 0
    s.nearTerminal = false
    updateUI()

    if (gameRef.current) {
      const prevScene = `Level${s.currentLevel}Scene`   // scene we just left
      const nextScene = `Level${s.currentLevel + 1}Scene`
      const cb = { openQuestion, advanceLevel, updateNearTerminal }

      // Stop the previous scene, then start the next
      gameRef.current.scene.stop(prevScene)
      gameRef.current.scene.start(nextScene, { gameState: s, callbacks: cb })
    }
  }, [stopTimer, onGameOver, openQuestion, updateNearTerminal, updateUI])

  // ── Handle correct answer ──────────────────────────────────────────────────
  const handleCorrectAnswer = useCallback(() => {
    const s = stateRef.current
    const level = LEVELS[s.currentLevel]
    s.stageCompleted[s.currentLevel][s.currentStage] = true

    const allDone = level.stages.every((_, i) => s.stageCompleted[s.currentLevel][i])
    if (allDone) {
      s.doorOpen[s.currentLevel] = true
      awardScore(s.currentLevel)
      if (gameRef.current) {
        const scene = gameRef.current.scene.getScene(`Level${s.currentLevel + 1}Scene`)
        if (scene && scene.openDoor) scene.openDoor()
      }
    }
    if (s.currentStage < level.stages.length - 1) {
      s.currentStage++
    }
    s.showQuestion = false
    updateUI()
  }, [awardScore, updateUI])

  const handleHint = useCallback(() => {
    const s = stateRef.current
    s.hintsUsed++
    s.score = Math.max(0, s.score - 5)
    updateUI()
  }, [updateUI])

  const closeQuestion = useCallback(() => {
    stateRef.current.showQuestion = false
    updateUI()
  }, [updateUI])

  const togglePause = useCallback(() => {
    const s = stateRef.current
    s.paused = !s.paused
    if (s.paused) stopTimer(); else startTimer()
    updateUI()
  }, [startTimer, stopTimer, updateUI])

  const retryLevel = useCallback(() => {
    const s = stateRef.current
    s.paused = false
    s.showQuestion = false
    s.currentStage = 0
    s.stageCompleted[s.currentLevel] = s.stageCompleted[s.currentLevel].map(() => false)
    s.doorOpen[s.currentLevel] = false
    s.levelScoreAwarded[s.currentLevel] = false
    s.score = s.levelScoreAwarded.reduce(
      (acc, awarded, idx) => awarded ? acc + LEVELS[idx].maxScore : acc, 0
    )
    updateUI()
    startTimer()
    if (gameRef.current) {
      const sceneName = `Level${s.currentLevel + 1}Scene`
      const cb = { openQuestion, advanceLevel, updateNearTerminal }
      gameRef.current.scene.start(sceneName, { gameState: s, callbacks: cb })
    }
  }, [startTimer, openQuestion, advanceLevel, updateNearTerminal, updateUI])

  // ── Phaser 3 Init (only once!) ─────────────────────────────────────────────
  useEffect(() => {
    // Strict-mode / HMR guard
    if (initGuardRef.current) return
    initGuardRef.current = true

    let phaserGame = null
    let destroyed = false

    async function initPhaser() {
      const Phaser = (await import('phaser')).default
      if (destroyed) return

      const callbacks = { openQuestion, advanceLevel, updateNearTerminal }
      const { getLevel1Scene } = await import('../scenes/Level1Scene.js')
      const { getLevel2Scene } = await import('../scenes/Level2Scene.js')
      const { getLevel3Scene } = await import('../scenes/Level3Scene.js')
      if (destroyed) return

      const gs = stateRef.current

      // Build scene classes
      const Scene1 = getLevel1Scene(Phaser, gs, callbacks)
      const Scene2 = getLevel2Scene(Phaser, gs, callbacks)
      const Scene3 = getLevel3Scene(Phaser, gs, callbacks)

      // ── CRITICAL: Only Level1Scene is active. Levels 2 & 3 start inactive. ──
      const config = {
        type: Phaser.AUTO,
        parent: 'phaser-container',
        width: 800,
        height: 450,
        backgroundColor: '#020408',
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        physics: {
          default: 'arcade',
          arcade: { gravity: { y: 0 }, debug: false },
        },
        scene: [Scene1, Scene2, Scene3],
      }

      phaserGame = new Phaser.Game(config)
      gameRef.current = phaserGame

      // Phaser auto-starts the first scene only.
      // Explicitly sleep the other scenes after boot so they don't render.
      phaserGame.events.once('ready', () => {
        phaserGame.scene.sleep('Level2Scene')
        phaserGame.scene.sleep('Level3Scene')
      })
    }

    initPhaser().catch(console.error)
    startTimer()

    return () => {
      destroyed = true
      initGuardRef.current = false
      stopTimer()
      if (phaserGame) {
        phaserGame.destroy(true)
        gameRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── ESC key for pause ──────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        const s = stateRef.current
        if (s.showQuestion) closeQuestion()
        else if (!s.ended) togglePause()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [togglePause, closeQuestion])

  // ── Mobile dpad helpers ────────────────────────────────────────────────────
  function fireDpad(detail) {
    window.dispatchEvent(new CustomEvent('dpad', { detail }))
  }

  const currentLevel = LEVELS[uiState.currentLevel]
  const currentStage = currentLevel?.stages[stateRef.current.currentStage]

  return (
    <div className="game-view">
      {/* ── Status Bar ── */}
      <div className="status-bar game-status-bar">
        <div className="status-item">
          <span className="status-label">LEVEL</span>
          <span className="status-value" style={{ color: currentLevel?.color }}>
            {currentLevel?.subtitle}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">MISI</span>
          <span className="status-value" style={{ color: currentLevel?.color }}>
            {currentLevel?.title}
          </span>
        </div>
        <div
          className="status-timer"
          style={{
            color: uiState.timeLeft <= 60 ? 'var(--red)'
              : uiState.timeLeft <= 120 ? 'var(--orange)'
              : 'var(--cyan)',
          }}
        >
          ⏱ {formatTime(uiState.timeLeft)}
        </div>
        <div className="status-item">
          <span className="status-label">SKOR</span>
          <span className="status-value neon-green">{uiState.score}</span>
        </div>
        <button className="btn btn-secondary pause-btn" id="btn-pause" onClick={togglePause}>
          {uiState.paused ? '▶' : '⏸'}
        </button>
        {/* Compact audio control in status bar */}
        <AudioControl compact={true} autoStart={true} />
      </div>

      {/* ── Phaser Canvas ── */}
      <div id="phaser-container" className="phaser-container" />

      {/* ── Interaction Prompt (shown by React over canvas) ── */}
      {uiState.nearTerminal && !uiState.showQuestion && !uiState.paused && (
        <div className="interact-prompt">
          <kbd>E</kbd> Tekan E untuk berinteraksi
        </div>
      )}

      {/* ── Mobile D-pad Controls ── */}
      <div className="mobile-controls">
        <div className="dpad">
          <button
            className="dpad-btn dpad-up"
            id="dpad-up"
            onPointerDown={() => fireDpad('up-down')}
            onPointerUp={() => fireDpad('up-up')}
            onPointerLeave={() => fireDpad('up-up')}
          >▲</button>
          <div className="dpad-middle-row">
            <button
              className="dpad-btn dpad-left"
              id="dpad-left"
              onPointerDown={() => fireDpad('left-down')}
              onPointerUp={() => fireDpad('left-up')}
              onPointerLeave={() => fireDpad('left-up')}
            >◄</button>
            <div className="dpad-btn dpad-center">✦</div>
            <button
              className="dpad-btn dpad-right"
              id="dpad-right"
              onPointerDown={() => fireDpad('right-down')}
              onPointerUp={() => fireDpad('right-up')}
              onPointerLeave={() => fireDpad('right-up')}
            >►</button>
          </div>
          <button
            className="dpad-btn dpad-down"
            id="dpad-down"
            onPointerDown={() => fireDpad('down-down')}
            onPointerUp={() => fireDpad('down-up')}
            onPointerLeave={() => fireDpad('down-up')}
          >▼</button>
        </div>
        <div className="action-btns">
          {uiState.nearTerminal && (
            <button className="dpad-btn action-e" id="mobile-interact" onClick={openQuestion}>E</button>
          )}
          <button className="dpad-btn action-pause" id="mobile-pause" onClick={togglePause}>⏸</button>
        </div>
      </div>

      {/* ── Question Panel Overlay ── */}
      {uiState.showQuestion && currentStage && (
        <QuestionPanel
          level={currentLevel}
          stage={currentStage}
          stageIndex={stateRef.current.currentStage}
          totalStages={currentLevel.stages.length}
          onCorrect={handleCorrectAnswer}
          onHint={handleHint}
          onClose={closeQuestion}
        />
      )}

      {/* ── Pause Menu ── */}
      {uiState.paused && !uiState.showMaterial && (
        <PauseMenu
          onResume={togglePause}
          onMaterial={() => { stateRef.current.showMaterial = true; updateUI() }}
          onRetryLevel={retryLevel}
          onMenu={onMenu}
        />
      )}

      {/* ── Math Material (from pause) ── */}
      {uiState.paused && uiState.showMaterial && (
        <div className="overlay">
          <div style={{ width: '90%', maxWidth: 700, height: '80vh', display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
            <MathMaterial onBack={() => { stateRef.current.showMaterial = false; updateUI() }} />
          </div>
        </div>
      )}
    </div>
  )
}
