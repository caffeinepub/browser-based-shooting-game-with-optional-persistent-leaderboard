// Static asset loading for game sprites and background

export interface GameAssets {
  playerShip: HTMLImageElement;
  enemyDrone: HTMLImageElement;
  laserBullet: HTMLImageElement;
  starfieldBg: HTMLImageElement;
  loaded: boolean;
}

let assetsCache: GameAssets | null = null;

export async function loadAssets(): Promise<GameAssets> {
  if (assetsCache?.loaded) {
    return assetsCache;
  }

  const assets: GameAssets = {
    playerShip: new Image(),
    enemyDrone: new Image(),
    laserBullet: new Image(),
    starfieldBg: new Image(),
    loaded: false,
  };

  assets.playerShip.src = '/assets/generated/player-ship.dim_256x256.png';
  assets.enemyDrone.src = '/assets/generated/enemy-drone.dim_256x256.png';
  assets.laserBullet.src = '/assets/generated/laser-bullet.dim_64x64.png';
  assets.starfieldBg.src = '/assets/generated/starfield-bg.dim_1920x1080.png';

  await Promise.all([
    new Promise((resolve) => { assets.playerShip.onload = resolve; }),
    new Promise((resolve) => { assets.enemyDrone.onload = resolve; }),
    new Promise((resolve) => { assets.laserBullet.onload = resolve; }),
    new Promise((resolve) => { assets.starfieldBg.onload = resolve; }),
  ]);

  assets.loaded = true;
  assetsCache = assets;
  return assets;
}

export function getAssets(): GameAssets | null {
  return assetsCache;
}
