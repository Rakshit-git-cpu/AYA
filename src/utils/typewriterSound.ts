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
      
      // Subtle modern keyboard tap (Soft bandpass filtered noise)
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = this.getNoiseBuffer(ctx)
      
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      // Lower frequency for a softer, plastic/membrane tap (not metallic)
      noiseFilter.frequency.value = 800 + (Math.random() * 200)
      noiseFilter.Q.value = 0.8 // Soft, wide band
      
      const noiseGain = ctx.createGain()
      // Very low volume, extremely fast decay
      noiseGain.gain.setValueAtTime(0.15, ctx.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015)
      
      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      
      noiseSource.start(ctx.currentTime)
      noiseSource.stop(ctx.currentTime + 0.02)
    } catch (e) {
      // Silently fail if audio not supported
    }
  }

  // Slightly heavier sound for punctuation (like hitting Return/Spacebar)
  playPause() {
    if (!this.isEnabled) return
    try {
      const ctx = this.getContext()
      
      const noiseSource = ctx.createBufferSource()
      noiseSource.buffer = this.getNoiseBuffer(ctx)
      
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      // Deeper sound for larger keys
      noiseFilter.frequency.value = 400 + (Math.random() * 100)
      noiseFilter.Q.value = 0.5 
      
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.2, ctx.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025)
      
      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      
      noiseSource.start(ctx.currentTime)
      noiseSource.stop(ctx.currentTime + 0.03)
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
