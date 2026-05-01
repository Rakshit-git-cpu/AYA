import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { safeStorage } from '../utils/storage';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 bg-red-900 text-white min-h-screen">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                    <pre className="bg-black/50 p-4 rounded overflow-auto text-sm">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        onClick={() => {
                            safeStorage.clear();
                            window.location.reload();
                        }}
                        className="mt-6 px-4 py-2 bg-white text-red-900 font-bold rounded hover:bg-gray-200"
                    >
                        Clear Data & Reload
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
