import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import './MoodWheel.css';

// ─── Exported type (re-exported so LevelMap can import from here) ─────────────
export type MoodArchetype =
  | 'Heartbreak' | 'Motivation' | 'Confidence'
  | 'Money'      | 'Purpose'    | 'Loneliness';

// ─── Segment definitions ──────────────────────────────────────────────────────
const SEGMENTS = [
  { label: 'HEARTBREAK', emoji: '💔', base: '#8B0030', glow: '#FF2D78', mood: 'Heartbreak'  as MoodArchetype },
  { label: 'AMBITION',   emoji: '⚡', base: '#7A3800', glow: '#FF8C00', mood: 'Motivation'  as MoodArchetype },
  { label: 'MONEY',      emoji: '💸', base: '#7A6000', glow: '#FFD700', mood: 'Money'        as MoodArchetype },
  { label: 'VISION',     emoji: '👁',  base: '#003D47', glow: '#00E5FF', mood: 'Purpose'     as MoodArchetype },
  { label: 'FRIENDSHIP', emoji: '🤝', base: '#004D2A', glow: '#00FF88', mood: 'Loneliness'  as MoodArchetype },
  { label: 'WILD CARD',  emoji: '🎲', base: '#3D0080', glow: '#A855F7', mood: null },
] as const;

const N = SEGMENTS.length;         // 6
const SEG_DEG = 360 / N;           // 60°

// ─── IST helpers ─────────────────────────────────────────────────────────────
const todayIST = (): string => {
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  ).toISOString().split('T')[0];
};

const msToMidnightIST = (): number => {
  const now = Date.now();
  const istNow = new Date(now + 5.5 * 3_600_000);
  const midnight = new Date(istNow);
  midnight.setUTCHours(18, 30, 0, 0); // 18:30 UTC = midnight IST
  if (midnight.getTime() <= now) midnight.setUTCDate(midnight.getUTCDate() + 1);
  return midnight.getTime() - now;
};

const fmtCountdown = (ms: number) => {
  if (ms <= 0) return '00:00:00';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

// ─── Web Audio API ────────────────────────────────────────────────────────────
let _ctx: AudioContext | null = null;
const getCtx = (): AudioContext | null => {
  try {
    if (!_ctx || _ctx.state === 'closed') _ctx = new AudioContext();
    if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
    return _ctx;
  } catch { return null; }
};

const playTick = () => {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 600 + Math.random() * 150;
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch { /* silent */ }
};

const playWin = () => {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.5, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
      osc.start(t0);
      osc.stop(t0 + 0.38);
    });
  } catch { /* silent */ }
};

