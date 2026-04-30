// Typewriter sound engine
// Uses Web Audio API to generate typewriter click sounds
// No external audio files needed — generated programmatically

class TypewriterSound {
  private audioContext: AudioContext | null = null
  private isEnabled: boolean = true
  private lastPlayTime: number = 0
  private minInterval: number = 30 // minimum ms between clicks
  private noiseBuffer: AudioBuffer | null = null

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || 
        (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  // Generate a burst of white noise for the metallic "clack"
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (!this.noiseBuffer) {
      const bufferSize = ctx.sampleRate * 0.05 // 50ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      this.noiseBuffer = buffer
    }
    return this.noiseBuffer
  }

  playClick(character: string) {
    if (!this.isEnabled) return
    if (character === ' ') return
    
    const now = Date.now()
    if (now - this.lastPlayTime < this.minInterval) return
    this.lastPlayTime = now

    try {
      const ctx = this.getContext()
      
      // 1. The metallic "Clack" (Filtered white noise)
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = this.getNoiseBuffer(ctx)
      
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'highpass'
      // Randomize the filter frequency for slight variation per key
      noiseFilter.frequency.value = 2500 + (Math.random() * 800)
      
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.4, ctx.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.025)
      
      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      
      // 2. The heavy "Thump" (Low frequency transient)
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(100 + (Math.random() * 40), ctx.currentTime)
      
      const oscGain = ctx.createGain()
      oscGain.gain.setValueAtTime(0.3, ctx.currentTime)
      oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02)
      
      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      
      // Fire both components
      noiseSource.start(ctx.currentTime)
      osc.start(ctx.currentTime)
      
      noiseSource.stop(ctx.currentTime + 0.03)
      osc.stop(ctx.currentTime + 0.03)
    } catch (e) {
      // Silently fail if audio not supported
    }
  }

  // Slightly heavier mechanical sound for punctuation
  playPause() {
    if (!this.isEnabled) return
    try {
      const ctx = this.getContext()
      
      // Heavier clack
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = this.getNoiseBuffer(ctx)
      
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.value = 1500
      
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.6, ctx.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)
      
      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      
      // Heavier thump
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.setValueAtTime(80, ctx.currentTime)
      
      const oscGain = ctx.createGain()
      oscGain.gain.setValueAtTime(0.2, ctx.currentTime)
      oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04)
      
      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      
      noiseSource.start(ctx.currentTime)
      osc.start(ctx.currentTime)
      
      noiseSource.stop(ctx.currentTime + 0.05)
      osc.stop(ctx.currentTime + 0.05)
    } catch (e) {}
  }

  enable() { this.isEnabled = true }
  disable() { this.isEnabled = false }
  toggle() { this.isEnabled = !this.isEnabled }
  get enabled() { return this.isEnabled }

  async resume() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}

export const typewriterSound = new TypewriterSound()
