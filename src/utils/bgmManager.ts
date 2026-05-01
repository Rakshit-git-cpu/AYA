class BGMManager {
  private audioContext: AudioContext | null = null
  private buffers: Map<string, AudioBuffer> = new Map()
  private currentSource: AudioBufferSourceNode | null = null
  private gainNode: GainNode | null = null
  private currentTrack: string | null = null
  private targetTrack: string | null = null
  private isEnabled: boolean = true
  private masterVolume: number = 0.3
  private isUnlocked: boolean = false
  private pendingTrack: string | null = null
  private mapReady: boolean = false
  private preloadPromise: Promise<void> | null = null

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (
        window.AudioContext || 
        (window as any).webkitAudioContext
      )()
    }
    return this.audioContext
  }

  // Preload all tracks as ArrayBuffers
  async preload(tracks: Record<string, string>) {
    this.preloadPromise = (async () => {
        const ctx = this.getContext()
        const promises = Object.entries(tracks).map(
        async ([name, url]) => {
            try {
            const response = await fetch(url)
            const arrayBuffer = await response.arrayBuffer()
            const audioBuffer = await ctx.decodeAudioData(
                arrayBuffer
            )
            this.buffers.set(name, audioBuffer)
            console.log(`BGM loaded: ${name}`)
            } catch (e) {
            console.error(`BGM failed to load: ${name}`, e)
            try {
                const audio = new Audio(url)
                audio.crossOrigin = 'anonymous'
                console.warn(`Fallback for Safari fetch crossOrigin block on: ${name}`)
            } catch (err) {}
            }
        }
        )
        await Promise.all(promises)
        console.log('All BGM tracks loaded')
    })();
    await this.preloadPromise;
  }

  // Must be called on first user gesture
  async unlock() {
    if (this.isUnlocked) return
    const ctx = this.getContext()
    
    // Safari requires resume after user gesture
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }
    
    this.isUnlocked = true
    console.log('BGM unlocked, context state:', ctx.state)
    
    // Only auto-play pending if map is ready or if it's not the map track
    if (this.pendingTrack) {
        if (this.pendingTrack === 'neon-map' && !this.mapReady) {
            // wait for map to be ready
        } else {
            const track = this.pendingTrack
            this.pendingTrack = null
            await this.play(track)
        }
    }
  }

  setMapReady() { 
    this.mapReady = true 
    if (this.isUnlocked && this.pendingTrack === 'neon-map') {
        const track = this.pendingTrack
        this.pendingTrack = null
        this.play(track)
    }
  }

  async play(trackName: string, fadeDuration = 1.5) {
    // If not unlocked yet, queue the track
    if (!this.isUnlocked) {
      this.pendingTrack = trackName
      return
    }

    if (this.targetTrack === trackName) return
    
    this.targetTrack = trackName

    if (this.preloadPromise) {
        await this.preloadPromise;
    }

    // Abort if target changed while waiting for preload
    if (this.targetTrack !== trackName) return

    const ctx = this.getContext()
    let buffer = this.buffers.get(trackName)
    
    if (!buffer) {
      console.log(`BGM lazy loading: ${trackName}`)
      try {
          const url = BGM_TRACKS[trackName] || `/music/bgm-${trackName}.mp3`
          const response = await fetch(url)
          const arrayBuffer = await response.arrayBuffer()
          buffer = await ctx.decodeAudioData(arrayBuffer)
          this.buffers.set(trackName, buffer)
      } catch (e) {
          console.error(`BGM lazy load failed: ${trackName}`, e)
          return
      }
    }

    // Fade out current track
    if (this.gainNode && this.currentSource) {
      const oldGain = this.gainNode
      const oldSource = this.currentSource
      this.fadeOut(oldGain, fadeDuration, () => {
        try { oldSource.stop() } catch(e) {}
      })
    }

    // Create new gain node for new track
    const newGain = ctx.createGain()
    newGain.gain.setValueAtTime(0, ctx.currentTime)
    newGain.connect(ctx.destination)

    // Create new source
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(newGain)
    source.start(0)

    // Fade in
    newGain.gain.linearRampToValueAtTime(
      this.masterVolume,
      ctx.currentTime + fadeDuration
    )

    this.gainNode = newGain
    this.currentSource = source
    this.currentTrack = trackName
    
    console.log(`BGM playing: ${trackName}`)
  }

  private fadeOut(
    gain: GainNode, 
    duration: number,
    onComplete?: () => void
  ) {
    const ctx = this.getContext()
    const now = ctx.currentTime
    // FIX FOR OVERLAPPING AUDIO: Use exponential decay from current actual volume
    gain.gain.cancelScheduledValues(now)
    gain.gain.setTargetAtTime(0, now, duration / 3)
    
    setTimeout(
      () => {
        try { gain.gain.linearRampToValueAtTime(0, ctx.currentTime) } catch(e) {}
        onComplete?.()
      }, 
      duration * 1000
    )
  }

  stop(fadeDuration = 1.5) {
    this.targetTrack = null
    this.pendingTrack = null
    if (!this.gainNode || !this.currentSource) return
    
    const source = this.currentSource
    this.fadeOut(this.gainNode, fadeDuration, () => {
      try { source.stop() } catch(e) {}
    })
    
    this.currentTrack = null
    this.currentSource = null
    this.gainNode = null
  }

  toggle() {
    this.isEnabled = !this.isEnabled
    if (!this.isEnabled) {
      this.stop(0.8)
    } else {
      // Resume whatever should be playing
      if (this.targetTrack) {
          this.play(this.targetTrack)
      } else if (this.pendingTrack) {
          this.play(this.pendingTrack)
      }
    }
    localStorage.setItem(
      'aya_bgm', 
      this.isEnabled.toString()
    )
  }

  setVolume(v: number) {
    this.masterVolume = Math.max(0, Math.min(1, v))
    if (this.gainNode && this.audioContext) {
      const now = this.audioContext.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(
        this.masterVolume,
        now,
        0.1
      )
    }
  }

  loadPreference() {
    const saved = localStorage.getItem('aya_bgm')
    if (saved === 'false') this.isEnabled = false
    const vol = localStorage.getItem('aya_bgm_volume')
    if (vol) this.masterVolume = parseFloat(vol)
  }

  get enabled() { return this.isEnabled }
  get current() { return this.currentTrack }
}

export const bgmManager = new BGMManager()

// Track list for preloading
export const BGM_TRACKS: Record<string, string> = {
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
}
