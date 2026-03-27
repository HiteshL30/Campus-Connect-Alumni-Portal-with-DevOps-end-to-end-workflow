import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '../../utils/animations';

const AnimatedPage = ({ children, className = '', animation = 'slideUp' }) => {
    const variants = {
        fadeIn,
        slideUp
    };

    return (
        <motion.div
            variants={variants[animation]}
            initial="initial"
            animate="animate"
            exit="exit"
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
