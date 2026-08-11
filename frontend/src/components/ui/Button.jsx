import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useCallback, useRef } from 'react';

const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20',
    secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-800',
    outline: 'border border-secondary-200 bg-white hover:bg-secondary-50 text-secondary-700',
    ghost: 'bg-transparent hover:bg-secondary-100 text-secondary-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20',
    gradient: 'text-white shadow-lg',
};

const sizes = {
    xs: 'text-xs px-3 py-1.5 rounded-lg',
    sm: 'text-sm px-4 py-2 rounded-xl',
    md: 'text-sm px-5 py-2.5 rounded-xl',
    lg: 'text-base px-7 py-3.5 rounded-2xl',
    xl: 'text-lg px-8 py-4 rounded-2xl',
};

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    isLoading = false,   // alias support — consumed here, never forwarded to DOM
    gradient = false,
    ripple = true,
    onClick,
    type = 'button',
    // Explicitly destructure any other non-DOM custom props here
    loadingText,         // consumed if passed, not forwarded
    ...props
}) => {
    // Merge isLoading alias
    const isLoadingState = loading || isLoading;
    const ref = useRef(null);

    // Ripple handler
    const handleClick = useCallback((e) => {
        if (disabled || isLoadingState || !ripple) return;
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const rippleEl = document.createElement('span');
        rippleEl.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top: ${e.clientY - rect.top - size / 2}px;
            border-radius: 50%;
            background: rgba(255,255,255,0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.55s linear forwards;
            z-index: 10;
        `;
        el.appendChild(rippleEl);
        setTimeout(() => rippleEl.remove(), 650);
        onClick?.(e);
    }, [disabled, isLoadingState, ripple, onClick]);

    const gradientStyle = gradient ? {
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        backgroundSize: '200% 200%',
    } : {};

    return (
        <motion.button
            ref={ref}
            type={type}
            whileHover={!disabled && !isLoadingState ? {
                scale: 1.02,
                transition: { type: 'spring', stiffness: 400, damping: 20 }
            } : undefined}
            whileTap={!disabled && !isLoadingState ? {
                scale: 0.96,
                transition: { type: 'spring', stiffness: 400, damping: 25 }
            } : undefined}
            onClick={handleClick}
            disabled={disabled || isLoadingState}
            style={gradientStyle}
            className={twMerge(
                'relative overflow-hidden inline-flex items-center justify-center gap-2',
                'font-semibold transition-colors duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
                variants[variant] || variants.primary,
                sizes[size] || sizes.md,
                gradient && variants.gradient,
                className
            )}
            {...props}
        >
            {isLoadingState && (
                <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                />
            )}
            {children}
        </motion.button>
    );
};

export default Button;
