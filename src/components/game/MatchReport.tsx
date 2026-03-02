import { useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import { audioSynth } from '../../utils/audioSynth';
import { Sparkles, Star, Zap, Heart, Flame, Brain, Shield, Grid3x3, RefreshCw } from 'lucide-react';
import type { PersonalityTraits, PsychologicalProfile } from '../../types/gameTypes';
import { IDOL_MINDSETS } from '../../data/idolMindsets';
import { PersonalityAnalysisEngine } from '../../utils/personalityAnalysis';

interface MatchReportProps {
    userTraits: PersonalityTraits;
    userProfile?: PsychologicalProfile;
    idolTraits: PersonalityTraits;
    idolName: string;
    onClose: () => void;
}

// --- 3D CANDY ASSETS & COMPONENTS ---

const SugarVortexBackground = () => (
    <>
        {/* Deep Cosmic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#4A148C_0%,#311B92_40%,#000000_100%)] z-0" />
        {/* Animated Vortex Spiral */}
        <div className="absolute inset-0 opacity-40 z-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent,rgba(255,0,255,0.3),rgba(0,255,255,0.3),transparent)] animate-spin-ultra-slow rounded-full mix-blend-screen layer-glow" />
        </div>
        {/* Floating Particles */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse-slow mix-blend-overlay"></div>
    </>
);

const FrostedGrapePanel = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={clsx("relative w-full rounded-3xl overflow-hidden", className)}>
        {/* Glass Layer */}
        <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-xl border-2 border-purple-300/30 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"></div>

        {/* Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none"></div>

        {/* Content */}
        <div className="relative z-10 p-5 flex flex-col h-full">
            {/* Header Badge */}
            <div className="self-center -mt-8 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-1 rounded-b-xl shadow-lg border-b border-white/20">
                <span className="text-white font-yummy uppercase tracking-widest text-sm drop-shadow-md">{title}</span>
            </div>
            {children}
        </div>
    </div>
);

const BoosterIcon = ({ type, label }: { type: 'bomb' | 'striped' | 'wrapped', label: string }) => {
    // Icons simulating Candy Crush boosters
    const Icon = type === 'bomb' ? Sparkles : type === 'striped' ? Zap : Star;
    const colorClass = type === 'bomb' ? 'text-yellow-300' : type === 'striped' ? 'text-pink-300' : 'text-cyan-300';

    return (
        <div className="flex items-center gap-4 bg-black/30 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors group shadow-md">
            <div className={clsx("w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center shadow-inner border-2 border-white/20 group-hover:scale-110 transition-transform shrink-0", colorClass)}>
                <Icon size={28} className="filter drop-shadow-[0_0_10px_currentColor]" />
            </div>
            <span className="text-white font-black text-lg tracking-wide leading-tight uppercase font-yummy drop-shadow-sm">{label}</span>
        </div>
    );
};

const BlockerIcon = ({ label }: { label: string }) => (
    <div className="relative flex items-center gap-4 bg-[#3E2723]/70 rounded-2xl p-4 border border-[#5D4037] hover:bg-[#3E2723]/90 transition-colors group overflow-hidden shadow-lg">
        {/* Cracked Chocolate Texture Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%),radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%)] bg-[length:8px_8px]" />

        <div className="w-14 h-14 rounded-xl bg-[#5D4037] flex items-center justify-center shadow-inner border-2 border-[#8D6E63] relative z-10 shrink-0">
            <Grid3x3 size={28} className="text-[#A1887F]" />
        </div>
        <span className="text-[#EFEBE9] font-black text-lg tracking-wide leading-tight uppercase font-yummy relative z-10 drop-shadow-md">{label}</span>
    </div>
);

const FlavorMeter = ({ label, value, color, icon: Icon }: { label: string, value: number, color: string, icon: any }) => (
    <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center text-sm font-black uppercase tracking-wider text-white drop-shadow-md">
            <span className="flex items-center gap-2"><Icon size={14} /> {label}</span>
            <span>{value}%</span>
        </div>
        {/* Candy Cane Bar */}
        <div className="w-full h-4 bg-black/50 rounded-full overflow-hidden border border-white/20 relative shadow-inner">
            <div
                className={clsx("h-full rounded-full shadow-[0_0_15px_currentColor] transition-all duration-1000", color)}
                style={{
                    width: `${value}%`,
                    backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,0.4) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.4) 50%,rgba(255,255,255,0.4) 75%,transparent 75%,transparent)',
                    backgroundSize: '12px 12px'
                }}
            />
        </div>
    </div>
);

