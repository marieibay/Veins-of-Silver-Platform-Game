
import React from 'react';
import { UIState } from '../types';
import * as C from '../constants';
import { LEVELS } from '../data/levels';

interface TitleScreenProps {
    onStart: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex flex-col justify-center items-center z-30 p-8 text-center">
        <h1 className="text-5xl text-red-400 text-glow mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>VEINS OF SILVER</h1>
        <h2 className="text-xl text-slate-300 mb-8" style={{ fontFamily: "'Press Start 2P', cursive" }}>SHADOWS UNBOUND</h2>
        
        <p className="max-w-xl text-slate-400 mb-12" style={{ fontFamily: "'Courier New', monospace" }}>
            Hunted by a corrupt Council, you must rely on your forbidden bloodline and the aid of a rogue vampire, Isolde, to survive. Can you master your powers and uncover the truth before the shadows consume you?
        </p>

        <button 
            onClick={onStart}
            className="start-game-button"
        >
            Start Game
        </button>
    </div>
);


interface GameOverScreenProps {
    score: number;
    onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-30">
        <h2 className="text-3xl text-red-500 font-bold mb-4">YOU DIED</h2>
        <p className="text-base text-yellow-400 mb-8">Final Score: {score}</p>
        <button 
            onClick={onRestart}
            className="bg-gradient-to-r from-slate-500 to-slate-700 text-white font-bold py-3 px-8 rounded-none uppercase tracking-widest shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
            Try Again
        </button>
    </div>
);

interface VictoryScreenProps {
    score: number;
    onNextLevel: () => void;
    isLastLevel: boolean;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ score, onNextLevel, isLastLevel }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-30 text-center">
        <h2 className="text-3xl text-teal-400 font-bold mb-4">{isLastLevel ? 'DEMO COMPLETE' : 'LEVEL CLEAR'}</h2>
        <p className="text-base text-yellow-400 mb-8">{isLastLevel ? 'You have survived the shadows... for now.' : 'You reached the next sanctuary!'} <br/> Total Score: {score}</p>
        <button 
            onClick={onNextLevel}
            className="bg-gradient-to-r from-teal-500 to-green-500 text-white font-bold py-3 px-8 rounded-none uppercase tracking-widest shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
            {isLastLevel ? 'Main Menu' : 'Next Level'}
        </button>
    </div>
);

interface UIOverlayProps extends UIState {
    onToggleMute: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ health, mana, score, level, isWerewolf, werewolfTimer, isMuted, onToggleMute }) => {
    const healthPercentage = (health / C.PLAYER_MAX_HEALTH) * 100;
    const manaPercentage = (mana / C.PLAYER_MAX_MANA) * 100;
    const werewolfPercentage = (werewolfTimer / C.WEREWOLF_DURATION) * 100;

    return (
        <div className="absolute inset-0 pointer-events-none z-10 p-5 text-yellow-400 font-bold text-xs">
            {/* Health and Mana Bars */}
            <div>
                <div className="w-40 h-4 bg-black bg-opacity-50 border border-red-500 mb-2">
                    <div 
                        className="h-full bg-gradient-to-r from-red-500 to-red-400"
                        style={{ width: `${healthPercentage}%` }}
                    />
                </div>
                <div className="w-40 h-3 bg-black bg-opacity-50 border border-teal-400">
                    <div 
                        className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                        style={{ width: `${manaPercentage}%` }}
                    />
                </div>
                {isWerewolf && (
                    <div className="w-40 h-2 bg-black bg-opacity-50 border border-purple-400 mt-2">
                        <div 
                            className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-100 ease-linear"
                            style={{ width: `${werewolfPercentage}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Score and Weapon */}
            <div className="absolute top-5 right-5 text-right">
                <div>LEVEL: {level}/{LEVELS.length}</div>
                <div>SCORE: {score}</div>
                <div>{isWerewolf ? 'CLAWS' : 'DAGGERS'}</div>
            </div>
            
             {/* Controls & Mute */}
            <div className="absolute bottom-5 right-5 text-slate-400 text-right leading-tight">
                 <button onClick={onToggleMute} className="pointer-events-auto hover:text-white mb-2">
                    {isMuted ? 'UNMUTE [M]' : 'MUTE [M]'}
                </button>
                <div>WASD/ARROWS: Move</div>
                <div>SPACE: Jump</div>
                <div>J: Attack</div>
                <div>K: Pendant Shard</div>
            </div>
        </div>
    );
};
