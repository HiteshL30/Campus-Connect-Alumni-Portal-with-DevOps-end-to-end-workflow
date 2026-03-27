import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './Chatbot';

const Layout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex min-h-screen bg-secondary-50 relative overflow-x-hidden">
            {isAuthenticated && (
                <>
                    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                    <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300`}>
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
