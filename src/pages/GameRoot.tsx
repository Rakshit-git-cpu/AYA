import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { OnboardingWizard } from '../components/game/OnboardingWizard';
import { CinematicOnboarding } from '../components/game/CinematicOnboarding';
import { LevelMap } from '../components/game/LevelMap';
import { SolarMap } from '../components/game/SolarMap';
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
import { supabase } from '../utils/supabase';

export function GameRoot() {
    const profile = useUserStore((state) => state.profile);
    const setProfile = useUserStore((state) => state.setProfile);
    const completeAssessment = useUserStore((state) => state.completeAssessment);
    const completeLevel = useUserStore((state) => state.completeLevel);

    const levels = useUserStore((state) => state.levels);
    const unlockLevel = useUserStore((state) => state.unlockLevel);
    const syncLevels = useUserStore((state) => state.syncLevels);
    const mapTheme = useUserStore((state) => state.mapTheme);
    const setMapTheme = useUserStore((state) => state.setMapTheme);

    // Sync theme from localStorage on mount; default to 'solar' if nothing stored
    useEffect(() => {
        const storedTheme = (localStorage.getItem('aya_map_theme') as any) || 'solar';
        if (storedTheme !== mapTheme) {
            setMapTheme(storedTheme);
        }
    }, []);

    useEffect(() => {
        syncLevels();
    }, [syncLevels]);

    const [view, setView] = useState<'map' | 'selection' | 'intro' | 'game' | 'report' | 'dna'>('map');
    const [activeAge, setActiveAge] = useState<number | null>(null);
    const [activeLevel, setActiveLevel] = useState<Level | null>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);

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

    useEffect(() => {
        const checkExistingSession = async () => {
            const savedUserId = localStorage.getItem('aya_user_id')
            const savedMobile = localStorage.getItem('aya_user_mobile')
            
            if (savedUserId && savedMobile && !profile) {
                try {
                    // Fetch user from Supabase
                    const { data: user } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', savedUserId)
                        .single()
                    
                    if (user) {
                        // Fetch personality profile
                        const { data: profileData } = await supabase
                            .from('personality_profiles')
                            .select('*')
                            .eq('user_id', savedUserId)
                            .single()

                        // Fetch latest game session for XP/Level/Streak
                        const { data: sessions } = await supabase
                            .from('game_sessions')
                            .select('*')
                            .eq('user_id', savedUserId)
                            .order('created_at', { ascending: false })
                            .limit(1);

                        const lastSession = sessions && sessions.length > 0 ? sessions[0] : null;
                        
                        const loadedTraits = profileData ? {
                            discipline: 50, resilience: 50, risk: profileData.trait_risk_taker || 50,
                            leadership: profileData.trait_ambitious || 50, creativity: profileData.trait_creative || 50, empathy: profileData.trait_social || 50, vision: 50,
                        } : {
                            discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50
                        };

                        // Load into store
                        setProfile({
                            name: user.name,
                            age: user.age,
                            mobile: user.mobile,
                            id: user.id,
                            total_xp: lastSession ? lastSession.total_xp : (user.total_xp || 0),
                            level: lastSession ? lastSession.current_level : (user.level || 1),
                            streak: lastSession ? lastSession.streak : (user.current_streak || 0),
                            assessmentCompleted: !!profileData,
                            interests: [],
                            roleModels: [],
                            traits: loadedTraits
                        } as any);

                        if (profileData) {
                            completeAssessment(loadedTraits as any, {
                                motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient',
                                social: 'Supporter', passion: 'Creative', coreValue: 'Success'
                            });
                        }
                        setOnboardingComplete(true);
                    } else {
                        // User not found in DB — clear localStorage
                        localStorage.removeItem('aya_user_id')
                        localStorage.removeItem('aya_user_mobile')
                        localStorage.removeItem('aya_user_name')
                        localStorage.removeItem('aya_user_age')
                    }
                } catch (error) {
                    console.error('Session check failed:', error)
                    localStorage.removeItem('aya_user_id')
                    localStorage.removeItem('aya_user_mobile')
                }
            }
            setIsCheckingSession(false)
        }
        
        checkExistingSession()
    }, [])

    if (isCheckingSession) {
        return <div className="w-full h-screen bg-black flex items-center justify-center">
            <div className="text-cyan-400 text-xl animate-pulse">Loading...</div>
        </div>
    }

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

            {mapTheme === 'solar' ? (
                <SolarMap 
                    onPlayLevel={handleLevelClick} 
                    onOpenDnaProfile={() => setView('dna')}
                    isMapActive={view !== 'game' && view !== 'report'}
                />
            ) : (
                <LevelMap 
                    onPlayLevel={handleLevelClick} 
                    onOpenDnaProfile={() => setView('dna')}
                    isMapActive={view !== 'game' && view !== 'report'}
                />
            )}

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
