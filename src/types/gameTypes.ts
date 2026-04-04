// New Personality System Types
export interface PersonalityTraits {
    discipline: number; // 0-100
    resilience: number; // Grit
    risk: number;
    leadership: number;
    creativity: number;
    empathy: number;
    vision: number;
}

// --- NEW PSYCHOLOGICAL PROFILE ---
export type MotivationType = 'Impact' | 'Stability' | 'Fame' | 'Freedom';
export type RiskAppetite = 'Bold' | 'Balanced' | 'Cautious';
export type EmotionalStyle = 'Resilient' | 'Sensitive' | 'Analytical' | 'Avoidant';
export type SocialRole = 'Leader' | 'Supporter' | 'Observer' | 'Creator';
export type PassionType = 'Creative' | 'Intellectual' | 'Competitive' | 'Empathic';
export type CoreValue = 'Impact' | 'Art' | 'Success' | 'Kindness';

export interface PsychologicalProfile {
    motivation: MotivationType;
    risk: RiskAppetite;
    emotional: EmotionalStyle;
    social: SocialRole;
    passion: PassionType;
    coreValue: CoreValue;
    interest_goal?: string;
    interest_struggle?: string;
    interest_domain?: string;
}

export interface MatchResult {
    matchPercentage: number;
    gapAnalysis: string; // "You are more risk-averse than Kobe..."
    idolName: string;
}

export interface UserProfile {
    id?: string;
    mobile?: string;
    name: string;
    age: number;
    interests?: string[];
    roleModels?: string[];
    avatarId?: string;

    // Personality System
    traits: PersonalityTraits;
    psychologicalProfile?: PsychologicalProfile; // New deep profile
    assessmentCompleted: boolean;
}

export interface Lesson {
    id: string;        // Unique ID (usually scenarioId)
    title: string;     // e.g. "RESILIENCE"
    description: string; // The full lesson text
    source: string;    // e.g. "Frida Kahlo"
    age: number;       // e.g. 24
    date: string;      // ISO Date string

    // New: Match Result stored with the lesson
    matchResult?: MatchResult;
}

export interface Level {
    id: string;
    title: string;
    description: string;
    requiredStars: number;
    scenarioId: string; // Key into STORY_DATABASE
    status: 'locked' | 'unlocked' | 'completed';
    year: number; // e.g. 2018 (When user was 18)
    age: number;  // e.g. 18
    theme: string; // e.g. "Technology", "Art"
    personality?: string; // e.g. "Steve Jobs"
    bio?: string; // Short "About me"
    fame?: string; // "Known for..."
    achievements?: string[]; // Bullet points
    lesson?: string; // Preview of what you'll learn
    archetype: string; // e.g. "The Founder", "The Visionary"
    avatarUrl: string; // Placeholder or path to asset
    isLocked: boolean;
    stars: number; // 0-3

    // New: Idol Benchmarks
    idolTraits?: PersonalityTraits;
    idolProfile?: Partial<PsychologicalProfile>; // For deep matching
}

export interface Scenario {
    id: string;
    levelId: string;
    backgroundUrl: string;
    situationText: string;
    options: UtilityOption[];
    correctPersonalityResponse: string; // Explanation of what the personality would do
}

export interface UtilityOption {
    id: string;
    text: string;
    likenessScore: number; // 0-100 match percentage
    feedbackTitle: string;
    feedbackText: string;

    // New: Trait Modifiers (Optional for now, defaults to simple calculation)
    traitModifiers?: Partial<PersonalityTraits>;
}
