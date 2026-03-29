import { useUserStore } from '../../store/userStore';
import { Lock, Star, Settings, BookOpen, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { LessonJournal } from './LessonJournal';
import clsx from 'clsx';
import { AudioController } from '../shared/AudioController';
import { audioSynth } from '../../utils/audioSynth';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { AntiGravityCanvas } from './AntiGravityCanvas';

interface LevelMapProps {
    onPlayLevel: (level: any) => void;
}

export function LevelMap({ onPlayLevel }: LevelMapProps) {
    const levels = useUserStore((state) => state.levels);
    const isCandyMode = useUserStore((state) => state.isCandyMode);
    const toggleCandyMode = useUserStore((state) => state.toggleCandyMode);

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [showJournal, setShowJournal] = useState(false);

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

    const totalHeight = (levels.length * NODE_SPACING) + (isMobile ? 300 : 400);

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

    // Scroll to top on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = 0;
        }
    }, [levels]);

    return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-slate-900 overflow-hidden select-none">
            {/* --- FIXED UI LAYER (Stays on Top) --- */}

            {/* Header - Optimized for Mobile Safe Area */}
            <div className="absolute top-0 left-0 w-full pt-safe-top z-40 pointer-events-none flex justify-center perspective-text">
                <div className="relative group cursor-default pointer-events-auto filter drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300 ease-spring mt-16 md:mt-4">
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-purple-500/0 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <h1 className={clsx(
                        "text-4xl md:text-5xl font-black md:text-transparent md:bg-clip-text tracking-blacker font-comic transform -rotate-2 group-hover:rotate-0 transition-transform stroke-text text-center leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]",
                        isCandyMode
                            ? "text-white md:bg-gradient-to-b md:from-white md:to-pink-100/90"
                            : "text-amber-400 md:bg-gradient-to-b md:from-amber-200 md:to-amber-500"
                    )}>
                        AT YOUR AGE
                    </h1>
                    {/* Decorative Elements */}
                    <span className="absolute -top-3 -right-6 text-2xl animate-sparkle hidden md:block">✨</span>
                    <span className="absolute -bottom-2 -left-6 text-2xl animate-spin-slow opacity-80 hidden md:block">⚙️</span>
                </div>
            </div>

            {/* Settings & Theme Buttons */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50 flex flex-col gap-2 pt-safe-top">
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        setShowSettings(true);
                    }}
                    className="w-12 h-12 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-lg"
                    aria-label="Settings"
                >
                    <Settings size={24} className="md:w-5 md:h-5" />
                </button>
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        toggleCandyMode();
                    }}
                    className={clsx(
                        "w-12 h-12 md:w-10 md:h-10 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-lg border",
                        isCandyMode
                            ? "bg-amber-400/20 hover:bg-amber-400/40 border-amber-300/50"
                            : "bg-indigo-500/20 hover:bg-indigo-500/40 border-indigo-400/50"
                    )}
                    aria-label="Toggle Theme"
                >
                    {isCandyMode ? <Sun size={24} className="md:w-5 md:h-5 text-amber-300" /> : <Moon size={24} className="md:w-5 md:h-5 text-indigo-300" />}
                </button>
            </div>

            {/* Journal Toggle Button - Compact Mobile Layout */}
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 animate-fade-in-delayed pt-safe-top">
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        setShowJournal(true);
                    }}
                    className={clsx(
                        "group flex items-center gap-2 md:gap-3 pr-4 md:pr-6 pl-2 py-1.5 md:py-2 rounded-full shadow-2xl transition-all border-2",
                        isCandyMode
                            ? "bg-white/90 border-pink-200 hover:border-pink-400 hover:scale-105 active:scale-95"
                            : "bg-slate-900 border-amber-600/50 hover:border-amber-400 hover:scale-105 active:scale-95"
                    )}
                >
                    <div className={clsx(
                        "text-white p-1.5 md:p-2 rounded-full shadow-md group-hover:rotate-12 transition-transform",
                        isCandyMode ? "bg-pink-500" : "bg-gradient-to-br from-amber-400 to-amber-600"
                    )}>
                        <BookOpen size={16} className="stroke-[3] md:w-5 md:h-5" />
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
            </div>

            {/* Modals (Fixed Overlay) */}
            {showJournal && <LessonJournal onClose={() => setShowJournal(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}

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
                    onReady={() => setCanvasReady(true)}
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
                                    d={levels.reduce((path, _, i) => {
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
                        {levels.map((level, i) => {
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
                                            "candy-node-container group cursor-pointer hover:scale-105 transition-transform",
                                            isCurrent && "candy-node-active",
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
                                            isCurrent ? (isCandyMode ? "bg-pink-100/50" : "bg-amber-100/50") : "bg-white/10"
                                        )} />

                                        {/* Responsive Avatar Ring */}
                                        <div className={clsx(
                                            "relative rounded-full border-4 overflow-hidden flex items-center justify-center bg-white node-ring",
                                            // Mobile: w-16 h-16, Desktop: w-24 h-24
                                            "w-16 h-16 md:w-24 md:h-24",
                                            isCurrent 
                                                ? (isCandyMode ? "border-pink-400 ring-4 ring-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.6)]" : "border-amber-400 ring-4 ring-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.6)]")
                                                : "border-slate-300 shadow-[0_8px_0_rgba(0,0,0,0.2)]"
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
                                                    isUnlocked
                                                        ? "bg-gradient-to-r from-yellow-300 to-yellow-500 border-white text-yellow-900"
                                                        : "bg-slate-700 border-slate-600 text-slate-400"
                                                )}>
                                                    <span className="text-[10px] md:text-sm font-black uppercase tracking-blacker drop-shadow-sm">
                                                        {level.personality}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Story Title */}
                                            <div className={clsx(
                                                "px-4 py-1 pt-3 pb-1 md:px-6 md:py-2 md:pt-4 md:pb-2 rounded-xl border-b-[3px] md:border-b-4 shadow-xl flex items-center justify-center min-w-[100px] md:min-w-[140px]",
                                                isUnlocked
                                                    ? (isCandyMode ? "bg-gradient-to-r from-pink-500 to-rose-500 border-rose-800" : "bg-gradient-to-b from-slate-800 to-slate-900 border-slate-950 ring-1 ring-amber-600/50")
                                                    : "bg-slate-800 border-slate-900"
                                            )}>
                                                <span className={clsx(
                                                    "text-[10px] md:text-xs font-bold uppercase tracking-wider leading-none text-center",
                                                    isUnlocked ? (isCandyMode ? "text-white drop-shadow-md" : "text-amber-400 drop-shadow-md") : "text-slate-500"
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
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
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
