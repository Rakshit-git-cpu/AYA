import { useState, useEffect, useMemo } from 'react';
import { useUserStore } from '../../store/userStore';
import type { Level, Lesson } from '../../types/gameTypes';
import { STORY_DATABASE } from '../../data/scenarios';
import clsx from 'clsx';
import { ChevronRight, Star, AlertCircle, CheckCircle, Palette } from 'lucide-react';

// Floating Text Animation Interface
interface FloatText {
    id: number;
    text: string;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    type: 'positive' | 'negative' | 'neutral';
}

interface ScenarioGameProps {
    level: Level;
    onComplete: (stars: number) => void;
    onBack: () => void;
}

// Choice Interface
interface Choice {
    text: string;
    next: string;
    score: number; // 0-10
    feedbackTitle: string;
    feedback: string;
}

// Enhanced Scenario Data with Scoring
// TODO: Move this to a separate data file in the next step
// SCENARIO_DATA Removed - Using STORY_DATABASE from data/scenarios


export function ScenarioGame({ level, onComplete, onBack }: ScenarioGameProps) {
    const [currentFrameId, setCurrentFrameId] = useState('intro');

    // Typewriter State (Stateless Slice Logic)
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Scoring State
    const [score, setScore] = useState(0);
    // Feedback State
    const [feedbackChoice, setFeedbackChoice] = useState<Choice | null>(null);

    // Floating Text State
    const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);

    // Theme State (Global)
    const isCandyMode = useUserStore((state) => state.isCandyMode);
    const toggleCandyMode = useUserStore((state) => state.toggleCandyMode);
    const collectLesson = useUserStore((state) => state.collectLesson);
    const addXp = useUserStore((state) => state.addXp); // Global XP Action
    const updateTraits = useUserStore((state) => state.updateTraits);

    const handleLevelComplete = (stars: number) => {
        onComplete(stars);
    };

    // Use the global mode (renamed variable mapping for easier refactor)
    // Use the global mode (renamed variable mapping for easier refactor)
    const isCandyTheme = isCandyMode;

    const triggerFloatText = (text: string, type: FloatText['type']) => {
        const id = Date.now();
        const startX = 40 + Math.random() * 20; // 40% - 60%
        const startY = 50 + Math.random() * 10; // 50% - 60%

        setFloatTexts(prev => [...prev, { id, text, x: startX, y: startY, type }]);

        // Cleanup after animation
        setTimeout(() => {
            setFloatTexts(prev => prev.filter(ft => ft.id !== id));
        }, 1500);
    };

    // Load Scenario dynamically
    const scenario = STORY_DATABASE[level.scenarioId] || STORY_DATABASE['lvl_age_19'];
    const frame = scenario.frames.find((f: any) => f.id === currentFrameId) || scenario.frames[0];
    const isLearningScreen = currentFrameId.startsWith('LEARNING');

    // Preload all images for this scenario
    useEffect(() => {
        if (!scenario || !scenario.frames) return;
        const imagesToPreload = scenario.frames.map((f: any) => f.bg).filter(Boolean);
        if (level.avatarUrl) imagesToPreload.push(level.avatarUrl);

        // Use a Set to avoid preloading duplicates
        [...new Set(imagesToPreload)].forEach(url => {
            const img = new window.Image();
            img.src = url as string;
        });
    }, [scenario, level.avatarUrl]);

    // Randomize Choices (Memoized so they don't reshuffle on every render)
    // We shuffle a COPY of the array to avoid mutating the original data
    const displayedChoices = useMemo(() => {
        if (!frame.choices) return [];
        return [...frame.choices].sort(() => Math.random() - 0.5);
    }, [currentFrameId]); // Re-shuffle only when moving to a new frame

    // Determine what text to show
    const activeText = feedbackChoice ? feedbackChoice.feedback : frame.text;

    // Reset typewriter when text changes
    useEffect(() => {
        setDisplayedText("");
        setIsTyping(true);

        let i = 0;
        let timer: ReturnType<typeof setInterval>;

        // Small delay
        const startDelay = setTimeout(() => {
            timer = setInterval(() => {
                i++;
                if (i <= activeText.length) {
                    setDisplayedText(activeText.slice(0, i));
                } else {
                    setIsTyping(false);
                    clearInterval(timer);
                }
            }, 20); // Slightly faster typing
        }, 100);

        return () => {
            clearTimeout(startDelay);
            if (timer) clearInterval(timer);
        };
    }, [activeText]);

    const handleTextClick = () => {
        if (isTyping) {
            setDisplayedText(activeText);
            setIsTyping(false);
        }
    };

    const handleChoiceClick = (choice: Choice) => {
        // If "Try Again" or "Complete", generic handling
        if (choice.next === 'intro') {
            // RETRY LOGIC: Allow going back to intro without wiping score (preserves penalty)
            setCurrentFrameId(choice.next);
            return;
        }

        if (choice.next === 'COMPLETE') {
            // Calculate Stars based on accumulated score
            const starCount = score >= 20 ? 3 : score >= 10 ? 2 : 1;

            // Calculate Match Result for saving
            const userTraits = (useUserStore.getState().profile?.traits || {}) as Record<string, number>;
            const idolTraits = (level.idolTraits || {}) as Record<string, number>;
            let matchResult = undefined;

            if (level.idolTraits) {
                const traitKeys = Object.keys(userTraits);
                const totalDiff = traitKeys.reduce((acc, key) => acc + Math.abs((userTraits[key] || 50) - (idolTraits[key] || 50)), 0);
                const matchPercent = Math.max(0, Math.round(100 - (totalDiff / (traitKeys.length || 1))));

                // Identify dominant gap
                const gapTrait = traitKeys.length > 0 ? traitKeys.reduce((a, b) => {
                    const gapA = (idolTraits[a] || 50) - (userTraits[a] || 50);
                    const gapB = (idolTraits[b] || 50) - (userTraits[b] || 50);
                    return gapA > gapB ? a : b;
                }) : 'None';

                matchResult = {
                    matchPercentage: matchPercent,
                    gapAnalysis: `Growth Area: ${String(gapTrait)}`,
                    idolName: level.personality || level.archetype
                };
            }

            // Collect Lesson
            const lessonData: Lesson = {
                id: level.scenarioId,
                title: lessonKeyword,
                description: frame.text.replace(/^LESSON:\s*[A-Z]+\.\s*/, ''), // Strip "LESSON: KEYWORD. " prefix
                source: level.archetype, // e.g. "The Icon"
                age: level.age,
                date: new Date().toISOString(),
                matchResult: matchResult
            };
            collectLesson(lessonData);

            // Add Global XP
            addXp(score);

            // UPDATE TRAITS (Heuristic)
            if (score > 10) {
                updateTraits({
                    discipline: 2,
                    resilience: 2,
                    risk: 1
                });
            }

            handleLevelComplete(starCount);
            return;
        }

        // Check if there is feedback to show
        if (choice.feedback) {
            // Updated to handle negative scores (simple addition works since choice.score can be -10)
            setScore(prev => prev + choice.score);
            setFeedbackChoice(choice);

            // Trigger Floating Text
            if (choice.score > 0) {
                triggerFloatText(`+${choice.score} XP`, 'positive');
            } else if (choice.score < 0) {
                triggerFloatText(`${choice.score} XP`, 'negative');
            }
        } else {
            // No feedback (e.g. navigation only), just go
            setScore(prev => prev + choice.score);
            setCurrentFrameId(choice.next);
        }
    };

    const handleFeedbackContinue = () => {
        if (feedbackChoice) {
            setCurrentFrameId(feedbackChoice.next);
            setFeedbackChoice(null);
        }
    };

    // Extract Lesson Keyword dynamically
    // Now looks for the current frame if it is a learning screen, or falls back to searching
    const lessonFrame = isLearningScreen ? frame : scenario.frames.find((f: any) => f.id.startsWith('LEARNING'));
    const lessonKeyword = lessonFrame?.text.match(/LESSON:\s*([^.]+)/)?.[1]?.toUpperCase() || "LESSON";

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    key={frame.bg}
                    src={frame.bg}
                    alt="Scenario Scene"
                    className={clsx(
                        "w-full h-full transition-opacity duration-1000",
                        // Allow frames to specify object-contain to prevent avatar cropping, fallback to object-cover
                        frame.bgSize || "object-cover",
                        // Dynamic Object Position (defaults to top if not specified)
                        frame.bgPosition || "object-top",
                        isLearningScreen
                            ? "scale-110 blur-sm opacity-40 grayscale"
                            : isCandyTheme
                                ? "animate-ken-burns opacity-100 saturate-125" // Brighter, saturated
                                : "animate-ken-burns opacity-80"
                    )}
                />
                <div className={clsx(
                    "absolute inset-0 bg-gradient-to-t",
                    isCandyTheme
                        ? "from-pink-500/30 via-purple-500/10 to-transparent mix-blend-overlay" // Candy vibe
                        : "from-slate-950 via-slate-900/60 to-slate-900/30" // Original Dark vibe
                )} />
            </div>

            {/* Top Bar (Stats) */}
            <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center text-white/80">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-xs uppercase tracking-widest"
                >
                    <ChevronRight className="rotate-180 w-3 h-3" /> Exit
                </button>
                <div className="flex gap-4 items-center">
                    {/* Theme Toggle for Testing */}
                    <button
                        onClick={() => toggleCandyMode()}
                        className={clsx(
                            "p-2 rounded-full transition-all",
                            isCandyTheme ? "bg-pink-500 text-white shadow-lg" : "bg-black/40 text-white/50 hover:text-white"
                        )}
                        title="Toggle Candy Theme"
                    >
                        <Palette size={16} />
                    </button>

                    <div className={clsx(
                        "flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all shadow-xl",
                        isCandyTheme
                            ? "bg-white/90 border-yellow-400 text-yellow-900"
                            : "bg-slate-900/80 border-yellow-500/50 text-yellow-500"
                    )}>
                        <Star className={clsx("w-6 h-6", isCandyTheme ? "text-yellow-500 fill-yellow-500" : "fill-current")} />
                        <span className="text-2xl font-black">{score} XP</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full flex flex-col justify-end pb-6 items-center max-w-3xl px-6 transition-all duration-300">

                {/* LEARNING SCREEN HEADER */}
                {isLearningScreen && (
                    <div className="absolute top-[20%] text-center animate-slide-up-fade">
                        <div className="text-yellow-400 font-bold tracking-[0.5em] text-sm mb-4 uppercase">Key Takeaway</div>
                        <h1 className={clsx(
                            "text-5xl md:text-7xl font-black mb-2 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]",
                            isCandyTheme ? "text-white drop-shadow-[0_4px_0_#ec4899] text-stroke-2" : "text-white"
                        )}>
                            {lessonKeyword}
                        </h1>
                    </div>
                )}

                {/* Speaker Label */}
                {!isLearningScreen && (
                    <div className="self-start mb-[-12px] ml-4 relative z-20">
                        <div className={clsx(
                            "text-black font-extrabold uppercase tracking-wider text-sm px-6 py-2 rounded-t-2xl shadow-lg border-t-2 border-x-2",
                            feedbackChoice
                                ? feedbackChoice.score > 0 ? "bg-green-400 border-green-200" : "bg-red-400 border-red-200"
                                : "bg-yellow-400 border-yellow-200"
                        )}>
                            {feedbackChoice
                                ? feedbackChoice.feedbackTitle
                                : (frame.id === 'intro' ? 'Narrator' : 'You')}
                        </div>
                    </div>
                )}

                {/* Dialogue Box */}
                <div
                    className={clsx(
                        "w-full max-h-[80vh] overflow-y-auto custom-scrollbar backdrop-blur-xl rounded-3xl p-6 md:p-8 transform transition-all duration-300",
                        isCandyTheme
                            ? "bg-white/95 border-b-8 border-pink-400 shadow-[0_20px_50px_rgba(236,72,153,0.3)] text-slate-800"
                            : isLearningScreen
                                ? "bg-slate-900/80 border-2 border-yellow-500/30 shadow-2xl"
                                : "bg-slate-950/90 border-2 border-white/10 shadow-2xl rounded-tl-none"
                    )}
                    onClick={handleTextClick}
                >
                    <div className="min-h-[80px]">
                        <p className={clsx(
                            "leading-relaxed",
                            isLearningScreen
                                ? isCandyTheme
                                    ? "text-2xl md:text-3xl font-serif italic text-center leading-loose py-4 text-pink-900" // Candy Lesson
                                    : "text-2xl md:text-3xl font-serif italic text-center leading-loose py-4 text-yellow-100" // Standard Lesson
                                : isCandyTheme
                                    ? "text-xl md:text-2xl font-bold font-comic text-pink-900 drop-shadow-none"
                                    : "text-xl md:text-2xl font-comic text-white drop-shadow-md"
                        )}>
                            {displayedText}
                            {isTyping && <span className={clsx("inline-block w-2 h-6 ml-1 animate-cursor-blink align-middle", isCandyTheme ? "bg-pink-500" : "bg-yellow-400")} />}
                        </p>
                    </div>

                    {!isTyping && !feedbackChoice && (
                        <div className="mt-8 flex flex-col gap-3 animate-fade-in">
                            {displayedChoices.map((choice, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleChoiceClick(choice as Choice)}
                                    className={clsx(
                                        "group w-full text-left p-5 rounded-xl transition-all flex items-center justify-between",
                                        isCandyTheme
                                            ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold border-b-4 border-teal-700 hover:translate-y-1 hover:border-b-0 active:scale-95 shadow-lg"
                                            : "border border-white/10 hover:border-yellow-400 bg-white/5 hover:bg-white/15"
                                    )}
                                >
                                    <span className={clsx("font-medium text-lg transition-colors", isCandyTheme ? "text-white drop-shadow-md" : "text-white/90 group-hover:text-yellow-300")}>
                                        {choice.text}
                                    </span>
                                    {!isLearningScreen && <ChevronRight className={clsx("group-hover:translate-x-1 transition-transform", isCandyTheme ? "text-white" : "text-white/30 group-hover:text-yellow-400")} />}
                                </button>
                            ))}
                        </div>
                    )}

                    {feedbackChoice && (
                        <div className="mt-4 animate-fade-in flex justify-end">
                            <button
                                onClick={handleFeedbackContinue}
                                className="px-8 py-3 rounded-full bg-white text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                Continue <ChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Text Overlay */}
            {floatTexts.map(ft => (
                <div
                    key={ft.id}
                    className={clsx(
                        "absolute z-50 font-black text-2xl px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 border-2 animate-float-score",
                        // Candy Theme: Vibrant gradients with white borders
                        isCandyTheme
                            ? (ft.type === 'positive'
                                ? "bg-gradient-to-r from-emerald-400 to-green-500 border-white text-white rotate-[-3deg]"
                                : "bg-gradient-to-r from-red-500 to-rose-600 border-white text-white rotate-[3deg]")
                            // Dark Theme: Neon gradients with glow
                            : (ft.type === 'positive'
                                ? "bg-black/60 border-green-400 text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]"
                                : "bg-black/60 border-red-500 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]")
                    )}
                    style={{ left: `${ft.x}%`, top: `${ft.y}%` }}
                >
                    {ft.type === 'positive' ? <CheckCircle className="w-6 h-6 stroke-[3]" /> : <AlertCircle className="w-6 h-6 stroke-[3]" />}
                    {ft.text}
                </div>
            ))}
        </div>
    );
}
