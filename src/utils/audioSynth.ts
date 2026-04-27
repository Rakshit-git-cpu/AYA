export class SoundSynthesizer {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private musicGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;

    private isPlayingMusic: boolean = false;
    private bgAudio: HTMLAudioElement | null = null;
    private targetMusicVol: number = 0.5;
    private musicFadeInterval: number | null = null;

    // "Candy" Pentatonic Scale (C Major Pentatonic: C, D, E, G, A)
    // C4, D4, E4, G4, A4, C5, D5, E5
    private scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

    constructor() {
        // Initialize lazily
    }

    public init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = 1.0;
            this.masterGain.connect(this.ctx.destination);

            // Channel Gains
            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.value = 0.5; // Default
            this.musicGain.connect(this.masterGain);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.value = 0.8; // Default
            this.sfxGain.connect(this.masterGain);
        }
        
        if (!this.bgAudio) {
            this.bgAudio = new Audio('/assets/bg-music.mp3');
            this.bgAudio.loop = true;
            this.bgAudio.volume = 0;

            // Mobile Unlock Hack: Play and immediately pause if not needed
            this.bgAudio.play().then(() => {
                if (!this.isPlayingMusic && this.bgAudio) {
                    this.bgAudio.pause();
                }
            }).catch(() => { /* expected if no user gesture */ });
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(e => console.warn("Audio resume failed", e));
        }
    }

    private getMappedVolume(linearVol: number): number {
        // Cap max volume to 25% of the MP3's raw volume so it stays in the background
        return linearVol * 0.25;
    }

    public setMusicVolume(vol: number) {
        this.targetMusicVol = Math.max(0, Math.min(1, vol));
        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setTargetAtTime(this.targetMusicVol, this.ctx.currentTime, 0.1);
        }
        
        // Instant update if we are playing to make the slider responsive
        if (this.bgAudio && this.isPlayingMusic) {
            if (this.musicFadeInterval) {
                window.clearInterval(this.musicFadeInterval);
                this.musicFadeInterval = null;
            }
            this.bgAudio.volume = this.getMappedVolume(this.targetMusicVol);
        }
    }

    public setSfxVolume(vol: number) {
        if (this.sfxGain) {
            this.sfxGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx?.currentTime || 0, 0.1);
        }
    }

    // --- SFX ---

    public playSparkle() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        // Play 2-3 overlapping high notes for a "glitter" effect
        const count = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < count; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.type = 'sine';
            // High pitch, random pentatonic note
            const freq = this.scale[4 + Math.floor(Math.random() * 4)] * 2; // High octave
            osc.frequency.setValueAtTime(freq, now + (i * 0.05));

            // Short envelope
            gain.gain.setValueAtTime(0, now + (i * 0.05));
            gain.gain.linearRampToValueAtTime(0.1, now + (i * 0.05) + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.05) + 0.3);

            osc.start(now + (i * 0.05));
            osc.stop(now + (i * 0.05) + 0.4);
        }
    }

    public playHover() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05); // Very quiet
        gain.gain.linearRampToValueAtTime(0, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    public playSwoosh() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1); // Use a fixed value as sfxVolume is not a property
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    public playClick() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.sfxGain);

        // Bubble Pop Sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    public playSuccess() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;

        // Play a major triad arpeggio
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.connect(gain);
            gain.connect(this.sfxGain!);

            osc.type = 'sine';
            osc.frequency.value = freq;

            const time = now + (i * 0.1);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

            osc.start(time);
            osc.stop(time + 0.6);
        });
    }

    // --- MUSIC SEQUENCER ---

    public startMusic() {
        if (this.isPlayingMusic) return;
        this.init();
        this.isPlayingMusic = true;
        
        if (this.bgAudio) {
            if (this.musicFadeInterval) {
                window.clearInterval(this.musicFadeInterval);
                this.musicFadeInterval = null;
            }
            
            const target = this.getMappedVolume(this.targetMusicVol);
            
            if (this.bgAudio.paused) {
                this.bgAudio.volume = 0;
                this.bgAudio.play().catch(console.warn);
            }
            
            this.musicFadeInterval = window.setInterval(() => {
                if (!this.bgAudio) return;
                this.bgAudio.volume = Math.min(target, this.bgAudio.volume + 0.05);
                if (this.bgAudio.volume >= target) {
                    window.clearInterval(this.musicFadeInterval!);
                    this.musicFadeInterval = null;
                }
            }, 100);
        }
    }

    public stopMusic() {
        if (!this.isPlayingMusic) return;
        this.isPlayingMusic = false;
        
        if (this.bgAudio) {
            if (this.musicFadeInterval) {
                window.clearInterval(this.musicFadeInterval);
                this.musicFadeInterval = null;
            }
            
            this.musicFadeInterval = window.setInterval(() => {
                if (!this.bgAudio) return;
                this.bgAudio.volume = Math.max(0, this.bgAudio.volume - 0.05);
                if (this.bgAudio.volume <= 0) {
                    this.bgAudio.pause();
                    window.clearInterval(this.musicFadeInterval!);
                    this.musicFadeInterval = null;
                }
            }, 100);
        }
    }

    public playWin() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;
        // Big Chord C Major Add 9
        const now = this.ctx.currentTime;
        [261.63, 329.63, 392.00, 493.88, 523.25].forEach((freq) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            osc.start(now);
            osc.stop(now + 2.0);
        });
    }

    public playLevelComplete() {
        this.playSuccess();
    }
}

export const audioSynth = new SoundSynthesizer();
