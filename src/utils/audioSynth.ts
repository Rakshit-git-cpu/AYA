export class SoundSynthesizer {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private musicGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;

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
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(e => console.warn("Audio resume failed", e));
        }
    }

    public setMusicVolume(vol: number) {
        this.targetMusicVol = Math.max(0, Math.min(1, vol));
        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setTargetAtTime(this.targetMusicVol, this.ctx.currentTime, 0.1);
        }
        this.updateMusicFade();
    }

    private updateMusicFade() {
        if (this.musicFadeInterval) {
            window.clearInterval(this.musicFadeInterval);
        }
        if (!this.bgAudio) return;

        const finalVol = this.isPlayingMusic ? this.targetMusicVol : 0;

        this.musicFadeInterval = window.setInterval(() => {
            if (!this.bgAudio) return;
            const diff = finalVol - this.bgAudio.volume;
            if (Math.abs(diff) < 0.05) {
                this.bgAudio.volume = finalVol;
                window.clearInterval(this.musicFadeInterval!);
                if (finalVol === 0 && !this.isPlayingMusic) {
                    this.bgAudio.pause();
                }
            } else {
                this.bgAudio.volume += diff > 0 ? 0.05 : -0.05;
            }
        }, 100);
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
            this.bgAudio.play().catch(console.warn);
        }
        this.updateMusicFade();
    }

    public stopMusic() {
        this.isPlayingMusic = false;
        this.updateMusicFade();
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
