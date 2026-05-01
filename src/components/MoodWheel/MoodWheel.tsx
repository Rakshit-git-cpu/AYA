import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import './MoodWheel.css';

// ─── Re-exported type (so LevelMap.tsx can import from here) ─────────────────
export type MoodArchetype = 'Heartbreak' | 'Motivation' | 'Confidence' | 'Money' | 'Purpose' | 'Loneliness';

// ─── Segment definitions ─────────────────────────────────────────────────────
const SEGMENTS = [
  { label: 'HEARTBREAK', emoji: '💔', color: '#FF2D78', mood: 'Heartbreak' as MoodArchetype },
  { label: 'AMBITION',   emoji: '⚡', color: '#FF8C00', mood: 'Motivation' as MoodArchetype },
  { label: 'MONEY',      emoji: '💸', color: '#FFD700', mood: 'Money'      as MoodArchetype },
  { label: 'VISION',     emoji: '👁',  color: '#00E5FF', mood: 'Purpose'    as MoodArchetype },
  { label: 'FRIENDSHIP', emoji: '🤝', color: '#00FF88', mood: 'Loneliness' as MoodArchetype },
  { label: 'WILD CARD',  emoji: '🎲', color: '#A855F7', mood: null          },  // null → random pick
] as const;

const NUM_SEGMENTS = SEGMENTS.length;
const DEG_PER_SEGMENT = 360 / NUM_SEGMENTS; // 60°

// ─── Audio helpers (Web Audio API — no external files) ───────────────────────
let _audioCtx: AudioContext | null = null;
const getAudioCtx = (): AudioContext => {
  if (!_audioCtx || _audioCtx.state === 'closed') {
    _audioCtx = new AudioContext();
  }
  return _audioCtx;
};

const playTick = (pitch = 900) => {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = pitch + Math.random() * 60;
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {/* autoplay policy — silently ignore */}
};

const playWin = () => {
  try {
    const ctx = getAudioCtx();
    const notes = [523, 659, 784]; // C5 E5 G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.3, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.4);
      osc.start(t0);
      osc.stop(t0 + 0.45);
    });
  } catch {/* silently ignore */}
};

// ─── IST midnight countdown helper ──────────────────────────────────────────
const getMsToMidnightIST = (): number => {
  const now = new Date();
  // IST = UTC+5:30
  const istOffset = 5.5 * 60 * 60 * 1000;
  const nowIST = new Date(now.getTime() + istOffset);
  const midnightIST = new Date(nowIST);
  midnightIST.setUTCHours(18, 30, 0, 0); // next midnight IST = 18:30 UTC
  if (midnightIST.getTime() <= now.getTime()) {
    midnightIST.setUTCDate(midnightIST.getUTCDate() + 1);
  }
  return midnightIST.getTime() - now.getTime();
};

const formatCountdown = (ms: number): string => {
  if (ms <= 0) return '00:00:00';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

// ─── SVG Pie segment builder ─────────────────────────────────────────────────
const polarToXY = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const buildSegmentPath = (cx: number, cy: number, r: number, startAngle: number, endAngle: number): string => {
  const s = polarToXY(cx, cy, r, startAngle);
  const e = polarToXY(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
};

// ─── Star particle data (generated once) ────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 4,
  opacity: 0.3 + Math.random() * 0.6,
}));

// ─── Confetti particle data ──────────────────────────────────────────────────
const buildConfetti = (color: string) =>
  Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * 360 + Math.random() * 15;
    const dist = 80 + Math.random() * 160;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist - 60,
      rot: Math.random() * 720 - 360,
      dur: 0.9 + Math.random() * 0.5,
      color,
    };
  });

// ─── Component Props ─────────────────────────────────────────────────────────
interface MoodWheelProps {
  userId: string;
  userAge: number;
  onMoodSelected: (mood: string) => void;
  onClose: () => void;
}

// ─── Wheel state machine ─────────────────────────────────────────────────────
type WheelState = 'loading' | 'idle' | 'spinning' | 'landing' | 'result' | 'no-spins';

