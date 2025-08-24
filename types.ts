
export interface PlayerAnimationState {
  currentState: 'idle' | 'run' | 'jump' | 'attack' | 'clawAttack';
  frameIndex: number;
  frameTimer: number;
}

export interface PlayerState {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  jumpPower: number;
  onGround: boolean;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  facing: 1 | -1;
  attacking: boolean;
  attackCooldown: number;
  invincibilityTimer: number; // To prevent rapid damage
  animation: PlayerAnimationState;
  isWerewolf: boolean;
  werewolfTimer: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type EnemyType = 'enforcer' | 'seeker';

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  speed: number;
  direction: 1 | -1;
  type: EnemyType;
  hitTimer: number; // For hit flash effect
  startX: number; // For patrol range
  patrolRange: number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
}

export type PowerUpType = 'lunarFragment';

export interface PowerUp {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    type: PowerUpType;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Camera {
  x: number;
  y: number;
}

export interface KeysPressed {
  [key: string]: boolean;
}

export interface Goal {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface GameState {
  player: PlayerState;
  platforms: Platform[];
  enemies: Enemy[];
  projectiles: Projectile[];
  particles: Particle[];
  powerUps: PowerUp[];
  camera: Camera;
  score: number;
  worldWidth: number;
  worldHeight: number;
  goal: Goal;
}

export type GameStatus = 'title' | 'playing' | 'gameOver' | 'victory';

export interface UIState {
    health: number;
    mana: number;
    score: number;
    isWerewolf: boolean;
    werewolfTimer: number;
    isMuted: boolean;
}