const ToughCookieMeter = ({ score }: { score: number }) => (
    <div className="mt-auto w-full bg-[#5D4037]/40 rounded-2xl p-3 border border-[#8D6E63]/50 flex items-center gap-3">
        <div className="w-12 h-12 relative flex items-center justify-center">
            {/* Cookie Icon Representation */}
            <div className="absolute inset-0 bg-[#795548] rounded-full border-2 border-[#D7CCC8] shadow-lg flex items-center justify-center text-[#3E2723]">
                <Shield size={24} fill="currentColor" />
            </div>
            {/* Tiny Crown */}
            <div className="absolute -top-2 -right-1 text-yellow-400 drop-shadow-md transform rotate-12">
                <Star size={16} fill="currentColor" />
            </div>
        </div>
        <div className="flex-1">
            <div className="text-[10px] text-[#D7CCC8] font-black uppercase mb-1">Resilience Score</div>
            <div className="w-full h-4 bg-black/30 rounded-full border border-[#8D6E63] relative overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-orange-400 to-yellow-600 transition-all duration-1000"
                    style={{ width: `${score}% ` }}
                />
            </div>
        </div>
    </div>
);

export function MatchReport({ userTraits, userProfile, idolTraits, idolName, onClose }: MatchReportProps) {
    const [animatedPercent, setAnimatedPercent] = useState(0);
    const dominantTrait = (Object.keys(userTraits) as Array<keyof PersonalityTraits>).reduce((a, b) => userTraits[a] > userTraits[b] ? a : b);
    const idolData = IDOL_MINDSETS[idolName] || IDOL_MINDSETS["Default"];

    // Override Logic
    const SPECIFIC_TRAITS: Record<string, { strengths: string[], blindSpots: string[] }> = {
        "Frida Kahlo": {
            strengths: ["Emotional Depth", "Raw Authenticity", "Creative Resilience"],
            blindSpots: ["Stubbornness", "Perfectionist Shell", "Over-intensity"]
        },
        "Elon Musk": {
            strengths: ["Futuristic Strategy", "Unyielding Drive", "Complex Problem Solving"],
            blindSpots: ["Impulsive Risk", "Communication Gaps", "High-Pressure Tendencies"]
        },
        "Bill Gates": {
            strengths: ["Visionary Optimization", "Digital Architect", "Scale Thinking"],
            blindSpots: ["Analysis Paralysis", "Emotional Disconnect", "Control Freak"]
        }
    };

    const effectiveProfile = userProfile || { motivation: 'Impact' } as any; // simplified fallback

    const displayStrengths = SPECIFIC_TRAITS[idolName]?.strengths ||
        PersonalityAnalysisEngine.getStrengths(effectiveProfile as any, dominantTrait).map(s => s.title);
    const displayBlindSpots = SPECIFIC_TRAITS[idolName]?.blindSpots ||
        PersonalityAnalysisEngine.getBlindSpots(effectiveProfile as any).map(s => s.title);

    // Dynamic Match Calculation
    const matchScore = useMemo(() => {
        if (!userTraits || !idolTraits) return 76; // Fallback

        const traitKeys = Object.keys(idolTraits) as Array<keyof PersonalityTraits>;
        if (traitKeys.length === 0) return 85;

        // Calculate average difference across all traits
        const totalDiff = traitKeys.reduce((acc, key) => {
            const userVal = userTraits[key] || 50;
            const idolVal = idolTraits[key] || 50;
            return acc + Math.abs(userVal - idolVal);
        }, 0);

        const avgDiff = totalDiff / traitKeys.length;

        // Convert difference to similarity (0 diff = 100% match, 50 diff = 50% match)
        // We floor it at 60% because "no match" feels bad in a game
        let score = Math.round(100 - avgDiff);
        return Math.max(65, Math.min(99, score)); // Clamp between 65% and 99%
    }, [userTraits, idolTraits]);

    useEffect(() => {
        if (audioSynth.playWin) audioSynth.playWin();
        let start = 0;
        const animate = () => {
            start += 1;
            setAnimatedPercent(start);
            if (start < matchScore) requestAnimationFrame(animate);
        };
        animate();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col font-sans overflow-hidden bg-black select-none">
            <SugarVortexBackground />

            {/* SCROLL CONTENT */}
            <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden pb-32 pt-safe-top">
                <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col items-center">

                    {/* Header: Sugar Level */}
                    <div className="mb-8 relative group w-full flex flex-col items-center">
                        <div className="absolute inset-x-0 top-1/2 h-4 bg-white/20 rounded-full blur-md"></div>
                        <h1 className="relative font-yummy text-5xl md:text-7xl text-white text-center drop-shadow-[0_5px_0_#C2185B] stroke-text-white tracking-wider animate-pulse-slow mb-4">
                            {animatedPercent}% MATCH
                        </h1>

                        {/* Restored Match Bar Animation */}
                        <div className="w-full max-w-md h-6 bg-black/40 rounded-full border-2 border-white/20 relative overflow-hidden shadow-[0_0_15px_rgba(233,30,99,0.5)]">
                            <div
                                className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 transition-all duration-300 ease-out relative"
                                style={{ width: `${animatedPercent}%` }}
                            >
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30"></div>
                                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN GRID LAYOUT */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                        {/* LEFT COLUMN: Motivation Power-Up */}
                        <div className="hidden md:flex md:col-span-3 flex-col gap-6">
                            <FrostedGrapePanel title="Motivation Power-Up" className="min-h-[400px]">
                                <div className="flex flex-col gap-6 h-full">
                                    {/* Core Strengths */}
                                    <div className="flex flex-col gap-4">
                                        <div className="text-sm font-black text-pink-200 uppercase opacity-90 tracking-widest text-center shadow-black drop-shadow-sm">Core Strengths</div>
                                        {displayStrengths.map((str, i) => (
                                            <BoosterIcon key={i} type={i === 0 ? 'bomb' : i === 1 ? 'striped' : 'wrapped'} label={str} />
                                        ))}
                                    </div>

                                    {/* Flavor Meters */}
                                    <div className="flex flex-col gap-5 bg-black/40 p-5 rounded-2xl border border-white/10 shadow-inner mt-2">
                                        <FlavorMeter label="Sweetness (Empathy)" value={userTraits.empathy} color="bg-pink-500" icon={Heart} />
                                        <FlavorMeter label="Spice (Drive)" value={userTraits.risk} color="bg-orange-500" icon={Flame} />
                                        <FlavorMeter label="Sour (Logic)" value={userTraits.discipline} color="bg-green-500" icon={Brain} />
                                    </div>

                                    {/* Bottom Badge */}
                                    <div className="mt-auto pt-6 flex items-center gap-4 justify-center">
                                        <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)] flex items-center justify-center border-4 border-white animate-pulse">
                                            <Zap size={32} className="text-yellow-700 fill-white" />
                                        </div>
                                        <div className="text-sm text-yellow-100 font-bold uppercase leading-tight drop-shadow-md">
                                            Sugar Rush:<br /><span className="text-white text-lg font-black tracking-wide">Fast Decision Maker</span>
                                        </div>
                                    </div>
                                </div>
                            </FrostedGrapePanel>
                        </div>

                        {/* CENTER COLUMN: Avatar & Mission */}
                        <div className="col-span-1 md:col-span-6 flex flex-col items-center">

                            {/* Avatar Ring */}
                            <div className="relative w-72 h-72 md:w-96 md:h-96 mb-8 group cursor-pointer">
                                {/* Rotating Stars Ring */}
                                <div className="absolute inset-[-25px] border-2 border-dashed border-white/40 rounded-full animate-spin-ultra-slow"></div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-yellow-300 animate-bounce"><Star size={32} fill="currentColor" /></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-pink-300 animate-bounce delay-75"><Star size={28} fill="currentColor" /></div>

                                {/* Main Image */}
                                <div className="w-full h-full rounded-full border-[10px] border-white bg-gradient-to-b from-purple-500 to-indigo-600 shadow-[0_0_80px_rgba(236,72,153,0.8)] overflow-hidden relative transform group-hover:scale-105 transition-transform duration-500">
                                    <img src={idolData.avatarUrl} alt={idolName} className="w-full h-full object-cover" />
                                    {/* Gloss Reflection */}
                                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full pointer-events-none" />
                                </div>
                            </div>

                            {/* Name Title */}
                            <h2 className="font-yummy text-5xl md:text-7xl text-white text-center drop-shadow-[0_6px_0_#4A148C] stroke-text-white mb-10 tracking-wide">
                                {idolName}
                            </h2>

                            {/* Mobile Views for columns (collapsed) */}
                            <div className="md:hidden w-full flex flex-col gap-6 mb-8">
                                <FrostedGrapePanel title="Strengths">
                                    {displayStrengths.slice(0, 3).map((str, i) => <BoosterIcon key={i} type={'striped'} label={str} />)}
                                </FrostedGrapePanel>
                                <FrostedGrapePanel title="Blind Spots">
                                    {displayBlindSpots.slice(0, 3).map((str, i) => <BlockerIcon key={i} label={str} />)}
                                </FrostedGrapePanel>
                            </div>

                            {/* Honey Mission Box */}
                            <div className="relative w-full max-w-2xl transform hover:scale-[1.02] transition-transform">
                                <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-70 animate-pulse"></div>
                                <div className="relative bg-gradient-to-b from-yellow-300 to-orange-400 rounded-xl border-[4px] border-white/60 p-1">
                                    <div className="bg-orange-500/20 rounded-lg p-6 flex items-center gap-6">
                                        <div className="relative shrink-0">
                                            <Star size={64} className="text-yellow-100 fill-yellow-300 drop-shadow-xl animate-spin-slow" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-yummy text-orange-900 text-2xl leading-none mb-2 tracking-widest">IMMEDIATE MISSION</div>
                                            <div className="font-black text-white text-xl leading-tight drop-shadow-md">
                                                Embrace your unique flavor & share it with the world!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Growth Challenge */}
                        <div className="hidden md:flex md:col-span-3 flex-col gap-6">
                            <FrostedGrapePanel title="Growth Challenge" className="min-h-[400px]">
                                <div className="flex flex-col gap-6 h-full">
                                    {/* Blind Spots */}
                                    <div className="flex flex-col gap-4">
                                        <div className="text-sm font-black text-pink-200 uppercase opacity-90 tracking-widest text-center shadow-black drop-shadow-sm">Blind Spots</div>
                                        {displayBlindSpots.map((str, i) => (
                                            <BlockerIcon key={i} label={str} />
                                        ))}
                                    </div>

                                    {/* Collection Case */}
                                    <div className="bg-black/40 rounded-xl p-5 border border-white/10 shadow-inner mt-2">
                                        <div className="text-xs font-bold text-center text-white/60 uppercase mb-3 tracking-widest">Growth Rewards</div>
                                        <div className="flex justify-center gap-6">
                                            {[1, 2, 3].map(i => (
                                                <Star key={i} size={32} className="text-white/20 fill-white/5 drop-shadow-none" />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tough Cookie Meter */}
                                    <div className="mt-auto">
                                        <ToughCookieMeter score={userTraits.resilience} />
                                    </div>
                                </div>
                            </FrostedGrapePanel>
                        </div>

                    </div>
                </div>
            </div>

            {/* FOOTER CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-50 flex justify-center">
                <button
                    onClick={() => { audioSynth.playClick(); onClose(); }}
                    className="group relative w-full max-w-md h-20 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,230,118,0.4)]"
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#69F0AE] to-[#00C853] rounded-full border-[3px] border-[#B9F6CA]"></div>
                    {/* Gloss */}
                    <div className="absolute top-2 left-6 right-6 h-1/2 bg-white/40 rounded-full blur-[2px]"></div>

                    <span className="relative z-10 flex items-center justify-center h-full gap-3 font-yummy text-3xl text-white drop-shadow-md stroke-text-green tracking-widest">
                        ACCEPT YOUR PATH <RefreshCw size={24} className="stroke-[3]" />
                    </span>
                </button>
            </div>

            <style>{`
                .font-yummy { font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif; }
                .stroke-text-white { -webkit-text-stroke: 2px #4A148C; }
                .stroke-text-green { -webkit-text-stroke: 2px #1B5E20; }
                .animate-spin-ultra-slow { animation: spin 20s linear infinite; }
            `}</style>
        </div>
    );
}
