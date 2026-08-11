import { motion } from 'framer-motion';
import { pageSlide } from '../../utils/animations';

/**
 * Upgraded AnimatedPage - supports stagger children mode and exit animations
 */
const AnimatedPage = ({
    children,
    className = '',
    animation = 'pageSlide',
    stagger = false,
}) => {
    if (stagger) {
        return (
            <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.08, delayChildren: 0.05 }
                    },
                    exit: { opacity: 0, transition: { duration: 0.2 } }
                }}
                className={className}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={pageSlide}
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
