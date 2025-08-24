
import React from 'react';

interface IntroScreenProps {
    onStartGame: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStartGame }) => {
    return (
        <div className="max-w-7xl mx-auto p-5">
            <header className="text-center py-8 border-b-2 border-[#4a4a8a] mb-8 bg-black/30 rounded-lg shadow-2xl shadow-[#4a4a8a]/30 relative">
                <h1 className="text-5xl font-bold text-[#ff6b6b] mb-2" style={{ textShadow: '3px 3px 0 #8b0000, 6px 6px 0 rgba(0,0,0,0.5)' }}>VEINS OF SILVER</h1>
                <h2 className="text-xl text-slate-400 mb-4">SHADOWS UNBOUND</h2>
                <p className="italic text-yellow-400 text-lg">A Pixelated 2D Action-Platformer</p>
                 <button 
                    onClick={onStartGame} 
                    className="mt-6 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 px-8 uppercase tracking-widest shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                    Play Demo
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <Section title="The Protagonist">
                    <CharacterCard icon="TC" name="TESSA COLE" description="Young woman with a cursed hybrid bloodline. Wields daggers and an ancient pendant." />
                    <div className="flex justify-center my-5 bg-black/30 p-4 border-2 border-yellow-400 rounded-md">
                        <pre className="font-mono text-slate-300 text-lg leading-tight text-center">
{`    ████
   █░░░░█
  ██░░░░██
    █░░█
   ██████
  █ ████ █
 █  █  █  █
    █  █
   ██  ██`}
                        </pre>
                    </div>
                    <p>Born with a rare <span className="text-yellow-400 font-bold">"silver-veined"</span> hybrid bloodline (human, lycan, vampire elements). Hunted by the Vampire Council who sees her as an abomination.</p>
                </Section>
                <Section title="Key Item">
                    <CharacterCard icon="Ⓟ" name="THE PENDANT" description="Obsidian pendant veined with silver. Source of ancestral magic and memory." />
                    <PixelArt>
{`░░░░░░░░
░░████░░
░██████░
░██████░
░░████░░
░░░██░░░
░░░██░░░
░░░██░░░`}
                    </PixelArt>
                    <p>Acts as a key, anchor, and conduit for ancestral magic. Can glow, pulse, generate energy bursts, and trigger visions.</p>
                </Section>
            </div>

            <Section title="Combat & Abilities">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                    <AbilityCard name="DAGGER STRIKES" description="Agile melee attacks with combo potential. Evolves into a unique blade as the story progresses." />
                    <AbilityCard name="CLAW ATTACKS" description="Lycan blood manifests as brutal melee damage. Initially uncontrollable, later mastered." />
                    <AbilityCard name="PENDANT BURSTS" description="Projectile energy attacks or close-range radial blasts powered by ancestral magic." />
                    <AbilityCard name="HYBRID SHIFTS" description="Partial transformations that increase strength/speed. Eyes glow amber/silver during power surges." />
                    <AbilityCard name="GLYPH INTERACTION" description="Read and affect ancient magical constructs. Essential for puzzle-solving and progression." />
                    <AbilityCard name="BLOOD MEMORIES" description="Vision triggers that reveal lore and hidden paths. Connected to the pendant and ancestry." />
                </div>
            </Section>

            <Section title="World & Locations">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                    <LocationCard name="BLACKSPIRE CITY" description="Dystopian surface with ruined districts and Council patrols." />
                    <LocationCard name="SEWER TUNNELS" description="Initial escape routes infested with lesser foes." />
                    <LocationCard name="SANCTUARY" description="Hidden lycan stronghold, safe zone for rebels." />
                    <LocationCard name="THE HOLLOW" description="Ancient labyrinth with memory vaults and the Buried Heart." />
                    <LocationCard name="CITADEL" description="Council stronghold with Mirror Library and Archive of Seals." />
                    <LocationCard name="MOONSPIRE CHAPEL" description="Final confrontation site where the Council attempts to renew the Rite." />
                </div>
            </Section>
            
            <Section title="Key Characters">
                <CharacterCard icon="I" name="ISOLDE" description="Former Council enforcer, Tessa's mentor and love interest. Expert in stealth and wards." />
                <CharacterCard icon="D" name="DECLAN" description="Lycan rebel leader. Pragmatic ally who provides tactical support." />
                <CharacterCard icon="V" name="VALEN" description="Council Handler. Cunning enforcer and recurring boss with psychological tactics." />
                <CharacterCard icon="R" name="REGENT LORD DAMARIS" description="High-ranking Councilor. Main antagonist seeking to renew the ancient Rite." />
            </Section>

            <Section title="Narrative Arc">
                <div className="relative mt-5 pl-8 border-l-[3px] border-[#4dccbd]">
                    <TimelineItem title="AWAKENING & ESCAPE" description="Tessa's life shattered by vampire attacks. Hybrid powers awaken. Isolde saves her." />
                    <TimelineItem title="SEEKING ANSWERS" description="Journey through tunnels. Encounter rebels at Sanctuary. First public broadcast." />
                    <TimelineItem title="UNVEILING THE TRUTH" description="Access blood memories and ancient archives. Discover Council's plan to renew the Rite." />
                    <TimelineItem title="REBELLION & BREAKTHROUGH" description="Inspire rebellion. Infiltrate strongholds. Confront Damaris and collapse the Council." />
                    <TimelineItem title="THE UNBOUND WORLD" description="Curse broken. City descends into chaos. Confront entity in Buried Heart. New order emerges." />
                </div>
            </Section>

            <footer className="text-center py-8 border-t-2 border-[#4a4a8a] mt-10 text-slate-400">
                 <button 
                    onClick={onStartGame} 
                    className="mb-8 bg-gradient-to-r from-red-600 to-red-800 text-white font-bold py-3 px-8 uppercase tracking-widest shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                    Play Demo
                </button>
                <p>VEINS OF SILVER: SHADOWS UNBOUND | A Castlevania-inspired 2D Action-Platformer</p>
                <p className="text-sm mt-2">Inspired by the rich lore and atmospheric storytelling of classic gothic horror games</p>
            </footer>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-[#1e1e2e]/80 border border-[#4a4a8a] rounded-lg p-6 shadow-lg shadow-black/50 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#4a4a8a]/40">
        <h2 className="text-3xl text-[#4dccbd] mb-5 pb-3 border-b-2 border-[#4a4a8a]" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.3)' }}>{title}</h2>
        {children}
    </div>
);

const CharacterCard: React.FC<{ icon: string; name: string; description: string }> = ({ icon, name, description }) => (
    <div className="flex items-center mb-5 p-4 bg-black/30 rounded-lg border-l-4 border-[#ff6b6b]">
        <div className="w-16 h-16 bg-gradient-to-br from-[#ff6b6b] to-[#8b0000] rounded-full flex items-center justify-center mr-4 text-2xl font-bold flex-shrink-0">{icon}</div>
        <div>
            <h3 className="text-yellow-400 text-xl">{name}</h3>
            <p className="text-sm text-slate-300">{description}</p>
        </div>
    </div>
);

const PixelArt: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="font-mono bg-black text-[#00ff00] p-4 border-2 border-[#00ff00] rounded-md my-5 text-sm leading-tight overflow-x-auto">
        {children}
    </pre>
);

const AbilityCard: React.FC<{ name: string; description: string }> = ({ name, description }) => (
    <div className="bg-black/40 border border-[#4dccbd] rounded-lg p-4 transition-all duration-300 hover:bg-[#4dccbd]/20 hover:scale-105">
        <div className="text-[#4dccbd] font-bold text-lg mb-2">{name}</div>
        <p className="text-sm text-slate-300">{description}</p>
    </div>
);

const LocationCard: React.FC<{ name: string; description: string }> = ({ name, description }) => (
    <div className="bg-black/40 border border-yellow-400 rounded-lg p-4 text-center transition-all duration-300 hover:bg-yellow-400/20 hover:scale-105">
        <div className="text-yellow-400 font-bold mb-2">{name}</div>
        <p className="text-sm text-slate-300">{description}</p>
    </div>
);

const TimelineItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="mb-6 relative">
         <div className="absolute -left-[39px] top-1.5 w-4 h-4 bg-[#4dccbd] rounded-full border-[3px] border-[#1a1a2e]"></div>
        <h3 className="text-yellow-400 font-bold">{title}</h3>
        <p className="text-sm">{description}</p>
    </div>
);

export default IntroScreen;