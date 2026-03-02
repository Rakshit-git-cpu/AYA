import { useNavigate } from 'react-router-dom';
import { Gamepad2, Film, Users, ChevronRight } from 'lucide-react';

export function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="h-full p-6 flex flex-col pt-12">
            <header className="mb-8">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">
                    AT YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">AGE</span>
                </h1>
                <p className="text-slate-400">Welcome back. functionality loading...</p>
            </header>

            <div className="space-y-4 flex-1">
                <FeatureCard
                    title="Start The Game"
                    subtitle="Interactive Story Mode"
                    icon={Gamepad2}
                    color="bg-gradient-to-r from-pink-600 to-rose-600"
                    onClick={() => navigate('/game')}
                />

                <FeatureCard
                    title="Watch Reels"
                    subtitle="Short form video content"
                    icon={Film}
                    color="bg-gradient-to-r from-violet-600 to-purple-600"
                    onClick={() => navigate('/reels')}
                    status="Coming Soon"
                />

                <FeatureCard
                    title="Social Hub"
                    subtitle="Connect with the community"
                    icon={Users}
                    color="bg-gradient-to-r from-cyan-600 to-blue-600"
                    onClick={() => navigate('/social')}
                    status="Coming Soon"
                />
            </div>
        </div>
    );
}

function FeatureCard({ title, subtitle, icon: Icon, color, onClick, status }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full p-6 rounded-2xl text-left relative overflow-hidden group transition-transform active:scale-95 ${color}`}
        >
            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
                        <Icon className="text-white" size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                    <p className="text-white/70 text-sm">{subtitle}</p>
                </div>
                <ChevronRight className="text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>

            {status && (
                <div className="absolute top-4 right-4 bg-black/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                    {status}
                </div>
            )}
        </button>
    );
}
