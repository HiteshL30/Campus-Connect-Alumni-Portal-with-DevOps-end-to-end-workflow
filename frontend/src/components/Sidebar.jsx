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
    const [stats, setStats] = useState({ unreadMessages: 0, pendingConnections: 0 });

    useEffect(() => {
        if (user) {
            fetchStats();
            const interval = setInterval(fetchStats, 30000); // Polling every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const response = await userAPI.getStats();
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch sidebar stats');
        }
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Alumni', path: '/alumni', icon: Users },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Events', path: '/events', icon: Calendar },
        { name: 'Connections', path: '/connections', icon: LinkIcon, count: stats.pendingConnections },
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
        open: {
            width: 280,
            x: 0,
            transition: { type: "spring", damping: 25, stiffness: 200 }
        },
        closed: {
            width: 88,
            x: 0,
            transition: { type: "spring", damping: 25, stiffness: 200 }
        },
        mobileOpen: {
            x: 0,
            width: 280,
            transition: { type: "spring", damping: 25, stiffness: 200 }
        },
        mobileClosed: {
            x: -280,
            width: 280,
            transition: { type: "spring", damping: 25, stiffness: 200 }
        }
    };

    return (
        <motion.aside
            initial={false}
            animate={window.innerWidth < 1024 ? (isOpen ? "mobileOpen" : "mobileClosed") : (isOpen ? "open" : "closed")}
            variants={sidebarVariants}
            className={`
        fixed inset-y-0 left-0 bg-secondary-900 text-white z-50 border-r border-white/5 flex flex-col
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        transition-all duration-300
      `}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 relative shrink-0">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/40">
                    <Sparkles size={24} className="text-white" />
                </div>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="ml-4 text-xl font-black tracking-tighter whitespace-nowrap"
                        >
                            Campus<span className="text-primary-500">Connect</span>
                        </motion.span>
                    )}
                </AnimatePresence>

                <button
                    onClick={toggleSidebar}
                    className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-primary-600 rounded-full items-center justify-center text-white hover:bg-primary-500 transition-colors shadow-lg z-50"
                >
                    {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
            </div>

            <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center h-14 rounded-2xl transition-all duration-300 relative group
              ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'text-secondary-400 hover:text-white hover:bg-white/10'}
            `}
                    >
                        <div className="w-14 h-full flex items-center justify-center shrink-0">
                            <item.icon size={22} className="transition-transform group-hover:scale-110" />
                        </div>

                        <AnimatePresence mode="wait">
                            {isOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex-1 flex items-center justify-between pr-4 font-bold overflow-hidden"
                                >
                                    <span className="truncate">{item.name}</span>
                                    {item.count && (
                                        <span className="bg-primary-500/20 text-primary-400 text-[10px] px-2 py-1 rounded-lg">
                                            {item.count}
                                        </span>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!isOpen && (
                            <div className="hidden lg:block absolute left-full ml-4 px-3 py-2 bg-secondary-800 text-white text-xs font-bold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-white/10">
                                {item.name}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Footer / User Summary */}
            <div className="p-4 border-t border-white/5 shrink-0">
                <div className={`flex items-center ${isOpen ? 'p-3' : 'justify-center'} bg-white/5 rounded-2xl transition-all hover:bg-white/10 cursor-pointer`}>
                    <div className="w-10 h-10 bg-secondary-700 rounded-xl flex items-center justify-center font-black text-secondary-400 shrink-0">
                        {user?.firstName?.[0]}
                    </div>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="ml-3 overflow-hidden"
                            >
                                <p className="text-xs font-black truncate text-white">{user?.firstName}</p>
                                <p className="text-[10px] text-secondary-500 font-bold truncate uppercase tracking-widest">{user?.role}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.aside>
    );
}
