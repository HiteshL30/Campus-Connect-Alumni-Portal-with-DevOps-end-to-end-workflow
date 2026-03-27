import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import { Bell, Clock, CheckCheck, MessageSquare, Briefcase, Calendar, UserPlus, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, UNREAD

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getAll({ size: 50 });
      setNotifications(response.data.content || []);
    } catch (error) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'MESSAGE_RECEIVED': return <MessageSquare className="text-blue-500" size={20} />;
      case 'JOB_POSTED': return <Briefcase className="text-emerald-500" size={20} />;
      case 'EVENT_CREATED': return <Calendar className="text-purple-500" size={20} />;
      case 'CONNECTION_REQUEST': 
      case 'CONNECTION_ACCEPTED': return <UserPlus className="text-amber-500" size={20} />;
      default: return <Bell className="text-secondary-400" size={20} />;
    }
  };

  const filteredNotifications = notifications.filter(n => filter === 'ALL' || !n.isRead);

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-secondary-900 tracking-tight flex items-center gap-3">
            <Bell size={32} className="text-primary-600" />
            Notifications
          </h1>
          <p className="text-secondary-500 font-medium mt-1">Stay updated with your campus activity.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-secondary-100 p-1 rounded-xl">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('UNREAD')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'UNREAD' ? 'bg-white text-secondary-900 shadow-sm' : 'text-secondary-500 hover:text-secondary-700'}`}
            >
              Unread
            </button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
            className="text-primary-600 font-bold gap-2 text-xs"
          >
            <CheckCheck size={16} /> Mark all read
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl shadow-secondary-200/50 border border-secondary-100 overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-bold text-secondary-500 italic">Syncing notifications...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <AnimatePresence>
            <div className="divide-y divide-secondary-50">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 transition-all hover:bg-secondary-50/50 flex gap-4 ${!notification.isRead ? 'bg-primary-50/20' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${!notification.isRead ? 'bg-white shadow-md' : 'bg-secondary-100'}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={`text-base leading-relaxed ${!notification.isRead ? 'text-secondary-900 font-bold' : 'text-secondary-600 font-medium'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1.5 text-secondary-400 capitalize text-xs font-bold">
                            <Clock size={14} />
                            {formatDistanceToNow(new Date(notification.createdAt))} ago
                          </div>
                          <span className="w-1 h-1 bg-secondary-200 rounded-full" />
                          <span className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {!notification.isRead && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-secondary-300 hover:text-primary-500 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCheck size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="p-20 text-center">
            <div className="w-24 h-24 bg-secondary-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-secondary-300">
              <Bell size={48} />
            </div>
            <h3 className="text-xl font-bold text-secondary-900">No notifications yet</h3>
            <p className="text-secondary-500 mt-2 max-w-xs mx-auto font-medium">
              We'll let you know when something important happens!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
