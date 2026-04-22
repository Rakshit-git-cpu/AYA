import React from 'react';
import { Bell, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioSynth } from '../../utils/audioSynth';

interface NotificationPromptProps {
    isOpen: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

export function NotificationPrompt({ isOpen, onAccept, onDecline }: NotificationPromptProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-[#0d0d16] border border-[#00f2ff]/30 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,242,255,0.15)] overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-[80px] rounded-full" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#00f2ff] to-[#d575ff] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,242,255,0.4)] animate-pulse">
                            <Bell size={40} className="text-white fill-white/20" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Never miss your <span className="text-[#00f2ff]">daily streak</span> 🔥
                        </h2>
                        
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Get reminded when your daily challenge is ready and keep your momentum alive.
                        </p>

                        <div className="w-full space-y-3">
                            <button
                                onClick={() => {
                                    audioSynth.playClick();
                                    onAccept();
                                }}
                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all transform active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Sparkles size={20} />
                                YES, REMIND ME 🔔
                            </button>
                            
                            <button
                                onClick={() => {
                                    audioSynth.playClick();
                                    onDecline();
                                }}
                                className="w-full py-3 text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                            >
                                <X size={16} />
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
