
import React, { useState, useEffect } from 'react';
import { UIState, PlayerUpgrades } from '../types';
import * as C from '../constants';
import { LEVELS } from '../data/levels';

interface TitleScreenProps {
    onStart: () => void;
    onShowControls: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onShowControls }) => (
    <div className="absolute inset-0 bg-gradient-to-br from-[#030303] via-[#090915] to-[#0d1321] flex flex-col justify-center items-center z-30 p-8 text-center overflow-hidden">
        <GothicStyleTag />
        <GothicEmbers />
        
        <div className="absolute inset-0 bg-red-950/5 blur-3xl pointer-events-none rounded blood-vapor z-0" />
        
        <div className="relative z-10 max-w-xl flex flex-col items-center">
            {/* Elegant glowing display title */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl text-red-500 text-glow mb-4 font-pixel leading-tight tracking-wider" style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.75)' }}>
                VEINS OF SILVER
            </h1>
            <h2 className="text-[10px] md:text-xs text-slate-400 tracking-[0.3em] md:tracking-[0.4em] mb-10 font-pixel">
                SHADOWS UNBOUND
            </h2>
            
            <p className="text-[11px] text-slate-300 font-mono leading-relaxed max-w-md mb-12 opacity-85">
                Hunted by a corrupt Council, you must rely on your forbidden bloodline and the aid of a rogue vampire, Isolde, to survive. Can you master your powers and uncover the truth before the shadows consume you?
            </p>

            <div className="flex flex-col sm:flex-row gap-5 relative z-10">
                {/* START GAME BUTTON - Metal Shimmer sweep */}
                <button 
                    onClick={onStart}
                    className="group relative bg-gradient-to-b from-red-900 to-red-950 border-2 border-red-800 hover:border-red-500 text-red-200 hover:text-white font-pixel text-[9px] py-4 px-12 tracking-[0.25em] uppercase hover:shadow-[0_4px_25px_rgba(220,10,10,0.4)] cursor-pointer active:scale-95 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-y-0 -left-[100%] w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[25deg]" 
                         style={{
                             animation: 'shimmer 2.2s infinite ease-in-out'
                         }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                        SURVIVE NIGHT
                    </span>
                </button>
                
                {/* CONTROLS BUTTON - Elegant slate silver outline */}
                <button
                    onClick={onShowControls}
                    className="group relative bg-gradient-to-b from-slate-900/80 to-slate-950/80 border-2 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-pixel text-[9px] py-4 px-12 tracking-[0.25em] uppercase hover:shadow-[0_4px_25px_rgba(100,116,139,0.25)] cursor-pointer active:scale-95 transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        CONTROLS
                    </span>
                </button>
            </div>
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
            <img src="/1.webp" alt="Intro Background" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="relative max-w-xl text-slate-300 text-lg h-48 z-10" style={{ fontFamily: "'Courier New', monospace" }}>
                {lines.map((line, index) => (
                     <p key={index} className={`transition-opacity duration-1000 ${index <= currentLineIndex ? 'opacity-100' : 'opacity-0'}`}>
                        {index === currentLineIndex ? typedText : (index < currentLineIndex ? line : ' ')}
                    </p>
                ))}
            </div>
             <button
                className="absolute bottom-5 right-5 z-10 text-slate-400 font-bold uppercase tracking-widest animate-pulse hover:text-white pointer-events-none font-pixel"
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
    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[4px] flex flex-col justify-center items-center z-30 p-8 text-white font-mono overflow-hidden">
        <GothicStyleTag />
        <GothicEmbers />
        
        <div className="absolute inset-0 bg-red-950/10 blur-3xl pointer-events-none rounded blood-vapor z-0" />

        {/* Gothic Plaque Panel for Game Over */}
        <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-gradient-to-b from-slate-950/75 via-slate-900/75 to-slate-950/75 border-2 border-red-900/60 rounded-sm shadow-[0_0_65px_rgba(0,0,0,0.95)] backdrop-blur-md max-h-[90vh] flex flex-col select-none text-center">
            
            {/* Corner runic diamonds */}
            <span className="absolute top-2.5 left-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>
            <span className="absolute top-2.5 right-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>
            <span className="absolute bottom-2.5 left-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>
            <span className="absolute bottom-2.5 right-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>

            <h2 className="text-3xl text-red-600 font-pixel tracking-widest mb-1.5" style={{ textShadow: '0 0 15px rgba(220, 38, 38, 0.75)' }}>
                THE NIGHT CLAIMS THEE
            </h2>
            
            <div className="flex items-center justify-center gap-3.5 mb-5">
                <div className="h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent w-12" />
                <span className="text-[7px] font-pixel text-slate-500 uppercase tracking-[0.25em]">Shattered Bloodline</span>
                <div className="h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent w-12" />
            </div>

            <p className="text-[10px] text-slate-400 font-mono leading-relaxed mb-6 border-b border-slate-950 pb-4">
                Thy precious mortal shell has ruptured under the violent weight of thy predators. Thy pure silver essence dissipates back into the smog-choked ruins.
            </p>

            {/* Glowing Score Panel */}
            <div className="bg-slate-950/55 border border-slate-900/80 rounded px-5 py-3 mb-6 flex flex-col items-center justify-center shadow-[inset_0_4px_15px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-sm">
                <div className="text-[7px] font-pixel text-slate-400 tracking-wider mb-1 uppercase">RECOVERABLE SILVER ESSENCE</div>
                <div className="text-xl font-pixel text-yellow-500 flex items-center justify-center gap-1.5" style={{ textShadow: '0 0 10px rgba(250,204,21,0.3)' }}>
                    {score} <span className="text-[9px] text-red-500 font-bold">XP</span>
                </div>
            </div>

            {/* Shimmer Metal Button */}
            <div className="flex justify-center">
                <button
                    onClick={onRestart}
                    className="group relative bg-gradient-to-b from-red-950 to-slate-950 border-2 border-red-900/80 hover:border-red-500 text-red-300 hover:text-white font-pixel text-[8.5px] py-3.5 px-10 tracking-[0.25em] uppercase shadow-[0_4px_20px_rgba(220,10,10,0.15)] hover:shadow-[0_4px_30px_rgba(220,10,10,0.4)] cursor-pointer active:scale-95 transition-all duration-300 overflow-hidden"
                >
                    <div className="absolute inset-y-0 -left-[100%] w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[25deg]" 
                         style={{
                             animation: 'shimmer 2.2s infinite ease-in-out'
                         }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                        RISE FROM ASHES
                    </span>
                </button>
            </div>
        </div>
    </div>
);

interface VictoryScreenProps {
    score: number;
    onNextLevel: () => void;
    isLastLevel: boolean;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ score, onNextLevel, isLastLevel }) => {
    return (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[4px] flex flex-col justify-center items-center z-30 p-8 text-white font-mono overflow-hidden">
            {/* Ambient Red & Blood embers behind the Victory plaque */}
            <GothicStyleTag />
            <GothicEmbers />
            
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d]/10 via-transparent to-[#0a0a0c]/70 pointer-events-none z-0" />

            {/* Gothic Plaque Overlay Panel */}
            <div className="relative z-10 w-full max-w-xl p-8 md:p-11 bg-gradient-to-b from-slate-950/75 via-slate-900/75 to-slate-950/75 border-2 border-red-900/60 rounded-sm shadow-[0_0_60px_rgba(0,0,0,0.95)] backdrop-blur-md select-none text-center transform hover:scale-[1.01] transition-transform duration-500">
                <div className="absolute inset-0 bg-red-950/5 blur-xl pointer-events-none rounded blood-vapor" />

                {/* Corner diamonds */}
                <span className="absolute top-2.5 left-2.5 text-red-900/80 font-pixel text-[8px]">◆</span>
                <span className="absolute top-2.5 right-2.5 text-red-900/80 font-pixel text-[8px]">◆</span>
                <span className="absolute bottom-2.5 left-2.5 text-red-900/80 font-pixel text-[8px]">◆</span>
                <span className="absolute bottom-2.5 right-2.5 text-red-900/80 font-pixel text-[8px]">◆</span>

                {/* Stage Cleared Header */}
                <h2 className="text-3xl text-red-500 font-pixel tracking-widest mb-2" style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.65)' }}>
                    {isLastLevel ? 'DEMO COMPLETE' : 'STAGE CLEAR'}
                </h2>
                
                <div className="flex items-center justify-center gap-3.5 mb-6">
                    <div className="h-[1.5px] bg-gradient-to-r from-transparent via-red-800/60 to-transparent w-16" />
                    <span className="text-[7.5px] font-pixel text-yellow-500/80 uppercase tracking-[0.3em]">Sanctum Reclaimed</span>
                    <div className="h-[1.5px] bg-gradient-to-r from-transparent via-red-800/60 to-transparent w-16" />
                </div>

                {/* Atmospheric Text */}
                <p className="text-[10px] text-slate-300 md:text-[11px] font-mono max-w-xs mx-auto leading-relaxed mb-8 border-b border-slate-950 pb-5">
                    {isLastLevel ? (
                        'Thou hast survived the deep shadows... for now. Thy path is illuminated by the vital blood of thy fallen adversaries.'
                    ) : (
                        'A sacred sanctuary of protection is reached within the ancient ruins. Thy mortal soul remains preserved from the Hunt.'
                    )}
                </p>

                {/* Silver Essence Score Box */}
                <div className="bg-slate-950/55 border border-slate-900/80 rounded px-6 py-4.5 mb-8 flex flex-col items-center justify-center shadow-[inset_0_4px_15px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-sm">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <div className="text-[7.5px] font-pixel text-slate-400 tracking-wider mb-2 uppercase">COMMITTED SILVER ESSENCE</div>
                    <div className="text-2xl font-pixel text-yellow-400 flex items-center justify-center gap-2" style={{ textShadow: '0 0 10px rgba(250,204,21,0.35)' }}>
                        {score}
                        <span className="text-[10px] text-red-500">XP</span>
                    </div>
                </div>

                {/* Metal Sweep Shimmer continue button */}
                <div className="flex justify-center">
                    <button
                        onClick={onNextLevel}
                        className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-red-900 hover:border-red-500 text-red-200 hover:text-white font-pixel text-[9px] py-4 px-12 tracking-[0.25em] uppercase shadow-[0_4px_25px_rgba(220,10,10,0.15)] hover:shadow-[0_4px_35px_rgba(220,10,10,0.4)] cursor-pointer active:scale-95 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-y-0 -left-[100%] w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[25deg]" 
                             style={{
                                 animation: 'shimmer 2.2s infinite ease-in-out'
                             }}
                        />
                        
                        <span className="relative z-10 flex items-center gap-3">
                            {isLastLevel ? 'DEMO TRIUMPH' : 'COMMUNE WITH ALCHEMY'}
                            <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

interface UIOverlayProps extends Omit<UIState, 'experience' | 'upgrades'> {
    onToggleMute: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ health, maxHealth, mana, maxMana, score, level, isWerewolf, werewolfTimer, isMuted, onToggleMute, lives }) => {
    const healthPercentage = (health / maxHealth) * 100;
    const manaPercentage = (mana / maxMana) * 100;
    const werewolfPercentage = (werewolfTimer / C.WEREWOLF_DURATION) * 100;

    // Local state for the magnificent Level Title Card Overlay
    const [titleCard, setTitleCard] = useState<{ text: string; subtitle: string; opacity: number; scale: number; letterSpacing: string } | null>(null);

    useEffect(() => {
        const titles = [
            { main: "STAGE I", sub: "The Midnight Escape" },
            { main: "STAGE II", sub: "The Sewer Underbelly" },
            { main: "STAGE III", sub: "The Ruined Spire" },
            { main: "STAGE IV", sub: "Sanctuary Siege" },
            { main: "STAGE V", sub: "The Grand Library" },
            { main: "STAGE VI", sub: "The Corrupted Aqueducts" },
            { main: "STAGE VII", sub: "The Gilded Prison" },
            { main: "STAGE VIII", sub: "The Skybridge Ascent" },
            { main: "STAGE IX", sub: "The Outer Citadel" },
            { main: "STAGE X", sub: "The Throne of Shadows" }
        ];
        
        const stageInfo = titles[level - 1] || { main: `STAGE ${level}`, sub: "Shadows Unbound" };
        
        setTitleCard({
            text: stageInfo.main,
            subtitle: stageInfo.sub,
            opacity: 0,
            scale: 0.85,
            letterSpacing: '0.1em'
        });
        
        const enterTimeout = setTimeout(() => {
            setTitleCard(prev => prev ? {
                ...prev,
                opacity: 1,
                scale: 1,
                letterSpacing: '0.3em'
            } : null);
        }, 100);
        
        const exitTimeout = setTimeout(() => {
            setTitleCard(prev => prev ? {
                ...prev,
                opacity: 0,
                scale: 1.1,
                letterSpacing: '0.4em'
            } : null);
        }, 2200);

        const destroyTimeout = setTimeout(() => {
            setTitleCard(null);
        }, 3000);

        return () => {
            clearTimeout(enterTimeout);
            clearTimeout(exitTimeout);
            clearTimeout(destroyTimeout);
        };
    }, [level]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 p-5 text-yellow-400 font-bold text-xs select-none">
            {/* Stage Title Card Overlay in Center of Screen */}
            {titleCard && (
                <div 
                    className="absolute inset-0 flex flex-col justify-center items-center z-20 bg-black/25 backdrop-blur-[1.5px] transition-all duration-700 ease-out pointer-events-none"
                    style={{ 
                        opacity: titleCard.opacity,
                    }}
                >
                    <div 
                        className="text-center p-8 bg-gradient-to-b from-slate-950/70 via-slate-900/70 to-slate-950/70 border-y-2 border-red-800/40 w-full max-w-2xl transform transition-all duration-1000 ease-out shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-md"
                        style={{
                            transform: `scale(${titleCard.scale})`,
                        }}
                    >
                        <div 
                            className="text-red-500 font-pixel text-2xl md:text-3xl mb-4 transition-all duration-1000 ease-out"
                            style={{ 
                                letterSpacing: titleCard.letterSpacing,
                                textShadow: '0 0 15px rgba(239, 68, 68, 0.65)'
                            }}
                        >
                            {titleCard.text}
                        </div>
                        <div className="text-slate-300 font-mono text-xs tracking-[0.2em] uppercase max-w-lg mx-auto border-t border-slate-800/80 pt-3">
                            {titleCard.subtitle}
                        </div>
                    </div>
                </div>
            )}

            {/* Health, Mana and Beast Bars Side Console */}
            <div className="flex flex-col gap-2.5 max-w-[280px]">
                <div className="bg-slate-950/65 border border-slate-800/75 rounded p-3.5 shadow-2xl backdrop-blur-md flex flex-col gap-3">
                    
                    {/* Health Status Bar */}
                    <div className="flex items-center gap-2.5 animate-[pulse_4s_infinite]">
                        <svg className="w-5 h-5 text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.7)] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        
                        <div className="flex-1 select-none">
                            <div className="flex justify-between items-center text-[8px] font-pixel text-red-400 mb-1 tracking-wide">
                                <span>VITALITY</span>
                                <span>{Math.max(0, Math.ceil(health))}/{maxHealth}</span>
                            </div>
                            <div className="relative w-full h-3.5 bg-slate-950 border border-slate-800 rounded overflow-hidden shadow-inner">
                                {/* Damage-loss visual catchup orange underlay */}
                                <div 
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-600 to-amber-400"
                                    style={{ 
                                        width: `${healthPercentage}%`,
                                        transition: 'width 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                />
                                {/* Bright main red health bar */}
                                <div 
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 border-r border-red-300/40"
                                    style={{ 
                                        width: `${healthPercentage}%`,
                                        transition: 'width 0.1s ease-out'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Mana Status Bar */}
                    <div className="flex items-center gap-2.5">
                        <svg className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.7)] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11 21h2v-8h5l-7-10v8H6l5 10z"/>
                        </svg>
                        
                        <div className="flex-1 select-none">
                            <div className="flex justify-between items-center text-[8px] font-pixel text-cyan-400 mb-1 tracking-wide">
                                <span>SPELL MANA</span>
                                <span>{Math.max(0, Math.ceil(mana))}/{maxMana}</span>
                            </div>
                            <div className="relative w-full h-3 bg-slate-950 border border-slate-800 rounded overflow-hidden shadow-inner">
                                {/* Energy spent visual catchup indigo underlay */}
                                <div 
                                    className="absolute left-0 top-0 h-full bg-indigo-800"
                                    style={{ 
                                        width: `${manaPercentage}%`,
                                        transition: 'width 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
                                    }}
                                />
                                {/* Bright cyan mana bar */}
                                <div 
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-cyan-300 border-r border-cyan-200/40"
                                    style={{ 
                                        width: `${manaPercentage}%`,
                                        transition: 'width 0.1s ease-out'
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Beast Form Transformed Bar */}
                    {isWerewolf && (
                        <div className="flex items-center gap-2.5 border-t border-slate-900 pt-2 animate-[pulse_2s_infinite]">
                            <svg className="w-5 h-5 text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.7)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M6 3c1 4 0 9-3 13M12 2c2 4 1 11-2 16M18 4c2 3 2 10 0 15"/>
                            </svg>
                            
                            <div className="flex-1 select-none">
                                <div className="flex justify-between items-center text-[8px] font-pixel text-purple-400 mb-1 tracking-wide">
                                    <span>BEAST MODE</span>
                                    <span>{Math.ceil(werewolfTimer / 60)}s</span>
                                </div>
                                <div className="relative w-full h-2.5 bg-slate-950 border border-purple-950 rounded overflow-hidden shadow-inner">
                                    <div 
                                        className="h-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-fuchsia-400 border-r border-fuchsia-300/40"
                                        style={{ 
                                            width: `${werewolfPercentage}%`,
                                            transition: 'width 0.1s linear'
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Top-Right Stats Console */}
            <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5 pointer-events-none select-none">
                <div className="bg-slate-950/65 border border-slate-800/75 rounded p-3 shadow-2xl backdrop-blur-md flex flex-col gap-1.5 min-w-[130px]">
                    <div className="flex justify-between items-center text-[7.5px] font-pixel text-slate-400">
                        <span>LIVES:</span>
                        <span className="text-red-400 font-bold flex items-center gap-1">
                            {"❤️".repeat(Math.max(0, lives)) || "☠️"}
                        </span>
                    </div>
                    <div className="h-[1px] bg-slate-900" />
                    <div className="flex justify-between items-center text-[7.5px] font-pixel text-slate-400">
                        <span>STAGE:</span>
                        <span className="text-yellow-400">{level}/{LEVELS.length}</span>
                    </div>
                    <div className="h-[1px] bg-slate-900" />
                    <div className="flex justify-between items-center text-[7.5px] font-pixel text-slate-400">
                        <span>ESSENCE:</span>
                        <span className="text-emerald-400 font-bold">{score} <span className="text-[6.5px]">XP</span></span>
                    </div>
                    <div className="h-[1px] bg-slate-900" />
                    <div className="flex justify-between items-center text-[7.5px] font-pixel text-slate-400">
                        <span>STANCE:</span>
                        <span className={`font-bold ${isWerewolf ? 'text-purple-400' : 'text-cyan-400'}`}>
                            {isWerewolf ? 'BEAST' : 'DAGGER'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface UpgradeScreenProps {
    uiState: UIState;
    onPurchase: (upgrade: keyof PlayerUpgrades) => void;
    onContinue: () => void;
}

// Gorgeous alchemical gothic and weapon vector iconography
const HeartIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
);

const ManaIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 22H22L12 2M12 6.8L18.8 18H5.2L12 6.8M12 9L9.5 14H14.5L12 9" />
    </svg>
);

const DaggerIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L3 6" />
        <path d="M16 16l3-3" />
        <path d="M13 13l3 3" />
        <path d="M19 19l2-2" />
        <path d="M17 14l2 2" />
        <path d="M3 6l3-3 11 11-3 3L3 6z" />
    </svg>
);

const ClawIcon: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 3C7 5 3 15 4 21" />
        <path d="M16 4c-1 3-2 11-1 17" />
        <path d="M20 5C17 9 14 18 16 21" />
    </svg>
);

// CSS animation stylings in order to maintain fully self-contained animations
const GothicStyleTag: React.FC = () => (
    <style>{`
        @keyframes driftUp {
            0% {
                transform: translateY(0) scale(0.8) rotate(0deg);
                opacity: 0;
            }
            15% {
                opacity: 0.7;
            }
            85% {
                opacity: 0.3;
            }
            100% {
                transform: translateY(-400px) scale(1.4) rotate(360deg);
                opacity: 0;
            }
        }
        @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 150%; }
        }
        @keyframes pulseGlow {
            0%, 100% { box-shadow: 0 0 15px rgba(220, 38, 38, 0.1), 0 0 5px rgba(220, 38, 38, 0.05); }
            50% { box-shadow: 0 0 25px rgba(220, 38, 38, 0.3), 0 0 10px rgba(220, 38, 38, 0.15); }
        }
        @keyframes bloodVapor {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
            50% { transform: translateY(-4px) scale(1.05); opacity: 0.3; }
        }
        .gothic-card-glow {
            animation: pulseGlow 4s infinite ease-in-out;
        }
        .blood-vapor {
            animation: bloodVapor 5s infinite ease-in-out;
        }
    `}</style>
);

// Gentle gothic rising embers background effect
const GothicEmbers = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 z-0">
            {Array.from({ length: 16 }).map((_, i) => {
                const size = Math.random() * 3 + 1.5;
                const left = Math.random() * 100;
                const delay = Math.random() * 5;
                const duration = 5 + Math.random() * 6;
                return (
                    <div
                        key={i}
                        className="absolute bottom-0 bg-gradient-to-t from-red-600 via-amber-500 to-transparent rounded-full blur-[1px]"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            left: `${left}%`,
                            animationDelay: `${delay}s`,
                            animationDuration: `${duration}s`,
                            animationName: 'driftUp',
                            animationTimingFunction: 'ease-in-out',
                            animationIterationCount: 'infinite',
                            opacity: 0.2 + Math.random() * 0.6,
                        }}
                    />
                );
            })}
        </div>
    );
};

// Floating glowing diamond-tier indicator representing current levels
const renderTiers = (level: number, maxLevel: number) => {
    const tiers = [];
    for (let i = 0; i < maxLevel; i++) {
        const isFilled = i < level;
        tiers.push(
            <div 
                key={i} 
                className={`w-2.5 h-2.5 rotate-45 border transition-all duration-500 flex items-center justify-center ${
                    isFilled 
                        ? 'bg-red-600 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.85)]' 
                        : 'bg-slate-950/80 border-slate-800'
                }`}
            >
                {isFilled && <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" />}
            </div>
        );
    }
    return <div className="flex gap-2.5 my-1.5">{tiers}</div>;
};

interface UpgradeCardProps {
    label: string;
    description: string;
    level: number;
    maxLevel: number;
    cost: number | undefined;
    xp: number;
    icon: React.ReactNode;
    onPurchase: () => void;
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({ label, description, level, maxLevel, cost, xp, icon, onPurchase }) => {
    const canAfford = cost !== undefined && xp >= cost;
    const isMaxed = level >= maxLevel;

    return (
        <div className={`relative bg-gradient-to-b from-slate-950/95 via-slate-900/95 to-slate-950/95 border-2 rounded p-3 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 ${
            isMaxed 
                ? 'border-yellow-700/50 shadow-[0_0_15px_rgba(202,138,4,0.1)] opacity-95' 
                : canAfford 
                    ? 'border-red-950 hover:border-red-700/80 hover:shadow-[0_0_20px_rgba(185,28,28,0.2)] hover:-translate-y-0.5' 
                    : 'border-slate-900/80 opacity-70'
        }`}>
            <div className="flex gap-3 relative z-10 items-center">
                {/* Glowing runic plate icon block */}
                <div className={`w-10 h-10 rounded border flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isMaxed 
                        ? 'bg-slate-950 border-yellow-700 text-yellow-500 shadow-[0_0_10px_rgba(202,138,4,0.3)]' 
                        : canAfford 
                            ? 'bg-slate-950 border-red-900/80 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.25)]' 
                            : 'bg-slate-950 border-slate-950 text-slate-600'
                }`}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-1.5">
                        <h4 className={`font-pixel text-[9px] tracking-wide uppercase truncate ${isMaxed ? 'text-yellow-500' : 'text-slate-100'}`}>
                            {label}
                        </h4>
                        {isMaxed ? (
                            <span className="text-[6.5px] font-pixel px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 select-none uppercase">MAX</span>
                        ) : cost !== undefined ? (
                            <span className={`text-[7px] font-pixel px-1.5 py-0.5 rounded border select-none ${
                                canAfford 
                                    ? 'bg-red-950/40 border-red-900/60 text-red-400 font-bold' 
                                    : 'bg-slate-950/80 border-slate-800 text-slate-500'
                            }`}>
                                {cost} XP
                            </span>
                        ) : null}
                    </div>
                    
                    {/* Glowing Tiers progress */}
                    {renderTiers(level, maxLevel)}
                </div>
            </div>

            <p className="text-[8px] font-mono text-slate-400 leading-normal mt-1.5 mb-1.5">
                {description}
            </p>

            <div className="mt-1 pb-0.5 relative z-10">
                <button
                    onClick={onPurchase}
                    disabled={!canAfford || isMaxed}
                    className={`w-full py-1.5 font-pixel text-[7.5px] tracking-widest border transition-all duration-200 select-none ${
                        isMaxed 
                            ? 'bg-gradient-to-r from-yellow-700/20 to-yellow-600/10 border-yellow-700/50 text-yellow-400/60 cursor-not-allowed' 
                            : canAfford 
                                ? 'bg-gradient-to-r from-red-900 to-red-950 border-red-800 hover:border-red-500 hover:from-red-800 hover:to-red-900 text-red-200 hover:text-white cursor-pointer active:scale-98 shadow-[0_4px_10px_rgba(220,38,38,0.1)] hover:shadow-[0_4px_15px_rgba(220,38,38,0.25)]' 
                                : 'bg-slate-950/60 border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                >
                    {isMaxed ? 'SEALED' : canAfford ? 'COMMUNE' : 'INSUFFICIENT'}
                </button>
            </div>
        </div>
    );
};

export const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ uiState, onPurchase, onContinue }) => {
    const { experience, upgrades } = uiState;

    return (
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[5px] flex flex-col items-center justify-center z-30 p-4 md:p-6 text-white font-mono overflow-hidden">
            <GothicStyleTag />
            <GothicEmbers />

            <div className="absolute inset-0 bg-gradient-to-b from-[#1c0808]/15 via-transparent to-[#0a0a0c]/80 pointer-events-none z-0" />

            {/* Outer container designed to fit perfectly on standard 600px screens */}
            <div className="w-full max-w-2xl flex flex-col items-center justify-center relative z-10">
                
                {/* Gothic Alchemical Header */}
                <div className="text-center mb-3 relative select-none w-full">
                    <div className="absolute inset-0 bg-red-900/15 blur-xl rounded-full blood-vapor" />
                    <h2 className="text-xl md:text-2xl text-red-500 font-pixel tracking-wider mb-1 relative" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.7)' }}>
                        DARK SANCTUM
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-red-800/40 to-transparent w-16" />
                        <span className="text-[7.5px] font-pixel text-yellow-500/80 uppercase tracking-[0.2em]">Essence Transmutation</span>
                        <div className="h-[1px] bg-gradient-to-r from-transparent via-red-800/40 to-transparent w-16" />
                    </div>
                </div>

                {/* Gorgeous Blood Vial container showing experience */}
                <div className="flex justify-center items-center gap-4 mb-3 bg-slate-950/55 border border-slate-900/80 px-4 py-1.5 rounded shadow-[0_15px_30px_rgba(0,0,0,0.8)] relative overflow-hidden select-none backdrop-blur-sm">
                    <div className="relative flex items-center gap-3">
                        {/* Spherical Glowing Vial of Blood */}
                        <div className="relative w-9 h-9 rounded-full border-2 border-red-900/80 p-0.5 flex items-center justify-center bg-slate-950 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
                            {/* Shifting red fluid */}
                            <div 
                                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-red-800 via-red-600 to-rose-500 w-full rounded-b-full opacity-80" 
                                style={{ 
                                    height: `${Math.min(100, Math.max(15, (experience / 1500) * 100))}%`, 
                                    transition: 'height 1s cubic-bezier(0.16, 1, 0.3, 1)' 
                                }} 
                            />
                            <div className="absolute top-0.5 left-1.5 w-5 h-2 bg-white/10 rounded-full blur-[0.5px]" />
                            <svg className="w-5 h-5 text-white relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C11.5 2 10 4 10 6C10 8.5 12 10.5 12 12C12 13.5 10.5 15 9 15C7.5 15 6 13.5 6 12C6 9.5 8.5 7 8.5 7C8.5 7 4 8.5 4 13C4 17.5 7.5 21 12 21C16.5 21 20 17.5 20 13C20 8.5 15.5 7 15.5 7C15.5 7 12 2 12 2Z"/>
                            </svg>
                        </div>
                        <div>
                            <div className="text-[6.5px] font-pixel text-slate-400 tracking-wider">AVAILABLE SILVER ESSENCE</div>
                            <div className="text-base font-pixel text-yellow-400 mt-0" style={{ textShadow: '0 0 8px rgba(250,204,21,0.45)' }}>
                                {experience} <span className="text-[8px] text-red-500">XP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom 2x2 modular upgrade table */}
                <div className="w-full grid grid-cols-2 gap-3 mb-4">
                    <UpgradeCard 
                        label="Sanguine Vigor"
                        description="Expand the core vessel of thy bloodline, allowing thee to shatter physical blows and endure deeper wounds."
                        level={upgrades.maxHealth}
                        maxLevel={C.UPGRADE_COSTS.maxHealth.length}
                        cost={C.UPGRADE_COSTS.maxHealth[upgrades.maxHealth]}
                        xp={experience}
                        icon={<HeartIcon />}
                        onPurchase={() => onPurchase('maxHealth')}
                    />
                    <UpgradeCard 
                        label="Coven Spellfire"
                        description="Deepen thy shadow mana wells to channel supplementary spectral daggers and magical blasts."
                        level={upgrades.maxMana}
                        maxLevel={C.UPGRADE_COSTS.maxMana.length}
                        cost={C.UPGRADE_COSTS.maxMana[upgrades.maxMana]}
                        xp={experience}
                        icon={<ManaIcon />}
                        onPurchase={() => onPurchase('maxMana')}
                    />
                    <UpgradeCard 
                        label="Sanguine Razors"
                        description="Alchemically forge thy physical throwing daggers to carve through thick armour and demonic flesh."
                        level={upgrades.daggerDamage}
                        maxLevel={C.UPGRADE_COSTS.daggerDamage.length}
                        cost={C.UPGRADE_COSTS.daggerDamage[upgrades.daggerDamage]}
                        xp={experience}
                        icon={<DaggerIcon />}
                        onPurchase={() => onPurchase('daggerDamage')}
                    />
                    <UpgradeCard 
                        label="Beast Fury"
                        description="Unshackle thy primal beast-strains. Unleash devastating savage slash sweeps inside the werewolf state."
                        level={upgrades.clawDamage}
                        maxLevel={C.UPGRADE_COSTS.clawDamage.length}
                        cost={C.UPGRADE_COSTS.clawDamage[upgrades.clawDamage]}
                        xp={experience}
                        icon={<ClawIcon />}
                        onPurchase={() => onPurchase('clawDamage')}
                    />
                </div>

                {/* Magnificent high-end continue action bar */}
                <div>
                    <button
                        onClick={onContinue}
                        className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-red-900 hover:border-red-500 text-red-200 hover:text-white font-pixel text-[8px] py-2.5 px-10 tracking-[0.25em] uppercase shadow-[0_4px_20px_rgba(220,10,10,0.15)] hover:shadow-[0_4px_30px_rgba(220,10,10,0.45)] cursor-pointer active:scale-95 transition-all duration-300 overflow-hidden"
                    >
                        {/* Metal Sweep Shimmer Effect */}
                        <div className="absolute inset-y-0 -left-[100%] w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[25deg]" 
                             style={{
                                 animation: 'shimmer 2.2s infinite ease-in-out'
                             }}
                        />
                        
                        <span className="relative z-10 flex items-center gap-2.5">
                            PROCEED INTO NIGHT
                            <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PauseScreenProps {
    isMuted: boolean;
    onToggleMute: () => void;
    onResume: () => void;
}

export const PauseScreen: React.FC<PauseScreenProps> = ({ isMuted, onToggleMute, onResume }) => (
    <div className="absolute inset-0 bg-black/45 backdrop-blur-[4px] flex flex-col justify-center items-center z-30 transition-all duration-300 pointer-events-auto select-none">
        <GothicStyleTag />
        <div className="p-5 md:p-6 bg-gradient-to-b from-slate-950/75 via-slate-900/75 to-slate-950/75 border border-red-900/40 rounded shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-md max-w-sm w-full mx-4 text-center select-none font-pixel border-2">
            
            {/* Runic boundary marker diamonds */}
            <div className="relative">
                <span className="absolute -top-3 -left-3 text-red-900/30 text-[8px]">◆</span>
                <span className="absolute -top-3 -right-3 text-red-900/30 text-[8px]">◆</span>
            </div>

            <h2 className="text-sm md:text-base text-red-500 tracking-widest mb-1 animate-pulse" style={{ textShadow: '0 0 12px rgba(239, 68, 68, 0.75)' }}>
                NIGHT SUSPENDED
            </h2>
            <p className="text-[6.5px] text-slate-500 uppercase tracking-widest mb-3 italic">
                The hunt halts under a dormant blood moon.
            </p>
            
            <div className="h-[2px] bg-gradient-to-r from-transparent via-slate-800 to-transparent w-full mb-4" />

            {/* Combat Controls Codex */}
            <div className="bg-slate-950/50 border border-slate-800/50 p-3 rounded mb-4 text-left backdrop-blur-sm">
                <div className="text-[7.5px] text-red-400 font-bold border-b border-slate-900 pb-1 mb-2 tracking-wider flex justify-between items-center">
                    <span>HUNTER'S COMBAT CODEX</span>
                    <span className="text-slate-600 text-[6px]">KEYS</span>
                </div>
                
                <div className="flex flex-col gap-1.5 text-[7px] leading-relaxed text-slate-400">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                        <span className="text-slate-500">MOVE</span>
                        <span className="text-slate-300 font-bold uppercase">WASD / ARROWS</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                        <span className="text-slate-500">DOUBLE LEAP</span>
                        <span className="text-slate-300 font-bold uppercase">SPACE / W</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                        <span className="text-slate-500">CLAW / SLASH</span>
                        <span className="text-slate-300 font-bold uppercase">KEY [ J ]</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                        <span className="text-slate-500">THROW DAGGER</span>
                        <span className="text-slate-300 font-bold uppercase">KEY [ K ]</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                        <span className="text-slate-500">PARRY COUNTER</span>
                        <span className="text-slate-300 font-bold uppercase">KEY [ H ]</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                        <span className="text-slate-500">SHADOW DASH</span>
                        <span className="text-slate-300 font-bold uppercase">KEY [ S ]</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500">CHARGED BLAST</span>
                        <span className="text-slate-300 font-bold uppercase">KEY [ L ] (HOLD)</span>
                    </div>
                </div>
            </div>

            {/* Quick Interactive Toggles Group */}
            <div className="flex flex-col gap-2 w-full pt-1">
                <button 
                    onClick={onToggleMute}
                    className="w-full text-left py-2 px-3 border border-slate-800 hover:border-slate-700 bg-slate-950/70 hover:bg-slate-900 text-[7.5px] text-yellow-500 hover:text-yellow-400 transition-all flex items-center justify-between cursor-pointer focus:outline-none rounded pointer-events-auto"
                >
                    <span className="tracking-wider uppercase">AUDIO EMISSION:</span>
                    <span className="text-white font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {isMuted ? 'OFF (MUTED) [M]' : 'ON (PLAYING) [M]'}
                    </span>
                </button>

                <button 
                    onClick={onResume}
                    className="w-full text-center py-2 px-3 border border-red-900/40 hover:border-red-600 bg-red-950/20 hover:bg-red-950/50 text-[8px] text-red-400 hover:text-red-300 transition-all cursor-pointer font-bold uppercase select-none focus:outline-none rounded tracking-widest mt-1 animate-pulse pointer-events-auto"
                >
                    RESUME THE HUNT [P]
                </button>
            </div>
            
            {/* Corner diamond markers bottom */}
            <div className="relative">
                <span className="absolute -bottom-3 -left-3 text-red-900/30 text-[8px]">◆</span>
                <span className="absolute -bottom-3 -right-3 text-red-900/30 text-[8px]">◆</span>
            </div>
        </div>
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
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[4px] flex flex-col justify-center items-center z-40 p-5 text-white overflow-hidden select-none">
            <GothicStyleTag />
            <GothicEmbers />
            
            <div className="absolute inset-0 bg-red-950/5 blur-3xl pointer-events-none rounded blood-vapor z-0" />

            <div className="relative z-10 w-full max-w-xl p-5 md:p-7 bg-gradient-to-b from-slate-950/75 via-slate-900/75 to-slate-950/75 border border-red-900/30 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-md flex flex-col max-h-[92vh]">
                
                {/* Runic corner diamond items */}
                <span className="absolute top-2.5 left-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>
                <span className="absolute top-2.5 right-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>
                <span className="absolute bottom-2.5 left-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>
                <span className="absolute bottom-2.5 right-2.5 text-red-900/70 font-pixel text-[8px]">◆</span>

                {/* Header */}
                <div className="text-center mb-4">
                    <h2 className="text-xl text-yellow-500 font-pixel tracking-wider mb-1" style={{ textShadow: '0 0 10px rgba(250,204,21,0.35)' }}>
                        ALCHEMICAL CODEX
                    </h2>
                    <div className="text-[7px] font-pixel text-slate-500 tracking-widest uppercase">Combat & Mobility Directives</div>
                </div>

                {/* Main controls grid box */}
                <div className="flex-1 overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-slate-900/80 gap-y-2 pb-2 mr-[-4px]" style={{ maxHeight: '52vh' }}>
                    
                    {/* MOVEMENT SECTION */}
                    <div className="text-[8.5px] font-pixel text-cyan-400 tracking-wider mb-2 mt-1 border-b border-cyan-950 pb-1.5 uppercase">
                        MOBILITY & NAVIGATION
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9.5px] tracking-wide mb-3">
                        <ControlRow
                            action="Move Left / Right"
                            keys={<><KeyCap>A</KeyCap><KeyCap>D</KeyCap> / <KeyCap>←</KeyCap><KeyCap>→</KeyCap></>}
                            description="Travel the fog-choked streets. Your character faces the movement vector."
                        />
                         <ControlRow
                            action="Jump / Leap"
                            keys={<><KeyCap>Space</KeyCap> / <KeyCap>W</KeyCap> / <KeyCap>↑</KeyCap></>}
                            description="Leap over death hazards. Press again mid-air to execute Double Jump."
                        />
                         <ControlRow
                            action="Wall Slide / Jump"
                            keys={<>(Towards Wall)</>}
                            description="Gracefully slide down walls; press Leap to bound off wall surfaces."
                        />
                    </div>

                    {/* COMBAT OPTIONS */}
                    <div className="text-[8.5px] font-pixel text-red-400 tracking-wider mb-2 mt-3 border-b border-red-950 pb-1.5 uppercase">
                        ESSENCE COMMUNE & ATTACKS
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9.5px] tracking-wide">
                        <ControlRow
                            action="Melee Strike"
                            keys={<KeyCap>J</KeyCap>}
                            description="Flicker-fast dagger slash. Transmute into heavy claw sweep during Beast form."
                        />
                        <ControlRow
                            action="Cast Spectral Razor"
                            keys={<KeyCap>K</KeyCap>}
                            description="Throw a piercing spectral throwing dagger. Consumes 10 Mana."
                        />
                        <ControlRow
                            action="Shadow Dash"
                            keys={<KeyCap>S</KeyCap>}
                            description="Surge forward with brief invincibility frame. Consumes 8 Mana."
                        />
                        <ControlRow
                            action="Corrupt Parry"
                            keys={<KeyCap>H</KeyCap>}
                            description="Brief defensive stance. Absorbs force, staggers enemies, regains 15 Mana."
                        />
                        <ControlRow
                            action="Charged Blast"
                            keys={<>Hold <KeyCap>L</KeyCap></>}
                            description="Accumulate blood essence; release a catastrophic AoE spell. Consumes Mana."
                        />
                    </div>
                </div>

                {/* Back Button styled cleanly */}
                <div className="mt-4 border-t border-slate-950 pt-3 flex justify-center">
                    <button
                        onClick={onBack}
                        className="group relative bg-[#090a10] border border-red-950 hover:border-red-500 text-red-400 hover:text-white font-pixel text-[8px] py-2.5 px-10 tracking-[0.2em] uppercase cursor-pointer active:scale-95 transition-all duration-200 overflow-hidden"
                    >
                        <span className="relative z-10">RETREAT TO ARCHIVES</span>
                    </button>
                </div>
            </div>
        </div>
    );
};