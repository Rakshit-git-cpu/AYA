import { useEffect, useRef, useState } from 'react';
import { MotionValue } from 'framer-motion';
import { useUserStore } from '../../store/userStore';

// Global Cache for persistent frame images across unmounts/renders
const GLOBAL_FRAME_CACHE: Record<string, HTMLImageElement[]> = {};

interface AntiGravityCanvasProps {
    progress: MotionValue<number>;
    onReady: () => void;
}

export function AntiGravityCanvas({ progress, onReady }: AntiGravityCanvasProps) {
    const isCandyMode = useUserStore((state) => state.isCandyMode);
    const totalFrames = isCandyMode ? 40 : 240;
    const folder = isCandyMode ? 'map_frames' : 'map_frames_dark';

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>(GLOBAL_FRAME_CACHE[folder] || []);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const [isVideoFinished, setIsVideoFinished] = useState(false);
    
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // References for the vanilla animation loop to avoid React renders
    const loopRef = useRef<number>(0);
    const lastProgressRef = useRef<number>(-1);

    // Preload Images
    useEffect(() => {
        // If we already have the requested frames fully cached, set instantly and return!
        if (GLOBAL_FRAME_CACHE[folder] && GLOBAL_FRAME_CACHE[folder].length === totalFrames) {
            imagesRef.current = GLOBAL_FRAME_CACHE[folder];
            lastProgressRef.current = -1; // CRITICAL: Force the `tick` loop to redraw using the new cache
            setIsImagesLoaded(true);
            return;
        }

        // Only show loading if we have absolute NO cached frames playing in the engine
        if (imagesRef.current.length === 0) {
            setIsImagesLoaded(false);
            setImagesLoaded(0);
        }

        let loadedCount = 0;
        const loadedImages: HTMLImageElement[] = new Array(totalFrames);
        let mounted = true;

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = `/assets/${folder}/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
            img.onload = () => {
                if (!mounted) return;
                loadedCount++;

                // Track loading progress only if we are displaying the loading screen
                if (!isImagesLoaded) {
                    setImagesLoaded(loadedCount);
                }

                if (loadedCount === totalFrames) {
                    GLOBAL_FRAME_CACHE[folder] = loadedImages;     // Cache globally
                    imagesRef.current = loadedImages;              // Overwrite current holds safely
                    lastProgressRef.current = -1;                  // CRITICAL: Force the `tick` loop to instantly paint the new theme
                    setIsImagesLoaded(true);
                }
            };
            loadedImages[i - 1] = img;
        }

        return () => {
            mounted = false;
        };
        // Removed `onReady` and `isCandyMode` from deps, dependent uniquely on `folder` logic.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folder, totalFrames]);

    // Effect to handle total readiness
    useEffect(() => {
        if (isImagesLoaded && isVideoFinished) {
            setIsReady(true);
            onReady();
        }
    }, [isImagesLoaded, isVideoFinished, onReady]);

    // High Performance Engine Loop
    useEffect(() => {
        if (!isReady || !canvasRef.current || !imagesRef.current.length) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for max perf
        if (!ctx) return;

        let canvasWidth = window.innerWidth;
        let canvasHeight = window.innerHeight;
        let dpr = window.devicePixelRatio || 1;

        // Configuration setup
        const setupCanvasContext = () => {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            dpr = window.devicePixelRatio || 1;

            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;
            canvas.style.width = `${canvasWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
        };

        setupCanvasContext();

        // Optimized native draw function (no React lifecycle tied)
        const renderNativeFrame = (val: number) => {
            const index = Math.floor(val * (totalFrames - 1));
            const safeIndex = Math.max(0, Math.min(totalFrames - 1, index));
            const img = imagesRef.current[safeIndex];

            if (!img) return;

            // Direct calculate avoiding state
            const canvasRatio = (canvasWidth * dpr) / (canvasHeight * dpr);
            const imgRatio = img.width / img.height;

            let drawWidth = canvasWidth * dpr;
            let drawHeight = canvasHeight * dpr;
            let offsetX = 0;
            let offsetY = 0;

            if (canvasRatio > imgRatio) {
                drawHeight = (canvasWidth * dpr) / imgRatio;
                offsetY = ((canvasHeight * dpr) - drawHeight) / 2;
            } else {
                drawWidth = (canvasHeight * dpr) * imgRatio;
                offsetX = ((canvasWidth * dpr) - drawWidth) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        };

        // Window Resize
        const handleResize = () => {
            setupCanvasContext();
            lastProgressRef.current = -1; // Force a redraw
            renderNativeFrame(progress.get() || 0); // Force immediate redraw on resize
        };
        window.addEventListener('resize', handleResize);

        // Vanilla JS Render Loop - Runs continuously, independent of React
        const tick = () => {
            const currentProgress = progress.get() || 0; // fallback to 0 if undefined/NaN

            // Only draw if scroll progress actually changed
            if (currentProgress !== lastProgressRef.current) {
                renderNativeFrame(currentProgress);
                lastProgressRef.current = currentProgress;
            }

            loopRef.current = requestAnimationFrame(tick);
        };

        // FORCE FIRST PAINT IMMEDIATELY (Don't wait for scroll delta or tick loop to catch up)
        renderNativeFrame(progress.get() || 0);

        // Start Loop
        tick();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(loopRef.current);
        };
    }, [isReady, progress, totalFrames]); // Only rebinds if completely Unready/Ready again

    return (
        <>
            {!isReady && (
                <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050814]">
                    <video
                        src="/assets/intro.mp4"
                        autoPlay
                        playsInline
                        preload="auto"
                        onPlaying={() => setIsVideoPlaying(true)}
                        onTimeUpdate={(e) => {
                            const vid = e.target as HTMLVideoElement;
                            if (vid.duration && vid.duration - vid.currentTime < 0.5) {
                                setIsFadingOut(true);
                            }
                        }}
                        onEnded={() => setIsVideoFinished(true)}
                        className={`w-full h-full object-cover relative z-10 transition-opacity duration-500 ease-in-out ${isVideoPlaying && !isFadingOut ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {/* Fallback loader in case video finishes but images are still loading */}
                    {isVideoFinished && !isImagesLoaded && (
                        <div className="absolute bottom-10 flex flex-col items-center text-pink-500 font-mono tracking-widest font-bold z-10">
                            <div className="text-sm mb-2 animate-pulse">LOADING MAP...</div>
                            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                                <div
                                    className="h-full bg-pink-500 transition-all duration-200"
                                    style={{ width: `${(imagesLoaded / totalFrames) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
            <canvas
                ref={canvasRef}
                className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            />
        </>
    );
}
