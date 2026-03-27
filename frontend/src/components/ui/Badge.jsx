import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-secondary-100 text-secondary-700',
        primary: 'bg-primary-100 text-primary-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        blue: 'bg-blue-100 text-blue-700',
    };

    return (
        <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider
      ${variants[variant]}
      ${className}
    `}>
            {children}
        </span>
    );
};

export default Badge;
