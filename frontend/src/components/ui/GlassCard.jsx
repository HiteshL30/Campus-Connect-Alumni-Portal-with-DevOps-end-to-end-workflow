import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { springCard } from '../../utils/animations';

/**
 * GlassCard - Premium glassmorphism card with animated gradient border
 * @param {boolean} glow - Show glow shadow on hover
 * @param {string} glowColor - CSS color for glow (default blue)
 * @param {boolean} gradient - Show animated gradient border on hover
 * @param {boolean} hover - Enable hover animations
 */
const GlassCard = ({
    children,
    className = '',
    hover = true,
    delay = 0,
    glow = false,
    gradient = false,
    glowColor = 'rgba(59,130,246,0.3)',
    onClick,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={hover ? {
                y: -6,
                transition: { type: 'spring', stiffness: 300, damping: 18 }
            } : undefined}
            whileTap={hover ? { scale: 0.98 } : undefined}
            onClick={onClick}
            className={twMerge(
                'relative rounded-[28px] overflow-hidden',
                'bg-white/80 backdrop-blur-xl',
                'border border-white/60',
                'shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]',
                hover && 'cursor-pointer',
                gradient && 'gradient-border',
                className
            )}
            style={glow ? {
                '--glow-color': glowColor,
            } : undefined}
        >
            {/* Gradient sheen overlay */}
            <div
                className="absolute inset-0 pointer-events-none rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
                }}
            />

            {/* Animated gradient border on hover */}
            {gradient && (
                <div
                    className="absolute inset-0 rounded-[28px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15), rgba(236,72,153,0.15))',
                        backgroundSize: '300% 300%',
                        animation: 'gradient-shift 4s ease infinite',
                        zIndex: 0,
                    }}
                />
            )}

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
