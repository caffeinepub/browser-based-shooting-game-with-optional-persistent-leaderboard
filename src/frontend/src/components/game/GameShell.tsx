import { useState, useCallback } from 'react';
import { GameCanvas } from './GameCanvas';
import { Hud } from './Hud';
import { StartScreen } from './StartScreen';
import { PauseOverlay } from './PauseOverlay';
import { GameOverScreen } from './GameOverScreen';
import { GameState } from '../../game/types';
import { createInitialState } from '../../game/logic';

type GamePhase = 'start' | 'playing' | 'paused' | 'gameOver';

export function GameShell() {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [shouldRestart, setShouldRestart] = useState(false);

  const handleStart = useCallback(() => {
    setPhase('playing');
  }, []);

  const handlePauseToggle = useCallback(() => {
    setPhase((prev) => (prev === 'playing' ? 'paused' : 'playing'));
  }, []);

  const handleRestart = useCallback(() => {
    setShouldRestart(true);
    setPhase('playing');
  }, []);

  const handleRestartComplete = useCallback(() => {
    setShouldRestart(false);
  }, []);

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
    if (newState.isGameOver && phase === 'playing') {
      setPhase('gameOver');
    }
  }, [phase]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
      <div className="relative">
        <GameCanvas
          onStateChange={handleStateChange}
          isPaused={phase !== 'playing'}
          onPauseToggle={handlePauseToggle}
          shouldRestart={shouldRestart}
          onRestartComplete={handleRestartComplete}
        />

        {phase === 'playing' && (
          <Hud
            score={gameState.score}
            health={gameState.player.health}
            maxHealth={gameState.player.maxHealth}
            wave={gameState.wave}
          />
        )}

        {phase === 'start' && <StartScreen onStart={handleStart} />}

        {phase === 'paused' && (
          <PauseOverlay onResume={handlePauseToggle} onRestart={handleRestart} />
        )}

        {phase === 'gameOver' && (
          <GameOverScreen
            score={gameState.score}
            wave={gameState.wave}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
