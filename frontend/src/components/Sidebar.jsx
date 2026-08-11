import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Calendar,
    MessageSquare,
    UserCircle,
    Link as LinkIcon,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Contact,
    Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { useState, useEffect } from 'react';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const { isAdmin, user } = useAuth();
    const [stats, setStats] = useState({
        connectionCount: 0,
        pendingRequestsCount: 0,
        savedJobsCount: 0,
        appliedJobsCount: 0,
        jobPostingsCount: 0,
        totalApplicantsCount: 0,
        unreadMessages: 0,
    });

    useEffect(() => {
        if (user) {
            fetchStats();
            const interval = setInterval(fetchStats, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await userAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch sidebar stats:', error.response?.data || error.message);
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Alumni', path: '/alumni', icon: Users },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Connections', path: '/connections', icon: LinkIcon, count: stats.pendingRequestsCount },
        { name: 'Messages', path: '/chats', icon: MessageSquare, count: stats.unreadMessages },
        { name: 'Profile', path: '/profile', icon: UserCircle },
    ];

    if (isAdmin) {
        navItems.push({ name: 'Applications', path: '/admin', icon: ShieldCheck });
        navItems.push({ name: 'User Registry', path: '/admin/users', icon: Contact });
    }

    if (user?.role === 'STUDENT' || user?.role === 'ALUMNI') {
        navItems.splice(4, 0, { name: 'Interview Prep', path: '/interview-prep', icon: Bot });
    }

    const sidebarVariants = {
        open: { width: 280, x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
        closed: { width: 88, x: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
        mobileOpen: { x: 0, width: 280, transition: { type: 'spring', damping: 25, stiffness: 200 } },
        mobileClosed: { x: -280, width: 280, transition: { type: 'spring', damping: 25, stiffness: 200 } },
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

    return (
        <motion.aside
            initial={false}
            animate={isMobile ? (isOpen ? 'mobileOpen' : 'mobileClosed') : (isOpen ? 'open' : 'closed')}
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 bg-secondary-900 text-white z-50 border-r border-white/5 flex flex-col lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 relative shrink-0 border-b border-white/5">
                <motion.div
                    whileHover={{ rotate: 12, scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                    className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/40"
                >
                    <Sparkles size={22} className="text-white" />
                </motion.div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -12 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 text-xl font-black tracking-tighter whitespace-nowrap"
                        >
                            Campus<span className="text-primary-400">Connect</span>
                        </motion.span>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-primary-600 rounded-full items-center justify-center text-white hover:bg-primary-500 transition-colors shadow-lg z-50"
                >
                    {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto" aria-label="Main navigation">
                {navItems.map((item, idx) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.3 }}
                    >
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `
                                relative flex items-center h-12 rounded-2xl transition-all duration-200 group overflow-hidden
                                ${isActive
                                    ? 'text-white'
                                    : 'text-secondary-400 hover:text-white hover:bg-white/8'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active background with layoutId animation */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active-bg"
                                            className="absolute inset-0 bg-primary-600 rounded-2xl shadow-lg shadow-primary-600/25"
                                            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                                        />
                                    )}

                                    <div className="relative z-10 w-12 h-full flex items-center justify-center shrink-0">
                                        <motion.div
                                            whileHover={!isActive ? { scale: 1.15, rotate: 5 } : {}}
                                            transition={{ type: 'spring', stiffness: 300 }}
                                        >
                                            <item.icon size={20} />
                                        </motion.div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {isOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -8 }}
                                                transition={{ duration: 0.15 }}
                                                className="relative z-10 flex-1 flex items-center justify-between pr-3 font-bold text-sm overflow-hidden"
                                            >
                                                <span className="truncate">{item.name}</span>
                                                {!!item.count && item.count > 0 && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="bg-white/20 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center"
                                                    >
                                                        {item.count}
                                                    </motion.span>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Tooltip when collapsed */}
                                    {!isOpen && (
                                        <div className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-secondary-800 text-white text-xs font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10 pointer-events-none">
                                            {item.name}
                                        </div>
                                    )}
                                </>
                            )}
                        </NavLink>
                    </motion.div>
                ))}
            </nav>

            {/* User Footer */}
            <div className="p-3 border-t border-white/5 shrink-0">
                <div className={`flex items-center ${isOpen ? 'p-3' : 'justify-center p-2'} bg-white/5 rounded-2xl transition-all hover:bg-white/10 cursor-pointer`}>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-9 h-9 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-xl flex items-center justify-center font-black text-secondary-300 shrink-0 text-sm"
                    >
                        {user?.firstName?.[0]}
                    </motion.div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="ml-3 overflow-hidden"
                            >
                                <p className="text-xs font-black truncate text-white leading-none">{user?.firstName} {user?.lastName}</p>
                                <p className="text-[10px] text-secondary-500 font-bold truncate uppercase tracking-widest mt-0.5">{user?.role}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}
