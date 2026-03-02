import type { Level } from '../../types/gameTypes';
import { Play, Trophy, Sparkles, Star } from 'lucide-react';
import { audioSynth } from '../../utils/audioSynth';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface PersonalityIntroProps {
    level: Level;
    onStart: () => void;
    onBack: () => void;
}

export function PersonalityIntro({ level, onStart, onBack }: PersonalityIntroProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        // Safe audio call
        if (audioSynth.playSwoosh) {
            try {
                audioSynth.playSwoosh();
            } catch (e) { console.warn("Audio failed", e); }
        }
    }, []);

    const handleStart = () => {
        audioSynth.playClick();
        setIsVisible(false);
        setTimeout(onStart, 300);
    };

    return (
        <div className={clsx(
            "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-md transition-opacity duration-500 p-4",
            isVisible ? "opacity-100" : "opacity-0"
        )}>
            {/* Main Card */}
            <div className={clsx(
                "relative w-full max-w-5xl h-[85vh] md:h-[700px] flex flex-col md:flex-row bg-white rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700 transform ring-8 ring-white/10",
                isVisible ? "scale-100 translate-y-0" : "scale-90 translate-y-20"
            )}>

                {/* LEFT: CHARACTER (Vibrant Gradient Background) */}
                <div className="w-full md:w-5/12 h-[40%] md:h-full relative overflow-hidden group border-r-4 border-white">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 animate-gradient-slow" />
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)', backgroundSize: '40px 40px' }}
                    />

                    {/* Character Image */}
                    <img
                        src={level.avatarUrl}
                        alt={level.personality}
                        className="absolute inset-0 w-full h-full object-cover object-top filter contrast-110 md:scale-110 md:group-hover:scale-115 transition-transform duration-1000 origin-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                </div>

                {/* RIGHT: CONTENT (Gamified UI) */}
                <div className="w-full md:w-7/12 h-[60%] md:h-full p-6 md:p-10 flex flex-col relative bg-slate-50 overflow-y-auto custom-scrollbar">

                    {/* Header Plls */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1 animate-bounce-slow">
                            <Star size={12} className="fill-yellow-900" /> Age {level.age}
                        </div>
                        <div className="px-4 py-1 bg-slate-200 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                            {level.archetype}
                        </div>
                    </div>

                    {/* Title & Fame */}
                    <div className="mb-4 md:mb-6">
                        <h1 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 leading-none uppercase tracking-tighter mb-2 drop-shadow-sm">
                            {level.personality}
                        </h1>
                        {level.fame && (
                            <div className="text-pink-600 font-bold text-base md:text-2xl italic flex items-center gap-2">
                                <Sparkles size={20} className="md:w-6 md:h-6 animate-pulse" />
                                "{level.fame}"
                            </div>
                        )}
                    </div>

                    {/* Bio & Achievements */}
                    <div className="space-y-4 md:space-y-6 flex-1">
                        <p className="text-base md:text-2xl text-slate-700 font-medium leading-relaxed border-l-4 border-slate-300 pl-4">
                            {level.bio || level.description}
                        </p>

                        {/* Achievements List */}
                        {level.achievements && (
                            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-md border border-slate-100">
                                <h3 className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                                    <Trophy size={16} className="md:w-[18px] text-yellow-500" /> Unlockable Achievements
                                </h3>
                                <ul className="space-y-2 md:space-y-3">
                                    {level.achievements.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-800 font-bold text-sm md:text-xl">
                                            <span className="text-pink-500 mt-1 text-xs">●</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* The Lesson Box */}
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 md:p-6 rounded-2xl border-2 border-pink-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={40} className="md:w-[60px] text-pink-500" />
                            </div>
                            <h3 className="text-pink-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">
                                Today's Lesson
                            </h3>
                            <p className="text-slate-800 font-bold text-sm md:text-lg">
                                "{level.lesson || "Discover your path."}"
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 md:pt-6 mt-auto flex gap-4 sticky bottom-0 bg-slate-50/90 backdrop-blur-sm pb-2">
                        <button
                            onClick={handleStart}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black py-3 md:py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-[0_8px_20px_rgba(236,72,153,0.3)] border-b-4 border-rose-800 text-base md:text-lg uppercase tracking-wide group"
                        >
                            <Play size={20} className="md:w-6 md:h-6 fill-white group-hover:animate-pulse" />
                            Start Journey
                        </button>
                        <button
                            onClick={onBack}
                            className="w-14 md:w-16 flex items-center justify-center border-2 border-slate-200 rounded-2xl text-slate-400 hover:border-slate-400 hover:text-slate-600 hover:bg-white transition-all font-bold"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
