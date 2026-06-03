
import { GameState, PlayerState, Projectile, Particle, Enemy, Platform } from '../types';
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

const isGroundAhead = (enemy: Enemy, platforms: Platform[]): boolean => {
    // The point to check is at the enemy's leading foot, one step forward, and one step down.
    const nextX = enemy.x + (enemy.speed * enemy.direction);
    const probeX = enemy.direction === 1 ? nextX + enemy.width : nextX;
    const probeY = enemy.y + enemy.height + 1; // Check 1px below feet level

    for (const p of platforms) {
        if (
            probeX >= p.x &&
            probeX <= p.x + p.width &&
            probeY >= p.y &&
            probeY <= p.y + p.height
        ) {
            return true; // Found ground ahead
        }
    }

    return false; // No ground ahead
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
    
    // Check if the particle is organic blood (any variant of red/crimson)
    const isBlood = color === '#ff4d4d' || color === '#ff0000' || color === '#991b1b' || color === '#ef4444' || color === '#ff3333';
    
    // Scale count reasonably for a balanced feel: lower multiplier so it doesn't swarm the screen
    const activeCount = isBlood ? Math.floor(count * 0.7) : count;
    
    for (let i = 0; i < activeCount; i++) {
        if (isBlood) {
            // Gothic palette of deep venous blood, arterial crimson, and dark coagulated clots
            const bloodColors = ['#9b1c1c', '#7f1d1d', '#b91c1c', '#580505', '#450606'];
            const chosenColor = bloodColors[Math.floor(Math.random() * bloodColors.length)];
            
            // Fling blood droplets radially with balanced velocity dispersion
            const speedFactor = 1.0 + Math.random() * 2.0;
            const angle = Math.random() * Math.PI * 2;
            
            particles.push({
                id: Math.random(),
                x: x + (Math.random() - 0.5) * 4,
                y: y + (Math.random() - 0.5) * 4,
                velocityX: Math.cos(angle) * speedFactor * 1.5,
                velocityY: Math.sin(angle) * speedFactor * 1.5 - 0.8, // eject slightly upwards
                life: 25 + Math.floor(Math.random() * 25), // cleaner duration, disappears faster
                maxLife: 50,
                color: chosenColor,
                size: 0.8 + Math.random() * 1.4, // much smaller, elegant droplet sizes
                type: 'blood'
            });
        } else {
            // Non-blood sparks
            particles.push({
                id: Math.random(),
                x,
                y,
                velocityX: (Math.random() - 0.5) * 6,
                velocityY: (Math.random() - 0.5) * 6,
                life: 25,
                maxLife: 25,
                color,
                size: Math.random() * 3 + 1,
            });
        }
    }
    
    // Inject subtle translucent blood mist clouds upon major splatters
    if (isBlood && count >= 15) {
        const mistCount = Math.min(2, Math.floor(count / 10));
        for (let i = 0; i < mistCount; i++) {
            particles.push({
                id: Math.random(),
                x: x + (Math.random() - 0.5) * 8,
                y: y + (Math.random() - 0.5) * 8,
                velocityX: (Math.random() - 0.5) * 0.8,
                velocityY: -0.3 - Math.random() * 0.6,
                life: 20 + Math.random() * 15,
                maxLife: 35,
                color: 'rgba(127, 29, 29, 0.15)', // Extremely faint and subtle
                size: 3 + Math.random() * 3, // Much smaller mist sizes
                type: 'dust'
            });
        }
    }
    
    return particles;
};

const createSplinterParticles = (x: number, y: number, count: number, isUrn = false): Particle[] => {
    const list: Particle[] = [];
    const colors = isUrn ? ['#b45309', '#78350f', '#ca8a04', '#451a03'] : ['#8d5b4c', '#5d382e', '#b78274', '#3e2723'];
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.8;
        list.push({
            id: Math.random(),
            x: x + (Math.random() - 0.5) * 8,
            y: y + (Math.random() - 0.5) * 8,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed - 1.2, // Fling upwards slightly with gravity
            life: 45 + Math.floor(Math.random() * 45), // Durable splinters
            maxLife: 90,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 1.8 + Math.random() * 2.5,
            type: 'splinter'
        });
    }
    return list;
};

const spawnBreakableLoot = (state: GameState, enemy: Enemy) => {
    const chance = Math.random();
    const id = Math.random();
    const x = enemy.x + (enemy.width - 24) / 2;
    // Align drop neatly to the floor platform
    const y = enemy.y + enemy.height - 24;
    
    // Total drop chance reduced from 80% to 50%
    if (chance < 0.50) {
        return; // Empty
    } else if (chance < 0.70) { // Coin (prob 20%)
        state.powerUps.push({ id, x, y, width: 24, height: 24, type: 'coin' });
    } else if (chance < 0.85) { // Lunar Fragment (prob 15%)
        state.powerUps.push({ id, x, y, width: 24, height: 24, type: 'lunarFragment' });
    } else if (chance < 0.95) { // Health Vial (prob 10%)
        state.powerUps.push({ id, x, y, width: 24, height: 24, type: 'healthVial' });
    } else { // Isolde Aid (prob 5%)
        state.powerUps.push({ id, x, y, width: 24, height: 24, type: 'isoldeAid' });
    }
};

const spawnBossHitSparks = (state: GameState, enemy: Enemy, attackColor: string) => {
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    
    // 1. Spitting high-speed weapon sparks
    for (let i = 0; i < 12; i++) {
        const speed = 4 + Math.random() * 6;
        const angle = Math.random() * Math.PI * 2;
        state.particles.push({
            id: Math.random(),
            x: enemyCenterX,
            y: enemyCenterY,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            life: 25 + Math.floor(Math.random() * 15),
            maxLife: 40,
            color: Math.random() > 0.5 ? '#f6e05e' : attackColor, // blend gold trim or weapon color
            size: 2 + Math.random() * 2,
            type: 'spark'
        });
    }

    // 2. Heavy monstrous/crimson dust & blood debris falling down (Boss black blood)
    for (let i = 0; i < 24; i++) {
        state.particles.push({
            id: Math.random(),
            x: enemyCenterX + (Math.random() - 0.5) * 20,
            y: enemyCenterY + (Math.random() - 0.5) * 20,
            velocityX: (Math.random() - 0.5) * 7,
            velocityY: -(3 + Math.random() * 6), // fling high and let gravity take them
            life: 80 + Math.floor(Math.random() * 60),
            maxLife: 150,
            color: Math.random() > 0.4 ? '#310000' : '#110000', // corrupt rotten black blood
            size: 2.5 + Math.random() * 4.5,
            type: 'blood'
        });
    }
};

