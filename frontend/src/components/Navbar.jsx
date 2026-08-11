import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, Menu, ChevronDown, CheckCheck, Clock, MessageSquare, Briefcase, Calendar, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { notificationAPI } from '../services/api';
import Button from './ui/Button';
import { formatDistanceToNow } from 'date-fns';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Scroll-based glass effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const count = await notificationAPI.getUnreadCount();
      setUnreadCount(count);
      const response = await notificationAPI.getUnread();
      setNotifications(response.data || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error.response?.data || error.message);
      setNotifications([]);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) { console.error('Failed to mark as read'); }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) { console.error('Failed to mark all as read'); }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'MESSAGE_RECEIVED': return <MessageSquare className="text-blue-500" size={18} />;
      case 'JOB_POSTED': return <Briefcase className="text-emerald-500" size={18} />;
      case 'EVENT_CREATED': return <Calendar className="text-purple-500" size={18} />;
      case 'CONNECTION_REQUEST':
      case 'CONNECTION_ACCEPTED': return <UserPlus className="text-amber-500" size={18} />;
      default: return <Bell className="text-secondary-400" size={18} />;
    }
  };

  const getTimeAgo = (dateStr) => {
    try { return formatDistanceToNow(new Date(dateStr)); }
    catch { return 'recently'; }
  };

  return (
    <motion.nav
      className="sticky top-0 z-40 w-full h-20 flex items-center justify-between px-6 lg:px-10 transition-all duration-300"
      animate={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
        borderBottomColor: scrolled ? 'rgba(226,232,240,0.8)' : 'rgba(226,232,240,0.3)',
        boxShadow: scrolled ? '0 4px 20px -4px rgba(0,0,0,0.06)' : 'none',
      }}
      style={{ borderBottomWidth: 1, borderBottomStyle: 'solid' }}
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden p-2.5 rounded-xl text-secondary-600 hover:bg-secondary-100 transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </motion.button>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="relative p-2.5 text-secondary-500 hover:text-primary-600 bg-secondary-50 hover:bg-primary-50 rounded-2xl transition-all"
            aria-label="Notifications"
          >
            <Bell size={22} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary-600 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-black px-1"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-secondary-100 overflow-hidden"
              >
                <div className="p-4 bg-secondary-50/60 border-b border-secondary-100 flex items-center justify-between">
                  <h3 className="font-black text-secondary-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
                      <CheckCheck size={13} /> Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.length > 0 ? notifications.map((notif, idx) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 border-b border-secondary-50 hover:bg-secondary-50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-primary-50/40' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-secondary-100'}`}>
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-snug ${!notif.isRead ? 'text-secondary-900 font-bold' : 'text-secondary-600 font-medium'}`}>
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock size={11} className="text-secondary-400" />
                          <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">
                            {getTimeAgo(notif.createdAt)} ago
                          </span>
                        </div>
                      </div>
                      {!notif.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />}
                    </motion.div>
                  )) : (
                    <div className="p-10 text-center">
                      <div className="w-14 h-14 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Bell size={24} className="text-secondary-400" />
                      </div>
                      <p className="font-black text-secondary-800 text-sm">All caught up!</p>
                      <p className="text-xs text-secondary-400 mt-1">No new notifications.</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-secondary-50/60 text-center border-t border-secondary-100">
                  <Link to="/notifications" onClick={() => setShowNotifications(false)} className="text-xs font-black text-secondary-500 hover:text-primary-600 transition-colors uppercase tracking-widest">
                    See all notifications →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-secondary-200 hidden md:block" />

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-3 group cursor-pointer p-1.5 pr-3 hover:bg-secondary-50 rounded-2xl transition-all"
          >
            <motion.div
              whileHover={{ rotate: 6 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary-500/25"
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </motion.div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-black text-secondary-900 leading-none">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-0.5">{user?.role}</p>
            </div>
            <motion.div animate={{ rotate: showUserMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={14} className="text-secondary-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ type: 'spring', damping: 24, stiffness: 300 }}
                className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] border border-secondary-100 overflow-hidden py-2"
              >
                <button
                  onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-secondary-700 hover:bg-secondary-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 font-black text-xs">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  View Profile
                </button>
                <div className="h-px bg-secondary-100 mx-3 my-1" />
                <button
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <LogOut size={14} className="text-red-500" />
                  </div>
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
