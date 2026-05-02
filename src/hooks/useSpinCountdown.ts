import { useState, useEffect } from 'react';

/**
 * Returns a live HH:MM:SS countdown string to the next midnight IST.
 * Updates every second. Extracted from MoodWheel so both the map button
 * and the wheel share identical logic.
 */
export const useSpinCountdown = (): string => {
  const getMsToMidnightIST = (): number => {
    const now = Date.now();
    const istNow = new Date(now + 5.5 * 3_600_000);
    const midnight = new Date(istNow);
    midnight.setUTCHours(18, 30, 0, 0); // 18:30 UTC = midnight IST
    if (midnight.getTime() <= now) midnight.setUTCDate(midnight.getUTCDate() + 1);
    return midnight.getTime() - now;
  };

  const fmt = (ms: number): string => {
    if (ms <= 0) return '00:00:00';
    const h = Math.floor(ms / 3_600_000);
    const m = Math.floor((ms % 3_600_000) / 60_000);
    const s = Math.floor((ms % 60_000) / 1_000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const [timeLeft, setTimeLeft] = useState(() => fmt(getMsToMidnightIST()));

  useEffect(() => {
    const tick = () => setTimeLeft(fmt(getMsToMidnightIST()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
};