const spawnBossEnvironmentDebris = (state: GameState, enemy: Enemy, count = 15) => {
    const bottomX = enemy.x + enemy.width / 2;
    const bottomY = enemy.y + enemy.height;
    
    // Spawn heavy dust and stone debris from ground impact
    for (let i = 0; i < count; i++) {
        const color = Math.random() > 0.5 ? '#64748b' : '#374151'; // stone/ground colors
        const velX = (Math.random() - 0.5) * 8;
        const velY = -(2 + Math.random() * 6);
        state.particles.push({
            id: Math.random(),
            x: bottomX + (Math.random() - 0.5) * enemy.width,
            y: bottomY - 3,
            velocityX: velX,
            velocityY: velY,
            life: 25 + Math.floor(Math.random() * 20),
            maxLife: 45,
            color,
            size: 3 + Math.random() * 5,
            type: 'dust'
        });
    }
};

const triggerBossWallSlam = (state: GameState, enemy: Enemy, side: 'left' | 'right') => {
    enemy.dashTimer = 0;
    enemy.attackPattern = 'idle';
    // stun the boss slightly for a tactical advantage!
    enemy.attackCooldown = 100; // extra resting cooldown
    enemy.hitTimer = 25; // flicker white like damage
    
    // Shake screen intensely
    state.screenShake = { magnitude: 7, duration: 20 };
    audioManager.playSFX('enemyHit');
    
    const xPos = side === 'left' ? 0 : state.worldWidth;
    const yPos = enemy.y + enemy.height / 2;
    const dirFactor = side === 'left' ? 1 : -1;
    
    // Spawn high velocity sparks and stone rubble blasting out from the wall
    for (let i = 0; i < 15; i++) {
        const speed = 4 + Math.random() * 8;
        const spreadAngle = (Math.random() - 0.5) * (Math.PI / 2); // 90 degree spread cone
        const angle = (side === 'left' ? 0 : Math.PI) + spreadAngle;
        
        state.particles.push({
            id: Math.random(),
            x: xPos,
            y: yPos + (Math.random() - 0.5) * enemy.height,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            life: 20 + Math.floor(Math.random() * 15),
            maxLife: 35,
            color: '#f6e05e', // glowing yellow sparks as stone shears
            size: 2 + Math.random() * 2,
            type: 'spark'
        });
    }
    
    for (let i = 0; i < 12; i++) {
        const velX = dirFactor * (1 + Math.random() * 5);
        const velY = -2 - Math.random() * 4;
        state.particles.push({
            id: Math.random(),
            x: xPos,
            y: yPos + (Math.random() - 0.5) * enemy.height,
            velocityX: velX,
            velocityY: velY,
            life: 35 + Math.floor(Math.random() * 15),
            maxLife: 50,
            color: '#64748b', // stone grey debris
            size: 4 + Math.random() * 6,
            type: 'dust'
        });
    }
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
                    if (enemy.type === 'boss') {
                        state.hitStopTimer = 6; // Hit stop frame delay for boss projectile pierce
                        state.screenShake = { magnitude: 5, duration: 15 };
                        spawnBossHitSparks(state, enemy, projectile.type === 'dagger' ? '#e0e0e0' : '#4dccbd');
                    } else if (enemy.type === 'crate' || enemy.type === 'urn') {
                        audioManager.playSFX('enemyHit');
                        state.particles.push(...createSplinterParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 7, enemy.type === 'urn'));
                    } else {
                        state.particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, '#e0e0e0'));
                        if (projectile.type === 'dagger') {
                            // Let thrown spectral daggers slice and draw crimson blood!
                            state.particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 14, '#ff4d4d'));
                        }
                    }
                    
                    state.particles.push({
                        id: Math.random(),
                        x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 15,
                        y: enemy.y,
                        velocityX: (Math.random() - 0.5) * 1.5,
                        velocityY: -3,
                        life: 40,
                        maxLife: 40,
                        color: '#e0e0e0',
                        size: 11,
                        type: 'damageText',
                        text: `-${projectile.damage}`
                    });

                    if (enemy.health <= 0) {
                        if (enemy.type === 'crate' || enemy.type === 'urn') {
                            audioManager.playSFX('enemyDefeated');
                            state.particles.push(...createSplinterParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 22, enemy.type === 'urn'));
                            spawnBreakableLoot(state, enemy);
                        } else {
                            const xp = enemy.type === 'enforcer' ? C.XP_PER_ENFORCER : enemy.type === 'seeker' ? C.XP_PER_SEEKER : C.XP_PER_BOSS;
                            state.player.experience += xp;
                            state.score += xp;
                            audioManager.playSFX('enemyDefeated');
                            state.particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 36, '#ff4d4d'));
                        }
                    }
    
                    state.projectiles.splice(i, 1);
                    break; // Projectile is gone, stop checking enemies
                }
            }
        } else if (projectile.owner === 'enemy') {
            if (checkCollision(projectile, state.player)) {
                 if (state.player.isParrying) {
                    // Successful projectile parry
                    projectile.owner = 'player';
                    projectile.velocityX *= -1.5; // Reflect and speed up
                    projectile.velocityY *= -1.5;
                    projectile.damage *= 2; // More damage
                    audioManager.playSFX('parrySuccess');
                    state.player.isParrying = false;
                    state.player.parryTimer = 0;
                    state.hitStopTimer = 10; // Visual impact freeze
                    state.screenShake = { magnitude: 5, duration: 10 }; // Fast parry jolt
                    
                    state.particles.push({
                        id: Math.random(),
                        x: state.player.x + state.player.width / 2,
                        y: state.player.y - 15,
                        velocityX: 0,
                        velocityY: -3,
                        life: 45,
                        maxLife: 45,
                        color: '#f6e05e',
                        size: 14,
                        type: 'damageText',
                        text: 'REFLECTED!'
                    });
                    // Don't splice the projectile
                } else if (state.player.invincibilityTimer === 0) {
                    state.player.health -= projectile.damage;
                    state.player.invincibilityTimer = 60; // 1 second invincibility
                    audioManager.playSFX('playerHurt');
                    state.particles.push(...createHitParticles(state.player.x + state.player.width / 2, state.player.y + state.player.height / 2, 15));
                    
                    state.particles.push({
                        id: Math.random(),
                        x: state.player.x + state.player.width / 2 + (Math.random() - 0.5) * 10,
                        y: state.player.y - 10,
                        velocityX: (Math.random() - 0.5) * 2,
                        velocityY: -3,
                        life: 45,
                        maxLife: 45,
                        color: '#f87171',
                        size: 12,
                        type: 'damageText',
                        text: `-${projectile.damage}`
                    });

                    state.projectiles.splice(i, 1);
                    if (projectile.isBoss) {
                        state.screenShake = { magnitude: 6, duration: 25 };
                    } else {
                        state.screenShake = { magnitude: 2, duration: 15 };
                    }
                }
            }
        }
    }
};

