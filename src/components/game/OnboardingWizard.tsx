import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../utils/supabase';

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

export function OnboardingWizard() {
    const setProfile = useUserStore((state) => state.setProfile);
    const completeAssessment = useUserStore((state) => state.completeAssessment);

    const [name, setName] = useState("");
    const [age, setAge] = useState<number>(20);
    const [mobile, setMobile] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const saveSession = (user: any) => {
        try {
            localStorage.setItem('aya_user_id', user.id)
            localStorage.setItem('aya_user_mobile', user.mobile)
            localStorage.setItem('aya_user_name', user.name)
            localStorage.setItem('aya_user_age', user.age.toString())
            // Also save to sessionStorage as backup (Safari private mode)
            sessionStorage.setItem('aya_user_id', user.id)
            sessionStorage.setItem('aya_user_mobile', user.mobile)
            console.log('[Session] Saved successfully:', user.id)
        } catch (e) {
            console.error('[Session] Failed to save:', e)
        }
    }

    const handleComplete = async () => {
        if (!name.trim() || !mobile.trim() || age < 13) return;
        audioSynth.playClick();
        setIsLoading(true);
        setError("");

        console.log('[Register] Starting registration...');
        console.log('[Register] Name:', name.trim());
        console.log('[Register] Mobile:', mobile.trim());
        console.log('[Register] Age:', age);
        console.log('[Register] Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('[Register] Has Anon Key:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

        try {
            console.log('[Register] Checking if user exists...');
            const { data: existingUsers, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('mobile', mobile.trim());

            console.log('[Register] Existing users:', existingUsers);
            console.log('[Register] Fetch error:', fetchError);

            if (fetchError) throw fetchError;

            if (existingUsers && existingUsers.length > 0) {
                console.log('[Register] Returning user found, loading profile...');
                const user = existingUsers[0];
                const { data: profiles, error: profileError } = await supabase
                    .from('personality_profiles')
                    .select('*')
                    .eq('user_id', user.id);
                    
                console.log('[Register] Personality profiles:', profiles);
                console.log('[Register] Profile fetch error:', profileError);

                if (profileError) throw profileError;

                saveSession(user);
                console.log('[Register] Session saved for returning user');

                const baseProfile = {
                    id: user.id,
                    mobile: user.mobile,
                    name: user.name,
                    age: user.age,
                    interests: [],
                    roleModels: [],
                    traits: {
                        discipline: 50, resilience: 50, risk: 50,
                        leadership: 50, creativity: 50, empathy: 50, vision: 50
                    },
                    assessmentCompleted: false
                };

                if (profiles && profiles.length > 0) {
                    const p = profiles[0];
                    const loadedTraits = {
                        discipline: 50, resilience: 50, risk: p.trait_risk_taker || 50,
                        leadership: p.trait_ambitious || 50, creativity: p.trait_creative || 50, empathy: p.trait_social || 50, vision: 50,
                    };

                    baseProfile.traits = loadedTraits as any;
                    baseProfile.assessmentCompleted = true;
                    setProfile(baseProfile);
                    completeAssessment(loadedTraits as any, {
                        motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient',
                        social: 'Supporter', passion: 'Creative', coreValue: 'Success'
                    });
                } else {
                    setProfile(baseProfile);
                }
            } else {
                console.log('[Register] New user, creating account...');
                const { data: newUser, error: insertError } = await supabase
                    .from('users')
                    .insert([{ name: name.trim(), age: age, mobile: mobile.trim() }])
                    .select()
                    .single();

                console.log('[Register] New user created:', newUser);
                console.log('[Register] Insert error:', insertError);

                if (insertError) {
                    console.error('[Register] FAILED:', insertError.message, insertError.details);
                    throw insertError;
                }

                saveSession(newUser);
                console.log('[Register] Session saved for new user');

                setProfile({
                    id: newUser.id,
                    mobile: newUser.mobile,
                    name: newUser.name,
                    age: newUser.age,
                    interests: [],
                    roleModels: [],
                    traits: {
                        discipline: 50, resilience: 50, risk: 50,
                        leadership: 50, creativity: 50, empathy: 50, vision: 50
                    },
                    assessmentCompleted: false
                });
            }
        } catch (err: any) {
            console.error('[Register] Unexpected error:', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const baseInputClasses = "w-full bg-[#13131c]/80 border-2 border-[#2b2b38] rounded-2xl p-4 text-[#f2effb] placeholder-[#acaab5] font-['Manrope'] font-bold outline-none transition-all duration-300";

    return (
        <div className="min-h-full flex flex-col justify-center p-6 bg-[#0d0d16] relative overflow-hidden font-['Space_Grotesk'] text-[#f2effb] perspective-1000">
            
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
                                className="mt-4 p-4 bg-red-900/40 text-red-100 rounded-xl border border-red-500/50 backdrop-blur-md text-center font-bold"
                            >
                                <p>{error}</p>
                                <p className="text-red-300 text-xs font-normal mt-1">Please try again or check your connection.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                        disabled={!name.trim() || !mobile.trim() || isLoading}
                        onClick={handleComplete}
                        className="w-full mt-10 py-5 bg-[#00f1fe] text-[#004145] font-black text-xl rounded-full shadow-[0_0_30px_rgba(0,241,254,0.4)] flex items-center justify-center space-x-2 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#99f7ff] transition-all"
                    >
                        <motion.div 
                            className="absolute inset-0 bg-white"
                            animate={{ opacity: [0, 0.4, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="relative z-10">{isLoading ? 'INITIALIZING...' : 'START MY JOURNEY'}</span>
                        {!isLoading && <Check size={28} className="relative z-10 stroke-[4]" />}
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
