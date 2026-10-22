import React, { useState, useCallback } from 'react'
import MainMenu from './components/MainMenu.jsx'
import HowToPlay from './components/HowToPlay.jsx'
import MathMaterial from './components/MathMaterial.jsx'
import Credits from './components/Credits.jsx'
import GameView from './components/GameView.jsx'
import WinScreen from './components/WinScreen.jsx'
import FailScreen from './components/FailScreen.jsx'

// Game states
export const SCREEN = {
  MAIN_MENU: 'MAIN_MENU',
  HOW_TO_PLAY: 'HOW_TO_PLAY',
  MATH_MATERIAL: 'MATH_MATERIAL',
  CREDITS: 'CREDITS',
  GAME: 'GAME',
  WIN: 'WIN',
  FAIL: 'FAIL',
}

export default function App() {
  const [screen, setScreen] = useState(SCREEN.MAIN_MENU)
  const [gameResult, setGameResult] = useState(null)

  const goTo = useCallback((s) => setScreen(s), [])

  const handleGameOver = useCallback((result) => {
    setGameResult(result)
    setScreen(result.win ? SCREEN.WIN : SCREEN.FAIL)
  }, [])

  const handleRestart = useCallback(() => {
    setGameResult(null)
    setScreen(SCREEN.GAME)
  }, [])

  return (
    <div className="app-root">
      {screen === SCREEN.MAIN_MENU && (
        <MainMenu onStart={() => goTo(SCREEN.GAME)}
                  onHowToPlay={() => goTo(SCREEN.HOW_TO_PLAY)}
                  onMathMaterial={() => goTo(SCREEN.MATH_MATERIAL)}
                  onCredits={() => goTo(SCREEN.CREDITS)} />
      )}
      {screen === SCREEN.HOW_TO_PLAY && (
        <HowToPlay onBack={() => goTo(SCREEN.MAIN_MENU)} />
      )}
      {screen === SCREEN.MATH_MATERIAL && (
        <MathMaterial onBack={() => goTo(SCREEN.MAIN_MENU)} />
      )}
      {screen === SCREEN.CREDITS && (
        <Credits onBack={() => goTo(SCREEN.MAIN_MENU)} />
      )}
      {screen === SCREEN.GAME && (
        <GameView onGameOver={handleGameOver}
                  onMenu={() => goTo(SCREEN.MAIN_MENU)} />
      )}
      {screen === SCREEN.WIN && (
        <WinScreen result={gameResult}
                   onRestart={handleRestart}
                   onMenu={() => goTo(SCREEN.MAIN_MENU)} />
      )}
      {screen === SCREEN.FAIL && (
        <FailScreen result={gameResult}
                    onRetry={handleRestart}
                    onMenu={() => goTo(SCREEN.MAIN_MENU)} />
      )}
    </div>
  )
}
