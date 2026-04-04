import { useState, useMemo } from 'react';
import { audioSynth } from '../../utils/audioSynth';
import { ArrowLeft, Copy, Check, Star, Shield } from 'lucide-react';
import { IDOL_MINDSETS, IDOL_PROFILES } from '../../data/idolMindsets';
import { useUserStore } from '../../store/userStore';

interface DnaProfileProps {
    onBack: () => void;
}

const FloatingParticle = ({ style, animationDuration }: { style: any, animationDuration: string }) => (
    <div 
        className="absolute rounded-full mix-blend-screen opacity-60"
        style={{
            ...style,
            animation: `float-particle ${animationDuration} ease-in-out infinite alternate`,
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor'
        }}
    />
);

const AnimatedHelix = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 blur-[1px]">
        {/* Simple CSS-based double helix illusion */}
        <div className="relative w-40 h-[600px] flex flex-col justify-between items-center py-20">
            {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="relative w-full h-8 flex items-center justify-between" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] helix-dot-1" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    <div className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_15px_#a855f7] helix-dot-2" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400/20 to-purple-500/20"></div>
                </div>
            ))}
        </div>
        <style>{`
            .helix-dot-1 { animation: traverse-x 3s ease-in-out infinite alternate; }
            .helix-dot-2 { animation: traverse-x 3s ease-in-out infinite alternate-reverse; }
            @keyframes traverse-x {
                0% { transform: translateX(0) scale(1); z-index: 10; }
                50% { transform: translateX(64px) scale(1.5); z-index: 20; }
                100% { transform: translateX(128px) scale(0.5); z-index: 5; }
            }
            @keyframes float-particle {
                0% { transform: translateY(0) scale(1); }
                100% { transform: translateY(-40px) scale(1.2); }
            }
        `}</style>
    </div>
);

const NeonTraitBar = ({ label, value, neonColor }: { label: string, value: number, neonColor: string }) => {
    return (
        <div className="relative w-full mb-5 group">
            <div className="flex justify-between items-end mb-1 text-xs font-black uppercase tracking-widest text-[#f2effb]">
                <span className="drop-shadow-md">{label}</span>
                <span className="opacity-80">{value}%</span>
            </div>
            
            {/* 3D Depth Track */}
            <div className="w-full h-5 rounded overflow-hidden relative bg-[#000000] border-t border-[rgba(255,255,255,0.1)] shadow-[0_4px_10px_rgba(0,0,0,0.8)_inset]">
                {/* Fill */}
                <div 
                    className="h-full relative rounded flex items-center justify-end pr-1 transition-all duration-1000 ease-out"
                    style={{ 
                        width: `${value}%`,
                        background: `linear-gradient(90deg, transparent, ${neonColor})`,
                        boxShadow: `0 0 15px ${neonColor}, inset 0 0 5px ${neonColor}`
                    }}
                >
                    {/* Laser Head */}
                    <div className="h-full w-2 bg-white blur-[1px]"></div>
                </div>
            </div>
        </div>
    );
};

