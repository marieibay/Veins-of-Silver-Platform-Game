
// A simple audio manager to handle sound effects and music.
// All audio functionality is temporarily disabled to resolve an error.

type SoundName = 'jump' | 'daggerAttack' | 'clawAttack' | 'enemyHit' | 'enemyDefeated' | 'playerHurt' | 'powerUp' | 'pendantCast' | 'isoldeAssist' | 'upgrade';

class AudioManager {
    private _isMuted: boolean = true;

    constructor() {
        // All audio initializations are removed.
    }

    playSFX(name: SoundName) {
        // no-op
    }

    playMusic() {
        // no-op
    }

    stopMusic() {
        // no-op
    }

    toggleMute() {
        this._isMuted = !this._isMuted;
    }

    isMuted(): boolean {
        return this._isMuted;
    }
}

export const audioManager = new AudioManager();
