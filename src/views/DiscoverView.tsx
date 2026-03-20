import React, { useState, useMemo } from 'react';
import { users, challenges, authors, books } from '../data';
import { Search, Trophy, Users, Tag, ChevronRight, BadgeCheck, UserPlus, UserCheck, TrendingUp, Filter, Clock, Star, User as UserIcon, X, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { QuoteCard } from '../components/QuoteCard';
import { QuoteCardSkeleton } from '../components/QuoteCardSkeleton';

/**
 * DiscoverView.tsx
 * 
 * This component allows users to explore new content on LitFlow.
 * Features include:
 * - Search functionality for quotes, books, and authors.
 * - Advanced filtering by genre, author, and sorting (popularity/recency).
 * - Tabbed discovery feeds (For You, Trending).
 * - Weekly challenges with progress tracking.
 * - Social discovery (Top Readers, Author Spotlight).
 * - Genre-based browsing.
 */
export const DiscoverView: React.FC = () => {
  const { currentUser, followedUsers, toggleFollow, viewProfile, quotes, fetchQuotes, fetchMoreQuotes, isFetchingQuotes, pagination } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recency' | 'popularity'>('popularity');
  const [showFilters, setShowFilters] = useState(false);

  const [activeTab, setActiveTab] = useState<'for-you' | 'trending'>('for-you');

  const genres = ['Dark Academia', 'Mythology', 'Contemporary', 'Classics', 'Gothic', 'Fantasy', 'Romance', 'Mystery', 'Fiction', 'Horror'];

  const allAuthors = useMemo(() => {
    const authorSet = new Set<string>();
    books.forEach(b => authorSet.add(b.author));
    return Array.from(authorSet).sort();
  }, []);

  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedAuthor(null);
    setSortBy('popularity');
    setSearchQuery('');
  };

  const isFiltering = searchQuery !== '' || selectedGenre !== null || selectedAuthor !== null || sortBy !== 'popularity';

  React.useEffect(() => {
    if (isFiltering) {
      fetchQuotes(undefined, selectedGenre || undefined, selectedAuthor || undefined, searchQuery || undefined, sortBy);
    } else {
      fetchQuotes(activeTab);
    }
  }, [selectedGenre, selectedAuthor, searchQuery, sortBy, activeTab]);

  // Infinite scroll listener
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500
      ) {
        if (!isFetchingQuotes && pagination.hasMore) {
          if (isFiltering) {
            fetchMoreQuotes(undefined, selectedGenre || undefined, selectedAuthor || undefined, searchQuery || undefined, sortBy);
          } else {
            fetchMoreQuotes(activeTab);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetchingQuotes, pagination.hasMore, selectedGenre, selectedAuthor, searchQuery, activeTab]);

  return (
    <div className="max-w-4xl mx-auto pt-8 pb-32 md:pb-8 px-4">
      <h1 className="text-4xl font-serif font-bold tracking-tight mb-12">Discover</h1>

      {/* Search & Filter Bar */}
      <div className="space-y-4 mb-16">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-ink/30" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quotes, books, authors, ISBN, or publisher..."
              className="w-full bg-ink/5 border-none rounded-2xl py-5 pl-16 pr-6 focus:ring-2 focus:ring-sage/50 transition-all font-medium"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-5 rounded-2xl transition-all ${showFilters ? 'bg-charcoal text-cream' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'}`}
          >
            <Filter size={20} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-ink/5 rounded-3xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Genre Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">
                      <Tag size={14} /> Genre
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {genres.slice(0, 6).map(genre => (
                        <button
                          key={genre}
                          onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedGenre === genre 
                              ? 'bg-terracotta text-cream shadow-md' 
                              : 'bg-cream border border-ink/5 text-ink/60 hover:border-ink/20'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">
                      <UserIcon size={14} /> Author
                    </label>
                    <select 
                      value={selectedAuthor || ''}
                      onChange={(e) => setSelectedAuthor(e.target.value || null)}
                      className="w-full bg-cream border border-ink/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-sage/50 outline-none"
                    >
                      <option value="">All Authors</option>
                      {allAuthors.map(author => (
                        <option key={author} value={author}>{author}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-ink/5">
                  <div className="flex items-center gap-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-ink/40">Sort By:</label>
                    <div className="flex bg-cream p-1 rounded-xl border border-ink/5">
                      <button
                        onClick={() => setSortBy('popularity')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          sortBy === 'popularity' ? 'bg-charcoal text-cream' : 'text-ink/40 hover:text-ink/60'
                        }`}
                      >
                        <Star size={14} /> Popular
                      </button>
                      <button
                        onClick={() => setSortBy('recency')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          sortBy === 'recency' ? 'bg-charcoal text-cream' : 'text-ink/40 hover:text-ink/60'
                        }`}
                      >
                        <Clock size={14} /> Recent
                      </button>
                    </div>
                  </div>

                  {isFiltering && (
                    <button 
                      onClick={clearFilters}
                      className="flex items-center gap-2 text-xs font-bold text-terracotta hover:text-terracotta/80 transition-colors"
                    >
                      <X size={14} /> Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Tabs */}
      {!isFiltering && (
        <div className="flex space-x-8 mb-12 border-b border-ink/5">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'for-you' ? 'text-ink' : 'text-ink/30'
            }`}
          >
            For You
            {activeTab === 'for-you' && (
              <motion.div layoutId="discoverTab" className="absolute bottom-0 left-0 w-full h-1 bg-terracotta rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              activeTab === 'trending' ? 'text-ink' : 'text-ink/30'
            }`}
          >
            Trending
            {activeTab === 'trending' && (
              <motion.div layoutId="discoverTab" className="absolute bottom-0 left-0 w-full h-1 bg-terracotta rounded-full" />
            )}
          </button>
        </div>
      )}

      {/* Results Section */}
      {isFiltering ? (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="text-sage" size={24} />
              <h2 className="text-2xl font-serif font-bold">Search Results</h2>
            </div>
            <span className="text-ink/40 text-sm font-medium">{quotes.length} quotes found</span>
          </div>
          <div className="space-y-6">
            {quotes.length > 0 ? (
              quotes.map(quote => (
                <QuoteCard key={quote.id} quote={quote} />
              ))
            ) : !isFetchingQuotes ? (
              <div className="bg-ink/5 rounded-3xl p-12 text-center">
                <p className="text-ink/40 font-serif italic text-lg">No quotes match your search criteria. Try searching by title, author, ISBN, or publisher.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-terracotta font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : null}

            {isFetchingQuotes && (
              <div className="space-y-6">
                <QuoteCardSkeleton />
                <QuoteCardSkeleton />
              </div>
            )}

            {!pagination.hasMore && quotes.length > 0 && (
              <div className="text-center py-12 text-ink/30 italic font-serif">
                You've reached the end of the flow.
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          {/* Algorithmic Feed */}
          <section className="mb-16">
            <div className="flex items-center space-x-3 mb-8">
              {activeTab === 'for-you' ? (
                <Star className="text-terracotta" size={24} />
              ) : (
                <TrendingUp className="text-terracotta" size={24} />
              )}
              <h2 className="text-2xl font-serif font-bold">
                {activeTab === 'for-you' ? 'Recommended for You' : 'Trending Now'}
              </h2>
            </div>
            <div className="space-y-6">
              {quotes.length > 0 ? (
                quotes.map(quote => (
                  <QuoteCard key={quote.id} quote={quote} />
                ))
              ) : !isFetchingQuotes ? (
                <div className="text-center py-20 bg-ink/5 rounded-[32px] border-2 border-dashed border-ink/10">
                  <p className="text-ink/40 font-serif italic">No quotes found in this flow.</p>
                </div>
              ) : null}
              
              {isFetchingQuotes && (
                <div className="space-y-6">
                  <QuoteCardSkeleton />
                  <QuoteCardSkeleton />
                </div>
              )}

              {pagination.hasMore && (
                <div className="flex justify-center py-8">
                  <Loader2 className="animate-spin text-terracotta" size={32} />
                </div>
              )}

              {!pagination.hasMore && quotes.length > 0 && (
                <div className="text-center py-12 text-ink/30 italic font-serif">
                  You've reached the end of your personalized flow.
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Weekly Challenges */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Trophy className="text-terracotta" size={24} />
            <h2 className="text-2xl font-serif font-bold">Weekly Challenges</h2>
          </div>
          <button className="text-ink/40 hover:text-ink transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map(challenge => (
            <motion.div
              key={challenge.id}
              whileHover={{ y: -5 }}
              className="bg-cream border border-ink/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-40 bg-charcoal relative">
                <img src={challenge.image} alt={challenge.title} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-cream font-bold text-xl">{challenge.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-ink/40 mb-3">
                  <span>Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <div className="w-full h-2 bg-ink/5 rounded-full mb-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    className="h-full bg-sage"
                  />
                </div>
                <div className="flex items-center text-ink/60 text-sm">
                  <Users size={16} className="mr-2" />
                  <span>{challenge.participants.toLocaleString()} participants</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Readers */}
      <section className="mb-16">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="text-ink/40" size={24} />
          <h2 className="text-2xl font-serif font-bold">Top Readers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.filter(u => u.id !== currentUser.id).map(user => {
            const isFollowing = followedUsers.has(user.id);
            return (
              <motion.div
                key={user.id}
                whileHover={{ scale: 1.02 }}
                className="bg-cream border border-ink/5 p-4 rounded-2xl flex items-center justify-between"
              >
                <div 
                  className="flex items-center space-x-3 cursor-pointer"
                  onClick={() => viewProfile(user.id)}
                >
                  <img src={user.avatar_url || 'https://picsum.photos/seed/avatar/200/200'} alt={user.username} className="w-10 h-10 rounded-full border border-ink/10" />
                  <div>
                    <div className="font-bold text-sm">{user.username}</div>
                    <div className="text-ink/40 text-xs">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`p-2 rounded-full transition-all ${
                    isFollowing 
                      ? 'bg-sage/10 text-sage' 
                      : 'bg-ink/5 text-ink/40 hover:bg-ink/10 hover:text-ink'
                  }`}
                >
                  {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Author Spotlight */}
      <section className="mb-16">
        <div className="flex items-center space-x-3 mb-8">
          <Users className="text-sage" size={24} />
          <h2 className="text-2xl font-serif font-bold">Author Spotlight</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authors.map(author => (
            <motion.div
              key={author.id}
              whileHover={{ x: 5 }}
              className="flex items-center space-x-6 bg-cream border border-ink/5 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all"
            >
              <img src={author.image} alt={author.name} className="w-20 h-20 rounded-2xl border border-ink/5" />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-lg">{author.name}</h3>
                  {author.isVerified && <BadgeCheck size={18} className="text-sage" fill="currentColor" />}
                </div>
                <p className="text-ink/60 text-sm line-clamp-2">{author.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Genres */}
      <section>
        <div className="flex items-center space-x-3 mb-8">
          <Tag className="text-ink/40" size={24} />
          <h2 className="text-2xl font-serif font-bold">Browse by Genre</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                setShowFilters(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-6 py-3 border rounded-2xl font-medium transition-all shadow-sm ${
                selectedGenre === genre 
                  ? 'bg-charcoal text-cream border-charcoal' 
                  : 'bg-cream border-ink/10 hover:bg-charcoal hover:text-cream hover:border-charcoal'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
