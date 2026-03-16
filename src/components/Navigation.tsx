import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, Compass, User, Sparkles } from 'lucide-react';

export const Navigation: React.FC = () => {
  const { currentView, setCurrentView } = useAppContext();

  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-cream border-r border-ink/5 p-8 z-40">
        <div className="text-2xl font-serif font-bold mb-12 text-terracotta tracking-tight">LitFlow</div>
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
          <button className="flex items-center space-x-4 w-full p-3 rounded-xl bg-sage/20 text-sage hover:bg-sage/30 transition-all">
            <Sparkles size={20} />
            <span className="font-medium">Serendipity</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-cream/80 backdrop-blur-lg border-t border-ink/5 px-6 py-3 flex justify-between items-center z-40">
        {navItems.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id as any)}
            className={`p-3 rounded-2xl transition-all ${
              currentView === id ? 'bg-charcoal text-cream shadow-lg' : 'text-ink/60'
            }`}
          >
            <Icon size={24} />
          </button>
        ))}
        <button className="p-3 rounded-2xl bg-sage text-cream shadow-lg">
          <Sparkles size={24} />
        </button>
      </nav>
    </>
  );
};
