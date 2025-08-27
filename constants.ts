

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
export const DAGGER_THROW_COST = 10;
export const DAGGER_THROW_SPEED = 12;
export const DAGGER_THROW_COOLDOWN = 30; // 0.5 sec cooldown

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

// CHARGE ATTACK
export const CHARGE_ATTACK_MAX_TIME = 120; // 2 seconds at 60fps
export const CHARGE_ATTACK_MIN_TIME = 20;  // 1/3rd of a second to activate
export const CHARGE_ATTACK_MANA_COST_MIN = 15;
export const CHARGE_ATTACK_MANA_COST_MAX = 40;
export const CHARGE_ATTACK_DAMAGE_MIN = 20;
export const CHARGE_ATTACK_DAMAGE_MAX = 70;
export const CHARGE_ATTACK_RADIUS_MIN = 50;
export const CHARGE_ATTACK_RADIUS_MAX = 150;


// ENEMY ATTACKS
export const SEEKER_ATTACK_RANGE = 400;
export const SEEKER_ATTACK_COOLDOWN = 120; // 2 seconds at 60fps
export const SEEKER_PROJECTILE_SPEED = 4;
export const SEEKER_PROJECTILE_DAMAGE = 10;

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