export const updateParticles = (state: GameState) => {
    const platforms = state.platforms;
    for (let i = state.particles.length - 1; i >= 0; i--) {
        const p = state.particles[i];
        p.life--;
        if (p.life <= 0) {
            state.particles.splice(i, 1);
            continue;
        }

        // Real-time platform splash-down logic for droplets
        if (p.type === 'blood') {
            let hitPlatform = false;
            for (let j = 0; j < platforms.length; j++) {
                const plat = platforms[j];
                if (p.x >= plat.x && p.x <= plat.x + plat.width &&
                    p.y >= plat.y && p.y <= plat.y + 12 &&
                    p.velocityY >= 0) {
                    
                    p.y = plat.y - p.size / 3; // Snap neatly to platform top
                    p.velocityY = 0;
                    p.velocityX = 0;
                    p.size = Math.min(p.size * 1.15, 3.2); // Tiny, refined splats on platform top
                    hitPlatform = true;
                    break;
                }
            }

            // Prolong pooled blood life to stain the level subtly
            if (hitPlatform && Math.random() < 0.15) {
                p.life = Math.max(p.life, 20);
            }
        }

        // Bouncing, gravity-bound splinters
        if (p.type === 'splinter') {
            p.velocityY += 0.22; // Gravity pull
            p.velocityX *= 0.98; // Air resistance drag
            
            for (let j = 0; j < platforms.length; j++) {
                const plat = platforms[j];
                if (p.x >= plat.x && p.x <= plat.x + plat.width &&
                    p.y >= plat.y && p.y <= plat.y + 10 &&
                    p.velocityY >= 0) {
                    
                    p.y = plat.y - p.size / 2; // Stabilize above the platform
                    if (p.velocityY > 1.2) {
                        p.velocityY = -p.velocityY * 0.45; // Bounce off wooden surface
                        p.velocityX *= 0.6; // Tangential friction slows it down on bounces
                    } else {
                        p.velocityY = 0;
                        p.velocityX = 0;
                    }
                    break;
                }
            }
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
        if (enemy.staggerTimer === undefined) enemy.staggerTimer = 0;
        
        // Stagger logic
        if (enemy.staggerTimer > 0) {
            enemy.staggerTimer--;
             if (enemy.type !== 'seeker' && enemy.type !== 'specter') {
                applyGravityAndPlatformCollision(enemy, platforms);
            }
            if (enemy.hitTimer > 0) enemy.hitTimer--;
            return; // Skip AI logic if staggered
        }

        // --- BREAKABLE CONTAINER LOGIC ---
        if (enemy.type === 'crate' || enemy.type === 'urn') {
            applyGravityAndPlatformCollision(enemy, platforms);
            if (enemy.hitTimer > 0) enemy.hitTimer--;
            return; // Skip hostile AI movement entirely
        }

        // --- AI LOGIC ---
        if (enemy.type === 'enforcer') {
            if (enemy.attackCooldown === undefined) enemy.attackCooldown = 0;
            if (enemy.attackPhaseTimer === undefined) enemy.attackPhaseTimer = 0;
            if (enemy.aggroCooldown === undefined) enemy.aggroCooldown = 0;

            if (enemy.attackCooldown > 0) enemy.attackCooldown--;
            if (enemy.aggroCooldown > 0) enemy.aggroCooldown--;

            const canReachPlayerVertically = Math.abs(distanceY) < enemy.height * 1.5;

            // --- AGGRO MANAGEMENT ---
            if (!enemy.isAggro && distance < C.ENFORCER_AGGRO_RANGE && canReachPlayerVertically && enemy.aggroCooldown <= 0) {
                enemy.isAggro = true;
            }
            if (enemy.isAggro && (distance > C.ENFORCER_AGGRO_RANGE * 1.5 || !canReachPlayerVertically)) {
                enemy.isAggro = false;
            }

            // --- STATE-BASED ACTION LOGIC ---
            let isCurrentlyAttacking = enemy.attackPattern === 'tell' || enemy.attackPattern === 'meleeSlash';

            // 1. Decide on action: Attack or Move
            if (!isCurrentlyAttacking && enemy.isAggro && distance < 60 && canReachPlayerVertically && enemy.attackCooldown <= 0) {
                // Start a new attack
                enemy.attackPattern = 'tell';
                enemy.attackPhaseTimer = 20;
                enemy.attackCooldown = 90;
                isCurrentlyAttacking = true;
            }

            // 2. Execute action
            if (isCurrentlyAttacking) {
                // ATTACKING
                if (enemy.attackPattern === 'tell') {
                    enemy.attackPhaseTimer!--;
                    if (enemy.attackPhaseTimer! <= 0) {
                        enemy.attackPattern = 'meleeSlash';
                        enemy.attackPhaseTimer = 15;
                        audioManager.playSFX('daggerAttack');
                        const hitbox = {
                            x: enemy.direction === 1 ? enemy.x + enemy.width : enemy.x - 40,
                            y: enemy.y, width: 40, height: enemy.height
                        };
                        if (checkCollision(player, hitbox) && player.invincibilityTimer === 0) {
                            player.health -= 15;
                            player.invincibilityTimer = 60;
                            state.screenShake = { magnitude: 2, duration: 15 };
                            state.particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 18, '#ff4d4d'));
                        }
                    }
                } else if (enemy.attackPattern === 'meleeSlash') {
                    enemy.attackPhaseTimer!--;
                    if (enemy.attackPhaseTimer! <= 0) {
                        enemy.attackPattern = 'idle';
                    }
                }
            } else {
                // MOVING
                if (enemy.isAggro) {
                    enemy.direction = Math.sign(distanceX) as 1 | -1;
                    if (isGroundAhead(enemy, platforms)) {
                        if (Math.abs(distanceX) > 50) { // Don't run into them
                            enemy.x += enemy.speed * enemy.direction;
                        }
                    } else {
                        // Hit a ledge while pursuing, give up and go back to patrolling.
                        enemy.isAggro = false;
                        enemy.aggroCooldown = 60; // 1s cooldown to prevent re-aggro stutter.
                        enemy.direction *= -1; // Turn around.
                    }
                } else {
                    // Patrol logic
                    const atPatrolEnd = enemy.patrolRange !== undefined &&
                        ((enemy.direction === 1 && enemy.x >= enemy.startX + enemy.patrolRange) ||
                         (enemy.direction === -1 && enemy.x <= enemy.startX));

                    if (!isGroundAhead(enemy, platforms) || atPatrolEnd) {
                        enemy.direction *= -1;
                    } else {
                        enemy.x += enemy.speed * enemy.direction;
                    }
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
                // FIX: Added a check for enemy.patrolRange to prevent runtime errors. The property is optional on the Enemy type.
                 if (enemy.patrolRange !== undefined && (enemy.x < enemy.startX || enemy.x > enemy.startX + enemy.patrolRange)) {
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

        if (enemy.type === 'specter') {
            if (enemy.teleportTimer === undefined) enemy.teleportTimer = 180; // Time until first teleport
            if (enemy.teleportState === undefined) enemy.teleportState = 'idle';

            enemy.teleportTimer!--;

            if (enemy.teleportTimer! <= 0 && enemy.teleportState === 'idle') {
                enemy.teleportState = 'fadingOut';
                enemy.attackPhaseTimer = 30; // Fade out duration
                // Find a valid teleport spot on the player's platform
                const playerPlatform = platforms.find(p => player.onGround && player.y + player.height === p.y - 0);
                if (playerPlatform) {
                    enemy.targetX = player.x + (Math.random() > 0.5 ? -1 : 1) * (100 + Math.random() * 50);
                    enemy.targetX = Math.max(playerPlatform.x, Math.min(enemy.targetX, playerPlatform.x + playerPlatform.width - enemy.width));
                    enemy.targetY = playerPlatform.y - enemy.height;
                } else { // Player is in air, teleport near them
                    enemy.targetX = player.x + (Math.random() > 0.5 ? -1 : 1) * 100;
                    enemy.targetY = player.y;
                }
            }

            // FIX: Refactored the state machine for the specter enemy to resolve an unreachable code error.
            // The previous logic had a flawed if/else-if chain that made it impossible to check for the post-attack 'fadingOut' state.
            // This new structure correctly handles both pre-attack (teleport) and post-attack fading.
            if (enemy.teleportState === 'fadingOut') {
                enemy.attackPhaseTimer!--;
                if (enemy.attackPhaseTimer! <= 0) {
                    if (enemy.teleportTimer! > 0) { // Post-attack fade out
                        enemy.teleportState = 'idle';
                    } else { // Pre-attack fade out (teleporting)
                        enemy.x = enemy.targetX!;
                        enemy.y = enemy.targetY!;
                        enemy.teleportState = 'fadingIn';
                        enemy.attackPhaseTimer = 30; // Fade in duration
                    }
                }
            } else if (enemy.teleportState === 'fadingIn') {
                enemy.attackPhaseTimer!--;
                if (enemy.attackPhaseTimer! <= 0) {
                    enemy.teleportState = 'attacking';
                    enemy.attackPhaseTimer = 40; // Attack tell + action
                    enemy.direction = Math.sign(player.x - enemy.x) as 1 | -1;
                }
            } else if (enemy.teleportState === 'attacking') {
                enemy.attackPhaseTimer!--;
                if (enemy.attackPhaseTimer === 20) { // Attack happens mid-animation
                    const hitbox = { x: enemy.direction === 1 ? enemy.x : enemy.x - 30, y: enemy.y - 10, width: enemy.width + 30, height: enemy.height + 10};
                    if (checkCollision(player, hitbox) && player.invincibilityTimer === 0) {
                        player.health -= 12;
                        player.invincibilityTimer = 60;
                        state.particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 16, '#ff4d4d'));
                    }
                    audioManager.playSFX('clawAttack');
                }
                if (enemy.attackPhaseTimer! <= 0) {
                     enemy.teleportState = 'fadingOut';
                     enemy.attackPhaseTimer = 60; // Fade out after attack
                     enemy.teleportTimer = 240; // Reset main timer for next cycle
                }
            }
        }

        if (enemy.type === 'gargoyle') {
            if (enemy.attackCooldown === undefined) enemy.attackCooldown = 0;
            if (enemy.attackCooldown > 0) enemy.attackCooldown--;

            if (!enemy.isAggro && distance < 400) {
                enemy.isAggro = true; // Wake up
                enemy.attackPattern = 'tell';
                enemy.attackPhaseTimer = 30; // Awaken timer
            }
            
            if (enemy.isAggro) {
                if (enemy.attackPattern === 'tell') {
                    enemy.attackPhaseTimer!--;
                    if (enemy.attackPhaseTimer! <= 0) enemy.attackPattern = 'idle';
                }
                
                if (distance < 500 && enemy.attackCooldown <= 0 && enemy.attackPattern === 'idle') {
                    enemy.attackPattern = 'spit';
                    enemy.attackPhaseTimer = 45; // Tell before firing
                    enemy.attackCooldown = 150;
                }

                if (enemy.attackPattern === 'spit') {
                    enemy.attackPhaseTimer!--;
                    if (enemy.attackPhaseTimer! <= 0) {
                        enemy.attackPattern = 'idle';
                        const angle = Math.atan2(distanceY, distanceX);
                        state.projectiles.push({
                            id: Math.random(), x: enemy.x + enemy.width / 2, y: enemy.y + enemy.height / 2, width: 14, height: 14,
                            velocityX: Math.cos(angle) * C.SEEKER_PROJECTILE_SPEED * 1.8, velocityY: Math.sin(angle) * C.SEEKER_PROJECTILE_SPEED * 1.8,
                            type: 'darkEnergy', owner: 'enemy', damage: 15,
                        });
                        audioManager.playSFX('enemyShoot');
                    }
                }
                 if (distance > 550) { // De-aggro
                    enemy.isAggro = false;
                 }
            }
        }
        
        if(enemy.type === 'boss') {
            if (enemy.attackCooldown === undefined) enemy.attackCooldown = 120; // Initial delay
            if (enemy.attackPhaseTimer === undefined) enemy.attackPhaseTimer = 0;
            if (enemy.attackCooldown > 0) enemy.attackCooldown--;

            // Handle landing from slam attack
            const wasAirborne = !enemy.onGround;
            applyGravityAndPlatformCollision(enemy, platforms);
            if (wasAirborne && enemy.onGround) {
                if (enemy.attackPattern === 'slam') {
                    state.screenShake = { magnitude: 6, duration: 30 };
                    state.particles.push({
                        id: Math.random(), x: enemy.x + enemy.width/2, y: enemy.y + enemy.height, velocityX: 0, velocityY: 0,
                        life: 30, maxLife: 30, color: 'white', size: C.BOSS_SLAM_RADIUS * 2, type: 'shockwave'
                    });
                    spawnBossEnvironmentDebris(state, enemy, 25);
                    if (player.onGround && Math.abs(player.x - enemy.x) < C.BOSS_SLAM_RADIUS && player.invincibilityTimer === 0) {
                        player.health -= C.BOSS_SLAM_DAMAGE;
                        player.invincibilityTimer = 60;
                        state.screenShake = { magnitude: 8, duration: 30 };
                        state.particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 24, '#ff4d4d'));
                    }
                } else {
                    spawnBossEnvironmentDebris(state, enemy, 10);
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
                                isBoss: true,
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
                
                // Wall containment and hit environmental mechanics
                if (enemy.x <= 0) {
                    enemy.x = 0;
                    triggerBossWallSlam(state, enemy, 'left');
                } else if (enemy.x + enemy.width >= state.worldWidth) {
                    enemy.x = state.worldWidth - enemy.width;
                    triggerBossWallSlam(state, enemy, 'right');
                }
                
                if (enemy.dashTimer <= 0) enemy.attackPattern = 'idle';
            } else if (!enemy.attackPattern || enemy.attackPattern === 'idle') {
                // Default movement when not attacking
                enemy.direction = Math.sign(distanceX) as 1 | -1;
                enemy.x += enemy.speed * enemy.direction;
                
                // Keep regular walking clean inside borders
                if (enemy.x < 0) enemy.x = 0;
                if (enemy.x + enemy.width > state.worldWidth) enemy.x = state.worldWidth - enemy.width;
            }
        }
        
        // Universal ground physics for non-floaters
        if (enemy.type === 'enforcer' || enemy.type === 'boss' || enemy.type === 'gargoyle') {
            applyGravityAndPlatformCollision(enemy, platforms);
        }

        if (enemy.hitTimer > 0) enemy.hitTimer--;

        if (checkCollision(player, enemy) && enemy.type !== 'specter' && enemy.type !== 'crate' && enemy.type !== 'urn') { // Specters damage with attacks, not contact
            if (player.isParrying) {
                // Successful melee parry
                enemy.staggerTimer = C.ENEMY_STAGGER_DURATION;
                player.mana = Math.min(player.maxMana, player.mana + C.PARRY_MANA_REGAIN);
                audioManager.playSFX('parrySuccess');
                player.isParrying = false;
                player.parryTimer = 0;
                state.hitStopTimer = 12; // Visual impact freeze
                state.screenShake = { magnitude: 7, duration: 15 }; // Intense parry rumble
                
                state.particles.push({
                    id: Math.random(),
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y - 15,
                    velocityX: 0,
                    velocityY: -3,
                    life: 60,
                    maxLife: 60,
                    color: '#f6e05e',
                    size: 14,
                    type: 'damageText',
                    text: 'PARRIED!'
                });
                state.particles.push({
                    id: Math.random(),
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + 15,
                    velocityX: (Math.random() - 0.5) * 2,
                    velocityY: -2,
                    life: 50,
                    maxLife: 50,
                    color: '#f6e05e',
                    size: 11,
                    type: 'damageText',
                    text: 'STAGGERED'
                });
                // Don't take damage or knockback
            } else if (player.invincibilityTimer === 0) {
                const dmg = enemy.type === 'boss' ? 25 : 10;
                player.health -= dmg;
                player.invincibilityTimer = 60;
                audioManager.playSFX('playerHurt');
                player.velocityY = -5;
                player.velocityX = 8 * (player.x < enemy.x ? -1 : 1);
                state.hitStopTimer = enemy.type === 'boss' ? 12 : 8; // Freeze frame when hit to convey damage weight
                if (enemy.type === 'boss') {
                    state.screenShake = { magnitude: 8, duration: 25 };
                } else {
                    state.screenShake = { magnitude: 4, duration: 20 };
                }

                // Visceral blood spray on direct body damage!
                state.particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 18, '#ff4d4d'));

                state.particles.push({
                    id: Math.random(),
                    x: player.x + player.width / 2,
                    y: player.y - 15,
                    velocityX: (Math.random() - 0.5) * 1.5,
                    velocityY: -3,
                    life: 50,
                    maxLife: 50,
                    color: '#f87171',
                    size: 13,
                    type: 'damageText',
                    text: `-${dmg}`
                });
            }
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
    const { player, platforms, enemies, particles, powerUps, hazards } = state;
    
    // Decrement timers
    if (player.attackCooldown > 0) player.attackCooldown--;
    if (player.specialAttackCooldown > 0) player.specialAttackCooldown--;
    if (player.invincibilityTimer > 0) player.invincibilityTimer--;
    if (player.werewolfTimer > 0) {
        player.werewolfTimer--;
        if (player.werewolfTimer === 0) player.isWerewolf = false;
    }
    if (player.dashCooldown > 0) player.dashCooldown--;
    if (player.parryCooldown > 0) player.parryCooldown--;
    if (player.parryTimer > 0) {
        player.parryTimer--;
        if (player.parryTimer === 0) {
            player.isParrying = false;
        }
    }

    // START PARRY
    if (keys['h'] && !player.isParrying && player.parryCooldown === 0 && player.mana >= C.PARRY_MANA_COST && player.onGround && !player.attacking && !player.isDashing) {
        player.isParrying = true;
        player.parryTimer = C.PARRY_DURATION;
        player.parryCooldown = C.PARRY_COOLDOWN;
        player.mana -= C.PARRY_MANA_COST;
        audioManager.playSFX('parryAttempt');
        player.velocityX = 0; // Stop moving
        player.animation.currentState = 'parry';
        player.animation.frameIndex = 0;
        player.animation.frameTimer = 0;
    }

    // Halt actions if parrying
    if (player.isParrying) {
        applyGravityAndPlatformCollision(player, platforms);
        return; // Exit early to prevent other actions
    }

    // START DASH
    if (keys['s'] && !player.isDashing && player.dashCooldown === 0 && player.mana >= C.DASH_MANA_COST && !player.attacking && player.chargeTimer === 0) {
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

        // Spawn beautiful inward-gravitating spark particles that fly towards the center of the character
        if (Math.random() < 0.5) {
            const playerCenterX = player.x + player.width / 2;
            const playerCenterY = player.y + player.height / 2;
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 40;
            const startX = playerCenterX + Math.cos(angle) * distance;
            const startY = playerCenterY + Math.sin(angle) * distance;
            
            // Speed vector pointing directly toward player's center
            const speed = 2.5 + Math.random() * 2;
            const velocityX = -Math.cos(angle) * speed;
            const velocityY = -Math.sin(angle) * speed;
            
            particles.push({
                id: Math.random(),
                x: startX,
                y: startY,
                velocityX: velocityX,
                velocityY: velocityY,
                life: 20,
                maxLife: 20,
                color: player.isWerewolf ? '#c084fc' : '#22d3ee', // Purple for werewolf, Cyan for standard form
                size: 2 + Math.random() * 3,
                type: 'spark'
            });
        }
    } else if (player.chargeTimer > 0) { // Released key or no longer meets conditions
        if (player.chargeTimer >= C.CHARGE_ATTACK_MIN_TIME) {
            const chargeRatio = (player.chargeTimer - C.CHARGE_ATTACK_MIN_TIME) / (C.CHARGE_ATTACK_MAX_TIME - C.CHARGE_ATTACK_MIN_TIME);
            const manaCost = Math.floor(C.CHARGE_ATTACK_MANA_COST_MIN + (C.CHARGE_ATTACK_MANA_COST_MAX - C.CHARGE_ATTACK_MANA_COST_MIN) * chargeRatio);

            if (player.mana >= manaCost) {
                player.mana -= manaCost;
                const damage = Math.floor(C.CHARGE_ATTACK_DAMAGE_MIN + (C.CHARGE_ATTACK_DAMAGE_MAX - C.CHARGE_ATTACK_DAMAGE_MIN) * chargeRatio);
                const radius = C.CHARGE_ATTACK_RADIUS_MIN + (C.CHARGE_ATTACK_RADIUS_MAX - C.CHARGE_ATTACK_RADIUS_MIN) * chargeRatio;
                
                audioManager.playSFX('chargeRelease');
                state.screenShake = { magnitude: 4, duration: 20 };

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
                        if (enemy.type === 'boss') {
                            state.screenShake = { magnitude: 8, duration: 25 };
                            spawnBossHitSparks(state, enemy, '#4dccbd');
                        } else if (enemy.type === 'crate' || enemy.type === 'urn') {
                            audioManager.playSFX('enemyHit');
                            particles.push(...createSplinterParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, enemy.type === 'urn'));
                        } else {
                            particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 15));
                        }
                        
                        particles.push({
                            id: Math.random(),
                            x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 20,
                            y: enemy.y - 15,
                            velocityX: (Math.random() - 0.5) * 2,
                            velocityY: -4,
                            life: 50,
                            maxLife: 50,
                            color: '#4cccbd',
                            size: 16,
                            type: 'damageText',
                            text: `-${damage} CRIT!`
                        });

                        if (enemy.health <= 0) {
                            if (enemy.type === 'crate' || enemy.type === 'urn') {
                                audioManager.playSFX('enemyDefeated');
                                particles.push(...createSplinterParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 22, enemy.type === 'urn'));
                                spawnBreakableLoot(state, enemy);
                            } else {
                                const xp = enemy.type === 'enforcer' ? C.XP_PER_ENFORCER : enemy.type === 'seeker' ? C.XP_PER_SEEKER : C.XP_PER_BOSS;
                                state.player.experience += xp;
                                state.score += xp;
                                audioManager.playSFX('enemyDefeated');
                                particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 20));
                            }
                        }
                    }
                });
            }
        }
        player.chargeTimer = 0; // Reset
    }

    // HAZARD COLLISION
    hazards.forEach(hazard => {
        if (checkCollision(player, hazard) && player.invincibilityTimer === 0) {
            player.health -= 15; // Spike damage
            player.invincibilityTimer = 60;
            player.velocityY = -8; // Knockback
            player.onGround = false;
            audioManager.playSFX('playerHurt');
            state.screenShake = { magnitude: 2, duration: 15 };
            
            // Severe puncture wound blood splatter!
            particles.push(...createHitParticles(player.x + player.width / 2, player.y + player.height / 2, 24, '#ff4d4d'));

            particles.push({
                id: Math.random(),
                x: player.x + player.width / 2,
                y: player.y - 15,
                velocityX: (Math.random() - 0.5) * 1.5,
                velocityY: -3,
                life: 50,
                maxLife: 50,
                color: '#f87171',
                size: 13,
                type: 'damageText',
                text: '-15'
            });
        }
    });

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
            if (powerUp.type === 'coin') {
                state.score += 100;
                audioManager.playSFX('powerUp');
                powerUps.splice(index, 1);
            }
        }
    });
    
    // Handle Attacks (prevent if dashing)
    if (keys['j'] && !player.attacking && player.attackCooldown === 0 && player.chargeTimer === 0 && !player.isDashing) {
        player.attacking = true;
        player.animation.frameTimer = 0;
        player.animation.frameIndex = 0;
        
        const processAttack = (damage: number, hitbox: { x: number, y: number, width: number, height: number }) => {
             enemies.forEach(enemy => {
                if (checkCollision(hitbox, enemy)) {
                    enemy.health -= damage;
                    enemy.hitTimer = 10;
                    state.hitStopTimer = enemy.type === 'boss' ? 8 : 4; // Add punchy visual freeze
                    if (enemy.type === 'boss') {
                        state.screenShake = { magnitude: 5, duration: 15 };
                        spawnBossHitSparks(state, enemy, player.isWerewolf ? '#c084fc' : '#38bdf8');
                    } else if (enemy.type === 'crate' || enemy.type === 'urn') {
                        audioManager.playSFX('enemyHit');
                        particles.push(...createSplinterParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 8, enemy.type === 'urn'));
                    } else {
                        particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, player.isWerewolf ? 24 : 14));
                    }
                    
                    particles.push({
                        id: Math.random(),
                        x: enemy.x + enemy.width / 2 + (Math.random() - 0.5) * 20,
                        y: enemy.y - 15,
                        velocityX: (Math.random() - 0.5) * 1.5,
                        velocityY: -3 - Math.random() * 2,
                        life: 45,
                        maxLife: 45,
                        color: player.isWerewolf ? '#c084fc' : '#38bdf8',
                        size: player.isWerewolf ? 15 : 12,
                        type: 'damageText',
                        text: `-${damage}`
                    });

                    if (enemy.health <= 0) {
                        if (enemy.type === 'crate' || enemy.type === 'urn') {
                            audioManager.playSFX('enemyDefeated');
                            particles.push(...createSplinterParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 22, enemy.type === 'urn'));
                            spawnBreakableLoot(state, enemy);
                        } else {
                            const xp = enemy.type === 'enforcer' ? C.XP_PER_ENFORCER : enemy.type === 'seeker' ? C.XP_PER_SEEKER : C.XP_PER_BOSS;
                            state.player.experience += xp;
                            state.score += xp;
                            audioManager.playSFX('enemyDefeated');
                            particles.push(...createHitParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, player.isWerewolf ? 48 : 32));
                        }
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
    const isTryingToMoveHorizontally = (keys['a'] || keys['arrowleft']) || (keys['d'] || keys['arrowright']);

    // Initialize timers if they don't exist
    if (player.coyoteTimer === undefined) player.coyoteTimer = 0;
    if (player.jumpBufferTimer === undefined) player.jumpBufferTimer = 0;

    // Coyote time tracking
    if (player.onGround) {
        player.isWallSliding = false;
        player.coyoteTimer = 10; // 10 frames of coyote time grace
    } else {
        if (player.coyoteTimer > 0) player.coyoteTimer--;
    }
    
    // Jump buffering input listener
    const jumpPressed = keys[' '] || keys['w'] || keys['arrowup'];
    if (jumpPressed) {
        if (!player.jumpKeyHeld) {
            player.jumpBufferTimer = 8; // Buffer jump for up to 8 frames
        }
        player.jumpKeyHeld = true;
    } else {
        player.jumpKeyHeld = false;

        // Variable jump height: if button released while ascending, dampen the upward force
        if (player.velocityY < -2) {
            player.velocityY *= 0.55;
        }
    }

    if (player.jumpBufferTimer > 0) {
        player.jumpBufferTimer--;
    }

    if (player.isDashing) {
        player.isWallSliding = false; // Cannot wall slide while dashing
        player.dashTimer--;
        
        player.dashTrail.unshift({ x: player.x, y: player.y, facing: player.facing });
        if (player.dashTrail.length > 5) player.dashTrail.pop();

        // Dash particles
        particles.push({
            id: Math.random(),
            x: player.x + (player.facing === 1 ? 0 : player.width),
            y: player.y + player.height / 2,
            velocityX: -player.velocityX * 0.5 + (Math.random() - 0.5),
            velocityY: (Math.random() - 0.5) * 2,
            life: 15,
            maxLife: 15,
            color: 'rgba(255, 255, 255, 0.3)',
            size: Math.random() * 3 + 2,
            type: 'dust'
        });

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
            const acc = 0.55; // Horizontal acceleration
            const maxSpeed = player.speed;
            
            if (keys['a'] || keys['arrowleft']) { 
                // snappy turnaround traction boost if moving opposite direction
                const actualAcc = player.velocityX > 0 ? acc * 3.0 : acc;
                player.velocityX = Math.max(-maxSpeed, player.velocityX - actualAcc); 
                player.facing = -1; 
                
                // Emitting dust running particles
                if (player.onGround && Math.random() < 0.2) {
                    particles.push({
                        id: Math.random(),
                        x: player.x + player.width / 2,
                        y: player.y + player.height,
                        velocityX: 1 + Math.random() * 2,
                        velocityY: -Math.random() * 1.5,
                        life: 15,
                        maxLife: 15,
                        color: 'rgba(180, 180, 200, 0.4)',
                        size: Math.random() * 3 + 2,
                        type: 'dust'
                    });
                }
            } 
            else if (keys['d'] || keys['arrowright']) { 
                // snappy turnaround traction boost if moving opposite direction
                const actualAcc = player.velocityX < 0 ? acc * 3.0 : acc;
                player.velocityX = Math.min(maxSpeed, player.velocityX + actualAcc); 
                player.facing = 1; 
                
                // Emitting dust running particles
                if (player.onGround && Math.random() < 0.2) {
                    particles.push({
                        id: Math.random(),
                        x: player.x + player.width / 2,
                        y: player.y + player.height,
                        velocityX: -1 - Math.random() * 2,
                        velocityY: -Math.random() * 1.5,
                        life: 15,
                        maxLife: 15,
                        color: 'rgba(180, 180, 200, 0.4)',
                        size: Math.random() * 3 + 2,
                        type: 'dust'
                    });
                }
            } 
            else { 
                if(!player.attacking) {
                    // Highly controlled ground friction to stop instantly on platforms, standard air friction
                    player.velocityX *= (player.onGround ? 0.65 : 0.82);
                }
            }
        }

        // WALL SLIDE LOGIC
        if (!player.onGround && isTryingToMoveHorizontally && player.velocityY >= 0) {
            let wallFound = false;
            const checkX = player.facing === 1 ? player.x + player.width : player.x;
            for (const p of platforms) {
                const isNextToPlatform = player.facing === 1
                    ? (checkX >= p.x && checkX < p.x + 5)
                    : (checkX <= p.x + p.width && checkX > p.x + p.width - 5);
                
                if (isNextToPlatform && player.y + player.height > p.y && player.y < p.y + p.height) {
                    wallFound = true;
                    break;
                }
            }
            if (wallFound) {
                player.isWallSliding = true;
                player.velocityY = C.WALL_SLIDE_SPEED;
                player.canDoubleJump = true; // Reset double jump on wall contact
                
                // Emitting wall slide dust
                if (Math.random() < 0.25) {
                    particles.push({
                        id: Math.random(),
                        x: player.facing === 1 ? player.x + player.width : player.x,
                        y: player.y + player.height / 2 + Math.random() * 20,
                        velocityX: (player.facing === 1 ? -1 : 1) * (Math.random() * 1.5),
                        velocityY: -Math.random() * 0.5,
                        life: 12,
                        maxLife: 12,
                        color: 'rgba(215, 215, 215, 0.5)',
                        size: Math.random() * 3 + 1,
                        type: 'dust'
                    });
                }
            } else {
                player.isWallSliding = false;
            }
        } else {
            player.isWallSliding = false;
        }
        
        // JUMP EXECUTION WITH COYOTE & BUFFERING
        if (player.jumpBufferTimer > 0) {
            if (player.isWallSliding) {
                player.velocityY = -C.WALL_JUMP_Y_POWER;
                player.velocityX = C.WALL_JUMP_X_POWER * -player.facing;
                player.facing = -player.facing as 1 | -1;
                player.isWallSliding = false;
                player.jumpBufferTimer = 0; // Consume
                audioManager.playSFX('jump');
            } else if (player.onGround || player.coyoteTimer > 0) {
                player.velocityY = -player.jumpPower;
                player.onGround = false;
                player.coyoteTimer = 0; // Consume coyote grace
                player.jumpBufferTimer = 0; // Consume jump buffer
                audioManager.playSFX('jump');
                
                // Jump trail launch particles
                for (let i = 0; i < 8; i++) {
                    particles.push({
                        id: Math.random(),
                        x: player.x + player.width / 2,
                        y: player.y + player.height,
                        velocityX: (Math.random() - 0.5) * 4,
                        velocityY: (Math.random() - 0.5) * 1 - 1,
                        life: 15,
                        maxLife: 15,
                        color: 'rgba(200, 200, 200, 0.6)',
                        size: Math.random() * 4 + 2,
                        type: 'dust'
                    });
                }
            } else if (player.canDoubleJump) {
                player.velocityY = -C.PLAYER_DOUBLE_JUMP_POWER;
                player.canDoubleJump = false;
                player.jumpBufferTimer = 0; // Consume
                audioManager.playSFX('doubleJump');
                
                // Add a beautiful atmospheric expanding shockwave ring pattern
                particles.push({
                    id: Math.random(),
                    x: player.x + player.width / 2,
                    y: player.y + player.height,
                    velocityX: 0,
                    velocityY: 0,
                    life: 20,
                    maxLife: 20,
                    color: player.isWerewolf ? 'rgba(168, 85, 247, 0.65)' : 'rgba(34, 211, 238, 0.65)',
                    size: 35,
                    type: 'shockwave'
                });

                const djumpParticles: Particle[] = [];
                for (let i = 0; i < 15; i++) {
                    djumpParticles.push({
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
                particles.push(...djumpParticles);
            }
        }
        
        player.x += player.velocityX;

        if (player.isWallSliding) {
            player.y += player.velocityY;
            player.onGround = false;

            // Wall slide glowing sliding sparks!
            if (Math.random() < 0.35) {
                const contactX = player.facing === 1 ? player.x + player.width : player.x;
                particles.push({
                    id: Math.random(),
                    x: contactX,
                    y: player.y + player.height / 2 + (Math.random() - 0.5) * 15,
                    velocityX: -player.facing * (1.2 + Math.random() * 2), // bounce off wall
                    velocityY: -0.5 - Math.random() * 1.5, // spray upwards gently
                    life: 18,
                    maxLife: 18,
                    color: '#eab308', // gold/amber wall scraping sparks
                    size: 2 + Math.random() * 2,
                    type: 'spark'
                });
            }
        } else {
            const wasJustGrounded = !player.onGround;
            const isNowGrounded = applyGravityAndPlatformCollision(player, platforms);

            if (isNowGrounded && wasJustGrounded && Math.abs(player.velocityY!) > 5) {
                if (Math.abs(player.velocityY!) > 15) {
                    state.screenShake = { magnitude: 6, duration: 15 };
                }
                for(let i=0; i<8; i++) {
                    particles.push({
                        id: Math.random(),
                        x: player.x + player.width / 2 + (Math.random() - 0.5) * 30,
                        y: player.y + player.height,
                        velocityX: (Math.random() - 0.5) * 6,
                        velocityY: -(Math.random() * 3),
                        life: 25 + Math.random() * 10,
                        maxLife: 35,
                        color: 'rgba(200, 200, 200, 0.6)',
                        size: Math.random() * 6 + 3,
                        type: 'dust'
                    });
                }
            }
        }

        if(player.onGround) {
            player.canDoubleJump = true;
        }
    }
    
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > state.worldWidth) player.x = state.worldWidth - player.width;

    // Animation State Machine
    player.animation.frameTimer++;
    const animSpeed = C.ANIMATION_SPEEDS[player.animation.currentState as keyof typeof C.ANIMATION_SPEEDS];
    const animFrames = C.ANIMATION_FRAMES[player.animation.currentState as keyof typeof C.ANIMATION_FRAMES];

    if (player.animation.frameTimer >= animSpeed) {
        player.animation.frameTimer = 0;
        player.animation.frameIndex++;

        if (player.animation.currentState === 'attack' || player.animation.currentState === 'clawAttack' || player.animation.currentState === 'parry') {
            if (player.animation.frameIndex >= animFrames) {
                player.attacking = false;
                // Don't reset parry here, it's timer based
                player.animation.frameIndex = 0; 
            }
        } else {
            player.animation.frameIndex %= animFrames;
        }
    }

    // Determine current state (if not in a fixed state like attack/dash)
    if (!player.attacking && !player.isDashing && !player.isParrying) {
        let newAnimationState: PlayerState['animation']['currentState'] = 'idle';
        if (player.isWallSliding) {
            newAnimationState = 'wallSlide';
        } else if (!player.onGround) {
            newAnimationState = 'jump';
        } else if (Math.abs(player.velocityX) > 0.1 && player.chargeTimer === 0) {
            newAnimationState = 'run';
        }

        if (player.animation.currentState !== newAnimationState) {
            player.animation.currentState = newAnimationState;
            player.animation.frameTimer = 0;
            player.animation.frameIndex = 0;
        }
    } else if (player.isDashing) { // Set dash state
        if (player.animation.currentState !== 'dash') {
            player.animation.currentState = 'dash';
            player.animation.frameTimer = 0;
            player.animation.frameIndex = 0;
        }
    }

    // Capture spectral weapon history for motion blur trails
    if (!player.attackTrail) {
        player.attackTrail = [];
    }
    if (player.attacking && (player.animation.currentState === 'attack' || player.animation.currentState === 'clawAttack')) {
        player.attackTrail.unshift({
            x: player.x,
            y: player.y,
            facing: player.facing,
            state: player.animation.currentState as 'attack' | 'clawAttack',
            frameIndex: player.animation.frameIndex
        });
        if (player.attackTrail.length > 4) player.attackTrail.pop();
    } else {
        if (player.attackTrail.length > 0) {
            player.attackTrail.shift(); // organic drag/fading
        }
    }
};

export const updateScreenShake = (state: GameState) => {
    if (state.screenShake.duration > 0) {
        state.screenShake.duration--;
        if (state.screenShake.duration === 0) {
            state.screenShake.magnitude = 0;
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
        attackTrail: [],
        canDoubleJump: true,
        jumpKeyHeld: false,
        isWallSliding: false,
        isParrying: false,
        parryTimer: 0,
        parryCooldown: 0,
    };

    const enemies = JSON.parse(JSON.stringify(levelData.enemies));
    
    // Procedural distribution of breakable crates and urns on level platforms
    let breakableId = 5000;
    platforms.forEach((plat: any) => {
        const isStaticMainPlat = !plat.type || plat.type === 'static';
        if (isStaticMainPlat && plat.width >= 120) {
            const seed = Math.random();
            if (seed < 0.42) {
                // Spawn a textured wooden crate
                enemies.push({
                    id: breakableId++,
                    x: plat.x + plat.width / 2 - 16,
                    y: plat.y - 32,
                    width: 32,
                    height: 32,
                    health: 12, // Simple wood durability
                    maxHealth: 12,
                    speed: 0,
                    direction: 1,
                    type: 'crate',
                    hitTimer: 0,
                    startX: plat.x + plat.width / 2 - 16,
                    patrolRange: 0
                });
            } else if (seed < 0.70) {
                // Spawn a terracotta clay urn
                enemies.push({
                    id: breakableId++,
                    x: plat.x + plat.width * 0.2, // Off-center left
                    y: plat.y - 32,
                    width: 24,
                    height: 32,
                    health: 6, // Fragile pottery
                    maxHealth: 6,
                    speed: 0,
                    direction: 1,
                    type: 'urn',
                    hitTimer: 0,
                    startX: plat.x + plat.width * 0.2,
                    patrolRange: 0
                });
            } else if (seed < 0.85 && plat.width > 200) {
                // Spawn a decorative loot array of dual pottery urns
                enemies.push({
                    id: breakableId++,
                    x: plat.x + plat.width - 60,
                    y: plat.y - 32,
                    width: 24,
                    height: 32,
                    health: 6,
                    maxHealth: 6,
                    speed: 0,
                    direction: 1,
                    type: 'urn',
                    hitTimer: 0,
                    startX: plat.x + plat.width - 60,
                    patrolRange: 0
                });
            }
        }
    });

    return {
        player: initialPlayer,
        platforms,
        enemies,
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
        screenShake: { magnitude: 0, duration: 0 },
        hazards: levelData.hazards ? JSON.parse(JSON.stringify(levelData.hazards)) : [],
        hitStopTimer: 0,
    };
};