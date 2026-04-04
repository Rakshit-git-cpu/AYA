import { forwardRef } from 'react';
import type { UserProfile } from '../../types/gameTypes';

interface InstagramCardProps {
    profile: UserProfile | null;
    personalityDNA: {
        idol1: { name: string; avatarUrl: string; desc: string };
        idol2: { name: string; avatarUrl: string; desc: string };
    } | null;
    dynamicProfileTag: string;
    levelName: string;
    topMatchName?: string;
    topMatchScore?: number;
}

export const InstagramCard = forwardRef<HTMLDivElement, InstagramCardProps>(
    ({ profile, personalityDNA, levelName, topMatchName, topMatchScore }, ref) => {

        const userTraits = profile?.traits || {
            risk: 50, creativity: 50, vision: 50, empathy: 50, leadership: 50
        };

        const hookCelebrity = topMatchName || 'Kobe Bryant';
        const matchScore = topMatchScore || Math.floor(Math.random() * 20) + 70;

        const renderBar = (
            label: string,
            value: number,
            colorHex: string,
            bgFrom: string
        ) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '6px' }}>
                <span style={{
                    width: '86px',
                    fontSize: '9px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    color: '#d0c6ab',
                    fontWeight: 700,
                    flexShrink: 0
                }}>
                    {label}
                </span>
                <div style={{
                    flexGrow: 1,
                    height: '4px',
                    backgroundColor: '#353534',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    <div style={{
                        height: '100%',
                        width: `${value}%`,
                        background: `linear-gradient(90deg, ${bgFrom}66, ${colorHex})`,
                        boxShadow: `0 0 8px ${colorHex}`
                    }} />
                </div>
                <span style={{
                    width: '28px',
                    textAlign: 'right',
                    fontSize: '9px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    color: colorHex,
                    flexShrink: 0
                }}>
                    {value}%
                </span>
            </div>
        );

        return (
            <div
                ref={ref}
                style={{
                    width: '1080px',
                    height: '1080px',
                    backgroundColor: '#131313',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxSizing: 'border-box'
                }}
            >
                {/* Google Fonts Load */}
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Space+Grotesk:wght@300..700&display=swap');
                    .aya-serif { font-family: 'Newsreader', serif; }
                    .aya-sans { font-family: 'Space Grotesk', sans-serif; }
                `}</style>

                {/* === TEXTURE LAYERS === */}
                {/* Dot Grid */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(#4d4732 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    opacity: 0.15
                }} />
                {/* Diagonal Light Leak */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.06) 0%, transparent 40%, rgba(0,241,254,0.06) 100%)'
                }} />
                {/* Corner Vignette */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse at center, transparent 30%, #000 110%)'
                }} />
                {/* Extra Heavy Corners */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(to bottom right, rgba(0,0,0,0.6) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.6) 100%)'
                }} />

                {/* === HEADER BAR === */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '28px 48px',
                    background: 'rgba(10,10,10,0.85)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(255,215,0,0.1)',
                    position: 'relative', zIndex: 10
                }}>
                    <span className="aya-serif" style={{
                        color: '#FFD700',
                        fontSize: '28px',
                        fontWeight: 900,
                        letterSpacing: '-0.01em',
                        textTransform: 'uppercase'
                    }}>AT YOUR AGE</span>
                    <span className="aya-sans" style={{
                        fontSize: '9px',
                        color: '#d0c6ab',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        opacity: 0.5
                    }}>Your personality. Their story. Your destiny.</span>
                </div>

                {/* === MAIN CONTENT === */}
                <div style={{
                    flexGrow: 1, display: 'flex', flexDirection: 'column',
                    padding: '44px 52px 36px',
                    position: 'relative', zIndex: 5
                }}>

                    {/* === HOOK SECTION === */}
                    <div style={{ marginBottom: '36px' }}>
                        <h1 className="aya-serif" style={{
                            fontSize: '84px',
                            fontWeight: 900,
                            color: '#fff6df',
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                            transform: 'rotate(-1.5deg)',
                            display: 'inline-block',
                            marginBottom: '10px'
                        }}>
                            AT YOUR AGE...
                        </h1>
                        <p className="aya-serif" style={{
                            fontSize: '22px',
                            fontStyle: 'italic',
                            color: '#FFD700',
                            lineHeight: 1.3,
                            marginBottom: '14px'
                        }}>
                            {hookCelebrity} was already rewriting their destiny
                        </p>
                        <span className="aya-sans" style={{
                            display: 'inline-block',
                            padding: '5px 14px',
                            background: 'rgba(53,53,52,0.7)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(77,71,50,0.4)',
                            fontSize: '10px',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: '#e5e2e1'
                        }}>
                            What would YOU have done?
                        </span>
                    </div>

                    {/* === IDENTITY SECTION === */}
                    <div style={{ marginBottom: '32px' }}>
                        <h2 className="aya-sans" style={{
                            fontSize: '80px',
                            fontWeight: 800,
                            color: '#e5e2e1',
                            letterSpacing: '-0.02em',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            marginBottom: '8px'
                        }}>
                            {profile?.name || 'GUEST_0X'}
                        </h2>
                        <p className="aya-sans" style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#00f1fe',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase'
                        }}>
                            Age {profile?.age || 18}  •  Level {profile?.level || 1}  —  {levelName}
                        </p>

                        {/* Portrait Row */}
                        {personalityDNA && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '24px' }}>
                                {/* Portrait 1 — Gold ring */}
                                <div style={{
                                    width: '100px', height: '100px', borderRadius: '50%',
                                    border: '2.5px solid #FFD700',
                                    boxShadow: '0 0 30px rgba(255,215,0,0.35), 0 0 60px rgba(255,215,0,0.1)',
                                    overflow: 'hidden', flexShrink: 0,
                                    padding: '3px', background: 'rgba(0,0,0,0.5)'
                                }}>
                                    <img
                                        src={personalityDNA.idol1.avatarUrl}
                                        alt={personalityDNA.idol1.name}
                                        crossOrigin="anonymous"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </div>
                                <span className="aya-sans" style={{ fontSize: '28px', color: '#FFD700', fontWeight: 900 }}>+</span>
                                {/* Portrait 2 — Cyan ring */}
                                <div style={{
                                    width: '88px', height: '88px', borderRadius: '50%',
                                    border: '2.5px solid #00f1fe',
                                    boxShadow: '0 0 30px rgba(0,241,254,0.35), 0 0 60px rgba(0,241,254,0.1)',
                                    overflow: 'hidden', flexShrink: 0,
                                    padding: '3px', background: 'rgba(0,0,0,0.5)'
                                }}>
                                    <img
                                        src={personalityDNA.idol2.avatarUrl}
                                        alt={personalityDNA.idol2.name}
                                        crossOrigin="anonymous"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </div>

                                {/* Gold Blockquote */}
                                <blockquote className="aya-serif" style={{
                                    fontSize: '17px',
                                    fontStyle: 'italic',
                                    color: 'rgba(255,215,0,0.9)',
                                    lineHeight: 1.4,
                                    borderLeft: '2px solid rgba(255,215,0,0.3)',
                                    paddingLeft: '16px',
                                    maxWidth: '340px'
                                }}>
                                    "{`You have ${personalityDNA.idol1.desc} and ${personalityDNA.idol2.desc}`}"
                                </blockquote>
                            </div>
                        )}
                    </div>

                    {/* === PERSONALITY DNA STATS HUD === */}
                    <div style={{ marginTop: 'auto' }}>
                        <div className="aya-sans" style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.35em',
                            color: '#999077',
                            marginBottom: '18px'
                        }}>
                            PERSONALITY DNA
                        </div>

                        {renderBar('Risk Taker', userTraits.risk || 50, '#ff716c', '#ff2d55')}
                        {renderBar('Creative', userTraits.creativity || 50, '#d575ff', '#9800d0')}
                        {renderBar('Analytical', userTraits.vision || 50, '#00f1fe', '#00a8c6')}
                        {renderBar('Social', userTraits.empathy || 50, '#4ade80', '#16a34a')}
                        {renderBar('Ambitious', userTraits.leadership || 50, '#FFD700', '#b45309')}

                        {/* Match Score */}
                        <div style={{ marginTop: '18px' }}>
                            <span className="aya-sans" style={{
                                fontSize: '19px',
                                fontWeight: 700,
                                color: '#FFD700',
                                letterSpacing: '0.02em'
                            }}>
                                {matchScore}% DNA Match with {hookCelebrity} 🏆
                            </span>
                        </div>
                    </div>
                </div>

                {/* === FOOTER === */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 48px',
                    background: 'rgba(10,10,10,0.6)',
                    backdropFilter: 'blur(12px)',
                    borderTop: '1px solid rgba(0,241,254,0.12)',
                    boxShadow: '0 -4px 24px rgba(0,241,254,0.08)',
                    position: 'relative', zIndex: 10
                }}>
                    <span className="aya-sans" style={{
                        fontSize: '24px', fontWeight: 900, color: '#FFD700', letterSpacing: '-0.01em'
                    }}>AYA</span>
                    <span className="aya-sans" style={{
                        fontSize: '10px', color: '#00f1fe', letterSpacing: '0.15em', textTransform: 'uppercase'
                    }}>
                        Play Free → aya-phi-liard.vercel.app
                    </span>
                    <span className="aya-sans" style={{
                        fontSize: '10px', color: '#e5e2e1', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.7
                    }}>
                        🧬 Find YOUR DNA
                    </span>
                </div>
            </div>
        );
    }
);

InstagramCard.displayName = 'InstagramCard';
