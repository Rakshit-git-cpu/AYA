import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/userStore';
import { audioSynth } from '../../utils/audioSynth';
import { supabase } from '../../utils/supabase';
import { Brain, Gamepad2, Dna, ChevronRight, Check } from 'lucide-react';
import { NotificationPrompt } from '../ui/NotificationPrompt';
import { subscribeUserToPush } from '../../utils/pushNotifications';
import { bgmManager } from '../../utils/bgmManager';

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
  const [selectedStruggle, setSelectedStruggle] = useState<typeof STRUGGLES[0] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  useEffect(() => {
    bgmManager.play('onboarding');
    return () => bgmManager.stop();
  }, []);

  const nextSlide = () => {
    audioSynth.playClick();
    setSlide((prev) => Math.min(prev + 1, 4));
  };
  const prevSlide = () => {
    audioSynth.playBack();
    setSlide((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = async () => {
    if (slide === 3 && selectedStruggle && profile?.id) {
      setIsSaving(true);
      try {
        await supabase
          .from('users')
          .update({ 
            daily_struggle: selectedStruggle.label, 
            last_struggle_update: new Date().toISOString() 
          })
          .eq('mobile', profile.mobile);
      } catch (e) {
        console.error('Failed to save struggle', e);
      }
      setIsSaving(false);
      nextSlide();
    } else if (slide === 4) {
      setShowNotificationPrompt(true);
    } else {
      nextSlide();
    }
  };

  const onAcceptNotifications = async () => {
    await subscribeUserToPush();
    localStorage.setItem('notificationPromptShown', 'true');
    setShowNotificationPrompt(false);
    onComplete();
  };

  const onDeclineNotifications = () => {
    localStorage.setItem('notificationPromptShown', 'true');
    setShowNotificationPrompt(false);
    onComplete();
  };


  const welcomeWords = "Your journey begins now.".split(" ");

  return (
    <div className="w-full h-screen bg-[#0d0d16] text-[#f2effb] overflow-y-auto relative font-['Space_Grotesk',sans-serif] perspective-[2000px] [-webkit-overflow-scrolling:touch]" style={{scrollbarWidth:'none', msOverflowStyle:'none'}} >
      <style>{`::-webkit-scrollbar { display: none; }`}</style>
      
      {/* Universal Scene Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
         
         {/* Diagonal Light Rays */}
         {(slide === 1 || slide === 4) && (
            <>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_30%,rgba(0,241,254,0.06)_40%,rgba(0,241,254,0.1)_50%,transparent_60%)] MixBlendMode-screen" />
                <div className="absolute inset-0 bg-[linear-gradient(-35deg,transparent_30%,rgba(213,117,255,0.06)_40%,transparent_50%)] MixBlendMode-screen" />
            </>
         )}

         {/* Aurora / Northern Lights */}
         <motion.div 
           className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] opacity-30 MixBlendMode-screen"
           animate={{
               background: [
                   'radial-gradient(ellipse at 40% 40%, rgba(153, 247, 255, 0.45) 0%, transparent 40%), radial-gradient(ellipse at 70% 60%, rgba(213, 117, 255, 0.3) 0%, transparent 40%)',
                   'radial-gradient(ellipse at 60% 30%, rgba(153, 247, 255, 0.3) 0%, transparent 40%), radial-gradient(ellipse at 40% 70%, rgba(213, 117, 255, 0.45) 0%, transparent 40%)',
                   'radial-gradient(ellipse at 40% 40%, rgba(153, 247, 255, 0.45) 0%, transparent 40%), radial-gradient(ellipse at 70% 60%, rgba(213, 117, 255, 0.3) 0%, transparent 40%)'
               ]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
         />

         {/* Universal Tech Grid (Opacities varied by slide) */}
         <div className={`absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] transition-opacity duration-1000 ${slide === 3 ? 'opacity-100' : 'opacity-0'}`} />

         {/* Particles */}
         <AnimatePresence>
            {(slide === 1 || slide === 4) && Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                key={`p-${i}`}
                className="absolute w-1 h-1 bg-[#00f1fe] rounded-full drop-shadow-[0_0_5px_#00f1fe]"
                initial={{
                    x: Math.random() * window.innerWidth,
                    y: slide === 4 ? window.innerHeight / 2 : Math.random() * window.innerHeight,
                    opacity: 0,
                    scale: 0
                }}
                animate={{
                    x: slide === 4 ? `calc(${Math.random() * 100}vw)` : undefined,
                    y: slide === 4 ? `calc(${Math.random() * 100}vh)` : [null, Math.random() * window.innerHeight],
                    opacity: [0, 0.6, 0],
                    scale: 1,
                    rotate: slide === 4 ? Math.random() * 720 : 0
                }}
                transition={{
                    duration: slide === 4 ? (Math.random() * 2 + 1) : (Math.random() * 6 + 4),
                    repeat: slide === 1 ? Infinity : 0,
                    ease: slide === 4 ? "easeOut" : "linear"
                }}
                />
            ))}
         </AnimatePresence>
      </div>

      {/* Top Navigation — FIXED */}
      {slide > 1 && slide < 4 && (
        <button onClick={prevSlide} className="fixed top-6 left-6 z-[200] text-[#acaab5] hover:text-[#99f7ff] transition-colors text-sm uppercase tracking-widest font-bold">
            ← Back
        </button>
      )}
      {(slide === 1 || slide === 2) && (
        <button onClick={() => onComplete()} className="fixed top-6 right-6 z-[200] text-[#acaab5] hover:text-[#99f7ff] transition-colors text-sm uppercase tracking-widest font-bold">
            Skip
        </button>
      )}

      {/* Main Slide Content — Scrollable inner wrapper with header clearance */}
      <div className="relative z-10 w-full min-h-screen flex flex-col items-start justify-center px-4 md:px-6 pt-28 sm:pt-32 pb-28">
        <AnimatePresence mode="wait">
          {/* SLIDE 1: The Hook */}
          {slide === 1 && (
            <motion.div
              key="slide1"
              initial={{ opacity: 0, x: 100, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100, rotateY: -15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center w-full max-w-[680px] mx-auto px-4 md:px-0"
            >
              {/* Blurred Silhouettes */}
              <div className="absolute inset-0 z-[-1] pointer-events-none flex items-center justify-center">
                 {[1,2,3].map((_, i) => (
                     <motion.div
                       key={`sil-${i}`}
                       className="absolute w-48 h-64 bg-black rounded-[40px] opacity-40 blur-[20px] mix-blend-overlay border border-[#00f1fe]"
                       animate={{ 
                           rotateZ: [0, 360], 
                           x: [Math.sin(i)*100, Math.cos(i)*100, Math.sin(i)*100],
                           y: [Math.cos(i)*100, Math.sin(i)*100, Math.cos(i)*100]
                       }}
                       transition={{ duration: 30 + i*5, repeat: Infinity, ease: 'linear' }}
                     />
                 ))}
              </div>

              <div className="space-y-6 sm:space-y-10 [transform-style:preserve-3d]">
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                   className="text-lg sm:text-3xl font-light text-white/80"
                 >
                    "At 20, <span className="font-bold text-[#99f7ff] drop-shadow-[0_0_15px_rgba(153,247,255,0.8)]">Kobe Bryant</span> was already training at 4AM."
                 </motion.p>
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                   className="text-base sm:text-2xl font-light text-white/80"
                 >
                    "At 19, <span className="font-bold text-[#d575ff] drop-shadow-[0_0_15px_rgba(213,117,255,0.8)]">Shah Rukh Khan</span> was performing in Delhi theatres."
                 </motion.p>
                 <motion.h1 
                   initial={{ opacity: 0, scale: 0.9, z: 150 }} animate={{ opacity: 1, scale: 1, z: 0 }} transition={{ delay: 1.2, duration: 1 }}
                   className="text-2xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-white to-[#ffaa00] drop-shadow-[0_0_30px_rgba(255,215,0,0.5)] mt-8 mb-4"
                 >
                    What were YOU meant to become?
                 </motion.h1>
                 <motion.p 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                   className="text-[#acaab5] text-sm sm:text-xl font-['Manrope',sans-serif] uppercase tracking-widest mt-4"
                 >
                    Find out by stepping into their shoes.
                 </motion.p>

                 <motion.button
                   initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
                   onClick={nextSlide}
                   className="mt-10 px-10 py-5 bg-transparent border-2 border-[#00f1fe] text-[#99f7ff] rounded-full text-xl font-black uppercase tracking-wider relative overflow-hidden group transition-all"
                 >
                   <motion.div 
                       className="absolute inset-0 bg-[#00f1fe] opacity-20"
                       animate={{ opacity: [0.1, 0.4, 0.1] }}
                       transition={{ duration: 2, repeat: Infinity }}
                   />
                   <span className="relative z-10 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(0,241,254,0.8)] text-lg sm:text-xl">
                       LET'S FIND OUT <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                    </span>
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
              className="w-full max-w-[680px] mx-auto px-4 md:px-0"
            >
              <h2 className="text-3xl sm:text-7xl font-black text-center mb-10 sm:mb-20 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">How AYA Works</h2>
              <div className="space-y-8 [transform-style:preserve-3d]">
                 {[
                   { icon: Brain, title: "Answer 9 quick questions", desc: "We build your psychological personality profile.", color: '#99f7ff', rawColor: '0, 241, 254' },
                   { icon: Gamepad2, title: "Step into a legend's shoes", desc: "Make their real decisions in interactive scenarios.", color: '#d575ff', rawColor: '213, 117, 255' },
                   { icon: Dna, title: "Discover your Personality DNA", desc: "See who you were truly meant to become.", color: '#ffd700', rawColor: '255, 215, 0' }
                 ].map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 100, rotateX: 45, z: -500 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, z: 0 }}
                      transition={{ delay: 0.3 * idx, type: "spring", damping: 15 }}
                      className="flex items-center gap-8 bg-[#1f1f2a]/80 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group"
                    >
                      <div className={`absolute top-0 left-0 w-2 h-full`} style={{ backgroundColor: step.color, boxShadow: `0 0 20px ${step.color}` }} />
                      <div className="w-24 h-24 rounded-2xl flex items-center justify-center border transition-all shadow-lg" style={{ backgroundColor: `rgba(${step.rawColor}, 0.1)`, borderColor: `rgba(${step.rawColor}, 0.3)`, boxShadow: `0 0 20px rgba(${step.rawColor}, 0.4)` }}>
                         <step.icon className="w-12 h-12" style={{ color: step.color, filter: `drop-shadow(0 0 10px ${step.color})` }} />
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-4xl font-bold text-white mb-2">{step.title}</h3>
                        <p className="text-lg sm:text-xl text-[#acaab5] font-['Manrope']">{step.desc}</p>
                      </div>
                    </motion.div>
                 ))}
              </div>
              <div className="flex justify-center mt-20">
                 <button onClick={nextSlide} className="px-10 py-5 sm:px-14 sm:py-6 bg-[#00f1fe] text-[#004145] rounded-full text-xl sm:text-2xl font-black uppercase tracking-wider hover:bg-[#99f7ff] transition-all shadow-[0_0_40px_rgba(0,241,254,0.6)] hover:shadow-[0_0_60px_rgba(0,241,254,0.8)] flex items-center gap-3">
                    SOUNDS GOOD <ChevronRight size={28} />
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
              className="w-full max-w-[680px] mx-auto px-4 md:px-0 text-center"
            >
              <h2 className="text-3xl sm:text-6xl font-black mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">What's on your mind lately?</h2>
              <p className="text-lg sm:text-2xl text-[#acaab5] mb-8 sm:mb-16 font-['Manrope']">We'll suggest the perfect story for you today</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 [transform-style:preserve-3d]">
                 {STRUGGLES.map((strug, idx) => (
                    <motion.button
                      key={strug.id}
                      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -8, z: 100, rotateX: -5, rotateY: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        audioSynth.playClick();
                        setSelectedStruggle(strug);
                      }}
                      className={`relative p-10 rounded-3xl backdrop-blur-2xl border-2 transition-all flex flex-col items-center gap-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${
                          selectedStruggle?.id === strug.id 
                          ? 'bg-[#d575ff]/20 border-[#fe00fe] shadow-[0_0_50px_rgba(254,0,254,0.6)] scale-105 z-50' 
                          : 'bg-[#191923]/80 border-[#2b2b38]'
                      }`}
                    >
                       <span className={`text-4xl sm:text-6xl ${selectedStruggle?.id === strug.id ? 'drop-shadow-[0_0_20px_rgba(254,0,254,0.8)]' : ''}`}>{strug.icon}</span>
                       <span className={`text-xl sm:text-2xl font-bold ${selectedStruggle?.id === strug.id ? 'text-white' : 'text-[#acaab5]'}`}>{strug.label}</span>
                       {selectedStruggle?.id === strug.id && (
                           <div className="absolute top-6 right-6 text-[#fe00fe] drop-shadow-[0_0_10px_#fe00fe]"><Check size={32} strokeWidth={4} /></div>
                       )}
                    </motion.button>
                 ))}
              </div>

              <div className="flex flex-col items-center mt-20 space-y-6">
                 <button 
                   disabled={!selectedStruggle || isSaving}
                   onClick={handleFinish} 
                   className="px-12 py-5 sm:px-16 sm:py-6 bg-gradient-to-r from-[#9800d0] to-[#b90afc] text-white rounded-full text-xl sm:text-2xl font-black uppercase tracking-wider hover:brightness-125 transition-all shadow-[0_0_50px_rgba(185,10,252,0.8)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                 >
                    {isSaving ? "SAVING..." : "THIS IS ME →"}
                 </button>
                 <p className="text-lg text-[#76747f]">You can change this anytime</p>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: Ready Screen */}
          {slide === 4 && (
            <motion.div
              key="slide4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="w-full max-w-[680px] mx-auto px-4 md:px-0 text-center"
            >
              <div className="relative">
                 {/* Rotating Aurora Core */}
                 <motion.div 
                   className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] MixBlendMode-screen pointer-events-none"
                   style={{ background: 'conic-gradient(from 0deg, rgba(0,241,254,0.3), rgba(213,117,255,0.3), rgba(0,241,254,0.3))' }}
                   animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                   transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                 />
                 
                 <div className="flex justify-center flex-wrap gap-x-4 mb-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] relative z-10">
                    {welcomeWords.map((word, i) => (
                        <motion.h1
                          key={i}
                          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ delay: 0.5 + (i * 0.2), duration: 0.8 }}
                          className="text-3xl sm:text-7xl md:text-9xl font-black"
                        >
                            {word}
                        </motion.h1>
                    ))}
                 </div>
                 
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2 }}
                   className="space-y-6 mb-24 relative z-10 flex flex-col items-center"
                 >
                    <p className="text-lg sm:text-4xl text-[#99f7ff] font-light">Welcome, <span className="font-bold text-white drop-shadow-[0_0_15px_#ffffff]">{profile?.name || 'Traveler'}</span></p>
                    {selectedStruggle && (
                      <div className="flex items-center gap-3 sm:gap-4 bg-[#1f1f2a]/80 backdrop-blur-xl px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-[#2b2b38] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                          <span className="text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{selectedStruggle.icon}</span>
                          <p className="text-base sm:text-2xl text-[#acaab5] font-['Manrope']">Today's focus: <span className="text-[#d575ff] font-bold drop-shadow-[0_0_10px_rgba(213,117,255,0.8)]">{selectedStruggle.label}</span></p>
                      </div>
                    )}
                 </motion.div>

                 <motion.button
                   initial={{ opacity: 0, scale: 0.5, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 3, type: "spring", damping: 10 }}
                   onClick={handleFinish}
                   className="px-8 py-4 sm:px-20 sm:py-8 bg-[#00f1fe] text-[#004145] rounded-full text-base sm:text-3xl font-black uppercase tracking-wider hover:bg-[#99f7ff] hover:scale-110 transition-all shadow-[0_0_60px_rgba(0,241,254,0.8)] relative z-10 flex flex-col items-center"
                 >
                   ENTER THE MAP ⚡
                 </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>



      <NotificationPrompt 
        isOpen={showNotificationPrompt}
        onAccept={onAcceptNotifications}
        onDecline={onDeclineNotifications}
      />
    </div>
  );
}

