


export interface PlayerAnimationState {
  currentState: 'idle' | 'run' | 'jump' | 'attack' | 'clawAttack' | 'dash' | 'wallSlide' | 'parry';
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
  isDashing: boolean;
  dashTimer: number;
  dashCooldown: number;
  dashTrail: { x: number; y: number; facing: 1 | -1 }[];
  canDoubleJump: boolean;
  jumpKeyHeld: boolean;
  isWallSliding: boolean;
  isParrying: boolean;
  parryTimer: number;
  parryCooldown: number;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  // New properties for movement
  type?: 'static' | 'horizontal' | 'vertical';
  moveSpeed?: number;
  moveRange?: number;
  startX?: number; // original start position
  startY?: number; // original start position
  direction?: 1 | -1;
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
  // FIX: Added optional patrolRange property to the Enemy interface. This property is used by some enemy types for patrol behavior and was missing from the type definition, causing multiple TypeScript errors.
  patrolRange?: number;
  attackCooldown?: number; // Time until next attack
  // New properties for advanced AI
  isAggro?: boolean;
  dashTimer?: number;
  attackPattern?: 'idle' | 'tell' | 'dash' | 'shoot' | 'slam';
  attackPhaseTimer?: number;
  velocityY?: number;
  onGround?: boolean;
  staggerTimer?: number;
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

export type HazardType = 'spikes';
export interface Hazard {
    x: number;
    y: number;
    width: number;
    height: number;
    type: HazardType;
}

export interface LevelData {
  playerStart: { x: number; y: number };
  platforms: Platform[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  goal: Goal;
  worldWidth: number;
  worldHeight: number;
  hazards?: Hazard[];
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
  screenShake: { magnitude: number; duration: number; };
  hazards: Hazard[];
}

export type GameStatus = 'title' | 'intro' | 'playing' | 'gameOver' | 'victory' | 'upgrade' | 'paused' | 'controls';

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