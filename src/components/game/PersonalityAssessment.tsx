import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';
import { ArrowRight, Flame, Briefcase, Eye, Shield, Award, Zap, Check } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import clsx from 'clsx';
import type { PersonalityTraits, PsychologicalProfile, MotivationType, RiskAppetite, EmotionalStyle, SocialRole, PassionType, CoreValue } from '../../types/gameTypes';

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
    },
    {
        id: 'q7_interest_goal',
        text: 'What do you want most right now? (Pick up to 2)',
        icon: Flame,
        dimension: 'interest_goal',
        multiSelect: true,
        maxOptions: 2,
        options: [
            { text: '💰 Money & Financial Freedom', value: 'Money & Financial Freedom', modifiers: {} },
            { text: '🧠 Confidence & Self Belief', value: 'Confidence & Self Belief', modifiers: {} },
            { text: '❤️ Love & Deep Connections', value: 'Love & Deep Connections', modifiers: {} },
            { text: '🔥 Discipline & Focus', value: 'Discipline & Focus', modifiers: {} },
            { text: '🚀 Success & Recognition', value: 'Success & Recognition', modifiers: {} }
        ]
    },
    {
        id: 'q8_interest_struggle',
        text: 'Where do you struggle most? (Pick 1)',
        icon: Shield,
        dimension: 'interest_struggle',
        multiSelect: true,
        maxOptions: 1, // Will act as single select but utilize multiSelect's "Next" button for consistency to ensure user clicks next if they want
        options: [
            { text: 'Overthinking everything', value: 'Overthinking everything', modifiers: {} },
            { text: 'Laziness & Procrastination', value: 'Laziness & Procrastination', modifiers: {} },
            { text: 'Fear of what others think', value: 'Fear of what others think', modifiers: {} },
            { text: 'Staying consistent', value: 'Staying consistent', modifiers: {} }
        ]
    },
    {
        id: 'q9_interest_domain',
        text: 'What excites you more? (Pick up to 2)',
        icon: Zap,
        dimension: 'interest_domain',
        multiSelect: true,
        maxOptions: 2,
        options: [
            { text: '💼 Business & Entrepreneurship', value: 'Business & Entrepreneurship', modifiers: {} },
            { text: '🎨 Creativity (Music, Art, Writing)', value: 'Creativity (Music, Art, Writing)', modifiers: {} },
            { text: '💻 Tech & Innovation', value: 'Tech & Innovation', modifiers: {} },
            { text: '👑 Leadership & Impact', value: 'Leadership & Impact', modifiers: {} }
        ]
    }
];

