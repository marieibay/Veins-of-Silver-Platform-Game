
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

export const updatePlatforms = (state: GameState) => {
    state.platforms.forEach(p => {
        if (p.type === 'horizontal' && p.moveSpeed && p.moveRange && p.startX !== undefined) {
            p.x += p.moveSpeed * (p.direction ?? 1);
            if (p.x > p.startX + p.moveRange || p.x < p.startX) {
                p.direction = (p.direction ?? 1) * -1 as 1 | -1;
                 // Clamp position to avoid overshooting
                p.x = Math.max(p.startX, Math.min(p.x, p.startX + p.moveRange));
            }
        }
        if (p.type === 'vertical' && p.moveSpeed && p.moveRange && p.startY !== undefined) {
            p.y += p.moveSpeed * (p.direction ?? 1);
            if (p.y > p.startY + p.moveRange || p.y < p.startY) {
                p.direction = (p.direction ?? 1) * -1 as 1 | -1;
                p.y = Math.max(p.startY, Math.min(p.y, p.startY + p.moveRange));
            }
        }
    });
};

const getDamage = (base: number, upgradeLevel: number, upgradeValues: number[]) => {
    return upgradeLevel > 0 ? upgradeValues[upgradeLevel - 1] : base;
}

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
                    enemy.health -= projectile.damage;
                    enemy.hitTimer = 10;
                    audioManager.playSFX('enemyHit');
                    state.particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, '#e0e0e0'));
                    
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
                state.player.health -= projectile.damage;
                state.player.invincibilityTimer = 60; // 1 second invincibility
                audioManager.playSFX('playerHurt');
                state.particles.push(...createHitParticles(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, 15));
                state.projectiles.splice(i, 1);
            }
        }
    }
};

export const updateParticles = (state: GameState) => {
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.life--;
        if (p.life <= 0) {
            state.particles.splice(i, 1);
        }
    }
};

const applyGravityAndPlatformCollision = (entity: Enemy | PlayerState, platforms: GameState['platforms']) => {
    entity.y += entity.velocityY!;
    entity.onGround = false;

    platforms.forEach(platform => {
        const isFalling = entity.velocityY! >= 0;
        const entityBottom = entity.y + entity.height;
        const platformTop = platform.y;
        
        // Check if entity was above the platform in the last frame and is now intersecting
        if (isFalling && entityBottom >= platformTop && entityBottom <= platformTop + 20 &&
            entity.x + entity.width > platform.x && entity.x < platform.x + platform.width) {
            
            entity.y = platform.y - entity.height;
            entity.velocityY = 0;
            entity.onGround = true;

            // Stick to moving platforms
            if (platform.type === 'horizontal' && platform.moveSpeed) {
                entity.x += platform.moveSpeed * (platform.direction ?? 1);
            }
             if (platform.type === 'vertical' && platform.moveSpeed) {
                entity.y += platform.moveSpeed * (platform.direction ?? 1);
            }
        }
    });

    if (!entity.onGround) {
        entity.velocityY! += C.GRAVITY;
    }

    return entity.onGround;
};

