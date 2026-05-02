import { useState, useEffect } from 'react';

export const useSpinCountdown = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      // Midnight IST = UTC+5:30
      const istOffset = 5.5 * 60 * 60 * 1000;
      const nowIST = new Date(now.getTime() + istOffset);
      const midnightIST = new Date(nowIST);
      midnightIST.setUTCHours(18, 30, 0, 0); // 18:30 UTC = midnight IST
      if (midnightIST <= nowIST) midnightIST.setUTCDate(midnightIST.getUTCDate() + 1);
      const diff = midnightIST.getTime() - nowIST.getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setTimeLeft(`${h}:${m}:${s}`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};
