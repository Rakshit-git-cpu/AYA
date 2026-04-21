import { useNavigate } from 'react-router-dom';
import { Gamepad2, ChevronRight } from 'lucide-react';

export function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="h-full p-6 flex flex-col pt-12">


            <div className="space-y-4 flex-1">
                <FeatureCard
                    title="Start The Game"
                    subtitle="Interactive Story Mode"
                    icon={Gamepad2}
                    color="bg-gradient-to-r from-pink-600 to-rose-600"
                    onClick={() => navigate('/game')}
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
