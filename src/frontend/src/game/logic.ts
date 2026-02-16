// Core game simulation: movement, spawning, collision detection, scoring

import {
  GameState,
  Player,
  Enemy,
  Bullet,
  Vector2D,
  DIFFICULTY_CONFIG,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  distance,
  normalize,
} from './types';
import { InputState } from './input';

let nextEnemyId = 0;
let nextBulletId = 0;
let lastEnemySpawn = 0;
let lastBulletShot = 0;

const BULLET_COOLDOWN = 150; // ms

export function createInitialState(): GameState {
  const player: Player = {
    position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    health: 3,
    maxHealth: 3,
    speed: 5,
    size: 32,
  };

  return {
    player,
    enemies: [],
    bullets: [],
    score: 0,
    wave: 1,
    gameTime: 0,
    isPaused: false,
    isGameOver: false,
  };
}

export function updateGame(state: GameState, input: InputState, deltaTime: number): GameState {
  if (state.isPaused || state.isGameOver) {
    return state;
  }

  const newState = { ...state };
  newState.gameTime += deltaTime;

  // Update wave
  const newWave = Math.floor(newState.gameTime / DIFFICULTY_CONFIG.waveInterval) + 1;
  if (newWave > newState.wave) {
    newState.wave = newWave;
  }

  // Update player
  updatePlayer(newState, input, deltaTime);

  // Spawn enemies
  spawnEnemies(newState, deltaTime);

  // Shoot bullets
  shootBullets(newState, input, deltaTime);

  // Update bullets
  updateBullets(newState, deltaTime);

  // Update enemies
  updateEnemies(newState, deltaTime);

  // Check collisions
  checkCollisions(newState);

  // Check game over
  if (newState.player.health <= 0) {
    newState.isGameOver = true;
  }

  return newState;
}

function updatePlayer(state: GameState, input: InputState, deltaTime: number) {
  const player = state.player;

  // Movement
  let dx = 0;
  let dy = 0;

  if (input.keys.has('w') || input.keys.has('arrowup')) dy -= 1;
  if (input.keys.has('s') || input.keys.has('arrowdown')) dy += 1;
  if (input.keys.has('a') || input.keys.has('arrowleft')) dx -= 1;
  if (input.keys.has('d') || input.keys.has('arrowright')) dx += 1;

  if (dx !== 0 || dy !== 0) {
    const normalized = normalize({ x: dx, y: dy });
    player.velocity.x = normalized.x * player.speed;
    player.velocity.y = normalized.y * player.speed;
  } else {
    player.velocity.x = 0;
    player.velocity.y = 0;
  }

  player.position.x += player.velocity.x;
  player.position.y += player.velocity.y;

  // Clamp to canvas
  player.position.x = Math.max(player.size, Math.min(CANVAS_WIDTH - player.size, player.position.x));
  player.position.y = Math.max(player.size, Math.min(CANVAS_HEIGHT - player.size, player.position.y));

  // Rotation (aim at mouse)
  const dx2 = input.mouse.x - player.position.x;
  const dy2 = input.mouse.y - player.position.y;
  player.rotation = Math.atan2(dy2, dx2);
}

function spawnEnemies(state: GameState, deltaTime: number) {
  lastEnemySpawn += deltaTime;

  const spawnRate = Math.max(
    DIFFICULTY_CONFIG.minSpawnRate,
    DIFFICULTY_CONFIG.baseSpawnRate - (state.wave - 1) * DIFFICULTY_CONFIG.spawnRateDecrease
  );

  if (lastEnemySpawn >= spawnRate) {
    lastEnemySpawn = 0;

    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;

    switch (side) {
      case 0: // top
        x = Math.random() * CANVAS_WIDTH;
        y = -20;
        break;
      case 1: // right
        x = CANVAS_WIDTH + 20;
        y = Math.random() * CANVAS_HEIGHT;
        break;
      case 2: // bottom
        x = Math.random() * CANVAS_WIDTH;
        y = CANVAS_HEIGHT + 20;
        break;
      case 3: // left
        x = -20;
        y = Math.random() * CANVAS_HEIGHT;
        break;
    }

    const speed = DIFFICULTY_CONFIG.baseEnemySpeed + (state.wave - 1) * DIFFICULTY_CONFIG.enemySpeedIncrease;
    const direction = normalize({
      x: state.player.position.x - x,
      y: state.player.position.y - y,
    });

    const enemy: Enemy = {
      id: nextEnemyId++,
      position: { x, y },
      velocity: { x: direction.x * speed, y: direction.y * speed },
      health: 1,
      size: 24,
      type: 'drone',
    };

    state.enemies.push(enemy);
  }
}

function shootBullets(state: GameState, input: InputState, deltaTime: number) {
  lastBulletShot += deltaTime;

  if ((input.mouse.isDown || input.keys.has(' ')) && lastBulletShot >= BULLET_COOLDOWN) {
    lastBulletShot = 0;

    const player = state.player;
    const speed = 12;
    const direction = { x: Math.cos(player.rotation), y: Math.sin(player.rotation) };

    const bullet: Bullet = {
      id: nextBulletId++,
      position: { x: player.position.x, y: player.position.y },
      velocity: { x: direction.x * speed, y: direction.y * speed },
      size: 8,
      damage: 1,
    };

    state.bullets.push(bullet);
  }
}

function updateBullets(state: GameState, deltaTime: number) {
  state.bullets = state.bullets.filter((bullet) => {
    bullet.position.x += bullet.velocity.x;
    bullet.position.y += bullet.velocity.y;

    // Remove if out of bounds
    return (
      bullet.position.x >= -50 &&
      bullet.position.x <= CANVAS_WIDTH + 50 &&
      bullet.position.y >= -50 &&
      bullet.position.y <= CANVAS_HEIGHT + 50
    );
  });
}

function updateEnemies(state: GameState, deltaTime: number) {
  state.enemies.forEach((enemy) => {
    enemy.position.x += enemy.velocity.x;
    enemy.position.y += enemy.velocity.y;
  });
}

function checkCollisions(state: GameState) {
  // Bullet vs Enemy
  const bulletsToRemove = new Set<number>();
  const enemiesToRemove = new Set<number>();

  state.bullets.forEach((bullet) => {
    state.enemies.forEach((enemy) => {
      if (bulletsToRemove.has(bullet.id) || enemiesToRemove.has(enemy.id)) return;

      const dist = distance(bullet.position, enemy.position);
      if (dist < bullet.size + enemy.size) {
        enemy.health -= bullet.damage;
        bulletsToRemove.add(bullet.id);

        if (enemy.health <= 0) {
          enemiesToRemove.add(enemy.id);
          state.score += 10;
        }
      }
    });
  });

  state.bullets = state.bullets.filter((b) => !bulletsToRemove.has(b.id));
  state.enemies = state.enemies.filter((e) => !enemiesToRemove.has(e.id));

  // Enemy vs Player
  state.enemies.forEach((enemy) => {
    const dist = distance(enemy.position, state.player.position);
    if (dist < enemy.size + state.player.size) {
      state.player.health -= 1;
      enemiesToRemove.add(enemy.id);
    }
  });

  state.enemies = state.enemies.filter((e) => !enemiesToRemove.has(e.id));
}

export function resetGameTimers() {
  nextEnemyId = 0;
  nextBulletId = 0;
  lastEnemySpawn = 0;
  lastBulletShot = 0;
}
