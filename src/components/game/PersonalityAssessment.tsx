import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';
import { ArrowRight, Flame, Briefcase, Eye, Shield, Award, Zap } from 'lucide-react';
import clsx from 'clsx';
import type { PersonalityTraits, PsychologicalProfile, MotivationType, RiskAppetite, EmotionalStyle, SocialRole, PassionType, CoreValue } from '../../types/gameTypes';
// ---- NEW PSYCHOLOGICAL QUESTIONS (Deep Profiling) ----
const QUESTIONS = [
    {
        id: 'q1_motivation',
        text: 'When you think about your future, what excites you most?',
        icon: Flame, // Drive
        dimension: 'motivation',
        options: [
            { text: 'Creating something meaningful', value: 'Impact', modifiers: { vision: 20, creativity: 10 } },
            { text: 'Living a comfortable, stable life', value: 'Stability', modifiers: { discipline: 15, risk: -10 } },
            { text: 'Becoming admired or influential', value: 'Fame', modifiers: { leadership: 20, vision: 5 } },
            { text: 'Exploring life without fixed plans', value: 'Freedom', modifiers: { risk: 20, adaptability: 15 } }
        ]
    },
    {
        id: 'q2_risk',
        text: 'You get an opportunity that excites you but feels uncertain. What do you do?',
        icon: Eye, // Opportunity
        dimension: 'risk',
        options: [
            { text: 'Take the risk immediately', value: 'Bold', modifiers: { risk: 25, vision: 5 } },
            { text: 'Think deeply before deciding', value: 'Balanced', modifiers: { discipline: 10, vision: 10 } },
            { text: 'Avoid it and choose safety', value: 'Cautious', modifiers: { discipline: 15, risk: -20 } },
            { text: 'Try a smaller version first', value: 'Balanced', modifiers: { creativity: 10, risk: 5 } }
        ]
    },
    {
        id: 'q3_emotional',
        text: 'When something important to you fails, what happens first?',
        icon: Shield, // Resilience
        dimension: 'emotional',
        options: [
            { text: 'I feel hurt and need time to recover', value: 'Sensitive', modifiers: { empathy: 20, resilience: -5 } },
            { text: 'I get motivated to try harder', value: 'Resilient', modifiers: { resilience: 25, discipline: 10 } },
            { text: 'I analyze what went wrong', value: 'Analytical', modifiers: { vision: 15, discipline: 10 } },
            { text: 'I distract myself and move on', value: 'Avoidant', modifiers: { adaptability: 15, resilience: 5 } }
        ]
    },
    {
        id: 'q4_social',
        text: 'In a group, you usually feel like the one who…',
        icon: Briefcase, // Role
        dimension: 'social',
        options: [
            { text: 'Leads decisions', value: 'Leader', modifiers: { leadership: 25, vision: 5 } },
            { text: 'Supports others quietly', value: 'Supporter', modifiers: { empathy: 20, discipline: 5 } },
            { text: 'Observes and speaks selectively', value: 'Observer', modifiers: { vision: 15, discipline: 5 } },
            { text: 'Brings creativity or humor', value: 'Creator', modifiers: { creativity: 20, empathy: 5 } }
        ]
    },
    {
        id: 'q5_passion',
        text: 'You feel most alive when you are…',
        icon: Zap, // Energy
        dimension: 'passion',
        options: [
            { text: 'Creating or expressing ideas', value: 'Creative', modifiers: { creativity: 25, vision: 5 } },
            { text: 'Learning or discovering new things', value: 'Intellectual', modifiers: { vision: 20, discipline: 5 } },
            { text: 'Competing or improving yourself', value: 'Competitive', modifiers: { resilience: 15, leadership: 10 } },
            { text: 'Helping or connecting with people', value: 'Empathic', modifiers: { empathy: 25, leadership: 5 } }
        ]
    },
    {
        id: 'q6_values',
        text: 'If people remembered you in the future, what would matter most to you?',
        icon: Award, // Legacy
        dimension: 'coreValue',
        options: [
            { text: 'The impact I made', value: 'Impact', modifiers: { vision: 15, leadership: 10 } },
            { text: 'The creativity I showed', value: 'Art', modifiers: { creativity: 20, vision: 5 } },
            { text: 'The success I achieved', value: 'Success', modifiers: { discipline: 15, resilience: 10 } },
            { text: 'The kindness I gave', value: 'Kindness', modifiers: { empathy: 25, discipline: 5 } }
        ]
    }
];

