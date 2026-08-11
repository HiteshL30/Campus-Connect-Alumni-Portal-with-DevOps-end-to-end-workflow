import { twMerge } from 'tailwind-merge';

/**
 * Skeleton - Shimmer loading placeholder
 * @param {string} variant - 'rect' | 'circle' | 'text' | 'card'
 */
const Skeleton = ({ className = '', variant = 'rect', lines = 3 }) => {
    if (variant === 'text') {
        return (
            <div className={twMerge('space-y-2', className)}>
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={twMerge(
                            'relative overflow-hidden rounded-lg bg-secondary-100',
                            'h-4',
                            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
                        )}
                    >
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                    </div>
                ))}
            </div>
        );
    }

    if (variant === 'circle') {
        return (
            <div className={twMerge('relative overflow-hidden rounded-full bg-secondary-100', className)}>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
            </div>
        );
    }

    if (variant === 'card') {
        return (
            <div className={twMerge('rounded-[28px] bg-white border border-secondary-100 p-6 space-y-4', className)}>
                <div className="flex items-center gap-4">
                    <div className="relative overflow-hidden w-14 h-14 rounded-2xl bg-secondary-100 flex-shrink-0">
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="relative overflow-hidden h-4 bg-secondary-100 rounded-lg w-2/3">
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                        </div>
                        <div className="relative overflow-hidden h-3 bg-secondary-100 rounded-lg w-1/2">
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {[1, 2].map(i => (
                        <div key={i} className={`relative overflow-hidden h-3 bg-secondary-100 rounded-lg ${i === 2 ? 'w-4/5' : 'w-full'}`}>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2">
                    {[1, 2].map(i => (
                        <div key={i} className="relative overflow-hidden h-8 w-20 bg-secondary-100 rounded-xl">
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Default rect
    return (
        <div className={twMerge('relative overflow-hidden rounded-2xl bg-secondary-100', className)}>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer" />
        </div>
    );
};

export default Skeleton;
