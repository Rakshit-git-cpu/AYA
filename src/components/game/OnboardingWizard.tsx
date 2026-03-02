import { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { Check } from 'lucide-react';

export function OnboardingWizard() {
    const setProfile = useUserStore((state) => state.setProfile);

    // Only need Name and Age state now
    const [name, setName] = useState("");
    const [age, setAge] = useState<number>(20);

    const handleComplete = () => {
        setProfile({
            name,
            age,
            interests: [],
            roleModels: [],
            traits: {
                discipline: 50, resilience: 50, risk: 50,
                leadership: 50, creativity: 50, empathy: 50, vision: 50
            },
            assessmentCompleted: false
        });
    };

    return (
        <div className="min-h-full flex flex-col justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="relative z-10 max-w-md mx-auto w-full">
                {/* Step Content: Just Name and Age now */}
                <div className="space-y-6">
                    <h2 className="text-4xl font-black text-white drop-shadow-md text-center mb-8 font-comic">
                        Let's get to know you!
                    </h2>
                    <div className="space-y-6">
                        <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-xl">
                            <label className="block text-sm font-bold text-white mb-2 uppercase tracking-wider">What's your name?</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/50 border-2 border-white/50 rounded-2xl p-4 text-purple-900 placeholder-purple-300 font-bold focus:ring-4 focus:ring-pink-300 focus:border-white outline-none transition-all"
                                placeholder="Type your name..."
                            />
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-xl">
                            <label className="block text-sm font-bold text-white mb-4 uppercase tracking-wider">How young are you? ({age})</label>
                            <input
                                type="range"
                                min="15"
                                max="30"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full h-4 bg-white/30 rounded-full appearance-none cursor-pointer accent-yellow-400 hover:accent-yellow-300"
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation Button */}
                <button
                    disabled={!name.trim()}
                    onClick={handleComplete}
                    className="w-full mt-8 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-xl rounded-full shadow-[0_10px_20px_rgba(245,158,11,0.4)] flex items-center justify-center space-x-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-b-8 border-orange-600 hover:border-b-0 translate-y-0 hover:translate-y-2"
                >
                    <span>Start My Journey</span>
                    <Check size={28} className="stroke-[4]" />
                </button>
            </div>
        </div>
    );
}
