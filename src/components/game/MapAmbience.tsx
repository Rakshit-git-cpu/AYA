import { useEffect, useRef } from 'react';

// --- Neon Rain Layer ---
const NeonRainLayer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let isVisible = true;
        let drops: any[] = [];

        const initDrops = () => {
            const isMobile = window.innerWidth <= 768;
            const count = isMobile ? 40 : 80;
            drops = [];
            for (let i = 0; i < count; i++) {
                const opacity = 0.1 + Math.random() * 0.25; // max 0.35
                drops.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    length: 15 + Math.random() * 25,
                    speed: 2 + Math.random() * 4,
                    opacity: opacity,
                    baseColorStr: Math.random() < 0.7 ? '0, 240, 255' : '180, 0, 255',
                    width: 1 + Math.random()
                });
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initDrops();
        };

        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            if (!isVisible) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            
            drops.forEach(drop => {
                // Parallax depth based on opacity
                const currentSpeed = drop.speed + (drop.speed * drop.opacity * 2);
                drop.y += currentSpeed;
                
                if (drop.y > canvas.height + drop.length) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * canvas.width;
                    drop.speed = 2 + Math.random() * 4;
                    drop.opacity = 0.1 + Math.random() * 0.25;
                    drop.baseColorStr = Math.random() < 0.7 ? '0, 240, 255' : '180, 0, 255';
                    drop.width = 1 + Math.random();
                }

                ctx.beginPath();
                const grad = ctx.createLinearGradient(drop.x, drop.y - drop.length, drop.x, drop.y);
                grad.addColorStop(0, `rgba(${drop.baseColorStr}, 0)`);
                grad.addColorStop(1, `rgba(${drop.baseColorStr}, ${drop.opacity})`);
                
                ctx.strokeStyle = grad;
                ctx.lineWidth = drop.width;
                ctx.moveTo(drop.x, drop.y - drop.length);
                ctx.lineTo(drop.x, drop.y);
                ctx.stroke();
            });
            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };
        
        render();

        const handleVisibility = () => {
            if (document.hidden) {
                isVisible = false;
                cancelAnimationFrame(animationFrameId);
            } else {
                isVisible = true;
                render();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', handleVisibility);
            cancelAnimationFrame(animationFrameId);
            drops = [];
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// --- Shooting Stars Layer ---
const ShootingStarsLayer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let isVisible = true;
        let stars: any[] = [];
        let nextStarTime = 0;
        const maxStars = 3;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            stars = [];
            nextStarTime = Date.now() + 1000 + Math.random() * 2000;
        };

        window.addEventListener('resize', resize);
        resize();

        const spawnStar = () => {
            const isMobile = window.innerWidth <= 768;
            const isWhite = Math.random() < 0.4;
            const baseColor = isWhite ? '255, 255, 255' : '255, 215, 0';
            const vx = (isMobile ? 6 + Math.random() * 4 : 8 + Math.random() * 6);

            stars.push({
                x: -200,
                y: Math.random() * (canvas.height * 0.4),
                vx: vx,
                vy: vx * 0.3,
                length: 80 + Math.random() * 100,
                opacity: 0,
                active: true,
                phase: 'fadein',
                baseColor: baseColor
            });
        };

        const render = () => {
            if (!isVisible) return;
            const now = Date.now();

            if (now > nextStarTime && stars.length < maxStars) {
                spawnStar();
                nextStarTime = now + 4000 + Math.random() * 4000;
            }
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            
            const maxOpacity = 0.9;
            
            for (let i = stars.length - 1; i >= 0; i--) {
                const star = stars[i];
                if (!star.active) {
                    stars.splice(i, 1);
                    continue;
                }

                if (star.phase === 'fadein') {
                    star.opacity += (maxOpacity / 12);
                    if (star.opacity >= maxOpacity) {
                        star.opacity = maxOpacity;
                        star.phase = 'travel';
                    }
                } else if (star.phase === 'fadeout') {
                    star.opacity -= (maxOpacity / 12);
                    if (star.opacity <= 0) {
                        star.active = false;
                    }
                }

                star.x += star.vx;
                star.y += star.vy;

                if (star.phase !== 'fadeout' && (star.x > canvas.width + star.length || star.y > canvas.height + star.length)) {
                    star.phase = 'fadeout';
                }

                const tailX = star.x - (star.vx * (star.length / 10));
                const tailY = star.y - (star.vy * (star.length / 10));
                
                const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
                grad.addColorStop(0, `rgba(${star.baseColor}, 0)`);
                grad.addColorStop(1, `rgba(${star.baseColor}, ${star.opacity})`);

                // Tail using triangle for taper
                const dx = star.vx;
                const dy = star.vy;
                const mag = Math.sqrt(dx*dx + dy*dy);
                const nx = -dy / mag;
                const ny = dx / mag;
                const halfW = 2; // 4px head width tapers to 0
                
                ctx.beginPath();
                ctx.moveTo(star.x + nx * halfW, star.y + ny * halfW);
                ctx.lineTo(tailX, tailY);
                ctx.lineTo(star.x - nx * halfW, star.y - ny * halfW);
                ctx.closePath();
                ctx.fillStyle = grad;
                ctx.fill();

                // Glow head
                ctx.beginPath();
                ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${star.baseColor}, ${star.opacity})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };
        
        render();

        const handleVisibility = () => {
            if (document.hidden) {
                isVisible = false;
                cancelAnimationFrame(animationFrameId);
            } else {
                isVisible = true;
                nextStarTime = Date.now() + 1000;
                render();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', handleVisibility);
            cancelAnimationFrame(animationFrameId);
            stars = [];
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// --- Constellation Lines Layer ---
const ConstellationLayer = ({ scrollY }: { scrollY: number }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const scrollRef = useRef(scrollY);

    useEffect(() => {
        scrollRef.current = scrollY;
    }, [scrollY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let isVisible = true;
        let stars: any[] = [];
        let lines: any[] = [];

        const initMap = () => {
            const isMobile = window.innerWidth <= 768;
            const starCount = isMobile ? 20 : 35;
            
            stars = [];
            lines = [];

            // Place stars in a wide vertical space to account for scroll parallax
            for (let i = 0; i < starCount; i++) {
                let x = Math.random() * canvas.width;
                const centerLeft = canvas.width * 0.35;
                const centerRight = canvas.width * 0.65;
                if (x > centerLeft && x < centerRight) {
                    x = Math.random() > 0.5 ? (Math.random() * centerLeft) : (centerRight + Math.random() * centerLeft);
                }

                stars.push({
                    id: i,
                    x: x,
                    y: -1000 + Math.random() * (canvas.height + 3000), // Spanned for scroll space
                    radius: 1 + Math.random() * 2,
                    opacity: 0.2 + Math.random() * 0.55, // max 0.75
                    targetOpacity: 0.2 + Math.random() * 0.55,
                    pulseSpeed: 0.002 + Math.random() * 0.003,
                    color: Math.random() > 0.3 ? '0, 242, 255' : '255, 255, 255',
                    depth: 0.3 + Math.random() * 0.7
                });
            }

            for (let i = 0; i < stars.length; i++) {
                let connections = 0;
                for (let j = i + 1; j < stars.length; j++) {
                    if (connections >= 3) break;
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist < 180) {
                        lines.push({
                            starA: i,
                            starB: j,
                            opacity: 0,
                            targetOpacity: 0.05 + Math.random() * 0.07, // max 0.12
                            phase: Math.random() > 0.4 ? 'visible' : 'hidden',
                            timer: Date.now() + Math.random() * 5000
                        });
                        connections++;
                    }
                }
            }
            
            lines.forEach(line => {
                if (line.phase === 'visible') line.opacity = line.targetOpacity;
            });
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initMap();
        };

        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            if (!isVisible) return;
            const now = Date.now();
            const currentScrollY = scrollRef.current;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            lines.forEach(line => {
                if (now > line.timer) {
                    if (line.phase === 'visible') {
                        line.phase = 'fadeout';
                        line.timer = now + 2000;
                    } else if (line.phase === 'hidden') {
                        line.phase = 'fadein';
                        line.timer = now + 2000;
                    } else if (line.phase === 'fadein') {
                        line.phase = 'visible';
                        line.timer = now + 3000 + Math.random() * 3000;
                    } else if (line.phase === 'fadeout') {
                        line.phase = 'hidden';
                        line.timer = now + 3000 + Math.random() * 3000;
                    }
                }

                if (line.phase === 'fadein') {
                    line.opacity += (line.targetOpacity / 120);
                    if (line.opacity > line.targetOpacity) line.opacity = line.targetOpacity;
                } else if (line.phase === 'fadeout') {
                    line.opacity -= (line.targetOpacity / 120);
                    if (line.opacity < 0) line.opacity = 0;
                }

                if (line.opacity > 0) {
                    const sa = stars[line.starA];
                    const sb = stars[line.starB];
                    
                    const ya = sa.y - (currentScrollY * sa.depth * 0.1);
                    const yb = sb.y - (currentScrollY * sb.depth * 0.1);
                    
                    if (ya < -50 || ya > canvas.height + 50 || yb < -50 || yb > canvas.height + 50) return;

                    ctx.beginPath();
                    ctx.moveTo(sa.x, ya);
                    ctx.lineTo(sb.x, yb);
                    ctx.strokeStyle = `rgba(0, 242, 255, ${line.opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });

            stars.forEach(star => {
                if (Math.abs(star.opacity - star.targetOpacity) < star.pulseSpeed) {
                    star.targetOpacity = 0.2 + Math.random() * 0.55;
                } else if (star.opacity < star.targetOpacity) {
                    star.opacity += star.pulseSpeed;
                } else {
                    star.opacity -= star.pulseSpeed;
                }

                const sy = star.y - (currentScrollY * star.depth * 0.1);

                if (sy > -50 && sy < canvas.height + 50) {
                    ctx.beginPath();
                    ctx.shadowBlur = star.radius * 8;
                    ctx.shadowColor = `rgba(${star.color}, ${star.opacity})`;
                    ctx.fillStyle = `rgba(${star.color}, ${star.opacity})`;
                    ctx.arc(star.x, sy, star.radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            });

            ctx.restore();
            animationFrameId = requestAnimationFrame(render);
        };
        
        render();

        const handleVisibility = () => {
            if (document.hidden) {
                isVisible = false;
                cancelAnimationFrame(animationFrameId);
            } else {
                isVisible = true;
                render();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', handleVisibility);
            cancelAnimationFrame(animationFrameId);
            stars = [];
            lines = [];
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export const MapAmbience = ({ scrollY }: { scrollY: number }) => {
    return (
        <div className="fixed inset-0 w-full h-full pointer-events-none z-[15]">
            <ConstellationLayer scrollY={scrollY} />
            <NeonRainLayer />
            <ShootingStarsLayer />
        </div>
    );
};
