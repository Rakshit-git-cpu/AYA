// BGM files are in /public/assets/ — served as static URLs (not imported)
// Correct paths confirmed from public/assets directory listing
const BGM_FILES: Record<string, string> = {
  triumph: '/assets/bgm-triumph.mp3',
  grief:   '/assets/bgm-grief.mp3',
  tension: '/assets/bgm-tension.mp3',
  joy:     '/assets/bgm-joy.mp3',
  hope:    '/assets/bgm-hope.mp3',
  love:    '/assets/romantic emotional.mp3',  // no bgm-love.mp3, use this file
  mystery: '/assets/bgm-mystery.mp3',
  calm:    '/assets/bgm-calm.mp3',
};

class AmbientMusicEngine {
  private audios: Record<string, HTMLAudioElement> = {};
  private currentMood: string | null = null;
  private isEnabled: boolean = true;
  private hasInteracted: boolean = false;
  private pendingMood: string | null = null;
  private targetVolume: number = 0.25;
  private activeIntervals: Record<string, ReturnType<typeof setInterval>> = {};

  constructor() {
    // Log all resolved paths so Vite/browser resolution is visible in console
    console.log('[AmbientMusic] BGM file paths:', BGM_FILES);

    Object.entries(BGM_FILES).forEach(([mood, src]) => {
      const audio = new Audio(src);
      audio.loop = true;
      audio.volume = 0;
      audio.preload = 'none'; // Don't preload until needed
      audio.onerror = (e) => console.error('[AmbientMusic] BGM load failed:', mood, src, e);
      this.audios[mood] = audio;
    });
  }

  // Call this on first user interaction to unlock browser autoplay
  unlockAndPlay(mood: string) {
    this.hasInteracted = true;
    this.pendingMood = null;
    this.play(mood);
  }

  play(mood: string) {
    if (!this.isEnabled) return;

    // If no user interaction yet, queue the mood and wait
    if (!this.hasInteracted) {
      this.pendingMood = mood;
      return;
    }

    if (this.currentMood === mood) return; // Don't restart same track

    const prevAudio = this.currentMood ? this.audios[this.currentMood] : null;
    const prevMood = this.currentMood;
    this.currentMood = mood;
    const nextAudio = this.audios[mood];

    if (prevAudio && prevMood) {
      this.fadeOutAudio(prevAudio, prevMood, 1500);
    }

    if (nextAudio) {
      this.fadeInAudio(nextAudio, mood, 1500);
    }
  }

  private clearIntervalForMood(mood: string) {
    if (this.activeIntervals[mood]) {
      clearInterval(this.activeIntervals[mood]);
      delete this.activeIntervals[mood];
    }
  }

  private fadeOutAudio(audio: HTMLAudioElement, mood: string, durationMs: number) {
    this.clearIntervalForMood(mood);
    const startVolume = audio.volume;
    if (startVolume <= 0) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }
    const steps = 20;
    const stepTime = durationMs / steps;
    const stepVolume = startVolume / steps;

    let currentStep = 0;
    this.activeIntervals[mood] = setInterval(() => {
      currentStep++;
      const newVol = startVolume - (stepVolume * currentStep);
      if (newVol <= 0 || currentStep >= steps) {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        this.clearIntervalForMood(mood);
      } else {
        audio.volume = newVol;
      }
    }, stepTime);
  }

  private fadeInAudio(audio: HTMLAudioElement, mood: string, durationMs: number) {
    this.clearIntervalForMood(mood);
    audio.volume = 0;
    audio.play().catch(e => console.warn('[AmbientMusic] play() blocked (autoplay policy):', mood, e));

    const steps = 20;
    const stepTime = durationMs / steps;
    const stepVolume = this.targetVolume / steps;

    let currentStep = 0;
    this.activeIntervals[mood] = setInterval(() => {
      currentStep++;
      const newVol = stepVolume * currentStep;
      if (newVol >= this.targetVolume || currentStep >= steps) {
        audio.volume = this.targetVolume;
        this.clearIntervalForMood(mood);
      } else {
        audio.volume = newVol;
      }
    }, stepTime);
  }

  fadeOut(duration: number = 1.5) {
    this.stop(duration * 1000);
  }

  stop(durationMs: number = 1500) {
    if (this.currentMood && this.audios[this.currentMood]) {
      this.fadeOutAudio(this.audios[this.currentMood], this.currentMood, durationMs);
    }
    this.currentMood = null;
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.stop();
    } else if (this.pendingMood) {
      // Resume if something was pending
      this.unlockAndPlay(this.pendingMood);
    }
  }

  disable() {
    this.isEnabled = false;
    this.stop();
  }

  // Returns the pending mood so ScenarioGame can pass it on first interaction
  get pending() { return this.pendingMood; }
  get interacted() { return this.hasInteracted; }
  get enabled() { return this.isEnabled; }

  setVolume(v: number) {
    this.targetVolume = Math.max(0, Math.min(1, v));
    if (this.currentMood && this.audios[this.currentMood]) {
      this.audios[this.currentMood].volume = this.targetVolume;
    }
  }
}

export const ambientMusic = new AmbientMusicEngine();
