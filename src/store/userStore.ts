import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Level, Lesson, PersonalityTraits, PsychologicalProfile } from '../types/gameTypes';
import { generateLevels } from '../utils/levelGenerator';
import { calculateLevelInfo } from '../utils/levelSystem';

interface UserState {
    profile: UserProfile | null;
    completedOnboarding: boolean;
    levels: Level[]; // Dynamic levels
    levelScores: Record<string, number>;
    xp: number; // Global Wisdom XP

    setProfile: (profile: UserProfile) => void;
    unlockLevel: (levelId: string) => void;
    completeLevel: (levelId: string, stars: number) => void;
    
    // New Gamified XP Setup
    addXp: (amount: number) => void;
    addSessionProgression: (sessionXp: number) => void;
    
    syncLevels: () => void;

    // Daily Challenge & Streak Actions
    checkStreak: () => void;
    completeDailyChallenge: () => { xpEarned: number, oldStreak: number, newStreak: number, isMilestone: boolean };

    // Personality System Actions
    updateTraits: (modifiers: Partial<PersonalityTraits>) => void;
    completeAssessment: (initialTraits: PersonalityTraits, profile: PsychologicalProfile) => void;

    // Theme State
    isCandyMode: boolean;
    toggleCandyMode: () => void;

    // Audio State
    musicVolume: number; // 0 to 1
    sfxVolume: number;   // 0 to 1
    isMusicMuted: boolean;
    isSfxMuted: boolean;

    setMusicVolume: (vol: number) => void;
    setSfxVolume: (vol: number) => void;
    toggleMusicMute: () => void;
    toggleSfxMute: () => void;

    // Lesson Journal State
    collectedLessons: Lesson[];
    collectLesson: (lesson: Lesson) => void;

    resetProgress: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            profile: null,
            completedOnboarding: false,
            levels: [], // Start empty
            levelScores: {},
            xp: 0, // Legacy fallback. New stats live on profile

            addXp: (amount) => set((state) => ({ xp: state.xp + amount })),

            addSessionProgression: (sessionXp) => set((state) => {
                if (!state.profile) return state;

                const currentXp = state.profile.total_xp || 0;
                const newXp = currentXp + sessionXp;
                const levelInfo = calculateLevelInfo(newXp);
                const currentStories = state.profile.stories_completed || 0;

                return {
                    profile: {
                        ...state.profile,
                        total_xp: newXp,
                        level: levelInfo.level,
                        stories_completed: currentStories + 1
                    }
                };
            }),

            // Default to Dark Mode
            isCandyMode: false,
            toggleCandyMode: () => set((state) => ({ isCandyMode: !state.isCandyMode })),

            // Audio Defaults
            musicVolume: 0.5,
            sfxVolume: 0.8,
            isMusicMuted: false,
            isSfxMuted: false,

            setMusicVolume: (vol) => set({ musicVolume: vol }),
            setSfxVolume: (vol) => set({ sfxVolume: vol }),
            toggleMusicMute: () => set((state) => ({ isMusicMuted: !state.isMusicMuted })),
            toggleSfxMute: () => set((state) => ({ isSfxMuted: !state.isSfxMuted })),

            collectedLessons: [],
            collectLesson: (lesson) => set((state) => {
                // Prevent duplicates
                if (state.collectedLessons.some(l => l.id === lesson.id)) return state;
                return { collectedLessons: [...state.collectedLessons, lesson] };
            }),

            setProfile: (profile) => {
                // Generate levels dynamically based on Age & Interests
                const dynamicLevels = generateLevels(profile.age);

                set({
                    profile,
                    completedOnboarding: true,
                    levels: dynamicLevels
                });
            },

            syncLevels: () => set((state) => {
                // generateLevels now returns ALL levels (age param ignored but required by signature)
                const latestMasterLevels = generateLevels(0);

                // Merge latest codebase levels with the locally cached progress
                const mergedLevels = latestMasterLevels.map(latestLevel => {
                    const cachedLevel = state.levels.find(l => l.id === latestLevel.id);
                    if (cachedLevel) {
                        return {
                            ...latestLevel,
                            status: cachedLevel.status,
                            isLocked: cachedLevel.isLocked,
                            stars: cachedLevel.stars
                        };
                    }
                    return latestLevel;
                });

                return { levels: mergedLevels };
            }),

