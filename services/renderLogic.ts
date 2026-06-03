
import { PlayerState, Platform, Enemy, Projectile, Particle, Camera, Goal, PowerUp, GameState, Hazard } from '../types';
import * as C from '../constants';

export const drawBackground = (ctx: CanvasRenderingContext2D, camera: Camera, backgroundImage: HTMLImageElement | null = null, state?: GameState) => {
    const isSpecial = state && (state.player.isWerewolf || state.enemies.some(e => e.type === 'boss'));

    if (backgroundImage && backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
        
        if (isSpecial) {
            // Apply a nice blood-red ambient vignette filter over the background image
            const overlay = ctx.createRadialGradient(
                C.CANVAS_WIDTH - 150, 100, 20,
                C.CANVAS_WIDTH - 150, 100, 150
            );
            overlay.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
            overlay.addColorStop(0.5, 'rgba(185, 28, 28, 0.18)');
            overlay.addColorStop(1, 'rgba(15, 2, 2, 0.3)');
            ctx.fillStyle = overlay;
            ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
            
            ctx.fillStyle = 'rgba(127, 29, 29, 0.12)';
            ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
        }
    } else {
        const sky = ctx.createLinearGradient(0, 0, 0, C.CANVAS_HEIGHT);
        if (isSpecial) {
            sky.addColorStop(0, '#2e0813'); // Bleeding dark crimson night
            sky.addColorStop(0.6, '#080103');
            sky.addColorStop(1, '#000000');
        } else {
            sky.addColorStop(0, '#16213e');
            sky.addColorStop(0.6, '#0a0a0a');
            sky.addColorStop(1, '#0a0a0a');
        }
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
        
        // --- DRAW MOON ---
        ctx.save();
        if (isSpecial) {
            const pulse = Math.sin(Date.now() / 150);
            const glowRadius = 50 + pulse * 4;
            
            // Grand crimson ambient flaring halo
            const ambientGlow = ctx.createRadialGradient(
                C.CANVAS_WIDTH - 150, 100, 10,
                C.CANVAS_WIDTH - 150, 100, glowRadius * 2.5
            );
            ambientGlow.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
            ambientGlow.addColorStop(0.4, 'rgba(153, 27, 27, 0.15)');
            ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = ambientGlow;
            ctx.beginPath();
            ctx.arc(C.CANVAS_WIDTH - 150, 100, glowRadius * 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Blood moon shadow/glow
            ctx.shadowColor = '#dc2626';
            ctx.shadowBlur = 24 + pulse * 8;
            
            // Blood moon core (light rose/pink-orange)
            ctx.fillStyle = '#fca5a5';
            ctx.beginPath();
            ctx.arc(C.CANVAS_WIDTH - 150, 100, 50, 0, Math.PI * 2);
            ctx.fill();
            
            // Fine-art craters in deep crimson
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#991b1b';
            ctx.beginPath();
            ctx.arc(C.CANVAS_WIDTH - 170, 85, 7, 0, Math.PI * 2);
            ctx.arc(C.CANVAS_WIDTH - 135, 115, 11, 0, Math.PI * 2);
            ctx.arc(C.CANVAS_WIDTH - 145, 80, 5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Standard crisp silver-blue moon
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 15;
            ctx.fillStyle = 'rgba(220, 220, 240, 0.95)';
            ctx.beginPath();
            ctx.arc(C.CANVAS_WIDTH - 150, 100, 50, 0, Math.PI * 2);
            ctx.fill();
            
            // Craters in dark gray-blue shadow
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(180, 190, 210, 0.4)';
            ctx.beginPath();
            ctx.arc(C.CANVAS_WIDTH - 170, 85, 8, 0, Math.PI * 2);
            ctx.arc(C.CANVAS_WIDTH - 135, 115, 11, 0, Math.PI * 2);
            ctx.arc(C.CANVAS_WIDTH - 145, 80, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // --- DRAW城市SKYLINE ---
        const skylineColor = isSpecial ? '#150308' : '#1a1a2e';
        
        // Distant Mountains layer (Very slow parallax)
        ctx.fillStyle = isSpecial ? '#1c030a' : '#131320';
        for (let i = 0; i < 15; i++) {
            const parallaxX = (i * 200 - camera.x * 0.05);
            const screenX = ((parallaxX % (C.WORLD_WIDTH + 400)) + (C.WORLD_WIDTH + 400)) % (C.WORLD_WIDTH + 400) - 200;
            const height = 80 + Math.sin(i * 1.5) * 50;
            ctx.fillRect(screenX, C.CANVAS_HEIGHT - height - 100, 200, height + 100);
        }

        // City skyline layer
        ctx.fillStyle = skylineColor;
        for (let i = 0; i < 30; i++) {
            const parallaxX = (i * 100 - camera.x * 0.2);
            const screenX = ((parallaxX % (C.WORLD_WIDTH + 200)) + (C.WORLD_WIDTH + 200)) % (C.WORLD_WIDTH + 200) - 100;
            const height = 150 + Math.sin(i * 0.5) * 80;
            const width = 80 + Math.cos(i * 0.9) * 30;
            ctx.fillRect(screenX, C.CANVAS_HEIGHT - height, width, height);
            
            // Add tiny, intermittent warm window lights for the city
            if (Math.sin(i * 0.5 + Date.now() / 1000) > 0.8) {
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(screenX + width * 0.3, C.CANVAS_HEIGHT - height + 20, 5, 5);
                ctx.fillStyle = skylineColor;
            }
        }
    }

    // Overlay scrolling mist/fog on top of the background to enrich the atmosphere
    const time = Date.now();
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    
    // Draw 2 layers of soft drifting gothic city mist at different parallax factors and speeds
    const fogWidth = 800;
    
    // Mist layer 1 (Slow, distant)
    const fogX1 = -(camera.x * 0.12 + (time / 140)) % fogWidth;
    ctx.fillStyle = 'rgba(94, 109, 132, 0.08)';
    ctx.fillRect(fogX1, C.CANVAS_HEIGHT - 220, fogWidth, 160);
    ctx.fillRect(fogX1 + fogWidth, C.CANVAS_HEIGHT - 220, fogWidth, 160);

    // Mist layer 2 (Slightly faster, closer)
    const fogX2 = -(camera.x * 0.22 + (time / 85)) % fogWidth;
    ctx.fillStyle = 'rgba(71, 85, 105, 0.06)';
    ctx.fillRect(fogX2, C.CANVAS_HEIGHT - 160, fogWidth, 140);
    ctx.fillRect(fogX2 + fogWidth, C.CANVAS_HEIGHT - 160, fogWidth, 140);
    
    ctx.restore();
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

export const drawHazards = (ctx: CanvasRenderingContext2D, hazards: Hazard[]) => {
    hazards.forEach(hazard => {
        if (hazard.type === 'spikes') {
            ctx.fillStyle = '#b8b8b8'; // Light gray for spikes
            const spikeWidth = 10;
            const spikeHeight = 10;
            const numSpikes = Math.floor(hazard.width / spikeWidth);
            for (let i = 0; i < numSpikes; i++) {
                ctx.beginPath();
                ctx.moveTo(hazard.x + i * spikeWidth, hazard.y + spikeHeight);
                ctx.lineTo(hazard.x + (i + 0.5) * spikeWidth, hazard.y);
                ctx.lineTo(hazard.x + (i + 1) * spikeWidth, hazard.y + spikeHeight);
                ctx.closePath();
                ctx.fill();
            }
        }
    });
};

export const drawEnemies = (ctx: CanvasRenderingContext2D, enemies: Enemy[]) => {
    enemies.forEach(enemy => {
        ctx.save();
        ctx.translate(enemy.x + enemy.width / 2, enemy.y);
        if (enemy.direction === -1) {
            ctx.scale(-1, 1);
        }

        if (enemy.type === 'enforcer') {
            const coatColor = '#1e293b'; // deeper night-sky blue-gray
            const darkCoatColor = '#0f172a';
            const vestColor = '#7f1d1d'; // velvet crimson
            const skinColor = '#f1f5f9';
            const hairColor = '#0f172a';
            const eyeColor = '#ef4444';
            const pantsColor = '#334155';
            const darkPantsColor = '#1e293b';
            const bootColor = '#0f172a';
            const shirtColor = '#ffffff';

            const isMoving = (enemy.isAggro || enemy.patrolRange) && enemy.onGround && enemy.attackPattern !== 'tell' && enemy.attackPattern !== 'meleeSlash';
            const step = Date.now() / 150;
            const bob = isMoving ? Math.sin(step) * 2 : 0;
            ctx.translate(0, bob);

            const headY = 4;
            const torsoY = headY + 12;
            const bodyWidth = enemy.width / 2;
            const legTopY = torsoY + 20;
            const legHeight = 14;
            const bootHeight = 4;
            const legWidth = bodyWidth / 2 - 1;

            // Leg movement swing
            const legOffset = isMoving ? Math.sin(step) * 5 : 0;

            // --- REAR LEG (drawn first for layering depth) ---
            ctx.fillStyle = darkPantsColor;
            ctx.fillRect(-bodyWidth / 2 + legOffset, legTopY, legWidth, legHeight);
            ctx.fillStyle = bootColor;
            ctx.fillRect(-bodyWidth / 2 + legOffset, legTopY + legHeight, legWidth, bootHeight);

            // --- COAT TAILS (Drawn behind the body with motion flares) ---
            ctx.fillStyle = coatColor;
            const coatFlare = isMoving ? Math.sin(step) * 6 - 4 : -2;
            ctx.beginPath();
            ctx.moveTo(-enemy.width / 2 + 2, torsoY + 22);
            ctx.quadraticCurveTo(-enemy.width / 2 + coatFlare - 8, torsoY + 28, -enemy.width / 2 + coatFlare - 6, torsoY + 38);
            ctx.lineTo(-2, torsoY + 28);
            ctx.closePath();
            ctx.fill();

            // --- TORSO & INNER ARMENTS ---
            // Rear/Back Arm (bobbing swing)
            const armBob = isMoving ? Math.sin(step + Math.PI / 2) * 4 : 0;
            ctx.fillStyle = darkCoatColor;
            ctx.fillRect(3, torsoY + 2 + armBob, 6, 18);

            // Double Layer Trench Coat
            ctx.fillStyle = coatColor;
            ctx.fillRect(-enemy.width / 2, torsoY, enemy.width, 28);

            // Collar sways as user moves
            ctx.fillStyle = coatColor;
            ctx.beginPath();
            ctx.moveTo(-enemy.width / 2, torsoY);
            ctx.lineTo(-enemy.width / 2 + 4, torsoY - 8);
            ctx.lineTo(-2, torsoY + 2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(enemy.width / 2, torsoY);
            ctx.lineTo(enemy.width / 2 - 4, torsoY - 8);
            ctx.lineTo(2, torsoY + 2);
            ctx.closePath();
            ctx.fill();

            // Velvet Vest
            ctx.fillStyle = vestColor;
            ctx.fillRect(-bodyWidth / 2, torsoY + 2, bodyWidth, 20);

            // Clean crisp inner shirt
            ctx.fillStyle = shirtColor;
            ctx.beginPath();
            ctx.moveTo(0, torsoY + 2);
            ctx.lineTo(-4, torsoY + 8);
            ctx.lineTo(4, torsoY + 8);
            ctx.closePath();
            ctx.fill();

            // --- FOREGROUND LEG ---
            ctx.fillStyle = pantsColor;
            ctx.fillRect(1 - legOffset, legTopY, legWidth, legHeight);
            ctx.fillStyle = bootColor;
            ctx.fillRect(1 - legOffset, legTopY + legHeight, legWidth, bootHeight);

            // Head & Flowing Hair
            ctx.fillStyle = skinColor;
            ctx.fillRect(-5, headY, 10, 10);
            ctx.fillRect(5, headY + 3, 2, 4); // nose profile

            // Hair blowing back dramatically during motion
            ctx.fillStyle = hairColor;
            const hairSway = isMoving ? Math.sin(step) * 2 : 0;
            ctx.fillRect(-7 - hairSway, headY - 3, 13, 6); // hair top
            ctx.fillRect(-7 - hairSway, headY + 2, 4, 10); // long hair back lock

            // Crystalline Red Visor Eyes
            ctx.fillStyle = eyeColor;
            ctx.fillRect(1, headY + 3, 3, 2);

            // --- FRONT ARM & WEAPON SWING ANIMATION ---
            const swordHilt = '#f59e0b', swordBlade = '#f1f5f9';
            if (enemy.attackPattern === 'tell' || enemy.attackPattern === 'meleeSlash') {
                ctx.save();
                if (enemy.attackPattern === 'tell') {
                    // Holding weapon back
                    ctx.rotate(-0.5);
                    ctx.fillStyle = hairColor; // glove
                    ctx.fillRect(2, torsoY + 4, 8, 8);
                    
                    ctx.fillStyle = swordHilt;
                    ctx.fillRect(10, torsoY, 4, 14); // Crossguard
                    ctx.fillStyle = swordBlade;
                    ctx.fillRect(12, torsoY - 24, 3, 24); // Extended blade
                } else {
                    // Slashing forwards with a glorious sweep
                    ctx.rotate(0.3);
                    ctx.fillStyle = hairColor;
                    ctx.fillRect(10, torsoY + 2, 8, 8);
                    ctx.fillStyle = swordHilt;
                    ctx.fillRect(18, torsoY - 2, 4, 14);
                    ctx.fillStyle = '#67e8f9'; // Enchanted cyan blade
                    ctx.fillRect(22, torsoY + 3, 32, 4);

                    // Translucent Slash Trail Arc
                    const grad = ctx.createRadialGradient(0, enemy.height / 2, 20, 0, enemy.height / 2, 55);
                    grad.addColorStop(0, 'rgba(34, 211, 238, 0.4)');
                    grad.addColorStop(0.8, 'rgba(103, 232, 249, 0.2)');
                    grad.addColorStop(1, 'rgba(103, 232, 249, 0)');
                    ctx.fillStyle = grad;
                    ctx.beginPath();
                    ctx.arc(0, enemy.height / 2 - 10, 48, -0.4, 0.5, false);
                    ctx.lineTo(0, enemy.height / 2);
                    ctx.closePath();
                    ctx.fill();
                }
                ctx.restore();
            } else {
                // Casual dangling front arm (swinging)
                ctx.fillStyle = coatColor;
                ctx.fillRect(-3, torsoY + 2 - armBob, 6, 18);

                // Sheathed rapier hilt at the waist
                const hiltX = -enemy.width / 2 + 1;
                const hiltY = 20;
                ctx.fillStyle = swordHilt;
                ctx.fillRect(hiltX - 2, hiltY, 6, 2); // Guard
                ctx.fillRect(hiltX, hiltY - 10, 3, 10); // Pommel
            }
        } else if (enemy.type === 'seeker') {
            const bodyColor = '#334155'; // Dark slate metallic
            const wingColor = '#1e293b'; // Onyx wings
            const eyeColor = '#f43f5e'; // Sinister glowing rose

            // Crystalline Hover Floating
            const bob = Math.sin(Date.now() / 180 + enemy.id) * 5;
            ctx.translate(0, bob);

            const wingFlap = Math.sin(Date.now() / 110 + enemy.id);
            const secondaryFlap = Math.cos(Date.now() / 130 + enemy.id);

            // Double Back wings
            ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
            ctx.beginPath();
            ctx.moveTo(0, enemy.height * 0.3);
            ctx.quadraticCurveTo(-enemy.width * 1.1, -12 + secondaryFlap * 15, -enemy.width * 1.6, enemy.height * 0.1);
            ctx.quadraticCurveTo(-enemy.width * 0.6, enemy.height * 0.9, 0, enemy.height * 0.7);
            ctx.closePath();
            ctx.fill();

            // Main Primary Front wings
            ctx.fillStyle = wingColor;
            ctx.beginPath();
            ctx.moveTo(0, enemy.height * 0.25);
            ctx.quadraticCurveTo(-enemy.width * 0.9, -15 + wingFlap * 22, -enemy.width * 1.8, enemy.height * 0.2);
            ctx.quadraticCurveTo(-enemy.width * 0.8, enemy.height * 0.9, 0, enemy.height * 0.85);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(0, enemy.height * 0.25);
            ctx.quadraticCurveTo(enemy.width * 0.9, -15 + wingFlap * 22, enemy.width * 1.8, enemy.height * 0.2);
            ctx.quadraticCurveTo(enemy.width * 0.8, enemy.height * 0.9, 0, enemy.height * 0.85);
            ctx.closePath();
            ctx.fill();

            // Glowing reactor underbelly core (Engine logic)
            const corePulse = 0.7 + Math.sin(Date.now() / 100) * 0.3;
            ctx.fillStyle = `rgba(244, 63, 94, ${0.35 * corePulse})`;
            ctx.beginPath();
            ctx.arc(0, enemy.height * 0.6, 12 + corePulse * 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fda4af';
            ctx.beginPath();
            ctx.arc(0, enemy.height * 0.6, 4, 0, Math.PI * 2);
            ctx.fill();

            // Metallic segmented mechanical body structure
            ctx.fillStyle = bodyColor;
            ctx.beginPath();
            ctx.ellipse(0, enemy.height / 2, enemy.width / 3, enemy.height / 2.2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Outer steel reinforcing plates
            ctx.fillStyle = '#475569';
            ctx.fillRect(-enemy.width / 4, enemy.height * 0.35, enemy.width / 2, 3);
            ctx.fillRect(-enemy.width / 5, enemy.height * 0.48, enemy.width / 2.5, 3);

            // Reinforced head shell
            ctx.beginPath();
            ctx.arc(0, enemy.height * 0.2, enemy.width / 3.8, 0, Math.PI * 2);
            ctx.fill();

            // Pulsating ruby radar eyes
            const eyePulse = Math.sin(Date.now() / 120) * 1.5;
            ctx.fillStyle = eyeColor;
            ctx.beginPath();
            ctx.arc(-5, enemy.height * 0.18, 2.5 + eyePulse * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(5, enemy.height * 0.18, 2.5 + eyePulse * 0.5, 0, Math.PI * 2);
            ctx.fill();

        } else if (enemy.type === 'specter') {
            let baseOpacity = 0.75;
            if (enemy.teleportState === 'fadingOut' || enemy.teleportState === 'fadingIn') {
                const timer = enemy.attackPhaseTimer || 0;
                baseOpacity = (enemy.teleportState === 'fadingOut') ? (timer / 30) * 0.75 : (1 - timer / 30) * 0.75;
            }
            if (enemy.teleportState === 'idle') {
                baseOpacity = 0;
            }
            ctx.globalAlpha = baseOpacity;

            // Hovering spectral float
            const floatBob = Math.sin(Date.now() / 250 + enemy.id) * 6;
            ctx.translate(0, floatBob);

            const cloakColor = '#3ea6a6'; // haunted dark-teal ectoplasm
            const darkCloak = '#1d4f4f';
            const hoodAccent = '#0d2d2d';
            const scytheHandle = '#3e2723', scytheBlade = '#cbd5e0';

            // Shadow head void under the cowl
            ctx.fillStyle = '#020617';
            ctx.beginPath();
            ctx.arc(0, 4, 10, 0, Math.PI * 2);
            ctx.fill();

            // Glowing piercing phantom eyes (slits)
            ctx.fillStyle = '#e9d5ff'; // glowing amethyst
            ctx.font = '7px sans-serif';
            ctx.fillText('•', -5, 6);
            ctx.fillText('•', 3, 6);

            // Flowing tattered spectral shroud
            ctx.fillStyle = cloakColor;
            ctx.beginPath();
            ctx.moveTo(-4, -4); // Top point of hood
            ctx.quadraticCurveTo(0, -9, 4, -4); // Rounded hood
            ctx.lineTo(enemy.width / 2, 8); // Shoulder right
            ctx.lineTo(enemy.width / 2 - 2, enemy.height - 15); // Side right

            // Dynamic waving tendril loops at the bottom margin
            const tStep = Date.now() / 140;
            for (let idx = 5; idx >= 0; idx--) {
                const tx = -enemy.width / 2 + (enemy.width / 5) * idx;
                const ty = enemy.height - 3 + Math.sin(tStep + idx * 1.3) * 6;
                ctx.lineTo(tx, ty);
            }
            ctx.lineTo(-enemy.width / 2 + 2, enemy.height - 15); // Side left
            ctx.closePath();
            ctx.fill();

            // Shading of Hood
            ctx.fillStyle = darkCloak;
            ctx.beginPath();
            ctx.moveTo(0, -7);
            ctx.lineTo(-enemy.width/2 + 4, 4);
            ctx.lineTo(0, 10);
            ctx.lineTo(enemy.width/2 - 4, 4);
            ctx.closePath();
            ctx.fill();

            // Dark inner cowl shroud void
            ctx.fillStyle = hoodAccent;
            ctx.beginPath();
            ctx.ellipse(0, 4, 5, 8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Reaper Scythe swinging
            if (enemy.teleportState === 'attacking') {
                const swingProgress = 1 - (enemy.attackPhaseTimer || 0) / 40;
                ctx.save();
                ctx.rotate(swingProgress * Math.PI * 1.1 - 0.5);
                
                // Wooden crooked shaft
                ctx.fillStyle = scytheHandle;
                ctx.fillRect(4, -15, 3, 44);
                
                // Massive spectral blade
                ctx.fillStyle = scytheBlade;
                ctx.beginPath();
                ctx.moveTo(4, -15);
                ctx.quadraticCurveTo(34, -28, 42, 4);
                ctx.quadraticCurveTo(24, -10, 4, -11);
                ctx.closePath();
                ctx.fill();
                
                // Enchanted amethyst gleam line on blade edge
                ctx.strokeStyle = '#c084fc';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(4, -15);
                ctx.quadraticCurveTo(34, -28, 42, 4);
                ctx.stroke();

                ctx.restore();

                // Sweep Crescent Haze Trail
                ctx.strokeStyle = `rgba(192, 132, 252, ${0.4 * (1 - swingProgress)})`;
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(0, enemy.height / 2, 50, -Math.PI / 4, Math.PI * 0.7);
                ctx.stroke();
            } else {
                // Passive sheathed back-mount of the scythe
                ctx.save();
                ctx.rotate(0.6);
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(-12, -18, 2, 38);
                ctx.fillStyle = '#94a3b8';
                ctx.beginPath();
                ctx.moveTo(-12, -18);
                ctx.quadraticCurveTo(-28, -25, -30, -10);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }

        } else if (enemy.type === 'gargoyle') {
            const stoneColor = '#64748b'; // Cold slate gray
            const darkStone = '#334155'; // Dark blue-cement shadow
            const runeGlow = '#f43f5e'; // Ancient volcanic magma glow

            // Heavy stone breathing sway
            const breathe = Math.sin(Date.now() / 300) * 1.25;
            ctx.translate(0, breathe);

            // Wing animation cycle based on state
            const isAggressive = !!enemy.isAggro;
            const flap = isAggressive ? Math.sin(Date.now() / 140) * 0.4 : Math.sin(Date.now() / 400) * 0.1;

            // --- STONE WINGS ---
            ctx.fillStyle = darkStone;
            if (isAggressive) {
                // Wings fully spread and ready to strike or spit!
                ctx.beginPath();
                ctx.moveTo(-enemy.width / 2 + 6, 12);
                ctx.lineTo(-enemy.width * (1.3 + flap), -8 - flap * 12); // joint tip
                ctx.lineTo(-enemy.width * 1.5, 12); // blade bottom
                ctx.lineTo(-enemy.width / 2 + 2, 26);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(enemy.width / 2 - 6, 12);
                ctx.lineTo(enemy.width * (1.3 + flap), -8 - flap * 12); // joint tip
                ctx.lineTo(enemy.width * 1.5, 12); // blade bottom
                ctx.lineTo(enemy.width / 2 - 2, 26);
                ctx.closePath();
                ctx.fill();
            } else {
                // Wings folded tightly, preserving its core
                ctx.fillRect(-enemy.width / 2 - 4, 8, 4, enemy.height - 18);
                ctx.fillRect(enemy.width / 2, 8, 4, enemy.height - 18);
            }

            // --- TAIL ---
            ctx.fillStyle = darkStone;
            const tailAngle = Math.sin(Date.now() / 150) * 12;
            ctx.save();
            ctx.translate(0, enemy.height - 6);
            ctx.rotate(tailAngle * Math.PI / 180);
            ctx.fillRect(-2, 0, 4, 12);
            ctx.fillRect(-3, 10, 6, 4); // stone tail barb
            ctx.restore();

            // Broad rocky torso chest plate
            ctx.fillStyle = stoneColor;
            ctx.fillRect(-enemy.width / 2, 10, enemy.width, enemy.height - 10);

            // Granite structural chest plate details (Cracked highlights)
            ctx.fillStyle = darkStone;
            ctx.fillRect(-enemy.width / 2 + 3, 12, enemy.width - 6, 4);

            // Lava / magma veins (glowing runes) on the stone casing
            ctx.strokeStyle = isAggressive ? `rgba(244, 63, 94, ${0.45 + Math.sin(Date.now() / 100) * 0.35})` : 'rgba(71, 85, 105, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-6, 15);
            ctx.lineTo(-2, 23);
            ctx.lineTo(4, 19);
            ctx.lineTo(1, 29);
            ctx.stroke();

            // Structured horned gargoyle head
            ctx.fillStyle = stoneColor;
            ctx.fillRect(-enemy.width / 2 + 5, 0, enemy.width - 10, 14);

            // Horns (carved granite structure)
            ctx.fillStyle = darkStone;
            ctx.beginPath();
            ctx.moveTo(-enemy.width / 2 + 6, 0);
            ctx.lineTo(-enemy.width / 2 + 2, -10);
            ctx.lineTo(-2, 2);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(enemy.width / 2 - 6, 0);
            ctx.lineTo(enemy.width / 2 - 2, -10);
            ctx.lineTo(2, 2);
            ctx.closePath();
            ctx.fill();

            // Glowing volcanic gem eyes
            if (isAggressive) {
                let eyeGlow = 0;
                if (enemy.attackPattern === 'tell' || enemy.attackPattern === 'spit') {
                    const timer = enemy.attackPhaseTimer || 0;
                    eyeGlow = Math.min(1.2, 1.2 - (timer / 30));
                }
                ctx.fillStyle = `rgba(244, 63, 94, ${0.45 + eyeGlow * 0.55})`;
                ctx.beginPath();
                ctx.arc(-4, 6, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(4, 6, 3, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = '#475565';
                ctx.fillRect(-4, 5, 2, 2);
                ctx.fillRect(2, 5, 2, 2);
            }

        } else if (enemy.type === 'boss') {
            const paleSkin = '#e2e8f0';
            const bodyColor = '#1e1b4b'; // Royal vampire indigo-black
            const capeColor = '#7f1d1d'; // Crimson velvet
            const eyeColor = '#ef4444'; // Glowing fiery blood ruby

            // Sinister breathing floating bob
            const bob = Math.sin(Date.now() / 250) * 3;
            ctx.translate(0, bob);

            // Cape wrapping and billowing
            ctx.fillStyle = capeColor;
            const capeBillow = Math.sin(Date.now() / 150) * 5;
            
            ctx.beginPath();
            ctx.moveTo(0, 10);
            ctx.quadraticCurveTo(-enemy.width * 0.6, enemy.height / 2, -enemy.width * 0.7 - capeBillow, enemy.height + 6);
            ctx.lineTo(enemy.width * 0.5, enemy.height + 6);
            ctx.closePath();
            ctx.fill();

            // Majestic High-Standing Cape Collar
            ctx.fillStyle = '#4c0519'; // extremely deep crimson
            ctx.beginPath();
            ctx.moveTo(-enemy.width * 0.45, 10);
            ctx.lineTo(-enemy.width * 0.5, -4);
            ctx.lineTo(0, 8);
            ctx.lineTo(enemy.width * 0.5, -4);
            ctx.lineTo(enemy.width * 0.45, 10);
            ctx.closePath();
            ctx.fill();

            // Solid Vampire Royal Body Garments
            ctx.fillStyle = bodyColor;
            ctx.fillRect(-enemy.width * 0.3, 10, enemy.width * 0.6, enemy.height - 10);

            // Double Brested Royal Sashes and gold trim detailing
            ctx.fillStyle = '#eab308'; // royal gold
            ctx.fillRect(-enemy.width * 0.25, 15, 2, 15);
            ctx.fillRect(enemy.width * 0.25 - 2, 15, 2, 15);
            ctx.fillRect(-enemy.width * 0.2, 18, enemy.width * 0.4, 1.5);
            ctx.fillRect(-enemy.width * 0.2, 24, enemy.width * 0.4, 1.5);
            
            // Pale Vampire Lord Head Specimen
            ctx.fillStyle = paleSkin;
            ctx.fillRect(-12, -2, 24, 22);
            
            // Fangs
            ctx.fillStyle = 'white';
            ctx.fillRect(-6, 12, 3, 5); ctx.fillRect(3, 12, 3, 5);
            
            // Eyes
            ctx.fillStyle = eyeColor;
            const lordEyeSize = 1.3 + Math.sin(Date.now() / 100) * 0.3;
            ctx.fillRect(-8, 5, 5, 3); ctx.fillRect(3, 5, 5, 3);
            
            // Crown/Tiara of the Damned
            ctx.fillStyle = '#94a3b8'; // ancient steel
            ctx.beginPath();
            ctx.moveTo(-10, -2); ctx.lineTo(-12, -6); ctx.lineTo(-6, -4);
            ctx.lineTo(0, -9); ctx.lineTo(6, -4); ctx.lineTo(12, -6); ctx.lineTo(10, -2);
            ctx.closePath();
            ctx.fill();
        } else if (enemy.type === 'crate') {
            const w = enemy.width;
            const h = enemy.height;
            
            // Base wooden plank color
            ctx.fillStyle = '#8d5b4c'; // warm brown
            ctx.fillRect(-w/2, 0, w, h);
            
            // Darker shadow crevices
            ctx.fillStyle = '#5d382e'; // dark chocolate wood
            ctx.fillRect(-w/2, 0, w, 4); // top border
            ctx.fillRect(-w/2, h - 4, w, 4); // bottom border
            ctx.fillRect(-w/2, 0, 4, h); // left border
            ctx.fillRect(w/2 - 4, 0, 4, h); // right border
            
            // Diagonal brace for a classic gothic container look
            ctx.save();
            ctx.translate(-w/2, 0);
            ctx.strokeStyle = '#5d382e';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(3, 3);
            ctx.lineTo(w - 3, h - 3);
            ctx.stroke();
            ctx.restore();
            
            // Highlight grooves
            ctx.fillStyle = '#b78274'; // lighter wood grain highlight
            ctx.fillRect(-w/2 + 4, 4, w - 8, 2);
            ctx.fillRect(-w/2 + 4, 4, 2, h - 8);
            
            // Heavy iron corner reinforcements
            ctx.fillStyle = '#4b5563'; // metal armor corners
            ctx.fillRect(-w/2, 0, 6, 6);
            ctx.fillRect(w/2 - 6, 0, 6, 6);
            ctx.fillRect(-w/2, h - 6, 6, 6);
            ctx.fillRect(w/2 - 6, h - 6, 6, 6);

        } else if (enemy.type === 'urn') {
            const w = enemy.width;
            const h = enemy.height;
            
            // Vase clay body
            const potColor = '#9a3412'; // terracotta
            const shadowColor = '#431407'; // deep rust
            const goldAccent = '#facc15'; // golden glowing glyph
            
            ctx.fillStyle = potColor;
            
            // Neck of the urn
            ctx.beginPath();
            ctx.ellipse(0, 4, w * 0.3, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(-w * 0.25, 4, w * 0.5, h * 0.2);
            
            // Urn round belly
            ctx.beginPath();
            ctx.arc(0, h * 0.55, w * 0.45, 0, Math.PI * 2);
            ctx.fill();
            
            // Clay shadow crevices
            ctx.fillStyle = shadowColor;
            ctx.fillRect(-w * 0.15, 4, w * 0.3, 2);
            ctx.beginPath();
            ctx.arc(-w * 0.15, h * 0.6, 2.5, 0, Math.PI * 2);
            ctx.arc(w * 0.15, h * 0.65, 3.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Glowing golden glyph on the pottery center
            ctx.fillStyle = goldAccent;
            ctx.shadowColor = goldAccent;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, h * 0.55, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0; // turn off
        }
        
        ctx.restore(); // Restore from direction scale

        // Stagger effect
        if (enemy.staggerTimer && enemy.staggerTimer > 0) {
            const staggerX = enemy.x + enemy.width / 2;
            const staggerY = enemy.y - 10;
            const angle = (Date.now() / 100) % (Math.PI * 2);
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#f0e68c'; // Khaki color for stars
            for (let i = 0; i < 3; i++) {
                const starAngle = angle + (i * Math.PI * 2 / 3);
                const x = staggerX + Math.cos(starAngle) * 10;
                const y = staggerY + Math.sin(starAngle) * 4;
                ctx.fillText('*', x, y);
            }
        }
        
        if (enemy.hitTimer > 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }

        const isTelling = (enemy.type === 'enforcer' && enemy.attackPattern === 'tell') || (enemy.type === 'boss' && (enemy.attackPhaseTimer ?? 0) > 0);
        if (isTelling) {
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
    const { x, y, width, height, facing, animation, invincibilityTimer, isWerewolf, chargeTimer, isDashing, dashTrail, velocityY, isWallSliding } = player;

    ctx.save();

    // Werewolf Aura
    if (isWerewolf) {
        ctx.beginPath();
        ctx.arc(x + width / 2, y + height / 2, width * 0.9, 0, Math.PI * 2);
        const aura = ctx.createRadialGradient(x + width / 2, y + height / 2, width * 0.3, x + width / 2, y + height / 2, width * 0.9);
        aura.addColorStop(0, 'rgba(192, 132, 252, 0.15)');
        aura.addColorStop(1, 'rgba(192, 132, 252, 0)');
        ctx.fillStyle = aura;
        ctx.fill();
    }

    // Draw Spectral Attack Trail (Motion Blur)
    if (player.attackTrail && player.attackTrail.length > 0) {
        player.attackTrail.forEach((trailPart, index) => {
            // Skip the current position frame to keep trail clean
            if (index === 0 && player.attacking) return;
            
            ctx.save();
            // Beautiful fading opacity for soft ghosting
            const opacity = 0.25 * (1 - (index / player.attackTrail!.length));
            ctx.globalAlpha = opacity;
            ctx.translate(trailPart.x + width / 2, trailPart.y);
            if (trailPart.facing === -1) ctx.scale(-1, 1);
            
            // Choose colors based on form: amethyst purple for werewolf, clean teal for sword/dagger form
            const glowColor = isWerewolf ? '#c084fc' : '#22d3ee';
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 8;
            
            const torsoTop = 14; // headSize + neckH = 12 + 2 = 14
            
            // Render trailing silhouettes based on whether it is a claw swipe or a sword thrust
            if (trailPart.state === 'clawAttack') {
                // Draw 3 sweeping glowing claw strokes
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(18, torsoTop + 2 + i * 4);
                    ctx.quadraticCurveTo(35, torsoTop + 10 + (i-1)*5, 52, torsoTop - 5 + i*8);
                    ctx.stroke();
                }
            } else if (trailPart.state === 'attack') {
                // Draw sword/dagger forward energy trailing crescent
                const frame = trailPart.frameIndex;
                if (frame === 1 || frame === 2) {
                    ctx.fillStyle = isWerewolf ? 'rgba(192, 132, 252, 0.25)' : 'rgba(34, 211, 238, 0.25)';
                    ctx.beginPath();
                    ctx.arc(36, torsoTop + 8, 14, -Math.PI / 3, Math.PI / 3, false);
                    ctx.lineTo(26, torsoTop + 8);
                    ctx.closePath();
                    ctx.fill();
                    
                    // Fine line highlight
                    ctx.beginPath();
                    ctx.arc(36, torsoTop + 8, 14, -Math.PI / 3, Math.PI / 3, false);
                    ctx.stroke();
                }
            }
            
            ctx.restore();
        });
    }

    // Draw Dash Trail
    if (dashTrail.length > 0) {
        dashTrail.forEach((trailPart, index) => {
            ctx.save();
            const opacity = 0.35 * (1 - (index / dashTrail.length));
            ctx.globalAlpha = opacity;
            ctx.translate(trailPart.x + width / 2, trailPart.y);
            if (trailPart.facing === -1) ctx.scale(-1, 1);
            
            // Draw holographic ghost silhouette of Tessa/Werewolf with an aura outline
            const glowColor = isWerewolf ? '#a855f7' : '#22d3ee';
            
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 8;
            
            // Draw head
            ctx.fillStyle = isWerewolf ? '#581c87' : '#0f766e';
            ctx.fillRect(-6, 0, 12, 12);
            
            // Draw long dramatic hair
            ctx.fillStyle = isWerewolf ? '#3b0764' : '#1e293b';
            ctx.fillRect(-8, 0, 4, 24);
            
            // Draw tunic/torso
            ctx.fillStyle = isWerewolf ? '#4f46e5' : '#0d9488';
            ctx.fillRect(-width / 4, 14, width / 2, 18);
            
            // Draw legs
            ctx.fillStyle = isWerewolf ? '#1e1b4b' : '#312e81';
            ctx.fillRect(-5, 32, 4, 8);
            ctx.fillRect(1, 32, 4, 8);
            
            // Fine outlines for cybernetic retro precision
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(-width / 4, 14, width / 2, 18);
            ctx.strokeRect(-6, 0, 12, 12);
            
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
    
    // --- Animation Definitions ---
    
    const headSize = 12, neckH = 2, torsoH = 18, armW = 6, legW = 8, feetH = 4;
    const hair = isWerewolf ? '#4a4a4a' : '#3E2723', skin = isWerewolf ? '#a1887f' : '#f0d9b5', tunic = isWerewolf ? '#424242' : '#00695c', pants = isWerewolf ? '#333333' : '#4e342e', boots = isWerewolf ? '#212121' : '#3e2723', daggerBlade = '#e0e0e0', eyeColor = isWerewolf ? '#fdd835' : 'black';

    const werewolfClaws = (x_offset: number, y_offset: number) => {
        if (!isWerewolf) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x_offset, y_offset, 4, 2);
        ctx.fillRect(x_offset, y_offset + 4, 4, 2);
        ctx.fillRect(x_offset, y_offset + 8, 4, 2);
    };

    const drawHead = (bob = 0, angle = 0) => {
        const headY = bob;
        
        ctx.save();
        ctx.translate(0, headY);
        ctx.rotate(angle * Math.PI / 180);

        // --- HAIR (Behind Face) ---
        ctx.fillStyle = hair;
        // Hair volume (back)
        ctx.fillRect(-headSize / 2 - 2, -3, headSize + 2, headSize);
        // Long hair strand back
        ctx.fillRect(-headSize / 2 - 2, 0, 6, 25);
        
        // --- FACE ---
        ctx.fillStyle = skin;
        // Face shape 
        ctx.fillRect(-headSize / 2 + 3, 1, headSize - 6, headSize - 2);

        // --- HAIR (Front detail / Bangs) ---
        ctx.fillStyle = hair;
        // Bangs
        ctx.fillRect(-headSize / 2 + 2, 1, headSize - 4, 3);
        
        // Eye
        ctx.fillStyle = eyeColor; 
        ctx.fillRect(headSize / 2 - 4, 4, 2, 2);

        ctx.restore();
    };

    const drawTorso = (bob = 0) => {
        ctx.fillStyle = tunic;
        ctx.fillRect(-width / 4, headSize + neckH + bob, width / 2, torsoH);
    };
    
    const drawLegs = (x1: number, y1: number, x2: number, y2: number) => {
        const legH = height - (headSize + neckH + torsoH);
        ctx.fillStyle = pants; ctx.fillRect(x1 - legW/2, y1, legW, legH);
        ctx.fillStyle = boots; ctx.fillRect(x1 - legW/2, y1 + legH - feetH, legW, feetH);
        ctx.fillStyle = pants; ctx.fillRect(x2 - legW/2, y2, legW, legH);
        ctx.fillStyle = boots; ctx.fillRect(x2 - legW/2, y2 + legH - feetH, legW, feetH);
    };
    
    const drawArm = (x: number, y: number, length: number, angle: number, isBackArm = false) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.fillStyle = isBackArm ? (isWerewolf ? '#2d2d2d' : '#004d40') : tunic;
        ctx.fillRect(0, -armW / 2, length, armW);
        
        // Add a small hand at the end of the arm
        ctx.fillStyle = isBackArm ? (isWerewolf ? '#7c5a50' : '#cfb18c') : skin;
        ctx.fillRect(length, -armW / 2, 4, armW);

        werewolfClaws(length - 2, -armW);
        ctx.restore();
    };

    const torsoTop = headSize + neckH;
    const legTop = torsoTop + torsoH;

    const frame = animation.frameIndex;
    
    switch (animation.currentState) {
        case 'idle': {
            const tilt = Math.sin(frame / C.ANIMATION_FRAMES.idle * Math.PI * 2) * 2;
            const bob = Math.sin(frame / C.ANIMATION_FRAMES.idle * Math.PI * 2) * 1;
            
            // Draw background arm bobbing slightly
            const backArmAngle = 80 + Math.sin(frame / C.ANIMATION_FRAMES.idle * Math.PI * 2) * 4;
            drawArm(-width / 6, torsoTop + 4, 13, backArmAngle, true);
            
            drawTorso(bob);
            drawHead(bob, tilt);
            drawLegs(-legW/2, legTop, legW/2, legTop);
            
            // Draw foreground arm relaxed forward-down (no more zombie pose)
            const frontArmAngle = 55 + Math.sin(frame / C.ANIMATION_FRAMES.idle * Math.PI * 2) * 3;
            drawArm(0, torsoTop + 4, 14, frontArmAngle);
            break;
        }
        case 'run': {
            const bob = Math.abs(Math.sin(frame / C.ANIMATION_FRAMES.run * Math.PI)) * -2;
            const step = frame / C.ANIMATION_FRAMES.run;
            
            // Swing arms in opposition
            const backArmAngle = 50 + Math.sin(step * Math.PI * 2 + Math.PI) * 40;
            drawArm(-width / 6, torsoTop + 4, 16, backArmAngle, true);
            
            const legAngle = Math.sin(step * Math.PI * 2) * 6;  // Increased step
            const tilt = Math.sin(step * Math.PI * 2) * 5;
            
            drawTorso(bob);
            drawHead(bob, tilt);
            drawLegs(-legW/2 + legAngle, legTop, legW/2 - legAngle, legTop);
            
            const frontArmAngle = 50 + Math.sin(step * Math.PI * 2) * 40;
            drawArm(0, torsoTop + 4, 18, frontArmAngle);
            break;
        }
        case 'jump': {
            const isRising = velocityY < 0;
            const backArmAngle = isRising ? -40 : 35;
            drawArm(-width / 6, torsoTop + 4, 12, backArmAngle, true);
            
            drawTorso();
            drawHead();
            const legOffset = velocityY > 0 ? 4 : -2;
            drawLegs(-legW/2, legTop + legOffset, legW/2, legTop);
            
            const frontArmAngle = isRising ? 140 : 85;
            drawArm(0, torsoTop + 4, 13, frontArmAngle);
            break;
        }
        case 'attack': {
            // Braced stance for legs, slightly wider.
            drawLegs(-legW/2 - 2, legTop, legW/2 + 2, legTop); 
            
            // Define animation parameters per frame
            let armAngle = 0;
            let armLength = 15;
            let lunge = 0; // Forward body movement

            if (frame === 0) { // Wind up: pull back
                armAngle = 25;
                armLength = 12;
                lunge = -5;
            } else if (frame === 1) { // Thrust: extend forward
                armAngle = -5; // A slight downward angle
                armLength = 18;
                lunge = 8;
            } else if (frame === 2) { // Hold: keep extended
                armAngle = -5;
                armLength = 18;
                lunge = 8;
            } else { // Recover: back to neutral
                armAngle = 10;
                armLength = 15;
            }
            
            ctx.save();
            ctx.translate(lunge, 0); // Apply the lunge

            // Draw back arm held back for dynamic balancing weight
            drawArm(-width / 6, torsoTop + 4, 14, 135, true);

            // Draw torso and head after lunge so they move with it
            drawTorso();
            drawHead();

            // Draw the arm
            drawArm(0, torsoTop + 4, armLength, armAngle);
            
            // Draw the dagger blade during the thrust/hold frames
            if (frame === 1 || frame === 2) {
                ctx.save();
                
                // Calculate the position of the end of the arm
                const radAngle = armAngle * Math.PI / 180;
                const armPivotX = 0;
                const armPivotY = torsoTop + 4;
                const armEndX = armPivotX + Math.cos(radAngle) * armLength;
                const armEndY = armPivotY + Math.sin(radAngle) * armLength;
                
                // Move to the end of the arm to draw the dagger
                ctx.translate(armEndX, armEndY);
                ctx.rotate(radAngle);

                // Draw the dagger blade itself
                ctx.fillStyle = daggerBlade;
                ctx.fillRect(0, -2, 20, 4); // A 20px long blade
                
                ctx.restore();
            }

            ctx.restore(); // Restore from the lunge translate

            break;
        }
        case 'clawAttack': {
            let armAngle = 0;
            let lunge = 0;
            
            if (frame === 0) { armAngle = -60; lunge = -5; } // Wind up
            else if (frame === 1) { armAngle = 80; lunge = 15; } // Swipe
            else if (frame === 2) { armAngle = 50; lunge = 10; } // Follow through
            else { armAngle = -10; lunge = 0; } // Recover

            // Draw back arm swinging in opposite direction for dynamic shoulder action
            drawArm(-width / 6, torsoTop + 4, 16, -armAngle - 30, true);

            drawLegs(-legW/2 - lunge/2, legTop, legW/2 + lunge/2, legTop);
            
            ctx.save();
            ctx.translate(lunge, 0); // Lunge the whole body
            drawTorso();
            drawHead();
            drawArm(0, torsoTop + 4, 18, armAngle);

            if (frame === 1) {
                ctx.strokeStyle = `rgba(255, 255, 255, 0.9)`; ctx.lineWidth = 3;
                for (let i = 0; i < 3; i++) {
                    ctx.beginPath();
                    ctx.moveTo(18, torsoTop + 2 + i * 4);
                    ctx.quadraticCurveTo(35, torsoTop + 10 + (i-1)*5, 50, torsoTop - 5 + i*8);
                    ctx.stroke();
                }
            }
            ctx.restore();
            break;
        }
        case 'parry': {
            // Draw background arm defensive bracing
            drawArm(-width / 6, torsoTop + 4, 12, 100, true);

            drawTorso();
            drawHead();
            drawLegs(-legW/2 - 2, legTop, legW/2 + 2, legTop); // Braced stance
            
            // Arm holding dagger up
            ctx.save();
            ctx.translate(0, torsoTop + 4);
            const angle = frame === 0 ? -70 : -80; // slight movement
            ctx.rotate(angle * Math.PI / 180);
            
            // Arm
            ctx.fillStyle = tunic;
            ctx.fillRect(0, -armW / 2, 16, armW);
            
            // Dagger
            ctx.fillStyle = daggerBlade;
            ctx.fillRect(16, -2, 20, 4); // Blade
            ctx.fillStyle = '#8d6e63'; // Hilt
            ctx.fillRect(14, -3, 2, 6); // Guard
            ctx.restore();
            break;
        }
        case 'wallSlide': {
            // Background arm gripping the wall high up
            drawArm(-width / 4, torsoTop + 4, 14, -45, true);

            drawTorso();
            drawHead();
            // Legs bent against the wall
            drawLegs(-legW/2, legTop + 2, legW/2 + 2, legTop);
            
            // Foreground arm extended backward/downward to stabilize
            drawArm(0, torsoTop + 4, 14, 45);

            // Particle effect for sliding
            if (Math.random() > 0.7) {
                ctx.fillStyle = 'rgba(200, 200, 200, 0.8)';
                ctx.fillRect(width/2 - 2, 20 + Math.random() * 10, 2, 2);
            }
            break;
        }
        case 'dash': {
            const lean = 15;
            ctx.save();
            ctx.rotate(-lean * Math.PI / 180);
            ctx.translate(0, 5);
            
            // Draw background trailing arm stream-lined
            drawArm(-width / 6, torsoTop + 4, 15, 170, true);

            drawHead();
            drawTorso();
            drawLegs(-legW/2, legTop, legW/2 + 5, legTop);
            drawArm(0, torsoTop + 4, 16, 195); // Foreground arm trailing behind too
            ctx.restore();
            break;
        }
    }
    
    ctx.restore();
};

export const drawGoal = (ctx: CanvasRenderingContext2D, goal: Goal) => {
    const time = Date.now() / 300;

    // 1. Draw Gothic Stone Columns framing the portal
    ctx.fillStyle = '#334155'; // Slate gray buttresses
    ctx.fillRect(goal.x - 4, goal.y, 8, goal.height);
    ctx.fillRect(goal.x + goal.width - 4, goal.y, 8, goal.height);
    
    // Archway cap
    ctx.beginPath();
    ctx.moveTo(goal.x - 8, goal.y);
    ctx.quadraticCurveTo(goal.x + goal.width / 2, goal.y - 12, goal.x + goal.width + 8, goal.y);
    ctx.lineTo(goal.x + goal.width + 2, goal.y - 4);
    ctx.quadraticCurveTo(goal.x + goal.width / 2, goal.y - 18, goal.x - 2, goal.y - 4);
    ctx.closePath();
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    // 2. Neon Under-glow Portal Vortex
    const portalGradient = ctx.createLinearGradient(goal.x, goal.y, goal.x, goal.y + goal.height);
    portalGradient.addColorStop(0, '#c084fc'); // Amethyst purple
    portalGradient.addColorStop(0.5, '#22d3ee'); // Cyber cyan
    portalGradient.addColorStop(1, '#0e7490'); // Oceanic deep teal
    ctx.fillStyle = portalGradient;
    
    const pulseFactor = 0.75 + Math.sin(time * 1.5) * 0.15;
    ctx.save();
    ctx.globalAlpha = pulseFactor;
    ctx.fillRect(goal.x + 4, goal.y + 4, goal.width - 8, goal.height - 6);
    ctx.restore();

    // 3. Shimmering horizontal core lines moving inside portal
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 3; i++) {
        const lineY = goal.y + ((time * 15 + i * 20) % (goal.height - 12));
        ctx.globalAlpha = 0.25 * (1 - (lineY - goal.y) / goal.height);
        ctx.beginPath();
        ctx.moveTo(goal.x + 5, lineY);
        ctx.lineTo(goal.x + goal.width - 5, lineY);
        ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 4. Orbiting magical dust around the center of the gate
    for (let i = 0; i < 6; i++) {
        const angle = time + (i * Math.PI * 2 / 6);
        const radiusX = (goal.width / 2.3) * (0.8 + Math.sin(time * 2.5 + i) * 0.15);
        const radiusY = (goal.height / 2.3) * (0.8 + Math.cos(time * 2.5 + i) * 0.15);
        const px = goal.x + goal.width / 2 + Math.cos(angle) * radiusX;
        const py = goal.y + goal.height / 2 + Math.sin(angle) * radiusY;
        
        ctx.fillStyle = i % 2 === 0 ? '#22d3ee' : '#e879f9';
        ctx.beginPath();
        const sparkleSize = 2 + Math.abs(Math.sin(time + i)) * 2;
        ctx.arc(px, py, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Minor stardust tail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(px - Math.cos(angle) * 3, py - Math.sin(angle) * 3, 2, 2);
    }

    // 5. Classic Exit Label with neon pulse
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px "Press Start 2P"';
    ctx.textAlign = 'center';
    
    // Ambient red glow behind EXIT text
    ctx.fillStyle = `rgba(34, 211, 238, ${0.6 + Math.sin(time * 3) * 0.3})`;
    ctx.fillText('EXIT', goal.x + goal.width / 2 + 1, goal.y - 11);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('EXIT', goal.x + goal.width / 2, goal.y - 12);
};

export const drawPowerUps = (ctx: CanvasRenderingContext2D, powerUps: PowerUp[]) => {
    const time = Date.now() / 200;

    powerUps.forEach(p => {
        if (p.type === 'lunarFragment') {
            // Elegant pulsing celestial glow
            const glow = 1.0 + Math.sin(time * 0.8) * 0.4;
            
            // Outer halo
            ctx.fillStyle = 'rgba(192, 132, 252, 0.25)';
            ctx.beginPath();
            ctx.arc(p.x + p.width / 2, p.y + p.height / 2, (p.width / 1.4) * glow, 0, Math.PI * 2);
            ctx.fill();

            // Intersecting cosmic orbits
            ctx.strokeStyle = 'rgba(232, 121, 249, 0.4)';
            ctx.lineWidth = 1;
            ctx.save();
            ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
            ctx.rotate(time / 2);
            ctx.strokeRect(-p.width * 0.6, -p.height * 0.6, p.width * 1.2, p.height * 1.2);
            ctx.restore();

            // Crescent Fragment Core
            ctx.fillStyle = '#f5d0fe';
            ctx.beginPath();
            ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 2.2, -0.5 * Math.PI, 0.5 * Math.PI, false);
            ctx.arc(p.x + p.width / 2, p.y + p.height / 2, p.width / 4, 0.5 * Math.PI, -0.5 * Math.PI, true);
            ctx.closePath();
            ctx.fill();

            // Orbiting fairy sparkles
            const sAngle = time * 1.5;
            const sx = p.x + p.width / 2 + Math.cos(sAngle) * (p.width * 0.7);
            const sy = p.y + p.height / 2 + Math.sin(sAngle) * (p.width * 0.7);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(sx - 1, sy - 1, 3, 3);

        } else if (p.type === 'coin') {
            const time = Date.now() / 150;
            const w = p.width;
            
            // Spinning coin effect
            const scaleX = Math.abs(Math.sin(time));
            
            ctx.fillStyle = '#facc15'; // yellow/gold
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.ellipse(p.x + w / 2, p.y + w / 2, w * 0.4 * scaleX, w * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Coin shine
            ctx.strokeStyle = '#fef3c7';
            ctx.stroke();
            ctx.shadowBlur = 0;

        } else if (p.type === 'isoldeAid') {
            // Pure white shining medical light
            const glow = 1.0 + Math.sin(time) * 0.35;
            
            ctx.fillStyle = 'rgba(241, 245, 249, 0.25)';
            ctx.beginPath();
            ctx.arc(p.x + p.width / 2, p.y + p.height / 2, (p.width / 1.3) * glow, 0, Math.PI * 2);
            ctx.fill();

            // Shimmering cross halo flares
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(time) * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x + p.width/2 - 12, p.y + p.height/2);
            ctx.lineTo(p.x + p.width/2 + 12, p.y + p.height/2);
            ctx.moveTo(p.x + p.width/2, p.y + p.height/2 - 12);
            ctx.lineTo(p.x + p.width/2, p.y + p.height/2 + 12);
            ctx.stroke();

            // Solid high-contrast cross center
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(p.x + 9, p.y + 4, 2, 12);
            ctx.fillRect(p.x + 4, p.y + 9, 12, 2);

        } else if (p.type === 'healthVial') {
            // Ruby crimson alchemical bottle
            const bobOffset = Math.sin(time * 0.7) * 3;
            const pY = p.y + bobOffset;

            // Translucent boiling/healing red mist under bottle
            const mistFactor = 0.5 + Math.sin(time * 1.3) * 0.3;
            ctx.fillStyle = `rgba(239, 68, 68, ${0.2 * mistFactor})`;
            ctx.beginPath();
            ctx.arc(p.x + p.width / 2, pY + p.height / 2, p.width * 0.8, 0, Math.PI * 2);
            ctx.fill();

            // Glass container bottle structure
            ctx.fillStyle = 'rgba(239, 68, 68, 0.35)'; // light glass red
            ctx.fillRect(p.x + 3, pY, p.width - 6, p.height);

            // Active crimson medical elixir inside
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(p.x + 3, pY + 8, p.width - 6, p.height - 8);

            // Liquid line highlight
            ctx.fillStyle = '#f87171';
            ctx.fillRect(p.x + 3, pY + 8, p.width - 6, 2.5);

            // Real-time alchemical bubbling offset animation inside elixir
            const bubbleFactor = (Date.now() / 25) % 12;
            ctx.fillStyle = '#fecaca'; // high key bubbles
            ctx.fillRect(p.x + 6, pY + p.height - 3 - bubbleFactor, 2, 2);
            ctx.fillRect(p.x + 13, pY + p.height - 7 - ((bubbleFactor + 6) % 12), 2, 2);

            // Cork stopper
            ctx.fillStyle = '#78350f';
            ctx.fillRect(p.x + 5, pY - 4, p.width - 10, 5);
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
        
        // Dynamic velocity tweaks for realistic spark, debris, and fluid blood movement
        if (p.type === 'spark') {
            p.velocityX *= 0.94;
            p.velocityY *= 0.94;
        } else if (p.type === 'dust') {
            // Apply a slight gravity pull to debris (identified by slate/brown/gray/crimson colors)
            if (p.color === '#64748b' || p.color === '#475569' || p.color === '#3e2723' || p.color === '#a1a1aa' || p.color === '#410b0b') {
                p.velocityY += 0.2;
                p.velocityX *= 0.97;
            }
        } else if (p.type === 'blood') {
            p.velocityY += 0.23; // Gravity pull for fluid droplets
            p.velocityX *= 0.978; // Air drag deceleration
        }
        
        ctx.globalAlpha = p.life / p.maxLife;

        if (p.type === 'shockwave') {
            const currentRadius = p.size * ((p.maxLife - p.life) / p.maxLife);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 8 * (p.life / p.maxLife);
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (p.type === 'damageText' && p.text) {
            ctx.fillStyle = p.color;
            ctx.font = `${p.size || 12}px "Press Start 2P"`;
            ctx.textAlign = 'center';
            ctx.fillText(p.text, p.x, p.y);
        } else if (p.type === 'dust') {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'spark') {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            const speed = Math.sqrt(p.velocityX * p.velocityX + p.velocityY * p.velocityY);
            if (speed > 0.1) {
                // Line segment stretched based on velocity vector
                const len = p.size * 2.5;
                ctx.lineTo(p.x - (p.velocityX / speed) * len, p.y - (p.velocityY / speed) * len);
            } else {
                ctx.lineTo(p.x - 3, p.y);
            }
            ctx.stroke();
        } else if (p.type === 'blood') {
            ctx.fillStyle = p.color;
            const speed = Math.sqrt(p.velocityX * p.velocityX + p.velocityY * p.velocityY);
            if (speed > 0.6) {
                // Fluid streak vector line
                ctx.strokeStyle = p.color;
                ctx.lineWidth = p.size;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                const stretchLength = Math.min(1.5 + speed * 1.5, p.size * 4.2);
                ctx.lineTo(p.x - (p.velocityX / speed) * stretchLength, p.y - (p.velocityY / speed) * stretchLength);
                ctx.stroke();
            } else {
                // Flattened puddle on the platform top
                ctx.beginPath();
                ctx.ellipse(p.x, p.y + p.size / 4, p.size * 1.15, p.size * 0.45, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (p.type === 'splinter') {
            ctx.save();
            ctx.translate(p.x, p.y);
            const r = (p.x / 14) + (p.y / 10); // rotation based on position coords
            ctx.rotate(r);
            ctx.fillStyle = p.color;
            // Draw a realistic thin grain-cut splinter
            ctx.fillRect(-p.size * 1.3, -p.size * 0.4, p.size * 2.6, p.size * 0.8);
            ctx.restore();
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
