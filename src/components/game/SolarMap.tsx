import { useUserStore } from '../../store/userStore';
import { Lock, Star, Settings, BookOpen, Volume2, VolumeX } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { LessonJournal } from './LessonJournal';
import clsx from 'clsx';
import { AudioController } from '../shared/AudioController';
import { audioSynth } from '../../utils/audioSynth';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { DailyChallengeModal } from './DailyChallengeModal';
import type { MoodArchetype } from './DailyChallengeModal';
import { DailyChallengeReveal } from './DailyChallengeReveal';
import { ThemeSwitcherModal } from './ThemeSwitcherModal';

// Global cache to keep frames in memory across component mounts
let globalSolarFramesCache: ImageBitmap[] | null = null;

interface SolarMapProps {
    onPlayLevel: (level: any) => void;
    onOpenDnaProfile: () => void;
    isMapActive?: boolean;
}

export function SolarMap({ onPlayLevel, onOpenDnaProfile, isMapActive = true }: SolarMapProps) {
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
                    if (Array.from(alwaysShowPersonalities).some(n => p.includes(n))) return true;
                    return Array.from(allowedNames).some(name => p.includes(name));
                });
            }
        }
    }

    const ageLevels = processedLevels;

    // Streaks
    const checkStreak = useUserStore((state) => state.checkStreak);
    
    useEffect(() => {
        checkStreak(); // evaluate streaks on mount
    }, [checkStreak]);

    // Modals
    const [showSettings, setShowSettings] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
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

    const DESKTOP_NODE_OFFSETS = [0, -60, 50, -50, 20, 60, -40, 30, -60, 0];
    const MOBILE_NODE_OFFSETS = [0, -20, 20, -20, 10, 25, -15, 10, -20, 0];

    const NODE_OFFSETS = isMobile ? MOBILE_NODE_OFFSETS : DESKTOP_NODE_OFFSETS;

    // Define the exact sequence of available frames
    const getFrameSequence = () => {
        const seq: string[] = [];
        // 1-240
        for (let i = 1; i <= 240; i++) {
            seq.push(`/assets/map_frames_solar/ezgif-frame-${String(i).padStart(3, '0')}.jpg`);
        }
        // Transition frame
        seq.push(`/assets/map_frames_solar/ezfif-frame-242%20(1).jpg`);
        // 241-479
        for (let i = 241; i <= 479; i++) {
            seq.push(`/assets/map_frames_solar/ezfif-frame-242%20(${i}).jpg`);
        }
        return seq;
    };
    const FRAME_URLS = getFrameSequence();
    const totalFrames = FRAME_URLS.length; // 480

    const contentHeight = (ageLevels.length * NODE_SPACING) + (isMobile ? 300 : 400);
    const totalHeight = Math.max(contentHeight, totalFrames * 10);

    const getPosition = (index: number) => {
        const y = index * NODE_SPACING + (isMobile ? 120 : 150);
        const xOffset = index < NODE_OFFSETS.length
            ? NODE_OFFSETS[index]
            : Math.sin(index) * (isMobile ? 30 : 60);

        return { x: xOffset, y };
    };

    // Scroll refs and values
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);
    const [canvasReady, setCanvasReady] = useState(false);
    const [framesLoaded, setFramesLoaded] = useState(0);
    const idleFramesRef = useRef<ImageBitmap[]>([]);
    const currentFrameIdx = useRef<number>(0);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { scrollYProgress } = useScroll({ container: containerRef });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 400,
        damping: 40,
        mass: 0.5,
        restDelta: 0.001
    });

    const scrollableDistance = Math.max(0, totalHeight - windowHeight);
    const hudY = useTransform(smoothProgress, [0, 1], [0, -scrollableDistance]);

    // Idle Animation Frame Logic
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let isUnmounted = false;
        
        // Low-end device check
        const isLowEnd = (navigator.hardwareConcurrency || 4) < 4;

        const drawFrame = (img: ImageBitmap | HTMLImageElement) => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        if (isLowEnd) {
            // Static fallback
            const img = new Image();
            img.src = '/assets/map_frames_solar/ezgif-frame-001.jpg';
            img.onload = () => {
                if (isUnmounted) return;
                drawFrame(img);
                setCanvasReady(true);
            };
            return () => { isUnmounted = true; };
        }

        const isInitialLoad = performance.now() < 3500;

        const loadFrames = async () => {
            // Check cache
            if (globalSolarFramesCache) {
                idleFramesRef.current = globalSolarFramesCache;
                setCanvasReady(true);
                setFramesLoaded(totalFrames);
                drawFrame(globalSolarFramesCache[currentFrameIdx.current]);
                return;
            }

            // If it's initial load, we still load them but we won't show the loading UI
            if (isInitialLoad) {
                setCanvasReady(true);
            }

            const batchSize = 50;
            const loadedBitmaps: ImageBitmap[] = new Array(totalFrames);
            
            // First load frame 1 immediately and draw it to prevent blank screen
            const firstImg = new Image();
            firstImg.src = '/assets/map_frames_solar/ezgif-frame-001.jpg';
            await new Promise((resolve) => {
                firstImg.onload = () => {
                    if (!isUnmounted) drawFrame(firstImg);
                    resolve(true);
                }
            });

            for (let i = 0; i < totalFrames; i += batchSize) {
                if (isUnmounted) return;
                const batchPromises = [];
                for (let j = i; j < i + batchSize && j < totalFrames; j++) {
                    const src = FRAME_URLS[j];
                    
                    batchPromises.push(
                        fetch(src)
                            .then(res => {
                                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                                return res.blob();
                            })
                            .then(blob => createImageBitmap(blob))
                            .then(bitmap => {
                                loadedBitmaps[j] = bitmap;
                                if (!isUnmounted) {
                                    setFramesLoaded(prev => prev + 1);
                                }
                            })
                            .catch(e => console.warn(`Failed to load frame at index ${j}: ${src}`, e))
                    );
                }
                await Promise.all(batchPromises);
            }

            if (isUnmounted) return;
            
            // Fill any missing frames with previous available frame to prevent crash
            for (let i = 0; i < totalFrames; i++) {
                if (!loadedBitmaps[i]) {
                    loadedBitmaps[i] = loadedBitmaps[i-1] || loadedBitmaps.find(b => b)!;
                }
            }

            globalSolarFramesCache = loadedBitmaps;
            idleFramesRef.current = loadedBitmaps;
            if (!isInitialLoad) {
                setCanvasReady(true);
            }
            
            console.log('[Solar] Total frames loaded:', loadedBitmaps.length);
            console.log('[Solar] First frame:', loadedBitmaps[0] ? 'OK' : 'MISSING');
            console.log('[Solar] Frame 240:', loadedBitmaps[239] ? 'OK' : 'MISSING');
            console.log('[Solar] Frame 241:', loadedBitmaps[240] ? 'OK' : 'MISSING');
            console.log('[Solar] Last frame:', loadedBitmaps[loadedBitmaps.length - 1] ? 'OK' : 'MISSING');

            drawFrame(idleFramesRef.current[currentFrameIdx.current]);
        };

        loadFrames();

        const handleResize = () => {
            if (idleFramesRef.current.length > 0) {
               drawFrame(idleFramesRef.current[currentFrameIdx.current]);
            } else if (isLowEnd) {
                const img = new Image();
                img.src = '/assets/map_frames_solar/ezgif-frame-001.jpg';
                img.onload = () => drawFrame(img);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            isUnmounted = true;
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Scroll Parallax Effect
    useEffect(() => {
        return scrollYProgress.on('change', (latest) => {
            const canvas = canvasRef.current;
            if (!canvas || !idleFramesRef.current || idleFramesRef.current.length === 0) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const frameIdx = Math.floor(latest * (totalFrames - 1));
            currentFrameIdx.current = frameIdx;
            const img = idleFramesRef.current[frameIdx];

            if (img) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        });
    }, [scrollYProgress]);

    useEffect(() => {
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

    return (
        <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 overflow-hidden text-white">
            <AudioController isMapActive={isMapActive} />

            {/* Daily Challenge Button */}
            <div className="absolute top-[70px] left-0 w-full flex justify-center z-[100] pointer-events-none px-2">
                <div className="relative group w-full max-w-[250px]">
                    {!profile?.daily_challenge_completed && (
                        <div className="absolute -inset-1 bg-orange-500/20 blur-md rounded-full animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
                    )}
                    <button
                        onClick={() => { audioSynth.playClick(); setShowChallengeModal(true); }}
                        disabled={profile?.daily_challenge_completed}
                        className={clsx(
                            "pointer-events-auto relative w-full py-2.5 px-4 rounded-full flex flex-row items-center justify-center gap-3 transition-all duration-500",
                            profile?.daily_challenge_completed 
                                ? "bg-[rgba(20,10,5,0.8)] border border-slate-700 text-slate-500 opacity-90 cursor-default backdrop-blur-md" 
                                : "bg-[rgba(20,10,5,0.9)] backdrop-blur-md border border-[#FFB347]/50 shadow-[0_0_15px_rgba(255,179,71,0.3)] hover:shadow-[0_0_25px_rgba(255,179,71,0.6)] hover:bg-[rgba(30,15,10,0.9)] hover:border-[#FFB347] hover:scale-105 active:scale-95"
                        )}
                    >
                        <span className={clsx("text-lg", profile?.daily_challenge_completed ? "grayscale opacity-30" : "drop-shadow-[0_0_8px_rgba(255,179,71,0.8)]")}>☀️</span>
                        <div className="flex flex-col items-start leading-tight">
                            <span className={clsx("text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em]", profile?.daily_challenge_completed ? "text-slate-500" : "text-white drop-shadow-md")}>
                                {profile?.daily_challenge_completed ? "COMPLETED" : "TODAY'S CHALLENGE"}
                            </span>
                            <span className={clsx("text-[9px] font-bold tracking-widest uppercase", profile?.daily_challenge_completed ? "text-slate-600" : "text-[#FFB347] drop-shadow-[0_0_5px_rgba(255,179,71,0.5)]")}>
                                {profile?.current_streak || 0} DAY STREAK
                            </span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Settings & Theme Buttons */}
            <div className="absolute top-20 left-4 md:top-24 md:left-6 z-[100] flex flex-col gap-2">
                <button
                    onClick={() => { audioSynth.playClick(); setShowSettings(true); }}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white/5 hover:bg-white/10 active:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-[#FFB347] transition-all border border-[#FFB347]/30 shadow-[0_0_10px_rgba(255,179,71,0.2)] hover:rotate-12 active:scale-90"
                    aria-label="Settings"
                >
                    <Settings size={18} className="md:w-5 md:h-5" />
                </button>
                <button
                    onClick={() => { audioSynth.playClick(); setShowThemeSwitcher(true); }}
                    className="w-8 h-8 md:w-10 md:h-10 bg-[#FFB347]/10 hover:bg-[#FFB347]/20 border border-[#FFB347]/50 backdrop-blur-md rounded-full flex items-center justify-center text-[#FFB347] transition-all shadow-[0_0_15px_rgba(255,179,71,0.3)] hover:-rotate-12 active:scale-90"
                    aria-label="Theme Switcher"
                >
                    <span className="text-sm">☀️</span>
                </button>
            </div>

            {/* Journal Toggle & DNA Profile */}
            <div className="absolute top-20 right-4 md:top-24 md:right-6 z-[100] flex flex-col gap-2 items-end">
                <button
                    onClick={() => { audioSynth.playClick(); setShowJournal(true); }}
                    className="group flex items-center gap-1.5 md:gap-3 pr-3 md:pr-6 pl-1.5 py-1 md:py-2 rounded-full shadow-2xl transition-all border-2 bg-slate-900 border-[#FFB347]/50 hover:border-[#FFB347] hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,179,71,0.2)]"
                >
                    <div className="text-[#0a0510] p-1 md:p-2 rounded-full shadow-md group-hover:rotate-12 transition-transform bg-gradient-to-br from-[#FFB347] to-[#ff6b35]">
                        <BookOpen size={14} className="stroke-[3] md:w-5 md:h-5" />
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-wider hidden xs:block text-[#FFB347]/80">MY WISDOM</span>
                        <span className="text-xs md:text-sm font-black transition-colors text-[#FFB347] group-hover:text-white">JOURNAL</span>
                    </div>
                </button>

                 <button
                    onClick={() => { audioSynth.playClick(); onOpenDnaProfile(); }}
                    className="group flex items-center gap-1.5 pr-2 md:pr-4 pl-1.5 py-1 md:py-1.5 border hover:scale-105 active:scale-95 transition-all shadow-lg rounded-full pointer-events-auto bg-[#0a0510] border-[#FFB347]/30 backdrop-blur-md"
                >
                    <div className="text-xs font-black rounded-full flex items-center justify-center p-1 drop-shadow-md text-[#0a0510] border border-white/20 bg-gradient-to-r from-[#FFB347] to-[#ff9100]">
                        🧬
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none border-l pl-2 text-[#FFB347] border-[#FFB347]/30">DNA DATA</span>
                </button>
            </div>

            {/* Modals */}
            <ThemeSwitcherModal isOpen={showThemeSwitcher} onClose={() => setShowThemeSwitcher(false)} />
            {showJournal && <LessonJournal onClose={() => setShowJournal(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            {showChallengeModal && (
                <DailyChallengeModal 
                    isOpen={showChallengeModal} 
                    onClose={() => setShowChallengeModal(false)}
                    onStartChallenge={(mood) => { setShowChallengeModal(false); setChallengeMood(mood); }}
                />
            )}
            {challengeMood && (
                <DailyChallengeReveal
                    mood={challengeMood}
                    onClose={() => setChallengeMood(null)}
                    onComplete={(level) => { setChallengeMood(null); onPlayLevel(level); }}
                />
            )}

            {/* Loading Bar Overlay */}
            {(!canvasReady && framesLoaded < totalFrames && (navigator.hardwareConcurrency || 4) >= 4) && (
                <div className="absolute inset-0 z-[150] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-none transition-opacity duration-1000">
                    <div className="w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-[#FFB347]/30 shadow-[0_0_15px_rgba(255,179,71,0.2)]">
                        <div 
                            className="h-full bg-gradient-to-r from-[#FFB347] to-[#ff7b00] transition-all duration-300"
                            style={{ width: `${(framesLoaded / totalFrames) * 100}%` }}
                        />
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-widest text-[#FFB347] animate-pulse">
                        Warping Space... {Math.round((framesLoaded / totalFrames) * 100)}%
                    </p>
                </div>
            )}

            {/* Scrollable Map */}
            <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden relative scroll-smooth">
                <div style={{ height: totalHeight, width: '100%' }} />

                {/* LAYER 1: STATIC CANVAS */}
                <canvas 
                    ref={canvasRef} 
                    className="fixed inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ zIndex: 0 }}
                />
                <div className="fixed inset-0 bg-gradient-to-t from-[#0a0510]/80 via-transparent to-slate-900/50 mix-blend-overlay pointer-events-none z-10" />

                {/* LAYER 2: NODES */}
                <motion.div
                    className="fixed top-0 left-0 w-full layer-mid pb-32 pointer-events-none z-20"
                    style={{ height: totalHeight, y: hudY, opacity: canvasReady ? 1 : 0 }}
                >
                    <div className="relative w-full max-w-md mx-auto mt-24 md:mt-32 pointer-events-none h-full">
                        {/* Connecting Path */}
                        <div className="absolute inset-0 pointer-events-none">
                            <svg className="absolute top-0 left-0 w-full h-full" style={{ overflow: 'visible' }}>
                                <path
                                    d={ageLevels.reduce((path, _, i) => {
                                        if (i === 0) return `M ${50}% 80`;
                                        const prev = getPosition(i - 1);
                                        const curr = getPosition(i);
                                        const curveStrength = isMobile ? 3 : 4;
                                        const prevXPercent = 50 + (prev.x / curveStrength);
                                        const currXPercent = 50 + (curr.x / curveStrength);
                                        return `${path} C ${prevXPercent}% ${prev.y + 70}, ${currXPercent}% ${curr.y - 70}, ${currXPercent}% ${curr.y}`;
                                    }, "")}
                                    fill="none"
                                    stroke="#FFB347"
                                    strokeWidth={isMobile ? "40" : "50"}
                                    strokeLinecap="round"
                                    strokeDasharray="10 20"
                                    className="drop-shadow-[0_0_15px_rgba(255,179,71,0.4)] opacity-50"
                                />
                            </svg>
                        </div>

                        {/* Nodes */}
                        {ageLevels.map((level, i) => {
                            const pos = getPosition(i);
                            const isUnlocked = level.status !== 'locked';
                            const isCompleted = level.status === 'completed';
                            const isCurrent = isUnlocked && !isCompleted;

                            return (
                                <motion.div
                                    key={level.id}
                                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center transition-all duration-500 z-10 pointer-events-auto"
                                    style={{
                                        top: pos.y,
                                        transform: `translate(calc(-50% + ${pos.x}px), -50%)`,
                                        zIndex: 20 + i
                                    }}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                >
                                    <div
                                        className={clsx(
                                            "relative cursor-pointer transition-transform group animate-float",
                                            isCurrent && "animate-breath",
                                            !isUnlocked && "grayscale opacity-70"
                                        )}
                                        onTouchStart={() => { if (isUnlocked) audioSynth.playHover(); }}
                                        onClick={() => {
                                            if (isUnlocked) {
                                                audioSynth.playClick();
                                                onPlayLevel(level);
                                            }
                                        }}
                                    >
                                        {/* Avatar Ring */}
                                        <div className={clsx(
                                            "relative rounded-full overflow-hidden flex items-center justify-center bg-black transition-all duration-300",
                                            "w-16 h-16 md:w-24 md:h-24",
                                            isCurrent 
                                                ? "border-4 border-[#FFB347] ring-4 ring-[#FFB347]/30 shadow-[0_0_30px_rgba(255,179,71,0.8),0_10px_20px_rgba(0,0,0,0.8)]"
                                                : "border-transparent ring-2 ring-[#FFB347]/50 shadow-[0_5px_15px_rgba(0,0,0,0.6)]"
                                        )}>
                                            <img src={level.avatarUrl || '/assets/avatar_business.png'} alt={level.archetype} className="w-full h-full object-cover" />
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                                                    <Lock size={20} className="text-slate-400 opacity-80 md:w-6 md:h-6" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Glow under node */}
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-10 bg-black/50 blur-xl -z-10 rounded-full" />

                                        {/* Labels */}
                                        <div className={clsx(
                                            "absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-30 transition-all duration-300 transform flex flex-col items-center",
                                            "md:-bottom-14",
                                            isUnlocked ? "scale-100" : "scale-90"
                                        )}>
                                            {level.personality && (
                                                <div className={clsx(
                                                    "relative -mb-2 px-3 py-0.5 rounded-full border shadow-sm flex items-center justify-center z-40",
                                                    "md:-mb-3 md:px-4 md:py-1 md:border-2",
                                                    isUnlocked 
                                                        ? (isCurrent ? "bg-[#FFB347] border-[#fff0d4] text-[#4a2e00] shadow-[0_0_15px_rgba(255,179,71,0.6)]" : "bg-[rgba(15,10,5,0.8)] border-[#FFB347]/50 text-[#FFB347] backdrop-blur-md shadow-[0_0_10px_rgba(255,179,71,0.2)]")
                                                        : "bg-slate-900 border-slate-700 text-slate-500"
                                                )}>
                                                    <span className="text-[10px] md:text-sm font-black uppercase drop-shadow-sm tracking-widest">
                                                        {level.personality}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={clsx(
                                                "px-4 py-1 pt-3 pb-1 md:px-6 md:py-2 md:pt-4 md:pb-2 rounded-xl shadow-2xl flex items-center justify-center min-w-[100px] md:min-w-[140px]",
                                                isUnlocked
                                                    ? (isCurrent 
                                                        ? "bg-gradient-to-r from-[#FFB347] to-[#ff7b00] border-b-[3px] md:border-b-4 border-[#803d00]"
                                                        : "bg-[rgba(15,10,5,0.85)] backdrop-blur-md border border-[#FFB347]/40 shadow-[0_0_20px_rgba(0,0,0,0.8)]")
                                                    : "bg-slate-900/90 border-b-[3px] md:border-b-4 border-slate-950"
                                            )}>
                                                <span className={clsx(
                                                    "text-[10px] md:text-xs font-bold uppercase tracking-wider leading-none text-center",
                                                    isUnlocked 
                                                        ? (isCurrent ? "text-white drop-shadow-md" : "text-[#fff0d4] drop-shadow-[0_0_5px_rgba(255,179,71,0.5)]")
                                                        : "text-slate-500"
                                                )}>
                                                    {level.title}
                                                </span>
                                            </div>
                                        </div>

                                        {isCompleted && (
                                            <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 flex gap-1">
                                                {[1, 2, 3].map(s => (
                                                    <Star key={s} size={16} className="fill-[#FFB347] text-[#ffdd99] drop-shadow-[0_0_8px_rgba(255,179,71,0.8)] animate-bounce md:w-5 md:h-5" style={{ animationDelay: `${s * 100}ms` }} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div >
    );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
    const [newAge, setNewAge] = useState(18);
    const profile = useUserStore((state) => state.profile);
    const setProfile = useUserStore((state) => state.setProfile);
    const resetProgress = useUserStore((state) => state.resetProgress);

    const musicVolume = useUserStore((state) => state.musicVolume);
    const sfxVolume = useUserStore((state) => state.sfxVolume);
    const isMusicMuted = useUserStore((state) => state.isMusicMuted);
    const isSfxMuted = useUserStore((state) => state.isSfxMuted);
    const setMusicVolume = useUserStore((state) => state.setMusicVolume);
    const setSfxVolume = useUserStore((state) => state.setSfxVolume);
    const toggleMusicMute = useUserStore((state) => state.toggleMusicMute);
    const toggleSfxMute = useUserStore((state) => state.toggleSfxMute);

    useEffect(() => {
        if (profile?.age) setNewAge(profile.age);
    }, [profile]);

    const handleAgeSave = () => {
        if (profile) {
            setProfile({ ...profile, age: newAge });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#0a0510] border border-[#FFB347]/30 p-6 rounded-3xl max-w-sm w-full shadow-[0_0_50px_rgba(255,179,71,0.15)] relative">
                <h2 className="text-xl font-bold text-white mb-4 text-center tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</h2>
                <div className="space-y-6">
                    <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-[#FFB347]/70 uppercase tracking-widest">Music</span>
                                <button
                                    onClick={toggleMusicMute}
                                    className={clsx("p-1.5 rounded-lg transition-colors", isMusicMuted ? "text-red-400 bg-red-400/10" : "text-[#FFB347] bg-[#FFB347]/10")}
                                >
                                    {isMusicMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FFB347]"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-[#FFB347]/70 uppercase tracking-widest">Sound FX</span>
                                <button
                                    onClick={toggleSfxMute}
                                    className={clsx("p-1.5 rounded-lg transition-colors", isSfxMuted ? "text-red-400 bg-red-400/10" : "text-[#FFB347] bg-[#FFB347]/10")}
                                >
                                    {isSfxMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.1"
                                value={sfxVolume}
                                onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#FFB347]"
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                        <label className="block text-xs font-bold text-[#FFB347]/70 uppercase tracking-widest mb-2">Current Age</label>
                        <input
                            type="number"
                            value={newAge}
                            onChange={(e) => setNewAge(parseInt(e.target.value))}
                            className="w-full bg-[#05020a] text-white rounded-xl px-4 py-3 border border-[#FFB347]/20 font-mono focus:border-[#FFB347] outline-none transition-colors"
                        />
                    </div>
                    
                    <button onClick={handleAgeSave} className="w-full bg-gradient-to-r from-[#FFB347] to-[#ff7b00] text-[#1a0f00] font-black py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,179,71,0.3)] hover:shadow-[0_0_30px_rgba(255,179,71,0.5)] transform active:scale-95 transition-all tracking-wider text-sm uppercase">
                        UPDATE TIMELINE
                    </button>

                    <button
                        onClick={() => resetProgress()}
                        className="w-full bg-[#1a0a05] hover:bg-red-950/40 text-red-400/80 hover:text-red-400 border border-red-900/50 hover:border-red-500/50 font-bold py-3.5 rounded-xl transform active:scale-95 transition-all uppercase tracking-widest text-xs"
                    >
                        Reset Progress
                    </button>

                    <button onClick={onClose} className="w-full text-slate-500 text-xs font-bold tracking-widest py-2 hover:text-white transition-colors uppercase">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
