// Typewriter sound engine
// Uses Web Audio API to generate typewriter click sounds
// No external audio files needed — generated programmatically

class TypewriterSound {
  private audioContext: AudioContext | null = null
  private isEnabled: boolean = true
  private lastPlayTime: number = 0
  private minInterval: number = 30 // minimum ms between clicks

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || 
        (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  playClick(character: string) {
    // Don't play sound for spaces or punctuation pauses
    if (!this.isEnabled) return
    if (character === ' ') return
    
    const now = Date.now()
    if (now - this.lastPlayTime < this.minInterval) return
    this.lastPlayTime = now

    try {
      const ctx = this.getContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      // Lower pitch, subtle click
      const baseFreq = character === character.toUpperCase() ? 300 : 250
      const freq = baseFreq + (Math.random() * 50 - 25)
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
      oscillator.type = 'sine' // Sine is softer and less harsh than square
      
      // Extremely quick decay for a 'tick' sound, lower volume
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, ctx.currentTime + 0.015
      )
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.02)
    } catch (e) {
      // Silently fail if audio not supported
    }
  }

  // Slightly longer pause sound for punctuation
  playPause() {
    if (!this.isEnabled) return
    try {
      const ctx = this.getContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.frequency.setValueAtTime(200, ctx.currentTime)
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, ctx.currentTime + 0.03
      )
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.04)
    } catch (e) {}
  }

  enable() { this.isEnabled = true }
  disable() { this.isEnabled = false }
  toggle() { this.isEnabled = !this.isEnabled }
  get enabled() { return this.isEnabled }

  // Resume audio context if suspended (browser autoplay policy)
  async resume() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume()
    }
  }
}

export const typewriterSound = new TypewriterSound()
