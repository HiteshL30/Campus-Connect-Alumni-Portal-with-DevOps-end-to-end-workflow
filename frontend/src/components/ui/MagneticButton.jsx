import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * MagneticButton - Button that magnetically follows the cursor
 * @param {number} strength - Magnetic pull strength (0-1)
 * @param {number} radius - Distance in px at which magnet activates
 */
export default function MagneticButton({
    children,
    className = '',
    strength = 0.3,
    radius = 80,
    onClick,
    disabled = false,
    ...props
}) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { stiffness: 200, damping: 15, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e) => {
        if (!ref.current || disabled) return;
        const rect = ref.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
            x.set(dx * strength);
            y.set(dy * strength);
            setIsHovered(true);
        }
    }, [disabled, radius, strength, x, y]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    }, [x, y]);

    // Ripple effect
    const handleClick = useCallback((e) => {
        if (disabled) return;
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top: ${e.clientY - rect.top - size / 2}px;
            border-radius: 50%;
            background: rgba(255,255,255,0.35);
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s linear forwards;
        `;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
        onClick?.(e);
    }, [disabled, onClick]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    return (
        <motion.button
            ref={ref}
            style={{ x: springX, y: springY }}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            whileTap={{ scale: 0.95 }}
            className={twMerge(
                'relative overflow-hidden inline-flex items-center justify-center',
                'cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed',
                className
            )}
            disabled={disabled}
            {...props}
        >
            {children}
        </motion.button>
    );
}
