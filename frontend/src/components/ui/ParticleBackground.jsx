import { useRef, useEffect } from 'react';

/**
 * ParticleBackground - Canvas-based interactive particle network
 * Particles connect with lines when nearby, react to mouse position
 */
export default function ParticleBackground({
    count = 60,
    color = '59, 130, 246',      // RGB without alpha
    lineColor = '59, 130, 246',
    maxDist = 130,
    speed = 0.5,
    mouseRadius = 120,
    className = '',
}) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let particles = [];
        let W = 0, H = 0;

        const resize = () => {
            W = canvas.width = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        };

        const rand = (min, max) => Math.random() * (max - min) + min;

        const initParticles = () => {
            particles = Array.from({ length: count }, () => ({
                x: rand(0, W),
                y: rand(0, H),
                vx: rand(-speed, speed),
                vy: rand(-speed, speed),
                r: rand(1.5, 3),
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, W, H);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Mouse repulsion
                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;
                const dx = p.x - mx;
                const dy = p.y - my;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius) {
                    const force = (mouseRadius - dist) / mouseRadius;
                    p.vx += (dx / dist) * force * 0.4;
                    p.vy += (dy / dist) * force * 0.4;
                }

                // Speed damping
                const speed2 = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed2 > speed * 2) {
                    p.vx = (p.vx / speed2) * speed * 2;
                    p.vy = (p.vy / speed2) * speed * 2;
                }

                p.x += p.vx;
                p.y += p.vy;

                // Bounce off walls
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
                p.x = Math.max(0, Math.min(W, p.x));
                p.y = Math.max(0, Math.min(H, p.y));

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, 0.5)`;
                ctx.fill();

                // Draw lines to nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const ddx = p.x - q.x;
                    const ddy = p.y - q.y;
                    const d = Math.sqrt(ddx * ddx + ddy * ddy);
                    if (d < maxDist) {
                        const alpha = (1 - d / maxDist) * 0.25;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animRef.current = requestAnimationFrame(draw);
        };

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -9999, y: -9999 };
        };

        const ro = new ResizeObserver(() => {
            resize();
            initParticles();
        });
        ro.observe(canvas);

        resize();
        initParticles();
        draw();

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animRef.current);
            ro.disconnect();
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [count, color, lineColor, maxDist, speed, mouseRadius]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
            aria-hidden="true"
        />
    );
}
