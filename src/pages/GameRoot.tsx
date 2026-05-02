import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
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
import { useRef } from 'react';
import { safeStorage } from '../utils/storage';
import { getSession, saveSession } from '../utils/session';
import { withTimeout } from '../utils/withTimeout';

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
            // First check local storage (instant)
            const session = getSession();

            if (session.userId && session.mobile) {
                // Session exists — verify with Supabase quickly
                try {
                    const { data } = await withTimeout(
                        supabase.from('users').select('*').eq('id', session.userId).maybeSingle(),
                        5000
                    );
                    if (data) {
                        // Full restore from DB
                        const { data: profileData } = await withTimeout(
                            supabase.from('personality_profiles').select('*').eq('user_id', session.userId).maybeSingle(),
                            5000
                        ).catch(() => ({ data: null }));

                        const store = useUserStore.getState();
                        store.setProfile({
                            id: data.id,
                            name: data.name,
                            age: data.age,
                            mobile: data.mobile,
                            total_xp: data.total_xp || 0,
                            level: data.level || 1,
                            current_streak: data.current_streak || 0,
                            longest_streak: data.longest_streak || 0,
                            stories_completed: data.stories_completed || 0,
                            daily_challenge_completed: data.daily_challenge_completed || false,
                            preferred_theme: data.preferred_theme || 'city_dark',
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

                        if (profileData) {
                            store.completeAssessment(
                                {
                                    discipline: 50, resilience: 50,
                                    risk: profileData.trait_risk_taker || 50,
                                    leadership: profileData.trait_ambitious || 50,
                                    creativity: profileData.trait_creative || 50,
                                    empathy: profileData.trait_social || 50,
                                    vision: 50
                                },
                                {
                                    motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient',
                                    social: 'Supporter', passion: 'Creative', coreValue: 'Success'
                                }
                            );
                        }

                        const savedTheme = data.preferred_theme || safeStorage.get('aya_map_theme') || 'city_dark';
                        store.setMapTheme(savedTheme as any);

                        // Refresh session keys with latest DB data
                        saveSession(data);
                        setSessionStatus('found');
                        return;
                    }
                } catch {
                    // Supabase check failed — use cached session data from Zustand persist
                    // If Zustand already hydrated a profile, just use it
                    const cachedProfile = useUserStore.getState().profile;
                    if (cachedProfile) {
                        setSessionStatus('found');
                        return;
                    }
                    // Last resort: build minimal profile from session keys
                    if (session.userId && session.mobile) {
                        useUserStore.getState().setProfile({
                            id: session.userId,
                            mobile: session.mobile,
                            name: session.name || '',
                            age: Number(session.age) || 18,
                        } as any);
                        setSessionStatus('found');
                        return;
                    }
                }
            }

            // No session in storage — check Zustand persist hydration
            const cachedProfile = useUserStore.getState().profile;
            if (cachedProfile?.id) {
                setSessionStatus('found');
                return;
            }

            setSessionStatus('not_found');
        };

        restoreSession();

        // Nuclear fallback — never stay on checking forever
        const maxWait = setTimeout(() => {
            setSessionStatus(prev => prev === 'checking' ? 'not_found' : prev);
        }, 15000);

        return () => clearTimeout(maxWait);
    }, []);

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

    if (sessionStatus === 'not_found' || !profile) {
        return <OnboardingWizard />;
    }

    // Always show cinematic onboarding before the quiz (not persisted — shows every new journey)
    if (!profile.assessmentCompleted && !onboardingComplete) {
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
