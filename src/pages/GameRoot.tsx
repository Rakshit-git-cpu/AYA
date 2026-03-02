import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { OnboardingWizard } from '../components/game/OnboardingWizard';
import { LevelMap } from '../components/game/LevelMap';
import { ScenarioGame } from '../components/game/ScenarioGame';
import { PersonalityIntro } from '../components/game/PersonalityIntro';
import { PersonalityAssessment } from '../components/game/PersonalityAssessment';
import type { Level } from '../types/gameTypes';

import { MatchReport } from '../components/game/MatchReport';

export function GameRoot() {
    const profile = useUserStore((state) => state.profile);
    const completeLevel = useUserStore((state) => state.completeLevel);

    const levels = useUserStore((state) => state.levels);
    const unlockLevel = useUserStore((state) => state.unlockLevel);

    // State to track if we are currently PLAYING a level (Visual Novel Mode)
    // HOOKS MUST BE AT THE TOP LEVEL
    const [view, setView] = useState<'map' | 'intro' | 'game' | 'report'>('map');
    const [activeLevel, setActiveLevel] = useState<Level | null>(null);



    // If no profile, show Onboarding Wizard
    if (!profile) {
        return <OnboardingWizard />;
    }

    // NEW: If profile exists but assessment not done, show Assessment
    if (!profile.assessmentCompleted) {
        return <PersonalityAssessment />;
    }

    // Handler when a level is clicked in the LevelMap
    const handleLevelClick = (level: Level) => {
        // Only allow playing if unlocked
        if (!level.isLocked || level.status === 'unlocked') {
            setActiveLevel(level); // Renamed from setPlayingLevel
            setView('intro'); // SHOW INTRO FIRST
        }
    };

    // Handler for completing a scenario - Renamed and updated
    const handleLevelComplete = (stars: number) => {
        if (!activeLevel) return;

        // 1. Save Score
        completeLevel(activeLevel.id, stars);

        // 2. Unlock Next Level
        // Find current index in the full levels list
        const currentIndex = levels.findIndex(l => l.id === activeLevel.id);
        if (currentIndex !== -1 && currentIndex < levels.length - 1) {
            const nextLevel = levels[currentIndex + 1];
            unlockLevel(nextLevel.id);
        }

        setView('report'); // Show Match Report instead of going to map immediately
        // setActiveLevel(null); // Keep active level for report data
    };

    return (
        <div className="w-full h-screen bg-slate-950 overflow-hidden relative">
            {/* If we are playing a level, show ScenarioGame. Otherwise show Map. */}
            {/* VIEW ROUTING */}
            {view === 'intro' && activeLevel && (
                <PersonalityIntro
                    level={activeLevel}
                    onStart={() => setView('game')}
                    onBack={() => {
                        setActiveLevel(null);
                        setView('map');
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

            {/* MATCH REPORT VIEW */}
            {view === 'report' && activeLevel && profile && (
                <MatchReport
                    userTraits={profile.traits}
                    userProfile={profile.psychologicalProfile}
                    idolTraits={activeLevel.idolTraits || { discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50 }}
                    idolName={activeLevel.personality || activeLevel.archetype}
                    onClose={() => {
                        setActiveLevel(null);
                        setView('map');
                    }}
                />
            )}

            {/* Map is always rendered in background for smooth transition, or hide it if performance needed */}
            <LevelMap onPlayLevel={handleLevelClick} />
        </div>
    );
}