export function MoodWheel({ userId, onMoodSelected, onClose }: MoodWheelProps) {
  // ── Spin limit state ────────────────────────────────────────────
  const [spinsUsed, setSpinsUsed] = useState(0);
  const [wheelState, setWheelState] = useState<WheelState>('loading');
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [confetti, setConfetti] = useState<ReturnType<typeof buildConfetti>>([]);
  const [showVignette, setShowVignette] = useState(false);
  const [countdown, setCountdown] = useState(() => getMsToMidnightIST());
  const [showShudder, setShowShudder] = useState(false);
  const [pointerLand, setPointerLand] = useState(false);

  // ── Rotation tracking (persists across spins) ───────────────────
  const currentRotRef = useRef(0);  // accumulated degrees
  const [displayRot, setDisplayRot] = useState(0);

  // ── Tick sound tracking ─────────────────────────────────────────
  const lastTickSegRef = useRef(-1);
  const tickRafRef = useRef<number | null>(null);

  // ── Wheel sizing ─────────────────────────────────────────────────
  const [wheelDia, setWheelDia] = useState(300);
  useEffect(() => {
    const calc = () => {
      const isSmall = window.innerHeight < 680;
      const vwFrac = isSmall ? 0.70 : 0.80;
      const dvhFrac = isSmall ? 0.70 : 0.80;
      const fromVW = window.innerWidth * vwFrac;
      const fromDVH = (window.innerHeight - 200) * dvhFrac;
      setWheelDia(Math.max(200, Math.min(fromVW, fromDVH, 420)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // ── Supabase: load spin data ────────────────────────────────────
  useEffect(() => {
    const loadSpins = async () => {
      if (!userId) {
        setWheelState('idle');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('daily_spins_used, spin_reset_date')
          .eq('id', userId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          // No row — fresh user, allow spinning
          setSpinsUsed(0);
          setWheelState('idle');
          return;
        }

        const todayIST = new Date(
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
        ).toISOString().split('T')[0];

        let used = data.daily_spins_used ?? 0;
        const resetDate: string | null = data.spin_reset_date ?? null;

        // Reset if stale date
        if (!resetDate || resetDate < todayIST) {
          used = 0;
          await supabase
            .from('users')
            .update({ daily_spins_used: 0, spin_reset_date: todayIST })
            .eq('id', userId);
        }

        setSpinsUsed(used);
        setWheelState(used >= 2 ? 'no-spins' : 'idle');
      } catch (e) {
        console.warn('[MoodWheel] Failed to load spins:', e);
        // Fail open — allow spinning if Supabase is unreachable
        setSpinsUsed(0);
        setWheelState('idle');
      }
    };

    loadSpins();
  }, [userId]);

  // ── Countdown timer ─────────────────────────────────────────────
  useEffect(() => {
    if (wheelState !== 'no-spins') return;
    const id = setInterval(() => setCountdown(getMsToMidnightIST()), 1000);
    return () => clearInterval(id);
  }, [wheelState]);

  // ── Tick sound during spin ──────────────────────────────────────
  const startTicks = useCallback((totalDuration: number, startRot: number) => {
    const startTime = performance.now();
    const progress = () => {
      const elapsed = performance.now() - startTime;
      const fraction = Math.min(elapsed / (totalDuration * 1000), 1);
      // Pitch goes 700 → 1100 as wheel decelerates (friction builds tension)
      const pitch = 700 + fraction * 400;

      // Current segment under pointer = top (12 o'clock = 0° after adjusting)
      const rot = startRot + (displayRot - startRot) * fraction;
      const normalized = ((rot % 360) + 360) % 360;
      // Pointer is at top = 0°. Segment 0 starts at -30° (centered on top).
      // Which segment is at the top:
      const segIndex = Math.floor(((360 - normalized + DEG_PER_SEGMENT / 2) % 360) / DEG_PER_SEGMENT);

      if (segIndex !== lastTickSegRef.current) {
        lastTickSegRef.current = segIndex;
        playTick(pitch);
      }

      if (fraction < 1) {
        tickRafRef.current = requestAnimationFrame(progress);
      }
    };
    tickRafRef.current = requestAnimationFrame(progress);
  }, [displayRot]);

  const stopTicks = useCallback(() => {
    if (tickRafRef.current) {
      cancelAnimationFrame(tickRafRef.current);
      tickRafRef.current = null;
    }
  }, []);

  // ── Spin logic ──────────────────────────────────────────────────
  const handleSpin = useCallback(async () => {
    if (wheelState !== 'idle') return;

    setWheelState('spinning');

    // Pick winner
    let winIdx = Math.floor(Math.random() * NUM_SEGMENTS);
    // WILD CARD (index 5) → re-roll randomly among 0–4
    if (winIdx === 5) {
      winIdx = Math.floor(Math.random() * 5);
    }

    // Calculate target rotation:
    // We want winIdx segment to land under the pointer (top, 0°).
    // Each segment spans 60°. Segment i center = i * 60° (from top, clockwise).
    // To land segment i at top: we need to rotate so that 0° aligns to its center.
    // Pointer is at top. Segment i center is at i * 60°.
    // Additional spins for drama: 5–8 full rotations
    const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
    const currentMod = ((currentRotRef.current % 360) + 360) % 360;
    // Target absolute position of the wheel: we want segment winIdx at top.
    // Segment winIdx center in wheel coords = winIdx * 60
    // The wheel has rotated currentMod degrees already.
    // We need the wheel's 0 position (top) to show segment winIdx center.
    // Rotation needed to put winIdx at top from current = (360 - winIdx * 60 - currentMod + 360) % 360
    const alignToTop = (360 - winIdx * DEG_PER_SEGMENT - currentMod + 360) % 360;
    const targetRot = currentRotRef.current + alignToTop + extraSpins;

    const totalDuration = 3.5 + Math.random() * 1.5; // 3.5–5s

    // Start tick tracking from current rotation
    const snapStart = currentRotRef.current;
    startTicks(totalDuration, snapStart);

    // Animate with Framer Motion via state → controlled by displayRot
    // Phase 1: burst (0.3s)
    setDisplayRot(currentRotRef.current + 80);
    setTimeout(() => {
      // Phase 2+3: full spin with custom easing (easeOut cubic)
      setDisplayRot(targetRot);
    }, 300);

    // On complete
    setTimeout(() => {
      stopTicks();
      currentRotRef.current = targetRot;
      setWinnerIndex(winIdx);
      setWheelState('landing');

      // Landing FX
      setShowShudder(true);
      setTimeout(() => setShowShudder(false), 400);

      setPointerLand(true);
      setTimeout(() => setPointerLand(false), 500);

      // Confetti
      const winColor = SEGMENTS[winIdx].color;
      setConfetti(buildConfetti(winColor));
      setTimeout(() => setConfetti([]), 2000);

      // Vignette
      setShowVignette(true);
      setTimeout(() => setShowVignette(false), 400);

      // Win sound
      playWin();

      // Increment Supabase spin count
      const newUsed = spinsUsed + 1;
      setSpinsUsed(newUsed);
      if (userId) {
        supabase
          .from('users')
          .update({ daily_spins_used: newUsed })
          .eq('id', userId)
          .then(({ error }) => {
            if (error) console.warn('[MoodWheel] Failed to increment spins:', error);
          });
      }

      // Show result
      setTimeout(() => {
        setWheelState('result');
      }, 500);

      // Auto-trigger mood after 1.5s in result state
      setTimeout(() => {
        const seg = SEGMENTS[winIdx];
        // WILD CARD already resolved above (winIdx is 0–4), so seg.mood is never null here.
        const resolvedMood: MoodArchetype = seg.mood ?? 'Heartbreak';
        onMoodSelected(resolvedMood);
      }, 2200); // 0.5s (landing anim) + 1.5s (result show) + 0.2s buffer

    }, totalDuration * 1000);
  }, [wheelState, spinsUsed, userId, onMoodSelected, startTicks, stopTicks]);

  // ── SVG dimensions ──────────────────────────────────────────────
  const cx = wheelDia / 2;
  const cy = wheelDia / 2;
  const r = wheelDia / 2 - 6;
  const hubR = wheelDia * 0.09;
  const emojiFontSize = wheelDia * 0.09;
  const labelFontSize = Math.max(7, wheelDia * 0.045);
  const emojiR = r * 0.65;  // radial position of emoji
  const labelR = r * 0.82;  // radial position of text label

  // Framer motion transition
  const spinTransition = wheelState === 'spinning'
    ? {
        rotate: {
          duration: displayRot === currentRotRef.current + 80 ? 0.3 : 4.2,
          ease: displayRot === currentRotRef.current + 80
            ? [0.17, 0.67, 0.83, 0.67] as [number,number,number,number]
            : [0.33, 1, 0.68, 1] as [number,number,number,number],
        }
      }
    : { rotate: { duration: 0.1 } };

  const spinsRemaining = Math.max(0, 2 - spinsUsed);

  const spinBtnLabel =
    wheelState === 'loading'  ? 'LOADING...'  :
    wheelState === 'spinning' ? 'SPINNING...' :
    wheelState === 'landing'  ? 'LANDING...'  :
    wheelState === 'result'   ? 'MATCHED!'    :
    wheelState === 'no-spins' ? 'NO SPINS'    :
    '🎰 SPIN';

  return (
    <AnimatePresence>
      <motion.div
        className="mw-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ touchAction: 'none' }}
      >
        {/* ── Stars ── */}
        <div className="mw-stars" aria-hidden="true">
          {STARS.map(s => (
            <div
              key={s.id}
              className="mw-star"
              style={{
                top: `${s.top}%`,
                left: `${s.left}%`,
                '--dur': `${s.dur}s`,
                '--delay': `${s.delay}s`,
                '--opacity': s.opacity,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* ── Close button ── */}
        <button
          className="mw-close-btn"
          onClick={onClose}
          aria-label="Close Mood Wheel"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* ── Vignette flash ── */}
        {showVignette && winnerIndex !== null && (
          <div
            className="mw-vignette-flash"
            style={{ '--flash-color': SEGMENTS[winnerIndex].color } as React.CSSProperties}
            aria-hidden="true"
          />
        )}

        {/* ── Confetti ── */}
        <div className="mw-confetti-container" aria-hidden="true">
          {confetti.map(p => (
            <div
              key={p.id}
              className="mw-confetti-particle"
              style={{
                background: p.color,
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`,
                '--dur': `${p.dur}s`,
                top: '50%',
                left: '50%',
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* ── Spins counter ── */}
        <div className={`mw-spins-counter${wheelState === 'no-spins' ? ' mw-spins-zero' : ''}`}>
          {wheelState === 'no-spins'
            ? `🔒 NO SPINS LEFT — ${formatCountdown(countdown)}`
            : wheelState === 'result' && winnerIndex !== null
              ? `YOUR MOOD: ${SEGMENTS[winnerIndex].emoji} ${SEGMENTS[winnerIndex].label}`
              : `${spinsRemaining} SPIN${spinsRemaining === 1 ? '' : 'S'} LEFT TODAY`
          }
        </div>

        {/* ── Wheel area ── */}
        <div className="mw-wheel-area">

          {/* Pointer */}
          <div className="mw-pointer-wrap" aria-hidden="true">
            <div className={`mw-pointer${pointerLand ? ' mw-pointer-land' : ''}`} />
          </div>

          {/* 3D tilt + outer ring */}
          <div className="mw-tilt-wrap">
            <div className="mw-wheel-outer-ring">
              {/* Spinning SVG */}
              <motion.div
                className={`mw-wheel-3d${showShudder ? ' mw-wheel-shudder' : ''}`}
                animate={{ rotate: displayRot }}
                transition={spinTransition}
                style={{ width: wheelDia, height: wheelDia, borderRadius: '50%', overflow: 'hidden' }}
              >
                <svg
                  className="mw-wheel-svg"
                  width={wheelDia}
                  height={wheelDia}
                  viewBox={`0 0 ${wheelDia} ${wheelDia}`}
                >
                  <defs>
                    {SEGMENTS.map((seg, i) => (
                      <radialGradient key={i} id={`mw-grad-${i}`} cx="30%" cy="30%" r="80%">
                        <stop offset="0%" stopColor={seg.color} stopOpacity="1" />
                        <stop offset="100%" stopColor={seg.color} stopOpacity="0.65" />
                      </radialGradient>
                    ))}
                    <filter id="mw-inner-glow">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Segments */}
                  {SEGMENTS.map((seg, i) => {
                    const start = i * DEG_PER_SEGMENT;
                    const end = start + DEG_PER_SEGMENT;
                    const isWinner = wheelState === 'result' && winnerIndex === i;
                    return (
                      <g key={i}>
                        <path
                          d={buildSegmentPath(cx, cy, r, start, end)}
                          fill={`url(#mw-grad-${i})`}
                          stroke="#FFD700"
                          strokeWidth="2.5"
                          strokeOpacity="0.8"
                          className={isWinner ? 'mw-segment-winner' : ''}
                          style={{ filter: isWinner ? `drop-shadow(0 0 12px ${seg.color})` : undefined }}
                        />
                        {/* Emoji */}
                        <text
                          x={polarToXY(cx, cy, emojiR, start + DEG_PER_SEGMENT / 2).x}
                          y={polarToXY(cx, cy, emojiR, start + DEG_PER_SEGMENT / 2).y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={emojiFontSize}
                          style={{ userSelect: 'none' }}
                        >
                          {seg.emoji}
                        </text>
                        {/* Label */}
                        <text
                          x={polarToXY(cx, cy, labelR, start + DEG_PER_SEGMENT / 2).x}
                          y={polarToXY(cx, cy, labelR, start + DEG_PER_SEGMENT / 2).y}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={labelFontSize}
                          className="mw-seg-label"
                          transform={`rotate(${start + DEG_PER_SEGMENT / 2}, ${polarToXY(cx, cy, labelR, start + DEG_PER_SEGMENT / 2).x}, ${polarToXY(cx, cy, labelR, start + DEG_PER_SEGMENT / 2).y})`}
                        >
                          {seg.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Center hub */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={hubR}
                    fill="radial-gradient(circle at 35% 30%, #fffbe0, #FFD700 45%, #996600)"
                    className="mw-hub"
                  />
                  <circle cx={cx} cy={cy} r={hubR} stroke="#FFD700" strokeWidth="3" strokeOpacity="0.9" fill="none" />
                  <circle cx={cx} cy={cy} r={hubR * 0.6} fill="#FFD700" opacity="0.7" />
                  <circle cx={cx} cy={cy} r={hubR * 0.3} fill="#fff" opacity="0.9" />
                </svg>
              </motion.div>

              {/* No-spins overlay on the wheel */}
              {wheelState === 'no-spins' && (
                <div
                  className="mw-no-spins-overlay"
                  style={{ width: wheelDia, height: wheelDia }}
                  aria-live="polite"
                >
                  <span className="mw-lock-icon">🔒</span>
                  <span className="mw-countdown-text">
                    Come back tomorrow<br />
                    Resets in {formatCountdown(countdown)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Result badge — floats above wheel in result state */}
          <AnimatePresence>
            {wheelState === 'result' && winnerIndex !== null && (
              <motion.div
                className="mw-result-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ position: 'static', marginTop: 12 }}
              >
                <div
                  className="mw-mood-banner"
                  style={{
                    color: SEGMENTS[winnerIndex].color,
                    borderColor: `${SEGMENTS[winnerIndex].color}60`,
                    background: `${SEGMENTS[winnerIndex].color}15`,
                    textShadow: `0 0 15px ${SEGMENTS[winnerIndex].color}`,
                  }}
                >
                  {SEGMENTS[winnerIndex].emoji} YOUR MOOD: {SEGMENTS[winnerIndex].label}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SPIN button ── */}
        <button
          id="mood-wheel-spin-btn"
          className={`mw-spin-btn${wheelState === 'spinning' ? ' mw-spinning' : ''}`}
          disabled={wheelState !== 'idle'}
          onClick={handleSpin}
          aria-label="Spin the mood wheel"
          aria-disabled={wheelState !== 'idle'}
        >
          {spinBtnLabel}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
