import { PlayerState, Platform, Enemy, Projectile, Particle, Camera, Goal, PowerUp, GameState } from '../types';
import * as C from '../constants';

export const drawBackground = (ctx: CanvasRenderingContext2D, camera: Camera) => {
    const sky = ctx.createLinearGradient(0, 0, 0, C.CANVAS_HEIGHT);
    sky.addColorStop(0, '#16213e');
    sky.addColorStop(0.6, '#0a0a0a');
    sky.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    
    ctx.fillStyle = 'rgba(220, 220, 240, 0.9)';
    ctx.beginPath();
    ctx.arc(C.CANVAS_WIDTH - 150, 100, 50, 0, Math.PI * 2);
    ctx.fill();

    const skylineColor = '#1a1a2e';
    ctx.fillStyle = skylineColor;
    for (let i = 0; i < 30; i++) {
        const parallaxX = (i * 100 - camera.x * 0.2);
        const screenX = ((parallaxX % (C.WORLD_WIDTH + 200)) + (C.WORLD_WIDTH + 200)) % (C.WORLD_WIDTH + 200) - 100;
        const height = 150 + Math.sin(i * 0.5) * 80;
        const width = 80 + Math.cos(i * 0.9) * 30;
        ctx.fillRect(screenX, C.CANVAS_HEIGHT - height, width, height);
    }
};

export const drawPlatforms = (ctx: CanvasRenderingContext2D, platforms: Platform[]) => {
    platforms.forEach(platform => {
        ctx.fillStyle = '#4a4a8a';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        if (platform.type && platform.type !== 'static') {
            ctx.fillStyle = 'rgba(120, 120, 160, 0.5)'; // A different, lighter shade for moving platforms
        } else {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
        }
        ctx.fillRect(platform.x, platform.y, platform.width, 5);

        ctx.fillStyle = '#3a3a6a';
        for (let y = 0; y < platform.height; y += 10) {
            for (let x = (Math.floor(y / 10) % 2) * 10; x < platform.width; x += 20) {
                ctx.fillRect(platform.x + x, platform.y + y, 10, 10);
            }
        }
    });
};

