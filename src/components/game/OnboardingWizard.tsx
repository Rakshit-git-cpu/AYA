import { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { Check, Loader2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Dial Component
const AgeDial = ({ value, onChange }: { value: number; onChange: (val: number) => void }) => {
    const dialRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    
    // Map value (15 to 30) to angle (-135 to 135)
    const valToAngle = (v: number) => ((v - 15) / 15) * 270 - 135;
    
    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging || !dialRef.current) return;
            const rect = dialRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            
            let angle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
            // shift angle 0 to top
            angle = angle + 90;
            if (angle < -180) angle += 360;
            
            // Limit bounds to -135 and 135
            if (angle > 135 && angle < 180) angle = 135;
            if (angle < -135 || angle >= 180) angle = -135;
            
            let newValue = Math.round(((angle + 135) / 270) * 15 + 15);
            newValue = Math.max(15, Math.min(30, newValue));
            
            onChange(newValue);
        };

        const handleUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchend', handleUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, onChange]);

    const activeAngle = valToAngle(value);

    // Generate Path for SVG arc
    const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
        const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: cx + (r * Math.cos(angleInRadians)),
                y: cy + (r * Math.sin(angleInRadians))
            };
        };
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return [
            "M", start.x, start.y, 
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    return (
        <div 
            ref={dialRef} 
            className="relative w-48 h-48 mx-auto cursor-pointer touch-none"
            onPointerDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
            }}
        >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(0,241,254,0.3)]">
                <defs>
                    <linearGradient id="neonGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f1fe" />
                        <stop offset="100%" stopColor="#99f7ff" />
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                {/* Background Arc */}
                <path 
                    d={describeArc(100, 100, 80, -135, 135)} 
                    fill="none" 
                    stroke="#191923" 
                    strokeWidth="12" 
                    strokeLinecap="round" 
                />
                {/* Active Arc */}
                <path 
                    d={describeArc(100, 100, 80, -135, activeAngle)} 
                    fill="none" 
                    stroke="url(#neonGradient)" 
                    strokeWidth="14" 
                    strokeLinecap="round"
                    filter="url(#glow)"
                />
            </svg>
            <motion.div 
                className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none"
                animate={{ scale: isDragging ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00f1fe] to-[#99f7ff] drop-shadow-[0_0_10px_rgba(0,241,254,0.8)]">
                    {value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#acaab5] mt-1">Years</div>
            </motion.div>
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

    const handleComplete = async () => {
        if (!name.trim() || !mobile.trim()) return;
        setIsLoading(true);
        setError("");

        try {
            const { data: existingUsers, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('mobile', mobile.trim());

            if (fetchError) throw fetchError;

            if (existingUsers && existingUsers.length > 0) {
                const user = existingUsers[0];
                const { data: profiles, error: profileError } = await supabase
                    .from('personality_profiles')
                    .select('*')
                    .eq('user_id', user.id);
                    
                if (profileError) throw profileError;

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
                    localStorage.setItem('hasSeenOnboarding', 'true'); 
                    setProfile(baseProfile);
                    completeAssessment(loadedTraits as any, {
                        motivation: 'Stability', risk: 'Balanced', emotional: 'Resilient',
                        social: 'Supporter', passion: 'Creative', coreValue: 'Success'
                    });
                } else {
                    localStorage.setItem('hasSeenOnboarding', 'true'); 
                    setProfile(baseProfile);
                }
            } else {
                const { data: newUser, error: insertError } = await supabase
                    .from('users')
                    .insert([{ name: name.trim(), age: age, mobile: mobile.trim() }])
                    .select()
                    .single();

                if (insertError) throw insertError;

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
            console.error(err);
            setError(err.message || "Database error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const inputClasses = "w-full bg-[#13131c]/80 border-2 border-[#2b2b38] rounded-2xl p-4 text-[#f2effb] placeholder-[#acaab5] font-['Manrope'] font-bold focus:ring-4 focus:ring-[#00f1fe]/30 focus:border-[#00f1fe] focus:shadow-[0_0_20px_rgba(0,241,254,0.3)] outline-none transition-all duration-300";

    return (
        <div className="min-h-full flex flex-col justify-center p-6 bg-[#0d0d16] relative overflow-hidden font-['Space_Grotesk'] text-[#f2effb] perspective-1000">
            
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Diagonal Light Rays */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(0,241,254,0.03)_40%,rgba(0,241,254,0.08)_50%,transparent_60%)] MixBlendMode-screen" />
                <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_40%,rgba(213,117,255,0.05)_50%,transparent_60%)] MixBlendMode-screen" />
                
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
                            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="bg-[#191923]/60 backdrop-blur-xl p-6 rounded-3xl border border-[#2b2b38] shadow-2xl relative"
                        >
                            <div className="absolute top-0 left-6 w-12 h-[2px] bg-[#00f1fe] shadow-[0_0_10px_#00f1fe]" />
                            <label className="block text-sm font-bold text-[#f2effb] mb-3 uppercase tracking-wider">Identity</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={inputClasses}
                                placeholder="Enter your full name"
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                            className="bg-[#191923]/60 backdrop-blur-xl p-6 rounded-3xl border border-[#2b2b38] shadow-2xl relative flex flex-col items-center"
                        >
                            <div className="absolute top-0 right-6 w-12 h-[2px] bg-[#d575ff] shadow-[0_0_10px_#d575ff]" />
                            <label className="block text-sm w-full font-bold text-[#f2effb] mb-2 uppercase tracking-wider text-left">Chronology (Age)</label>
                            <AgeDial value={age} onChange={setAge} />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                            className="bg-[#191923]/60 backdrop-blur-xl p-6 rounded-3xl border border-[#2b2b38] shadow-2xl relative"
                        >
                            <div className="absolute bottom-0 left-6 w-12 h-[2px] bg-[#00f1fe] shadow-[0_0_10px_#00f1fe]" />
                            <label className="block text-sm font-bold text-[#f2effb] mb-3 uppercase tracking-wider">Access Code (Mobile)</label>
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className={inputClasses}
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
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                        disabled={!name.trim() || !mobile.trim() || isLoading}
                        onClick={handleComplete}
                        className="w-full mt-10 py-5 bg-[#00f1fe] text-[#004145] font-black text-xl rounded-full shadow-[0_0_30px_rgba(0,241,254,0.4)] flex items-center justify-center space-x-2 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#99f7ff] transition-all"
                    >
                        {/* Pulsing overlay */}
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
