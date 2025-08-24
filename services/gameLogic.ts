
import { GameState, PlayerState, Platform, Enemy, Particle, PowerUp } from '../types';
import * as C from '../constants';
import { audioManager } from './audioManager';

export const checkCollision = (
    a: { x: number; y: number; width: number; height: number; },
    b: { x: number; y: number; width: number; height: number; }
): boolean => {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
};

const createHitParticles = (x: number, y: number, count: number, color = '#ff4d4d'): Particle[] => {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            id: Math.random(),
            x,
            y,
            velocityX: (Math.random() - 0.5) * 5,
            velocityY: (Math.random() - 0.5) * 5,
            life: 20,
            maxLife: 20,
            color,
            size: Math.random() * 3 + 1,
        });
    }
    return particles;
};


export const updateEnemies = (state: GameState) => {
    const { enemies, player } = state;

    enemies.forEach(enemy => {
        // Simple patrol AI
        if(enemy.type === 'enforcer') {
            enemy.x += enemy.speed * enemy.direction;
            if (enemy.x < enemy.startX || enemy.x > enemy.startX + enemy.patrolRange) {
                enemy.direction *= -1;
            }
        }
        
        // Seeker Hover AI
        if(enemy.type === 'seeker') {
             enemy.y += Math.sin(Date.now() / 300 + enemy.id) * 0.5;
             enemy.x += enemy.speed * enemy.direction;
             if (enemy.x < enemy.startX || enemy.x > enemy.startX + enemy.patrolRange) {
                enemy.direction *= -1;
            }
        }

        // Decrement hit timer
        if (enemy.hitTimer > 0) {
            enemy.hitTimer--;
        }

        // Player collision
        if (player.invincibilityTimer === 0 && checkCollision(player, enemy)) {
            player.health -= 10;
            player.invincibilityTimer = 60; // 1 second of invincibility
            audioManager.playSFX('playerHurt');
             // Knockback
            player.velocityY = -5;
            player.velocityX = 5 * (player.x < enemy.x ? -1 : 1);
        }
    });

    // Remove dead enemies
    state.enemies = state.enemies.filter(enemy => enemy.health > 0);

     // Update particles
    state.particles.forEach(p => p.life--);
    state.particles = state.particles.filter(p => p.life > 0);
};

export const updatePlayer = (state: GameState, keys: Record<string, boolean>): void => {
    const { player, platforms, enemies, particles, powerUps } = state;
    // --- COOLDOWNS & TIMERS ---
    if (player.attackCooldown > 0) player.attackCooldown--;
    if (player.invincibilityTimer > 0) player.invincibilityTimer--;
    if (player.werewolfTimer > 0) {
        player.werewolfTimer--;
        if (player.werewolfTimer === 0) {
            player.isWerewolf = false;
        }
    }

    // --- POWER-UP COLLISION ---
    powerUps.forEach((powerUp, index) => {
        if (checkCollision(player, powerUp)) {
            if (powerUp.type === 'lunarFragment') {
                player.isWerewolf = true;
                player.werewolfTimer = C.WEREWOLF_DURATION;
                particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 20, '#a855f7'));
                audioManager.playSFX('powerUp');
                powerUps.splice(index, 1);
            }
        }
    });


    // --- STATE UPDATE based on INPUT ---
    if (keys['j'] && !player.attacking && player.attackCooldown === 0) {
        player.attacking = true;
        player.animation.frameTimer = 0;
        
        if (player.isWerewolf) {
            // --- CLAW ATTACK ---
            player.attackCooldown = C.CLAW_ATTACK_COOLDOWN;
            player.animation.currentState = 'clawAttack';
            audioManager.playSFX('clawAttack');
            const hitbox = {
                x: player.facing === 1 ? player.x + player.width : player.x - 45,
                y: player.y,
                width: 45,
                height: player.height,
            };

            enemies.forEach(enemy => {
                if (checkCollision(hitbox, enemy)) {
                    enemy.health -= C.CLAW_DAMAGE;
                    enemy.hitTimer = 10;
                    audioManager.playSFX('enemyHit');
                    particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8));
                    if (enemy.health <= 0) {
                        state.score += 150; // More points for werewolf kills
                        audioManager.playSFX('enemyDefeated');
                        particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20));
                    }
                }
            });
            player.velocityX = 5 * player.facing; // Lunge forward
        } else {
            // --- DAGGER ATTACK ---
            player.attackCooldown = C.ATTACK_COOLDOWN;
            player.animation.currentState = 'attack';
            audioManager.playSFX('daggerAttack');
            const hitbox = {
                x: player.facing === 1 ? player.x + player.width : player.x - 30,
                y: player.y + player.height / 4,
                width: 30,
                height: player.height / 2,
            };

            enemies.forEach(enemy => {
                if (checkCollision(hitbox, enemy)) {
                    enemy.health -= C.DAGGER_DAMAGE;
                    enemy.hitTimer = 10;
                    audioManager.playSFX('enemyHit');
                    particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 5));
                    if (enemy.health <= 0) {
                        state.score += 100;
                        audioManager.playSFX('enemyDefeated');
                        particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15));
                    }
                }
            });
        }
    }

    // --- MOVEMENT & PHYSICS ---
    if (!player.attacking || player.isWerewolf) { // Allow movement while claw attacking
        if (keys['a'] || keys['arrowleft']) {
            player.velocityX = -player.speed;
            player.facing = -1;
        } else if (keys['d'] || keys['arrowright']) {
            player.velocityX = player.speed;
            player.facing = 1;
        } else {
            if(!player.attacking) player.velocityX *= C.FRICTION;
        }
        if ((keys[' '] || keys['w'] || keys['arrowup']) && player.onGround) {
            player.velocityY = -player.jumpPower;
            player.onGround = false;
            audioManager.playSFX('jump');
        }
    }
    
    player.velocityY += C.GRAVITY;
    player.x += player.velocityX;
    player.y += player.velocityY;

    // --- COLLISION DETECTION ---
    player.onGround = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform) && player.y + player.height < platform.y + 20 && player.velocityY >= 0) {
             player.y = platform.y - player.height;
             player.velocityY = 0;
             player.onGround = true;
        }
    });

    // --- ANIMATION ---
    player.animation.frameTimer++;
    if ((player.animation.currentState === 'attack' && player.animation.frameTimer > 15) ||
        (player.animation.currentState === 'clawAttack' && player.animation.frameTimer > 12)) { // Claw attack is faster
        player.attacking = false;
    }

    if (!player.attacking) {
        let newAnimationState: PlayerState['animation']['currentState'] = 'idle';
        if (!player.onGround) newAnimationState = 'jump';
        else if (Math.abs(player.velocityX) > 0.1) newAnimationState = 'run';

        if (player.animation.currentState !== newAnimationState) {
            player.animation.currentState = newAnimationState;
            player.animation.frameTimer = 0;
        }
    }
};


