import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariants } from '../../utils/animations';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '2xl' }) => {
    if (!isOpen) return null;

    const maxWidthClasses = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-secondary-900/60 backdrop-blur-md"
                />

                {/* Modal content */}
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white shadow-glass rounded-[48px] overflow-hidden flex flex-col max-h-[90vh] border-none`}
                >
                    {/* Header */}
                    <div className="px-10 py-8 flex items-center justify-between bg-secondary-50/50 border-b border-secondary-100">
                        <h2 className="text-2xl font-black text-secondary-900 tracking-tight">{title}</h2>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-white text-secondary-400 hover:text-secondary-600 rounded-2xl transition-all shadow-sm ring-1 ring-secondary-200/50"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-10 overflow-y-auto scrollbar-hide">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Modal;
