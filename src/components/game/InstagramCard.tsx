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
}

export const InstagramCard = forwardRef<HTMLDivElement, InstagramCardProps>(
    ({ profile, personalityDNA, dynamicProfileTag, levelName }, ref) => {
        // Fallback traits if profile missing completely
        const userTraits = profile?.traits || {
            risk: 50,
            creativity: 50,
            vision: 50,
            empathy: 50,
            leadership: 50
        };

        const renderBar = (label: string, value: number, colorClass: string, glowClass: string) => (
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <span className={`font-space text-[14px] uppercase tracking-wider ${colorClass}`}>{label}</span>
                    <span className="font-space text-lg font-bold text-[#f2effb]">{value}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#252531] rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${glowClass}`} style={{ width: `${value}%` }}></div>
                </div>
            </div>
        );

        return (
            <div 
                ref={ref}
                /* We ensure text sizes scale nicely assuming 1080px base */
                className="relative w-[1080px] h-[1080px] bg-[#000000] overflow-hidden flex flex-col items-stretch justify-between"
                style={{ 
                    fontFamily: "'Manrope', sans-serif",
                    // Use a slight transform or container hack so html2canvas renders perfectly at 1:1
                    boxSizing: 'border-box'
                }}
            >
                {/* Atmospheric Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Neon Corner Glows */}
                    <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#99f7ff]/20 rounded-full blur-[120px]"></div>
                    <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#d575ff]/20 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-[#ff51fa]/10 rounded-full blur-[100px]"></div>
                    
                    {/* Particle Field Simulation */}
                    <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 top-10 left-20"></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 top-40 left-80"></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 top-1/4 right-1/4"></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 bottom-1/3 left-10"></div>
                    <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 bottom-10 right-20"></div>
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-50 top-1/2 left-1/2"></div>
                </div>

                {/* Header Section */}
                <header className="relative z-10 px-16 pt-16 text-center flex flex-col items-center">
                    <h1 className="text-7xl font-bold tracking-[0.1em] text-[#99f7ff] drop-shadow-[0_0_20px_rgba(153,247,255,0.8)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        AT YOUR AGE
                    </h1>
                    <p className="mt-4 text-[#acaab5] italic font-light tracking-wide text-2xl">Who were you meant to become?</p>
                </header>

                {/* User Identity & Main Content Canvas */}
                <main className="relative z-10 flex-grow px-16 flex flex-col justify-center gap-10 py-10">
                    
                    {/* Identity Card */}
                    <div className="bg-[rgba(25,25,35,0.4)] backdrop-blur-[16px] rounded-3xl p-8 border border-[#484751]/40 shadow-lg text-center">
                        <h2 className="text-6xl font-extrabold tracking-tight text-[#f2effb] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {profile?.name || 'GUEST_0X'}
                        </h2>
                        <p className="text-[#99f7ff] text-2xl font-semibold tracking-[0.2em] mt-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Age {profile?.age || 18} • Level {profile?.level || 1} — {levelName}
                        </p>
                    </div>

                    {/* DNA Match Section */}
                    {personalityDNA && (
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex items-center justify-center gap-16 relative">
                                
                                {/* DNA Portrait 1 */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-[#99f7ff] to-transparent shadow-[0_0_30px_rgba(153,247,255,0.3)]">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#99f7ff]/40">
                                            <img src={personalityDNA.idol1.avatarUrl} alt="Idol 1" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <span className="text-[16px] tracking-widest text-[#f2effb]/60 uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {personalityDNA.idol1.name}
                                    </span>
                                </div>

                                {/* Add Icon */}
                                <div className="absolute z-20 flex items-center justify-center">
                                    <div className="bg-[#191923] rounded-full p-4 border-2 border-[#484751] shadow-xl text-[#99f7ff] text-5xl font-black">
                                        +
                                    </div>
                                </div>

                                {/* DNA Portrait 2 */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative w-44 h-44 rounded-full p-1.5 bg-gradient-to-tr from-[#d575ff] to-transparent shadow-[0_0_30px_rgba(213,117,255,0.3)]">
                                        <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#d575ff]/40">
                                            <img src={personalityDNA.idol2.avatarUrl} alt="Idol 2" crossOrigin="anonymous" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                    <span className="text-[16px] tracking-widest text-[#f2effb]/60 uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        {personalityDNA.idol2.name}
                                    </span>
                                </div>
                            </div>

                            {/* Quote */}
                            <p className="text-[#ffb800] italic text-center text-3xl px-12 leading-relaxed opacity-95 max-w-4xl" style={{ textShadow: "0 0 10px rgba(255,184,0,0.4)" }}>
                                "{`You have ${personalityDNA.idol1.desc} and ${personalityDNA.idol2.desc}`}"
                            </p>
                        </div>
                    )}

                    {/* Trait Bars Section */}
                    <div className="grid grid-cols-1 gap-7 px-8 mt-4">
                        {renderBar("Risk Taker", userTraits.risk || 50, "text-[#ff716c]", "from-[#ff716c]/40 to-[#ff716c] shadow-[0_0_10px_#ff716c]")}
                        {renderBar("Creative", userTraits.creativity || 50, "text-[#d575ff]", "from-[#d575ff]/40 to-[#d575ff] shadow-[0_0_10px_#d575ff]")}
                        {renderBar("Analytical", userTraits.vision || 50, "text-[#99f7ff]", "from-[#99f7ff]/40 to-[#99f7ff] shadow-[0_0_10px_#99f7ff]")}
                        {renderBar("Social", userTraits.empathy || 50, "text-[#4ade80]", "from-[#4ade80]/40 to-[#4ade80] shadow-[0_0_10px_#4ade80]")}
                        {renderBar("Ambitious", userTraits.leadership || 50, "text-[#fbbf24]", "from-[#fbbf24]/40 to-[#fbbf24] shadow-[0_0_10px_#fbbf24]")}
                    </div>

                </main>

                {/* Footer Section */}
                <footer className="relative z-20 w-full bg-[rgba(25,25,35,0.4)] backdrop-blur-[16px] border-t border-[#484751]/30 py-8 px-16 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold tracking-wide text-[#f2effb]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {Math.max(50, Math.floor(Math.random() * 50) + 50)}% match with {dynamicProfileTag}
                        </span>
                    </div>
                    
                    <p className="text-[14px] tracking-[0.3em] uppercase text-[#acaab5]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Discover your personality DNA
                    </p>
                    
                    <div className="mt-2 text-[#99f7ff] text-[16px] font-bold tracking-widest uppercase flex items-center gap-3">
                        <span className="text-white/20">SYSTEM_OVERRIDE //</span>
                        aya-phi-liard.vercel.app
                    </div>
                </footer>
            </div>
        );
    }
);

InstagramCard.displayName = 'InstagramCard';
