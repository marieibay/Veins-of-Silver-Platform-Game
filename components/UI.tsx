
import React, { useState, useEffect } from 'react';
import { UIState, PlayerUpgrades } from '../types';
import * as C from '../constants';
import { LEVELS } from '../data/levels';

interface TitleScreenProps {
    onStart: () => void;
    onShowControls: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onShowControls }) => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex flex-col justify-center items-center z-30 p-8 text-center">
        <h1 className="text-5xl text-red-400 text-glow mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>VEINS OF SILVER</h1>
        <h2 className="text-xl text-slate-300 mb-8" style={{ fontFamily: "'Press Start 2P', cursive" }}>SHADOWS UNBOUND</h2>
        
        <p className="max-w-xl text-slate-400 mb-12" style={{ fontFamily: "'Courier New', monospace" }}>
            Hunted by a corrupt Council, you must rely on your forbidden bloodline and the aid of a rogue vampire, Isolde, to survive. Can you master your powers and uncover the truth before the shadows consume you?
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
             <button 
                onClick={onStart}
                className="start-game-button"
            >
                Start Game
            </button>
            <button
                onClick={onShowControls}
                className="start-game-button"
                style={{ background: 'linear-gradient(to right, #4a5568, #2d3748)', borderColor: '#1a202c' }}
            >
                Controls
            </button>
        </div>
    </div>
);

interface IntroScreenProps {
    onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
    const lines = [
        "The year is 1888.",
        "The city of Silverfall is choked by industrial smog...",
        "...and a deeper, more sinister shadow.",
        "Hunted by the Council for your cursed bloodline,",
        "your only ally is Isolde, a vampire with her own secrets.",
        "The hunt is on. Survive the night."
    ];

    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentLineIndex >= lines.length) {
            setIsComplete(true);
            return;
        }

        const line = lines[currentLineIndex];
        let charIndex = 0;
        setTypedText(''); // Reset for new line

        const typingInterval = setInterval(() => {
            if (charIndex < line.length) {
                setTypedText(prev => prev + line.charAt(charIndex));
                charIndex++;
            } else {
                clearInterval(typingInterval);
                const timeoutId = setTimeout(() => {
                    setCurrentLineIndex(prev => prev + 1);
                }, 1500); // Pause before next line
                return () => clearTimeout(timeoutId);
            }
        }, 50); // Typing speed

        return () => clearInterval(typingInterval);
    }, [currentLineIndex]);

    return (
        <div className="absolute inset-0 bg-black flex flex-col justify-center items-center z-30 p-8 text-center cursor-pointer" onClick={onComplete}>
            <div className="max-w-xl text-slate-300 text-lg h-48" style={{ fontFamily: "'Courier New', monospace" }}>
                {lines.map((line, index) => (
                     <p key={index} className={`transition-opacity duration-1000 ${index <= currentLineIndex ? 'opacity-100' : 'opacity-0'}`}>
                        {index === currentLineIndex ? typedText : (index < currentLineIndex ? line : ' ')}
                    </p>
                ))}
            </div>
             <button
                className="absolute bottom-10 right-10 text-slate-400 font-bold uppercase tracking-widest animate-pulse hover:text-white pointer-events-none"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
                {isComplete ? 'Continue' : 'Skip'}
            </button>
        </div>
    );
};


interface GameOverScreenProps {
    score: number;
    onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, onRestart }) => (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-30">
        <h2 
            className="text-5xl text-red-400 text-glow mb-4" 
            style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
            GAME OVER
        </h2>
        <p 
            className="text-base text-yellow-400 mb-8"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
            Final Score: {score}
        </p>
        <button 
            onClick={onRestart}
            className="bg-gradient-to-r from-slate-500 to-slate-700 text-white font-bold py-3 px-8 rounded-none uppercase tracking-widest shadow-lg transform hover:scale-105 transition-transform duration-300"
            style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
            Main Menu
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
            {isLastLevel ? 'Main Menu' : 'Upgrades'}
        </button>
    </div>
);

