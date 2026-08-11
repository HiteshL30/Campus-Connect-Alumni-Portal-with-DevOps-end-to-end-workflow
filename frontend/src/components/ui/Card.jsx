import { motion } from 'framer-motion';
import { springCard } from '../../utils/animations';
import { twMerge } from 'tailwind-merge';

/**
 * Upgraded Card with spring physics, optional glow and gradient border
 * @param {boolean} glow - Neon glow shadow on hover
 * @param {string} glowColor - 'blue' | 'purple' | 'emerald' | 'rose' | 'amber'
 * @param {boolean} glass - Glassmorphism style
 */
const glowColors = {
    blue: 'hover:shadow-glow-blue',
    purple: 'hover:shadow-glow-purple',
    emerald: 'hover:shadow-glow-emerald',
};

const Card = ({
    children,
    className = '',
    hover = true,
    delay = 0,
    glow = false,
    glowColor = 'blue',
    glass = false,
    onClick,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
            whileHover={hover ? {
                y: -6,
                transition: { type: 'spring', stiffness: 320, damping: 20 }
            } : undefined}
            whileTap={hover ? {
                scale: 0.985,
                transition: { type: 'spring', stiffness: 400, damping: 25 }
            } : undefined}
            onClick={onClick}
            className={twMerge(
                'rounded-[28px] border p-6',
                glass
                    ? 'bg-white/80 backdrop-blur-xl border-white/60 shadow-glass'
                    : 'bg-white border-secondary-200/60 shadow-soft',
                hover && 'hover:shadow-premium cursor-pointer',
                hover && glow && glowColors[glowColor],
                'transition-shadow duration-300',
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default Card;