export const drawEnemies = (ctx: CanvasRenderingContext2D, enemies: Enemy[]) => {
    enemies.forEach(enemy => {
        let opacity = 1;
        if (enemy.health < enemy.maxHealth && enemy.health > 0) {
             opacity = Math.max(0.4, enemy.health / enemy.maxHealth);
        }
        ctx.globalAlpha = opacity;

        if (enemy.type === 'enforcer') {
            const capeColor = '#1a1a1a'; const bodyColor = '#333333'; const headColor = '#dcdcdc';
            ctx.fillStyle = capeColor; ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = bodyColor; ctx.fillRect(enemy.x + 4, enemy.y, enemy.width - 8, enemy.height - 4);
            ctx.fillStyle = headColor; ctx.fillRect(enemy.x + 10, enemy.y + 4, enemy.width - 20, 10);
            ctx.fillStyle = '#8b0000';
            ctx.fillRect(enemy.x + 12, enemy.y + 7, 3, 2); ctx.fillRect(enemy.x + 17, enemy.y + 7, 3, 2);
        } else if (enemy.type === 'seeker') {
            // New: charge-up glow
            if (enemy.attackCooldown && enemy.attackCooldown > 0 && enemy.attackCooldown < 30) {
                const glowSize = enemy.width * (1.5 + Math.sin(Date.now() / 50));
                ctx.fillStyle = `rgba(255, 77, 77, ${0.4 * (1 - enemy.attackCooldown / 30)})`;
                ctx.beginPath();
                ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, glowSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.fillStyle = '#4d0000';
            ctx.globalAlpha = (0.5 + Math.sin(Date.now() / 200) * 0.2) * opacity;
            ctx.fillRect(enemy.x - 5, enemy.y - 5, enemy.width + 10, enemy.height + 10);
            ctx.globalAlpha = 1 * opacity;
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = '#8b0000';
            ctx.fillRect(enemy.x + 10, enemy.y + 15, 8, 4); ctx.fillRect(enemy.x + 22, enemy.y + 15, 8, 4);
        } else if (enemy.type === 'boss') {
            const bodyColor = '#3a3a6a'; const armorColor = '#6a6a8a'; const eyeColor = '#ff4d4d';
            ctx.fillStyle = bodyColor; ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = armorColor;
            ctx.fillRect(enemy.x + 10, enemy.y + 20, enemy.width - 20, 10); // Chestplate
            ctx.fillRect(enemy.x, enemy.y, enemy.width, 20); // Helmet
            ctx.fillStyle = eyeColor;
            ctx.fillRect(enemy.x + 25, enemy.y + 8, 10, 6);
            ctx.fillRect(enemy.x + 45, enemy.y + 8, 10, 6);
        }
        ctx.globalAlpha = 1;

        if (enemy.hitTimer > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }

        // New Visual Tells for advanced AI
        if (enemy.attackPattern === 'tell' || (enemy.type === 'boss' && enemy.attackPhaseTimer! > 0)) {
            const glowSize = enemy.width * (0.8 + Math.sin(Date.now() / 100) * 0.2);
            let glowColor = 'rgba(255, 255, 100, 0.7)'; // Enforcer tell
            
            if (enemy.type === 'boss') {
                if (enemy.attackPattern === 'dash') glowColor = 'rgba(255, 100, 100, 0.7)';
                else if (enemy.attackPattern === 'shoot') glowColor = 'rgba(200, 100, 255, 0.7)';
                else if (enemy.attackPattern === 'slam') glowColor = 'rgba(255, 255, 255, 0.7)';
            }
        
            ctx.fillStyle = glowColor;
            ctx.beginPath();
            ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, glowSize, 0, Math.PI * 2);
            ctx.fill();
        }
    });
};

