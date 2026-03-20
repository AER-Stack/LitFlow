import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { QuoteCard } from '../components/QuoteCard';
import { QuoteCardSkeleton } from '../components/QuoteCardSkeleton';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from '../types';

/**
 * FeedView.tsx
 * 
 * This component displays the main quote feed for the user.
 * It features:
 * - Tabbed navigation (For You, Following, Curated, Community).
 * - Infinite scrolling for quote discovery.
 * - "Serendipity" feature to find random hidden gems.
 * - Personalized recommendation labels for the "For You" feed.
 * - Skeleton loading states for initial and subsequent fetches.
 */
export const FeedView: React.FC = () => {
  const { quotes, serendipityQuote, triggerSerendipity, isSerendipityLoading, isInitialLoading, followedUsers, followedAuthors, getPersonalizedQuotes, fetchQuotes, fetchMoreQuotes, isFetchingQuotes, pagination } = useAppContext();
  const [activeTab, setActiveTab] = React.useState<'for-you' | 'following' | 'curated' | 'community'>('for-you');

  React.useEffect(() => {
    fetchQuotes(activeTab);
  }, [activeTab]);

  // Infinite scroll listener
  React.useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500
      ) {
        if (!isFetchingQuotes && pagination.hasMore) {
          const filter = activeTab === 'for-you' ? undefined : activeTab;
          fetchMoreQuotes(filter);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetchingQuotes, pagination.hasMore, activeTab]);

  const getAlgorithmicQuotes = () => {
    switch (activeTab) {
      case 'for-you':
        return getPersonalizedQuotes();
      default:
        return quotes;
    }
  };

  const filteredQuotes = getAlgorithmicQuotes();

  if (isInitialLoading) {
    return (
      <div className="max-w-2xl mx-auto pt-8 pb-32 md:pb-8 px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="w-48 h-10 bg-ink/5 rounded-full animate-pulse" />
          <div className="w-12 h-12 bg-ink/5 rounded-2xl animate-pulse" />
        </div>
        <div className="flex space-x-8 mb-12 border-b border-ink/5">
          <div className="w-20 h-6 bg-ink/5 rounded-full mb-4 animate-pulse" />
          <div className="w-24 h-6 bg-ink/5 rounded-full mb-4 animate-pulse" />
          <div className="w-20 h-6 bg-ink/5 rounded-full mb-4 animate-pulse" />
        </div>
        <div className="space-y-6">
          <QuoteCardSkeleton />
          <QuoteCardSkeleton />
          <QuoteCardSkeleton />
        </div>
      </div>
    );
  }

  const getRecommendationLabel = (quote: Quote) => {
    if (activeTab !== 'for-you') return undefined;
    
    // Mock recommendation logic
    const authorFollowed = followedAuthors.includes(quote.book_author || '');
    if (authorFollowed) return `Because you follow ${quote.book_author}`;
    
    const userFollowed = followedUsers.has(quote.user_id || '');
    if (userFollowed) return `From someone you follow`;
    
    if (quote.score && quote.score > 150) return "Highly matched for you";
    
    const randomGenres = ['Philosophy', 'Poetry', 'Fiction', 'History'];
    const randomGenre = randomGenres[Math.floor(Math.random() * randomGenres.length)];
    if (Math.random() > 0.7) return `Because you liked ${randomGenre}`;
    
    return undefined;
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-32 md:pb-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif font-bold tracking-tight">Your Flow</h1>
        <button 
          onClick={triggerSerendipity}
          disabled={isSerendipityLoading}
          className="p-3 bg-sage text-cream rounded-2xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
        >
          {isSerendipityLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 mb-12 border-b border-ink/5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('for-you')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
            activeTab === 'for-you' ? 'text-ink' : 'text-ink/30'
          }`}
        >
          For You
          {activeTab === 'for-you' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-terracotta rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
            activeTab === 'following' ? 'text-ink' : 'text-ink/30'
          }`}
        >
          Following
          {activeTab === 'following' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-terracotta rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('curated')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
            activeTab === 'curated' ? 'text-ink' : 'text-ink/30'
          }`}
        >
          Curated
          {activeTab === 'curated' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-terracotta rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${
            activeTab === 'community' ? 'text-ink' : 'text-ink/30'
          }`}
        >
          Community
          {activeTab === 'community' && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-terracotta rounded-full" />
          )}
        </button>
      </div>

      {/* Serendipity Result */}
      <AnimatePresence mode="wait">
        {isSerendipityLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-12 p-12 bg-sage/5 rounded-[32px] border-2 border-dashed border-sage/20 flex flex-col items-center justify-center space-y-4"
          >
            <Loader2 className="animate-spin text-sage" size={32} />
            <p className="text-sage font-medium italic">Finding a hidden gem...</p>
          </motion.div>
        ) : serendipityQuote ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-12"
          >
            <div className="text-xs font-bold text-sage uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Sparkles size={14} />
              <span>Found for you</span>
            </div>
            <QuoteCard quote={serendipityQuote} />
            <div className="h-px bg-ink/5 w-full my-12" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Feed */}
      <div className="space-y-6">
        {isFetchingQuotes ? (
          <>
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
          </>
        ) : filteredQuotes.length > 0 ? (
          filteredQuotes.map(quote => (
            <QuoteCard 
              key={quote.id} 
              quote={quote} 
              recommendationLabel={getRecommendationLabel(quote)}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-ink/5 rounded-[32px] border-2 border-dashed border-ink/10">
            <p className="text-ink/40 font-serif italic">
              {activeTab === 'following' ? "You haven't followed anyone yet, or they haven't posted." : "No quotes found in this flow."}
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {isFetchingQuotes && pagination.page > 1 && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-terracotta" size={32} />
          </div>
        )}

        {/* End of Feed Message */}
        {!pagination.hasMore && filteredQuotes.length > 0 && (
          <div className="text-center py-12 text-ink/30 italic font-serif">
            You've reached the end of the flow.
          </div>
        )}
      </div>
    </div>
  );
};
