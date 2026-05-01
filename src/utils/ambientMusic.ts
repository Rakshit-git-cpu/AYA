// Audio files are in /public/music/ — served directly by Vite at /music/*.mp3
// No import statements needed. No hashing applied to files in /public/.

const TRACKS: Record<string, string> = {
  triumph: '/music/bgm-triumph.mp3',
  grief:   '/music/bgm-grief.mp3',
  tension: '/music/bgm-tension.mp3',
  joy:     '/music/bgm-joy.mp3',
  hope:    '/music/bgm-hope.mp3',
  love:    '/music/bgm-love.mp3',
  mystery: '/music/bgm-mystery.mp3',
  calm:    '/music/bgm-calm.mp3',
};

const audioMap: Record<string, HTMLAudioElement> = {};

// Preload all tracks on engine init
Object.entries(TRACKS).forEach(([mood, src]) => {
  const audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0;
  audio.preload = 'auto';
  audio.onerror = () => console.error(`[BGM] Failed to load: ${mood} at ${src}`);
  audio.oncanplaythrough = () => console.log(`[BGM] Ready: ${mood}`);
  audioMap[mood] = audio;
});

console.log('[BGM] Audio engine initialized with tracks:', Object.keys(TRACKS));

class AmbientMusicEngine {
  private currentMood: string | null = null;
  private isEnabled: boolean = true;
  private isUnlocked: boolean = false;
  private pendingMood: string | null = null;
  private targetVolume: number = 0.25;
  private fadeIntervals: Record<string, ReturnType<typeof setInterval>> = {};

  constructor() {
    // One-time unlock listener: plays+pauses all tracks to unlock AudioContext
    const unlockAudio = () => {
      if (this.isUnlocked) return;
      this.isUnlocked = true;

      // Play and immediately pause every audio element to satisfy browser autoplay policy
      const unlockPromises = Object.values(audioMap).map(audio =>
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => { /* ignore — may already be unlocked */ })
      );

      Promise.all(unlockPromises).then(() => {
        console.log('[BGM] Audio unlocked by user interaction');
        // Now play the mood that was requested but blocked
        if (this.pendingMood && this.isEnabled) {
          this._startPlay(this.pendingMood);
          this.pendingMood = null;
        }
      });

      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
  }

  play(mood: string) {
    if (!this.isEnabled) return;
    if (this.currentMood === mood) return; // Don't restart same track

    if (!this.isUnlocked) {
      // Queue for after first interaction
      this.pendingMood = mood;
      return;
    }

    this._startPlay(mood);
  }

  private _startPlay(mood: string) {
    const prev = this.currentMood;
    this.currentMood = mood;

    if (prev && audioMap[prev]) {
      this._fadeOut(audioMap[prev], prev, 1500);
    }
    if (audioMap[mood]) {
      this._fadeIn(audioMap[mood], mood, 1500);
    }
  }

  private _clearFade(key: string) {
    if (this.fadeIntervals[key]) {
      clearInterval(this.fadeIntervals[key]);
      delete this.fadeIntervals[key];
    }
  }

  private _fadeOut(audio: HTMLAudioElement, key: string, durationMs: number) {
    this._clearFade(key);
    const startVol = audio.volume;
    if (startVol <= 0) { audio.pause(); audio.currentTime = 0; return; }

    const steps = Math.ceil(durationMs / 50);
    const step = startVol / steps;
    let n = 0;

    this.fadeIntervals[key] = setInterval(() => {
      n++;
      const v = startVol - step * n;
      if (v <= 0 || n >= steps) {
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
        this._clearFade(key);
      } else {
        audio.volume = v;
      }
    }, 50);
  }

  private _fadeIn(audio: HTMLAudioElement, key: string, durationMs: number) {
    this._clearFade(key);
    audio.volume = 0;
    audio.play().catch(e => console.warn('[BGM] play() blocked:', key, e));

    const steps = Math.ceil(durationMs / 50);
    const step = this.targetVolume / steps;
    let n = 0;

    this.fadeIntervals[key] = setInterval(() => {
      n++;
      const v = step * n;
      if (v >= this.targetVolume || n >= steps) {
        audio.volume = this.targetVolume;
        this._clearFade(key);
      } else {
        audio.volume = v;
      }
    }, 50);
  }

  fadeOut(durationSec: number = 1.5) {
    if (this.currentMood && audioMap[this.currentMood]) {
      this._fadeOut(audioMap[this.currentMood], this.currentMood, durationSec * 1000);
    }
    this.currentMood = null;
  }

  stop() {
    this.fadeOut();
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.fadeOut(0.5);
    } else if (this.pendingMood) {
      this.play(this.pendingMood);
    }
  }

  disable() {
    this.isEnabled = false;
    this.fadeOut(0.5);
  }

  setVolume(v: number) {
    this.targetVolume = Math.max(0, Math.min(1, v));
    if (this.currentMood && audioMap[this.currentMood]) {
      audioMap[this.currentMood].volume = this.targetVolume;
    }
  }

  get enabled() { return this.isEnabled; }
}

export const ambientMusic = new AmbientMusicEngine();
