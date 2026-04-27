import { useUserStore } from '../../store/userStore';
import { Lock, Star, Settings, BookOpen, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { LessonJournal } from './LessonJournal';
import clsx from 'clsx';
import { AudioController } from '../shared/AudioController';
import { audioSynth } from '../../utils/audioSynth';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { AntiGravityCanvas } from './AntiGravityCanvas';
import { DailyChallengeModal } from './DailyChallengeModal';
import type { MoodArchetype } from './DailyChallengeModal';
import { DailyChallengeReveal } from './DailyChallengeReveal';

interface LevelMapProps {
    onPlayLevel: (level: any) => void;
    onOpenDnaProfile: () => void;
}

export function LevelMap({ onPlayLevel, onOpenDnaProfile }: LevelMapProps) {
    const levels = useUserStore((state) => state.levels);
    const profile = useUserStore((state) => state.profile);
    const activeAge = profile?.age || 18;
    let processedLevels = levels.filter(l => l.age === activeAge);

    // New stories that should be visible to ALL users regardless of interests.
    const alwaysShowPersonalities = new Set([
        'Billie Eilish', 'MrBeast', 'Ritesh Agarwal', 'Muhammad Ali',
        'Dhruv Rathee', 'Falguni Nayar', 'Nikola Tesla'
    ]);

    if (profile?.psychologicalProfile) {
        const { interest_goal = '', interest_domain = '' } = profile.psychologicalProfile as any;

        let allowedNames = new Set<string>();
        let bypassFilter = false;

        const goals = interest_goal.split(',').map((s: string) => s.trim());
        const domains = interest_domain.split(',').map((s: string) => s.trim());
        const interests = [...goals, ...domains];

        if (interests.some((i: string) => i.includes('Success') || i.includes('Leadership'))) {
            bypassFilter = true;
        }

        if (!bypassFilter && interests.length > 0) {
            if (interests.some((i: string) => i.includes('Money') || i.includes('Business'))) {
                ['Bill Gates', 'Ratan Tata', 'Indra Nooyi', 'Walt Disney'].forEach(n => allowedNames.add(n));
            }
            if (interests.some((i: string) => i.includes('Tech'))) {
                ['Bill Gates', 'Steve Jobs', 'Sundar Pichai'].forEach(n => allowedNames.add(n));
            }
            if (interests.some((i: string) => i.includes('Creativity') || i.includes('Love'))) {
                ['Taylor Swift', 'Shah Rukh Khan', 'Frida Kahlo', 'A.R. Rahman', 'Steven Spielberg', 'J.K. Rowling', 'Mary Shelley'].forEach(n => allowedNames.add(n));
            }
            if (interests.some((i: string) => i.includes('Discipline'))) {
                ['Sachin Tendulkar', 'Virat Kohli', 'Kobe Bryant', 'P.V. Sindhu', 'Arnold'].forEach(n => allowedNames.add(n));
            }

            if (allowedNames.size > 0) {
                processedLevels = processedLevels.filter(l => {
                    const p = l.personality || '';
                    // Always show the new 7 stories for every user
                    if (Array.from(alwaysShowPersonalities).some(n => p.includes(n))) return true;
                    // Apply the original interest-based filter for everything else
                    return Array.from(allowedNames).some(name => p.includes(name));
                });
            }
        }
    }

    const ageLevels = processedLevels;

    const isCandyMode = useUserStore((state) => state.isCandyMode);
    const toggleCandyMode = useUserStore((state) => state.toggleCandyMode);
    
    // Streaks
    const checkStreak = useUserStore((state) => state.checkStreak);
    
    useEffect(() => {
        checkStreak(); // evaluate streaks on mount
    }, [checkStreak]);

    // Modals
    const [showSettings, setShowSettings] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [challengeMood, setChallengeMood] = useState<MoodArchetype | null>(null);

    // Mobile Detection
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Configuration
    const NODE_SPACING_DESKTOP = 220;
    const NODE_SPACING_MOBILE = 180;
    const NODE_SPACING = isMobile ? NODE_SPACING_MOBILE : NODE_SPACING_DESKTOP;

    // Manual Offsets to align with the "River" background image
    // Manual Offsets to align with the "River" background image
    const DESKTOP_NODE_OFFSETS = [0, -60, 50, -50, 20, 60, -40, 30, -60, 0];
    const MOBILE_NODE_OFFSETS = [0, -20, 20, -20, 10, 25, -15, 10, -20, 0]; // Tighter zig-zag for mobile

    const NODE_OFFSETS = isMobile ? MOBILE_NODE_OFFSETS : DESKTOP_NODE_OFFSETS;

    const totalHeight = (ageLevels.length * NODE_SPACING) + (isMobile ? 300 : 400);

    // Helper to calculate X/Y for a node based on index
    const getPosition = (index: number) => {
        // TOP-DOWN: Start from Top
        const y = index * NODE_SPACING + (isMobile ? 120 : 150); // Less top padding on mobile

        // Use defined offsets if available, otherwise sinusoid
        const xOffset = index < NODE_OFFSETS.length
            ? NODE_OFFSETS[index]
            : Math.sin(index) * (isMobile ? 30 : 60); // Reduced amplitude for mobile

        return { x: xOffset, y };
    };

    // Scroll refs and values
    const containerRef = useRef<HTMLDivElement>(null);
    const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
    const [canvasReady, setCanvasReady] = useState(false);

    const handleCanvasReady = useCallback(() => {
        setCanvasReady(true);
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { scrollYProgress } = useScroll({ container: containerRef });

    // The "Liquid Scroll" feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400, // Increased for sharper response
        damping: 40,    // Increased to prevent wobble
        mass: 0.5,      // Lighter mass for immediate start
        restDelta: 0.001
    });

    const scrollableDistance = Math.max(0, totalHeight - windowHeight);
    const hudY = useTransform(smoothProgress, [0, 1], [0, -scrollableDistance]);

    // --- STARTUP SOUND & AUTO-SCROLL ---
    useEffect(() => {
        // Startup Sound
        audioSynth.playStartup();

        const scrollToTop = () => {
            if (containerRef.current) {
                containerRef.current.scrollTop = 0;
                containerRef.current.dispatchEvent(new Event('scroll'));
            }
        };

        requestAnimationFrame(scrollToTop);
        const timer = setTimeout(scrollToTop, 150);
        return () => clearTimeout(timer);
    }, [ageLevels.length]);

    // --- SCROLL AUDIO GLIDE ---
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let lastScrollTop = container.scrollTop;
        let scrollTimeout: any;

        const handleScroll = () => {
            const currentScrollTop = container.scrollTop;
            const delta = Math.abs(currentScrollTop - lastScrollTop);
            
            if (delta > 2) {
                audioSynth.startGlide();
                audioSynth.updateGlide(delta);
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    audioSynth.stopGlide();
                }, 150);
            }
            
            lastScrollTop = currentScrollTop;
        };

        container.addEventListener('scroll', handleScroll);
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
            audioSynth.stopGlide();
        };
    }, []);

    return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-slate-900 overflow-hidden">
            <AudioController />
            {/* --- FIXED UI LAYER (Stays on Top) --- */}

            {/* Daily Challenge Button (Top Center below Navbar) */}
            <div className="absolute top-[70px] left-0 w-full flex justify-center z-[100] pointer-events-none px-2">
                <div className="relative group w-full max-w-[250px]">
                    {/* Glowing pulse behind button */}
                    {!profile?.daily_challenge_completed && (
                        <div className="absolute -inset-1 bg-orange-500/20 blur-md rounded-full animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
                    )}
                    <button
                        onClick={() => {
                            audioSynth.playClick();
                            setShowChallengeModal(true);
                        }}
                        disabled={profile?.daily_challenge_completed}
                        className={clsx(
                            "pointer-events-auto relative w-full py-2.5 px-4 rounded-full flex flex-row items-center justify-center gap-3 transition-all duration-500",
                            profile?.daily_challenge_completed 
                                ? "bg-[rgba(15,20,30,0.8)] border border-slate-700 text-slate-500 opacity-90 cursor-default backdrop-blur-md" 
                                : "bg-[rgba(15,20,30,0.9)] backdrop-blur-md border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:bg-[rgba(25,30,40,0.9)] hover:border-orange-400 hover:scale-105 active:scale-95"
                        )}
                    >
                        <span className={clsx("text-lg", profile?.daily_challenge_completed ? "grayscale opacity-30" : "drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]")}>🔥</span>
                        <div className="flex flex-col items-start leading-tight">
                            <span className={clsx("text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em]", profile?.daily_challenge_completed ? "text-slate-500" : "text-white drop-shadow-md")}>
                                {profile?.daily_challenge_completed ? "COMPLETED" : "TODAY'S CHALLENGE"}
                            </span>
                            <span className={clsx("text-[9px] font-bold tracking-widest uppercase", profile?.daily_challenge_completed ? "text-slate-600" : "text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]")}>
                                {profile?.current_streak || 0} DAY STREAK
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Settings & Theme Buttons */}
            <div className="absolute top-20 left-4 md:top-24 md:left-6 z-[100] flex flex-col gap-2">
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        setShowSettings(true);
                    }}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-lg hover:rotate-12 active:scale-90"
                    aria-label="Settings"
                >
                    <Settings size={18} className="md:w-5 md:h-5" />
                </button>
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        toggleCandyMode();
                    }}
                    className={clsx(
                        "w-8 h-8 md:w-10 md:h-10 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg border hover:-rotate-12 active:scale-90",
                        isCandyMode
                            ? "bg-amber-400/20 hover:bg-amber-400/40 border-amber-300/50"
                            : "bg-indigo-500/20 hover:bg-indigo-500/40 border-indigo-400/50"
                    )}
                    aria-label="Toggle Theme"
                >
                    {isCandyMode ? <Sun size={18} className="md:w-5 md:h-5 text-amber-300 animate-pulse" /> : <Moon size={18} className="md:w-5 md:h-5 text-indigo-300 animate-breath" />}
                </button>
            </div>

            {/* Journal Toggle Button - Compact Mobile Layout */}
            <div className="absolute top-20 right-4 md:top-24 md:right-6 z-[100] animate-fade-in-delayed flex flex-col gap-2 items-end">
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        setShowJournal(true);
                    }}
                    className={clsx(
                        "group flex items-center gap-1.5 md:gap-3 pr-3 md:pr-6 pl-1.5 py-1 md:py-2 rounded-full shadow-2xl transition-all border-2 animate-float",
                        isCandyMode
                            ? "bg-white/90 border-pink-200 hover:border-pink-400 hover:scale-105 active:scale-95 animate-pulse-glow-amber"
                            : "bg-slate-900 border-amber-600/50 hover:border-amber-400 hover:scale-105 active:scale-95 animate-pulse-glow-amber"
                    )}
                >
                    <div className={clsx(
                        "text-white p-1 md:p-2 rounded-full shadow-md group-hover:rotate-12 transition-transform",
                        isCandyMode ? "bg-pink-500" : "bg-gradient-to-br from-amber-400 to-amber-600"
                    )}>
                        <BookOpen size={14} className="stroke-[3] md:w-5 md:h-5" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className={clsx(
                            "text-[8px] md:text-[10px] font-bold uppercase tracking-wider hidden xs:block",
                            isCandyMode ? "text-pink-400" : "text-amber-500/80"
                        )}>MY WISDOM</span>
                        <span className={clsx(
                            "text-xs md:text-sm font-black transition-colors",
                            isCandyMode ? "text-slate-800 group-hover:text-pink-600" : "text-amber-400 group-hover:text-amber-300"
                        )}>JOURNAL</span>
                    </div>
                </button>

                {/* DNA Profile Button - Isolated to prevent disappearing */}
                 <button
                    onClick={() => {
                        console.log('DNA button clicked');
                        audioSynth.playClick();
                        onOpenDnaProfile();
                    }}
                    className={clsx(
                        "group flex items-center gap-1.5 pr-2 md:pr-4 pl-1.5 py-1 md:py-1.5 border hover:scale-105 active:scale-95 transition-all shadow-lg rounded-full pointer-events-auto animate-float-delayed",
                        isCandyMode
                            ? "bg-purple-900/40 border-purple-400/50 backdrop-blur-md"
                            : "bg-[#0d0d16] border-[#00f2ff]/30 backdrop-blur-md animate-pulse-glow-cyan"
                    )}
                >
                    <div className={clsx(
                        "text-xs font-black rounded-full flex items-center justify-center p-1 drop-shadow-md text-white border border-white/20",
                        isCandyMode ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-[#00f2ff] to-[#d575ff]"
                    )}>
                        🧬
                    </div>
                    <span className={clsx(
                        "text-[10px] md:text-xs font-black uppercase tracking-widest leading-none border-l pl-2",
                        isCandyMode ? "text-pink-100 border-pink-400/50" : "text-[#99f7ff] border-[#00f2ff]/30"
                    )}>DNA DATA</span>
                </button>
            </div>

            {/* Modals (Fixed Overlay) */}
            {showJournal && <LessonJournal onClose={() => setShowJournal(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            {showChallengeModal && (
                <DailyChallengeModal 
                    isOpen={showChallengeModal} 
                    onClose={() => setShowChallengeModal(false)}
                    onStartChallenge={(mood) => {
                        setShowChallengeModal(false);
                        setChallengeMood(mood);
                    }}
                />
            )}
            {challengeMood && (
                <DailyChallengeReveal
                    mood={challengeMood}
                    onClose={() => setChallengeMood(null)}
                    onComplete={(level) => {
                        setChallengeMood(null);
                        onPlayLevel(level);
                    }}
                />
            )}

            {/* Audio Controller (Invisible) */}
            <AudioController />

            {/* --- SCROLLABLE MAP CONTENT --- */}
            <div
                ref={containerRef}
                className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth"
            >
                {/* Dummy div to enforce native scroll height */}
                <div style={{ height: totalHeight, width: '100%' }} />

                {/* --- LAYER 1: BACKDROP (AntiGravityCanvas) --- */}
                <AntiGravityCanvas
                    progress={smoothProgress}
                    onReady={handleCanvasReady}
                />

                {!isMobile && canvasReady && (
                    <div className="fixed inset-0 bg-gradient-to-t from-pink-200/20 via-transparent to-slate-900/50 mix-blend-overlay pointer-events-none z-10" />
                )}

                {/* --- LAYER 2: MIDGROUND HUD (Interactive & Smooth Synced) --- */}
                <motion.div
                    className="fixed top-0 left-0 w-full layer-mid pb-32 pointer-events-none z-20"
                    style={{ height: totalHeight, y: hudY, opacity: canvasReady ? 1 : 0 }}
                >
                    <div className="relative w-full max-w-md mx-auto mt-24 md:mt-32 pointer-events-none h-full">
                        {/* CANDY PATH: Stepping Stones */}
                        <div className="absolute inset-0 pointer-events-none">
                            <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
                                {/* Path logic identical, just re-rendered with new getPosition */}
                                <path
                                    d={ageLevels.reduce((path, _, i) => {
                                        if (i === 0) return `M ${50 + (0)}% 80`;
                                        const prev = getPosition(i - 1);
                                        const curr = getPosition(i);
                                        // Adjust curve handles for mobile to be tighter
                                        const curveStrength = isMobile ? 3 : 4;
                                        const prevXPercent = 50 + (prev.x / curveStrength);
                                        const currXPercent = 50 + (curr.x / curveStrength);
                                        return `${path} C ${prevXPercent}% ${prev.y + 70}, ${currXPercent}% ${curr.y - 70}, ${currXPercent}% ${curr.y}`;
                                    }, "")}
                                    fill="none"
                                    stroke={isCandyMode ? "#F472B6" : "#F59E0B"} // pink-400 or amber-500
                                    strokeWidth={isMobile ? "40" : "50"} // Thicker path
                                    strokeLinecap="round"
                                    strokeDasharray="10 20" // Dashed line for style
                                    className={isCandyMode ? "drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]" : "drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]"} // Glow effect
                                />
                            </svg>
                        </div>

                        {/* LEVEL NODES */}
                        {ageLevels.map((level, i) => {
                            const pos = getPosition(i);
                            const isUnlocked = level.status !== 'locked';
                            const isCompleted = level.status === 'completed';
                            const isCurrent = isUnlocked && !isCompleted;

                            return (
                                <div
                                    key={level.id}
                                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-all duration-500 z-10 pointer-events-auto"
                                    style={{
                                        top: pos.y,
                                        transform: `translate(calc(-50% + ${pos.x}px), -50%)`,
                                        zIndex: 20 + i
                                    }}
                                >
                                    <div
                                        className={clsx(
                                            "candy-node-container group cursor-pointer hover:scale-110 transition-transform animate-float",
                                            isCurrent && "candy-node-active animate-breath",
                                            !isUnlocked && "candy-node-locked grayscale opacity-80",
                                            isCompleted && "candy-node-completed"
                                        )}
                                        // Touch start for mobile responsiveness
                                        onTouchStart={() => {
                                            if (isUnlocked) audioSynth.playHover();
                                        }}
                                        onClick={() => {
                                            if (isUnlocked) {
                                                audioSynth.playClick();
                                                onPlayLevel(level);
                                            }
                                        }}
                                    >
                                        <div className="lollipop-stick" />
                                        {/* Responsive Halo */}
                                        <div className={clsx(
                                            "absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full transition-colors node-base",
                                            // Mobile: w-20 h-20, Desktop: w-28 h-28
                                            "w-20 h-20 md:w-28 md:h-28",
                                            isCandyMode 
                                                ? (isCurrent ? "bg-pink-100/50" : "bg-white/10")
                                                : (isCurrent ? "bg-amber-400/20" : "bg-[#4DD9FF]/10")
                                        )} />

                                        {/* Responsive Avatar Ring */}
                                        <div className={clsx(
                                            "relative rounded-full overflow-hidden flex items-center justify-center bg-white node-ring transition-all duration-300",
                                            // Mobile: w-16 h-16, Desktop: w-24 h-24
                                            "w-16 h-16 md:w-24 md:h-24",
                                            isCandyMode
                                                ? (isCurrent ? "border-4 border-pink-400 ring-4 ring-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.6)]" : "border-4 border-slate-300 shadow-[0_8px_0_rgba(0,0,0,0.2)]")
                                                : (isCurrent 
                                                    ? "border-4 border-amber-400 ring-4 ring-amber-400/30 shadow-[0_0_25px_rgba(245,158,11,0.8)]"
                                                    : "border-transparent ring-2 ring-[#4DD9FF]/80 shadow-[0_0_15px_rgba(77,217,255,0.6)]")
                                        )}>
                                            <img src={level.avatarUrl || '/assets/avatar_business.png'} alt={level.archetype} className="w-full h-full object-cover node-content" />
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-200/50 backdrop-blur-[1px]">
                                                    <Lock size={20} className="text-slate-500 drop-shadow-md opacity-80 md:w-6 md:h-6" />
                                                </div>
                                            )}
                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-full" />
                                        </div>

                                        {/* Labels */}
                                        <div className={clsx(
                                            "absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 transition-all duration-300 transform flex flex-col items-center",
                                            "md:-bottom-14", // Lower overlap on desktop
                                            isUnlocked ? "scale-100 hover:scale-110" : "scale-90 opacity-70 grayscale"
                                        )}>
                                            {/* Personality Badge */}
                                            {level.personality && (
                                                <div className={clsx(
                                                    "relative -mb-2 px-3 py-0.5 rounded-full border shadow-sm flex items-center justify-center z-40 animate-float",
                                                    "md:-mb-3 md:px-4 md:py-1 md:border-2",
                                                    isCandyMode
                                                        ? (isUnlocked ? "bg-gradient-to-r from-yellow-300 to-yellow-500 border-white text-yellow-900" : "bg-slate-700 border-slate-600 text-slate-400")
                                                        : (isUnlocked 
                                                            ? (isCurrent ? "bg-amber-500 border-amber-300 text-amber-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "bg-[rgba(10,15,40,0.75)] border-[#4DD9FF]/70 text-[#E8E0FF] backdrop-blur-md shadow-[0_0_8px_rgba(77,217,255,0.3)]")
                                                            : "bg-slate-800 border-slate-700 text-slate-500")
                                                )}>
                                                    <span className="text-[10px] md:text-sm font-black uppercase tracking-blacker drop-shadow-sm">
                                                        {level.personality}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Story Title */}
                                            <div className={clsx(
                                                "px-4 py-1 pt-3 pb-1 md:px-6 md:py-2 md:pt-4 md:pb-2 rounded-xl shadow-xl flex items-center justify-center min-w-[100px] md:min-w-[140px] transition-all duration-300",
                                                isCandyMode
                                                    ? (isUnlocked ? "bg-gradient-to-r from-pink-500 to-rose-500 border-b-[3px] md:border-b-4 border-rose-800" : "border-b-[3px] md:border-b-4 bg-slate-800 border-slate-900")
                                                    : (isUnlocked
                                                        ? (isCurrent 
                                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 border-b-[3px] md:border-b-4 border-amber-800 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                                            : "bg-[rgba(10,15,40,0.75)] backdrop-blur-md border border-[#4DD9FF]/60 shadow-[0_0_15px_rgba(77,217,255,0.15)]")
                                                        : "bg-slate-800/80 border-b-[3px] md:border-b-4 border-slate-900")
                                            )}>
                                                <span className={clsx(
                                                    "text-[10px] md:text-xs font-bold uppercase tracking-wider leading-none text-center",
                                                    isCandyMode
                                                        ? (isUnlocked ? "text-white drop-shadow-md" : "text-slate-500")
                                                        : (isUnlocked 
                                                            ? (isCurrent ? "text-white drop-shadow-md" : "text-[#F0EEFF] drop-shadow-[0_0_4px_rgba(240,238,255,0.3)]")
                                                            : "text-slate-500")
                                                )}>
                                                    {level.title}
                                                </span>
                                            </div>
                                        </div>

                                        {isCompleted && (
                                            <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 flex gap-1">
                                                {[1, 2, 3].map(s => (
                                                    <Star key={s} size={16} className="fill-yellow-400 text-yellow-600 drop-shadow-sm animate-bounce md:w-5 md:h-5" style={{ animationDelay: `${s * 100}ms` }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* AGE EDIT MODAL */}
            {showSettings && <SettingsModal onClose={() => { audioSynth.playBack(); setShowSettings(false); }} />}
        </div >
    );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
    const [newAge, setNewAge] = useState(18);

    // Store Actions & State
    const profile = useUserStore((state) => state.profile);
    const setProfile = useUserStore((state) => state.setProfile);
    const resetProgress = useUserStore((state) => state.resetProgress);

    // Audio State
    const musicVolume = useUserStore((state) => state.musicVolume);
    const sfxVolume = useUserStore((state) => state.sfxVolume);
    const isMusicMuted = useUserStore((state) => state.isMusicMuted);
    const isSfxMuted = useUserStore((state) => state.isSfxMuted);
    const setMusicVolume = useUserStore((state) => state.setMusicVolume);
    const setSfxVolume = useUserStore((state) => state.setSfxVolume);
    const toggleMusicMute = useUserStore((state) => state.toggleMusicMute);
    const toggleSfxMute = useUserStore((state) => state.toggleSfxMute);

    // Initialize local age state from profile
    useEffect(() => {
        if (profile?.age) {
            setNewAge(profile.age);
        }
    }, [profile]);

    const handleAgeSave = () => {
        if (profile) {
            setProfile({ ...profile, age: newAge });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative">
                <h2 className="text-xl font-bold text-white mb-4 text-center">Settings</h2>
                <div className="space-y-6">
                    {/* Audio Controls */}
                    <div className="space-y-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                        {/* Music */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Music</span>
                                <button
                                    onClick={toggleMusicMute}
                                    className={clsx("p-1 rounded transition-colors", isMusicMuted ? "text-red-400 bg-red-900/30" : "text-green-400 bg-green-900/30")}
                                >
                                    {isMusicMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                        {/* SFX */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-400 uppercase">Sound FX</span>
                                <button
                                    onClick={toggleSfxMute}
                                    className={clsx("p-1 rounded transition-colors", isSfxMuted ? "text-red-400 bg-red-900/30" : "text-green-400 bg-green-900/30")}
                                >
                                    {isSfxMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    <hr className="border-slate-700" />

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Age</label>
                        <input
                            type="number"
                            value={newAge}
                            onChange={(e) => setNewAge(parseInt(e.target.value))}
                            className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 border border-slate-700 font-mono"
                        />
                    </div>
                    <button onClick={handleAgeSave} className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all">
                        UPDATE TIMELINE
                    </button>

                    <hr className="border-slate-700 my-2" />

                    <button
                        onClick={() => resetProgress()}
                        className="w-full bg-slate-800 hover:bg-red-900/50 text-red-400 hover:text-red-200 border border-slate-700 hover:border-red-800 font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all uppercase tracking-wider text-xs"
                    >
                        Restart Journey (Reset)
                    </button>

                    <button onClick={onClose} className="w-full text-slate-500 text-sm py-2 hover:text-white transition-colors">
                        Close Overlay
                    </button>
                </div>
            </div>
        </div>
    );
}
