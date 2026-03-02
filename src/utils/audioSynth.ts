export class SoundSynthesizer {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private musicGain: GainNode | null = null;
    private sfxGain: GainNode | null = null;

    private isPlayingMusic: boolean = false;
    private nextNoteTime: number = 0;
    private timerID: number | null = null;
    private melodyIndex: number = 0;

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
        if (this.ctx.state === 'suspended') {
            this.ctx.resume().catch(e => console.warn("Audio resume failed", e));
        }
    }

    public setMusicVolume(vol: number) {
        if (this.musicGain) {
            // Smooth transition
            this.musicGain.gain.setTargetAtTime(Math.max(0, Math.min(1, vol)), this.ctx?.currentTime || 0, 0.1);
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
        this.nextNoteTime = this.ctx?.currentTime || 0;
        this.melodyIndex = 0;
        this.scheduler();
    }

    public stopMusic() {
        this.isPlayingMusic = false;
        if (this.timerID) {
            window.clearTimeout(this.timerID);
            this.timerID = null;
        }
    }

    private scheduler() {
        if (!this.isPlayingMusic || !this.ctx) return;

        const lookahead = 25.0; // ms
        const scheduleAheadTime = 0.1; // seconds

        while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
            this.scheduleNote(this.nextNoteTime);
            this.nextNote();
        }

        this.timerID = window.setTimeout(() => this.scheduler(), lookahead);
    }

    private nextNote() {
        const secondsPerBeat = 0.5; // 120 BPM-ish
        this.nextNoteTime += secondsPerBeat;
        this.melodyIndex++;
    }

    private scheduleNote(time: number) {
        if (!this.ctx || !this.musicGain) return;

        // Simple procedurally generated melody logic
        // We ensure it stays in the pentatonic scale

        // Probability of playing a note on a beat (sparse is better for background)
        if (Math.random() < 0.6) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.connect(gain);
            gain.connect(this.musicGain);

            osc.type = 'sine'; // Soft tone

            // Pick a pleasant note from scale, biased towards lower/mid range for accompaniment
            const noteIdx = Math.floor(Math.random() * 5); // Base pentatonic
            const freq = this.scale[noteIdx];

            osc.frequency.setValueAtTime(freq, time);

            // Soft Attack/Release (Marimba-ish)
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 1.5); // Long tail

            osc.start(time);
            osc.stop(time + 2.0);
        }

        // Occasional high accent (Bell)
        if (Math.random() < 0.1) {
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(this.musicGain);
            osc2.type = 'triangle';
            const freq = this.scale[5 + Math.floor(Math.random() * 3)]; // High octave
            osc2.frequency.setValueAtTime(freq, time);
            gain2.gain.setValueAtTime(0, time);
            gain2.gain.linearRampToValueAtTime(0.05, time + 0.02);
            gain2.gain.exponentialRampToValueAtTime(0.001, time + 1.0);
            osc2.start(time);
            osc2.stop(time + 1.0);
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
