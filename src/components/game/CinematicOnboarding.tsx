import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../utils/supabase';
import { Brain, Gamepad2, Dna, ChevronRight, Check } from 'lucide-react';

const STRUGGLES = [
  { id: 'heartbreak', label: 'Heartbreak & Relationships', icon: '💔' },
  { id: 'motivation', label: 'Motivation & Drive', icon: '⚡' },
  { id: 'confidence', label: 'Confidence & Fear', icon: '😰' },
  { id: 'money', label: 'Money & Ambition', icon: '💰' },
  { id: 'purpose', label: 'Finding My Purpose', icon: '🎯' },
  { id: 'loneliness', label: 'Loneliness & Connection', icon: '🌙' },
];

export function CinematicOnboarding({ onComplete }: { onComplete: () => void }) {
  const profile = useUserStore((state) => state.profile);
  const [slide, setSlide] = useState(1);
  const [selectedStruggle, setSelectedStruggle] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const nextSlide = () => setSlide((prev) => Math.min(prev + 1, 4));
  const prevSlide = () => setSlide((prev) => Math.max(prev - 1, 1));

  const handleFinish = async () => {
    if (slide === 3 && selectedStruggle && profile?.id) {
      setIsSaving(true);
      try {
        await supabase
          .from('users')
          .update({ 
            daily_struggle: selectedStruggle, 
            last_struggle_update: new Date().toISOString() 
          })
          .eq('mobile', profile.mobile);
      } catch (e) {
        console.error('Failed to save struggle', e);
      }
      setIsSaving(false);
      nextSlide();
    } else if (slide === 4) {
      onComplete();
    } else {
      nextSlide();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="w-full h-screen bg-[#0d0d16] text-[#f2effb] overflow-hidden relative font-['Space_Grotesk',sans-serif] perspective-1000">
      
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         <motion.div 
           className="absolute -top-[20%] -left-[10%] w-[140%] h-[140%] opacity-20 MixBlendMode-screen"
           animate={{
               background: [
                   'radial-gradient(circle at 20% 30%, rgba(153, 247, 255, 0.4) 0%, transparent 40%)',
                   'radial-gradient(circle at 80% 70%, rgba(213, 117, 255, 0.4) 0%, transparent 40%)',
                   'radial-gradient(circle at 20% 30%, rgba(153, 247, 255, 0.4) 0%, transparent 40%)'
               ]
           }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
         />
         {/* Particles */}
         {Array.from({ length: 30 }).map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-1 h-1 bg-white rounded-full opacity-50"
               initial={{
                   x: Math.random() * window.innerWidth,
                   y: Math.random() * window.innerHeight,
                   z: Math.random() * 500 - 250
               }}
               animate={{
                   y: [null, Math.random() * window.innerHeight],
                   opacity: [0, 0.8, 0]
               }}
               transition={{
                   duration: Math.random() * 5 + 5,
                   repeat: Infinity,
                   ease: "linear"
               }}
             />
         ))}
      </div>

      {/* Top Navigation */}
      <div className="absolute top-6 left-0 w-full px-8 z-50 flex justify-between items-center">
        {slide > 1 && slide < 4 && (
           <button onClick={prevSlide} className="text-[#acaab5] hover:text-[#99f7ff] transition-colors text-sm uppercase tracking-widest font-bold">
               ← Back
           </button>
        )}
        {(slide === 1 || slide === 2) && (
           <button onClick={handleSkip} className="ml-auto text-[#acaab5] hover:text-[#99f7ff] transition-colors text-sm uppercase tracking-widest font-bold">
               Skip
           </button>
        )}
      </div>

      {/* Main Slide Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* SLIDE 1: The Hook */}
          {slide === 1 && (
            <motion.div
              key="slide1"
              initial={{ opacity: 0, x: 100, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-4xl"
            >
              <div className="space-y-8 [transform-style:preserve-3d]">
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                   className="text-2xl md:text-4xl font-light text-white/80"
                 >
                    "At 20, <span className="font-bold text-[#99f7ff] drop-shadow-[0_0_10px_rgba(153,247,255,0.8)]">Kobe Bryant</span> was already training at 4AM."
                 </motion.p>
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                   className="text-xl md:text-3xl font-light text-white/80"
                 >
                    "At 19, <span className="font-bold text-[#d575ff] drop-shadow-[0_0_10px_rgba(213,117,255,0.8)]">Shah Rukh Khan</span> was performing in small Delhi theatres."
                 </motion.p>
                 <motion.h1 
                   initial={{ opacity: 0, scale: 0.9, z: 100 }} animate={{ opacity: 1, scale: 1, z: 0 }} transition={{ delay: 1.2, duration: 1 }}
                   className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#ffaa00] drop-shadow-[0_0_20px_rgba(255,215,0,0.4)] mt-12 mb-4"
                 >
                    What were YOU meant to become?
                 </motion.h1>
                 <motion.p 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                   className="text-[#acaab5] text-xl font-['Manrope',sans-serif] uppercase tracking-widest mt-6"
                 >
                    Find out by stepping into their shoes.
                 </motion.p>

                 <motion.button
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
                   onClick={nextSlide}
                   className="mt-16 px-12 py-5 bg-transparent border border-[#00f1fe] text-[#99f7ff] rounded-full text-xl font-bold uppercase tracking-wider relative overflow-hidden group hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,241,254,0.2)] hover:shadow-[0_0_50px_rgba(0,241,254,0.6)]"
                 >
                   <span className="relative z-10 flex items-center gap-2">Let's Find Out <ChevronRight /></span>
                   <div className="absolute inset-0 bg-[#00f1fe] opacity-0 group-hover:opacity-20 transition-opacity" />
                 </motion.button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: How It Works */}
          {slide === 2 && (
            <motion.div
              key="slide2"
              initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl w-full"
            >
              <h2 className="text-4xl md:text-6xl font-black text-center mb-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">How AYA Works</h2>
              <div className="space-y-6">
                 {[
                   { icon: Brain, title: "Answer 9 quick questions", desc: "We build your psychological personality profile." },
                   { icon: Gamepad2, title: "Step into a legend's shoes", desc: "Make their real decisions in interactive scenarios." },
                   { icon: Dna, title: "Discover your Personality DNA", desc: "See who you were truly meant to become." }
                 ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 50, rotateX: 20 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ delay: 0.3 * idx, type: "spring" }}
                      className="flex items-center gap-6 bg-[#1f1f2a]/60 backdrop-blur-xl p-8 rounded-3xl border border-[#2b2b38] shadow-2xl group hover:border-[#00f1fe] transition-colors"
                      style={{ perspective: 1000 }}
                      whileHover={{ scale: 1.02, rotateY: 2, rotateX: -2 }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#00f1fe]/10 flex items-center justify-center border border-[#00f1fe]/30 group-hover:shadow-[0_0_20px_rgba(0,241,254,0.4)] transition-all">
                         <step.icon className="w-8 h-8 text-[#99f7ff]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{step.title} &rarr;</h3>
                        <p className="text-[#acaab5] font-['Manrope']">{step.desc}</p>
                      </div>
                    </motion.div>
                 ))}
              </div>
              <div className="flex justify-center mt-16">
                 <button onClick={nextSlide} className="px-10 py-5 bg-[#00f1fe] text-[#004145] rounded-full text-xl font-bold uppercase tracking-wider hover:bg-[#99f7ff] transition-all shadow-[0_0_30px_rgba(0,241,254,0.4)] flex items-center gap-2">
                    Sounds Good <ChevronRight />
                 </button>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: Daily Struggle */}
          {slide === 3 && (
            <motion.div
              key="slide3"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="max-w-5xl w-full text-center"
            >
              <h2 className="text-4xl md:text-5xl font-black mb-4">What's on your mind lately?</h2>
              <p className="text-xl text-[#acaab5] mb-12 font-['Manrope']">We'll suggest the perfect story for you today</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
                 {STRUGGLES.map((strug, idx) => (
                    <motion.button
                      key={strug.id}
                      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5, z: 50 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedStruggle(strug.label)}
                      className={`relative p-8 rounded-3xl backdrop-blur-xl border-2 transition-all flex flex-col items-center gap-4 ${
                          selectedStruggle === strug.label 
                          ? 'bg-[#d575ff]/20 border-[#fe00fe] shadow-[0_0_30px_rgba(254,0,254,0.4)]' 
                          : 'bg-[#191923]/60 border-[#2b2b38] hover:border-[#00f1fe] hover:shadow-[0_0_20px_rgba(0,241,254,0.2)]'
                      }`}
                    >
                       <span className="text-5xl">{strug.icon}</span>
                       <span className="text-xl font-bold">{strug.label}</span>
                       {selectedStruggle === strug.label && (
                           <div className="absolute top-4 right-4 text-[#fe00fe]"><Check size={24} /></div>
                       )}
                    </motion.button>
                 ))}
              </div>

              <div className="flex flex-col items-center mt-16 space-y-4">
                 <button 
                   disabled={!selectedStruggle || isSaving}
                   onClick={handleFinish} 
                   className="px-12 py-5 bg-gradient-to-r from-[#9800d0] to-[#b90afc] text-white rounded-full text-xl font-bold uppercase tracking-wider hover:brightness-125 transition-all shadow-[0_0_30px_rgba(185,10,252,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                    {isSaving ? "Saving..." : "This Is Me →"}
                 </button>
                 <p className="text-sm text-[#76747f]">You can change this anytime</p>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: Ready Screen */}
          {slide === 4 && (
            <motion.div
              key="slide4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <div className="relative">
                 {/* 3D Core / Explosion effect */}
                 <motion.div 
                   className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00f1fe] rounded-full blur-[150px] opacity-20 MixBlendMode-screen pointer-events-none"
                   animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 4, repeat: Infinity }}
                 />
                 
                 <motion.h1 
                   initial={{ opacity: 0, scale: 0.9, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}
                   className="text-6xl md:text-8xl font-black mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                 >
                    Your journey <br/> begins now.
                 </motion.h1>
                 
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                   className="space-y-4 mb-16 relative z-10"
                 >
                    <p className="text-3xl text-[#99f7ff] font-light">Welcome, <span className="font-bold text-white">{profile?.name || 'Traveler'}</span> 🔥</p>
                    {selectedStruggle && (
                      <p className="text-xl text-[#acaab5] font-['Manrope']">Today's focus: <span className="text-[#d575ff]">{selectedStruggle}</span></p>
                    )}
                 </motion.div>

                 <motion.button
                   initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5, type: "spring" }}
                   onClick={handleFinish}
                   className="px-16 py-6 bg-white text-black rounded-full text-2xl font-black uppercase tracking-wider hover:bg-[#99f7ff] hover:scale-110 transition-all shadow-[0_0_50px_rgba(255,255,255,0.5)]"
                 >
                   Enter The Map ⚡
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center gap-3 z-50">
        {[1, 2, 3, 4].map(num => (
          <div 
            key={num} 
            className={`h-2 rounded-full transition-all duration-300 ${slide === num ? 'w-10 bg-[#00f1fe] shadow-[0_0_10px_#00f1fe]' : 'w-2 bg-[#484751]'}`} 
          />
        ))}
      </div>

    </div>
  );
}
