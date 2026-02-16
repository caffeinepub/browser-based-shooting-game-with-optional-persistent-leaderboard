// Game state and entity types for the 2D shooting game

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2D;
  velocity: Vector2D;
  rotation: number; // radians, for aiming
  health: number;
  maxHealth: number;
  speed: number;
  size: number;
}

export interface Enemy {
  id: number;
  position: Vector2D;
  velocity: Vector2D;
  health: number;
  size: number;
  type: 'drone';
}

export interface Bullet {
  id: number;
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  damage: number;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  score: number;
  wave: number;
  gameTime: number;
  isPaused: boolean;
  isGameOver: boolean;
}

export interface DifficultyConfig {
  baseSpawnRate: number; // ms between spawns
  spawnRateDecrease: number; // decrease per wave
  minSpawnRate: number;
  baseEnemySpeed: number;
  enemySpeedIncrease: number; // increase per wave
  waveInterval: number; // ms per wave
}

export const DIFFICULTY_CONFIG: DifficultyConfig = {
  baseSpawnRate: 2000,
  spawnRateDecrease: 100,
  minSpawnRate: 500,
  baseEnemySpeed: 1.5,
  enemySpeedIncrease: 0.15,
  waveInterval: 30000,
};

export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

// Math helpers
export function distance(a: Vector2D, b: Vector2D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function normalize(v: Vector2D): Vector2D {
  const len = Math.sqrt(v.x * v.x + v.y * v.y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: v.x / len, y: v.y / len };
}
