import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, Compass, User, Sparkles, Loader2, Plus, Bookmark, Settings, Bell } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';
import { CreatePostModal } from './CreatePostModal';

export const Navigation: React.FC = () => {
  const { currentView, setCurrentView, triggerSerendipity, isSerendipityLoading } = useAppContext();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'saved', label: 'Collections', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-cream border-r border-ink/5 p-8 z-40">
        <div className="flex items-center justify-between mb-12">
          <div className="text-2xl font-serif font-bold text-terracotta tracking-tight">LitFlow</div>
          <NotificationDropdown />
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center space-x-2 w-full p-4 mb-8 rounded-2xl bg-charcoal text-cream font-bold hover:bg-ink transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <Plus size={20} />
          <span>Post Quote</span>
        </button>

        <div className="space-y-4">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id as any)}
              className={`flex items-center space-x-4 w-full p-3 rounded-xl transition-all ${
                currentView === id ? 'bg-charcoal text-cream shadow-md' : 'hover:bg-ink/5 text-ink/70'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
        
        <div className="mt-auto">
          <button 
            onClick={triggerSerendipity}
            disabled={isSerendipityLoading}
            className="flex items-center space-x-4 w-full p-3 rounded-xl bg-sage/20 text-sage hover:bg-sage/30 transition-all disabled:opacity-50"
          >
            {isSerendipityLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            <span className="font-medium">Serendipity</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-cream/80 backdrop-blur-lg border-t border-ink/5 px-6 py-3 flex justify-between items-center z-40">
        <button
          onClick={() => setCurrentView('feed')}
          className={`p-3 rounded-2xl transition-all ${
            currentView === 'feed' ? 'bg-charcoal text-cream shadow-lg' : 'text-ink/60'
          }`}
        >
          <Home size={24} />
        </button>
        <button
          onClick={() => setCurrentView('discover')}
          className={`p-3 rounded-2xl transition-all ${
            currentView === 'discover' ? 'bg-charcoal text-cream shadow-lg' : 'text-ink/60'
          }`}
        >
          <Compass size={24} />
        </button>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="p-4 rounded-full bg-charcoal text-cream shadow-lg hover:bg-ink transition-colors -mt-6 border-4 border-cream"
        >
          <Plus size={24} />
        </button>

        <button
          onClick={() => setCurrentView('saved')}
          className={`p-3 rounded-2xl transition-all ${
            currentView === 'saved' ? 'bg-charcoal text-cream shadow-lg' : 'text-ink/60'
          }`}
        >
          <Bookmark size={24} />
        </button>
        <button
          onClick={() => setCurrentView('notifications')}
          className={`p-3 rounded-2xl transition-all ${
            currentView === 'notifications' ? 'bg-charcoal text-cream shadow-lg' : 'text-ink/60'
          }`}
        >
          <Bell size={24} />
        </button>
        <button
          onClick={() => setCurrentView('profile')}
          className={`p-3 rounded-2xl transition-all ${
            currentView === 'profile' ? 'bg-charcoal text-cream shadow-lg' : 'text-ink/60'
          }`}
        >
          <User size={24} />
        </button>
      </nav>

      {/* Floating Action Button (Mobile) - Removed since it's in the center now */}

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};