export const updateEnemies = (state: GameState) => {
    const { enemies, player, platforms } = state;

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
        const distanceX = player.x - enemy.x;
        const distanceY = player.y - enemy.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        
        // Initialize optional properties
        if (enemy.velocityY === undefined) enemy.velocityY = 0;
        if (enemy.onGround === undefined) enemy.onGround = false;

        // --- AI LOGIC ---
        if (enemy.type === 'enforcer') {
            if (!enemy.isAggro && distance < C.ENFORCER_AGGRO_RANGE) {
                enemy.isAggro = true;
                enemy.attackCooldown = 60; // Initial delay
            }
            if (enemy.isAggro) {
                // Move towards player when not actively dashing/telling
                 if (!enemy.attackPattern || enemy.attackPattern === 'idle') {
                    if (enemy.attackCooldown! > 0) {
                        enemy.attackCooldown!--;
                         if (Math.abs(distanceX) > 50) { // Keep moving if not in melee range
                            enemy.direction = Math.sign(distanceX) as 1 | -1;
                            enemy.x += enemy.speed * enemy.direction;
                        }
                    } else {
                        enemy.attackPattern = 'tell';
                        enemy.direction = Math.sign(distanceX) as 1 | -1;
                        enemy.attackPhaseTimer = C.ENFORCER_TELL_DURATION;
                        enemy.attackCooldown = C.ENFORCER_DASH_COOLDOWN;
                    }
                } else if (enemy.attackPattern === 'dash') {
                    enemy.x += C.ENFORCER_DASH_SPEED * enemy.direction;
                    enemy.dashTimer!--;
                    if (enemy.dashTimer! <= 0) enemy.attackPattern = 'idle';
                } else if (enemy.attackPattern === 'tell') {
                    enemy.attackPhaseTimer!--;
                    if (enemy.attackPhaseTimer! <= 0) {
                        enemy.attackPattern = 'dash';
                        enemy.dashTimer = C.ENFORCER_DASH_DURATION;
                    }
                }
                if (distance > C.ENFORCER_AGGRO_RANGE * 1.5) enemy.isAggro = false;
            } else {
                // Default patrol behavior
                enemy.x += enemy.speed * enemy.direction;
                if (enemy.x < enemy.startX || enemy.x > enemy.startX + enemy.patrolRange) {
                    enemy.direction *= -1;
                }
            }
        }
        
        if(enemy.type === 'seeker') {
             // Vertical float
             enemy.y += Math.sin(Date.now() / 300 + enemy.id) * 0.5;

             // Horizontal repositioning and patrol
             if (distance < C.SEEKER_REPOSITION_DISTANCE) {
                 enemy.direction = -Math.sign(distanceX) as 1 | -1;
                 enemy.x += enemy.speed * enemy.direction; // Move away
             } else {
                 enemy.x += enemy.speed * enemy.direction;
                 if (enemy.x < enemy.startX || enemy.x > enemy.startX + enemy.patrolRange) {
                    enemy.direction *= -1;
                }
             }

            // Attack logic
            if (enemy.attackCooldown === undefined) enemy.attackCooldown = C.SEEKER_ATTACK_COOLDOWN;
            if (enemy.attackCooldown > 0) enemy.attackCooldown--;

            if (distance < C.SEEKER_ATTACK_RANGE && enemy.attackCooldown === 0) {
                enemy.attackCooldown = C.SEEKER_ATTACK_COOLDOWN;
                const angle = Math.atan2(distanceY, distanceX);
                state.projectiles.push({
                    id: Math.random(), x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, width: 12, height: 12,
                    velocityX: Math.cos(angle) * C.SEEKER_PROJECTILE_SPEED, velocityY: Math.sin(angle) * C.SEEKER_PROJECTILE_SPEED,
                    type: 'darkEnergy', owner: 'enemy', damage: C.SEEKER_PROJECTILE_DAMAGE,
                });
                audioManager.playSFX('enemyShoot');
            }
        }
        
        if(enemy.type === 'boss') {
            if (enemy.attackCooldown === undefined) enemy.attackCooldown = 120; // Initial delay
            if (enemy.attackPhaseTimer === undefined) enemy.attackPhaseTimer = 0;
            if (enemy.attackCooldown > 0) enemy.attackCooldown--;

            // Handle landing from slam attack
            const wasAirborne = !enemy.onGround;
            applyGravityAndPlatformCollision(enemy, platforms);
            if (wasAirborne && enemy.onGround && enemy.attackPattern === 'slam') {
                state.particles.push({
                    id: Math.random(), x: enemy.x + enemy.width/2, y: enemy.y + enemy.height, velocityX: 0, velocityY: 0,
                    life: 30, maxLife: 30, color: 'white', size: C.BOSS_SLAM_RADIUS * 2, type: 'shockwave'
                });
                if (player.onGround && Math.abs(player.x - enemy.x) < C.BOSS_SLAM_RADIUS) {
                    player.health -= C.BOSS_SLAM_DAMAGE;
                    player.invincibilityTimer = 60;
                }
            }


            if (enemy.attackCooldown <= 0) {
                enemy.attackCooldown = C.BOSS_ATTACK_CYCLE;
                const choice = Math.floor(Math.random() * 3);
                if (choice === 0) {
                    enemy.attackPattern = 'dash';
                    enemy.attackPhaseTimer = C.BOSS_DASH_TELL;
                } else if (choice === 1) {
                    enemy.attackPattern = 'shoot';
                    enemy.attackPhaseTimer = C.BOSS_SHOOT_TELL;
                } else {
                    enemy.attackPattern = 'slam';
                    enemy.attackPhaseTimer = C.BOSS_SLAM_TELL;
                }
            }

            if (enemy.attackPhaseTimer > 0) { // In "tell" phase
                enemy.attackPhaseTimer--;
                if (enemy.attackPhaseTimer <= 0) {
                    // Execute attack
                    if (enemy.attackPattern === 'dash') {
                        enemy.dashTimer = C.BOSS_DASH_DURATION;
                        enemy.direction = Math.sign(distanceX) as 1 | -1;
                    }
                    if (enemy.attackPattern === 'shoot') {
                        const baseAngle = Math.atan2(distanceY, distanceX);
                        for (let i = 0; i < C.BOSS_PROJECTILE_COUNT; i++) {
                            const angle = baseAngle + (i - 1) * C.BOSS_PROJECTILE_SPREAD;
                            state.projectiles.push({
                                id: Math.random(), x: enemy.x + enemy.width/2, y: enemy.y + enemy.height/2, width: 16, height: 16,
                                velocityX: Math.cos(angle) * C.SEEKER_PROJECTILE_SPEED * 1.5, velocityY: Math.sin(angle) * C.SEEKER_PROJECTILE_SPEED * 1.5,
                                type: 'darkEnergy', owner: 'enemy', damage: C.SEEKER_PROJECTILE_DAMAGE * 1.5,
                            });
                        }
                    }
                    if (enemy.attackPattern === 'slam' && enemy.onGround) {
                        enemy.velocityY = -C.BOSS_SLAM_JUMP_POWER;
                        enemy.onGround = false;
                    }
                }
            }

            if (enemy.dashTimer && enemy.dashTimer > 0) { // Is dashing
                enemy.dashTimer--;
                enemy.x += C.BOSS_DASH_SPEED * enemy.direction;
                if (enemy.dashTimer <= 0) enemy.attackPattern = 'idle';
            } else if (!enemy.attackPattern || enemy.attackPattern === 'idle') {
                // Default movement when not attacking
                enemy.direction = Math.sign(distanceX) as 1 | -1;
                enemy.x += enemy.speed * enemy.direction;
            }
        }
        
        // Universal ground physics for non-seekers
        if (enemy.type !== 'seeker') {
            applyGravityAndPlatformCollision(enemy, platforms);
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
    
    // Decrement timers
    if (player.attackCooldown > 0) player.attackCooldown--;
    if (player.specialAttackCooldown > 0) player.specialAttackCooldown--;
    if (player.invincibilityTimer > 0) player.invincibilityTimer--;
    if (player.werewolfTimer > 0) {
        player.werewolfTimer--;
        if (player.werewolfTimer === 0) player.isWerewolf = false;
    }
    if (player.dashCooldown > 0) player.dashCooldown--;

    // START DASH
    if (keys['h'] && !player.isDashing && player.dashCooldown === 0 && player.mana >= C.DASH_MANA_COST && !player.attacking && player.chargeTimer === 0) {
        player.isDashing = true;
        player.dashTimer = C.DASH_DURATION;
        player.dashCooldown = C.DASH_COOLDOWN;
        player.mana -= C.DASH_MANA_COST;
        player.invincibilityTimer = C.DASH_INVINCIBILITY_DURATION;
        player.velocityX = C.DASH_SPEED * player.facing;
        player.velocityY = 0; // Dash is purely horizontal
        audioManager.playSFX('playerDash');
        player.dashTrail = [];
    }

    // Handle Charge Attack (prevent if dashing)
    if (keys['l'] && player.onGround && !player.attacking && player.mana >= C.CHARGE_ATTACK_MANA_COST_MIN && !player.isDashing) {
        if (player.chargeTimer === 0) {
            audioManager.playSFX('chargeStart');
        }
        player.chargeTimer = Math.min(C.CHARGE_ATTACK_MAX_TIME, player.chargeTimer + 1);
    } else if (player.chargeTimer > 0) { // Released key or no longer meets conditions
        if (player.chargeTimer >= C.CHARGE_ATTACK_MIN_TIME) {
            const chargeRatio = (player.chargeTimer - C.CHARGE_ATTACK_MIN_TIME) / (C.CHARGE_ATTACK_MAX_TIME - C.CHARGE_ATTACK_MIN_TIME);
            const manaCost = Math.floor(C.CHARGE_ATTACK_MANA_COST_MIN + (C.CHARGE_ATTACK_MANA_COST_MAX - C.CHARGE_ATTACK_MANA_COST_MIN) * chargeRatio);

            if (player.mana >= manaCost) {
                player.mana -= manaCost;
                const damage = Math.floor(C.CHARGE_ATTACK_DAMAGE_MIN + (C.CHARGE_ATTACK_DAMAGE_MAX - C.CHARGE_ATTACK_DAMAGE_MIN) * chargeRatio);
                const radius = C.CHARGE_ATTACK_RADIUS_MIN + (C.CHARGE_ATTACK_RADIUS_MAX - C.CHARGE_ATTACK_RADIUS_MIN) * chargeRatio;
                
                audioManager.playSFX('chargeRelease');

                const playerCenterX = player.x + player.width / 2;
                const playerCenterY = player.y + player.height / 2;
                
                particles.push({
                    id: Math.random(), x: playerCenterX, y: playerCenterY, velocityX: 0, velocityY: 0,
                    life: 30, maxLife: 30, color: '#4dccbd', size: radius, type: 'shockwave'
                });

                enemies.forEach(enemy => {
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt(Math.pow(playerCenterX - enemyCenterX, 2) + Math.pow(playerCenterY - enemyCenterY, 2));

                    if (distance <= radius + (enemy.width / 2)) {
                        enemy.health -= damage;
                        enemy.hitTimer = 10;
                        audioManager.playSFX('enemyHit');
                        particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15));
                        if (enemy.health <= 0) {
                            const xp = enemy.type === 'enforcer' ? C.XP_PER_ENFORCER : enemy.type === 'seeker' ? C.XP_PER_SEEKER : C.XP_PER_BOSS;
                            state.player.experience += xp;
                            state.score += xp;
                            audioManager.playSFX('enemyDefeated');
                            particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20));
                        }
                    }
                });
            }
        }
        player.chargeTimer = 0; // Reset
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
    
    // Handle Attacks (prevent if dashing)
    if (keys['j'] && !player.attacking && player.attackCooldown === 0 && player.chargeTimer === 0 && !player.isDashing) {
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

    if (keys['k'] && player.specialAttackCooldown === 0 && player.mana >= C.DAGGER_THROW_COST && player.chargeTimer === 0 && !player.isDashing) {
        player.mana -= C.DAGGER_THROW_COST;
        player.specialAttackCooldown = C.DAGGER_THROW_COOLDOWN;
        audioManager.playSFX('daggerThrow');
        const damage = getDamage(C.DAGGER_DAMAGE, player.upgrades.daggerDamage, C.UPGRADE_VALUES.daggerDamage);
        
        state.projectiles.push({
            id: Math.random(),
            x: player.x + (player.facing === 1 ? player.width : 0),
            y: player.y + player.height / 2 - 3,
            width: 18,
            height: 6,
            velocityX: C.DAGGER_THROW_SPEED * player.facing,
            velocityY: 0,
            type: 'dagger',
            owner: 'player',
            damage: damage,
        });
        particles.push(...createHitParticles(player.x + player.width/2, player.y + player.height/2, 5, '#e0e0e0'));
    }

    // MOVEMENT & PHYSICS
    if (player.isDashing) {
        player.dashTimer--;
        
        player.dashTrail.unshift({ x: player.x, y: player.y, facing: player.facing });
        if (player.dashTrail.length > 5) player.dashTrail.pop();

        if (player.dashTimer <= 0) {
            player.isDashing = false;
            player.velocityX *= 0.5; // Keep some momentum
        }
        player.x += player.velocityX;
        // No gravity during dash
    } else {
        if (player.dashTrail.length > 0) player.dashTrail = [];
        
        if (player.chargeTimer > 0) {
            player.velocityX *= C.FRICTION;
        } else if (!player.attacking || player.isWerewolf) {
            if (keys['a'] || keys['arrowleft']) { player.velocityX = -player.speed; player.facing = -1; } 
            else if (keys['d'] || keys['arrowright']) { player.velocityX = player.speed; player.facing = 1; } 
            else { if(!player.attacking) player.velocityX *= C.FRICTION; }
        }
        
        // JUMP LOGIC
        const jumpPressed = keys[' '] || keys['w'] || keys['arrowup'];
        if (jumpPressed) {
            if (!player.jumpKeyHeld) { // It's a new press
                if (player.onGround) {
                    player.velocityY = -player.jumpPower;
                    player.onGround = false;
                    audioManager.playSFX('jump');
                } else if (player.canDoubleJump) {
                    player.velocityY = -C.PLAYER_DOUBLE_JUMP_POWER;
                    player.canDoubleJump = false;
                    audioManager.playSFX('doubleJump');
                    const particles: Particle[] = [];
                    for (let i = 0; i < 15; i++) {
                        particles.push({
                            id: Math.random(),
                            x: player.x + player.width / 2,
                            y: player.y + player.height,
                            velocityX: (Math.random() - 0.5) * 4,
                            velocityY: Math.random() * 3 + 1, // Downwards
                            life: 25,
                            maxLife: 25,
                            color: '#f0f0f0',
                            size: Math.random() * 2 + 1,
                        });
                    }
                    state.particles.push(...particles);
                }
            }
            player.jumpKeyHeld = true;
        } else {
            player.jumpKeyHeld = false;
        }
        
        player.x += player.velocityX;

        applyGravityAndPlatformCollision(player, platforms);
        if(player.onGround) {
            player.canDoubleJump = true;
        }
    }
    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > state.worldWidth) player.x = state.worldWidth - player.width;

    player.animation.frameTimer++;
    if ((player.animation.currentState === 'attack' && player.animation.frameTimer > 15) || (player.animation.currentState === 'clawAttack' && player.animation.frameTimer > 12)) {
        player.attacking = false;
    }

    if (player.isDashing) {
        player.animation.currentState = 'dash';
        player.animation.frameTimer = 0;
    } else if (!player.attacking) {
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
    const platforms = JSON.parse(JSON.stringify(levelData.platforms));
    platforms.forEach((p: any) => {
        if (p.type && p.type !== 'static') {
            p.startX = p.x;
            p.startY = p.y;
            p.direction = 1;
        }
    });

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
        chargeTimer: 0,
        isDashing: false,
        dashTimer: 0,
        dashCooldown: 0,
        dashTrail: [],
        canDoubleJump: true,
        jumpKeyHeld: false,
    };

    return {
        player: initialPlayer,
        platforms,
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