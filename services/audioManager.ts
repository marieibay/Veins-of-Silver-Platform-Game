

// A simple audio manager to handle sound effects and music.
// Sounds are generated programmatically using the Web Audio API.

type SoundName = 'jump' | 'daggerAttack' | 'clawAttack' | 'enemyHit' | 'enemyDefeated' | 'playerHurt' | 'powerUp' | 'daggerThrow' | 'isoldeAssist' | 'upgrade' | 'gameOver' | 'enemyShoot' | 'chargeStart' | 'chargeRelease';

class AudioManager {
    private audioContext: AudioContext | null = null;
    private _isMuted: boolean = false;
    private masterGain: GainNode | null = null;
    private musicSource: AudioBufferSourceNode | null = null;
    private currentTrackBuffer: AudioBuffer | null = null;
    
    private titleMusicBuffer: AudioBuffer | null = null;
    private isTitleMusicLoading: boolean = false;

    private musicBuffer: AudioBuffer | null = null;
    private isMusicLoading: boolean = false;
    
    private musicBuffer2: AudioBuffer | null = null;
    private isMusic2Loading: boolean = false;

    private bossMusicBuffer: AudioBuffer | null = null;
    private isBossMusicLoading: boolean = false;

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
                this.masterGain = this.audioContext.createGain();
                this.masterGain.connect(this.audioContext.destination);
                if (this._isMuted) {
                    this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
                }
            } else {
                 console.warn("Web Audio API is not supported in this browser.");
            }
        } catch (e) {
            console.error("Could not create audio context", e);
        }
    }

    public pauseMusic() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    public resumeMusic() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    private async loadTitleMusic() {
        if (!this.audioContext || this.titleMusicBuffer || this.isTitleMusicLoading) return;
        
        this.isTitleMusicLoading = true;
        try {
            const response = await fetch('/opener.mp3');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            this.titleMusicBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error(`Failed to load music from /opener.mp3`, e);
        } finally {
            this.isTitleMusicLoading = false;
        }
    }

    private async loadRegularMusic() {
        if (!this.audioContext || this.musicBuffer || this.isMusicLoading) return;
        
        this.isMusicLoading = true;
        try {
            const response = await fetch('/background-music.mp3');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            this.musicBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error(`Failed to load music from /background-music.mp3`, e);
        } finally {
            this.isMusicLoading = false;
        }
    }
    
    private async loadRegularMusic2() {
        if (!this.audioContext || this.musicBuffer2 || this.isMusic2Loading) return;
        
        this.isMusic2Loading = true;
        try {
            const response = await fetch('/background-music-2.mp3');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            this.musicBuffer2 = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error(`Failed to load music from /background-music-2.mp3`, e);
        } finally {
            this.isMusic2Loading = false;
        }
    }

    private async loadBossMusic() {
        if (!this.audioContext || this.bossMusicBuffer || this.isBossMusicLoading) return;
        
        this.isBossMusicLoading = true;
        try {
            const response = await fetch('/boss-music.mp3');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            this.bossMusicBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error(`Failed to load music from /boss-music.mp3`, e);
        } finally {
            this.isBossMusicLoading = false;
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
        if (!this.audioContext || !this.masterGain) return;
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        const startTime = this.audioContext.currentTime + (options.delay || 0);
        
        gainNode.connect(this.masterGain);
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
        if (!this.audioContext || !this.masterGain) return;
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
        gainNode.connect(this.masterGain);
        noise.start();
    }


    playSFX(name: SoundName) {
        if (this._isMuted) return;
        
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
            case 'daggerThrow':
                this.playNoise(0.15, 0.2, 3.0);
                break;
            case 'isoldeAssist':
                this.playNoise(0.3, 0.4, 5.0);
                this.playSound('sawtooth', 1000, 0.3, 0.1, { frequencyEnd: 200 });
                break;
            case 'upgrade':
                this.playSound('sine', 587, 0.1, 0.3, { frequencyEnd: 783 });
                this.playSound('sine', 880, 0.2, 0.3, { frequencyEnd: 1174, delay: 0.1 });
                break;
            case 'enemyShoot':
                this.playSound('square', 300, 0.2, 0.2, { frequencyEnd: 150 });
                break;
            case 'chargeStart':
                this.playSound('sine', 100, 0.3, 0.2, { frequencyEnd: 150 });
                break;
            case 'chargeRelease':
                this.playNoise(0.5, 0.6, 1.0);
                this.playSound('square', 80, 0.4, 0.4, { frequencyEnd: 40 });
                break;
            case 'gameOver':
                // A longer, more dramatic sound with a descending arpeggio and a final low drone.
                this.playSound('triangle', 415, 0.4, 0.3, { frequencyEnd: 380, delay: 0 }); // G#
                this.playSound('triangle', 330, 0.4, 0.3, { frequencyEnd: 300, delay: 0.3 }); // E
                this.playSound('triangle', 247, 0.4, 0.3, { frequencyEnd: 220, delay: 0.6 }); // B
                // Low, long, final note
                this.playSound('sawtooth', 100, 1.5, 0.5, { frequencyEnd: 40, delay: 0.9 });
                break;
        }
    }

    public async playTitleMusic() {
        this.initializeAudioContext();
        if (!this.audioContext || !this.masterGain) return;
        
        await this.loadTitleMusic();
        if (!this.titleMusicBuffer) return;

        // If the correct music is already loaded and we're just paused, resume.
        if (this.musicSource && this.currentTrackBuffer === this.titleMusicBuffer && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
            return;
        }

        // If this music is already playing, do nothing.
        if (this.musicSource && this.currentTrackBuffer === this.titleMusicBuffer && this.audioContext.state === 'running') {
            return;
        }

        this.stopMusic();
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.musicSource = this.audioContext.createBufferSource();
        this.musicSource.buffer = this.titleMusicBuffer;
        this.currentTrackBuffer = this.titleMusicBuffer;
        this.musicSource.loop = true;
        
        const musicGain = this.audioContext.createGain();
        musicGain.gain.value = 0.4;
        
        this.musicSource.connect(musicGain);
        musicGain.connect(this.masterGain);
        this.musicSource.start();
    }

    async playMusic() {
        this.initializeAudioContext();
        if (!this.audioContext || !this.masterGain) return;
        
        await this.loadRegularMusic();
        if (!this.musicBuffer) return;

        // If the correct music is already loaded and we're just paused, resume.
        if (this.musicSource && this.currentTrackBuffer === this.musicBuffer && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
            return;
        }

        // If this music is already playing, do nothing.
        if (this.musicSource && this.currentTrackBuffer === this.musicBuffer && this.audioContext.state === 'running') {
            return;
        }

        this.stopMusic();
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.musicSource = this.audioContext.createBufferSource();
        this.musicSource.buffer = this.musicBuffer;
        this.currentTrackBuffer = this.musicBuffer;
        this.musicSource.loop = true;
        
        const musicGain = this.audioContext.createGain();
        musicGain.gain.value = 0.4;
        
        this.musicSource.connect(musicGain);
        musicGain.connect(this.masterGain);
        this.musicSource.start();
    }
    
    async playMusic2() {
        this.initializeAudioContext();
        if (!this.audioContext || !this.masterGain) return;
        
        await this.loadRegularMusic2();
        if (!this.musicBuffer2) return;

        if (this.musicSource && this.currentTrackBuffer === this.musicBuffer2 && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
            return;
        }

        if (this.musicSource && this.currentTrackBuffer === this.musicBuffer2 && this.audioContext.state === 'running') {
            return;
        }

        this.stopMusic();
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.musicSource = this.audioContext.createBufferSource();
        this.musicSource.buffer = this.musicBuffer2;
        this.currentTrackBuffer = this.musicBuffer2;
        this.musicSource.loop = true;
        
        const musicGain = this.audioContext.createGain();
        musicGain.gain.value = 0.4;
        
        this.musicSource.connect(musicGain);
        musicGain.connect(this.masterGain);
        this.musicSource.start();
    }
    
    async playBossMusic() {
        this.initializeAudioContext();
        if (!this.audioContext || !this.masterGain) return;

        await this.loadBossMusic();
        if (!this.bossMusicBuffer) return;
        
        // If the correct music is already loaded and we're just paused, resume.
        if (this.musicSource && this.currentTrackBuffer === this.bossMusicBuffer && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
            return;
        }

        // If this music is already playing, do nothing.
        if (this.musicSource && this.currentTrackBuffer === this.bossMusicBuffer && this.audioContext.state === 'running') {
            return;
        }
        
        this.stopMusic();
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.musicSource = this.audioContext.createBufferSource();
        this.musicSource.buffer = this.bossMusicBuffer;
        this.currentTrackBuffer = this.bossMusicBuffer;
        this.musicSource.loop = true;
        
        const musicGain = this.audioContext.createGain();
        musicGain.gain.value = 0.5; // Slightly louder for intensity
        
        this.musicSource.connect(musicGain);
        musicGain.connect(this.masterGain);
        this.musicSource.start();
    }


    stopMusic() {
        // Stop buffered music
        if (this.musicSource) {
            this.musicSource.stop();
            this.musicSource.disconnect();
            this.musicSource = null;
        }
        this.currentTrackBuffer = null;
    }

    toggleMute() {
        this.initializeAudioContext();
        if(!this.audioContext || !this.masterGain) return;
        
        this._isMuted = !this._isMuted;
        
        if (!this._isMuted && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.masterGain.gain.setValueAtTime(this._isMuted ? 0 : 1, this.audioContext.currentTime);
    }

    isMuted(): boolean {
        return this._isMuted;
    }
}

export const audioManager = new AudioManager();