import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../utils/supabase';
import { useSpinCountdown } from '../../hooks/useSpinCountdown';
import './VibeSpinnerButton.css';

interface VibeSpinnerButtonProps {
  streak: number;       // Retained for signature compatibility
  completed: boolean;   // Legacy prop — ignored; we rely on daily_spins_used
  onClick: () => void;
  userId: string;
}

// IST date helper (same as MoodWheel)
const todayIST = (): string =>
  new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  ).toISOString().split('T')[0];

export function VibeSpinnerButton({ onClick, userId }: VibeSpinnerButtonProps) {
  const [spinsUsed, setSpinsUsed] = useState<number | null>(null); // null = loading
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownStr = useSpinCountdown();

  // ── Fetch spin data on mount (or when userId changes) ──────────────────────
  useEffect(() => {
    if (!userId) { setSpinsUsed(0); return; }

    (async () => {
      try {
        const { data } = await supabase
          .from('users')
          .select('daily_spins_used, spin_reset_date')
          .eq('id', userId)
          .maybeSingle();

        if (!data) { setSpinsUsed(0); return; }

        const today = todayIST();
        let used = data.daily_spins_used ?? 0;

        // Reset if it's a new day
        if (!data.spin_reset_date || data.spin_reset_date < today) {
          used = 0;
          await supabase
            .from('users')
            .update({ daily_spins_used: 0, spin_reset_date: today })
            .eq('id', userId);
        }

        setSpinsUsed(used);
      } catch {
        setSpinsUsed(0); // fail open
      }
    })();
  }, [userId]);

  const isLocked = spinsUsed !== null && spinsUsed >= 2;
  const isLoading = spinsUsed === null;

  const handleClick = () => {
    if (isLocked) {
      // Show brief toast
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToastVisible(true);
      toastTimer.current = setTimeout(() => setToastVisible(false), 2200);
      return;
    }
    if (!isLoading) {
      onClick();
    }
  };

  return (
    <div className="vsb-wrapper">
      {/* Sparkles only when unlocked */}
      {!isLocked && !isLoading && (
        <>
          <div className="vsb-sparkle vsb-sp1" />
          <div className="vsb-sparkle vsb-sp2" />
          <div className="vsb-sparkle vsb-sp3" />
        </>
      )}

      <button
        className={`vsb-pill${isLocked ? ' vsb-locked' : ''}`}
        onClick={handleClick}
        aria-label={isLocked ? `Vibe Spinner locked. Next spin in ${countdownStr}` : 'Open Vibe Spinner'}
      >
        {/* Left: mini spinning wheel — greyscale + static when locked */}
        <div className="vsb-mini-wheel-wrap">
          <div className={`vsb-mini-wheel${isLocked ? ' vsb-mini-wheel-locked' : ''}`}>
            <div className={`vsb-wheel-face${isLocked ? ' vsb-wheel-face-locked' : ''}`} />
            <div className="vsb-wheel-rim" />
            <div className="vsb-wheel-hub" />
          </div>
        </div>

        {/* Right: content */}
        {isLocked ? (
          <div className="vibe-spinner-locked">
            <span className="spinner-lock-icon">🔒</span>
            <div className="spinner-locked-text">
              <span className="spinner-locked-title">NEXT SPIN IN</span>
              <span className="spinner-countdown">{countdownStr}</span>
            </div>
          </div>
        ) : (
          <span className="vsb-title">
            {isLoading ? '...' : 'VIBE SPINNER'}
          </span>
        )}
      </button>

      {/* Locked toast */}
      {toastVisible && (
        <div className="vsb-locked-toast">
          Come back when timer hits 00:00:00
        </div>
      )}
    </div>
  );
}
