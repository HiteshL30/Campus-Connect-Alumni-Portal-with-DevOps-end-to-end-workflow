import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, User, Menu, ChevronDown, CheckCheck, Clock, MessageSquare, Briefcase, Calendar, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { notificationAPI } from '../services/api';
import Button from './ui/Button';
import { formatDistanceToNow } from 'date-fns';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const fetchNotifications = async () => {
    try {
      const count = await notificationAPI.getUnreadCount();
      setUnreadCount(count);
      const response = await notificationAPI.getAll({ size: 5 });
      setNotifications(response.data.content || []);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read');
    }
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

  return (
    <nav className="sticky top-0 z-40 w-full h-20 bg-white/70 backdrop-blur-xl border-b border-secondary-200/50 flex items-center justify-between px-6 lg:px-10 transition-all duration-300">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-2 rounded-xl"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </Button>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-secondary-500 hover:text-primary-600 bg-secondary-50 rounded-2xl transition-all"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-3.5 h-3.5 bg-primary-600 border-2 border-white rounded-full flex items-center justify-center text-[8px] text-white font-bold"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-secondary-100 overflow-hidden"
              >
                <div className="p-4 bg-secondary-50/50 border-b border-secondary-100 flex items-center justify-between">
                  <h3 className="font-bold text-secondary-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <CheckCheck size={14} /> Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 border-b border-secondary-50 hover:bg-secondary-50 transition-colors cursor-pointer flex gap-3 ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-secondary-100'}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm leading-snug ${!notification.isRead ? 'text-secondary-900 font-bold' : 'text-secondary-600 font-medium'}`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock size={12} className="text-secondary-400" />
                            <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest">
                              {formatDistanceToNow(new Date(notification.createdAt))} ago
                            </span>
                          </div>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 self-start" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center">
                      <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-secondary-400">
                        <Bell size={32} />
                      </div>
                      <p className="font-bold text-secondary-900">All caught up!</p>
                      <p className="text-xs text-secondary-500 mt-1">No new notifications right now.</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-secondary-50/50 text-center">
                  <Link 
                    to="/notifications" 
                    className="text-xs font-black text-secondary-500 hover:text-primary-600 transition-colors uppercase tracking-widest"
                  >
                    See all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-10 w-[1px] bg-secondary-100 hidden md:block" />

        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-3 group cursor-pointer p-1.5 pr-3 hover:bg-secondary-50 rounded-2xl transition-all"
        >
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-500/20 group-hover:rotate-6 transition-transform">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-black text-secondary-900 leading-none">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mt-1">{user?.role}</p>
          </div>
          <ChevronDown size={14} className="text-secondary-400 group-hover:translate-y-0.5 transition-transform" />
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2.5 rounded-2xl"
          onClick={() => { logout(); navigate('/login'); }}
        >
          <LogOut size={22} />
        </Button>
      </div>
    </nav>
  );
}