export function PersonalityAssessment() {
    const [step, setStep] = useState(0);
    const completeAssessment = useUserStore(state => state.completeAssessment);
    const userProfile = useUserStore(state => state.profile);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [currentSelection, setCurrentSelection] = useState<any[]>([]);

    const [traits, setTraits] = useState<PersonalityTraits>({
        discipline: 50,
        resilience: 50,
        risk: 50,
        leadership: 50,
        creativity: 50,
        empathy: 50,
        vision: 50
    });

    const [profileBuilder, setProfileBuilder] = useState<Partial<PsychologicalProfile>>({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleOption = (option: any) => {
        audioSynth.playClick();
        const currentQ = QUESTIONS[step] as any;
        if (currentSelection.some(o => o.value === option.value)) {
            setCurrentSelection(currentSelection.filter(o => o.value !== option.value));
        } else {
            // Unselect if maxOptions is 1 (radio behavior)
            if (currentQ.maxOptions === 1) {
                setCurrentSelection([option]);
                return;
            }
            if (currentQ.maxOptions && currentSelection.length >= currentQ.maxOptions) {
                return;
            }
            setCurrentSelection([...currentSelection, option]);
        }
    };

    const commitAnswer = async (selectedOptions: any[]) => {
        if (isSaving) return;
        if (selectedOptions.length === 0) return;
        audioSynth.playClick();

        const currentQ = QUESTIONS[step] as any;
        const newTraits = { ...traits };

        selectedOptions.forEach(option => {
            const modifiers = option.modifiers || {};
            (Object.keys(modifiers) as Array<keyof PersonalityTraits> | any).forEach((key: string) => {
                const val = modifiers[key] || 0;
                if (key === 'adaptability') {
                    newTraits.resilience = Math.max(0, Math.min(100, newTraits.resilience + (val * 0.5)));
                    newTraits.risk = Math.max(0, Math.min(100, newTraits.risk + (val * 0.5)));
                } else if (newTraits[key as keyof PersonalityTraits] !== undefined) {
                    newTraits[key as keyof PersonalityTraits] = Math.max(0, Math.min(100, newTraits[key as keyof PersonalityTraits] + val));
                }
            });
        });

        setTraits(newTraits);

        const valueMerged = selectedOptions.map(o => o.value).join(', ');
        const textMerged = selectedOptions.map(o => o.text).join(', ');

        const newProfile = { ...profileBuilder, [currentQ.dimension]: valueMerged };
        const newAnswers = [...answers, textMerged];
        
        setProfileBuilder(newProfile);
        setAnswers(newAnswers);
        setCurrentSelection([]);

        if (step < QUESTIONS.length - 1) {
            setStep(step + 1);
        } else {
            setIsSaving(true);
            try {
                if (userProfile?.id) {
                    await supabase.from('quiz_responses').insert([{
                        user_id: userProfile.id,
                        question_1: newAnswers[0] || '',
                        question_2: newAnswers[1] || '',
                        question_3: newAnswers[2] || '',
                        question_4: newAnswers[3] || '',
                        question_5: newAnswers[4] || '',
                        question_6: newAnswers[5] || ''
                        // note: q7-q9 are not in quiz_responses schema yet based on previous code. They are stored in personality_profiles.
                    }]);

                    await supabase.from('personality_profiles').insert([{
                        user_id: userProfile.id,
                        trait_risk_taker: newTraits.risk,
                        trait_creative: newTraits.creativity,
                        trait_analytical: newTraits.vision,
                        trait_social: newTraits.empathy,
                        trait_ambitious: newTraits.leadership,
                        interest_goal: newProfile.interest_goal || '',
                        interest_struggle: newProfile.interest_struggle || '',
                        interest_domain: newProfile.interest_domain || ''
                    }]);
                }
            } catch (err) {
                console.error("Failed to save to Supabase", err);
            } finally {
                setIsSaving(false);
                if (audioSynth.playLevelComplete) audioSynth.playLevelComplete();

                const finalProfile: PsychologicalProfile = {
                    motivation: (newProfile.motivation as MotivationType) || 'Stability',
                    risk: (newProfile.risk as RiskAppetite) || 'Balanced',
                    emotional: (newProfile.emotional as EmotionalStyle) || 'Resilient',
                    social: (newProfile.social as SocialRole) || 'Supporter',
                    passion: (newProfile.passion as PassionType) || 'Creative',
                    coreValue: (newProfile.coreValue as CoreValue) || 'Success',
                    interest_goal: newProfile.interest_goal,
                    interest_struggle: newProfile.interest_struggle,
                    interest_domain: newProfile.interest_domain
                };

                completeAssessment(newTraits, finalProfile);
            }
        }
    };

    const currentQ: any = QUESTIONS[step];
    const Icon = currentQ ? currentQ.icon : Flame;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center font-sans overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-gradient-xy">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 animate-pulse-slow"></div>
                <div className="absolute top-10 left-10 w-32 md:w-48 h-32 md:h-48 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-float" />
                <div className="absolute bottom-20 right-10 w-48 md:w-64 h-48 md:h-64 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl opacity-60 animate-float animation-delay-2000" />
            </div>

            <div className={clsx(
                "relative z-10 w-full max-w-lg md:max-w-2xl flex flex-col h-full md:h-auto md:max-h-[90vh]",
                isMobile ? "justify-between" : "justify-center p-4"
            )}>
                <div className={clsx(
                    "flex flex-col bg-white/10 backdrop-blur-xl border border-white/30 shadow-2xl overflow-hidden relative transition-all duration-500",
                    isMobile ? "flex-grow pt-safe-top m-4 rounded-[2.5rem]" : "rounded-[3rem]"
                )}>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="p-6 md:p-10 pb-0 text-center flex flex-col items-center">
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

                        <div className="relative mb-6 group">
                            <div className="absolute inset-0 bg-pink-400 blur-xl opacity-50 animate-pulse group-hover:opacity-80 transition-opacity"></div>
                            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gradient-to-tr from-white to-slate-200 rounded-full flex items-center justify-center shadow-lg border-4 border-white/50 transform group-hover:scale-110 transition-transform duration-300">
                                <Icon size={36} className="text-pink-600 md:w-10 md:h-10" />
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-snug drop-shadow-md">
                            {currentQ.text}
                        </h2>
                        {isSaving && <div className="mt-4 text-white animate-pulse">Saving Profile...</div>}
                    </div>

                    <div className="p-6 md:p-10 space-y-3 md:space-y-4 pb-20">
                        {currentQ.options.map((opt: any, i: number) => {
                            const isSelected = currentSelection.some(sel => sel.value === opt.value);
                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (currentQ.multiSelect) {
                                            toggleOption(opt);
                                        } else {
                                            commitAnswer([opt]);
                                        }
                                    }}
                                    className={clsx(
                                        "group w-full relative h-[72px] md:h-[80px] rounded-2xl transition-all transform active:scale-95",
                                        isSelected ? "scale-[1.02]" : "hover:scale-[1.02]"
                                    )}
                                >
                                    <div className="absolute inset-0 bg-black/20 rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] translate-y-1"></div>
                                    <div className={clsx(
                                        "absolute inset-0 rounded-2xl flex items-center justify-between px-6 transition-all shadow-lg border-b-4",
                                        isSelected 
                                            ? "bg-pink-50 border-pink-500 ring-2 ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)]" 
                                            : "bg-white hover:bg-pink-50 border-slate-200"
                                    )}>
                                        <span className={clsx(
                                            "font-extrabold text-sm md:text-lg leading-tight text-left pr-2 transition-colors",
                                            isSelected ? "text-pink-600" : "text-slate-800 group-hover:text-pink-600"
                                        )}>
                                            {opt.text}
                                        </span>
                                        <div className={clsx(
                                            "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shrink-0",
                                            isSelected 
                                                ? "bg-pink-500 text-white shadow-md shadow-pink-500/30" 
                                                : "bg-pink-100 group-hover:bg-pink-500 group-hover:text-white"
                                        )}>
                                            {isSelected ? <Check size={16} className="md:w-5 md:h-5" /> : <ArrowRight size={16} className="md:w-5 md:h-5" />}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                        
                        {/* Multi-Select Continue Button */}
                        {currentQ.multiSelect && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={() => commitAnswer(currentSelection)}
                                    disabled={currentSelection.length === 0}
                                    className={clsx(
                                        "px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all duration-300",
                                        currentSelection.length > 0
                                            ? "bg-yellow-400 text-yellow-900 border-2 border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.5)] hover:scale-105 active:scale-95 cursor-pointer"
                                            : "bg-slate-700/50 text-slate-500 border border-slate-600 cursor-not-allowed"
                                    )}
                                >
                                    Continue
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