interface UIOverlayProps extends Omit<UIState, 'experience' | 'upgrades'> {
    onToggleMute: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ health, maxHealth, mana, maxMana, score, level, isWerewolf, werewolfTimer, isMuted, onToggleMute, lives }) => {
    const healthPercentage = (health / maxHealth) * 100;
    const manaPercentage = (mana / maxMana) * 100;
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

            <div className="absolute top-5 right-5 text-right">
                <div>LIVES: {lives}</div>
                <div>LEVEL: {level}/{LEVELS.length}</div>
                <div>SCORE: {score}</div>
                <div>{isWerewolf ? 'CLAWS' : 'DAGGERS'}</div>
            </div>
            
            <div className="absolute bottom-5 right-5 text-slate-400 text-right leading-tight">
                 <button onClick={onToggleMute} className="pointer-events-auto hover:text-white mb-2">
                    {isMuted ? 'UNMUTE [M]' : 'MUTE [M]'}
                </button>
                <div>WASD/ARROWS: Move</div>
                <div>SPACE: Jump / Double Jump</div>
                <div>J: Attack</div>
                <div>K: Throw Dagger</div>
                <div>L: Parry</div>
                <div>H: Dash</div>
                <div>S (Hold): Charged Blast</div>
                <div>P: Pause</div>
            </div>
        </div>
    );
};

interface UpgradeScreenProps {
    uiState: UIState;
    onPurchase: (upgrade: keyof PlayerUpgrades) => void;
    onContinue: () => void;
}

