import { motion } from 'framer-motion';

const Skeleton = ({ className = '', variant = 'rect' }) => {
    const baseStyles = "bg-secondary-100 relative overflow-hidden";

    const variants = {
        rect: "rounded-2xl",
        circle: "rounded-full",
        pill: "rounded-full"
    };

    return (
        <div className={`${baseStyles} ${variants[variant]} ${className}`}>
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "linear"
                }}
            />
        </div>
    );
};

export default Skeleton;
