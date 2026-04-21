import { useEffect, useRef, useState, useCallback } from 'react';
import './PwaHeader.css';

export function PwaHeader() {
  const headerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isLoaded, setIsLoaded] = useState(false);
  const rafRef = useRef<number>(0);

  // Fade-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax mouse tracking (desktop only)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!headerRef.current) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = headerRef.current!.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    });
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    // Only add parallax on desktop (pointer: fine)
    const mql = window.matchMedia('(pointer: fine)');
    if (mql.matches) {
      header.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    return () => {
      header.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <header
      ref={headerRef}
      id="pwa-header"
      className={`pwa-header ${isLoaded ? 'pwa-header--loaded' : ''}`}
      style={{
        // CSS custom properties for parallax
        '--mx': mousePos.x,
        '--my': mousePos.y,
      } as React.CSSProperties}
    >
      {/* === Background Layers === */}
      <div className="pwa-header__bg" />
      <div className="pwa-header__glass" />
      <div className="pwa-header__noise" />

      {/* === Neon Edge Lighting (bottom border) === */}
      <div className="pwa-header__edge-glow" />

      {/* === Floating Geometric Shapes === */}
      <div className="pwa-header__geo pwa-header__geo--1" aria-hidden="true" />
      <div className="pwa-header__geo pwa-header__geo--2" aria-hidden="true" />
      <div className="pwa-header__geo pwa-header__geo--3" aria-hidden="true" />
      <div className="pwa-header__geo pwa-header__geo--4" aria-hidden="true" />

      {/* === Animated Orbs === */}
      <div className="pwa-header__orb pwa-header__orb--pink" aria-hidden="true" />
      <div className="pwa-header__orb pwa-header__orb--blue" aria-hidden="true" />
      <div className="pwa-header__orb pwa-header__orb--violet" aria-hidden="true" />

      {/* === Draggable Title Bar Region === */}
      <div className="pwa-header__drag-region">
        {/* === Branding / Logo === */}
        <div className="pwa-header__brand">
          <div className="pwa-header__brand-depth" aria-hidden="true" />
          <h1 className="pwa-header__logo" id="pwa-logo">
            <span className="pwa-header__logo-at">AT</span>
            <span className="pwa-header__logo-space"> YOUR </span>
            <span className="pwa-header__logo-age">AGE</span>
          </h1>
        </div>
      </div>

      {/* === Window Controls === */}
      <div className="pwa-header__controls" id="pwa-window-controls">
        <div className="pwa-header__controls-holo" aria-hidden="true" />
        <button
          className="pwa-header__ctrl pwa-header__ctrl--min"
          id="pwa-ctrl-minimize"
          aria-label="Minimize"
          title="Minimize"
          tabIndex={0}
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
            <rect width="10" height="1" rx="0.5" />
          </svg>
        </button>
        <button
          className="pwa-header__ctrl pwa-header__ctrl--max"
          id="pwa-ctrl-maximize"
          aria-label="Maximize"
          title="Maximize"
          tabIndex={0}
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="0.6" y="0.6" width="7.8" height="7.8" rx="1.5" />
          </svg>
        </button>
        <button
          className="pwa-header__ctrl pwa-header__ctrl--close"
          id="pwa-ctrl-close"
          aria-label="Close"
          title="Close"
          tabIndex={0}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <line x1="1.5" y1="1.5" x2="8.5" y2="8.5" />
            <line x1="8.5" y1="1.5" x2="1.5" y2="8.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
