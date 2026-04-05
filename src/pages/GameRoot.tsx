import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { OnboardingWizard } from '../components/game/OnboardingWizard';
import { CinematicOnboarding } from '../components/game/CinematicOnboarding';
import { LevelMap } from '../components/game/LevelMap';
import { CharacterSelection } from '../components/game/CharacterSelection';
import { ScenarioGame } from '../components/game/ScenarioGame';
import { PersonalityIntro } from '../components/game/PersonalityIntro';
import { PersonalityAssessment } from '../components/game/PersonalityAssessment';
import type { Level } from '../types/gameTypes';
import { MatchReport } from '../components/game/MatchReport';
import { DnaProfile } from '../components/game/DnaProfile';
import { LevelUpCelebration } from '../components/game/LevelUpCelebration';
import { calculateLevelInfo } from '../utils/levelSystem';
import { useRef } from 'react';

export function GameRoot() {
    const profile = useUserStore((state) => state.profile);
    const completeLevel = useUserStore((state) => state.completeLevel);

    const levels = useUserStore((state) => state.levels);
    const unlockLevel = useUserStore((state) => state.unlockLevel);
    const syncLevels = useUserStore((state) => state.syncLevels);

    useEffect(() => {
        syncLevels();
    }, [syncLevels]);

    const [view, setView] = useState<'map' | 'selection' | 'intro' | 'game' | 'report' | 'dna'>('map');
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

    if (!profile) {
        return <OnboardingWizard />;
    }

    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';
    if (!hasSeenOnboarding && !onboardingComplete) {
        return <CinematicOnboarding onComplete={() => {
            localStorage.setItem('hasSeenOnboarding', 'true');
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

            <LevelMap 
                onPlayLevel={handleLevelClick} 
                onOpenDnaProfile={() => setView('dna')}
            />

            {/* Level Up Overlay overrides all other Z-layers organically */}
            {showLevelUp && profile && (
                <LevelUpCelebration
                    levelNumber={profile.level || 1}
                    levelName={calculateLevelInfo(profile.total_xp || 0).title}
                    onComplete={() => setShowLevelUp(false)}
                />
            )}
        </div>
    );
}
