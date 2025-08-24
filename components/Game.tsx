
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GameState, GameStatus, UIState, PlayerState, Platform, Enemy } from '../types';
import * as C from '../constants';
import { TitleScreen, GameOverScreen, UIOverlay, VictoryScreen } from './UI';
import { createInitialGameState, updatePlayer, updateEnemies } from '../services/gameLogic';
import { drawBackground, drawEnemies, drawParticles, drawPlayer, drawPlatforms, drawProjectiles, drawGoal, drawPowerUps } from '../services/renderLogic';
import { audioManager } from '../services/audioManager';

const Game: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameStateRef = useRef<GameState>(createInitialGameState());
    const keysPressed = useRef<Record<string, boolean>>({});
    const animationFrameId = useRef<number>(0);

    const [gameStatus, setGameStatus] = useState<GameStatus>('title');
    const [uiState, setUiState] = useState<UIState>({
        health: C.PLAYER_MAX_HEALTH,
        mana: C.PLAYER_MAX_MANA,
        score: 0,
        isWerewolf: false,
        werewolfTimer: 0,
        isMuted: audioManager.isMuted(),
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
            mana: player.mana, 
            score,
            isWerewolf: player.isWerewolf,
            werewolfTimer: player.werewolfTimer,
            isMuted: audioManager.isMuted(),
        });
    }, []);
    
    const toggleMute = useCallback(() => {
        audioManager.toggleMute();
        updateUI();
    }, [updateUI]);

    const gameLoop = useCallback(() => {
        if (gameStatus !== 'playing') return;
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const state = gameStateRef.current;
        
        // Update player state
        updatePlayer(state, keysPressed.current);
        
        // Update enemies
        updateEnemies(state);

        // Fall damage / out of bounds
        if (state.player.y > state.worldHeight + 100) {
            state.player.health = 0;
        }
        
        // Check for goal collision
        const playerHitbox = { ...state.player, x: state.player.x + 10, width: state.player.width - 20 };
        if (state.player.x + state.player.width > state.goal.x && state.player.x < state.goal.x + state.goal.width &&
            state.player.y + state.player.height > state.goal.y && state.player.y < state.goal.y + state.goal.height) {
            setGameStatus('victory');
        }


        // Camera
        state.camera.x = state.player.x - C.CANVAS_WIDTH / 2 + state.player.width / 2;
        state.camera.x = Math.max(0, Math.min(state.camera.x, state.worldWidth - C.CANVAS_WIDTH));

        // Player health check
        if (state.player.health <= 0) {
            setGameStatus('gameOver');
        } else {
            // Render
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

            ctx.restore();
            
            updateUI();
            animationFrameId.current = requestAnimationFrame(gameLoop);
        }
    }, [gameStatus, updateUI]);

    const startGame = () => {
        gameStateRef.current = createInitialGameState();
        updateUI();
        setGameStatus('playing');
        audioManager.playMusic();
    };

    const restartGame = () => {
        startGame();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { 
            const key = e.key.toLowerCase();
            if (key === 'm') {
                toggleMute();
            } else {
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
    }, [toggleMute]);

    useEffect(() => {
        if (gameStatus === 'playing') {
            animationFrameId.current = requestAnimationFrame(gameLoop);
        } else {
            audioManager.stopMusic();
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [gameStatus, gameLoop]);

    return (
        <div 
            id="gameContainer" 
            className="relative overflow-hidden border-4 border-slate-800 shadow-2xl" 
            style={{ width: C.CANVAS_WIDTH, height: C.CANVAS_HEIGHT }}
        >
            <canvas 
                ref={canvasRef} 
                width={C.CANVAS_WIDTH} 
                height={C.CANVAS_HEIGHT}
                className="absolute top-0 left-0 bg-black"
            />
            {gameStatus === 'playing' && <UIOverlay {...uiState} onToggleMute={toggleMute} />}
            {gameStatus === 'title' && <TitleScreen onStart={startGame} isLoading={false} />}
            {gameStatus === 'gameOver' && <GameOverScreen score={uiState.score} onRestart={restartGame} />}
            {gameStatus === 'victory' && <VictoryScreen score={uiState.score} onRestart={restartGame} />}
        </div>
    );
};


export default Game;