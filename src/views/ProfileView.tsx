import React from 'react';
import { useAppContext } from '../context/AppContext';
import { quotes } from '../data';
import { QuoteCard } from '../components/QuoteCard';
import { Settings, Grid, Bookmark, Heart, Edit3 } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser } = useAppContext();
  const userQuotes = quotes.filter(q => q.userId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-32 md:pb-8 px-4">
      {/* Profile Header */}
      <div className="bg-cream border border-ink/5 rounded-[40px] p-8 md:p-12 mb-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
          <div className="relative">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-4 border-cream shadow-2xl"
            />
            <button className="absolute -bottom-2 -right-2 p-3 bg-charcoal text-cream rounded-2xl shadow-lg hover:scale-110 transition-transform">
              <Edit3 size={20} />
            </button>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-1 tracking-tight">{currentUser.name}</h1>
                <p className="text-ink/40 font-mono">{currentUser.handle}</p>
              </div>
              <div className="flex justify-center md:justify-start space-x-3 mt-6 md:mt-0">
                <button className="px-8 py-3 bg-charcoal text-cream rounded-2xl font-bold shadow-lg hover:bg-ink transition-all">
                  Edit Profile
                </button>
                <button className="p-3 bg-ink/5 hover:bg-ink/10 rounded-2xl transition-all">
                  <Settings size={24} />
                </button>
              </div>
            </div>
            
            <p className="text-lg text-ink/80 font-serif leading-relaxed mb-8 max-w-xl">
              {currentUser.bio}
            </p>

            <div className="grid grid-cols-3 gap-8 border-t border-ink/5 pt-8">
              <div>
                <div className="text-2xl font-bold text-ink">{currentUser.stats.quotes}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-ink/30">Quotes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">{currentUser.stats.followers.toLocaleString()}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-ink/30">Followers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">{currentUser.stats.following.toLocaleString()}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-ink/30">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-12 mb-12">
        <button className="flex items-center space-x-2 text-ink font-bold border-b-2 border-terracotta pb-2">
          <Grid size={20} />
          <span>Posts</span>
        </button>
        <button className="flex items-center space-x-2 text-ink/30 hover:text-ink transition-colors font-bold pb-2">
          <Bookmark size={20} />
          <span>Saved</span>
        </button>
        <button className="flex items-center space-x-2 text-ink/30 hover:text-ink transition-colors font-bold pb-2">
          <Heart size={20} />
          <span>Liked</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {userQuotes.length > 0 ? (
          <div className="space-y-6">
            {userQuotes.map(quote => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-ink/5 rounded-3xl border-2 border-dashed border-ink/10">
            <p className="text-ink/40 font-serif italic">No quotes shared yet. Start your flow.</p>
          </div>
        )}
      </div>
    </div>
  );
};
