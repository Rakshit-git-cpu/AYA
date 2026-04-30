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
      
      // Different pitch for different characters for realism
      const baseFreq = character === character.toUpperCase() 
        ? 800 : 600
      const freq = baseFreq + (Math.random() * 200 - 100)
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime)
      oscillator.type = 'square'
      
      // Very short sharp click sound
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, ctx.currentTime + 0.04
      )
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.04)
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
      
      oscillator.frequency.setValueAtTime(400, ctx.currentTime)
      oscillator.type = 'square'
      
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, ctx.currentTime + 0.06
      )
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.06)
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
