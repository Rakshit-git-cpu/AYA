import { forwardRef } from 'react';
import type { FutureMatch } from '../../utils/futureSelfMatch';

interface FutureSelfShareCardProps {
    futureMatch: FutureMatch;
    userName?: string;
}

/**
 * Off-screen 1080×1080 Instagram card for dom-to-image capture.
 * Rendered absolutely off-screen, captured via ref in DnaProfile.
 */
export const FutureSelfShareCard = forwardRef<HTMLDivElement, FutureSelfShareCardProps>(
    ({ futureMatch, userName }, ref) => {
        const { archetype } = futureMatch;

        return (
            <div
                ref={ref}
                style={{
                    width: 1080,
                    height: 1080,
                    background: '#0d0d16',
                    fontFamily: "'Space Grotesk', 'Manrope', sans-serif",
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px 90px',
                    boxSizing: 'border-box',
                }}
            >
                {/* Deep space radial bg */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at top, #2b2b38 0%, #000000 60%)',
                    zIndex: 0,
                }} />

                {/* Archetype color ambient glow */}
                <div style={{
                    position: 'absolute',
                    top: '-100px', left: '50%', transform: 'translateX(-50%)',
                    width: 600, height: 600, borderRadius: '50%',
                    background: `radial-gradient(circle, ${archetype.color}25 0%, transparent 70%)`,
                    zIndex: 1,
                }} />

                {/* Corner particles */}
                {[
                    { top: 80,  left: 100, size: 12, color: '#00f2ff' },
                    { top: 150, right: 80, size: 8,  color: '#d575ff' },
                    { bottom: 120, left: 120, size: 10, color: archetype.color },
                    { bottom: 80, right: 100, size: 6,  color: '#ff51fa' },
                ].map((p, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: p.size, height: p.size,
                        borderRadius: '50%',
                        backgroundColor: p.color,
                        top: p.top, left: (p as any).left, right: (p as any).right, bottom: p.bottom,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                        zIndex: 2,
                    }} />
                ))}

                {/* Main card */}
                <div style={{
                    position: 'relative', zIndex: 10,
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(25,25,36,0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 40,
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    boxShadow: `0 0 0 2px #8300b4, inset 0 0 80px rgba(0,0,0,0.4), 0 0 80px rgba(131,0,180,0.2)`,
                    padding: '60px',
                    boxSizing: 'border-box',
                }}>
                    {/* Top label */}
                    <p style={{
                        fontSize: 22, fontWeight: 900, letterSpacing: '0.3em',
                        textTransform: 'uppercase', color: '#00f2ff',
                        textShadow: '0 0 20px rgba(0,242,255,0.9)',
                        marginBottom: 12,
                    }}>🔮 AT YOUR AGE</p>

                    {/* Sub label */}
                    <p style={{
                        fontSize: 18, color: '#757480', letterSpacing: '0.15em',
                        textTransform: 'uppercase', marginBottom: 48,
                    }}>My Future Self Is:</p>

                    {/* Emoji */}
                    <div style={{
                        fontSize: 120, lineHeight: 1, marginBottom: 32,
                        filter: `drop-shadow(0 0 40px ${archetype.color}) drop-shadow(0 0 80px ${archetype.colorSecondary})`,
                    }}>
                        {archetype.emoji}
                    </div>

                    {/* Archetype name */}
                    <h1 style={{
                        fontSize: 90, fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em', lineHeight: 1.05,
                        background: `linear-gradient(135deg, ${archetype.color} 0%, ${archetype.colorSecondary} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: `drop-shadow(0 0 30px ${archetype.color}60)`,
                        marginBottom: 32, textAlign: 'center',
                    }}>
                        {archetype.name}
                    </h1>

                    {/* Percentile badge */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '12px 32px', borderRadius: 60,
                        border: '2px solid rgba(245,158,11,0.5)',
                        background: 'rgba(245,158,11,0.12)',
                        boxShadow: '0 0 25px rgba(245,158,11,0.25)',
                        marginBottom: 48,
                    }}>
                        <span style={{ fontSize: 24 }}>⭐</span>
                        <span style={{
                            fontSize: 22, fontWeight: 900,
                            textTransform: 'uppercase', letterSpacing: '0.15em',
                            color: '#f59e0b',
                        }}>
                            {archetype.percentile} Decision Maker
                        </span>
                    </div>

                    {/* Real match */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 24,
                        padding: '20px 36px', borderRadius: 30,
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        marginBottom: 60,
                    }}>
                        <img
                            src={archetype.realMatchAvatar}
                            alt={archetype.realMatch}
                            style={{
                                width: 70, height: 70, borderRadius: '50%',
                                objectFit: 'cover',
                                border: `3px solid ${archetype.color}`,
                                boxShadow: `0 0 20px ${archetype.color}80`,
                            }}
                        />
                        <div>
                            <p style={{ fontSize: 16, color: '#757480', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                                Closest Real Match
                            </p>
                            <p style={{ fontSize: 26, fontWeight: 900, color: '#e9e6f4' }}>
                                {archetype.realMatch}
                            </p>
                        </div>
                    </div>

                    {/* Discover URL */}
                    <p style={{
                        fontSize: 20, color: '#484752', letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                    }}>
                        Discover yours at <span style={{ color: '#99f7ff' }}>aya-phi-liard.vercel.app</span>
                    </p>

                    {/* User name watermark */}
                    {userName && (
                        <p style={{
                            position: 'absolute', bottom: 32, right: 44,
                            fontSize: 16, color: '#484752', letterSpacing: '0.1em',
                        }}>
                            — {userName}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

FutureSelfShareCard.displayName = 'FutureSelfShareCard';
