import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './Chatbot';

// Scroll progress bar
const ScrollProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 h-[3px] z-[9999] pointer-events-none"
            style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
            }}
            transition={{ duration: 0 }}
        />
    );
};

const Layout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-secondary-50 relative overflow-x-hidden">
            {isAuthenticated && (
                <>
                    <ScrollProgressBar />
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                    <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                        <Navbar toggleSidebar={toggleSidebar} />
                        <main className="flex-1 p-4 md:p-6 lg:p-10">
                            <div className="max-w-7xl mx-auto h-full">
                                {children}
                            </div>
                        </main>
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 z-40 bg-secondary-900/60 backdrop-blur-sm lg:hidden"
                                onClick={toggleSidebar}
                            />
                        )}
                    </AnimatePresence>
                </>
            )}
            {!isAuthenticated && children}
            <Chatbot />
        </div>
    );
};

export default Layout;