const UpgradeButton: React.FC<{
    label: string,
    level: number,
    maxLevel: number,
    cost: number | undefined,
    xp: number,
    onPurchase: () => void
}> = ({ label, level, maxLevel, cost, xp, onPurchase }) => {
    const canAfford = cost !== undefined && xp >= cost;
    const isMaxed = level >= maxLevel;

    return (
        <div className="bg-slate-800 p-4 border border-slate-600 flex justify-between items-center">
            <div>
                <p className="font-bold text-teal-400">{label}</p>
                <p className="text-xs text-slate-400">Level: {level} / {maxLevel}</p>
            </div>
            <button
                onClick={onPurchase}
                disabled={!canAfford || isMaxed}
                className={`text-xs font-bold py-2 px-4 ${isMaxed ? 'bg-yellow-500 text-black' : canAfford ? 'bg-teal-500 hover:bg-teal-400 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
            >
                {isMaxed ? 'MAX' : cost ? `COST: ${cost} XP` : 'N/A'}
            </button>
        </div>
    );
};

export const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ uiState, onPurchase, onContinue }) => {
    const { experience, upgrades } = uiState;

    return (
         <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-30 p-8 text-white font-mono">
            <h2 className="text-3xl text-teal-400 font-bold mb-4" style={{ fontFamily: "'Press Start 2P', cursive" }}>UPGRADES</h2>
            <p className="text-yellow-400 mb-6">Spend XP to unlock permanent upgrades.</p>
            <p className="text-xl text-yellow-400 mb-8">Available XP: {experience}</p>

            <div className="w-full max-w-md grid grid-cols-1 gap-4 mb-8">
                <UpgradeButton 
                    label="Max Health"
                    level={upgrades.maxHealth}
                    maxLevel={C.UPGRADE_COSTS.maxHealth.length}
                    cost={C.UPGRADE_COSTS.maxHealth[upgrades.maxHealth]}
                    xp={experience}
                    onPurchase={() => onPurchase('maxHealth')}
                />
                 <UpgradeButton 
                    label="Max Mana"
                    level={upgrades.maxMana}
                    maxLevel={C.UPGRADE_COSTS.maxMana.length}
                    cost={C.UPGRADE_COSTS.maxMana[upgrades.maxMana]}
                    xp={experience}
                    onPurchase={() => onPurchase('maxMana')}
                />
                 <UpgradeButton 
                    label="Dagger Damage"
                    level={upgrades.daggerDamage}
                    maxLevel={C.UPGRADE_COSTS.daggerDamage.length}
                    cost={C.UPGRADE_COSTS.daggerDamage[upgrades.daggerDamage]}
                    xp={experience}
                    onPurchase={() => onPurchase('daggerDamage')}
                />
                 <UpgradeButton 
                    label="Claw Damage"
                    level={upgrades.clawDamage}
                    maxLevel={C.UPGRADE_COSTS.clawDamage.length}
                    cost={C.UPGRADE_COSTS.clawDamage[upgrades.clawDamage]}
                    xp={experience}
                    onPurchase={() => onPurchase('clawDamage')}
                />
            </div>

            <button
                onClick={onContinue}
                className="bg-gradient-to-r from-slate-500 to-slate-700 text-white font-bold py-3 px-8 uppercase tracking-widest shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
                Continue
            </button>
        </div>
    );
};

export const PauseScreen: React.FC = () => (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center items-center z-30">
        <h2 className="text-4xl text-white text-glow" style={{ fontFamily: "'Press Start 2P', cursive" }}>PAUSED</h2>
    </div>
);

// New Controls Screen Component
const KeyCap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block bg-slate-700 text-yellow-300 border-2 border-slate-600 rounded px-2 py-1 text-sm leading-none mx-1 font-mono shadow-md whitespace-nowrap">
        {children}
    </span>
);

const ControlRow: React.FC<{ action: string; keys: React.ReactNode; description: string }> = ({ action, keys, description }) => (
    <>
        <div className="font-bold text-slate-200">{action}</div>
        <div className="text-right">{keys}</div>
        <div className="col-span-2 text-slate-400 text-xs pb-2 border-b border-slate-800">{description}</div>
    </>
);

interface ControlsScreenProps {
    onBack: () => void;
}

export const ControlsScreen: React.FC<ControlsScreenProps> = ({ onBack }) => {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex flex-col justify-center items-center z-40 p-4 text-white">
            <h2 className="text-4xl text-yellow-400 text-glow mb-6" style={{ fontFamily: "'Press Start 2P', cursive" }}>
                CONTROLS
            </h2>

            <div className="w-full max-w-3xl bg-slate-900 bg-opacity-80 border-2 border-slate-700 p-6 text-slate-300 grid grid-cols-2 gap-x-8 gap-y-2 overflow-y-auto" style={{ fontFamily: "'Courier New', monospace", maxHeight: '70vh' }}>
                <div className="col-span-2 text-lg text-teal-400 font-bold tracking-widest pb-1 mb-2">MOVEMENT</div>
                <ControlRow
                    action="Move"
                    keys={<><KeyCap>A</KeyCap><KeyCap>D</KeyCap> or <KeyCap>←</KeyCap><KeyCap>→</KeyCap></>}
                    description="Walk left or right. Your character will automatically face the direction of movement."
                />
                 <ControlRow
                    action="Jump / Double Jump"
                    keys={<><KeyCap>Space</KeyCap> or <KeyCap>W</KeyCap> or <KeyCap>↑</KeyCap></>}
                    description="Press once to jump. Press again while in mid-air to perform a double jump."
                />
                 <ControlRow
                    action="Wall Slide / Jump"
                    keys={<>(Automatic)</>}
                    description="Hold the move key towards a wall while falling to slide down. Press jump to leap off the wall."
                />

                <div className="col-span-2 text-lg text-teal-400 font-bold tracking-widest pb-1 mb-2 mt-4">COMBAT</div>
                 <ControlRow
                    action="Melee Attack"
                    keys={<KeyCap>J</KeyCap>}
                    description="Perform a quick dagger slash. If transformed, this becomes a powerful claw attack."
                />
                <ControlRow
                    action="Throw Dagger"
                    keys={<KeyCap>K</KeyCap>}
                    description="Throw a spectral dagger. Consumes a small amount of mana."
                />
                <ControlRow
                    action="Dash"
                    keys={<KeyCap>H</KeyCap>}
                    description="Quickly dash forward, passing through enemies and projectiles. Consumes mana."
                />
                <ControlRow
                    action="Parry"
                    keys={<KeyCap>L</KeyCap>}
                    description="Enter a brief defensive stance. A successful parry staggers enemies and can reflect projectiles."
                />
                <ControlRow
                    action="Charged Blast"
                    keys={<>Hold <KeyCap>S</KeyCap> or <KeyCap>↓</KeyCap></>}
                    description="Hold to charge a powerful area-of-effect attack. Consumes more mana for a longer charge."
                />

                <div className="col-span-2 text-lg text-teal-400 font-bold tracking-widest pb-1 mb-2 mt-4">SYSTEM</div>
                <ControlRow
                    action="Pause Game"
                    keys={<KeyCap>P</KeyCap>}
                    description="Pauses and resumes the game at any time."
                />
                <ControlRow
                    action="Mute Audio"
                    keys={<KeyCap>M</KeyCap>}
                    description="Toggles all sound and music on or off."
                />
            </div>

            <button
                onClick={onBack}
                className="mt-8 bg-gradient-to-r from-slate-500 to-slate-700 text-white font-bold py-3 px-8 uppercase tracking-widest shadow-lg transform hover:scale-105 transition-transform duration-300"
                style={{ fontFamily: "'Press Start 2P', cursive" }}
            >
                Back
            </button>
        </div>
    );
};