// ─── SVG polar math ───────────────────────────────────────────────────────────
const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const segPath = (cx: number, cy: number, r: number, start: number, end: number) => {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y} Z`;
};

// ─── Stars (generated once) ───────────────────────────────────────────────────
const STARS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: 1 + Math.random() * 2,
  dur: 6 + Math.random() * 7,
  delay: Math.random() * 6,
  op: 0.3 + Math.random() * 0.6,
  dx: (Math.random() - 0.5) * 14,
  dy: -6 - Math.random() * 16,
}));

// ─── Confetti builder ─────────────────────────────────────────────────────────
const buildConfetti = (color: string) =>
  Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360 + Math.random() * 14;
    const dist = 70 + Math.random() * 180;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      color,
      tx: Math.cos(rad) * dist,
      ty: Math.sin(rad) * dist - 50,
      rot: Math.random() * 800 - 400,
      dur: 0.9 + Math.random() * 0.55,
    };
  });

// ─── Props ────────────────────────────────────────────────────────────────────
interface MoodWheelProps {
  userId: string;
  userAge: number;
  onMoodSelected: (mood: string) => void;
  onClose: () => void;
}

// ─── State machine ────────────────────────────────────────────────────────────
type WheelPhase = 'loading' | 'idle' | 'spinning' | 'landing' | 'result' | 'no-spins';

// ─── Component ────────────────────────────────────────────────────────────────
export function MoodWheel({ userId, onMoodSelected, onClose }: MoodWheelProps) {
  // Spin limit
  const [spinsUsed, setSpinsUsed]   = useState(0);
  const [phase, setPhase]           = useState<WheelPhase>('loading');
  const [winIdx, setWinIdx]         = useState<number | null>(null);
  const [confetti, setConfetti]     = useState<ReturnType<typeof buildConfetti>>([]);
  const [showVignette, setVignette] = useState(false);
  const [isShudder, setShudder]     = useState(false);
  const [pointerLand, setPointerLand] = useState(false);
  const [countdown, setCountdown]   = useState(() => msToMidnightIST());

  // Framer Motion value for wheel rotation (no re-renders per frame)
  const rotation = useMotionValue(0);

  // Tick tracking
  const lastSegRef = useRef(-1);
  const totalRotRef = useRef(0); // kept in sync after each spin

  // Wheel sizing
  const [dia, setDia] = useState(300);
  useEffect(() => {
    const calc = () => {
      const small = window.innerHeight < 680;
      const vwF = small ? 0.70 : 0.78;
      const dvhAdj = window.innerHeight - 220;
      setDia(Math.max(180, Math.min(window.innerWidth * vwF, dvhAdj, 430)));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Supabase: load spin data on mount
  useEffect(() => {
    (async () => {
      if (!userId) { setPhase('idle'); return; }
      try {
        const { data } = await supabase
          .from('users')
          .select('daily_spins_used, spin_reset_date')
          .eq('id', userId)
          .maybeSingle();

        if (!data) { setSpinsUsed(0); setPhase('idle'); return; }

        const today = todayIST();
        let used = data.daily_spins_used ?? 0;

        if (!data.spin_reset_date || data.spin_reset_date < today) {
          used = 0;
          await supabase.from('users')
            .update({ daily_spins_used: 0, spin_reset_date: today })
            .eq('id', userId);
        }

        setSpinsUsed(used);
        setPhase(used >= 2 ? 'no-spins' : 'idle');
      } catch {
        setSpinsUsed(0);
        setPhase('idle'); // fail open
      }
    })();
  }, [userId]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'no-spins') return;
    const id = setInterval(() => setCountdown(msToMidnightIST()), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Tick sound: subscribe to rotation motion value changes
  useEffect(() => {
    const unsub = rotation.on('change', (val) => {
      if (phase !== 'spinning') return;
      const norm = ((val % 360) + 360) % 360;
      // Which segment is at the top (pointer) after this rotation:
      // Pointer is at 0°. Segment i center = i*60+30. After rotation val,
      // the part at top is from original position (360 - norm)%360.
      const atTop = ((360 - norm) % 360);
      const seg = Math.floor(((atTop + 30) % 360) / 60);
      if (seg !== lastSegRef.current) {
        lastSegRef.current = seg;
        playTick();
      }
    });
    return () => unsub();
  }, [rotation, phase]);

  // ── Spin handler ────────────────────────────────────────────────────────────
  const handleSpin = useCallback(async () => {
    if (phase !== 'idle' || spinsUsed >= 2) return;

    // Initialise AudioContext on user gesture (autoplay policy)
    getCtx();

    setPhase('spinning');

    // Step 1: pick a truly random winning segment fresh every spin
    let winningIndex = Math.floor(Math.random() * 6); // 0–5, new every time
    if (winningIndex === 5) winningIndex = Math.floor(Math.random() * 5); // Remap wild card

    // Step 2: calculate the angle of the center of winning segment
    const segmentCenter = winningIndex * 60 + 30; // center of that segment in degrees
    const randomOffsetWithinSegment = (Math.random() - 0.5) * 30; // ±15° wobble
    const targetSegmentAngle = segmentCenter + randomOffsetWithinSegment;

    // Step 3: calculate total rotation
    const fullRotations = (4 + Math.floor(Math.random() * 3)) * 360; // 4–6 full spins
    const totalRotation = totalRotRef.current + fullRotations + targetSegmentAngle;

    // Step 4: update the ref for next spin
    totalRotRef.current = totalRotation;

    // Step 5: animate to totalRotation
    await animate(rotation, totalRotation, {
      duration: 4,
      ease: [0.2, 0.8, 0.2, 1], // simple 4s deceleration
    });

    // Step 6: after animation completes, derive which segment is under pointer
    const normalizedAngle = totalRotation % 360;
    const actualWinningIndex = Math.floor(normalizedAngle / 60) % 6;
    const wonSegment = SEGMENTS[actualWinningIndex];
    
    // ── Landing effects ──
    setWinIdx(actualWinningIndex);
    setPhase('landing');

    // Shudder
    setShudder(true);
    setTimeout(() => setShudder(false), 500);

    // Pointer bounce
    setPointerLand(true);
    setTimeout(() => setPointerLand(false), 500);

    // Confetti + vignette
    const winGlow = wonSegment.glow;
    setConfetti(buildConfetti(winGlow));
    setTimeout(() => setConfetti([]), 2200);
    setVignette(true);
    setTimeout(() => setVignette(false), 400);

    // Win sound
    playWin();

    // Increment Supabase spins
    const newUsed = spinsUsed + 1;
    setSpinsUsed(newUsed);
    if (userId) {
      supabase.from('users')
        .update({ daily_spins_used: newUsed })
        .eq('id', userId)
        .then(({ error }) => { if (error) console.warn('[MoodWheel] spin update error', error); });
    }

    // Show result after shudder settles
    setTimeout(() => {
      setPhase('result');
      // After 1.5s in result → trigger callback
      setTimeout(() => {
        const resolved: MoodArchetype = wonSegment.mood ?? 'Heartbreak';
        onMoodSelected(resolved);
      }, 1500);
    }, 600);
  }, [phase, spinsUsed, userId, rotation, onMoodSelected]);

  // ── SVG geometry ────────────────────────────────────────────────────────────
  const cx = dia / 2, cy = dia / 2;
  const r = dia / 2 - 4;
  const hubR = dia * 0.1;
  const emojiR = r * 0.62;
  const labelR = r * 0.83;
  const emojiFz = Math.max(14, dia * 0.09);
  const labelFz = Math.max(7, dia * 0.052);

  const spinsLeft = Math.max(0, 2 - spinsUsed);

  const btnLabel =
    phase === 'loading'   ? 'LOADING...'  :
    phase === 'spinning'  ? 'SPINNING...' :
    phase === 'landing'   ? '⭐ LANDED!'  :
    phase === 'result'    ? '✨ MATCHED!' :
    phase === 'no-spins'  ? 'NO SPINS LEFT' :
    '🎰  SPIN';

  return (
    <AnimatePresence>
      <motion.div
        className="mw-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        {/* Stars */}
        <div className="mw-stars" aria-hidden>
          {STARS.map(s => (
            <div
              key={s.id}
              className="mw-star"
              style={{
                top: `${s.top}%`, left: `${s.left}%`,
                width: s.size, height: s.size,
                '--dur': `${s.dur}s`, '--delay': `${s.delay}s`,
                '--op': s.op, '--dx': `${s.dx}px`, '--dy': `${s.dy}px`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Vignette flash */}
        {showVignette && winIdx !== null && (
          <div
            className="mw-vignette"
            style={{ '--vc': SEGMENTS[winIdx].glow } as React.CSSProperties}
            aria-hidden
          />
        )}

        {/* Confetti */}
        <div className="mw-confetti-layer" aria-hidden>
          {confetti.map(p => (
            <div
              key={p.id}
              className="mw-confetti-particle"
              style={{
                background: p.color,
                '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
                '--rot': `${p.rot}deg`, '--dur': `${p.dur}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* BUG 1: Back Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 9999,
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            cursor: 'pointer',
            padding: '12px',
            minHeight: '44px',
            minWidth: '44px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← BACK
        </button>

        {/* BUG 2: Spins Counter */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 9999,
            color: spinsUsed >= 2 ? '#FF2D78' : '#00E5FF',
            fontSize: '13px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '12px',
            textAlign: 'right',
          }}
        >
          {spinsUsed >= 2
            ? '🔒 NO SPINS LEFT'
            : spinsUsed === 1
            ? '1 SPIN LEFT TODAY'
            : '2 SPINS LEFT TODAY'}
        </div>

        {/* ── Wheel area ── */}
        <div className="mw-wheel-area">

          {/* Gold pointer */}
          <div className="mw-pointer-wrap">
            <div className={`mw-pointer ${pointerLand ? 'mw-pointer-land' : 'mw-pointer-idle'}`} />
          </div>

          {/* 3D perspective + ring */}
          <div className="mw-perspective">
            <div className={`mw-wheel-tilt${isShudder ? ' mw-shudder' : ''}`}>
              <div className="mw-outer-ring">
                {/* Spinning SVG */}
                <motion.div
                  style={{
                    rotate: rotation,
                    width: dia,
                    height: dia,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    opacity: phase === 'no-spins' ? 0.38 : 1,
                    transition: 'opacity 0.4s',
                  }}
                >
                  <svg
                    className="mw-wheel-svg"
                    width={dia}
                    height={dia}
                    viewBox={`0 0 ${dia} ${dia}`}
                  >
                    <defs>
                      {SEGMENTS.map((seg, i) => (
                        <radialGradient key={i} id={`mwg${i}`} cx="38%" cy="38%" r="75%">
                          <stop offset="0%" stopColor={seg.glow} stopOpacity="0.55" />
                          <stop offset="55%" stopColor={seg.base} stopOpacity="1" />
                          <stop offset="100%" stopColor={seg.base} stopOpacity="0.9" />
                        </radialGradient>
                      ))}
                      {/* Inner glow filter */}
                      <filter id="mwInnerGlow" x="-5%" y="-5%" width="110%" height="110%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Segments */}
                    {SEGMENTS.map((seg, i) => {
                      // Reverse visual drawing so it matches the clockwise rotation logic perfectly
                      const start = 360 - (i + 1) * SEG_DEG;
                      const end   = 360 - i * SEG_DEG;
                      const isWinner = phase === 'result' && winIdx === i;
                      const midAngle = start + SEG_DEG / 2;
                      const ePos = polar(cx, cy, emojiR, midAngle);
                      const lPos = polar(cx, cy, labelR, midAngle);

                      return (
                        <g key={i} className={isWinner ? 'mw-seg-winner' : ''}>
                          {/* Segment fill */}
                          <path
                            d={segPath(cx, cy, r, start, end)}
                            fill={`url(#mwg${i})`}
                            stroke="#FFD700"
                            strokeWidth="1.5"
                            strokeOpacity="0.7"
                          />
                          {/* Inner glow edge */}
                          <path
                            d={segPath(cx, cy, r * 0.98, start + 1, end - 1)}
                            fill="none"
                            stroke={seg.glow}
                            strokeWidth="3"
                            strokeOpacity="0.25"
                          />
                          {/* Emoji */}
                          <text
                            x={ePos.x} y={ePos.y}
                            textAnchor="middle" dominantBaseline="middle"
                            fontSize={emojiFz}
                            style={{ userSelect: 'none', pointerEvents: 'none' }}
                          >{seg.emoji}</text>
                          {/* Rotated label */}
                          <text
                            x={lPos.x} y={lPos.y}
                            textAnchor="middle" dominantBaseline="middle"
                            fontSize={labelFz}
                            fontFamily="Space Grotesk, sans-serif"
                            fontWeight="800"
                            letterSpacing="0.06em"
                            fill="#fff"
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth="2"
                            paintOrder="stroke fill"
                            style={{ userSelect: 'none', pointerEvents: 'none', textTransform: 'uppercase' }}
                            transform={`rotate(${midAngle}, ${lPos.x}, ${lPos.y})`}
                          >{seg.label}</text>
                        </g>
                      );
                    })}

                    {/* Hub */}
                    <circle cx={cx} cy={cy} r={hubR + 3}
                      fill="none" stroke="#FFD700" strokeWidth="2.5" strokeOpacity="0.9"
                      style={{ filter: 'drop-shadow(0 0 6px #FFD700)' }}
                    />
                    <circle cx={cx} cy={cy} r={hubR}
                      fill="radial-gradient"
                      style={{
                        fill: 'url(#hubGrad)',
                        animation: 'hub-pulse 2.5s ease-in-out infinite',
                        filter: 'drop-shadow(0 0 8px #FFD70080)',
                      }}
                    />
                    <defs>
                      <radialGradient id="hubGrad" cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
                        <stop offset="30%" stopColor="#FFD700" stopOpacity="0.7" />
                        <stop offset="70%" stopColor="#1a0a00" stopOpacity="0.95" />
                        <stop offset="100%" stopColor="#0a0800" stopOpacity="1" />
                      </radialGradient>
                    </defs>
                    {/* Hub glint */}
                    <circle cx={cx - hubR*0.28} cy={cy - hubR*0.28} r={hubR * 0.22}
                      fill="rgba(255,255,255,0.55)"
                    />
                  </svg>
                </motion.div>

                {/* No-spins overlay */}
                {phase === 'no-spins' && (
                  <div className="mw-no-spins-overlay" style={{ width: dia, height: dia }}>
                    <span className="mw-lock-emoji">🔒</span>
                    <span className="mw-comeback-text">COME BACK TOMORROW</span>
                    <span className="mw-countdown">Resets in {fmtCountdown(countdown)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mood banner (result phase) */}
          <AnimatePresence>
            {phase === 'result' && winIdx !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
              >
                <div
                  className="mw-mood-banner"
                  style={{
                    color: SEGMENTS[winIdx].glow,
                    borderColor: `${SEGMENTS[winIdx].glow}55`,
                    background: `${SEGMENTS[winIdx].glow}12`,
                    textShadow: `0 0 14px ${SEGMENTS[winIdx].glow}`,
                  }}
                >
                  {SEGMENTS[winIdx].emoji} YOUR MOOD: {SEGMENTS[winIdx].label}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── SPIN button ── */}
        <button
          id="mood-wheel-spin-btn"
          className={`mw-spin-btn${phase === 'no-spins' ? ' no-spins' : ''}`}
          disabled={phase !== 'idle'}
          onClick={handleSpin}
          aria-label="Spin the mood wheel"
        >
          {btnLabel}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
