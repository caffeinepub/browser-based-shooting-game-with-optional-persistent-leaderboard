// 2D Canvas renderer for game sprites and background

import { GameState, CANVAS_WIDTH, CANVAS_HEIGHT } from './types';
import { GameAssets } from './assets';

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private assets: GameAssets;

  constructor(canvas: HTMLCanvasElement, assets: GameAssets) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.assets = assets;
  }

  render(state: GameState) {
    this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    this.drawBackground();

    // Draw bullets
    state.bullets.forEach((bullet) => {
      this.drawBullet(bullet.position.x, bullet.position.y, bullet.size);
    });

    // Draw enemies
    state.enemies.forEach((enemy) => {
      this.drawEnemy(enemy.position.x, enemy.position.y, enemy.size);
    });

    // Draw player
    this.drawPlayer(state.player.position.x, state.player.position.y, state.player.rotation, state.player.size);
  }

  private drawBackground() {
    if (this.assets.starfieldBg.complete) {
      // Tile the background
      const pattern = this.ctx.createPattern(this.assets.starfieldBg, 'repeat');
      if (pattern) {
        this.ctx.fillStyle = pattern;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
    } else {
      // Fallback
      this.ctx.fillStyle = 'oklch(0.145 0 0)';
      this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

  private drawPlayer(x: number, y: number, rotation: number, size: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation);
    
    if (this.assets.playerShip.complete) {
      this.ctx.drawImage(this.assets.playerShip, -size, -size, size * 2, size * 2);
    } else {
      // Fallback triangle
      this.ctx.fillStyle = 'oklch(0.75 0.2 140)';
      this.ctx.beginPath();
      this.ctx.moveTo(size, 0);
      this.ctx.lineTo(-size, -size / 2);
      this.ctx.lineTo(-size, size / 2);
      this.ctx.closePath();
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  private drawEnemy(x: number, y: number, size: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    
    if (this.assets.enemyDrone.complete) {
      this.ctx.drawImage(this.assets.enemyDrone, -size, -size, size * 2, size * 2);
    } else {
      // Fallback circle
      this.ctx.fillStyle = 'oklch(0.6 0.25 20)';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }

  private drawBullet(x: number, y: number, size: number) {
    this.ctx.save();
    this.ctx.translate(x, y);
    
    if (this.assets.laserBullet.complete) {
      this.ctx.drawImage(this.assets.laserBullet, -size, -size, size * 2, size * 2);
    } else {
      // Fallback circle
      this.ctx.fillStyle = 'oklch(0.85 0.25 140)';
      this.ctx.beginPath();
      this.ctx.arc(0, 0, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    this.ctx.restore();
  }
}
