import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { backdropVariants, modalVariants } from '../../utils/animations';

/**
 * AnimatedModal - Premium modal with scale+blur backdrop
 * @param {boolean} isOpen - Show/hide modal
 * @param {function} onClose - Called on backdrop click or ESC
 * @param {string} title - Modal title
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 */
const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
};

export default function AnimatedModal({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    className = '',
}) {
    const firstFocusableRef = useRef(null);

    // ESC key handler
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Focus first element on open
    useEffect(() => {
        if (isOpen && firstFocusableRef.current) {
            setTimeout(() => firstFocusableRef.current?.focus(), 50);
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    aria-modal="true"
                    role="dialog"
                    aria-label={title}
                >
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 bg-secondary-900/50 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`
                            relative w-full ${sizes[size] || sizes.md}
                            bg-white rounded-[28px]
                            border border-secondary-200/60
                            shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]
                            overflow-hidden
                            ${className}
                        `}
                    >
                        {/* Header */}
                        {(title || showClose) && (
                            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-secondary-100">
                                {title && (
                                    <h2 className="text-xl font-black text-secondary-900 tracking-tight">
                                        {title}
                                    </h2>
                                )}
                                {showClose && (
                                    <button
                                        ref={firstFocusableRef}
                                        onClick={onClose}
                                        className="ml-auto p-2 rounded-xl text-secondary-400 hover:text-secondary-700 hover:bg-secondary-100 transition-colors"
                                        aria-label="Close modal"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="px-7 py-6">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
