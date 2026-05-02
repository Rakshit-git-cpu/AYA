import { useState, useEffect, useMemo, useRef } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';
import { detectEmotion, EMOTION_THEMES } from '../../utils/storyEmotion';
import type { EmotionTheme } from '../../utils/storyEmotion';
import { bgmManager } from '../../utils/bgmManager';
import type { Level, Lesson } from '../../types/gameTypes';
import { STORY_DATABASE } from '../../data/scenarios';
import clsx from 'clsx';
import { ChevronRight, Star, AlertCircle, CheckCircle, Palette, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { IDOL_PROFILES } from '../../data/idolMindsets';
import { calculateLevelInfo } from '../../utils/levelSystem';
import { calculateLifeTraits, matchFutureArchetype } from '../../utils/futureSelfMatch';

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
    onDailyChallengeComplete?: (streakData: { xpEarned: number, oldStreak: number, newStreak: number, isMilestone: boolean }) => void;
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


export function ScenarioGame({ level, onComplete, onBack, onDailyChallengeComplete }: ScenarioGameProps) {
    // DEBUG: Confirms this component is the active one (check console on game load)
    console.log('[AYA DEBUG] ScenarioGame mounted for level:', level?.id, level?.personality);
    // BUILD MARKER: If this timestamp matches deployment time, the new code is live
    console.log('[AYA BUILD_MARKER] deployed 2026-04-04T15:50 IST — if you see this, prod is serving the latest code');

    const [currentFrameId, setCurrentFrameId] = useState('intro');

    // Typewriter State (Stateless Slice Logic)
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    // Scoring State
    const [score, setScore] = useState(0);
    // Ref tracks session choices — avoids React stale closure when reading at COMPLETE time
    const sessionChoicesRef = useRef<SessionChoiceData[]>([]);
    const hasInsertedSession = useRef(false);
    const addChoiceToSession = (c: SessionChoiceData) => {
        sessionChoicesRef.current = [...sessionChoicesRef.current, c];
    };
    // Feedback State
    const [feedbackChoice, setFeedbackChoice] = useState<Choice | null>(null);

    // Double-tap guard for story choice buttons
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    // Background Loading State (prevents UI from showing until image is ready)
    const [isBgLoaded, setIsBgLoaded] = useState(false);

    // Floating Text State
    const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);

    // Emotion / Cinematic Theme State
    const [currentTheme, setCurrentTheme] = useState<EmotionTheme>(EMOTION_THEMES['calm']);
    const [bgmEnabled, setBgmEnabled] = useState<boolean>(true);
    const [typeSoundEnabled, setTypeSoundEnabled] = useState<boolean>(true);
    // Ref for text scroll container — allows auto-scroll-to-top on frame change
    const textContainerRef = useRef<HTMLDivElement>(null);

    // Theme State (Global)
    const isCandyMode = useUserStore((state) => state.isCandyMode);
    
    // Timing State for Source 3 Matching
    const [frameStartTime, setFrameStartTime] = useState<number>(Date.now());
    const toggleCandyMode = useUserStore((state) => state.toggleCandyMode);
    const collectLesson = useUserStore((state) => state.collectLesson);
    const updateTraits = useUserStore((state) => state.updateTraits);
    const addSessionProgression = useUserStore((state) => state.addSessionProgression);
    const updateXpLocally = useUserStore((state) => state.updateXpLocally);
    const completeDailyChallenge = useUserStore((state) => state.completeDailyChallenge);
    const levelScores = useUserStore((state) => state.levelScores);

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

    // Load preferences from localStorage on mount
    useEffect(() => {
        if (localStorage.getItem('aya_bgm') === 'false') {
            setBgmEnabled(false);
        }
        if (localStorage.getItem('aya_typewriter_sound') === 'false') {
            setTypeSoundEnabled(false);
        }
    }, []);

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

    // Determine what text to show — on lesson screen show only the body (not the full LESSON: prefix)
    // lessonBody is computed near the return statement where lessonFrame is available.
    // On learning screens activeText is overridden just before typewriter useEffect via a ref trick,
    // but the simplest correct approach: compute a stable activeText from frame.text and let the
    // lesson card render lessonBody directly (not via displayedText).
    const activeText = feedbackChoice ? feedbackChoice.feedback : frame.text;

    // Reset bg loaded state when background changes
    useEffect(() => {
        setIsBgLoaded(false);
    }, [frame.bg]);

    // Emotion detection + ambient music when frame changes
    useEffect(() => {
        const textToAnalyse = frame.emotion
            ? (frame.emotion as string)  // explicit override in story data: use emotion string directly
            : frame.text;
        
        const badgeLabel = feedbackChoice ? feedbackChoice.feedbackTitle : (frame.id === 'intro' ? 'Narrator' : 'You');
        
        // If frame has an explicit emotion field matching a theme key, use it directly
        const emotion = (frame.emotion && EMOTION_THEMES[frame.emotion as keyof typeof EMOTION_THEMES])
            ? frame.emotion as keyof typeof EMOTION_THEMES
            : detectEmotion(textToAnalyse, badgeLabel);
        
        const theme = EMOTION_THEMES[emotion];
        setCurrentTheme(theme);

        // Play matching ambient music — unlock listener in bgmManager handles autoplay policy
        bgmManager.play(theme.emotion);

        // Scroll text container back to top on every new frame
        textContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

        return () => {
            // Don't fade out on every frame change — let crossfade handle it
        };
    }, [currentFrameId, feedbackChoice]);

    // Stop music when component unmounts (user exits story)
    useEffect(() => {
        return () => {
            bgmManager.stop(1.5);
        };
    }, []);

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
    const NAVIGATION_CHOICES = ['next chapter', 'finish chapter', 'collect reward', 'complete level'];

    const calculateTraitImpacts = (text: string, baseScore: number) => {
        const impacts = { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 };
        const lowerText = text.toLowerCase();

        // Skip navigation-only choices entirely
        if (NAVIGATION_CHOICES.some(nav => lowerText === nav)) return impacts;
        
        // RISK_TAKER: bold action vs playing safe
        if (lowerText.match(/risk|bold|dare|attack|fearless|leap|jump|escape|rebel|defy|unconventional|break|secret|unauthorized|sneak|confront|charge|storm|aggressive|reckless|challenge|disobey|steal|fight|resist/)) impacts.risk_taker += 5;
        if (lowerText.match(/safe|defend|wait|hide|careful|cautious|protect|avoid|retreat|comply|obey|follow orders|stay quiet|keep your head down|play it safe/)) impacts.risk_taker -= 5;
        
        // CREATIVE: artistic expression vs routine
        if (lowerText.match(/creative|art|write|create|design|story|direct|imagine|build|invent|theatre|music|draw|film|paint|compose|dream|vision|original|unique|style|craft|sculpt|improvise|experiment|innovate/)) impacts.creative += 5;
        if (lowerText.match(/routine|normal|boring|copy|standard|conventional|mundane|repetitive|textbook/)) impacts.creative -= 5;
        
        // ANALYTICAL: thinking and strategy vs impulsive
        if (lowerText.match(/study|plan|research|logic|strategy|analyse|analyze|calculate|think|review|audit|observe|focus|read|data|methodical|systematic|examine|investigate|evaluate|assess|reason|evidence|proof|pattern|prepare/)) impacts.analytical += 5;
        if (lowerText.match(/impulse|rush|distraction|anger|panic|emotional|rash|hasty|gut feeling|wing it|blindly/)) impacts.analytical -= 5;
        
        // SOCIAL: connection vs isolation
        if (lowerText.match(/team|people|friend|connect|talk|listen|coach|mentor|network|collaborate|meet|help|support|community|share|together|unite|gather|recruit|ally|partner|trust|confide|ask|empathy|compassion|kindness/)) impacts.social += 5;
        if (lowerText.match(/alone|ignore|selfish|isolate|solo|abandon|betray|ghost|silent treatment|cold shoulder|dismiss/)) impacts.social -= 5;
        
        // AMBITIOUS: drive and ambition vs giving up
        if (lowerText.match(/name|director|goal|success|win|achieve|top|lead|claim|own|declare|door|office|contract|opportunity|power|dominate|climb|prove|demand|ambition|hustle|grind|first|best|conquer|pitch|negotiate|promote|champion|throne|empire/)) impacts.ambitious += 5;
        if (lowerText.match(/quit|give up|stop|fail|surrender|settle|accept defeat|step down|walk away|resign|mediocre/)) impacts.ambitious -= 5;

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
        audioSynth.playClick();
        // DEBUG: Fires immediately on EVERY choice tap — confirms new code is running
        console.log('[AYA DEBUG] handleChoiceClick fired! choice.text =', choice.text, '| choice.next =', choice.next);

        // Skip trait calculation for navigation-only choices
        const isNavChoice = NAVIGATION_CHOICES.some(nav => choice.text.toLowerCase() === nav);

        const timeTakenSeconds = Math.max(1, Math.round((Date.now() - frameStartTime) / 1000));
        
        const rawImpacts = isNavChoice
            ? { risk_taker: 0, creative: 0, analytical: 0, social: 0, ambitious: 0 }
            : calculateTraitImpacts(choice.text, choice.score);
        const adjustedImpacts = { ...rawImpacts };
        
        // Speed Adjustment Source 3 (20% Weight impact logic translated to point modifiers)
        if (!isNavChoice) {
            for (const key in adjustedImpacts) {
                if (adjustedImpacts[key as keyof typeof adjustedImpacts] > 0) {
                     if (timeTakenSeconds <= 5) adjustedImpacts[key as keyof typeof adjustedImpacts] += 2; // High Confidence
                     if (timeTakenSeconds >= 15) adjustedImpacts[key as keyof typeof adjustedImpacts] -= 2; // Uncertainty
                }
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
            // DEBUG: This fires even if user has no ID — confirms COMPLETE branch was reached
            console.log('[AYA DEBUG] COMPLETE branch reached. userProfile.id =', userProfile?.id, '| finalSessionChoices.length =', finalSessionChoices.length);

            // Calculate XP progression mathematically
            const isFirstTime = !levelScores[level.id];
            let sessionTotalXp = score; // Base accumulated from choices
            
            sessionTotalXp += 50; // Base node finish
            if (matchPercent > 80) sessionTotalXp += 20; // High alignment bonus
            if (isFirstTime) sessionTotalXp += 30; // First time run

            sessionTotalXp = Math.max(20, sessionTotalXp); // Safety Floor

            const currentTotalXp = userProfile?.total_xp || 0;
            const currentStories = userProfile?.stories_completed || 0;
            const newTotalXp = currentTotalXp + sessionTotalXp;
            const newLevelInfo = calculateLevelInfo(newTotalXp);

            // ── Future Self calculation ────────────────────────────────────
            const currentStreak = userProfile?.current_streak || 0;
            const futureLT = calculateLifeTraits(
                {
                    risk: recalibratedTraits.risk,
                    creativity: recalibratedTraits.creativity,
                    vision: recalibratedTraits.vision,
                    empathy: recalibratedTraits.empathy,
                    leadership: recalibratedTraits.leadership,
                    discipline: recalibratedTraits.vision, // proxy
                    resilience: recalibratedTraits.risk,   // proxy
                },
                currentStreak
            );
            const futureMatchResult = matchFutureArchetype(futureLT);

            // Patch local Zustand profile with future self data
            const setProfile = useUserStore.getState().setProfile;
            const latestProfile = useUserStore.getState().profile;
            if (latestProfile) {
                setProfile({
                    ...latestProfile,
                    futureArchetype: futureMatchResult.archetype.name,
                    futureArchetypeScore: futureMatchResult.score,
                    lifeTraits: futureLT,
                });
            }

            if (userProfile?.id && !hasInsertedSession.current) {
                // Guard: prevent duplicate inserts from StrictMode double-renders or rapid re-triggers
                hasInsertedSession.current = true;
                try {
                    // Update the user's base personality profile with the new recalibrated traits
                    await supabase.from('personality_profiles')
                        .update({
                            trait_risk_taker: recalibratedTraits.risk,
                            trait_creative: recalibratedTraits.creativity,
                            trait_analytical: recalibratedTraits.vision,
                            trait_social: recalibratedTraits.empathy,
                            trait_ambitious: recalibratedTraits.leadership,
                            total_xp: newTotalXp,
                            level: newLevelInfo.level,
                            stories_completed: currentStories + 1,
                            last_updated: new Date().toISOString(),
                            // Future Self columns
                            future_archetype: futureMatchResult.archetype.name,
                            future_archetype_score: futureMatchResult.score,
                            life_resilience: futureLT.resilience,
                            life_discipline: futureLT.discipline,
                            life_courage: futureLT.courage,
                            life_creativity: futureLT.creativity,
                            life_emotional_control: futureLT.emotional_control,
                            life_leadership: futureLT.leadership,
                            life_risk_intelligence: futureLT.risk_intelligence,
                            life_consistency: futureLT.consistency,
                        })
                        .eq('user_id', userProfile.id);

                    // Daily Challenge Update to users table
                    // We also run the local `completeDailyChallenge()` right after this to track locally and get results
                    const streakResult = completeDailyChallenge();
                    
                    if (streakResult && streakResult.newStreak > streakResult.oldStreak) {
                        try {
                            await supabase.from('users').update({
                                current_streak: streakResult.newStreak,
                                longest_streak: Math.max(userProfile.longest_streak || 0, streakResult.newStreak),
                                last_active_date: new Date().toISOString().split('T')[0],
                                daily_challenge_completed: true
                            }).eq('id', userProfile.id);
                        } catch (e) {
                            console.error("Streak save error", e);
                        }
                        
                        if (onDailyChallengeComplete) {
                            onDailyChallengeComplete(streakResult);
                        }
                    }

                    // Safely serialize for Supabase JSONB — ensures no TypeScript fields are silently dropped
                    const serializedChoices = JSON.parse(JSON.stringify(finalSessionChoices)) as SessionChoiceData[];

                    // DEBUG: Log exact payload going into Supabase
                    console.log('[AYA] Saving game_sessions — scenario_choices payload:');
                    console.log(JSON.stringify(serializedChoices, null, 2));
                    console.log('[AYA] Total choices:', serializedChoices.length);
                    console.log('[AYA] First choice sample:', serializedChoices[0]);

                    // Insert the detailed session records
                    const { data: insertData, error: insertError } = await supabase.from('game_sessions').insert([{
                        user_id: userProfile.id,
                        selected_personality: level.personality || level.archetype,
                        scenario_choices: serializedChoices,
                        match_score: matchPercent
                    }]).select();

                    // DEBUG: Log the Supabase response
                    if (insertError) {
                        console.error('[AYA] Supabase INSERT ERROR:', insertError);
                    } else {
                        console.log('[AYA] Supabase INSERT SUCCESS:', insertData);
                    }
                } catch (err) {
                    hasInsertedSession.current = false; // Reset on failure so user can retry
                    console.error("[AYA] Failed to save session to Supabase", err);
                }
            } else if (hasInsertedSession.current) {
                console.log('[AYA] Skipping duplicate game_sessions insert — already saved this session');
            }

            // Play local state pushes
            // Pass 0 as XP since we've been updating real-time via updateXpLocally
            addSessionProgression(0);

            // UPDATE TRAITS globally
            updateTraits({
                risk: recalibratedTraits.risk - quizTraits.risk,
                creativity: recalibratedTraits.creativity - quizTraits.creativity,
                vision: recalibratedTraits.vision - quizTraits.vision,
                empathy: recalibratedTraits.empathy - quizTraits.empathy,
                leadership: recalibratedTraits.leadership - quizTraits.leadership
            });

            // Float the XP events visually before demounting the view!
            triggerFloatText(`+50 XP`, 'positive');
            
            let delayMs = 1200;
            if (matchPercent > 80) {
                setTimeout(() => triggerFloatText(`+20 XP (Outstanding)`, 'positive'), 800);
                delayMs += 800;
            }
            if (isFirstTime) {
                setTimeout(() => triggerFloatText(`+30 XP (First Run)`, 'positive'), 1600);
                delayMs += 800;
            }

            console.log('[AYA DEBUG] All done, calling handleLevelComplete with stars:', starCount, 'and session XP:', sessionTotalXp);
            
            // Queue transition out allowing particles to run
            setTimeout(() => {
                bgmManager.stop(1);
                handleLevelComplete(starCount);
            }, delayMs);
            return;
        }

        // Check if there is feedback to show
        if (choice.feedback) {
            // Updated to handle negative scores (simple addition works since choice.score can be -10)
            setScore(prev => prev + choice.score);
            updateXpLocally(choice.score); // Sync with global header in real-time
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
            updateXpLocally(choice.score); // Sync with global header in real-time
            setCurrentFrameId(choice.next);
        }
    };

    const handleFeedbackContinue = () => {
        if (feedbackChoice) {
            setSelectedOption(null); // Re-enable choices on next frame
            setCurrentFrameId(feedbackChoice.next);
            setFeedbackChoice(null);
        }
    };

    // Extract Lesson Title and Body separately from the LESSON: field
    // Data format: "LESSON: KEYWORD. Body text here."
    const lessonFrame = isLearningScreen ? frame : scenario.frames.find((f: any) => f.id.startsWith('LEARNING') || f.id === 'lesson');
    const lessonRawText: string = lessonFrame?.text || '';
    // Title: the word(s) after "LESSON:" and before the first full stop
    const lessonKeyword = lessonRawText.match(/LESSON:\s*([^.]+)/i)?.[1]?.trim().toUpperCase() || 'LESSON';
    // Body: everything after "LESSON: KEYWORD." — strip the prefix
    const lessonBody = lessonRawText.replace(/^LESSON:\s*[^.]+\.\s*/i, '').trim() || lessonRawText;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans cinematic-container"
            style={{
                backgroundColor: isCandyMode ? '#0f172a' : '#000',
            }}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    key={frame.bg}
                    src={frame.bg}
                    alt="Scenario Scene"
                    onLoad={() => setIsBgLoaded(true)}
                    onError={() => setIsBgLoaded(true)}
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

                {/* Emotion vignette overlay */}
                {!isCandyMode && (
                    <div
                        className="cinematic-vignette absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at center, transparent 40%, ${currentTheme.vignette} 100%)`,
                        }}
                    />
                )}
            </div>

            {!isBgLoaded && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
                    <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                    <span className="text-yellow-500/80 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Loading Scene
                    </span>
                </div>
            )}

            {/* Sound Controls — Top Right Corner */}
            <div className="fixed top-4 right-4 z-50 flex gap-2">
                {/* BGM toggle */}
                <button
                    onClick={() => {
                        bgmManager.toggle();
                        const nowEnabled = bgmManager.enabled;
                        setBgmEnabled(nowEnabled);
                        localStorage.setItem('aya_bgm', nowEnabled.toString());
                    }}
                    className="cinematic-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 text-base shadow-lg"
                    style={{ borderColor: `${currentTheme.badgeColor}80` }}
                    title="Background Music"
                >
                    {bgmEnabled ? '🎵' : '🔇'}
                </button>

                {/* Typewriter sound toggle */}
                <button
                    onClick={() => {
                        const next = !typeSoundEnabled;
                        setTypeSoundEnabled(next);
                        localStorage.setItem('aya_typewriter_sound', next.toString());
                    }}
                    className="cinematic-toggle flex items-center justify-center w-10 h-10 rounded-full border border-white/15 hover:bg-white/10 text-base shadow-lg"
                    style={{ borderColor: `${currentTheme.badgeColor}80` }}
                    title="Typewriter Sound"
                >
                    {typeSoundEnabled ? '⌨️' : '🔕'}
                </button>
            </div>

            {/* Top Bar (Stats) - shifted down to avoid overlapping with PwaHeader */}
            <div className={clsx(
                "absolute top-[60px] left-0 w-full pt-8 px-6 pb-6 z-20 flex justify-between items-center text-white/80 transition-opacity duration-500",
                isBgLoaded ? "opacity-100" : "opacity-0 pointer-events-none"
            )}>
                <button
                    onClick={() => {
                        audioSynth.playClick();
                        bgmManager.stop(1);
                        onBack();
                    }}
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
                    )} style={!isCandyMode ? { borderColor: `${currentTheme.badgeColor}80`, color: currentTheme.badgeColor } : {}}>
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

                {/* LEARNING SCREEN — decorative giant text removed, card handles everything */}

                {/* --- BOTTOM ALIGNED CONTENT --- */}
                <div className="w-full flex flex-col mt-auto items-center min-h-0 relative z-20">
                    {/* Dialogue Box */}
                    <div
                        className={clsx(
                            "w-full rounded-2xl cinematic-card flex flex-col overflow-hidden",
                            isCandyTheme
                                ? "bg-white/95 border-b-8 border-pink-400 shadow-[0_20px_50px_rgba(236,72,153,0.3)] text-slate-800"
                                : "border"
                        )}
                        style={!isCandyMode ? {
                            background: 'rgba(10, 10, 20, 0.88)',
                            borderColor: currentTheme.cardBorder,
                            boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${currentTheme.badgeColor}22`,
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            maxHeight: '80vh',
                            width: '90%',
                            maxWidth: '680px',
                            margin: '0 auto',
                        } : {
                            maxHeight: '80vh',
                            width: '90%',
                            maxWidth: '680px',
                            margin: '0 auto',
                        }}
                        onClick={handleTextClick}
                    >
                        <div 
                            ref={textContainerRef}
                            className="p-5 overflow-y-auto custom-scrollbar flex flex-col"
                            style={{ 
                                scrollbarWidth: 'thin', 
                                scrollbarColor: `${currentTheme.badgeColor} transparent`,
                                gap: '16px'
                            }}
                        >
                        {/* Bug 2 — Lesson card: single clean layout, no decorative overlap */}
                        {isLearningScreen ? (
                            <>
                                {/* KEY TAKEAWAY label */}
                                <div className="text-center shrink-0" style={{ color: currentTheme.badgeColor, letterSpacing: '3px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Key Takeaway
                                </div>
                                {/* Lesson title */}
                                <h2 className="text-center font-black text-white shrink-0" style={{ fontSize: '1.4rem', lineHeight: 1.3, maxHeight: '3rem', overflow: 'hidden' }}>
                                    {lessonKeyword}
                                </h2>
                                {/* Lesson body text */}
                                <p className={clsx(
                                    "leading-relaxed text-center",
                                    isCandyTheme
                                        ? "text-lg font-serif italic text-pink-900"
                                        : "text-sm text-white/80"
                                )}
                                style={{ fontSize: '0.95rem' }}>
                                    {lessonBody}
                                </p>
                                {/* Finish Chapter button — always visible on lesson screen */}
                                <div className="mt-2 shrink-0">
                                        {displayedChoices.map((choice, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleChoiceClick(choice as Choice)}
                                                className="cinematic-continue w-full py-4 rounded-full font-bold uppercase tracking-widest text-white transition-all active:scale-95"
                                                style={!isCandyMode ? {
                                                    backgroundColor: currentTheme.badgeColor,
                                                    boxShadow: `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`,
                                                    border: `1px solid ${currentTheme.cardBorder}`,
                                                } : { backgroundColor: '#f59e0b' }}
                                                onMouseEnter={(e) => {
                                                    if (!isCandyMode) e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.5), 0 0 30px ${currentTheme.badgeColor}cc`;
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isCandyMode) e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`;
                                                }}
                                            >
                                                {choice.text}
                                            </button>
                                        ))}
                                    </div>
                            </>
                        ) : (
                        <>
                        {/* Speaker Label INSIDE the card */}
                        {!isLearningScreen && (
                            <div className="self-start shrink-0">
                                <div
                                    className={clsx(
                                        "cinematic-badge font-extrabold uppercase tracking-wider text-sm px-6 py-2 rounded-full border shadow-lg",
                                        feedbackChoice
                                            ? feedbackChoice.score > 0 ? "bg-green-400/20 border-green-400 text-green-400" : "bg-red-400/20 border-red-400 text-red-400"
                                            : isCandyMode ? "bg-yellow-400/20 border-yellow-400 text-yellow-400" : "bg-transparent text-white"
                                    )}
                                    style={!isCandyMode && !feedbackChoice ? {
                                        borderColor: currentTheme.badgeColor,
                                        color: currentTheme.badgeColor,
                                        boxShadow: currentTheme.badgeGlow,
                                        backgroundColor: `${currentTheme.badgeColor}33`,
                                    } : {}}
                                >
                                    {feedbackChoice
                                        ? feedbackChoice.feedbackTitle
                                        : (frame.id === 'intro' ? 'Narrator' : 'You')}
                                </div>
                            </div>
                        )}
                        {/* Text Content */}
                        <div className="pb-2">
                            {level.age_mirror_text && (frame.id === 'intro') && !feedbackChoice && (
                                <p className="italic text-sm md:text-base mb-4 text-center" style={{ color: '#00f1fe' }}>
                                    At YOUR age ({useUserStore.getState().profile?.age || 18}), {level.personality} was {level.age_mirror_text}.
                                </p>
                            )}
                            <p className={clsx(
                                "leading-relaxed",
                                isCandyTheme
                                    ? "text-xl md:text-2xl font-bold font-comic text-pink-900 drop-shadow-none"
                                    : "text-xl md:text-2xl font-comic text-white drop-shadow-md"
                            )}>
                                {displayedText}
                                {isTyping && <span className={clsx("inline-block w-2 h-6 ml-1 animate-cursor-blink align-middle", isCandyTheme ? "bg-pink-500" : "bg-yellow-400")} />}
                            </p>
                        </div>

                        {/* Choice buttons — flex-shrink-0 so they never get compressed */}
                        {!isTyping && !feedbackChoice && (
                            <div
                                className="mt-3 animate-fade-in"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    width: '100%',
                                    flexShrink: 0,
                                }}
                            >
                                {displayedChoices.map((choice, idx) => (
                                    <button
                                        key={idx}
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                            if (selectedOption !== null) return;
                                            setSelectedOption(String(idx));
                                            handleChoiceClick(choice as Choice);
                                        }}
                                        disabled={selectedOption !== null}
                                        className={clsx(
                                            "cinematic-choice group w-full text-left border-2 transition-all flex items-center justify-between shadow-lg",
                                            isCandyTheme
                                                ? "bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-bold border-b-4 border-teal-700 hover:translate-y-1 hover:border-b-0 active:scale-95 shadow-lg rounded-full"
                                                : "border-white/10 rounded-2xl"
                                        )}
                                        style={{
                                            minHeight: '56px',
                                            padding: '14px 16px',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            touchAction: 'manipulation',
                                            pointerEvents: selectedOption !== null ? 'none' : 'auto',
                                            opacity: selectedOption !== null && selectedOption !== String(idx) ? 0.5 : 1,
                                            ...(isCandyMode ? {} : { borderColor: currentTheme.choiceBorder }),
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCandyMode) {
                                                e.currentTarget.style.boxShadow = currentTheme.badgeGlow;
                                                e.currentTarget.style.borderColor = currentTheme.badgeColor;
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isCandyMode) {
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = currentTheme.choiceBorder;
                                            }
                                        }}
                                    >
                                        <span className={clsx("font-medium text-base leading-snug transition-colors flex-1 mr-3", isCandyTheme ? "text-white drop-shadow-md" : "text-white/90 group-hover:text-white")}>
                                            {choice.text}
                                        </span>
                                        {!isLearningScreen && <ChevronRight className={clsx("shrink-0 group-hover:translate-x-1 transition-transform", isCandyTheme ? "text-white" : "text-white/40")} />}
                                    </button>
                                ))}
                            </div>
                        )}

                        {feedbackChoice && (
                            <div className="mt-8 flex justify-center animate-fade-in">
                                <button
                                    onClick={handleFeedbackContinue}
                                    className="cinematic-continue px-10 py-4 rounded-full font-bold uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 flex items-center gap-2 hover:scale-105"
                                    style={!isCandyMode ? {
                                        backgroundColor: currentTheme.badgeColor,
                                        boxShadow: `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`,
                                    } : { backgroundColor: '#f59e0b' }}
                                    onMouseEnter={(e) => {
                                        if (!isCandyMode) {
                                            e.currentTarget.style.boxShadow = `0 12px 24px rgba(0,0,0,0.5), 0 0 30px ${currentTheme.badgeColor}cc`;
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isCandyMode) {
                                            e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.4), ${currentTheme.badgeGlow}`;
                                        }
                                    }}
                                >
                                    Continue <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                        </>
                        )}
                        </div>
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