            // Daily Challenge & Streak Logic
            checkStreak: () => set((state) => {
                if (!state.profile) return state;

                const now = new Date();
                let lastActiveStr = state.profile.last_active_date;
                let current = state.profile.current_streak || 0;
                let completedToday = state.profile.daily_challenge_completed || false;
                
                if (lastActiveStr) {
                    const lastActive = new Date(lastActiveStr);
                    lastActive.setHours(0,0,0,0);
                    
                    const today = new Date(now);
                    today.setHours(0,0,0,0);
                    
                    const diffTime = Math.abs(today.getTime() - lastActive.getTime());
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 0) {
                        // Same day, no change to streak length, just maintain flags
                    } else if (diffDays === 1) {
                        // Active yesterday, reset daily challenge flag
                        completedToday = false;
                    } else if (diffDays > 1) {
                        // Missed a day or more, streak broken!
                        current = 0;
                        completedToday = false;
                    }
                } else {
                    completedToday = false;
                }

                return {
                    profile: {
                        ...state.profile,
                        current_streak: current,
                        daily_challenge_completed: completedToday
                    }
                };
            }),

            completeDailyChallenge: () => {
                let result = { xpEarned: 0, oldStreak: 0, newStreak: 0, isMilestone: false };
                
                set((state) => {
                    if (!state.profile || state.profile.daily_challenge_completed) return state;

                    const currentStreak = state.profile.current_streak || 0;
                    const newStreak = currentStreak + 1;
                    const longestStreak = Math.max(state.profile.longest_streak || 0, newStreak);
                    const todayStr = new Date().toISOString().split('T')[0];

                    let bonusXp = 0;
                    let milestone = false;

                    // Standard daily completion gets standard session XP usually, but let's give default 10 XP for daily
                    let baseDailyXp = 20;

                    // Award Streak Bonus XP
                    if (newStreak === 3) { bonusXp = 30; milestone = true; }
                    else if (newStreak === 7) { bonusXp = 100; milestone = true; }
                    else if (newStreak === 30) { bonusXp = 500; milestone = true; }
                    else if (newStreak > 30 && newStreak % 10 === 0) { bonusXp = 100; } // Recurring bonus

                    const totalAward = baseDailyXp + bonusXp;

                    result = {
                        xpEarned: totalAward,
                        oldStreak: currentStreak,
                        newStreak: newStreak,
                        isMilestone: milestone
                    };

                    const newTotalXp = (state.profile.total_xp || 0) + totalAward;
                    const levelInfo = calculateLevelInfo(newTotalXp);

                    return {
                        profile: {
                            ...state.profile,
                            current_streak: newStreak,
                            longest_streak: longestStreak,
                            last_active_date: todayStr,
                            daily_challenge_completed: true,
                            total_xp: newTotalXp,
                            level: levelInfo.level
                        }
                    };
                });
                
                return result;
            },

            // Personality Actions
            updateTraits: (modifiers) => set((state) => {
                if (!state.profile) return state;

                const currentTraits = state.profile.traits;
                const newTraits = { ...currentTraits };

                // Update and Clamp values 0-100
                (Object.keys(modifiers) as Array<keyof PersonalityTraits>).forEach((key) => {
                    const change = modifiers[key] || 0;
                    newTraits[key] = Math.max(0, Math.min(100, (newTraits[key] || 50) + change));
                });

                return {
                    profile: {
                        ...state.profile,
                        traits: newTraits
                    }
                };
            }),

            completeAssessment: (initialTraits, profile) => set((state) => {
                if (!state.profile) return state;
                return {
                    profile: {
                        ...state.profile,
                        traits: initialTraits,
                        psychologicalProfile: profile,
                        assessmentCompleted: true
                    }
                };
            }),

            // The original `unlockedLevels` state and its usage in `unlockLevel` were removed
            // as per the instruction's updated UserState interface and initial state.
            // If level unlocking logic is still needed, it should be re-evaluated
            // in the context of the new `levels` array.
            unlockLevel: (levelId) => set((state) => ({
                levels: state.levels.map(l =>
                    l.id === levelId ? { ...l, status: 'unlocked' } : l
                )
            })),

            completeLevel: (levelId, stars) => set((state) => ({
                levelScores: { ...state.levelScores, [levelId]: Math.max(state.levelScores[levelId] || 0, stars) },
                // Auto unlock next level logic could go here
            })),

            resetProgress: () => set({
                profile: null,
                completedOnboarding: false,
                levels: [],
                levelScores: {},
                collectedLessons: []
                // We keep 'isCandyMode' and audio settings as user preference
            })
        }),
        {
            name: 'aya-user-storage-v5', // v5: persist profile to fix empty-map-on-refresh bug
            partialize: (state) => ({
                // CRITICAL: persist profile so syncLevels can run after hard refresh
                profile: state.profile,
                completedOnboarding: state.completedOnboarding,

                levels: state.levels,
                levelScores: state.levelScores,
                isCandyMode: state.isCandyMode,

                // Persist Audio Settings
                musicVolume: state.musicVolume,
                sfxVolume: state.sfxVolume,
                isMusicMuted: state.isMusicMuted,
                isSfxMuted: state.isSfxMuted,

                collectedLessons: state.collectedLessons
            }),
        }
    ));
