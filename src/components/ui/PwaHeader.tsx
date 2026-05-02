import { type FC } from 'react';
import { useUserStore } from '../../store/userStore';
import { calculateLevelInfo } from '../../utils/levelSystem';
import clsx from 'clsx';
import './PwaHeader.css';

export const PwaHeader: FC = () => {
    const profile = useUserStore((state) => state.profile);
    const isCandyMode = useUserStore((state) => state.isCandyMode);

    if (!profile) return null;

    const levelInfo = calculateLevelInfo(profile.total_xp || 0);

    return (
        <header className={clsx(
            "w-full h-[60px] max-h-[60px] shrink-0 fixed top-0 left-0 z-[110] flex items-center justify-between px-4 sm:px-6 md:px-8 backdrop-blur-xl transition-all duration-300",
            isCandyMode 
                ? "bg-white/90 border-b-2 border-pink-300 shadow-[0_2px_15px_rgba(244,114,182,0.3)]"
                : "bg-slate-950/80 border-b border-[#00f2ff]/40 shadow-[0_2px_20px_rgba(0,242,255,0.25)]"
        )}>
        {/* Logo Section — flex-shrink-0 so it never yields space to the stats */}
            <div className="flex items-center flex-shrink-0">
                <h1 className={clsx(
                    "font-black italic tracking-tighter whitespace-nowrap",
                    // Mobile: clamp so very small screens (320px) don't push the logo into the stats
                    "text-[clamp(13px,4vw,20px)] sm:text-2xl",
                    isCandyMode
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 drop-shadow-sm"
                        : "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#99f7ff] drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]"
                )}>
                    AT YOUR AGE
                </h1>
            </div>

            {/* Stats Section — flex-1 + min-w-0 so it shrinks instead of pushing the logo */}
            <div className="flex items-center justify-end gap-1.5 sm:gap-4 flex-1 min-w-0 overflow-hidden pr-1">
                <div className={clsx(
                    "flex items-center gap-1 sm:gap-2 min-w-0 overflow-hidden",
                    isCandyMode ? "text-slate-700" : "text-[#f2effb]"
                )}>
                    <span className="font-bold uppercase tracking-wider text-[10px] sm:text-xs truncate max-w-[60px] sm:max-w-[100px]">
                        {profile.name || "GUEST"}
                    </span>
                    <span className="text-slate-500 text-[8px] sm:text-xs flex-shrink-0">•</span>
                    <span className={clsx(
                        "text-[9px] sm:text-xs font-bold uppercase tracking-wider truncate max-w-[60px] sm:max-w-[150px] flex-shrink-0",
                        isCandyMode ? "text-pink-600" : "text-slate-300"
                    )}>
                        Lvl {profile.level || 1} <span className="hidden sm:inline">— {levelInfo.title}</span>
                    </span>
                    <span className="text-slate-500 text-[10px] sm:text-xs mx-0.5 sm:mx-1 flex-shrink-0">•</span>
                </div>
                
                {/* XP badge — always visible, flex-shrink-0 so it's never cut */}
                <div className={clsx(
                    "flex items-center gap-1 font-bold whitespace-nowrap flex-shrink-0",
                    isCandyMode ? "text-amber-600" : "text-amber-400 drop-shadow-md"
                )}>
                    <span className="text-xs sm:text-sm">⭐</span>
                    <span className="text-[10px] sm:text-sm border border-amber-500/30 bg-amber-500/10 px-1.5 sm:px-2 py-0.5 rounded-md">
                        {profile.total_xp || 0} XP
                    </span>
                </div>
            </div>
            
            {/* Optional Safe Area Padding for mobile notches if run in 'standalone' mode later */}
            <style>{`
                 @supports (padding-top: env(safe-area-inset-top)) {
                     header { padding-top: env(safe-area-inset-top); height: calc(60px + env(safe-area-inset-top)); }
                 }
            `}</style>
        </header>
    );
};
