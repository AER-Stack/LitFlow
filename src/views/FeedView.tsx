import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { QuoteCard } from '../components/QuoteCard';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FeedView: React.FC = () => {
  const { quotes } = useAppContext();
  const [activeTab, setActiveTab] = useState<'curated' | 'community'>('curated');
  const [isSerendipityLoading, setIsSerendipityLoading] = useState(false);
  const [serendipityQuote, setSerendipityQuote] = useState<any>(null);

  const filteredQuotes = quotes.filter(q => 
    activeTab === 'curated' ? q.isCurated : !q.isCurated
  );

  const handleSerendipity = () => {
    setIsSerendipityLoading(true);
    setSerendipityQuote(null);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setSerendipityQuote(randomQuote);
      setIsSerendipityLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto pt-8 pb-32 md:pb-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-serif font-bold tracking-tight">Your Flow</h1>
        <button 
          onClick={handleSerendipity}
          disabled={isSerendipityLoading}
          className="p-3 bg-sage text-cream rounded-2xl shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
        >
          {isSerendipityLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 mb-12 border-b border-ink/5">
        <button
          onClick={() => setActiveTab('curated')}
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
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
          className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
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
      <AnimatePresence>
        {serendipityQuote && (
          <motion.div
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
        )}
      </AnimatePresence>

      {/* Feed */}
      <div className="space-y-6">
        {filteredQuotes.map(quote => (
          <QuoteCard key={quote.id} quote={quote} />
        ))}
      </div>
    </div>
  );
};
