import { useState, useEffect, useMemo, useRef } from 'react';
import { useUserStore } from '../../store/userStore';
import type { Level, Lesson } from '../../types/gameTypes';
import { STORY_DATABASE } from '../../data/scenarios';
import clsx from 'clsx';
import { ChevronRight, Star, AlertCircle, CheckCircle, Palette, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { IDOL_PROFILES } from '../../data/idolMindsets';

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

// Session Choice Tracker Data
interface SessionChoiceData {
    question: string;
    chosen_option: string;
    time_taken_seconds: number;
    trait_impacts: {
        risk_taker: number;
        creative: number;
        analytical: number;
        social: number;
        ambitious: number;
    };
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
    // Ref mirror tracks session choices — avoids React stale closure when reading at COMPLETE time
    const sessionChoicesRef = useRef<SessionChoiceData[]>([]);
    const [sessionChoices, setSessionChoices] = useState<SessionChoiceData[]>([]);
    const addChoiceToSession = (c: SessionChoiceData) => {
        sessionChoicesRef.current = [...sessionChoicesRef.current, c];
        setSessionChoices(sessionChoicesRef.current);
    };
    // Feedback State
    const [feedbackChoice, setFeedbackChoice] = useState<Choice | null>(null);

    // Background Loading State (prevents UI from showing until image is ready)
    const [isBgLoaded, setIsBgLoaded] = useState(false);

    // Floating Text State
    const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);

    // Theme State (Global)
    const isCandyMode = useUserStore((state) => state.isCandyMode);
    
    // Timing State for Source 3 Matching
    const [frameStartTime, setFrameStartTime] = useState<number>(Date.now());
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

    // Reset bg loaded state when background changes
    useEffect(() => {
        setIsBgLoaded(false);
    }, [frame.bg]);

    // Reset typewriter when text changes
    useEffect(() => {
        // Do not start typing until the background image finishes loading
        if (!isBgLoaded) return;

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
                    setFrameStartTime(Date.now()); // Restart timer once question is readable
                    clearInterval(timer);
                }
            }, 20); // Slightly faster typing
        }, 100);

        return () => {
            clearTimeout(startDelay);
            if (timer) clearInterval(timer);
        };
    }, [activeText, isBgLoaded]);

    const handleTextClick = () => {
        if (isTyping) {
            setDisplayedText(activeText);
            setIsTyping(false);
            setFrameStartTime(Date.now()); // Question is readable, start timer now
        }
    };

    // Semantic Keyword Engine (Match Source 2)
    const calculateTraitImpacts = (text: string, baseScore: number) => {
        const impacts = { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 };
        const lowerText = text.toLowerCase();
        
        if (lowerText.match(/risk|bold|dare|attack|fearless|leap/)) impacts.risk_taker += 5;
        if (lowerText.match(/safe|defend|wait|hide|careful/)) impacts.risk_taker -= 5;
        
        if (lowerText.match(/creative|art|imagine|different|new|silly/)) impacts.creative += 5;
        if (lowerText.match(/routine|normal|rules|boring/)) impacts.creative -= 5;
        
        if (lowerText.match(/logic|study|plan|focus|read|strategy/)) impacts.analytical += 5;
        if (lowerText.match(/impulse|rush|distraction|anger/)) impacts.analytical -= 5;
        
        if (lowerText.match(/team|help|people|listen|talk|friend/)) impacts.social += 5;
        if (lowerText.match(/alone|ignore|selfish/)) impacts.social -= 5;
        
        if (lowerText.match(/goal|lead|win|push|success/)) impacts.ambitious += 5;
        if (lowerText.match(/quit|give up|stop|fail/)) impacts.ambitious -= 5;

        // Apply intensity scaling based on choice baseline score
        if (Object.values(impacts).every(v => v === 0)) {
           if (baseScore > 0) impacts.ambitious += Math.min(baseScore, 5); 
        } else {
           const sign = baseScore >= 0 ? 1 : -1;
           const magnitude = Math.abs(baseScore);
           for (const key in impacts) {
               if (impacts[key as keyof typeof impacts] !== 0) {
                  impacts[key as keyof typeof impacts] += (sign * Math.floor(magnitude / 2));
               }
           }
        }
        return impacts;
    };

    const handleChoiceClick = async (choice: Choice) => {
        // DEBUG: Fires immediately on EVERY choice tap — confirms new code is running
        console.log('[AYA DEBUG] handleChoiceClick fired! choice.text =', choice.text, '| choice.next =', choice.next);

        const timeTakenSeconds = Math.max(1, Math.round((Date.now() - frameStartTime) / 1000));
        
        const rawImpacts = calculateTraitImpacts(choice.text, choice.score);
        const adjustedImpacts = { ...rawImpacts };
        
        // Speed Adjustment Source 3 (20% Weight impact logic translated to point modifiers)
        for (const key in adjustedImpacts) {
            if (adjustedImpacts[key as keyof typeof adjustedImpacts] > 0) {
                 if (timeTakenSeconds <= 5) adjustedImpacts[key as keyof typeof adjustedImpacts] += 2; // High Confidence
                 if (timeTakenSeconds >= 15) adjustedImpacts[key as keyof typeof adjustedImpacts] -= 2; // Uncertainty
            }
        }
        
        const choiceData: SessionChoiceData = {
           question: displayedText,
           chosen_option: choice.text,
           time_taken_seconds: timeTakenSeconds,
           trait_impacts: adjustedImpacts
        };

        // DEBUG: Full payload for each choice
        console.log('[AYA DEBUG] choiceData built:', JSON.stringify(choiceData, null, 2));

        if (choice.next !== 'intro' && choice.next !== 'COMPLETE') {
             addChoiceToSession(choiceData);
        }

        // If "Try Again" or "Complete", generic handling
        if (choice.next === 'intro') {
            // RETRY LOGIC: Allow going back to intro without wiping score (preserves penalty)
            setCurrentFrameId(choice.next);
            return;
        }

        if (choice.next === 'COMPLETE') {
            // Use the ref to get the definitive up-to-date list (avoids React stale closure)
            const finalSessionChoices = [...sessionChoicesRef.current, choiceData];

            // Fetch Base Profile (Source 1 - 40%)
            const userProfile = useUserStore.getState().profile;
            const quizTraits = userProfile?.traits || { risk: 50, creativity: 50, vision: 50, empathy: 50, leadership: 50 };
            
            // Aggregate Game Choices (Source 2 & 3)
            let scenarioAccumulator = { risk: 0, creativity: 0, analytical: 0, social: 0, ambitious: 0 };
            finalSessionChoices.forEach(c => {
                scenarioAccumulator.risk += c.trait_impacts.risk_taker;
                scenarioAccumulator.creativity += c.trait_impacts.creative;
                scenarioAccumulator.analytical += c.trait_impacts.analytical;
                scenarioAccumulator.social += c.trait_impacts.social;
                scenarioAccumulator.ambitious += c.trait_impacts.ambitious;
            });

            // Calculate Combined Traits
            const safeClamp = (val: number) => Math.max(0, Math.min(100, Math.round(val)));
            const recalibratedTraits = {
                risk: safeClamp((quizTraits.risk * 0.4) + ((50 + scenarioAccumulator.risk) * 0.6)),
                creativity: safeClamp((quizTraits.creativity * 0.4) + ((50 + scenarioAccumulator.creativity) * 0.6)),
                vision: safeClamp((quizTraits.vision * 0.4) + ((50 + scenarioAccumulator.analytical) * 0.6)), // analytical = vision
                empathy: safeClamp((quizTraits.empathy * 0.4) + ((50 + scenarioAccumulator.social) * 0.6)), // social = empathy
                leadership: safeClamp((quizTraits.leadership * 0.4) + ((50 + scenarioAccumulator.ambitious) * 0.6)) // ambitious = leadership
            };

            // Calculate Match Result against IDOL_PROFILES
            const idolName = level.personality || level.archetype || "Default";
            const idolTraits = IDOL_PROFILES[idolName] || IDOL_PROFILES["Default"];
            
            const totalDiff = 
                Math.abs(recalibratedTraits.risk - idolTraits.risk) +
                Math.abs(recalibratedTraits.creativity - idolTraits.creativity) +
                Math.abs(recalibratedTraits.vision - idolTraits.analytical) +
                Math.abs(recalibratedTraits.empathy - idolTraits.social) +
                Math.abs(recalibratedTraits.leadership - idolTraits.ambitious);
                
            const matchPercent = Math.max(0, Math.round(100 - (totalDiff / 5)));

            // Identify dominant gap
            const userTraitMap: any = { risk: recalibratedTraits.risk, creative: recalibratedTraits.creativity, analytical: recalibratedTraits.vision, social: recalibratedTraits.empathy, ambitious: recalibratedTraits.leadership };
            const gapTrait = Object.keys(idolTraits).reduce((a, b) => {
                const gapA = idolTraits[a] - userTraitMap[a];
                const gapB = idolTraits[b] - userTraitMap[b];
                return gapA > gapB ? a : b;
            });

            const matchResult = {
                matchPercentage: matchPercent,
                gapAnalysis: `Growth Area: ${gapTrait}`,
                idolName: idolName
            };
            
            const starCount = score >= 20 ? 3 : score >= 10 ? 2 : 1;

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

            // Supabase Tracking
            if (userProfile?.id) {
                try {
                    // Update the user's base personality profile with the new recalibrated traits
                    await supabase.from('personality_profiles')
                        .update({
                            trait_risk_taker: recalibratedTraits.risk,
                            trait_creative: recalibratedTraits.creativity,
                            trait_analytical: recalibratedTraits.vision,
                            trait_social: recalibratedTraits.empathy,
                            trait_ambitious: recalibratedTraits.leadership,
                            last_updated: new Date().toISOString()
                        })
                        .eq('user_id', userProfile.id);

                    // Safely serialize for Supabase JSONB — ensures no TypeScript fields are silently dropped
                    const serializedChoices = JSON.parse(JSON.stringify(finalSessionChoices)) as SessionChoiceData[];

                    // DEBUG: Log exact payload going into Supabase
                    console.log('[AYA] Saving game_sessions — scenario_choices payload:');
                    console.log(JSON.stringify(serializedChoices, null, 2));
                    console.log('[AYA] Total choices:', serializedChoices.length);

                    // Insert the detailed session records
                    await supabase.from('game_sessions').insert([{
                        user_id: userProfile.id,
                        selected_personality: level.personality || level.archetype,
                        scenario_choices: serializedChoices,
                        match_score: matchPercent
                    }]);
                } catch (err) {
                    console.error("Failed to save session to Supabase", err);
                }
            }

            // Add Global XP
            addXp(score);

            // UPDATE TRAITS globally
            updateTraits({
                risk: recalibratedTraits.risk - quizTraits.risk,
                creativity: recalibratedTraits.creativity - quizTraits.creativity,
                vision: recalibratedTraits.vision - quizTraits.vision,
                empathy: recalibratedTraits.empathy - quizTraits.empathy,
                leadership: recalibratedTraits.leadership - quizTraits.leadership
            });

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
                    onLoad={() => setIsBgLoaded(true)}
                    className={clsx(
                        "w-full h-full transition-opacity duration-1000",
                        !isBgLoaded ? "opacity-0" : "opacity-100",
                        // Allow frames to specify object-contain to prevent avatar cropping, fallback to object-cover
                        frame.bgSize || "object-cover",
                        // Dynamic Object Position (defaults to center if not specified to prevent cropping subjects)
                        frame.bgPosition || "object-center",
                        isLearningScreen
                            ? "scale-110 blur-sm opacity-40 grayscale"
                            : isCandyTheme
                                ? "animate-ken-burns saturate-125" // Brighter, saturated
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

            {!isBgLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                    <span className="text-yellow-500/80 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Loading Scene
                    </span>
                </div>
            )}

            {/* Top Bar (Stats) */}
            <div className={clsx(
                "absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center text-white/80 transition-opacity duration-500",
                isBgLoaded ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
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
            <div className={clsx(
                "relative z-10 w-full h-[100dvh] flex flex-col pb-6 items-center max-w-3xl px-6 transition-opacity duration-700",
                isBgLoaded ? "opacity-100 delay-300" : "opacity-0 pointer-events-none"
            )}>

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

                {/* --- BOTTOM ALIGNED CONTENT --- */}
                <div className="w-full flex flex-col mt-auto items-center min-h-0">
                    {/* Speaker Label */}
                    {!isLearningScreen && (
                        <div className="self-start mb-[-12px] ml-4 relative z-20 shrink-0">
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
                            "w-full max-h-[75dvh] overflow-y-auto overscroll-contain touch-pan-y custom-scrollbar backdrop-blur-xl rounded-3xl p-6 md:p-8 transform transition-all duration-300",
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
