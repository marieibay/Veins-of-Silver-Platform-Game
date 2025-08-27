
import { GameState, PlayerState, Projectile, Particle, Enemy } from '../types';
import * as C from '../constants';
import { audioManager } from './audioManager';
import { LEVELS } from '../data/levels';

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

export const updateProjectiles = (state: GameState) => {
    for (let i = state.projectiles.length - 1; i >= 0; i--) {
        const projectile = state.projectiles[i];

        projectile.x += projectile.velocityX;
        projectile.y += projectile.velocityY;

        // Remove projectile if it's off-screen
        if (projectile.x < state.camera.x - 50 || 
            projectile.x > state.camera.x + C.CANVAS_WIDTH + 50 ||
            projectile.y < state.camera.y - 50 ||
            projectile.y > state.camera.y + C.CANVAS_HEIGHT + 50
            ) {
            state.projectiles.splice(i, 1);
            continue;
        }

        if (projectile.owner === 'player') {
            for (let j = state.enemies.length - 1; j >= 0; j--) {
                const enemy = state.enemies[j];
                if (checkCollision(projectile, enemy)) {
                    enemy.health -= C.PENDANT_DAMAGE;
                    enemy.hitTimer = 10;
                    audioManager.playSFX('enemyHit');
                    state.particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, '#4dccbd'));
                    
                    if (enemy.health <= 0) {
                        const xp = enemy.type === 'enforcer' ? C.XP_PER_ENFORCER : enemy.type === 'seeker' ? C.XP_PER_SEEKER : C.XP_PER_BOSS;
                        state.player.experience += xp;
                        state.score += xp;
                        audioManager.playSFX('enemyDefeated');
                        state.particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20));
                    }
    
                    state.projectiles.splice(i, 1);
                    break; // Projectile is gone, stop checking enemies
                }
            }
        } else if (projectile.owner === 'enemy') {
            if (state.player.invincibilityTimer === 0 && checkCollision(projectile, state.player)) {
                state.player.health -= C.SEEKER_PROJECTILE_DAMAGE;
                state.player.invincibilityTimer = 60; // 1 second invincibility
                audioManager.playSFX('playerHurt');
                state.particles.push(...createHitParticles(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, 15));
                state.projectiles.splice(i, 1);
            }
        }
    }
};

export const updateParticles = (state: GameState) => {
    state.particles.forEach((p, index) => {
        p.life--;
        if (p.life <= 0) {
            state.particles.splice(index, 1);
        }
    });
};

export const updateEnemies = (state: GameState) => {
    const { enemies, player } = state;

    if (state.isoldeAttackTimer > 0) {
        state.isoldeAttackTimer--;
        if (state.isoldeAttackTimer === 45) {
            enemies.forEach(enemy => {
                if (enemy.x > state.camera.x && enemy.x < state.camera.x + C.CANVAS_WIDTH) {
                    enemy.health = 0;
                    state.particles.push(...createHitParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 30, '#e0e0e0'));
                }
            });
        }
    }


    enemies.forEach(enemy => {
        if(enemy.type === 'enforcer') {
            enemy.x += enemy.speed * enemy.direction;
            if (enemy.x < enemy.startX || enemy.x > enemy.startX + enemy.patrolRange) {
                enemy.direction *= -1;
            }
        }
        
        if(enemy.type === 'seeker') {
             enemy.y += Math.sin(Date.now() / 300 + enemy.id) * 0.5;
             enemy.x += enemy.speed * enemy.direction;
             if (enemy.x < enemy.startX || enemy.x > enemy.startX + enemy.patrolRange) {
                enemy.direction *= -1;
            }

            // New attack logic for seekers
            if (enemy.attackCooldown === undefined) enemy.attackCooldown = C.SEEKER_ATTACK_COOLDOWN;
            if (enemy.attackCooldown > 0) enemy.attackCooldown--;

            const distanceX = player.x - enemy.x;
            const distanceY = player.y - enemy.y;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < C.SEEKER_ATTACK_RANGE && enemy.attackCooldown === 0) {
                enemy.attackCooldown = C.SEEKER_ATTACK_COOLDOWN;
                
                const angle = Math.atan2(distanceY, distanceX);
                const projectile: Projectile = {
                    id: Math.random(),
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    width: 12,
                    height: 12,
                    velocityX: Math.cos(angle) * C.SEEKER_PROJECTILE_SPEED,
                    velocityY: Math.sin(angle) * C.SEEKER_PROJECTILE_SPEED,
                    type: 'darkEnergy',
                    owner: 'enemy',
                };
                state.projectiles.push(projectile);
                audioManager.playSFX('enemyShoot');
            }
        }
        
        if(enemy.type === 'boss') {
            const distance = player.x - enemy.x;
            if (Math.abs(distance) < 600) { // Increased aggro range
                enemy.direction = Math.sign(distance) as 1 | -1;
                enemy.x += enemy.speed * enemy.direction;
            }
        }

        if (enemy.hitTimer > 0) enemy.hitTimer--;

        if (player.invincibilityTimer === 0 && checkCollision(player, enemy)) {
            player.health -= enemy.type === 'boss' ? 25 : 10;
            player.invincibilityTimer = 60;
            audioManager.playSFX('playerHurt');
            player.velocityY = -5;
            player.velocityX = 8 * (player.x < enemy.x ? -1 : 1);
        }
    });

    state.enemies = state.enemies.filter(enemy => enemy.health > 0);
    
    // Check for boss defeat on the final level to reveal the goal
    if (state.currentLevel === 9 && state.goal.x < 0) { // Level 10 is index 9
        const bossExists = state.enemies.some(e => e.type === 'boss');
        if (!bossExists) {
            state.goal.x = 1400; // Place the goal in the arena
            audioManager.playSFX('powerUp');
        }
    }
};