export function DnaProfile({ onBack }: DnaProfileProps) {
    const profile = useUserStore((state) => state.profile);

    // Fallback traits if profile missing completely
    const userTraits = profile?.traits || {
        risk: 50, creativity: 50, vision: 50, empathy: 50, leadership: 50, resilience: 50
    };

    // DNA Profile generation
    const personalityDNA = useMemo(() => {
        const diffs: { name: string; diff: number }[] = [];
        for (const [name, p] of Object.entries(IDOL_PROFILES)) {
            if (name === "Default") continue;
            
            const totalDiff = 
                Math.abs((userTraits.risk || 50) - p.risk) +
                Math.abs((userTraits.creativity || 50) - p.creativity) +
                Math.abs((userTraits.vision || 50) - p.analytical) +
                Math.abs((userTraits.empathy || 50) - p.social) +
                Math.abs((userTraits.leadership || 50) - p.ambitious);
                
            diffs.push({ name, diff: totalDiff });
        }
        
        diffs.sort((a, b) => a.diff - b.diff);
        const top2 = diffs.slice(0, 2).map(d => d.name);
        
        const getTraitDesc = (name: string, excludedTrait?: string) => {
            const p = IDOL_PROFILES[name];
            if (!p) return { key: '', desc: '' };
            let traits = [
                { key: 'ambitious', value: p.ambitious, desc: `${name.split(' ')[0]}'s relentless drive` },
                { key: 'creativity', value: p.creativity, desc: `${name.split(' ')[0]}'s creative vision` },
                { key: 'analytical', value: p.analytical, desc: `${name.split(' ')[0]}'s analytical mind` },
                { key: 'social', value: p.social, desc: `${name.split(' ')[0]}'s emotional depth` },
                { key: 'risk', value: p.risk, desc: `${name.split(' ')[0]}'s bold fearlessness` }
            ];
            
            if (excludedTrait) {
                traits = traits.filter(t => t.key !== excludedTrait);
            }
            
            traits.sort((a, b) => b.value - a.value);
            return traits[0];
        };

        if (top2.length < 2) return null;

        const t1 = getTraitDesc(top2[0]);
        let t2 = getTraitDesc(top2[1]);
        if (t1.key === t2.key) {
            t2 = getTraitDesc(top2[1], t1.key);
        }

        return {
            idol1: {
                name: top2[0],
                avatarUrl: IDOL_MINDSETS[top2[0]]?.avatarUrl || '',
                desc: t1.desc
            },
            idol2: {
                name: top2[1],
                avatarUrl: IDOL_MINDSETS[top2[1]]?.avatarUrl || '',
                desc: t2.desc
            }
        };
    }, [userTraits]);

    const [copiedDNA, setCopiedDNA] = useState(false);
    const handleShareDNA = () => {
        if (!personalityDNA) return;
        const textToCopy = `My Personality DNA: I have ${personalityDNA.idol1.desc} and ${personalityDNA.idol2.desc}. Discover yours at https://aya-phi-liard.vercel.app 🧬`;
        navigator.clipboard.writeText(textToCopy);
        setCopiedDNA(true);
        setTimeout(() => setCopiedDNA(false), 2000);
    };

    // Calculate dynamic real life challenge
    const struggleStr = profile?.psychologicalProfile?.interest_struggle || '';
    let realLifeChallenge = "Embrace the unknown and act courageously today.";
    if (struggleStr.includes('Overthinking')) realLifeChallenge = "Write 3 decisions you've been delaying. Pick one and act today.";
    else if (struggleStr.includes('Laziness & Procrastination')) realLifeChallenge = "Do the one task you've been avoiding for just 5 minutes right now.";
    else if (struggleStr.includes('Fear of what others think')) realLifeChallenge = "Share one honest opinion with someone today.";
    else if (struggleStr.includes('Staying consistent')) realLifeChallenge = "Set one non-negotiable daily habit starting tonight.";

    const dynamicProfileTag = useMemo(() => {
        const traits = [
            { name: "BORN LEADER", value: userTraits.leadership || 0 },
            { name: "CREATIVE SOUL", value: userTraits.creativity || 0 },
            { name: "STRATEGIC MIND", value: userTraits.vision || 0 },
            { name: "PEOPLE'S CHAMPION", value: userTraits.empathy || 0 },
            { name: "BOLD MAVERICK", value: userTraits.risk || 0 }
        ];
        traits.sort((a, b) => b.value - a.value);
        return traits[0].name;
    }, [userTraits]);

    return (
        <div className="fixed inset-0 z-[100] w-full h-full bg-[#0d0d16] font-sans text-[#f2effb] overflow-y-auto overflow-x-hidden pt-safe-top pb-24 selection:bg-[#99f7ff] selection:text-[#004145]">
            
            {/* Deep Space Background gradient */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,#2b2b38_0%,#000000_60%)]" />
            
            {/* Floating Particles */}
            <div className="fixed inset-0 pointer-events-none">
                <FloatingParticle style={{ top: '10%', left: '20%', width: 6, height: 6, backgroundColor: '#99f7ff', color: '#99f7ff' }} animationDuration="4s" />
                <FloatingParticle style={{ top: '40%', right: '15%', width: 4, height: 4, backgroundColor: '#ff51fa', color: '#ff51fa' }} animationDuration="5s" />
                <FloatingParticle style={{ bottom: '20%', left: '30%', width: 8, height: 8, backgroundColor: '#d575ff', color: '#d575ff' }} animationDuration="6s" />
                <FloatingParticle style={{ top: '60%', left: '80%', width: 5, height: 5, backgroundColor: '#99f7ff', color: '#99f7ff' }} animationDuration="3s" />
            </div>

            <AnimatedHelix />

            {/* Navigation Header */}
            <div className="relative z-20 flex items-center justify-between p-6 w-full max-w-4xl mx-auto">
                <button 
                    onClick={() => { audioSynth.playClick(); onBack(); }}
                    className="p-3 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full border border-[rgba(255,255,255,0.1)] transition-colors shadow-[0_0_15px_rgba(0,242,255,0.1)] text-[#99f7ff]"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <main className="relative z-20 w-full max-w-3xl mx-auto px-4 sm:px-8 pb-12 flex flex-col items-center">
                
                {/* Header Section */}
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-100 to-purple-300 drop-shadow-[0_0_15px_rgba(0,242,255,0.4)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Your Identity Profile
                </h1>
                
                {/* User Data */}
                <div className="text-center mb-10 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-[#fcf8ff] drop-shadow-md">
                        {profile?.name || 'GUEST_0X'}
                    </h2>
                    <div className="mt-2 text-[#acaab5] tracking-[0.3em] text-sm uppercase flex items-center gap-4">
                        <span>AGE: <span className="text-[#99f7ff] font-bold">{profile?.age || 18}</span></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d575ff] shadow-[0_0_8px_#d575ff]" />
                        <span>STATUS: <span className="text-[#ff51fa] font-bold">ACTIVE</span></span>
                    </div>
                </div>

                {/* Profile Badge */}
                <div className="mb-10 px-6 py-2 rounded-full border-2 border-[rgba(153,247,255,0.3)] bg-[rgba(0,85,90,0.3)] shadow-[0_0_20px_rgba(0,242,255,0.2)_inset,0_0_20px_rgba(0,242,255,0.2)] backdrop-blur-md flex items-center gap-2">
                    <Shield size={16} className="text-[#99f7ff] animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#99f7ff]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{dynamicProfileTag}</span>
                </div>

                {/* Trait Bars Card (Glassmorphism + Neon Border) */}
                <div className="w-full bg-[#191923]/60 backdrop-blur-xl border-t border-l border-[#8300b4]/30 border-r border-b border-[#00e2ee]/30 rounded-[2rem] p-6 sm:p-8 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(213,117,255,0.05)] transform perspective-[1000px] hover:rotate-x-1 hover:rotate-y-1 transition-transform duration-500">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#acaab5] mb-6">Core Telemetry</h3>
                    
                    <NeonTraitBar label="Risk Taker" value={userTraits.risk} neonColor="#ff51fa" />
                    <NeonTraitBar label="Creative" value={userTraits.creativity} neonColor="#bc13fe" />
                    <NeonTraitBar label="Analytical" value={userTraits.vision} neonColor="#00f2ff" />
                    <NeonTraitBar label="Social" value={userTraits.empathy} neonColor="#00ff9d" />
                    <NeonTraitBar label="Ambitious" value={userTraits.leadership} neonColor="#ffb800" />
                </div>

                {/* Personality DNA Section */}
                {personalityDNA && (
                    <div className="w-full bg-[rgba(31,31,42,0.6)] backdrop-blur-2xl rounded-[2rem] p-8 mb-10 border border-[#484751] relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ff]/5 to-[#ff00ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="flex flex-col items-center relative z-10">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#00f2ff] drop-shadow-md mb-8">Personality DNA Link</h3>
                            
                            <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8">
                                {/* Portrait 1 */}
                                <div className="relative flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#00f2ff] shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                                        <img src={personalityDNA.idol1.avatarUrl} alt={personalityDNA.idol1.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="mt-3 text-xs md:text-sm font-black uppercase tracking-widest text-[#00f2ff] drop-shadow-md text-center max-w-[120px]">{personalityDNA.idol1.name}</span>
                                </div>
                                
                                {/* Glowing Plus */}
                                <div className="text-5xl font-black text-[#ff51fa] drop-shadow-[0_0_15px_#ff51fa] animate-pulse pb-8">
                                    +
                                </div>

                                {/* Portrait 2 */}
                                <div className="relative flex flex-col items-center">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#d575ff] shadow-[0_0_20px_rgba(213,117,255,0.4)]">
                                        <img src={personalityDNA.idol2.avatarUrl} alt={personalityDNA.idol2.name} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="mt-3 text-xs md:text-sm font-black uppercase tracking-widest text-[#d575ff] drop-shadow-md text-center max-w-[120px]">{personalityDNA.idol2.name}</span>
                                </div>
                            </div>

                            {/* Mix Description */}
                            <p className="text-center text-lg sm:text-2xl font-serif italic text-yellow-300/90 text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 to-yellow-400 drop-shadow-[0_0_5px_rgba(253,224,71,0.5)]">
                                "{`You have ${personalityDNA.idol1.desc} and ${personalityDNA.idol2.desc}`}"
                            </p>
                        </div>
                    </div>
                )}

                {/* Real Life Challenge Card */}
                <div className="w-full bg-[#13131c] rounded-2xl border border-[rgba(255,81,250,0.3)] shadow-[0_0_20px_rgba(255,81,250,0.1)_inset] p-6 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#ff51fa] shadow-[0_0_10px_#ff51fa]"></div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#ff51fa] mb-3 flex items-center gap-2">
                        <Star size={16} /> Current Directive
                    </h3>
                    <p className="text-[#f2effb] font-serif text-lg leading-relaxed">
                        {realLifeChallenge}
                    </p>
                </div>

                {/* Share Button CTA */}
                <button 
                    onClick={() => { audioSynth.playClick(); handleShareDNA(); }}
                    className="group relative w-full sm:w-[80%] h-16 rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#006a70] via-[#00f1fe] to-[#005f64] opacity-80" />
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] group-hover:animate-[shimmer_2s_infinite]" />
                    
                    <span className="relative z-10 w-full h-full flex items-center justify-center gap-3 text-white font-black text-lg md:text-xl uppercase tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {copiedDNA ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                        {copiedDNA ? "Data Copied" : "Share Your DNA"}
                    </span>
                    <style>{`
                        @keyframes shimmer {
                            0% { background-position: -200% 0; }
                            100% { background-position: 200% 0; }
                        }
                    `}</style>
                </button>

            </main>
        </div>
    );
}