
import { PlayerState, Platform, Enemy, Projectile, Particle, Camera, Goal, PowerUp } from '../types';
import * as C from '../constants';

export const drawBackground = (ctx: CanvasRenderingContext2D, camera: Camera) => {
    // Gradient Sky
    const sky = ctx.createLinearGradient(0, 0, 0, C.CANVAS_HEIGHT);
    sky.addColorStop(0, '#16213e');
    sky.addColorStop(0.6, '#0a0a0a');
    sky.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
    
    // Moon
    ctx.fillStyle = 'rgba(220, 220, 240, 0.9)';
    ctx.beginPath();
    ctx.arc(C.CANVAS_WIDTH - 150, 100, 50, 0, Math.PI * 2);
    ctx.fill();

    // Distant buildings (Parallax layer)
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
        ctx.fillStyle = '#4a4a8a'; // Base color
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(platform.x, platform.y, platform.width, 5); // Top shadow

        // Add a darker pattern for texture
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
        if (enemy.type === 'enforcer') { // Vampire Thrall
            const capeColor = '#1a1a1a';
            const bodyColor = '#333333';
            const headColor = '#dcdcdc';
            
            ctx.fillStyle = capeColor;
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.fillStyle = bodyColor;
            ctx.fillRect(enemy.x + 4, enemy.y, enemy.width - 8, enemy.height - 4);
            ctx.fillStyle = headColor;
            ctx.fillRect(enemy.x + 10, enemy.y + 4, enemy.width - 20, 10);
            ctx.fillStyle = '#8b0000'; // Eyes
            ctx.fillRect(enemy.x + 12, enemy.y + 7, 3, 2);
            ctx.fillRect(enemy.x + 17, enemy.y + 7, 3, 2);

        } else { // Blood Seeker
            ctx.fillStyle = '#4d0000'; // Outer aura
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 200) * 0.2;
            ctx.fillRect(enemy.x - 5, enemy.y - 5, enemy.width + 10, enemy.height + 10);
            ctx.globalAlpha = 1;
            
            ctx.fillStyle = '#1a1a1a'; // Shroud
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            ctx.fillStyle = '#8b0000'; // Glowing eyes
            ctx.fillRect(enemy.x + 10, enemy.y + 15, 8, 4);
            ctx.fillRect(enemy.x + 22, enemy.y + 15, 8, 4);
        }

        // Hit flash
        if(enemy.hitTimer > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
};

