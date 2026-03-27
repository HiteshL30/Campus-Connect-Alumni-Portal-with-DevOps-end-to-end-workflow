import { motion } from 'framer-motion';
import { cardHover } from '../../utils/animations';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className = '', hover = true, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={hover ? "hover" : ""}
            whileTap={hover ? "tap" : ""}
            variants={cardHover}
            className={twMerge(
                "bg-white rounded-[32px] border border-secondary-200/60 p-6 shadow-soft transition-shadow",
                hover ? "hover:shadow-premium" : "",
                className
            )}
        >
            {children}
        </motion.div>
    );
};

export default Card;
