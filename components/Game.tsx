import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { GameState, GameStatus, UIState, PlayerUpgrades, GameHandle } from '../types';
import * as C from '../constants';
import { GameOverScreen, UIOverlay, VictoryScreen, TitleScreen, UpgradeScreen, IntroScreen, PauseScreen } from './UI';
import { createGameStateForLevel, updatePlayer, updateEnemies, updateProjectiles, updateParticles } from '../services/gameLogic';
import { drawBackground, drawEnemies, drawParticles, drawPlayer, drawPlatforms, drawProjectiles, drawGoal, drawPowerUps, drawIsolde } from '../services/renderLogic';
import { audioManager } from '../services/audioManager';
import { LEVELS } from '../data/levels';

const Game = forwardRef<GameHandle, {}>((props, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameStateRef = useRef<GameState>(createGameStateForLevel(0));
    const keysPressed = useRef<Record<string, boolean>>({});
    const animationFrameId = useRef<number>(0);

    const [gameStatus, setGameStatus] = useState<GameStatus>('title');
    const [currentLevel, setCurrentLevel] = useState(0);
    const [uiState, setUiState] = useState<UIState>({
        health: C.PLAYER_MAX_HEALTH,
        maxHealth: C.PLAYER_MAX_HEALTH,
        mana: C.PLAYER_MAX_MANA,
        maxMana: C.PLAYER_MAX_MANA,
        score: 0,
        level: 1,
        isWerewolf: false,
        werewolfTimer: 0,
        isMuted: audioManager.isMuted(),
        experience: 0,
        upgrades: { maxHealth: 0, maxMana: 0, daggerDamage: 0, clawDamage: 0 },
        lives: C.PLAYER_STARTING_LIVES,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.imageSmoothingEnabled = false;
            }
        }
    }, []);

    const updateUI = useCallback(() => {
        const { player, score } = gameStateRef.current;
        setUiState({ 
            health: player.health, 
            maxHealth: player.maxHealth,
            mana: player.mana, 
            maxMana: player.maxMana,
            score,
            level: currentLevel + 1,
            isWerewolf: player.isWerewolf,
            werewolfTimer: player.werewolfTimer,
            isMuted: audioManager.isMuted(),
            experience: player.experience,
            upgrades: player.upgrades,
            lives: player.lives,
        });
    }, [currentLevel]);
    
    const toggleMute = useCallback(() => {
        audioManager.initializeAudioContext(); // Ensure context is created.
        audioManager.toggleMute();
        updateUI();
    }, [updateUI]);

    const gameLoop = useCallback(() => {
        if (gameStatus !== 'playing') return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const state = gameStateRef.current;
        
        updatePlayer(state, keysPressed.current);
        updateEnemies(state);
        updateProjectiles(state);
        updateParticles(state);

        if (state.player.y > state.worldHeight + 100) {
            state.player.health = 0;
        }
        
        const playerHitbox = { x: state.player.x, y: state.player.y, width: state.player.width, height: state.player.height };
        if (checkCollision(playerHitbox, state.goal)) {
            setGameStatus('victory');
            audioManager.playSFX('powerUp'); 
        }

        state.camera.x = state.player.x - C.CANVAS_WIDTH / 2 + state.player.width / 2;
        state.camera.y = state.player.y - C.CANVAS_HEIGHT / 2 - 100;
        state.camera.x = Math.max(0, Math.min(state.camera.x, state.worldWidth - C.CANVAS_WIDTH));
        state.camera.y = Math.max(0, Math.min(state.camera.y, state.worldHeight - C.CANVAS_HEIGHT));

        if (state.player.health <= 0) {
            state.player.lives--;
            if (state.player.lives <= 0) {
                setGameStatus('gameOver');
            } else {
                // Restart level but keep player progress
                gameStateRef.current = createGameStateForLevel(currentLevel, state.player);
            }
        }
        
        if (gameStatus === 'playing') {
            ctx.clearRect(0, 0, C.CANVAS_WIDTH, C.CANVAS_HEIGHT);
            drawBackground(ctx, state.camera);
            ctx.save();
            ctx.translate(-state.camera.x, -state.camera.y);
            
            drawGoal(ctx, state.goal);
            drawPlatforms(ctx, state.platforms);
            drawPowerUps(ctx, state.powerUps);
            drawEnemies(ctx, state.enemies);
            drawPlayer(ctx, state.player);
            drawProjectiles(ctx, state.projectiles);
            drawParticles(ctx, state.particles);
            drawIsolde(ctx, state);

            ctx.restore();
            
            updateUI();
            animationFrameId.current = requestAnimationFrame(gameLoop);
        }
    }, [gameStatus, updateUI, currentLevel]);
    
    const startGame = () => {
        audioManager.initializeAudioContext(); // Initialize on user gesture
        audioManager.playTitleMusic();
        setCurrentLevel(0);
        gameStateRef.current = createGameStateForLevel(0);
        updateUI();
        setGameStatus('intro');
    };

    const handleIntroComplete = () => {
        setGameStatus('playing');
    };
    
    const handleProceed = () => {
        if (currentLevel >= LEVELS.length -1) {
             setGameStatus('title'); // End of demo
        } else {
             setGameStatus('upgrade');
        }
    };

    const handlePurchaseUpgrade = (upgrade: keyof PlayerUpgrades) => {
        const player = gameStateRef.current.player;
        const currentLevel = player.upgrades[upgrade];
        const maxLevel = C.UPGRADE_COSTS[upgrade].length;

        if (currentLevel < maxLevel) {
            const cost = C.UPGRADE_COSTS[upgrade][currentLevel];
            if (player.experience >= cost) {
                player.experience -= cost;
                player.upgrades[upgrade]++;
                audioManager.playSFX('upgrade');
                updateUI();
            }
        }
    };

    const handleNextLevel = () => {
        const nextLevelIndex = currentLevel + 1;
        if (nextLevelIndex < LEVELS.length) {
            setCurrentLevel(nextLevelIndex);
            gameStateRef.current = createGameStateForLevel(nextLevelIndex, gameStateRef.current.player);
            updateUI();
            setGameStatus('playing');
        } else {
            setGameStatus('title');
        }
    };

    useImperativeHandle(ref, () => ({
        skipToNextLevel: () => {
            if (gameStatus !== 'playing') return;
            const nextLevelIndex = (currentLevel + 1) % LEVELS.length;
            setCurrentLevel(nextLevelIndex);
            gameStateRef.current = createGameStateForLevel(nextLevelIndex, gameStateRef.current.player);
            updateUI();
            setGameStatus('playing');
        }
    }));

    const restartGame = () => {
        setGameStatus('title');
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { 
            const key = e.key.toLowerCase();
            if (key === 'm') {
                toggleMute();
            } else if (key === 'p') {
                if (gameStatus === 'playing') {
                    setGameStatus('paused');
                    audioManager.pauseMusic();
                } else if (gameStatus === 'paused') {
                    setGameStatus('playing');
                    // The main useEffect will handle resuming the music via playMusic()
                }
            }
            else {
                keysPressed.current[key] = true;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = false; };
        
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [toggleMute, gameStatus]);

    useEffect(() => {
        if (gameStatus === 'playing') {
            // Logic to select music based on level
            if (currentLevel === LEVELS.length - 1) {
                audioManager.playBossMusic(); // Final boss music
            } else if (currentLevel > 0 && currentLevel < (LEVELS.length - 1) && currentLevel % 2 !== 0) {
                // Play new alternate music on levels 2, 4, 6, 8 (indices 1, 3, 5, 7)
                audioManager.playMusic2();
            } else {
                // Play original music on levels 1, 3, 5, 7, 9 (indices 0, 2, 4, 6, 8)
                audioManager.playMusic();
            }
            animationFrameId.current = requestAnimationFrame(gameLoop);
        } else {
            cancelAnimationFrame(animationFrameId.current);
            if (gameStatus !== 'paused' && gameStatus !== 'intro') {
                audioManager.stopMusic();
                if (gameStatus === 'gameOver') {
                    audioManager.playSFX('gameOver');
                }
            }
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameStatus, gameLoop, currentLevel]);

    const checkCollision = (a: any, b: any) => {
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    return (
        <div 
            id="gameContainer" 
            className="relative overflow-hidden border-4 border-slate-800 shadow-2xl" 
            style={{ width: C.CANVAS_WIDTH, height: C.CANVAS_HEIGHT }}
        >
            {gameStatus !== 'title' && gameStatus !== 'intro' && (
                <canvas 
                    ref={canvasRef} 
                    width={C.CANVAS_WIDTH} 
                    height={C.CANVAS_HEIGHT}
                    className="absolute top-0 left-0 bg-black"
                />
            )}
            {gameStatus === 'title' && <TitleScreen onStart={startGame} />}
            {gameStatus === 'intro' && <IntroScreen onComplete={handleIntroComplete} />}
            {(gameStatus === 'playing' || gameStatus === 'paused') && <UIOverlay {...uiState} onToggleMute={toggleMute} />}
            {gameStatus === 'paused' && <PauseScreen />}
            {gameStatus === 'gameOver' && <GameOverScreen score={uiState.score} onRestart={restartGame} />}
            {gameStatus === 'victory' && <VictoryScreen score={uiState.score} onNextLevel={handleProceed} isLastLevel={currentLevel >= LEVELS.length - 1} />}
            {gameStatus === 'upgrade' && <UpgradeScreen uiState={uiState} onPurchase={handlePurchaseUpgrade} onContinue={handleNextLevel} />}
        </div>
    );
});


export default Game;