export const drawPlayer = (ctx: CanvasRenderingContext2D, player: PlayerState) => {
    const { x, y, width, height, facing, animation, invincibilityTimer, isWerewolf } = player;

    ctx.save();
    ctx.translate(x + width / 2, y);
    if (facing === -1) ctx.scale(-1, 1);

    // Invincibility flash
    if (invincibilityTimer > 0 && Math.floor(invincibilityTimer / 5) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // --- Draw Tessa Programmatically ---
    const headSize = 12;
    const neck = 2;
    const torsoH = 18;
    const legH = 18;
    const armW = isWerewolf ? 8 : 6;
    const legW = isWerewolf ? 10 : 8;
    const feetH = 4;

    const hair = isWerewolf ? '#4a4a4a' : '#6d4c41';
    const skin = isWerewolf ? '#a1887f' : '#f0d9b5';
    const tunic = isWerewolf ? '#424242' : '#00695c';
    const pants = isWerewolf ? '#333333' : '#4e342e';
    const boots = isWerewolf ? '#212121' : '#3e2723';
    const daggerBlade = '#e0e0e0';
    const eyeColor = isWerewolf ? '#fdd835' : 'black';
    
    const runCycle = animation.currentState === 'run' ? Math.sin(Date.now() / 100) * 5 : 0;

    // Back leg
    ctx.fillStyle = pants;
    ctx.fillRect(2 - runCycle, headSize + neck + torsoH, legW, legH);
    ctx.fillStyle = boots;
    ctx.fillRect(2 - runCycle, headSize + neck + torsoH + legH - feetH, legW, feetH);
    
    // Torso
    ctx.fillStyle = tunic;
    ctx.fillRect(-width/4, headSize + neck, width/2, torsoH);

    // Front leg
    ctx.fillStyle = pants;
    ctx.fillRect(-legW + runCycle, headSize + neck + torsoH, legW, legH);
    ctx.fillStyle = boots;
    ctx.fillRect(-legW + runCycle, headSize + neck + torsoH + legH - feetH, legW, feetH);

    // Head
    ctx.fillStyle = hair;
    ctx.fillRect(-headSize/2 - 2, -2, headSize + 4, headSize + 4); 
    if (!isWerewolf) {
        ctx.fillRect(headSize / 2, 5, 5, 15); // Ponytail
    }
    ctx.fillStyle = skin;
    ctx.fillRect(-headSize/2, 0, headSize, headSize); // Face
    ctx.fillStyle = eyeColor;
    ctx.fillRect(headSize/2 - 3, 4, 2, 2); // Eye

    // Arm & Attack
    if (animation.currentState === 'attack') {
        const attackProgress = player.animation.frameTimer / 15;
        const attackReach = 25 * Math.sin(attackProgress * Math.PI); 
        ctx.fillStyle = tunic; // Arm
        ctx.fillRect(0, headSize + neck + 4, 15, armW);
        ctx.fillStyle = daggerBlade; // Blade
        ctx.fillRect(15, headSize + neck + 3, attackReach, armW-2);
        
        ctx.strokeStyle = 'rgba(236, 239, 241, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, headSize + neck + 8, attackReach + 5, -0.2 * Math.PI, 0.2 * Math.PI);
        ctx.stroke();
    } else if (animation.currentState === 'clawAttack') {
        const attackProgress = player.animation.frameTimer / 12;
        const lunge = 15 * Math.sin(attackProgress * Math.PI);
        const armLungeX = lunge - 10;
        ctx.fillStyle = tunic;
        ctx.fillRect(armLungeX, headSize + neck + 4, 25, armW);
        
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            const clawBaseY = headSize + neck + 4 + (i * (armW / 2.5));
            ctx.moveTo(armLungeX + 25, clawBaseY);
            ctx.lineTo(armLungeX + 50, clawBaseY + (armW / 4));
            ctx.lineTo(armLungeX + 25, clawBaseY + (armW / 2));
            ctx.fill();
        }
        
        ctx.strokeStyle = 'rgba(192, 77, 246, 0.8)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(lunge, headSize + neck + 10, 35, -0.3 * Math.PI, 0.3 * Math.PI);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(lunge, headSize + neck + 10, 40, -0.25 * Math.PI, 0.25 * Math.PI);
        ctx.stroke();

    } else { // Idle/Running Arm
        ctx.fillStyle = tunic;
        ctx.fillRect(0, headSize + neck + 4, armW, 14);
        if (isWerewolf) { // Idle claws
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(armW, headSize + neck + 4, 4, 2);
            ctx.fillRect(armW, headSize + neck + 8, 4, 2);
        }
    }
    
    ctx.restore();
};

export const drawGoal = (ctx: CanvasRenderingContext2D, goal: Goal) => {
    // Doorframe
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
    
    // Portal effect
    const portalGradient = ctx.createLinearGradient(goal.x, goal.y, goal.x, goal.y + goal.height);
    portalGradient.addColorStop(0, '#4dccbd');
    portalGradient.addColorStop(1, '#1e6a6a');
    ctx.fillStyle = portalGradient;
    ctx.globalAlpha = 0.7 + Math.sin(Date.now() / 300) * 0.2;
    ctx.fillRect(goal.x + 5, goal.y + 5, goal.width - 10, goal.height - 10);
    ctx.globalAlpha = 1;

    // Glyphs
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px "Press Start 2P"';
    ctx.globalAlpha = 0.9;
    ctx.fillText('EXIT', goal.x + 8, goal.y - 10);
    ctx.globalAlpha = 1;
};

export const drawPowerUps = (ctx: CanvasRenderingContext2D, powerUps: PowerUp[]) => {
    powerUps.forEach(p => {
        if (p.type === 'lunarFragment') {
            const glow = 1 + Math.sin(Date.now() / 200) * 0.5;
            
            // Outer Glow
            ctx.fillStyle = 'rgba(168, 85, 247, 0.3)';
            ctx.beginPath();
            ctx.arc(p.x + p.width / 2, p.y + p.height / 2, (p.width / 2) * glow, 0, Math.PI * 2);
            ctx.fill();

            // Crescent Shape
            ctx.fillStyle = '#f0abfc';
            ctx.beginPath();
            ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/2, -0.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.arc(p.x + p.width/2, p.y + p.height/2, p.width/4, 0.5 * Math.PI, -0.5 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
        }
    });
};

export const drawProjectiles = (ctx: CanvasRenderingContext2D, projectiles: Projectile[]) => {
    projectiles.forEach(p => {
        // Glow
        ctx.fillStyle = '#4dccbd';
        ctx.fillRect(p.x, p.y, p.width, p.height);
        // Core
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x + 2, p.y + 2, p.width - 4, p.height - 4);
    });
};

export const drawParticles = (ctx: CanvasRenderingContext2D, particles: Particle[]) => {
    particles.forEach(p => {
        p.x += p.velocityX;
        p.y += p.velocityY;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
};