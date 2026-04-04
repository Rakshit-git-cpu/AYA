const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/game/LevelMap.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update props interface
content = content.replace(
    /interface LevelMapProps \{\s*onPlayLevel: \(level: any\) => void;\s*\}/,
    `interface LevelMapProps {\n    onPlayAge: (age: number) => void;\n}`
);

// 2. Change LevelMap signature & calculate ages
content = content.replace(
    /export function LevelMap\(\{ onPlayLevel \}: LevelMapProps\) \{/,
    `export function LevelMap({ onPlayAge }: LevelMapProps) {\n    const levels = useUserStore((state) => state.levels);\n    const ages = Array.from(new Set(levels.map(l => l.age))).sort((a, b) => a - b);`
);

// Remove the old const levels = ... definition to avoid redeclaration if it exists
content = content.replace(
    /\s*const levels = useUserStore\(\(state\) => state\.levels\);/,
    ''
);

// 3. Update totalHeight to use ages.length
content = content.replace(
    /const totalHeight = \(levels\.length \* NODE_SPACING\) \+ \(isMobile \? 300 : 400\);/,
    `const totalHeight = (ages.length * NODE_SPACING) + (isMobile ? 300 : 400);`
);

// 4. Update the path generation
content = content.replace(
    /d=\{levels\.reduce\(\(path, _, i\) => \{/g,
    `d={ages.reduce((path, _, i) => {`
);

// 5. Update the node mapping loop
content = content.replace(
    /\{levels\.map\(\(level, i\) => \{[\s\S]*?const pos = getPosition\(i\);[\s\S]*?const isUnlocked = level\.status !== 'locked';[\s\S]*?const isCompleted = level\.status === 'completed';[\s\S]*?const isCurrent = isUnlocked && !isCompleted;/m,
    `{ages.map((age, i) => {
                            const ageLevels = levels.filter(l => l.age === age);
                            const isUnlocked = ageLevels.some(l => l.status !== 'locked');
                            const isCompleted = ageLevels.some(l => l.status === 'completed');
                            const isCurrent = isUnlocked && !isCompleted;
                            const pos = getPosition(i);`
);

// 6. Update key
content = content.replace(
    /key=\{level\.id\}/g,
    `key={"age_" + age}`
);

// 7. Update onClick
content = content.replace(
    /onPlayLevel\(level\);/g,
    `onPlayAge(age);`
);

// 8. Update inner content (Image -> Number)
const oldContentBlock = /<div className=\{clsx\(\s*"relative rounded-full overflow-hidden flex items-center justify-center bg-white node-ring transition-all duration-300",\s*\/\/ Mobile: w-16 h-16, Desktop: w-24 h-24\s*"w-16 h-16 md:w-24 md:h-24",\s*isCandyMode\s*\?\s*\(isCurrent \? "[^"]*" : "[^"]*"\)\s*:\s*\(isCurrent\s*\? "[^"]*"\s*: "[^"]*"\)\s*\)\}>\s*<img src=\{level\.avatarUrl \|\| '\/assets\/avatar_business\.png'\} alt=\{level\.archetype\} className="w-full h-full object-cover node-content" \/>[\s\S]*?<\/div>/m;

const newContentBlock = `<div className={clsx(
                                            "relative rounded-full overflow-hidden flex items-center justify-center bg-white node-ring transition-all duration-300",
                                            "w-16 h-16 md:w-24 md:h-24",
                                            isCandyMode
                                                ? (isCurrent ? "border-4 border-pink-400 ring-4 ring-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.6)]" : "border-4 border-slate-300 shadow-[0_8px_0_rgba(0,0,0,0.2)]")
                                                : (isCurrent 
                                                    ? "border-4 border-amber-400 ring-4 ring-amber-400/30 shadow-[0_0_25px_rgba(245,158,11,0.8)]"
                                                    : "border-transparent ring-2 ring-[#4DD9FF]/80 shadow-[0_0_15px_rgba(77,217,255,0.6)]")
                                        )}>
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className={clsx(
                                                    "text-3xl md:text-5xl font-black font-mono tracking-tighter drop-shadow-md",
                                                    isCandyMode ? "text-slate-800" : "text-[#4DD9FF]"
                                                )}>
                                                    {age}
                                                </span>
                                            </div>
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-200/50 backdrop-blur-[1px]">
                                                    <Lock size={20} className="text-slate-500 drop-shadow-md opacity-80 md:w-6 md:h-6" />
                                                </div>
                                            )}
                                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-full" />
                                        </div>`;

content = content.replace(oldContentBlock, newContentBlock);


// 9. Fix the Labels (Remove personality badge, change to Chapter text)
const oldLabelsBlock = /\{\/\* Personality Badge \*\/\}[\s\S]*?\{\/\* Story Title \*\/\}[\s\S]*?text-center",[\s\S]*?isCandyMode[\s\S]*?\? \(isUnlocked \? "text-white drop-shadow-md" : "text-slate-500"\)[\s\S]*?: \(isUnlocked[\s\S]*?\? \(isCurrent \? "text-white drop-shadow-md" : "text-\[\#F0EEFF\] drop-shadow-\[0_0_4px_rgba\(240,238,255,0\.3\)\]"\)[\s\S]*?: "text-slate-500"\)[\s\S]*?\)\}>[\s\S]*?\{level\.title\}[\s\S]*?<\/span>[\s\S]*?<\/div>/m;

const newLabelsBlock = `{/* Chapter Title */}
                                            <div className={clsx(
                                                "px-4 py-1 pt-3 pb-1 md:px-6 md:py-2 md:pt-4 md:pb-2 rounded-xl shadow-xl flex items-center justify-center min-w-[100px] md:min-w-[140px] transition-all duration-300",
                                                isCandyMode
                                                    ? (isUnlocked ? "bg-gradient-to-r from-pink-500 to-rose-500 border-b-[3px] md:border-b-4 border-rose-800" : "border-b-[3px] md:border-b-4 bg-slate-800 border-slate-900")
                                                    : (isUnlocked
                                                        ? (isCurrent 
                                                            ? "bg-gradient-to-r from-amber-500 to-amber-600 border-b-[3px] md:border-b-4 border-amber-800 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                                            : "bg-[rgba(10,15,40,0.75)] backdrop-blur-md border border-[#4DD9FF]/60 shadow-[0_0_15px_rgba(77,217,255,0.15)]")
                                                        : "bg-slate-800/80 border-b-[3px] md:border-b-4 border-slate-900")
                                            )}>
                                                <span className={clsx(
                                                    "text-[10px] md:text-xs font-bold uppercase tracking-wider leading-none text-center",
                                                    isCandyMode
                                                        ? (isUnlocked ? "text-white drop-shadow-md" : "text-slate-500")
                                                        : (isUnlocked 
                                                            ? (isCurrent ? "text-white drop-shadow-md" : "text-[#F0EEFF] drop-shadow-[0_0_4px_rgba(240,238,255,0.3)]")
                                                            : "text-slate-500")
                                                )}>
                                                    CHAPTER {i + 1}
                                                </span>
                                            </div>`;

content = content.replace(oldLabelsBlock, newLabelsBlock);

fs.writeFileSync(file, content);
console.log("Patched successfully.");
