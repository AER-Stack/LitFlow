import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { renderCommentText } from '../utils/textUtils';
import { QuoteCard } from '../components/QuoteCard';
import { Settings, Grid, Bookmark, Heart, Edit3, MessageCircle, UserPlus, ExternalLink, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'motion/react';
import { api } from '../services/api';
import { User, Quote } from '../types';
import { users } from '../data';

export const ProfileView: React.FC = () => {
  const { currentUser, likedQuotes, savedQuotes, quotes, viewingUserId, toggleFollow, followedUsers, setCurrentView } = useAppContext();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'liked' | 'activity'>('posts');
  const [user, setUser] = useState<User | null>(viewingUserId ? null : currentUser);
  const [userQuotes, setUserQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = viewingUserId || currentUser?.id;
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const data = await api.getUserProfile(userId);
        if (data) {
          setUser(data.user);
          setUserQuotes(data.quotes);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [viewingUserId, currentUser?.id]);

  if (isLoading && !user) {
    return (
      <div className="max-w-4xl mx-auto pt-32 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-ink/10 border-t-ink rounded-full animate-spin" />
        <p className="text-ink/40 font-serif italic">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const isOwnProfile = currentUser && user.id === currentUser.id;
  const isFollowing = followedUsers.has(user.id);

  const getFilteredQuotes = () => {
    switch (activeTab) {
      case 'posts':
        return userQuotes;
      case 'saved':
        return quotes.filter(q => savedQuotes.has(q.id));
      case 'liked':
        return quotes.filter(q => likedQuotes.has(q.id));
      default:
        return [];
    }
  };

  const filteredQuotes = getFilteredQuotes();

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-32 md:pb-8 px-4">
      {/* Profile Header */}
      <div className="bg-cream border border-ink/5 rounded-[40px] p-8 md:p-12 mb-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
          <div className="relative">
            <img 
              src={user.avatar_url || 'https://picsum.photos/seed/avatar/200/200'} 
              alt={user.username} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] border-4 border-cream shadow-2xl"
            />
            {isOwnProfile && (
              <button 
                onClick={() => setCurrentView('settings')}
                className="absolute -bottom-2 -right-2 p-3 bg-charcoal text-cream rounded-2xl shadow-lg hover:scale-110 transition-transform"
              >
                <Edit3 size={20} />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-1 tracking-tight">{user.username}</h1>
                <p className="text-ink/40 font-mono">{user.email}</p>
              </div>
              <div className="flex justify-center md:justify-start space-x-3 mt-6 md:mt-0">
                {isOwnProfile ? (
                  <button 
                    onClick={() => setCurrentView('settings')}
                    className="px-8 py-3 bg-charcoal text-cream rounded-2xl font-bold shadow-lg hover:bg-ink transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={() => toggleFollow(user.id)}
                    className={`px-8 py-3 rounded-2xl font-bold shadow-lg transition-all ${
                      isFollowing 
                        ? 'bg-sage/20 text-sage border border-sage/30' 
                        : 'bg-charcoal text-cream hover:bg-ink'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
                <button 
                  onClick={() => setCurrentView('settings')}
                  className="p-3 bg-ink/5 hover:bg-ink/10 rounded-2xl transition-all"
                >
                  <Settings size={24} />
                </button>
              </div>
            </div>
            
            <p className="text-lg text-ink/80 font-serif leading-relaxed mb-8 max-w-xl">
              {user.bio}
            </p>
 
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-t border-ink/5 pt-8">
              <div>
                <div className="text-2xl font-bold text-ink">{user.stats?.quotes || 0}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-ink/30">Quotes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">{user.stats?.likes || 0}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-ink/30">Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">{user.stats?.books_completed || 0}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-ink/30">Finished</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ink">{user.stats?.currently_reading || 0}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-ink/30">Reading</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-12 mb-12">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`flex items-center space-x-2 transition-all pb-2 font-bold ${
            activeTab === 'posts' ? 'text-ink border-b-2 border-terracotta' : 'text-ink/30 hover:text-ink'
          }`}
        >
          <Grid size={20} />
          <span>Posts</span>
        </button>
        {isOwnProfile && (
          <button 
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 transition-all pb-2 font-bold ${
              activeTab === 'saved' ? 'text-ink border-b-2 border-terracotta' : 'text-ink/30 hover:text-ink'
            }`}
          >
            <Bookmark size={20} />
            <span>Saved</span>
          </button>
        )}
        {isOwnProfile && (
          <button 
            onClick={() => setActiveTab('liked')}
            className={`flex items-center space-x-2 transition-all pb-2 font-bold ${
              activeTab === 'liked' ? 'text-ink border-b-2 border-terracotta' : 'text-ink/30 hover:text-ink'
            }`}
          >
            <Heart size={20} />
            <span>Liked</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-ink/10 border-t-ink rounded-full animate-spin" />
          </div>
        ) : filteredQuotes.length > 0 ? (
          <div className="space-y-6">
            {filteredQuotes.map(quote => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-ink/5 rounded-3xl border-2 border-dashed border-ink/10">
            <p className="text-ink/40 font-serif italic">
              {activeTab === 'posts' ? 'No quotes shared yet. Start your flow.' : 
               activeTab === 'saved' ? 'No saved quotes yet.' : 
               'No liked quotes yet.'}
            </p>
          </div>
        )}
      </div>


    </div>
  );
};

