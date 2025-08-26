
// A simple audio manager to handle sound effects and music.
// Sounds are generated programmatically using the Web Audio API.

type SoundName = 'jump' | 'daggerAttack' | 'clawAttack' | 'enemyHit' | 'enemyDefeated' | 'playerHurt' | 'powerUp' | 'pendantCast' | 'isoldeAssist' | 'upgrade';

class AudioManager {
    private audioContext: AudioContext | null = null;
    private _isMuted: boolean = true;

    constructor() {
        // Defer AudioContext creation until a user gesture.
    }
    
    /**
     * Call this on a user gesture, like a button click, to initialize the audio context.
     * This is required by modern browsers' autoplay policies.
     */
    public initializeAudioContext() {
        if (this.audioContext) return;
        try {
            const w = window as any;
            const AudioContext = w.AudioContext || w.webkitAudioContext;
            if (AudioContext) {
                this.audioContext = new AudioContext();
            } else {
                 console.warn("Web Audio API is not supported in this browser.");
            }
        } catch (e) {
            console.error("Could not create audio context", e);
        }
    }

    private playSound(
        type: OscillatorType,
        frequency: number,
        duration: number,
        volume: number = 0.5,
        options: {
            frequencyEnd?: number,
            volumeEnd?: number,
            delay?: number
        } = {}
    ) {
        if (!this.audioContext || this._isMuted) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        const startTime = this.audioContext.currentTime + (options.delay || 0);
        
        gainNode.connect(this.audioContext.destination);
        oscillator.connect(gainNode);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, startTime);
        gainNode.gain.setValueAtTime(volume, startTime);

        if (options.frequencyEnd) {
            oscillator.frequency.linearRampToValueAtTime(options.frequencyEnd, startTime + duration);
        }

        gainNode.gain.exponentialRampToValueAtTime(options.volumeEnd !== undefined ? options.volumeEnd : 0.001, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }
    
     private playNoise(duration: number, volume: number = 0.5, pitch: number = 1.0) {
        if (!this.audioContext || this._isMuted) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;

        const bandpass = this.audioContext.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.value = pitch * 1000;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        noise.connect(bandpass);
        bandpass.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        noise.start();
    }


    playSFX(name: SoundName) {
        if (!this.audioContext || this._isMuted) return;
        
        switch (name) {
            case 'jump':
                this.playSound('sine', 440, 0.1, 0.2, { frequencyEnd: 880 });
                break;
            case 'daggerAttack':
                this.playNoise(0.1, 0.2, 4.0);
                break;
            case 'clawAttack':
                this.playNoise(0.15, 0.3, 2.0);
                this.playSound('square', 100, 0.1, 0.2, { frequencyEnd: 50 });
                break;
            case 'enemyHit':
                this.playSound('square', 220, 0.1, 0.3, { frequencyEnd: 110 });
                break;
            case 'enemyDefeated':
                this.playSound('sawtooth', 300, 0.1, 0.4, { frequencyEnd: 150 });
                this.playSound('sawtooth', 150, 0.2, 0.4, { frequencyEnd: 50, delay: 0.05 });
                break;
            case 'playerHurt':
                this.playSound('sawtooth', 200, 0.2, 0.5, { frequencyEnd: 100 });
                break;
            case 'powerUp':
                this.playSound('triangle', 523, 0.08, 0.3, { frequencyEnd: 659 });
                this.playSound('triangle', 659, 0.08, 0.3, { frequencyEnd: 783, delay: 0.08 });
                this.playSound('triangle', 783, 0.08, 0.3, { frequencyEnd: 1046, delay: 0.16 });
                break;
            case 'pendantCast':
                this.playSound('sine', 880, 0.3, 0.3, { frequencyEnd: 1200 });
                this.playSound('sine', 1318, 0.2, 0.2, { frequencyEnd: 880, delay: 0.05 });
                break;
            case 'isoldeAssist':
                this.playNoise(0.3, 0.4, 5.0);
                this.playSound('sawtooth', 1000, 0.3, 0.1, { frequencyEnd: 200 });
                break;
            case 'upgrade':
                this.playSound('sine', 587, 0.1, 0.3, { frequencyEnd: 783 });
                this.playSound('sine', 880, 0.2, 0.3, { frequencyEnd: 1174, delay: 0.1 });
                break;
        }
    }

    playMusic() {
        this.initializeAudioContext();
        // no-op for now
    }

    stopMusic() {
        // no-op for now
    }

    toggleMute() {
        this._isMuted = !this._isMuted;
        if (!this._isMuted && this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    isMuted(): boolean {
        return this._isMuted;
    }
}

export const audioManager = new AudioManager();
