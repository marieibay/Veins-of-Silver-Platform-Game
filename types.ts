

export interface PlayerAnimationState {
  currentState: 'idle' | 'run' | 'jump' | 'attack' | 'clawAttack';
  frameIndex: number;
  frameTimer: number;
}

export interface PlayerUpgrades {
  maxHealth: number;
  maxMana: number;
  daggerDamage: number;
  clawDamage: number;
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
  invincibilityTimer: number;
  animation: PlayerAnimationState;
  isWerewolf: boolean;
  werewolfTimer: number;
  experience: number;
  level: number;
  upgrades: PlayerUpgrades;
  specialAttackCooldown: number;
  lives: number;
  chargeTimer: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type EnemyType = 'enforcer' | 'seeker' | 'boss';

export interface Enemy {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  speed: number;
  direction: 1 | -1;
  type: EnemyType;
  hitTimer: number; // For hit flash effect
  startX: number; // For patrol range
  // FIX: Add missing patrolRange property.
  patrolRange: number;
  attackCooldown?: number; // Time until next attack
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  type: 'dagger' | 'darkEnergy';
  owner: 'player' | 'enemy';
  damage: number;
}

export type PowerUpType = 'lunarFragment' | 'isoldeAid' | 'healthVial';

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
  type?: 'shockwave';
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

export interface LevelData {
  playerStart: { x: number; y: number };
  platforms: Platform[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  goal: Goal;
  worldWidth: number;
  worldHeight: number;
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
  currentLevel: number;
  isoldeAttackTimer: number;
}

export type GameStatus = 'title' | 'intro' | 'playing' | 'gameOver' | 'victory' | 'upgrade' | 'paused';

export interface UIState {
    health: number;
    maxHealth: number;
    mana: number;
    maxMana: number;
    score: number;
    level: number;
    isWerewolf: boolean;
    werewolfTimer: number;
    isMuted: boolean;
    experience: number;
    upgrades: PlayerUpgrades;
    lives: number;
}

export interface GameHandle {
  skipToNextLevel: () => void;
}