export const createInitialGameState = (): GameState => {
    const initialPlayer: PlayerState = {
        x: 100,
        y: 400,
        width: C.PLAYER_WIDTH,
        height: C.PLAYER_HEIGHT,
        velocityX: 0,
        velocityY: 0,
        speed: C.PLAYER_SPEED,
        jumpPower: C.PLAYER_JUMP_POWER,
        onGround: false,
        health: C.PLAYER_MAX_HEALTH,
        maxHealth: C.PLAYER_MAX_HEALTH,
        mana: C.PLAYER_MAX_MANA,
        maxMana: C.PLAYER_MAX_MANA,
        facing: 1,
        attacking: false,
        attackCooldown: 0,
        invincibilityTimer: 0,
        animation: {
            currentState: 'idle',
            frameIndex: 0,
            frameTimer: 0,
        },
        isWerewolf: false,
        werewolfTimer: 0,
    };

    const initialPlatforms: Platform[] = [
        {x: 0, y: 550, width: 300, height: 50},
        {x: 350, y: 500, width: 200, height: 50},
        {x: 600, y: 450, width: 150, height: 50},
        {x: 800, y: 400, width: 200, height: 50},
        {x: 1100, y: 500, width: 150, height: 50},
        {x: 1300, y: 420, width: 200, height: 50},
        {x: 1600, y: 450, width: 300, height: 50},
        {x: 1850, y: 400, width: 150, height: 50}
    ];

    const initialEnemies: Enemy[] = [
        {id: 1, x: 400, y: 452, width: 32, height: 48, health: 30, speed: 1, direction: 1, type: 'enforcer', hitTimer: 0, startX: 360, patrolRange: 120},
        {id: 2, x: 850, y: 352, width: 32, height: 48, health: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 810, patrolRange: 120},
        {id: 3, x: 1200, y: 300, width: 40, height: 40, health: 50, speed: 1, direction: 1, type: 'seeker', hitTimer: 0, startX: 1150, patrolRange: 200},
        {id: 4, x: 1400, y: 372, width: 32, height: 48, health: 30, speed: 1, direction: -1, type: 'enforcer', hitTimer: 0, startX: 1310, patrolRange: 150},
        {id: 5, x: 1700, y: 402, width: 32, height: 48, health: 30, speed: 1.2, direction: 1, type: 'enforcer', hitTimer: 0, startX: 1650, patrolRange: 180},
    ];

    const initialPowerUps: PowerUp[] = [
        {id: 1, x: 650, y: 420, width: 24, height: 24, type: 'lunarFragment'}
    ];

    return {
        player: initialPlayer,
        platforms: initialPlatforms,
        enemies: initialEnemies,
        projectiles: [],
        particles: [],
        powerUps: initialPowerUps,
        camera: { x: 0, y: 0 },
        score: 0,
        worldWidth: C.WORLD_WIDTH,
        worldHeight: C.WORLD_HEIGHT,
        goal: { x: C.WORLD_WIDTH - 120, y: 300, width: 60, height: 100 }
    };
};