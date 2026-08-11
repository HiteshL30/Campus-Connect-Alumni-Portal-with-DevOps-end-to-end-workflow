import { useRef, useEffect, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

/**
 * AnimatedCounter - Count-up animation triggered when element enters viewport
 * @param {number} to - Target number
 * @param {number} from - Start number (default 0)
 * @param {number} duration - Animation duration in seconds
 * @param {string} prefix - e.g. "$"
 * @param {string} suffix - e.g. "+"
 * @param {function} formatter - Custom format function
 */
export default function AnimatedCounter({
    to,
    from = 0,
    duration = 1.8,
    prefix = '',
    suffix = '',
    formatter = null,
    className = '',
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
    const [displayValue, setDisplayValue] = useState(from);

    useEffect(() => {
        if (!isInView) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setDisplayValue(to);
            return;
        }

        const controls = animate(from, to, {
            duration,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (value) => {
                setDisplayValue(Math.round(value));
            }
        });

        return () => controls.stop();
    }, [isInView, from, to, duration]);

    const formatted = formatter ? formatter(displayValue) : displayValue.toLocaleString();

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className={className}
        >
            {prefix}{formatted}{suffix}
        </motion.span>
    );
}
