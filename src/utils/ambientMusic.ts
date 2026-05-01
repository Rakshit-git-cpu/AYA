class AmbientMusicEngine {
  private audios: Record<string, HTMLAudioElement> = {};
  private currentMood: string | null = null;
  private isEnabled: boolean = true;
  private targetVolume: number = 0.25;
  private activeIntervals: Record<string, ReturnType<typeof setInterval>> = {};

  constructor() {
    const moods = ['triumph', 'grief', 'tension', 'joy', 'hope', 'love', 'mystery', 'calm'];
    moods.forEach(mood => {
      const audio = new Audio(`/assets/music/bgm-${mood}.mp3`);
      audio.loop = true;
      audio.volume = 0;
      this.audios[mood] = audio;
    });
  }

  play(mood: string) {
    if (!this.isEnabled) return;
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
      let newVol = startVolume - (stepVolume * currentStep);
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
    audio.play().catch(e => console.log('AmbientMusic: play prevented', e));
    
    const steps = 20;
    const stepTime = durationMs / steps;
    const stepVolume = this.targetVolume / steps;

    let currentStep = 0;
    this.activeIntervals[mood] = setInterval(() => {
      currentStep++;
      let newVol = stepVolume * currentStep;
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
    }
  }

  disable() {
    this.isEnabled = false;
    this.stop();
  }

  setVolume(v: number) {
    this.targetVolume = Math.max(0, Math.min(1, v));
    if (this.currentMood && this.audios[this.currentMood]) {
      this.audios[this.currentMood].volume = this.targetVolume;
    }
  }

  get enabled() { return this.isEnabled; }
}

export const ambientMusic = new AmbientMusicEngine();
