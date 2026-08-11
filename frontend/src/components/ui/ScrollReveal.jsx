import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ScrollReveal - Animates children when they enter the viewport
 * @param {string} variant - 'fade-up' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade'
 * @param {number} delay - animation delay in seconds
 * @param {number} threshold - 0-1, how much of element must be visible to trigger
 */
const variants = {
    'fade-up': {
        hidden: { opacity: 0, y: 32 },
        visible: { opacity: 1, y: 0 }
    },
    'fade-left': {
        hidden: { opacity: 0, x: -32 },
        visible: { opacity: 1, x: 0 }
    },
    'fade-right': {
        hidden: { opacity: 0, x: 32 },
        visible: { opacity: 1, x: 0 }
    },
    'zoom-in': {
        hidden: { opacity: 0, scale: 0.88 },
        visible: { opacity: 1, scale: 1 }
    },
    'fade': {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    }
};

export default function ScrollReveal({
    children,
    variant = 'fade-up',
    delay = 0,
    duration = 0.5,
    threshold = 0.15,
    className = '',
    once = true,
}) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        const el = ref.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [threshold, once]);

    const chosen = variants[variant] || variants['fade-up'];

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={chosen}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * ScrollRevealList - Staggered reveal for a list of items
 */
export function ScrollRevealList({ children, className = '', staggerDelay = 0.08, threshold = 0.1 }) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) { setIsVisible(true); return; }

        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
            { threshold }
        );
        const el = ref.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [threshold]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: staggerDelay } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * ScrollRevealItem - Use inside ScrollRevealList
 */
export function ScrollRevealItem({ children, className = '', variant = 'fade-up' }) {
    const chosen = variants[variant] || variants['fade-up'];
    return (
        <motion.div
            variants={{
                hidden: chosen.hidden,
                visible: { ...chosen.visible, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
