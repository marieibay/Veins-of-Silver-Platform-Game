
import React from 'react';

interface LandingPageProps {
    onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="game-container" style={{ fontFamily: "'Courier New', monospace" }}>
            <header className="header">
                <h1 className="title">VEINS OF SILVER</h1>
                <h2 className="subtitle">SHADOWS UNBOUND</h2>
                <p className="tagline">A Pixelated 2D Action-Platformer</p>
            </header>

            <div className="content-grid">
                <div className="section">
                    <h2 className="section-title">THE PROTAGONIST</h2>
                    <div className="character-card">
                        <div className="character-icon">TC</div>
                        <div className="character-info">
                            <h3>TESSA COLE</h3>
                            <p>Young woman with a cursed hybrid bloodline. Wields daggers and an ancient pendant.</p>
                        </div>
                    </div>
                    
                    <div className="pixel-art">
                        ████████████████████<br />
                        ████████████████████<br />
                        ██░░░░░░░░░░░░░░░░██<br />
                        ██░░████████████░░██<br />
                        ██░░████████████░░██<br />
                        ██░░░░░░░░░░░░░░░░██<br />
                        ████████████████████<br />
                        ████████████████████
                    </div>
                    
                    <p>Born with a rare <span className="highlight">"silver-veined"</span> hybrid bloodline (human, lycan, vampire elements). Hunted by the Vampire Council who sees her as an abomination.</p>
                </div>

                <div className="section">
                    <h2 className="section-title">KEY ITEM</h2>
                    <div className="character-card">
                        <div className="character-icon">Ⓟ</div>
                        <div className="character-info">
                            <h3>THE PENDANT</h3>
                            <p>Obsidian pendant veined with silver. Source of ancestral magic and memory.</p>
                        </div>
                    </div>
                    
                    <div className="pixel-art">
                        ░░░░░░░░<br />
                        ░░████░░<br />
                        ░██████░<br />
                        ░██████░<br />
                        ░░████░░<br />
                        ░░░██░░░<br />
                        ░░░██░░░<br />
                        ░░░██░░░
                    </div>
                    
                    <p>Acts as a key, anchor, and conduit for ancestral magic. Can glow, pulse, generate energy bursts, and trigger visions.</p>
                </div>
            </div>

            <div className="section">
                <h2 className="section-title">COMBAT & ABILITIES</h2>
                <div className="ability-grid">
                    <div className="ability-card">
                        <div className="ability-name">DAGGER STRIKES</div>
                        <p>Agile melee attacks with combo potential. Evolves into a unique blade as the story progresses.</p>
                    </div>
                    <div className="ability-card">
                        <div className="ability-name">CLAW ATTACKS</div>
                        <p>Lycan blood manifests as brutal melee damage. Initially uncontrollable, later mastered.</p>
                    </div>
                    <div className="ability-card">
                        <div className="ability-name">PENDANT BURSTS</div>
                        <p>Projectile energy attacks or close-range radial blasts powered by ancestral magic.</p>
                    </div>
                    <div className="ability-card">
                        <div className="ability-name">HYBRID SHIFTS</div>
                        <p>Partial transformations that increase strength/speed. Eyes glow amber/silver during power surges.</p>
                    </div>
                    <div className="ability-card">
                        <div className="ability-name">GLYPH INTERACTION</div>
                        <p>Read and affect ancient magical constructs. Essential for puzzle-solving and progression.</p>
                    </div>
                    <div className="ability-card">
                        <div className="ability-name">BLOOD MEMORIES</div>
                        <p>Vision triggers that reveal lore and hidden paths. Connected to the pendant and ancestry.</p>
                    </div>
                </div>
            </div>
            
            <div className="section" style={{marginTop: '30px'}}>
                <h2 className="section-title">PLAY THE DEMO</h2>
                <p className="subtitle" style={{ fontFamily: "'Press Start 2P', cursive", color: '#a0a0c0', textAlign: 'center', padding: '0 20px 20px 20px', fontSize: '0.9rem', lineHeight: '1.8' }}>
                    Hunted by a corrupt Council, you must rely on your forbidden bloodline and the aid of a rogue vampire, Isolde, to survive. Can you master your powers and uncover the truth before the shadows consume you?
                </p>
                <div style={{ textAlign: 'center' }}>
                    <button onClick={onStart} className="start-game-button">
                        Start Game
                    </button>
                </div>
            </div>

            <footer className="footer">
                <p>VEINS OF SILVER: SHADOWS UNBOUND | A Castlevania-inspired 2D Action-Platformer</p>
            </footer>
        </div>
    );
};

export default LandingPage;