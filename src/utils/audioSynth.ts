export class SoundSynthesizer {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private musicGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;

    private glideGain: GainNode | null = null;
    private glideOsc: OscillatorNode | null = null;
    private isGliding: boolean = false;

    private isPlayingMusic: boolean = false;
    private bgAudio: HTMLAudioElement | null = null;
    private targetMusicVol: number = 0.5;
    private musicFadeInterval: number | null = null;

    // "Candy" Pentatonic Scale (C Major Pentatonic: C, D, E, G, A)
    // C4, D4, E4, G4, A4, C5, D5, E5
    private scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

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

            // Glide Channel
            this.glideGain = this.ctx.createGain();
            this.glideGain.gain.value = 0;
            this.glideGain.connect(this.sfxGain);
        }
        // ... rest of init ...

        
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
        // Cap max volume to 15% of the MP3's raw volume so it stays in the background
        return linearVol * 0.15;
    }

    public setMusicVolume(vol: number) {
        this.targetMusicVol = Math.max(0, Math.min(1, vol));
        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setTargetAtTime(this.targetMusicVol, this.ctx.currentTime, 0.1);
        }
        
        // Instant update if we are playing to make the slider responsive
        if (this.bgAudio) {
            if (this.musicFadeInterval) {
                window.clearInterval(this.musicFadeInterval);
                this.musicFadeInterval = null;
            }
            // Apply mapping immediately
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

    public playClick() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Digital Glass Click: Noise pulse + high sine
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1000, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start(now);
        osc.stop(now + 0.1);

        // Add a tiny noise burst for the "crunch"
        const bufferSize = this.ctx.sampleRate * 0.01;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = this.ctx.createBufferSource();
        const noiseGain = this.ctx.createGain();
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.05, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        noise.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noise.start(now);
    }

    public playHover() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Airy Scan Tick: Very short filtered noise
        const bufferSize = this.ctx.sampleRate * 0.02;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = this.ctx.createBufferSource();
        const noiseGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        noise.buffer = buffer;
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3000, now);
        
        noiseGain.gain.setValueAtTime(0, now);
        noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.005);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.sfxGain);
        noise.start(now);
    }

    public playReveal() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Upward Bloom: Sweeping sawtooth with resonance
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.5);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(50, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + 0.4);
        filter.Q.setValueAtTime(10, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start(now);
        osc.stop(now + 0.6);
    }

    public playBack() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Downward Sweep: Soft sine drop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
        
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start(now);
        osc.stop(now + 0.25);
    }

    public playAchievementMinor() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Bright Sparkle: Triad arpeggio with high sine
        [880, 1108.73, 1318.51].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);
            
            gain.gain.setValueAtTime(0, now + i * 0.05);
            gain.gain.linearRampToValueAtTime(0.08, now + i * 0.05 + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.3);
            
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.4);
        });
    }

    public playAchievementMajor() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Cinematic Impact: Sub drop + harmonic glow
        const sub = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(120, now);
        sub.frequency.exponentialRampToValueAtTime(40, now + 0.8);
        subGain.gain.setValueAtTime(0.3, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
        sub.connect(subGain);
        subGain.connect(this.sfxGain);
        sub.start(now);
        sub.stop(now + 1.0);

        // Harmonic series bloom
        [220, 329.63, 440, 554.37, 659.25].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + 0.1);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 1.5);
            
            gain.gain.setValueAtTime(0, now + 0.1);
            gain.gain.linearRampToValueAtTime(0.05, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now + 0.1);
            osc.stop(now + 2.0);
        });
    }

    public playError() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Soft Low pulse
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.linearRampToValueAtTime(0, now + 0.3);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    public playStartup() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Boot Pulse: Deep sub + rising filter
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(50, now);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(20, now);
        filter.frequency.exponentialRampToValueAtTime(4000, now + 1.5);
        filter.Q.setValueAtTime(15, now);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start(now);
        osc.stop(now + 2.0);
    }

    public playInspiration() {
        this.init();
        if (!this.ctx || !this.sfxGain) return;

        const now = this.ctx.currentTime;
        
        // Crystal Shimmer: High frequency cluster
        [1500, 1800, 2200, 2700].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.02, now + 0.1 + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);
            
            osc.connect(gain);
            gain.connect(this.sfxGain!);
            osc.start(now);
            osc.stop(now + 2.5);
        });
    }

    // Alias for legacy support
    public playLevelComplete() {
        this.playAchievementMajor();
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

    public startGlide() {
        this.init();
        if (!this.ctx || !this.glideGain || this.isGliding) return;
        
        this.isGliding = true;
        this.glideOsc = this.ctx.createOscillator();
        this.glideOsc.type = 'sine';
        this.glideOsc.frequency.setValueAtTime(150, this.ctx.currentTime);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.ctx.currentTime);
        
        this.glideOsc.connect(filter);
        filter.connect(this.glideGain);
        
        this.glideOsc.start();
        this.glideGain.gain.setTargetAtTime(0.02, this.ctx.currentTime, 0.1);
    }

    public updateGlide(speed: number) {
        if (!this.ctx || !this.glideGain || !this.glideOsc) return;
        const s = Math.min(1, Math.abs(speed) / 50);
        this.glideGain.gain.setTargetAtTime(0.02 + (s * 0.05), this.ctx.currentTime, 0.1);
        this.glideOsc.frequency.setTargetAtTime(150 + (s * 50), this.ctx.currentTime, 0.1);
    }

    public stopGlide() {
        if (!this.ctx || !this.glideGain || !this.isGliding) return;
        this.isGliding = false;
        this.glideGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
        setTimeout(() => {
            if (!this.isGliding && this.glideOsc) {
                this.glideOsc.stop();
                this.glideOsc = null;
            }
        }, 300);
    }
}

export const audioSynth = new SoundSynthesizer();
