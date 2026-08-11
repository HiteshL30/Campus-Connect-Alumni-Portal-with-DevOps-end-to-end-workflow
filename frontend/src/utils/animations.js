// Enhanced animation variants for Framer Motion v12
export const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
};

export const slideUp = {
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { y: -12, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } }
};

export const slideInRight = {
    initial: { x: 30, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.25 } }
};

export const slideInLeft = {
    initial: { x: -30, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: 20, opacity: 0, transition: { duration: 0.25 } }
};

export const scaleIn = {
    initial: { scale: 0.92, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
    exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } }
};

export const pageSlide = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
    exit: { x: -10, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }
};

// Stagger container for child animations
export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        }
    }
};

export const staggerFast = {
    animate: {
        transition: {
            staggerChildren: 0.05,
        }
    }
};

// Item variant (used inside staggerContainer)
export const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
};

// Spring-based card hover
export const cardHover = {
    hover: {
        y: -6,
        transition: { type: 'spring', stiffness: 350, damping: 20 }
    },
    tap: {
        scale: 0.98,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

export const springCard = {
    hover: {
        y: -8,
        scale: 1.01,
        transition: { type: 'spring', stiffness: 300, damping: 18 }
    },
    tap: {
        scale: 0.97,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

// Button animations
export const buttonClick = {
    tap: { scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 17 } },
    hover: { scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 20 } }
};

// Modal
export const modalVariants = {
    hidden: { opacity: 0, scale: 0.94, y: 16 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring', damping: 26, stiffness: 320 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: 0.18, ease: 'easeIn' }
    }
};

export const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
};

// Nav item
export const navItem = {
    hover: {
        x: 3,
        transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
};

// Float animation
export const floatVariant = {
    animate: {
        y: [0, -10, 0],
        transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
    }
};

// Glow pulse
export const glowPulse = {
    animate: {
        boxShadow: [
            '0 0 5px rgba(59,130,246,0.2)',
            '0 0 25px rgba(59,130,246,0.5), 0 0 50px rgba(59,130,246,0.2)',
            '0 0 5px rgba(59,130,246,0.2)',
        ],
        transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
    }
};

// Number counter spring
export const counterVariant = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 200, damping: 15 }
    }
};
