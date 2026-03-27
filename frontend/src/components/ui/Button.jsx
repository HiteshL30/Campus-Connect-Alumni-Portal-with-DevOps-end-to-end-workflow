import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { buttonClick } from '../../utils/animations';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none rounded-2xl relative overflow-hidden';

    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/20 active:shadow-none',
        secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 border border-secondary-200/50',
        outline: 'bg-transparent border-2 border-secondary-200 text-secondary-700 hover:border-primary-500 hover:text-primary-600',
        ghost: 'bg-transparent text-secondary-600 hover:bg-secondary-50',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover="hover"
            whileTap="tap"
            variants={buttonClick}
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading...</span>
                </div>
            ) : children}
        </motion.button>
    );
};

export default Button;
