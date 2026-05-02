import { useRef } from 'react';

export const usePreventDoubleTap = (delay: number = 500) => {
  const lastTap = useRef(0);
  const isTapping = useRef(false);

  return (callback: () => void) => (e: React.PointerEvent | React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastTap.current < delay) return;
    if (isTapping.current) return;
    lastTap.current = now;
    isTapping.current = true;
    callback();
    setTimeout(() => { isTapping.current = false; }, delay);
  };
};
