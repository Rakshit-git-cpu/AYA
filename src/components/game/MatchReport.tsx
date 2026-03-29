import { useEffect, useState, useMemo } from 'react';
import clsx from 'clsx';
import { audioSynth } from '../../utils/audioSynth';
import { Sparkles, Star, Zap, Heart, Flame, Brain, Shield, Grid3x3, RefreshCw } from 'lucide-react';
import type { PersonalityTraits, PsychologicalProfile } from '../../types/gameTypes';
import { IDOL_MINDSETS } from '../../data/idolMindsets';
import { PersonalityAnalysisEngine } from '../../utils/personalityAnalysis';
import { useUserStore } from '../../store/userStore';

interface MatchReportProps {
    userTraits: PersonalityTraits;
    userProfile?: PsychologicalProfile;
    idolTraits: PersonalityTraits;
    idolName: string;
    onClose: () => void;
}

// --- 3D CANDY ASSETS & COMPONENTS ---

const SugarVortexBackground = ({ isCandyMode }: { isCandyMode: boolean }) => (
    <>
        {/* Deep Cosmic Background */}
        <div className={clsx(
            "absolute inset-0 z-0",
            isCandyMode
                ? "bg-[radial-gradient(circle_at_center,#4A148C_0%,#311B92_40%,#000000_100%)]"
                : "bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_60%,#000000_100%)]"
        )} />
        {/* Animated Vortex Spiral */}
        <div className="absolute inset-0 opacity-40 z-0 overflow-hidden">
            <div className={clsx(
                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] animate-spin-ultra-slow rounded-full mix-blend-screen layer-glow",
                isCandyMode
                    ? "bg-[conic-gradient(from_0deg,transparent,rgba(255,0,255,0.3),rgba(0,255,255,0.3),transparent)]"
                    : "bg-[conic-gradient(from_0deg,transparent,rgba(77,217,255,0.1),rgba(139,92,246,0.2),transparent)]"
            )} />
        </div>
        {/* Floating Particles */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse-slow mix-blend-overlay"></div>
    </>
);