export function PersonalityAssessment() {
    const [step, setStep] = useState(0);
    const completeAssessment = useUserStore(state => state.completeAssessment);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Initial Base Stats
    const [traits, setTraits] = useState<PersonalityTraits>({
        discipline: 50,
        resilience: 50,
        risk: 50,
        leadership: 50,
        creativity: 50,
        empathy: 50,
        vision: 50
    });

    // Profile Builder State
    const [profileBuilder, setProfileBuilder] = useState<Partial<PsychologicalProfile>>({});

    // Result State


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAnswer = (option: any) => {
        audioSynth.playClick();

        const modifiers = option.modifiers;
        const newTraits = { ...traits };

        // 1. Update Legacy Traits
        (Object.keys(modifiers) as Array<keyof PersonalityTraits> | any).forEach((key: string) => {
            const val = modifiers[key] || 0;
            // Handle mapped keys if any remain
            if (key === 'adaptability') {
                newTraits.resilience = Math.max(0, Math.min(100, newTraits.resilience + (val * 0.5)));
                newTraits.risk = Math.max(0, Math.min(100, newTraits.risk + (val * 0.5)));
            } else if (newTraits[key as keyof PersonalityTraits] !== undefined) {
                newTraits[key as keyof PersonalityTraits] = Math.max(0, Math.min(100, newTraits[key as keyof PersonalityTraits] + val));
            }
        });

        setTraits(newTraits);

        // 2. Build Deep Profile
        const currentQ = QUESTIONS[step];
        const newProfile = { ...profileBuilder, [currentQ.dimension]: option.value };
        setProfileBuilder(newProfile);

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            if (audioSynth.playLevelComplete) audioSynth.playLevelComplete();

            // Finalize Profile (Fill defaults if somehow missing)
            const finalProfile: PsychologicalProfile = {
                motivation: (newProfile.motivation as MotivationType) || 'Stability',
                risk: (newProfile.risk as RiskAppetite) || 'Balanced',
                emotional: (newProfile.emotional as EmotionalStyle) || 'Resilient',
                social: (newProfile.social as SocialRole) || 'Supporter',
                passion: (newProfile.passion as PassionType) || 'Creative',
                coreValue: (newProfile.coreValue as CoreValue) || 'Success'
            };





            // IMMEDIATE COMPLETION - No Report Here
            completeAssessment(newTraits, finalProfile);
        }
    };

    const currentQ = QUESTIONS[step];
    const Icon = currentQ ? currentQ.icon : Flame; // Safety check

    // ---- UNIFIED CANDY THEME (Responsive) ----
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center font-sans overflow-hidden bg-slate-900">
            {/* Immersive Background (Global) */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 animate-pulse-slow"></div>
                {/* Floating Orbs */}
                <div className="absolute top-10 left-10 w-32 md:w-48 h-32 md:h-48 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-float" />
                <div className="absolute bottom-20 right-10 w-48 md:w-64 h-48 md:h-64 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-float animation-delay-2000" />
            </div>

            {/* Main Container - Responsive Width */}
            <div className={clsx(
                "relative z-10 w-full max-w-lg md:max-w-2xl flex flex-col h-full md:h-auto md:max-h-[90vh]",
                isMobile ? "justify-between" : "justify-center p-4"
            )}>

                {/* Card Container (Desktop: Modal / Mobile: Full) */}
                <div className={clsx(
                    "flex flex-col bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden relative transition-all duration-500",
                    isMobile ? "flex-grow pt-safe-top m-4 rounded-[2.5rem]" : "rounded-[3rem]"
                )}>
                    {/* Gloss Effect */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Content Header */}
                    <div className="p-6 md:p-10 pb-0 text-center flex flex-col items-center">
                        {/* Progress */}
                        <div className="w-full flex items-center justify-between mb-6 md:mb-8">
                            <span className="text-white/80 font-bold uppercase tracking-widest text-xs bg-black/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                {step + 1} / {QUESTIONS.length}
                            </span>
                            <div className="flex-1 ml-4 h-3 bg-black/20 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-300 to-pink-400 shadow-[0_0_10px_rgba(255,105,180,0.5)] transition-all duration-500 ease-out"
                                    style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Icon */}
                        <div className="relative mb-6 group">
                            <div className="absolute inset-0 bg-pink-400 blur-xl opacity-50 animate-pulse group-hover:opacity-80 transition-opacity"></div>
                            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-white to-slate-200 rounded-full flex items-center justify-center shadow-lg border-4 border-white/50 transform group-hover:scale-110 transition-transform duration-300">
                                <Icon size={36} className="text-pink-600 md:w-10 md:h-10" />
                            </div>
                        </div>

                        {/* Question Text */}
                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-snug drop-shadow-md">
                            {currentQ.text}
                        </h2>
                    </div>

                    {/* Options Area */}
                    <div className="p-6 md:p-10 space-y-3 md:space-y-4">
                        {currentQ.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="group w-full relative h-[72px] md:h-[80px] rounded-2xl transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                {/* 3D Button Layer */}
                                <div className="absolute inset-0 bg-black/20 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] translate-y-1"></div>

                                {/* Main Surface */}
                                <div className="absolute inset-0 bg-white hover:bg-pink-50 rounded-2xl flex items-center justify-between px-6 transition-colors shadow-lg border-b-4 border-slate-200">
                                    <span className="text-slate-800 font-extrabold text-sm md:text-lg leading-tight text-left pr-2 group-hover:text-pink-600 transition-colors">
                                        {opt.text}
                                    </span>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-500 group-hover:text-white transition-all shrink-0">
                                        <ArrowRight size={16} className="md:w-5 md:h-5" />
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
