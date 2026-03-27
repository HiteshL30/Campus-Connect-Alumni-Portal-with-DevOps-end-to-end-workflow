import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Input = ({ label, error, className = '', ...props }) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            {label && (
                <label className={`text-sm font-bold transition-colors duration-200 ml-1 ${isFocused ? 'text-primary-600' : 'text-secondary-600'}`}>
                    {label}
                </label>
            )}
            <div className="relative group">
                <input
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`w-full px-5 py-4 rounded-2xl border bg-white/50 backdrop-blur-sm
            transition-all duration-300 placeholder:text-secondary-400 font-medium
            ${error
                            ? 'border-red-500 ring-4 ring-red-500/10'
                            : 'border-secondary-200 group-hover:border-secondary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white'
                        }`}
                    {...props}
                    value={props.value ?? ''}
                />
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-primary-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: isFocused ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                />
            </div>
            <AnimatePresence>
                {error && (
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs font-bold text-red-500 ml-1 mt-0.5"
                    >
                        {error}
                    </motion.span>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Input;
