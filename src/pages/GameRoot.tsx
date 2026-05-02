import { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { getSession, clearSession, markQuizDone, isQuizDone } from '../utils/session';
import { withTimeout } from '../utils/withTimeout';
import { useUserStore } from '../store/userStore';
import { OnboardingWizard } from '../components/game/OnboardingWizard';
import { CinematicOnboarding } from '../components/game/CinematicOnboarding';
import { LevelMap } from '../components/game/LevelMap';
// SolarMap import preserved for future use — not rendered currently
// import { SolarMap } from '../components/game/SolarMap';
import { CharacterSelection } from '../components/game/CharacterSelection';
import { ScenarioGame } from '../components/game/ScenarioGame';
import { PersonalityIntro } from '../components/game/PersonalityIntro';
import { PersonalityAssessment } from '../components/game/PersonalityAssessment';
import type { Level } from '../types/gameTypes';
import { MatchReport } from '../components/game/MatchReport';
import { DnaProfile } from '../components/game/DnaProfile';
import { LevelUpCelebration } from '../components/game/LevelUpCelebration';
import { StreakCelebration } from '../components/game/StreakCelebration';
import { calculateLevelInfo } from '../utils/levelSystem';

import { safeStorage } from '../utils/storage';

export function GameRoot() {
    const profile = useUserStore((state) => state.profile);
    const completeLevel = useUserStore((state) => state.completeLevel);

    const levels = useUserStore((state) => state.levels);
    const unlockLevel = useUserStore((state) => state.unlockLevel);
    const syncLevels = useUserStore((state) => state.syncLevels);
    const mapTheme = useUserStore((state) => state.mapTheme);
    const setMapTheme = useUserStore((state) => state.setMapTheme);

    // Sync theme from localStorage on mount; reset 'solar' → 'city_dark'
    useEffect(() => {
        const raw = safeStorage.get('aya_map_theme') as any;
        const storedTheme = (!raw || raw === 'solar') ? 'city_dark' : raw;
        if (storedTheme !== mapTheme) {
            setMapTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        syncLevels();
    }, [syncLevels]);

    const initialView = (localStorage.getItem('aya_last_view') as any) || 'map';
    const [view, setView] = useState<'map' | 'selection' | 'intro' | 'game' | 'report' | 'dna'>(initialView);
    const [sessionStatus, setSessionStatus] = useState<'checking' | 'found' | 'not_found'>('checking');

    useEffect(() => {
        if (sessionStatus === 'found' && view) {
            if (['map', 'dna', 'journal'].includes(view)) {
                localStorage.setItem('aya_last_view', view)
            }
        }
    }, [view, sessionStatus]);

    useEffect(() => {
        const restoreSession = async () => {
            console.log('[Session] Checking for existing session...')

            // Nuclear fallback — never stay on 'checking' forever
            const maxWait = setTimeout(() => {
                setSessionStatus(prev => prev === 'checking' ? 'not_found' : prev);
            }, 20000);

            try {
                const session = getSession();
                console.log('[Session] Found in storage:', session);

                if (!session.userId || !session.mobile) {
                    console.log('[Session] No session found — showing registration');
                    clearTimeout(maxWait);
                    setSessionStatus('not_found');
                    return;
                }

                // Verify user still exists in DB
                let user: any = null;
                try {
                    const { data, error } = await withTimeout(
                        supabase.from('users').select('*').eq('id', session.userId).maybeSingle()
                    );
                    if (error) throw error;
                    user = data;
                } catch (dbErr) {
                    // DB unreachable — fall back to cached session data so user isn't locked out
                    console.warn('[Session] DB lookup failed, using cached data:', dbErr);
                    const store = useUserStore.getState();
                    if (!store.profile) {
                        // Minimal profile from cache so they can access the app
                        store.setProfile({
                            id: session.userId,
                            name: session.name || 'Player',
                            age: session.age || 18,
                            mobile: session.mobile,
                            total_xp: 0, level: 1,
                            current_streak: 0, longest_streak: 0,
                            stories_completed: 0,
                            daily_challenge_completed: false,
                            preferred_theme: 'city_dark',
                            assessmentCompleted: isQuizDone(),
                        } as any);
                        if (isQuizDone()) {
                            store.completeAssessment(
                                { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
                                { motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient', social: 'Supporter', passion: 'Creative', coreValue: 'Success' }
                            );
                        }
                    }
                    clearTimeout(maxWait);
                    setSessionStatus('found');
                    return;
                }

                if (!user) {
                    console.log('[Session] User not in DB — clearing session');
                    clearSession();
                    clearTimeout(maxWait);
                    setSessionStatus('not_found');
                    return;
                }

                console.log('[Session] User found:', user.name);

                // Fetch personality profile
                let profileData: any = null;
                try {
                    const { data } = await withTimeout(
                        supabase.from('personality_profiles').select('*').eq('user_id', session.userId).maybeSingle()
                    );
                    profileData = data;
                } catch { /* non-critical — proceed without trait data */ }

                // Check if quiz was done (via localStorage flag first for speed, then DB)
                let quizCompleted = isQuizDone() || !!profileData;
                if (!quizCompleted) {
                    try {
                        const { data: qr } = await withTimeout(
                            supabase.from('quiz_responses').select('id').eq('user_id', session.userId).limit(1)
                        );
                        quizCompleted = !!(qr && qr.length > 0);
                        if (quizCompleted) markQuizDone();
                    } catch { /* non-critical */ }
                }

                const store = useUserStore.getState();
                store.setProfile({
                    id: user.id,
                    name: user.name,
                    age: user.age,
                    mobile: user.mobile,
                    total_xp: user.total_xp || 0,
                    level: user.level || 1,
                    current_streak: user.current_streak || 0,
                    longest_streak: user.longest_streak || 0,
                    stories_completed: user.stories_completed || 0,
                    daily_challenge_completed: user.daily_challenge_completed || false,
                    preferred_theme: user.preferred_theme || 'city_dark',
                    ...(profileData ? {
                        trait_risk_taker: profileData.trait_risk_taker,
                        trait_creative: profileData.trait_creative,
                        trait_analytical: profileData.trait_analytical,
                        trait_social: profileData.trait_social,
                        trait_ambitious: profileData.trait_ambitious,
                        future_archetype: profileData.future_archetype,
                        interest_goal: profileData.interest_goal,
                        interest_struggle: profileData.interest_struggle,
                        interest_domain: profileData.interest_domain,
                    } : {})
                } as any);

                if (quizCompleted && profileData) {
                    store.completeAssessment(
                        {
                            discipline: 50, resilience: 50,
                            risk: profileData.trait_risk_taker || 50,
                            leadership: profileData.trait_ambitious || 50,
                            creativity: profileData.trait_creative || 50,
                            empathy: profileData.trait_social || 50, vision: 50
                        },
                        {
                            motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient',
                            social: 'Supporter', passion: 'Creative', coreValue: 'Success'
                        }
                    );
                } else if (quizCompleted && !profileData) {
                    // Quiz done but profile data unavailable — mark assessment done anyway
                    store.completeAssessment(
                        { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 },
                        { motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient', social: 'Supporter', passion: 'Creative', coreValue: 'Success' }
                    );
                }

                const savedTheme = user.preferred_theme || 'city_dark';
                store.setMapTheme(savedTheme as any);

                console.log('[Session] Session restored successfully!');
                clearTimeout(maxWait);
                setSessionStatus('found');

            } catch (err) {
                console.error('[Session] Unexpected error:', err);
                clearTimeout(maxWait);
                setSessionStatus('not_found');
            }
        };

        restoreSession();
    }, [])
    const [activeAge, setActiveAge] = useState<number | null>(null);
    const [activeLevel, setActiveLevel] = useState<Level | null>(null);

    // Level up tracking
    const prevLevelRef = useRef(profile?.level || 1);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [onboardingComplete, setOnboardingComplete] = useState(false);

    useEffect(() => {
        if (profile?.level && profile.level > prevLevelRef.current) {
            setShowLevelUp(true);
            prevLevelRef.current = profile.level;
        }
    }, [profile?.level]);

    useEffect(() => {
        console.log('[GameRoot] Profile State:', profile);
        console.log('[GameRoot] Assessment Completed:', profile?.assessmentCompleted);
    }, [profile]);

    // Streak tracking
    const [streakData, setStreakData] = useState<{ xpEarned: number, oldStreak: number, newStreak: number, isMilestone: boolean } | null>(null);

    if (sessionStatus === 'checking') {
        return (
            <div className="w-full h-screen bg-[#0d0d16] flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-cyan-400 text-lg font-bold tracking-widest animate-pulse">
                    LOADING YOUR UNIVERSE...
                </p>
            </div>
        )
    }

    // Only gate on !profile — sessionStatus is for the loading screen only.
    // OnboardingWizard calls setProfile() directly, which unmounts this gate immediately.
    if (!profile) {
        return <OnboardingWizard />;
    }

    // Always show cinematic onboarding before the quiz (not persisted — shows every new journey)
    if (!profile.assessmentCompleted && !onboardingComplete) {
        console.log('showing onboarding')
        return <CinematicOnboarding onComplete={() => {
            setOnboardingComplete(true);
        }} />;
    }

    if (!profile.assessmentCompleted) {
        return <PersonalityAssessment />;
    }

    // MAP: When user clicks a Level Node
    const handleLevelClick = (level: Level) => {
        setActiveLevel(level);
        setView('intro');
    };

    // SELECTION: When user chooses a character card (No longer used by map directly, but keeping if needed)
    const handleCharacterSelect = (level: Level) => {
        setActiveLevel(level);
        setView('intro');
    };

    const handleLevelComplete = (stars: number) => {
        if (!activeLevel) return;

        completeLevel(activeLevel.id, stars);

        // Unlock next Level logic (optional, keeping original behavior for now)
        const currentIndex = levels.findIndex(l => l.id === activeLevel.id);
        if (currentIndex !== -1 && currentIndex < levels.length - 1) {
            const nextLevel = levels[currentIndex + 1];
            unlockLevel(nextLevel.id);
        }

        setView('report');
    };

    return (
        <div className="w-full h-screen bg-slate-950 overflow-hidden relative">
            {view === 'selection' && activeAge !== null && (
                <CharacterSelection 
                    age={activeAge}
                    options={levels.filter(l => l.age === activeAge)}
                    onSelect={handleCharacterSelect}
                    onBack={() => {
                        setActiveAge(null);
                        setView('map');
                    }}
                />
            )}

            {view === 'intro' && activeLevel && (
                <PersonalityIntro
                    level={activeLevel}
                    onStart={() => setView('game')}
                    onBack={() => {
                        setActiveLevel(null);
                        setView('map'); // Go back directly to map
                    }}
                />
            )}

            {view === 'game' && activeLevel && (
                <ScenarioGame
                    level={activeLevel}
                    onComplete={handleLevelComplete}
                    onBack={() => {
                        setActiveLevel(null);
                        setView('map');
                    }}
                    onDailyChallengeComplete={(data) => {
                        setStreakData(data);
                    }}
                />
            )}

            {view === 'report' && activeLevel && profile && (
                <MatchReport
                    userTraits={profile.traits}
                    userProfile={profile.psychologicalProfile}
                    idolTraits={activeLevel.idolTraits || { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 }}
                    idolName={activeLevel.personality || activeLevel.archetype}
                    onClose={() => {
                        setActiveLevel(null);
                        setActiveAge(null);
                        setView('map');
                    }}
                />
            )}

            {view === 'dna' && profile && (
                <DnaProfile onBack={() => setView('map')} />
            )}

            {/* SolarMap hidden until re-enabled — always render LevelMap (handles dark/light via mapTheme) */}
            <LevelMap 
                onPlayLevel={handleLevelClick} 
                onOpenDnaProfile={() => setView('dna')}
                isMapActive={view !== 'game' && view !== 'report'}
            />

            {/* Level Up Overlay overrides all other Z-layers organically */}
            {showLevelUp && profile && (
                <LevelUpCelebration
                    levelNumber={profile.level || 1}
                    levelName={calculateLevelInfo(profile.total_xp || 0).title}
                    onComplete={() => setShowLevelUp(false)}
                />
            )}

            {/* Streak Celebration */}
            {streakData && (
                <StreakCelebration
                    streak={streakData.newStreak}
                    xpEarned={streakData.xpEarned}
                    isMilestone={streakData.isMilestone}
                    onComplete={() => setStreakData(null)}
                />
            )}
        </div>
    );
}
