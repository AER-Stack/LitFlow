import React from 'react';
import { Quote, Book, User } from '../types';
import { books, users } from '../data';
import { useAppContext } from '../context/AppContext';
import { Heart, MessageCircle, Share2, Bookmark, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface QuoteCardProps {
  quote: Quote;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const { setSelectedBook, toggleLike, likedQuotes, toggleSave, savedQuotes } = useAppContext();
  const book = books.find(b => b.id === quote.bookId)!;
  const user = quote.userId ? users.find(u => u.id === quote.userId) : null;
  const isLiked = likedQuotes.has(quote.id);
  const isSaved = savedQuotes.has(quote.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-charcoal rounded-3xl p-8 mb-6 shadow-xl relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles size={120} className="text-cream" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {quote.isCurated ? (
            <span className="text-[10px] uppercase tracking-widest font-bold text-sage bg-sage/10 px-3 py-1 rounded-full">
              Curated Selection
            </span>
          ) : (
            <div className="flex items-center space-x-3">
              <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-cream/20" />
              <span className="text-sm font-medium text-cream/80">{user?.name}</span>
            </div>
          )}
          <span className="text-xs text-cream/40 font-mono">{quote.timestamp}</span>
        </div>

        {/* Quote Text */}
        <blockquote className="text-2xl md:text-3xl font-serif text-cream leading-relaxed mb-8 italic">
          "{quote.text}"
        </blockquote>

        {/* Book Chip */}
        <button
          onClick={() => setSelectedBook(book)}
          className="flex items-center space-x-4 bg-cream/5 hover:bg-cream/10 p-3 rounded-2xl transition-all text-left w-full md:w-auto"
        >
          <img src={book.cover} alt={book.title} className="w-12 h-16 object-cover rounded-lg shadow-md" />
          <div>
            <div className="text-cream font-medium text-sm line-clamp-1">{book.title}</div>
            <div className="text-cream/60 text-xs">{book.author}</div>
          </div>
        </button>

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream/10">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => toggleLike(quote.id)}
              className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-terracotta' : 'text-cream/60 hover:text-cream'}`}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
              <span className="text-xs font-medium">{quote.likes + (isLiked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center space-x-2 text-cream/60 hover:text-cream transition-colors">
              <MessageCircle size={20} />
              <span className="text-xs font-medium">{quote.comments}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => toggleSave(quote.id)}
              className={`transition-colors ${isSaved ? 'text-sage' : 'text-cream/60 hover:text-cream'}`}
            >
              <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button className="text-cream/60 hover:text-cream transition-colors">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
