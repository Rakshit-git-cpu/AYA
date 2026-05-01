// Singleton AudioContext — one instance for the entire app lifetime
let ctx: AudioContext | null = null;

const getCtx = (): AudioContext => {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return ctx;
};

// MUST be called directly inside a user gesture handler (onClick, onTouchEnd)
// This is the only way Safari iOS allows AudioContext to resume
export const unlockAudio = async (): Promise<void> => {
  const context = getCtx();
  if (context.state === 'suspended') {
    await context.resume();
  }
  // Safari extra unlock: play a silent buffer
  const buffer = context.createBuffer(1, 1, 22050);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start(0);
};

export const playTick = (): void => {
  try {
    const context = getCtx();
    if (context.state !== 'running') return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.value = 600 + Math.random() * 150;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.35, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.045);
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.045);
  } catch (e) {
    // fail silently — never throw
  }
};

export const playWin = (): void => {
  try {
    const context = getCtx();
    if (context.state !== 'running') return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.connect(gain);
      gain.connect(context.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const startTime = context.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0.4, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  } catch (e) {
    // fail silently
  }
};

export const playClick = (): void => {
  try {
    const context = getCtx();
    if (context.state !== 'running') return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.connect(gain);
    gain.connect(context.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.2, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.06);
    osc.start(context.currentTime);
    osc.stop(context.currentTime + 0.06);
  } catch (e) {
    // fail silently
  }
};
