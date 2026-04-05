import { useState, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';
import { Flame, Briefcase, Eye, Shield, Award, Zap, Check } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';
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
        maxOptions: 1, 
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

// Helper to generate some shapes
const SHAPES = ['triangle', 'hexagon', 'diamond'];

export function PersonalityAssessment() {
    const [step, setStep] = useState(0);
    const completeAssessment = useUserStore(state => state.completeAssessment);
    const userProfile = useUserStore(state => state.profile);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [currentSelection, setCurrentSelection] = useState<any[]>([]);

    const [traits, setTraits] = useState<PersonalityTraits>({
        discipline: 50, resilience: 50, risk: 50, leadership: 50, creativity: 50, empathy: 50, vision: 50
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
            if (currentQ.maxOptions === 1 || !currentQ.multiSelect) {
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

    const isViolet = step < 6;
    const isCyan = step >= 6;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center font-sans overflow-hidden transition-colors duration-1000 bg-[#0d0d16]">
            
            {/* Background Layer */}
            <div className={`absolute inset-0 bg-[#0d0d16] pointer-events-none transition-opacity duration-1000 z-0`}>
                <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] z-20 pointer-events-none" />
                
                {isViolet && (
                    <>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(147,51,234,0.06)_40%,rgba(147,51,234,0.12)_50%,transparent_60%)] MixBlendMode-screen" />
                        <div className="absolute inset-0 bg-[linear-gradient(-35deg,transparent_30%,rgba(168,85,247,0.08)_40%,transparent_50%)] MixBlendMode-screen" />
                        
                        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-30 MixBlendMode-screen" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)' }} />
                        
                        {/* 3D Floating Geometry Array */}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <motion.div
                                key={`geo-${i}`}
                                className="absolute MixBlendMode-screen opacity-20 border border-purple-500 rounded-sm"
                                style={{ 
                                    width: Math.random() * 50 + 20, 
                                    height: Math.random() * 50 + 20,
                                    clipPath: SHAPES[i%3] === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : SHAPES[i%3] === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' 
                                }}
                                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, rotateZ: Math.random() * 360, rotateX: Math.random() * 360, rotateY: Math.random() * 360 }}
                                animate={{ y: [null, Math.random() * window.innerHeight], rotateZ: '+=180', rotateY: '+=180' }}
                                transition={{ duration: Math.random() * 20 + 20, repeat: Infinity, ease: 'linear' }}
                            />
                        ))}

                        {/* Parallax Particles */}
                        {Array.from({ length: 40 }).map((_, i) => (
                            <motion.div
                                key={`p-${i}`}
                                className="absolute rounded-full bg-[#a855f7] drop-shadow-[0_0_5px_#a855f7]"
                                style={{ 
                                    width: i % 3 === 0 ? 3 : 1.5, 
                                    height: i % 3 === 0 ? 3 : 1.5, 
                                    filter: `blur(${i % 3 === 0 ? 0 : 2}px)` 
                                }}
                                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: Math.random() * 0.5 + 0.1 }}
                                animate={{ y: [null, Math.random() * window.innerHeight - 500], opacity: [0.1, 0.8, 0.1] }}
                                transition={{ duration: (i % 3 === 0 ? 10 : 20) + Math.random() * 5, repeat: Infinity, ease: "linear" }}
                            />
                        ))}

                        {/* Large Background Silhouette varying by step */}
                        <motion.div
                            key={`sil-${step}`}
                            initial={{ opacity: 0, scale: 0.8, x: -50 }}
                            animate={{ opacity: 0.15, scale: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5 }}
                            className="absolute top-10 right-10 w-96 h-96 bg-[#9333ea] rounded-[40px] blur-[60px] mix-blend-overlay border-[4px] border-[#d8b4fe]"
                            style={{ 
                                clipPath: step % 2 === 0 ? 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' : 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                                borderRadius: `${(step * 10) + 10}%`
                            }}
                        />
                    </>
                )}

                {isCyan && (
                     <>
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(0,241,254,0.03)_40%,rgba(0,241,254,0.08)_50%,transparent_60%)] MixBlendMode-screen" />
                        <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_40%,rgba(213,117,255,0.05)_50%,transparent_60%)] MixBlendMode-screen" />
                        {Array.from({ length: 30 }).map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-[#00f1fe] rounded-full drop-shadow-[0_0_5px_#00f1fe]"
                                style={{ filter: 'blur(1px)' }}
                                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: Math.random() * 0.5 + 0.1 }}
                                animate={{ y: [null, Math.random() * window.innerHeight], opacity: [0.1, 0.6, 0.1] }}
                                transition={{ duration: Math.random() * 8 + 8, repeat: Infinity, ease: "linear" }}
                            />
                        ))}
                    </>
                )}
            </div>

            <div className={clsx(
                "relative z-10 w-full max-w-lg md:max-w-2xl flex flex-col h-full md:h-auto md:max-h-[90vh]",
                isMobile ? "justify-between" : "justify-center p-4",
                "perspective-1000"
            )}>
                <motion.div 
                    key={`card-${step}`}
                    initial={{ opacity: 0, y: 50, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.6, type: "spring", damping: 20 }}
                    className={clsx(
                        "flex flex-col overflow-hidden relative transition-all duration-700 backdrop-blur-2xl bg-[#13131c]/80 shadow-2xl",
                        isViolet ? "border border-[#9333ea]/50 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(147,51,234,0.4)] md:h-[85vh]" : "border border-[#00f1fe]/30 shadow-[0_0_40px_rgba(0,241,254,0.15)] md:h-[85vh]",
                        isMobile ? "flex-grow pt-safe-top m-4 rounded-[2.5rem]" : "rounded-[3rem]"
                    )}
                >
                    <div className="p-6 md:p-10 pb-0 text-center flex flex-col items-center shrink-0">
                        {/* Progress Header */}
                        <div className="w-full flex items-center justify-between mb-6 md:mb-8">
                            <span className={clsx(
                                "font-bold uppercase tracking-widest text-xs px-3 py-1 rounded-full backdrop-blur-md transition-colors duration-500 border shadow-lg",
                                isViolet ? "text-[#e9d5ff] border-[#a855f7] bg-[#581c87]/50 shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "text-[#99f7ff] border-[#00f1fe]/50 bg-[#004145]/50 shadow-[0_0_10px_rgba(0,241,254,0.3)]"
                            )}>
                                {step + 1} / {QUESTIONS.length}
                            </span>
                            <div className="flex-1 ml-4 h-3 rounded-full overflow-hidden border bg-[#191923] border-white/10 relative">
                                <motion.div
                                    className={clsx(
                                        "absolute top-0 left-0 h-full transition-all duration-500 ease-out",
                                        isViolet ? "bg-gradient-to-r from-[#7e22ce] to-[#c084fc] shadow-[0_0_20px_rgba(192,132,252,0.8)]" : "bg-gradient-to-r from-[#00b4d8] to-[#00f1fe] shadow-[0_0_15px_rgba(0,241,254,0.8)]"
                                    )}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Icon Badge */}
                        <div className="relative mb-6 group">
                            <div className={clsx(
                                "absolute inset-0 blur-xl opacity-60 animate-pulse transition-opacity duration-700 rounded-full",
                                isViolet ? "bg-[#c084fc]" : "bg-[#00f1fe]"
                            )}></div>
                            <div className={clsx(
                                "relative w-24 h-24 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-4 z-10",
                                isViolet ? "bg-[#3b0764] border-[#9333ea] shadow-[0_0_30px_rgba(147,51,234,0.6)]" : "bg-slate-950 border-[#00f1fe] shadow-[0_0_20px_rgba(0,241,254,0.4)]"
                            )}>
                                <Icon size={40} className={clsx(
                                    "transition-colors", 
                                    isViolet ? "text-[#e9d5ff] drop-shadow-[0_0_10px_#e9d5ff]" : "text-[#00f1fe] drop-shadow-[0_0_8px_rgba(0,241,254,0.8)]"
                                )} />
                                {/* Rotating Ring */}
                                {isViolet && (
                                    <motion.div 
                                        className="absolute inset-[-8px] border border-[#d8b4fe]/30 rounded-full border-t-[#d8b4fe]"
                                        animate={{ rotateZ: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                    />
                                )}
                            </div>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black mb-2 leading-snug drop-shadow-md text-white">
                            <span className={clsx("drop-shadow-lg", isViolet ? "drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] text-[#faf5ff]" : "text-[#f2effb]")}>
                                {currentQ.text}
                            </span>
                        </h2>
                        {isSaving && <div className={clsx("mt-4 animate-pulse uppercase tracking-widest text-sm font-bold", isViolet ? "text-[#c084fc]" : "text-[#00f1fe]")}>Saving Profile...</div>}
                    </div>

                    <div className="flex-1 min-h-0 px-6 md:px-10 pb-8 pt-4 space-y-4 overflow-y-auto scrollbar-thin scroll-smooth [transform-style:preserve-3d]">
                        <AnimatePresence>
                            {currentQ.options.map((opt: any, i: number) => {
                                const isSelected = currentSelection.some(sel => sel.value === opt.value);
                                return (
                                    <motion.button
                                        key={`${step}-${i}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                                        whileHover={{ y: -8, z: 20 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            if (currentQ.multiSelect || isViolet || isCyan) {
                                                toggleOption(opt);
                                            } else {
                                                commitAnswer([opt]);
                                            }
                                        }}
                                        className={clsx(
                                            "group w-full relative h-[72px] md:h-[80px] rounded-2xl transition-all transform flex items-center",
                                            isSelected ? "scale-[1.03] z-20" : ""
                                        )}
                                    >
                                        <div className={clsx(
                                            "absolute inset-0 rounded-2xl flex items-center justify-between px-6 transition-all shadow-xl overflow-hidden backdrop-blur-md",
                                            isViolet ? (
                                                isSelected
                                                    ? "bg-[#3b0764] border-2 border-[#d8b4fe] shadow-[0_0_30px_rgba(168,85,247,0.8),0_15px_30px_rgba(0,0,0,0.8)]"
                                                    : "bg-[#1f1f2a]/80 border border-[#4c1d95] hover:border-[#a855f7] hover:shadow-[0_15px_30px_rgba(147,51,234,0.3)]"
                                            ) : (
                                                isSelected
                                                    ? "bg-slate-800 border-[3px] border-[#00f1fe] shadow-[0_0_30px_rgba(0,241,254,0.8),inset_0_0_10px_rgba(0,241,254,0.3)]"
                                                    : "bg-slate-900/80 border border-slate-700 hover:border-[#00f1fe]/50 hover:bg-slate-800"
                                            )
                                        )}>
                                            {/* Accent Line */}
                                            {isViolet && !isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7e22ce] opacity-50 group-hover:opacity-100 group-hover:bg-[#c084fc] transition-colors" />}

                                            <span className={clsx(
                                                "font-extrabold text-sm md:text-lg leading-tight text-left pr-2 transition-colors relative z-10",
                                                isViolet ? (
                                                    isSelected ? "text-[#faf5ff] drop-shadow-[0_0_8px_#c084fc]" : "text-[#acaab5] group-hover:text-[#e9d5ff]"
                                                ) : (
                                                    isSelected ? "text-[#99f7ff] drop-shadow-[0_0_5px_rgba(0,241,254,0.8)]" : "text-slate-300 group-hover:text-[#ccfbfb]"
                                                )
                                            )}>
                                                {opt.text}
                                            </span>
                                            
                                            {isSelected && (
                                                <motion.div 
                                                    initial={{ scale: 0, rotate: -90 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    className={clsx(
                                                        "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all shrink-0 z-10",
                                                        isViolet ? "bg-[#c084fc] text-[#3b0764] shadow-[0_0_20px_#c084fc]" : "bg-[#00f1fe] text-slate-900 shadow-[0_0_15px_rgba(0,241,254,1)]"
                                                    )}
                                                >
                                                    <Check size={20} className="md:w-6 md:h-6 stroke-[3]" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Fixed Footer for Continue Button */}
                    <AnimatePresence>
                        {currentSelection.length > 0 && (
                            <motion.div 
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className={clsx(
                                    "shrink-0 w-full px-6 md:px-10 pb-6 md:pb-8 pt-4 border-t backdrop-blur-3xl z-50",
                                    isViolet ? "border-[#9333ea]/30 bg-[#1e1b4b]/90" : "border-[#00f1fe]/30 bg-[#082f49]/90"
                                )}
                            >
                                <button
                                    onClick={() => commitAnswer(currentSelection)}
                                    className={clsx(
                                        "w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all duration-300 transform relative overflow-hidden group",
                                        isViolet 
                                            ? "bg-gradient-to-r from-[#9333ea] to-[#c084fc] text-white shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:brightness-110 active:scale-95 cursor-pointer"
                                            : "bg-[#00f1fe] text-[#004145] shadow-[0_0_25px_rgba(0,241,254,0.7)] hover:bg-[#99f7ff] active:scale-95 cursor-pointer"
                                    )}
                                >
                                    <motion.div 
                                        className="absolute inset-0 bg-white/20"
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                    NEXT &rarr;
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
