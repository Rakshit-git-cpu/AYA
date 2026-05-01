class BGMManager {
  private tracks: Record<string, HTMLAudioElement> = {}
  private currentTrack: string | null = null
  private isEnabled: boolean = true
  private masterVolume: number = 0.3
  private unlocked: boolean = false

  constructor() {
    const TRACK_LIST = [
      'onboarding', 'quiz', 'neon-map',
      'triumph', 'grief', 'tension', 'joy',
      'hope', 'love', 'mystery', 'calm'
    ]
    
    TRACK_LIST.forEach(name => {
      const audio = new Audio(`/music/bgm-${name}.mp3`)
      audio.loop = true
      audio.volume = 0
      audio.preload = 'auto'
      audio.onerror = () => 
        console.error(`BGM failed: bgm-${name}.mp3`)
      audio.oncanplaythrough = () => 
        console.log(`BGM ready: ${name}`)
      this.tracks[name] = audio
    })
  }

  // Call this on first user interaction anywhere in app
  unlock() {
    if (this.unlocked) return
    this.unlocked = true
    Object.values(this.tracks).forEach(audio => {
      audio.play()
        .then(() => { audio.pause(); audio.currentTime = 0 })
        .catch(() => {})
    })
    console.log('BGM unlocked')
  }

  play(trackName: string, fadeInDuration: number = 1500) {
    if (!this.isEnabled) return
    if (!this.unlocked) return
    if (this.currentTrack === trackName) return
    
    const prevTrack = this.currentTrack
    this.currentTrack = trackName
    
    // Fade out previous track
    if (prevTrack && this.tracks[prevTrack]) {
      this.fadeOut(this.tracks[prevTrack], 1500)
    }
    
    // Fade in new track
    const newAudio = this.tracks[trackName]
    if (!newAudio) {
      console.error(`Track not found: ${trackName}`)
      return
    }
    newAudio.currentTime = 0
    newAudio.volume = 0
    newAudio.play().catch(e => 
      console.error(`BGM play failed: ${trackName}`, e)
    )
    this.fadeIn(newAudio, fadeInDuration)
  }

  stop(fadeOutDuration: number = 1500) {
    if (this.currentTrack && this.tracks[this.currentTrack]) {
      this.fadeOut(this.tracks[this.currentTrack], fadeOutDuration)
    }
    this.currentTrack = null
  }

  private fadeOut(audio: HTMLAudioElement, duration: number) {
    const steps = 30
    const interval = duration / steps
    const step = audio.volume / steps
    
    const timer = setInterval(() => {
      if (audio.volume <= step) {
        audio.volume = 0
        audio.pause()
        clearInterval(timer)
      } else {
        audio.volume = Math.max(0, audio.volume - step)
      }
    }, interval)
  }

  private fadeIn(audio: HTMLAudioElement, duration: number) {
    const steps = 30
    const interval = duration / steps
    const step = this.masterVolume / steps
    
    const timer = setInterval(() => {
      if (audio.volume >= this.masterVolume - step) {
        audio.volume = this.masterVolume
        clearInterval(timer)
      } else {
        audio.volume = Math.min(
          this.masterVolume, 
          audio.volume + step
        )
      }
    }, interval)
  }

  toggle() {
    this.isEnabled = !this.isEnabled
    if (!this.isEnabled) {
      this.stop(800)
    } else if (this.currentTrack) {
      const audio = this.tracks[this.currentTrack]
      if (audio) {
        audio.play().catch(() => {})
        this.fadeIn(audio, 800)
      }
    }
    localStorage.setItem('aya_bgm', 
      this.isEnabled.toString()
    )
  }

  setVolume(v: number) {
    this.masterVolume = Math.max(0, Math.min(1, v))
    if (this.currentTrack) {
      const audio = this.tracks[this.currentTrack]
      if (audio) audio.volume = this.masterVolume
    }
  }

  loadPreference() {
    const saved = localStorage.getItem('aya_bgm')
    if (saved === 'false') this.isEnabled = false
  }

  get enabled() { return this.isEnabled }
  get current() { return this.currentTrack }
}

export const bgmManager = new BGMManager()
