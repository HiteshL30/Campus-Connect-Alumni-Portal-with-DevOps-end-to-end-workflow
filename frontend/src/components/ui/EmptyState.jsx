import { motion } from 'framer-motion';
import { Sparkles, Inbox, SearchX, Globe } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
    title = "No Data Found",
    description = "There are no records to display at the moment.",
    icon: Icon = Inbox,
    actionLabel,
    onAction
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 text-center"
        >
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-white shadow-glass rounded-[32px] flex items-center justify-center text-secondary-200">
                    <Icon size={48} />
                </div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute -top-3 -right-3 text-primary-400"
                >
                    <Sparkles size={24} />
                </motion.div>
            </div>

            <h3 className="text-2xl font-black text-secondary-900 tracking-tight mb-2">{title}</h3>
            <p className="text-secondary-500 font-medium max-w-sm mx-auto leading-relaxed">
                {description}
            </p>

            {actionLabel && (
                <Button
                    onClick={onAction}
                    className="mt-8 h-12 px-8 rounded-xl shadow-lg shadow-primary-500/10"
                >
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;
