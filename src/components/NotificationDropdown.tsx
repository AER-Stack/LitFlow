import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDistanceToNow } from 'date-fns';
import { users } from '../data';

export const NotificationDropdown: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart size={14} className="text-terracotta" fill="currentColor" />;
      case 'comment': return <MessageCircle size={14} className="text-sage" />;
      case 'follow': return <UserPlus size={14} className="text-ink" />;
      case 'mention': return <AtSign size={14} className="text-ink" />;
      case 'comment_like': return <Heart size={14} className="text-terracotta" fill="currentColor" />;
      default: return <Bell size={14} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-xl transition-all ${
          isOpen ? 'bg-charcoal text-cream shadow-md' : 'hover:bg-ink/5 text-ink/70'
        }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-terracotta text-cream text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-cream">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 bottom-full mb-2 md:left-auto md:right-0 md:bottom-auto md:mt-2 w-80 bg-cream rounded-2xl shadow-2xl border border-ink/5 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-ink/5 flex items-center justify-between bg-cream/50 backdrop-blur-sm">
              <h3 className="font-serif font-bold text-ink">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] uppercase tracking-widest font-bold text-sage hover:text-sage/80 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-ink/40 italic text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map(notification => {
                  const actor = users.find(u => u.id === notification.actorId);
                  return (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-4 border-b border-ink/5 flex items-start space-x-3 transition-colors cursor-pointer ${
                        notification.isRead ? 'opacity-60 grayscale-[0.5]' : 'bg-sage/5'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={actor?.avatar_url || 'https://picsum.photos/seed/avatar/200/200'}
                          alt={actor?.username}
                          className="w-10 h-10 rounded-full border border-ink/10"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-cream rounded-full p-1 shadow-sm border border-ink/5">
                          {getIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-ink leading-relaxed">
                          <span className="font-bold">{actor?.username}</span> {notification.text}
                        </p>
                        <p className="text-[10px] text-ink/40 mt-1 font-mono">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-terracotta rounded-full mt-2 shrink-0" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
