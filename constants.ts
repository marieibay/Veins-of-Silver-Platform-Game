
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 48;
export const PLAYER_SPEED = 5;
export const PLAYER_JUMP_POWER = 15;
export const PLAYER_MAX_HEALTH = 100;
export const PLAYER_MAX_MANA = 80;
export const PLAYER_STARTING_LIVES = 3;

export const GRAVITY = 0.8;
export const FRICTION = 0.8;

export const ATTACK_COOLDOWN = 20; // in frames
export const DAGGER_DAMAGE = 15;
export const PENDANT_COST = 20;
export const PENDANT_DAMAGE = 25;
export const PENDANT_SPEED = 10;
export const PENDANT_COOLDOWN = 30; // 0.5 sec cooldown

export const WEREWOLF_DURATION = 600; // 10 seconds at 60fps
export const CLAW_DAMAGE = 30;
export const CLAW_ATTACK_COOLDOWN = 15; // Faster than dagger

export const HEALTH_VIAL_AMOUNT = 25;

export const WORLD_WIDTH = 2000;
export const WORLD_HEIGHT = 600;

export const XP_PER_ENFORCER = 100;
export const XP_PER_SEEKER = 150;
export const XP_PER_BOSS = 1000;

export const BOSS_WIDTH = 80;
export const BOSS_HEIGHT = 96;
export const BOSS_HEALTH = 500;
export const BOSS_SPEED = 0.5;

// UPGRADE SYSTEM
export const UPGRADE_COSTS = {
  maxHealth: [300, 600, 1200],
  maxMana: [250, 500, 1000],
  daggerDamage: [400, 800],
  clawDamage: [500, 1000],
};

export const UPGRADE_VALUES = {
  maxHealth: [125, 150, 175],
  maxMana: [100, 120, 140],
  daggerDamage: [20, 25],
  clawDamage: [40, 50],
};