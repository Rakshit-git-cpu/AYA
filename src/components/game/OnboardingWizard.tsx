import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { withTimeout } from '../../utils/withTimeout';
import { saveSession } from '../../utils/session';

import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

// Horizontal Drag Strip for Age
const AgeDial = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
    const MIN = 13;
    const MAX = 25;
    const TICK_WIDTH = 40; 
    
    const dragRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    // Sync external value to visual position when not dragging
    useEffect(() => {
        const targetX = -(value - MIN) * TICK_WIDTH;
        animate(x, targetX, { type: "spring", stiffness: 300, damping: 30 });
    }, [value, x]);

    const handleDragEnd = () => {
        const currentX = x.get();
        let targetIndex = Math.round(-currentX / TICK_WIDTH);
        
        targetIndex = Math.max(0, Math.min(MAX - MIN, targetIndex));
        
        const newValue = MIN + targetIndex;
        onChange(newValue);
    };

    const handleNudge = (direction: -1 | 1) => {
        audioSynth.playClick();
        const newValue = Math.max(MIN, Math.min(MAX, value + direction));
        onChange(newValue);
    };

    const ticks = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

    return (
        <div className="relative w-full max-w-sm mx-auto flex flex-col items-center">
            
            {/* Header / Number Display */}
            <div className="flex items-center justify-between w-full mb-6">
                <button 
                    onClick={() => handleNudge(-1)} 
                    className="p-3 bg-[#191923]/80 rounded-2xl hover:bg-[#2b2b38] transition-colors text-[#acaab5] hover:text-[#00f1fe]"
                >
                    <ChevronLeft size={24} />
                </button>
                
                <div className="flex flex-col items-center relative">
                    <motion.div 
                        key={value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f1fe] to-[#99f7ff] tracking-tight drop-shadow-[0_0_15px_rgba(0,241,254,0.6)]"
                    >
                        {value}
                    </motion.div>
                    <span className="text-xs uppercase tracking-[0.3em] text-[#00f1fe] absolute -bottom-4 font-bold opacity-80">Years</span>
                </div>

                <button 
                    onClick={() => handleNudge(1)} 
                    className="p-3 bg-[#191923]/80 rounded-2xl hover:bg-[#2b2b38] transition-colors text-[#acaab5] hover:text-[#00f1fe]"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Ruler Track */}
            <div className="relative w-full h-24 overflow-hidden mask-horizontal-fade mt-4 touch-none">
                {/* Center Indicator */}
                <div className="absolute top-0 left-1/2 -ml-[2px] w-1 h-full bg-[#00f1fe] shadow-[0_0_15px_#00f1fe] z-10 rounded-full" />
                
                <motion.div 
                    ref={dragRef}
                    drag="x"
                    dragConstraints={{ 
                        left: -((MAX - MIN) * TICK_WIDTH), 
                        right: 0 
                    }}
                    style={{ x }}
                    onDragEnd={handleDragEnd}
                    className="absolute top-0 left-1/2 flex items-end h-full cursor-grab active:cursor-grabbing"
                >
                    {ticks.map((tick) => (
                        <div 
                            key={tick} 
                            style={{ width: TICK_WIDTH }} 
                            className="flex flex-col items-center justify-end h-full pb-4 shrink-0"
                        >
                            <div className={`w-1 rounded-t-full transition-all duration-300 ${tick === value ? 'h-8 bg-[#00f1fe] shadow-[0_0_10px_#00f1fe]' : (tick % 5 === 0 ? 'h-6 bg-[#acaab5]' : 'h-4 bg-[#2b2b38]')}`} />
                            <span className={`text-[10px] mt-2 font-bold transition-colors ${tick === value ? 'text-[#00f1fe]' : 'text-[#76747f]'}`}>
                                {tick % 5 === 0 ? tick : ''}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
            
        </div>
    );
};

const registerUser = async (name: string, mobile: string, age: number) => {
    const cleanMobile = mobile.trim().replace(/\s+/g, '');
    // First verify Supabase is reachable at all
    try {
        const { error: pingError } = await withTimeout(
            supabase.from('users').select('id').limit(1),
            10000,
            'Cannot reach server'
        );
        if (pingError && pingError.message !== 'Cannot reach server') {
            console.log('[Register] Supabase reachable, proceeding...');
        }
    } catch (pingErr: any) {
        if (pingErr.message === 'Cannot reach server') {
            throw new Error('Cannot reach server. Please check your connection.');
        }
    }

    let retries = 3;

    while (retries > 0) {
        try {
            // Step 1: Check if user already exists
            const { data: existing, error: fetchErr } = await withTimeout(
                supabase
                    .from('users')
                    .select('*')
                    .eq('mobile', cleanMobile)
                    .maybeSingle(),
                8000
            );

            if (fetchErr && fetchErr.code !== 'PGRST116') {
                retries--;
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }

            if (existing) {
                saveSession(existing);
                
                // Check if they completed quiz
                const { data: quizData } = await withTimeout(
                    supabase.from('quiz_responses').select('id').eq('user_id', existing.id).maybeSingle(),
                    5000
                ).catch(() => ({ data: null }));

                return { user: existing, isNew: false, hasCompletedQuiz: !!quizData };
            }

            // Step 2: Insert new user
            const { data: newUser, error: insertErr } = await withTimeout(
                supabase
                    .from('users')
                    .insert([{
                        name: name.trim(),
                        mobile: cleanMobile,
                        age: Number(age),
                        total_xp: 0,
                        level: 1,
                        current_streak: 0,
                        longest_streak: 0,
                        stories_completed: 0,
                        daily_spins_used: 0,
                        spin_reset_date: new Date().toISOString().split('T')[0],
                    }])
                    .select()
                    .single(),
                8000
            );

            if (insertErr) {
                // Handle duplicate mobile race condition
                if (insertErr.code === '23505') {
                    const { data: existing2 } = await withTimeout(
                        supabase.from('users').select('*').eq('mobile', cleanMobile).maybeSingle(),
                        5000
                    );
                    if (existing2) {
                        saveSession(existing2);
                        return { user: existing2, isNew: false, hasCompletedQuiz: false };
                    }
                }
                retries--;
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }

            if (!newUser) {
                retries--;
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }

            saveSession(newUser);
            return { user: newUser, isNew: true, hasCompletedQuiz: false };

        } catch (err: any) {
            retries--;
            if (retries > 0) await new Promise(r => setTimeout(r, 1000));
        }
    }

    throw new Error('Registration failed after 3 attempts. Please check your connection.');
};

export function OnboardingWizard() {
    const setProfile = useUserStore((state) => state.setProfile);
    const completeAssessment = useUserStore((state) => state.completeAssessment);

    const [name, setName] = useState("");
    const [age, setAge] = useState<number>(20);
    const [mobile, setMobile] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Hard 20-second escape hatch — never leave user on spinner forever
    useEffect(() => {
        if (!isLoading) return;
        const fallback = setTimeout(() => {
            setIsLoading(false);
            setIsSubmitting(false);
            setError('Connection failed. Please try again.');
        }, 20000);
        return () => clearTimeout(fallback);
    }, [isLoading]);

    const handleRetry = () => {
        setError("");
        setIsLoading(false);
        setIsSubmitting(false);
    };

    const handleComplete = async () => {
        if (!name.trim() || !mobile.trim() || age < 13) return;
        if (isSubmitting) return;

        audioSynth.playClick();
        setIsSubmitting(true);
        setIsLoading(true);
        setError("");

        try {
            const result = await registerUser(name, mobile, age);
            const user = result.user;

            // Load personality profile if returning user
            let profileData = null;
            if (!result.isNew) {
                try {
                    const { data } = await withTimeout(
                        supabase
                            .from('personality_profiles')
                            .select('*')
                            .eq('user_id', user.id)
                            .maybeSingle(),
                        5000
                    );
                    profileData = data;
                } catch {}
            }

            const baseProfile = {
                id: user.id,
                mobile: user.mobile,
                name: user.name,
                age: user.age,
                total_xp: user.total_xp || 0,
                level: user.level || 1,
                current_streak: user.current_streak || 0,
                longest_streak: user.longest_streak || 0,
                stories_completed: user.stories_completed || 0,
                daily_challenge_completed: user.daily_challenge_completed || false,
                interests: [],
                roleModels: [],
                traits: {
                    discipline: 50, resilience: 50, risk: 50,
                    leadership: 50, creativity: 50, empathy: 50, vision: 50
                },
                assessmentCompleted: false
            };

            if (profileData || result.hasCompletedQuiz) {
                const loadedTraits = {
                    discipline: 50, resilience: 50,
                    risk: profileData?.trait_risk_taker || 50,
                    leadership: profileData?.trait_ambitious || 50,
                    creativity: profileData?.trait_creative || 50,
                    empathy: profileData?.trait_social || 50,
                    vision: 50,
                };
                baseProfile.traits = loadedTraits as any;
                baseProfile.assessmentCompleted = true;
                setProfile(baseProfile as any);
                completeAssessment(loadedTraits as any, {
                    motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient',
                    social: 'Supporter', passion: 'Creative', coreValue: 'Success'
                });
            } else if (!result.isNew && !result.hasCompletedQuiz) {
                // Returning user who never finished quiz -> skip cinematic intro
                localStorage.setItem('aya_skip_intro', 'true');
                setProfile(baseProfile as any);
            } else {
                setProfile(baseProfile as any);
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
            setIsSubmitting(false);
            setIsLoading(false);
        }
    };

    const baseInputClasses = "w-full bg-[#13131c]/80 border-2 border-[#2b2b38] rounded-2xl p-4 text-[#f2effb] placeholder-[#acaab5] font-['Manrope'] font-bold outline-none transition-all duration-300";

    return (
        <div className="login-container bg-[#0d0d16] relative font-['Space_Grotesk'] text-[#f2effb] perspective-1000">
            
            <style dangerouslySetInnerHTML={{__html: `
                .mask-horizontal-fade {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
            `}} />

            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Diagonal Light Rays */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(0,241,254,0.03)_40%,rgba(0,241,254,0.08)_50%,transparent_60%)] MixBlendMode-screen" />
                <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_40%,rgba(147,51,234,0.05)_50%,transparent_60%)] MixBlendMode-screen" />
                
                {/* Floating Particles */}
                {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-[#00f1fe] rounded-full"
                        style={{ filter: 'blur(1px)' }}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: Math.random() * 0.5 + 0.1
                        }}
                        animate={{
                            y: [null, Math.random() * window.innerHeight],
                            opacity: [0.1, 0.6, 0.1]
                        }}
                        transition={{
                            duration: Math.random() * 8 + 8,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 max-w-md mx-auto w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#0f0f18] text-white drop-shadow-[0_0_20px_rgba(0,241,254,0.4)] text-center mb-10 leading-tight">
                        Let's get to <br/> know you!
                    </h2>
                    
                    <div className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-[#191923]/60 backdrop-blur-xl p-6 rounded-3xl border border-[#2b2b38] shadow-2xl relative"
                        >
                            <label className="block text-sm font-bold text-[#f2effb] mb-3 uppercase tracking-wider">Identity</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`${baseInputClasses} focus:ring-4 focus:ring-[#9333ea]/30 focus:border-[#9333ea] focus:shadow-[0_0_20px_rgba(147,51,234,0.3)]`}
                                placeholder="Enter your full name"
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="bg-[#191923]/60 backdrop-blur-xl p-6 pt-8 rounded-3xl border border-[#2b2b38] shadow-2xl relative flex flex-col items-center"
                        >
                            <AgeDial value={age} onChange={setAge} />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                            className="bg-[#191923]/60 backdrop-blur-xl p-6 rounded-3xl border border-[#2b2b38] shadow-2xl relative"
                        >
                            <label className="block text-sm font-bold text-[#f2effb] mb-3 uppercase tracking-wider">Access Code (Mobile)</label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className={`${baseInputClasses} focus:ring-4 focus:ring-[#00f1fe]/30 focus:border-[#00f1fe] focus:shadow-[0_0_20px_rgba(0,241,254,0.3)]`}
                                placeholder="E.g. 9876543210"
                            />
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="mt-4"
                            >
                                <div style={{
                                    background: 'rgba(255,0,0,0.15)',
                                    border: '1px solid rgba(255,0,0,0.3)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    color: '#FF6B6B',
                                    fontSize: '14px',
                                    textAlign: 'center',
                                    lineHeight: '1.5',
                                }}>
                                    {error}
                                    <br />
                                    <button
                                        onClick={handleRetry}
                                        style={{
                                            marginTop: '10px',
                                            background: 'none',
                                            border: '1px solid #FF6B6B',
                                            borderRadius: '8px',
                                            color: '#FF6B6B',
                                            padding: '8px 20px',
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                            touchAction: 'manipulation',
                                        }}
                                    >
                                        TRY AGAIN
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                        disabled={!name.trim() || !mobile.trim() || isSubmitting}
                        onClick={handleComplete}
                        style={{ pointerEvents: isSubmitting ? 'none' : 'auto', opacity: isSubmitting ? 0.7 : 1 }}
                        className="w-full mt-10 py-5 bg-[#00f1fe] text-[#004145] font-black text-xl rounded-full shadow-[0_0_30px_rgba(0,241,254,0.4)] flex items-center justify-center space-x-2 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#99f7ff] transition-all"
                    >
                        <motion.div 
                            className="absolute inset-0 bg-white"
                            animate={{ opacity: [0, 0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="relative z-10">{isSubmitting ? 'LOADING...' : 'START MY JOURNEY'}</span>
                        {!isSubmitting && <Check size={28} className="relative z-10 stroke-[4]" />}
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
