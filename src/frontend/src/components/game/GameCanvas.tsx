import { useEffect, useRef, useState } from 'react';
import { GameState, CANVAS_WIDTH, CANVAS_HEIGHT } from '../../game/types';
import { loadAssets, GameAssets } from '../../game/assets';
import { InputHandler } from '../../game/input';
import { updateGame, createInitialState, resetGameTimers } from '../../game/logic';
import { GameRenderer } from '../../game/renderer';

interface GameCanvasProps {
  onStateChange: (state: GameState) => void;
  isPaused: boolean;
  onPauseToggle: () => void;
  shouldRestart: boolean;
  onRestartComplete: () => void;
}

export function GameCanvas({ onStateChange, isPaused, onPauseToggle, shouldRestart, onRestartComplete }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assets, setAssets] = useState<GameAssets | null>(null);
  const gameStateRef = useRef<GameState>(createInitialState());
  const inputHandlerRef = useRef<InputHandler | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const lastTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // Load assets
  useEffect(() => {
    loadAssets().then(setAssets);
  }, []);

  // Initialize input and renderer
  useEffect(() => {
    if (!canvasRef.current || !assets) return;

    inputHandlerRef.current = new InputHandler(canvasRef.current, {
      onPause: onPauseToggle,
    });

    rendererRef.current = new GameRenderer(canvasRef.current, assets);

    return () => {
      inputHandlerRef.current?.detach();
    };
  }, [assets, onPauseToggle]);

  // Handle restart
  useEffect(() => {
    if (shouldRestart) {
      resetGameTimers();
      gameStateRef.current = createInitialState();
      onStateChange(gameStateRef.current);
      onRestartComplete();
    }
  }, [shouldRestart, onStateChange, onRestartComplete]);

  // Game loop
  useEffect(() => {
    if (!assets || !rendererRef.current || !inputHandlerRef.current) return;

    const gameLoop = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const currentState = gameStateRef.current;
      currentState.isPaused = isPaused;

      if (!isPaused && !currentState.isGameOver) {
        const input = inputHandlerRef.current!.getState();
        gameStateRef.current = updateGame(currentState, input, deltaTime);
        onStateChange(gameStateRef.current);
      }

      rendererRef.current!.render(gameStateRef.current);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [assets, isPaused, onStateChange]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-2 border-accent rounded-lg shadow-2xl"
    />
  );
}
