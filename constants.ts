

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const PLAYER_WIDTH = 32;
export const PLAYER_HEIGHT = 48;
export const PLAYER_SPEED = 5;
export const PLAYER_JUMP_POWER = 15;
export const PLAYER_DOUBLE_JUMP_POWER = 12;
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

// PLAYER DASH
export const DASH_DURATION = 10; // frames (1/6th of a second)
export const DASH_SPEED = 18;
export const DASH_COOLDOWN = 45; // 3/4 of a second
export const DASH_MANA_COST = 8;
export const DASH_INVINCIBILITY_DURATION = 12; // A bit longer than the dash itself

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

// ENEMY AI ENHANCEMENTS
export const ENFORCER_AGGRO_RANGE = 350;
export const ENFORCER_DASH_SPEED = 8;
export const ENFORCER_DASH_COOLDOWN = 180; // 3 seconds
export const ENFORCER_TELL_DURATION = 40; // frames for tell animation
export const ENFORCER_DASH_DURATION = 25; // frames for dash movement

export const SEEKER_REPOSITION_DISTANCE = 200; // will try to stay this far away

export const BOSS_ATTACK_CYCLE = 240; // Chooses a new attack every 4 seconds
export const BOSS_DASH_TELL = 50;
export const BOSS_DASH_SPEED = 10;
export const BOSS_DASH_DURATION = 40;
export const BOSS_SHOOT_TELL = 70;
export const BOSS_PROJECTILE_COUNT = 3;
export const BOSS_PROJECTILE_SPREAD = 0.4; // radians
export const BOSS_SLAM_TELL = 60;
export const BOSS_SLAM_JUMP_POWER = 18;
export const BOSS_SLAM_RADIUS = 250;
export const BOSS_SLAM_DAMAGE = 25;

// PLAYER ANIMATIONS
export const ANIMATION_FRAMES = {
    idle: 4,
    run: 6,
    jump: 1, // Will be handled by velocity check in render
    attack: 4,
    clawAttack: 4,
    dash: 1, // Dash is more of a pose
};

export const ANIMATION_SPEEDS = { // ticks per animation frame
    idle: 12,
    run: 5,
    jump: 1,
    attack: 4,
    clawAttack: 3,
    dash: 1,
};