const FrostedGrapePanel = ({ title, children, className, isCandyMode }: { title: string, children: React.ReactNode, className?: string, isCandyMode: boolean }) => (
    <div className={clsx("relative w-full rounded-3xl overflow-hidden", className)}>
        {/* Glass Layer */}
        <div className={clsx(
            "absolute inset-0 backdrop-blur-xl rounded-3xl",
            isCandyMode
                ? "bg-purple-900/40 border-2 border-purple-300/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                : "bg-slate-900/50 border border-[#4DD9FF]/20 shadow-[0_0_20px_rgba(77,217,255,0.1)]"
        )}></div>

        {/* Inner Glow */}
        <div className={clsx(
            "absolute inset-0 pointer-events-none",
            isCandyMode
                ? "bg-gradient-to-b from-purple-500/10 to-transparent"
                : "bg-gradient-to-b from-[#4DD9FF]/5 to-transparent"
        )}></div>

        {/* Content */}
        <div className="relative z-10 p-5 flex flex-col h-full">
            {/* Header Badge */}
            <div className={clsx(
                "self-center -mt-8 mb-4 px-6 py-1 rounded-b-xl shadow-lg border-b",
                isCandyMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 border-white/20"
                    : "bg-gradient-to-r from-cyan-900 to-slate-800 border-[#4DD9FF]/50 shadow-[0_4px_15px_rgba(77,217,255,0.2)]"
            )}>
                <span className={clsx(
                    "uppercase tracking-widest text-sm drop-shadow-md",
                    isCandyMode ? "text-white font-yummy" : "text-[#4DD9FF] font-black"
                )}>{title}</span>
            </div>
            {children}
        </div>
    </div>
);

const BoosterIcon = ({ type, label, isCandyMode }: { type: 'bomb' | 'striped' | 'wrapped', label: string, isCandyMode: boolean }) => {
    const Icon = type === 'bomb' ? Sparkles : type === 'striped' ? Zap : Star;
    const colorClass = isCandyMode
        ? (type === 'bomb' ? 'text-yellow-300' : type === 'striped' ? 'text-pink-300' : 'text-cyan-300')
        : (type === 'bomb' ? 'text-[#4DD9FF]' : type === 'striped' ? 'text-amber-400' : 'text-pink-400');

    return (
        <div className={clsx(
            "flex items-center gap-4 rounded-2xl p-4 transition-colors group",
            isCandyMode
                ? "bg-black/30 border border-white/10 hover:bg-white/10 shadow-md"
                : "bg-slate-800/40 border border-[#4DD9FF]/20 hover:bg-slate-700/60 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        )}>
            <div className={clsx(
                "w-14 h-14 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform shrink-0",
                isCandyMode
                    ? "bg-gradient-to-br from-gray-700 to-black border-2 border-white/20"
                    : "bg-gradient-to-br from-slate-800 to-slate-950 border border-[#4DD9FF]/40",
                colorClass
            )}>
                <Icon size={28} className={clsx(isCandyMode ? "filter drop-shadow-[0_0_10px_currentColor]" : "drop-shadow-[0_0_8px_currentColor]")} />
            </div>
            <span className={clsx(
                "tracking-wide leading-tight uppercase relative z-10",
                isCandyMode ? "text-white font-black text-lg font-yummy drop-shadow-sm" : "text-slate-200 font-bold text-sm"
            )}>{label}</span>
        </div>
    );
};

const BlockerIcon = ({ label, isCandyMode }: { label: string, isCandyMode: boolean }) => (
    <div className={clsx(
        "relative flex items-center gap-4 rounded-2xl p-4 transition-colors group overflow-hidden",
        isCandyMode
            ? "bg-[#3E2723]/70 border border-[#5D4037] hover:bg-[#3E2723]/90 shadow-lg"
            : "bg-red-950/40 border border-red-500/20 hover:bg-red-900/60 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
    )}>
        {isCandyMode && (
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%),radial-gradient(circle,transparent_20%,#000_20%,#000_80%,transparent_80%)] bg-[length:8px_8px]" />
        )}

        <div className={clsx(
            "w-14 h-14 rounded-xl flex items-center justify-center shadow-inner relative z-10 shrink-0",
            isCandyMode
                ? "bg-[#5D4037] border-2 border-[#8D6E63] text-[#A1887F]"
                : "bg-slate-900 border border-red-500/40 text-red-400"
        )}>
            <Grid3x3 size={28} />
        </div>
        <span className={clsx(
            "tracking-wide leading-tight uppercase relative z-10 drop-shadow-md",
            isCandyMode ? "text-[#EFEBE9] font-black text-lg font-yummy" : "text-slate-300 font-bold text-sm"
        )}>{label}</span>
    </div>
);

const FlavorMeter = ({ label, value, color, darkColor, icon: Icon, isCandyMode }: { label: string, value: number, color: string, darkColor: string, icon: any, isCandyMode: boolean }) => (
    <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center text-sm font-black uppercase tracking-wider text-slate-200 drop-shadow-md">
            <span className={clsx("flex items-center gap-2", !isCandyMode && "text-xs tracking-widest text-[#4DD9FF]")}><Icon size={14} /> {label}</span>
            <span className={!isCandyMode ? "text-slate-300 text-xs" : "text-white"}>{value}%</span>
        </div>
        {/* Candy Cane Bar / Neon Bar */}
        <div className={clsx(
            "w-full h-4 rounded-full overflow-hidden relative shadow-inner",
            isCandyMode ? "bg-black/50 border border-white/20" : "bg-slate-950 border border-slate-700"
        )}>
            <div
                className={clsx(
                    "h-full rounded-full transition-all duration-1000",
                    isCandyMode ? `shadow-[0_0_15px_currentColor] ${color}` : `shadow-[0_0_10px_currentColor] ${darkColor}`
                )}
                style={{
                    width: `${value}%`,
                    backgroundImage: isCandyMode ? 'linear-gradient(45deg,rgba(255,255,255,0.4) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.4) 50%,rgba(255,255,255,0.4) 75%,transparent 75%,transparent)' : 'none',
                    backgroundSize: '12px 12px'
                }}
            />
        </div>
    </div>
);

const ToughCookieMeter = ({ score, isCandyMode }: { score: number, isCandyMode: boolean }) => (
    <div className={clsx(
        "mt-auto w-full rounded-2xl p-3 flex items-center gap-3",
        isCandyMode
            ? "bg-[#5D4037]/40 border border-[#8D6E63]/50"
            : "bg-amber-950/20 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
    )}>
        <div className="w-12 h-12 relative flex items-center justify-center">
            {/* Cookie Icon / Cyber Shield representation */}
            <div className={clsx(
                "absolute inset-0 rounded-full flex items-center justify-center shadow-lg",
                isCandyMode
                    ? "bg-[#795548] border-2 border-[#D7CCC8] text-[#3E2723]"
                    : "bg-slate-900 border border-amber-500/50 text-amber-500"
            )}>
                <Shield size={24} fill="currentColor" />
            </div>
            {/* Tiny Crown */}
            <div className={clsx(
                "absolute -top-2 -right-1 drop-shadow-md transform rotate-12",
                isCandyMode ? "text-yellow-400" : "text-[#4DD9FF]"
            )}>
                <Star size={16} fill="currentColor" />
            </div>
        </div>
        <div className="flex-1">
            <div className={clsx(
                "text-[10px] font-black uppercase mb-1",
                isCandyMode ? "text-[#D7CCC8]" : "text-amber-500/80 tracking-widest"
            )}>Resilience Score</div>
            <div className={clsx(
                "w-full h-4 rounded-full relative overflow-hidden",
                isCandyMode ? "bg-black/30 border border-[#8D6E63]" : "bg-slate-900/50 border border-slate-700"
            )}>
                <div
                    className={clsx(
                        "h-full transition-all duration-1000",
                        isCandyMode
                            ? "bg-gradient-to-r from-orange-400 to-yellow-600"
                            : "bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                    )}
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    </div>
);

export function MatchReport({ userTraits, userProfile, idolTraits, idolName, onClose }: MatchReportProps) {
    const isCandyMode = useUserStore((state) => state.isCandyMode);
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

    const effectiveProfile = userProfile || { motivation: 'Impact' } as any;

    const displayStrengths = SPECIFIC_TRAITS[idolName]?.strengths ||
        PersonalityAnalysisEngine.getStrengths(effectiveProfile as any, dominantTrait).map(s => s.title);
    const displayBlindSpots = SPECIFIC_TRAITS[idolName]?.blindSpots ||
        PersonalityAnalysisEngine.getBlindSpots(effectiveProfile as any).map(s => s.title);

    // Dynamic Match Calculation
    const matchScore = useMemo(() => {
        if (!userTraits || !idolTraits) return 76; // Fallback

        const traitKeys = Object.keys(idolTraits) as Array<keyof PersonalityTraits>;
        if (traitKeys.length === 0) return 85;

        const totalDiff = traitKeys.reduce((acc, key) => {
            const userVal = userTraits[key] || 50;
            const idolVal = idolTraits[key] || 50;
            return acc + Math.abs(userVal - idolVal);
        }, 0);

        const avgDiff = totalDiff / traitKeys.length;
        let score = Math.round(100 - avgDiff);
        return Math.max(65, Math.min(99, score));
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
            <SugarVortexBackground isCandyMode={isCandyMode} />

            {/* SCROLL CONTENT */}
            <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden pb-32 pt-safe-top">
                <div className="w-full max-w-7xl mx-auto px-4 py-6 flex flex-col items-center">

                    {/* Header: Match Percentage */}
                    <div className="mb-8 relative group w-full flex flex-col items-center mt-4">
                        <div className={clsx(
                            "absolute inset-x-0 top-1/2 h-4 rounded-full blur-md opacity-50",
                            isCandyMode ? "bg-white/20" : "bg-[#4DD9FF]/30"
                        )}></div>
                        <h1 className={clsx(
                            "relative text-5xl md:text-7xl tracking-wider mb-4 animate-pulse-slow",
                            isCandyMode
                                ? "font-yummy text-white drop-shadow-[0_5px_0_#C2185B] stroke-text-white"
                                : "font-black text-[#E8E0FF] drop-shadow-[0_0_15px_#4DD9FF] uppercase"
                        )}>
                            {animatedPercent}% MATCH
                        </h1>

                        {/* Restored Match Bar Animation */}
                        <div className={clsx(
                            "w-full max-w-md h-6 rounded-full relative overflow-hidden",
                            isCandyMode
                                ? "bg-black/40 border-2 border-white/20 shadow-[0_0_15px_rgba(233,30,99,0.5)]"
                                : "bg-slate-900 border border-[#4DD9FF]/30 shadow-[0_0_20px_rgba(77,217,255,0.3)]"
                        )}>
                            <div
                                className={clsx(
                                    "h-full transition-all duration-300 ease-out relative",
                                    isCandyMode
                                        ? "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                                        : "bg-gradient-to-r from-blue-600 via-cyan-400 to-[#4DD9FF]"
                                )}
                                style={{ width: `${animatedPercent}%` }}
                            >
                                {isCandyMode && (
                                    <>
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-30"></div>
                                        <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                                    </>
                                )}
                                {!isCandyMode && (
                                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/60 blur-[3px]"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MAIN GRID LAYOUT */}
                    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                        {/* LEFT COLUMN: Motivation Power-Up */}
                        <div className="hidden md:flex md:col-span-3 flex-col gap-6">
                            <FrostedGrapePanel title="Motivation Power-Up" isCandyMode={isCandyMode} className="min-h-[400px]">
                                <div className="flex flex-col gap-6 h-full">
                                    {/* Core Strengths */}
                                    <div className="flex flex-col gap-4 mt-2">
                                        <div className={clsx(
                                            "text-sm font-black uppercase opacity-90 tracking-widest text-center shadow-black drop-shadow-sm",
                                            isCandyMode ? "text-pink-200" : "text-[#4DD9FF]/80 text-xs"
                                        )}>Core Strengths</div>
                                        {displayStrengths.map((str, i) => (
                                            <BoosterIcon key={i} type={i === 0 ? 'bomb' : i === 1 ? 'striped' : 'wrapped'} label={str} isCandyMode={isCandyMode} />
                                        ))}
                                    </div>

                                    {/* Flavor Meters */}
                                    <div className={clsx(
                                        "flex flex-col gap-5 p-5 rounded-2xl shadow-inner mt-2",
                                        isCandyMode
                                            ? "bg-black/40 border border-white/10"
                                            : "bg-slate-900/40 border border-[#4DD9FF]/10"
                                    )}>
                                        <FlavorMeter label="Sweetness (Empathy)" value={userTraits.empathy} color="bg-pink-500" darkColor="bg-[#4DD9FF]" icon={Heart} isCandyMode={isCandyMode} />
                                        <FlavorMeter label="Spice (Drive)" value={userTraits.risk} color="bg-orange-500" darkColor="bg-amber-500" icon={Flame} isCandyMode={isCandyMode} />
                                        <FlavorMeter label="Sour (Logic)" value={userTraits.discipline} color="bg-green-500" darkColor="bg-purple-500" icon={Brain} isCandyMode={isCandyMode} />
                                    </div>

                                    {/* Bottom Badge */}
                                    <div className="mt-auto pt-6 flex items-center gap-4 justify-center">
                                        <div className={clsx(
                                            "w-16 h-16 rounded-full flex items-center justify-center border-4 animate-pulse",
                                            isCandyMode
                                                ? "bg-gradient-to-tr from-yellow-400 to-yellow-200 shadow-[0_0_20px_rgba(250,204,21,0.6)] border-white"
                                                : "bg-[#0a0f28] shadow-[0_0_20px_rgba(77,217,255,0.4)] border-[#4DD9FF]/50"
                                        )}>
                                            <Zap size={32} className={clsx(isCandyMode ? "text-yellow-700 fill-white" : "text-[#4DD9FF] fill-[#4DD9FF]/20")} />
                                        </div>
                                        <div className={clsx(
                                            "text-sm font-bold uppercase leading-tight drop-shadow-md",
                                            isCandyMode ? "text-yellow-100" : "text-amber-400"
                                        )}>
                                            Profile Tag:<br /><span className={clsx("text-lg tracking-wide", isCandyMode ? "text-white font-black" : "text-slate-200 font-bold")}>Deep Thinker</span>
                                        </div>
                                    </div>
                                </div>
                            </FrostedGrapePanel>
                        </div>

                        {/* CENTER COLUMN: Avatar & Mission */}
                        <div className="col-span-1 md:col-span-6 flex flex-col items-center">

                            {/* Avatar Ring */}
                            <div className="relative w-72 h-72 md:w-96 md:h-96 mb-8 group cursor-pointer mt-4">
                                {/* Rotating Stars Ring */}
                                <div className={clsx(
                                    "absolute inset-[-25px] border-2 rounded-full animate-spin-ultra-slow",
                                    isCandyMode ? "border-dashed border-white/40" : "border-solid border-[#4DD9FF]/20 shadow-[0_0_20px_rgba(77,217,255,0.1)_inset]"
                                )}></div>
                                <div className={clsx("absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 animate-bounce", isCandyMode ? "text-yellow-300" : "text-amber-400")}>
                                    <Star size={32} fill="currentColor" />
                                </div>
                                <div className={clsx("absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 animate-bounce delay-75", isCandyMode ? "text-pink-300" : "text-[#4DD9FF]")}>
                                    <Star size={28} fill="currentColor" />
                                </div>

                                {/* Main Image */}
                                <div className={clsx(
                                    "w-full h-full rounded-full border-[10px] overflow-hidden relative transform group-hover:scale-105 transition-transform duration-500 z-10",
                                    isCandyMode
                                        ? "border-white bg-gradient-to-b from-purple-500 to-indigo-600 shadow-[0_0_80px_rgba(236,72,153,0.8)]"
                                        : "border-[#0a0f28] bg-slate-900 shadow-[0_0_50px_rgba(77,217,255,0.4)] ring-2 ring-[#4DD9FF]/30"
                                )}>
                                    <img src={idolData.avatarUrl} alt={idolName} className="w-full h-full object-cover" />
                                    {/* Gloss Reflection */}
                                    <div className={clsx(
                                        "absolute top-0 left-0 w-full h-1/2 rounded-t-full pointer-events-none",
                                        isCandyMode ? "bg-gradient-to-b from-white/40 to-transparent" : "bg-gradient-to-b from-[#4DD9FF]/20 to-transparent"
                                    )} />
                                </div>
                            </div>

                            {/* Name Title */}
                            <h2 className={clsx(
                                "text-5xl md:text-7xl text-center mb-10 tracking-wide",
                                isCandyMode
                                    ? "font-yummy text-white drop-shadow-[0_6px_0_#4A148C] stroke-text-white"
                                    : "font-black text-[#E8E0FF] drop-shadow-[0_0_20px_rgba(232,224,255,0.6)] uppercase"
                            )}>
                                {idolName}
                            </h2>

                            {/* Mobile Views for columns (collapsed) */}
                            <div className="md:hidden w-full flex flex-col gap-6 mb-8">
                                <FrostedGrapePanel title="Strengths" isCandyMode={isCandyMode}>
                                    {displayStrengths.slice(0, 3).map((str, i) => <BoosterIcon key={i} type={'striped'} label={str} isCandyMode={isCandyMode} />)}
                                </FrostedGrapePanel>
                                <FrostedGrapePanel title="Blind Spots" isCandyMode={isCandyMode}>
                                    {displayBlindSpots.slice(0, 3).map((str, i) => <BlockerIcon key={i} label={str} isCandyMode={isCandyMode} />)}
                                </FrostedGrapePanel>
                            </div>

                            {/* Honey Mission Box / Cyber Directive */}
                            <div className="relative w-full max-w-2xl transform hover:scale-[1.02] transition-transform">
                                <div className={clsx(
                                    "absolute -inset-2 rounded-2xl blur opacity-70 animate-pulse",
                                    isCandyMode ? "bg-gradient-to-r from-yellow-400 to-orange-500" : "bg-gradient-to-r from-amber-500 to-yellow-600"
                                )}></div>
                                <div className={clsx(
                                    "relative rounded-xl border-[4px] p-1",
                                    isCandyMode
                                        ? "bg-gradient-to-b from-yellow-300 to-orange-400 border-white/60"
                                        : "bg-[#0a0f28] border-amber-500/50"
                                )}>
                                    <div className={clsx(
                                        "rounded-lg p-6 flex items-center gap-6",
                                        isCandyMode ? "bg-orange-500/20" : "bg-amber-900/30"
                                    )}>
                                        <div className="relative shrink-0">
                                            <Star size={64} className={clsx(
                                                "drop-shadow-xl animate-spin-slow",
                                                isCandyMode ? "text-yellow-100 fill-yellow-300" : "text-amber-200 fill-amber-500"
                                            )} />
                                        </div>
                                        <div className="flex-1">
                                            <div className={clsx(
                                                "text-2xl leading-none mb-2 tracking-widest uppercase",
                                                isCandyMode ? "font-yummy text-orange-900" : "font-black text-amber-500 drop-shadow-md text-xl"
                                            )}>CURRENT DIRECTIVE</div>
                                            <div className={clsx(
                                                "font-black text-xl leading-tight drop-shadow-md",
                                                isCandyMode ? "text-white" : "text-amber-50"
                                            )}>
                                                Embrace your unique strengths and carve your legacy.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Growth Challenge */}
                        <div className="hidden md:flex md:col-span-3 flex-col gap-6">
                            <FrostedGrapePanel title="Growth Challenge" isCandyMode={isCandyMode} className="min-h-[400px]">
                                <div className="flex flex-col gap-6 h-full mt-2">
                                    {/* Blind Spots */}
                                    <div className="flex flex-col gap-4">
                                        <div className={clsx(
                                            "text-sm font-black uppercase opacity-90 tracking-widest text-center shadow-black drop-shadow-sm",
                                            isCandyMode ? "text-pink-200" : "text-red-300/80 text-xs"
                                        )}>Blind Spots</div>
                                        {displayBlindSpots.map((str, i) => (
                                            <BlockerIcon key={i} label={str} isCandyMode={isCandyMode} />
                                        ))}
                                    </div>

                                    {/* Collection Case */}
                                    <div className={clsx(
                                        "rounded-xl p-5 shadow-inner mt-2",
                                        isCandyMode ? "bg-black/40 border border-white/10" : "bg-slate-900/40 border border-[#4DD9FF]/10"
                                    )}>
                                        <div className={clsx(
                                            "text-xs font-bold text-center uppercase mb-3 tracking-widest",
                                            isCandyMode ? "text-white/60" : "text-[#4DD9FF]/50"
                                        )}>Growth Rewards</div>
                                        <div className="flex justify-center gap-6">
                                            {[1, 2, 3].map(i => (
                                                <Star key={i} size={32} className={clsx(
                                                    "drop-shadow-none",
                                                    isCandyMode ? "text-white/20 fill-white/5" : "text-[#4DD9FF]/20 fill-[#4DD9FF]/5"
                                                )} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tough Cookie Meter */}
                                    <div className="mt-auto">
                                        <ToughCookieMeter score={userTraits.resilience} isCandyMode={isCandyMode} />
                                    </div>
                                </div>
                            </FrostedGrapePanel>
                        </div>

                    </div>
                </div>
            </div>

            {/* FOOTER CTA */}
            <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-50 flex justify-center">
                <button
                    onClick={() => { audioSynth.playClick(); onClose(); }}
                    className={clsx(
                        "group relative w-full max-w-md h-20 rounded-full transition-all hover:scale-105 active:scale-95",
                        isCandyMode ? "shadow-[0_10px_30px_rgba(0,230,118,0.4)]" : "shadow-[0_0_30px_rgba(77,217,255,0.4)]"
                    )}
                >
                    <div className={clsx(
                        "absolute inset-0 rounded-full border-[3px]",
                        isCandyMode
                            ? "bg-gradient-to-b from-[#69F0AE] to-[#00C853] border-[#B9F6CA]"
                            : "bg-gradient-to-b from-cyan-400 to-[#10b981] border-[#4DD9FF]"
                    )}></div>
                    {/* Gloss */}
                    <div className={clsx(
                        "absolute top-2 left-6 right-6 h-1/2 rounded-full blur-[2px]",
                        isCandyMode ? "bg-white/40" : "bg-white/20"
                    )}></div>

                    <span className={clsx(
                        "relative z-10 flex items-center justify-center h-full gap-3 text-3xl text-white drop-shadow-md tracking-widest",
                        isCandyMode ? "font-yummy stroke-text-green" : "font-black"
                    )}>
                        ACCEPT YOUR PATH <RefreshCw size={24} className={clsx("stroke-[3]", !isCandyMode && "animate-spin-slow")} />
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
