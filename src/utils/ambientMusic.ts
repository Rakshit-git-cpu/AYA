class AmbientMusicEngine {
  private audioContext: AudioContext | null = null
  private currentNodes: AudioNode[] = []
  private isEnabled: boolean = true
  private volume: number = 0.3
  private gainNode: GainNode | null = null

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || 
        (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  async resume() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  stop() {
    this.currentNodes.forEach(node => {
      try { (node as OscillatorNode).stop?.() } catch(_e) {}
    })
    this.currentNodes = []
  }

  async play(mood: string) {
    if (!this.isEnabled) return
    this.stop()
    await this.resume()
    
    const ctx = this.getContext()
    this.gainNode = ctx.createGain()
    this.gainNode.gain.setValueAtTime(0, ctx.currentTime)
    this.gainNode.gain.linearRampToValueAtTime(
      this.volume, ctx.currentTime + 2
    )
    this.gainNode.connect(ctx.destination)

    switch(mood) {
      case 'hopeful': this.playHopeful(ctx); break
      case 'grief': this.playGrief(ctx); break
      case 'tense': this.playTense(ctx); break
      case 'joyful': this.playJoyful(ctx); break
      case 'romantic': this.playRomantic(ctx); break
      case 'mysterious': this.playMysterious(ctx); break
      case 'triumphant': this.playTriumphant(ctx); break
      case 'intense': this.playIntense(ctx); break
      default: this.playCalm(ctx)
    }
  }

  private createOsc(
    ctx: AudioContext, 
    freq: number, 
    type: OscillatorType = 'sine'
  ): OscillatorNode {
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.type = type
    this.currentNodes.push(osc)
    return osc
  }

  private createReverb(ctx: AudioContext): ConvolverNode {
    const convolver = ctx.createConvolver()
    const rate = ctx.sampleRate
    const length = rate * 3
    const impulse = ctx.createBuffer(2, length, rate)
    for (let i = 0; i < 2; i++) {
      const channel = impulse.getChannelData(i)
      for (let j = 0; j < length; j++) {
        channel[j] = (Math.random() * 2 - 1) * 
          Math.pow(1 - j / length, 2)
      }
    }
    convolver.buffer = impulse
    return convolver
  }

  private playHopeful(ctx: AudioContext) {
    // Warm rising tones — major chord
    const freqs = [261.63, 329.63, 392.00] // C major
    freqs.forEach((freq, i) => {
      const osc = this.createOsc(ctx, freq, 'sine')
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      osc.connect(gain)
      gain.connect(this.gainNode!)
      osc.start(ctx.currentTime + i * 0.3)
    })
  }

  private playGrief(ctx: AudioContext) {
    // Slow minor tones — melancholic
    const freqs = [220, 261.63, 311.13] // A minor
    freqs.forEach((freq, i) => {
      const osc = this.createOsc(ctx, freq * 0.5, 'sine')
      const gain = ctx.createGain()
      const reverb = this.createReverb(ctx)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      osc.connect(gain)
      gain.connect(reverb)
      reverb.connect(this.gainNode!)
      osc.start(ctx.currentTime + i * 0.5)
    })
  }

  private playTense(ctx: AudioContext) {
    // Low drone + irregular rhythm
    const osc = this.createOsc(ctx, 55, 'sawtooth')
    const gain = ctx.createGain()
    // Tremolo effect
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.setValueAtTime(4, ctx.currentTime)
    lfoGain.gain.setValueAtTime(0.03, ctx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    osc.connect(gain)
    gain.connect(this.gainNode!)
    osc.start()
    lfo.start()
    this.currentNodes.push(lfo)
  }

  private playJoyful(ctx: AudioContext) {
    // Bright major + higher register
    const freqs = [523.25, 659.25, 783.99] // C5 major
    freqs.forEach((freq, i) => {
      const osc = this.createOsc(ctx, freq, 'triangle')
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      osc.connect(gain)
      gain.connect(this.gainNode!)
      osc.start(ctx.currentTime + i * 0.2)
    })
  }

  private playRomantic(ctx: AudioContext) {
    // Soft warm tones
    const freqs = [293.66, 369.99, 440] // D major
    const reverb = this.createReverb(ctx)
    freqs.forEach((freq, i) => {
      const osc = this.createOsc(ctx, freq, 'sine')
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      osc.connect(gain)
      gain.connect(reverb)
      reverb.connect(this.gainNode!)
      osc.start(ctx.currentTime + i * 0.4)
    })
  }

  private playMysterious(ctx: AudioContext) {
    // Suspended dissonant chords
    const freqs = [174.61, 220, 293.66, 349.23]
    const reverb = this.createReverb(ctx)
    freqs.forEach((freq, i) => {
      const osc = this.createOsc(ctx, freq, 'sine')
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      osc.connect(gain)
      gain.connect(reverb)
      reverb.connect(this.gainNode!)
      osc.start(ctx.currentTime + i * 0.6)
    })
  }

  private playTriumphant(ctx: AudioContext) {
    // Bold rising major
    const freqs = [261.63, 329.63, 392, 523.25]
    freqs.forEach((freq, i) => {
      const osc = this.createOsc(ctx, freq, 'triangle')
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.07, ctx.currentTime)
      osc.connect(gain)
      gain.connect(this.gainNode!)
      osc.start(ctx.currentTime + i * 0.15)
    })
  }

  private playIntense(ctx: AudioContext) {
    // Aggressive low tones
    const osc = this.createOsc(ctx, 82.41, 'sawtooth')
    const osc2 = this.createOsc(ctx, 110, 'square')
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.04, ctx.currentTime)
    osc.connect(gain)
    osc2.connect(gain)
    gain.connect(this.gainNode!)
    osc.start()
    osc2.start()
  }

  private playCalm(ctx: AudioContext) {
    // Gentle ambient pad
    const freqs = [174.61, 220, 261.63]
    const reverb = this.createReverb(ctx)
    freqs.forEach((freq, i) => {
      const osc = this.createOsc(ctx, freq, 'sine')
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      osc.connect(gain)
      gain.connect(reverb)
      reverb.connect(this.gainNode!)
      osc.start(ctx.currentTime + i * 0.3)
    })
  }

  fadeOut(duration: number = 2) {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.linearRampToValueAtTime(
        0, this.audioContext.currentTime + duration
      )
      setTimeout(() => this.stop(), duration * 1000)
    }
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v))
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(
        this.volume, this.audioContext.currentTime
      )
    }
  }

  enable() { this.isEnabled = true }
  disable() { this.isEnabled = false; this.stop() }
  toggle() { 
    this.isEnabled = !this.isEnabled
    if (!this.isEnabled) this.stop()
  }
  get enabled() { return this.isEnabled }
}

export const ambientMusic = new AmbientMusicEngine()
