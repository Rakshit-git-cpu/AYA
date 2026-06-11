class AudioManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  
  private isUnlocked: boolean = false;
  private currentBgmSource: AudioBufferSourceNode | null = null;
  private bgmBuffers: Map<string, AudioBuffer> = new Map();
  private currentTrack: string | null = null;
  public enabled: boolean = true;

  // Track list for lazy loading
  private BGM_TRACKS: Record<string, string> = {
    'onboarding': '/music/bgm-onboarding.mp3',
    'quiz':       '/music/bgm-quiz.mp3',
    'neon-map':   '/music/bgm-neon-map.mp3',
    'triumph':    '/music/bgm-triumph.mp3',
    'grief':      '/music/bgm-grief.mp3',
    'tension':    '/music/bgm-tension.mp3',
    'joy':        '/music/bgm-joy.mp3',
    'hope':       '/music/bgm-hope.mp3',
    'love':       '/music/bgm-love.mp3',
    'mystery':    '/music/bgm-mystery.mp3',
    'calm':       '/music/bgm-calm.mp3',
  };

  public getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.3;
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 1.0;
      this.sfxGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  public async unlockAudio(): Promise<void> {
    console.log('AUDIO UNLOCK CALLED');
    if (this.isUnlocked) return;
    try {
      const context = this.getContext();
      if (context.state === 'suspended') {
        await context.resume();
      }
      
      // Safari silent buffer trick
      const buffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(0);
      
      this.isUnlocked = true;
    } catch (e) {
      console.warn('Audio unlock failed', e);
    }
  }

  // --- SOUND EFFECTS ---
  
  public playTick(): void {
    try {
      const context = this.getContext();
      if (context.state !== 'running') return;
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.frequency.value = 600 + Math.random() * 150;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.35, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.045);
      osc.start(context.currentTime);
      osc.stop(context.currentTime + 0.045);
    } catch (e) {}
  }

  public playWin(): void {
    try {
      const context = this.getContext();
      if (context.state !== 'running') return;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const startTime = context.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) {}
  }

  public playClick(): void {
    try {
      const context = this.getContext();
      if (context.state !== 'running') return;
      
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      
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
      gain.connect(this.sfxGain!);
      
      osc.start(now);
      osc.stop(now + 0.1);

      // Noise burst
      const bufferSize = context.sampleRate * 0.01;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      
      const noise = context.createBufferSource();
      const noiseGain = context.createGain();
      noise.buffer = buffer;
      noiseGain.gain.setValueAtTime(0.05, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
      noise.connect(noiseGain);
      noiseGain.connect(this.sfxGain!);
      noise.start(now);
    } catch (e) {}
  }

  public playTransition(): void {
    try {
      const context = this.getContext();
      if (context.state !== 'running') return;
      const now = context.currentTime;
      const osc = context.createOscillator();
      const gain = context.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(this.sfxGain!);
      
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  // Fallbacks for missing audioSynth methods
  public playStartup(): void { this.playTransition(); }
  public startGlide(): void {}
  public updateGlide(_delta?: number): void {}
  public stopGlide(): void {}
  public playBack(): void { this.playClick(); }
  public playHover(): void { this.playTick(); }
  public playReveal(): void { this.playTransition(); }

  // --- BGM ---

  public async play(trackName: string, fadeDuration = 1.5): Promise<void> {
    try {
      if (!this.isUnlocked || !this.enabled) return; // Only play if unlocked and enabled
      if (this.currentTrack === trackName) return;
      
      const ctx = this.getContext();
      let buffer = this.bgmBuffers.get(trackName);
      
      if (!buffer) {
        const url = this.BGM_TRACKS[trackName] || `/music/bgm-${trackName}.mp3`;
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        buffer = await ctx.decodeAudioData(arrayBuffer);
        this.bgmBuffers.set(trackName, buffer);
      }

      this.currentTrack = trackName;

      // Crossfade out old
      if (this.currentBgmSource) {
        this.stop(fadeDuration);
      }

      // Start new
      const newGain = ctx.createGain();
      newGain.gain.setValueAtTime(0, ctx.currentTime);
      newGain.connect(this.bgmGain!);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(newGain);
      source.start(0);

      newGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + fadeDuration);

      this.currentBgmSource = source;
      // Store the local gain node on the source so we can fade it out later
      (source as any).localGain = newGain;
      
    } catch (e) {
      console.warn(`Failed to play BGM ${trackName}`, e);
    }
  }

  public stop(fadeDuration = 1.5): void {
    try {
      if (!this.currentBgmSource) return;
      const ctx = this.getContext();
      const source = this.currentBgmSource;
      const gain = (source as any).localGain as GainNode;
      
      this.currentTrack = null;
      this.currentBgmSource = null;

      if (gain && ctx.state === 'running') {
        const now = ctx.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + fadeDuration);
        setTimeout(() => {
          try { source.stop(); } catch(e) {}
        }, fadeDuration * 1000);
      } else {
        try { source.stop(); } catch(e) {}
      }
    } catch (e) {}
  }

  public toggle(): void {
    this.enabled = !this.enabled;
    if (this.enabled && this.currentTrack) {
      this.play(this.currentTrack);
    } else {
      this.pause();
    }
  }

  public pause(): void {
    try {
      if (this.ctx && this.bgmGain) {
        this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } catch (e) {}
  }

  public resume(): void {
    try {
      if (this.ctx && this.bgmGain) {
        this.bgmGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      }
    } catch (e) {}
  }
}

export const audioManager = new AudioManager();
