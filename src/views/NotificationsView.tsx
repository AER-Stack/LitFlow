import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bell, Heart, MessageSquare, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationsView: React.FC = () => {
  const { notifications, fetchNotifications, markAllAsRead, markAsRead } = useAppContext();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={18} className="text-red-500 fill-red-500" />;
      case 'comment': return <MessageSquare size={18} className="text-blue-500" />;
      case 'follow': return <UserPlus size={18} className="text-emerald-500" />;
      case 'comment_like': return <Heart size={18} className="text-pink-500" />;
      default: return <Bell size={18} className="text-terracotta" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-ink mb-2">Notifications</h1>
          <p className="text-ink/60 text-lg italic">Stay connected with your literary circle.</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-ink/5 text-ink/60 hover:bg-ink/10 transition-all text-sm font-bold"
        >
          <CheckCircle size={16} />
          <span>Mark all as read</span>
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => markAsRead(notification.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-start space-x-4 ${
                  notification.isRead 
                    ? 'bg-white/50 border-ink/5 opacity-70' 
                    : 'bg-white border-terracotta/20 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="relative">
                  <img 
                    src={(notification as any).actor_avatar || `https://picsum.photos/seed/${notification.actorId}/100`} 
                    alt="Actor" 
                    className="w-12 h-12 rounded-full object-cover border-2 border-cream"
                  />
                  <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-ink font-medium leading-relaxed">
                    <span className="font-bold">{(notification as any).actor_username || 'Someone'}</span> {notification.text}
                  </p>
                  <span className="text-xs text-ink/40 mt-2 block font-mono uppercase tracking-wider">
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-terracotta mt-2" />
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-24 bg-white/30 rounded-3xl border border-dashed border-ink/10">
              <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell size={32} className="text-ink/20" />
              </div>
              <h3 className="text-xl font-serif font-bold text-ink/40">Quiet as a library...</h3>
              <p className="text-ink/30 mt-2 italic">No new notifications yet.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