export const drawPlayer = (ctx: CanvasRenderingContext2D, player: PlayerState) => {
    const { x, y, width, height, facing, animation, invincibilityTimer, isWerewolf, chargeTimer, isDashing, dashTrail } = player;

    ctx.save();

    // Draw Dash Trail
    if (dashTrail.length > 0) {
        dashTrail.forEach((trailPart, index) => {
            ctx.save();
            const opacity = 0.4 * (1 - (index / dashTrail.length));
            ctx.globalAlpha = opacity;
            ctx.translate(trailPart.x + width / 2, trailPart.y);
            if (trailPart.facing === -1) ctx.scale(-1, 1);
            
            const tunic = isWerewolf ? '#424242' : '#00695c';
            ctx.fillStyle = tunic;
            ctx.fillRect(-width / 4, 2, width / 2, height - 4);
            
            ctx.restore();
        });
    }

    ctx.translate(x + width / 2, y);
    if (facing === -1) ctx.scale(-1, 1);

    if (invincibilityTimer > 0 && Math.floor(invincibilityTimer / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // Charged Attack Visual Effect
    if (chargeTimer > 0) {
        const chargePercent = chargeTimer / C.CHARGE_ATTACK_MAX_TIME;
        const glowRadius = width / 2 + chargePercent * 20 + Math.sin(Date.now() / 100) * 3;
        const glowOpacity = 0.2 + chargePercent * 0.5;

        const grad = ctx.createRadialGradient(0, height / 2, 5, 0, height / 2, glowRadius);
        grad.addColorStop(0, `rgba(77, 204, 189, ${glowOpacity})`);
        grad.addColorStop(1, 'rgba(77, 204, 189, 0)');
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, height / 2, glowRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    const headSize = 12, neck = 2, torsoH = 18, legH = 18, armW = isWerewolf ? 8 : 6, legW = isWerewolf ? 10 : 8, feetH = 4;
    const hair = isWerewolf ? '#4a4a4a' : '#6d4c41', skin = isWerewolf ? '#a1887f' : '#f0d9b5', tunic = isWerewolf ? '#424242' : '#00695c', pants = isWerewolf ? '#333333' : '#4e342e', boots = isWerewolf ? '#212121' : '#3e2723', daggerBlade = '#e0e0e0', eyeColor = isWerewolf ? '#fdd835' : 'black';
    const runCycle = animation.currentState === 'run' ? Math.sin(Date.now() / 100) * 5 : 0;

    // Handle special full-body dash pose first
    if (animation.currentState === 'dash') {
        const lean = 10;
        ctx.fillStyle = tunic; 
        ctx.beginPath();
        ctx.moveTo(-width/4, headSize + neck); ctx.lineTo(width/4, headSize + neck);
        ctx.lineTo(width/4 - lean, headSize + neck + torsoH); ctx.lineTo(-width/4 - lean, headSize + neck + torsoH);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = pants; ctx.fillRect(-legW - lean, headSize + neck + torsoH, legW, legH);
        ctx.fillStyle = boots; ctx.fillRect(-legW - lean, headSize + neck + torsoH + legH - feetH, legW, feetH);
        ctx.fillStyle = hair; ctx.fillRect(-headSize/2, -2, headSize + 4, headSize + 4); 
        ctx.fillStyle = skin; ctx.fillRect(-headSize/2, 0, headSize, headSize);
        ctx.fillStyle = eyeColor; ctx.fillRect(headSize/2 - 3, 4, 2, 2);
    } else {
        // --- Draw Base Body (for all non-dash states) ---
        // Legs
        ctx.fillStyle = pants; ctx.fillRect(2 - runCycle, headSize + neck + torsoH, legW, legH);
        ctx.fillStyle = boots; ctx.fillRect(2 - runCycle, headSize + neck + torsoH + legH - feetH, legW, feetH);
        ctx.fillStyle = pants; ctx.fillRect(-legW + runCycle, headSize + neck + torsoH, legW, legH);
        ctx.fillStyle = boots; ctx.fillRect(-legW + runCycle, headSize + neck + torsoH + legH - feetH, legW, feetH);
        // Torso
        ctx.fillStyle = tunic; ctx.fillRect(-width/4, headSize + neck, width/2, torsoH);
        // Head
        ctx.fillStyle = hair; ctx.fillRect(-headSize/2 - 2, -2, headSize + 4, headSize + 4); 
        if (!isWerewolf) ctx.fillRect(headSize / 2, 5, 5, 15);
        ctx.fillStyle = skin; ctx.fillRect(-headSize/2, 0, headSize, headSize);
        ctx.fillStyle = eyeColor; ctx.fillRect(headSize/2 - 3, 4, 2, 2);

        // --- Draw Arms based on state ---
        if (animation.currentState === 'attack') {
            const attackProgress = player.animation.frameTimer / 15, attackReach = 25 * Math.sin(attackProgress * Math.PI); 
            ctx.fillStyle = tunic; ctx.fillRect(0, headSize + neck + 4, 15, armW);
            const daggerBaseX = 15; const daggerBaseY = headSize + neck + 3;
            ctx.fillStyle = daggerBlade; ctx.beginPath(); ctx.moveTo(daggerBaseX, daggerBaseY);
            ctx.lineTo(daggerBaseX + attackReach, daggerBaseY + (armW-2)/2); ctx.lineTo(daggerBaseX, daggerBaseY + armW-2);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = `rgba(236, 239, 241, ${0.8 * Math.sin(attackProgress * Math.PI)})`; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(daggerBaseX - 5, headSize + neck + 8, attackReach, -0.25 * Math.PI, 0.25 * Math.PI); ctx.stroke();
        } else if (animation.currentState === 'clawAttack') {
            const attackProgress = player.animation.frameTimer / 12, lunge = 15 * Math.sin(attackProgress * Math.PI), armLungeX = lunge - 10;
            ctx.fillStyle = tunic; ctx.fillRect(armLungeX, headSize + neck + 4, 25, armW);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * Math.sin(attackProgress * Math.PI)})`; ctx.lineWidth = 3;
            for (let i = 0; i < 3; i++) {
                const yOffset = (i - 1) * 8, xOffset = Math.random() * 5;
                ctx.beginPath(); ctx.moveTo(armLungeX + 25 + xOffset, headSize + neck + 8 + yOffset);
                ctx.quadraticCurveTo(armLungeX + 45, headSize + neck + 12 + yOffset, armLungeX + 60, headSize + neck + 4 + yOffset);
                ctx.stroke();
            }
            ctx.strokeStyle = 'rgba(192, 77, 246, 0.8)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(lunge, headSize + neck + 10, 35, -0.3 * Math.PI, 0.3 * Math.PI); ctx.stroke();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(lunge, headSize + neck + 10, 40, -0.25 * Math.PI, 0.25 * Math.PI); ctx.stroke();
        } else {
            // Default resting arm for idle, run, jump
            ctx.fillStyle = tunic; ctx.fillRect(0, headSize + neck + 4, armW, 14);
            if (isWerewolf) { ctx.fillStyle = '#ffffff'; ctx.fillRect(armW, headSize + neck + 4, 4, 2); ctx.fillRect(armW, headSize + neck + 8, 4, 2); }
        }
    }
    
    ctx.restore();
};

export const drawGoal = (ctx: CanvasRenderingContext2D, goal: Goal) => {
    ctx.fillStyle = '#4e342e'; ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    const portalGradient = ctx.createLinearGradient(goal.x, goal.y, goal.x, goal.y + goal.height);
    portalGradient.addColorStop(0, '#4dccbd'); portalGradient.addColorStop(1, '#1e6a6a');
    ctx.fillStyle = portalGradient;
    ctx.globalAlpha = 0.7 + Math.sin(Date.now() / 300) * 0.2;
    ctx.fillRect(goal.x + 5, goal.y + 5, goal.width - 10, goal.height - 10);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff'; ctx.font = '12px "Press Start 2P"';
    ctx.globalAlpha = 0.9; ctx.fillText('EXIT', goal.x + 8, goal.y - 10); ctx.globalAlpha = 1;
};

export const drawPowerUps = (ctx: CanvasRenderingContext2D, powerUps: PowerUp[]) => {
    powerUps.forEach(p => {
        if (p.type === 'lunarFragment') {
            const glow = 1 + Math.sin(Date.now() / 200) * 0.5;
            ctx.fillStyle = 'rgba(168, 85, 247, 0.3)'; ctx.beginPath(); ctx.arc(p.x + p.width / 2, p.y + p.height / 2, (p.width / 2) * glow, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#f0abfc'; ctx.beginPath(); ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, -0.5 * Math.PI, 0.5 * Math.PI, false); ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/4, 0.5 * Math.PI, -0.5 * Math.PI, true); ctx.closePath(); ctx.fill();
        }
        if (p.type === 'isoldeAid') {
             const glow = 1 + Math.sin(Date.now() / 150) * 0.5;
            ctx.fillStyle = 'rgba(224, 224, 224, 0.3)'; ctx.beginPath(); ctx.arc(p.x + p.width / 2, p.y + p.height / 2, (p.width / 2) * glow, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 2;
            ctx.strokeRect(p.x + 8, p.y + 4, 2, 16); ctx.strokeRect(p.x + 4, p.y + 8, 16, 2);
        }
        if (p.type === 'healthVial') {
            const glow = 1 + Math.sin(Date.now() / 180) * 0.5;
            ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'; // Red glow
            ctx.beginPath();
            ctx.arc(p.x + p.width / 2, p.y + p.height / 2, (p.width / 1.5) * glow, 0, Math.PI * 2);
            ctx.fill();
            
            // Bottle shape
            ctx.fillStyle = '#fecaca'; // Light red glass
            ctx.fillRect(p.x + 4, p.y, p.width - 8, p.height);
            ctx.fillStyle = '#ef4444'; // Red liquid
            ctx.fillRect(p.x + 4, p.y + 10, p.width - 8, p.height - 10);
            ctx.fillStyle = '#991b1b'; // Cork
            ctx.fillRect(p.x + 6, p.y - 4, p.width - 12, 6);
        }
    });
};

export const drawProjectiles = (ctx: CanvasRenderingContext2D, projectiles: Projectile[]) => {
    projectiles.forEach(p => {
        if (p.type === 'dagger') {
            ctx.save();
            ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

            if (p.velocityX < 0) {
                ctx.scale(-1, 1); // Flip horizontally for left-facing throw
            }
            
            const rotation = (p.x / 15); // Spin it based on distance traveled
            ctx.rotate(rotation);

            // Dagger shape centered around (0,0)
            const bladeLength = 10;
            const bladeWidth = 5;
            const hiltLength = 5;
            const hiltWidth = 4;
            const guardWidth = 6;

            // Blade
            ctx.fillStyle = '#e0e0e0'; // silver
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(bladeLength, -bladeWidth / 2);
            ctx.lineTo(bladeLength, bladeWidth / 2);
            ctx.closePath();
            ctx.fill();

            // Hilt
            ctx.fillStyle = '#8d6e63'; // brown
            ctx.fillRect(-hiltLength, -hiltWidth / 2, hiltLength, hiltWidth);

            // Guard
            ctx.fillStyle = '#ababab';
            ctx.fillRect(-1, -guardWidth/2, 2, guardWidth);
            
            ctx.restore();
        } else if (p.type === 'darkEnergy') {
            const glowSize = p.width * (1.8 + Math.sin(Date.now() / 120) * 0.6);
            ctx.fillStyle = 'rgba(192, 77, 246, 0.5)';
            ctx.beginPath(); ctx.arc(p.x + p.width/2, p.y + p.height/2, glowSize/2, 0, Math.PI * 2); ctx.fill();
            
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, 0, Math.PI*2); ctx.fill();
        }
    });
};

export const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(p => {
        p.x += p.velocityX; p.y += p.velocityY;
        ctx.globalAlpha = p.life / p.maxLife;

        if (p.type === 'shockwave') {
            const currentRadius = p.size * ((p.maxLife - p.life) / p.maxLife);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 8 * (p.life / p.maxLife);
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
    });
    ctx.globalAlpha = 1;
};

export const drawIsolde = (ctx: CanvasRenderingContext2D, state: GameState) => {
    if (state.isoldeAttackTimer <= 0) return;
    const timer = state.isoldeAttackTimer;
    const duration = 60;
    
    // Animate Isolde dashing across the screen
    const progress = (duration - timer) / 30; // Control animation speed
    const startX = state.player.x - 200;
    const endX = state.player.x + 200;
    const currentX = startX + (endX - startX) * progress;
    const y = state.player.y - 20;

    // Draw slash effects
    ctx.strokeStyle = `rgba(224, 224, 224, ${1 - progress})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(currentX - 50, y - 20);
    ctx.lineTo(currentX + 50, y + 50);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(currentX + 50, y - 20);
    ctx.lineTo(currentX - 50, y + 50);
    ctx.stroke();

    // Draw a simple representation of Isolde
    ctx.globalAlpha = Math.sin(progress * Math.PI); // Fade in and out
    ctx.fillStyle = '#212121'; // Cloak
    ctx.beginPath();
    ctx.moveTo(currentX, y);
    ctx.lineTo(currentX - 20, y + 60);
    ctx.lineTo(currentX + 20, y + 60);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
};