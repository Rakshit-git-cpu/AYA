import { Outlet } from 'react-router-dom';
import { PwaHeader } from '../components/ui/PwaHeader';

export function AppLayout() {
    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
            {/* Premium Neon PWA Header */}
            <PwaHeader />
            {/* Main Content Area */}
            <main className="flex-1 overflow-auto relative">
                <Outlet />
            </main>
        </div>
    );
}