export const updatePlayer = (state: GameState, keys: Record<string, boolean>): void => {
    const { player, platforms, enemies, particles, powerUps } = state;
    
    if (player.attackCooldown > 0) player.attackCooldown--;
    if (player.specialAttackCooldown > 0) player.specialAttackCooldown--;
    if (player.invincibilityTimer > 0) player.invincibilityTimer--;
    if (player.werewolfTimer > 0) {
        player.werewolfTimer--;
        if (player.werewolfTimer === 0) player.isWerewolf = false;
    }

    powerUps.forEach((powerUp, index) => {
        if (checkCollision(player, powerUp)) {
            if (powerUp.type === 'lunarFragment' && !player.isWerewolf) {
                player.isWerewolf = true;
                player.werewolfTimer = C.WEREWOLF_DURATION;
                particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 20, '#a855f7'));
                audioManager.playSFX('powerUp');
                powerUps.splice(index, 1);
            }
            if (powerUp.type === 'isoldeAid') {
                state.isoldeAttackTimer = 60;
                audioManager.playSFX('isoldeAssist');
                powerUps.splice(index, 1);
            }
             if (powerUp.type === 'healthVial') {
                player.health = Math.min(player.maxHealth, player.health + C.HEALTH_VIAL_AMOUNT);
                particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 20, '#34d399'));
                audioManager.playSFX('powerUp');
                powerUps.splice(index, 1);
            }
        }
    });
    
    const getDamage = (base: number, upgradeLevel: number, upgradeValues: number[]) => {
        return upgradeLevel > 0 ? upgradeValues[upgradeLevel - 1] : base;
    }

    if (keys['j'] && !player.attacking && player.attackCooldown === 0) {
        player.attacking = true;
        player.animation.frameTimer = 0;
        
        const processAttack = (damage: number, hitbox: { x: number, y: number, width: number, height: number }) => {
             enemies.forEach(enemy => {
                if (checkCollision(hitbox, enemy)) {
                    enemy.health -= damage;
                    enemy.hitTimer = 10;
                    audioManager.playSFX('enemyHit');
                    particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8));
                    if (enemy.health <= 0) {
                        const xp = enemy.type === 'enforcer' ? C.XP_PER_ENFORCER : enemy.type === 'seeker' ? C.XP_PER_SEEKER : C.XP_PER_BOSS;
                        state.player.experience += xp;
                        state.score += xp;
                        audioManager.playSFX('enemyDefeated');
                        particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20));
                    }
                }
            });
        };
        
        if (player.isWerewolf) {
            player.attackCooldown = C.CLAW_ATTACK_COOLDOWN;
            player.animation.currentState = 'clawAttack';
            audioManager.playSFX('clawAttack');
            const hitbox = { x: player.facing === 1 ? player.x + player.width : player.x - 45, y: player.y, width: 45, height: player.height };
            const damage = getDamage(C.CLAW_DAMAGE, player.upgrades.clawDamage, C.UPGRADE_VALUES.clawDamage);
            processAttack(damage, hitbox);
            player.velocityX = 5 * player.facing;
        } else {
            player.attackCooldown = C.ATTACK_COOLDOWN;
            player.animation.currentState = 'attack';
            audioManager.playSFX('daggerAttack');
            const hitbox = { x: player.facing === 1 ? player.x + player.width : player.x - 30, y: player.y + player.height / 4, width: 30, height: player.height / 2,};
            const damage = getDamage(C.DAGGER_DAMAGE, player.upgrades.daggerDamage, C.UPGRADE_VALUES.daggerDamage);
            processAttack(damage, hitbox);
        }
    }

    if (keys['k'] && player.specialAttackCooldown === 0 && player.mana >= C.PENDANT_COST) {
        player.mana -= C.PENDANT_COST;
        player.specialAttackCooldown = C.PENDANT_COOLDOWN;
        audioManager.playSFX('pendantCast');
        state.projectiles.push({
            id: Math.random(),
            x: player.x + (player.facing === 1 ? player.width : 0),
            y: player.y + player.height / 2 - 5,
            width: 10,
            height: 10,
            velocityX: C.PENDANT_SPEED * player.facing,
            velocityY: 0,
            type: 'pendantShard',
            owner: 'player',
        });
        particles.push(...createHitParticles(player.x + player.width/2, player.y + player.height/2, 10, '#4dccbd'));
    }

    if (!player.attacking || player.isWerewolf) {
        if (keys['a'] || keys['arrowleft']) { player.velocityX = -player.speed; player.facing = -1; } 
        else if (keys['d'] || keys['arrowright']) { player.velocityX = player.speed; player.facing = 1; } 
        else { if(!player.attacking) player.velocityX *= C.FRICTION; }
        if ((keys[' '] || keys['w'] || keys['arrowup']) && player.onGround) { player.velocityY = -player.jumpPower; player.onGround = false; audioManager.playSFX('jump'); }
    }
    
    player.velocityY += C.GRAVITY;
    player.x += player.velocityX;
    player.y += player.velocityY;

    player.onGround = false;
    platforms.forEach(platform => {
        if (checkCollision(player, platform) && player.y + player.height < platform.y + 20 && player.velocityY >= 0) {
             player.y = platform.y - player.height;
             player.velocityY = 0;
             player.onGround = true;
        }
    });
    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > state.worldWidth) player.x = state.worldWidth - player.width;

    player.animation.frameTimer++;
    if ((player.animation.currentState === 'attack' && player.animation.frameTimer > 15) || (player.animation.currentState === 'clawAttack' && player.animation.frameTimer > 12)) {
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

export const createGameStateForLevel = (levelIndex: number, previousPlayerState?: PlayerState): GameState => {
    const levelData = LEVELS[levelIndex];

    const upgrades = previousPlayerState ? previousPlayerState.upgrades : { maxHealth: 0, maxMana: 0, daggerDamage: 0, clawDamage: 0 };
    const maxHealth = upgrades.maxHealth > 0 ? C.UPGRADE_VALUES.maxHealth[upgrades.maxHealth - 1] : C.PLAYER_MAX_HEALTH;
    const maxMana = upgrades.maxMana > 0 ? C.UPGRADE_VALUES.maxMana[upgrades.maxMana - 1] : C.PLAYER_MAX_MANA;

    const initialPlayer: PlayerState = {
        x: levelData.playerStart.x,
        y: levelData.playerStart.y,
        width: C.PLAYER_WIDTH,
        height: C.PLAYER_HEIGHT,
        velocityX: 0,
        velocityY: 0,
        speed: C.PLAYER_SPEED,
        jumpPower: C.PLAYER_JUMP_POWER,
        onGround: false,
        health: maxHealth,
        maxHealth: maxHealth,
        mana: maxMana,
        maxMana: maxMana,
        facing: 1,
        attacking: false,
        attackCooldown: 0,
        specialAttackCooldown: 0,
        invincibilityTimer: 0,
        animation: { currentState: 'idle', frameIndex: 0, frameTimer: 0 },
        isWerewolf: false,
        werewolfTimer: 0,
        experience: previousPlayerState ? previousPlayerState.experience : 0,
        level: levelIndex,
        upgrades: upgrades,
        lives: previousPlayerState ? previousPlayerState.lives : C.PLAYER_STARTING_LIVES,
    };

    return {
        player: initialPlayer,
        platforms: JSON.parse(JSON.stringify(levelData.platforms)),
        enemies: JSON.parse(JSON.stringify(levelData.enemies)),
        projectiles: [],
        particles: [],
        powerUps: JSON.parse(JSON.stringify(levelData.powerUps)),
        camera: { x: 0, y: 0 },
        score: previousPlayerState ? previousPlayerState.experience : 0,
        worldWidth: levelData.worldWidth,
        worldHeight: levelData.worldHeight,
        goal: {...levelData.goal},
        currentLevel: levelIndex,
        isoldeAttackTimer: 0,
    };
};