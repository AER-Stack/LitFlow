import React from 'react';
import { useAppContext } from '../context/AppContext';
import { books } from '../data';
import { motion } from 'motion/react';

export const EmbedView: React.FC = () => {
  const { viewingQuoteId, quotes } = useAppContext();
  const quote = quotes.find(q => q.id === viewingQuoteId);
  
  if (!quote) {
    return (
      <div className="flex items-center justify-center h-screen bg-ink text-cream font-serif italic">
        Quote not found
      </div>
    );
  }

  const book = books.find(b => b.id === quote.bookId)!;

  return (
    <div className="h-screen bg-ink flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-cream/5 border border-cream/10 rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 relative overflow-hidden group shadow-2xl"
      >
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-terracotta/10 blur-[100px] rounded-full group-hover:bg-terracotta/20 transition-all duration-700" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sage/10 blur-[100px] rounded-full group-hover:bg-sage/20 transition-all duration-700" />

        <div className="relative z-10 flex flex-col h-full justify-between">
          <blockquote className="text-xl sm:text-2xl font-serif text-cream leading-relaxed mb-6 italic line-clamp-4">
            "{quote.content}"
          </blockquote>

          <div className="flex items-center justify-between pt-4 border-t border-cream/5">
            <div className="flex items-center space-x-3">
              <img src={book.cover_url} alt={book.title} className="w-10 h-14 object-cover rounded shadow-md" />
              <div>
                <div className="text-cream font-medium text-xs sm:text-sm line-clamp-1">{book.title}</div>
                <div className="text-cream/60 text-[10px] sm:text-xs">{book.author}</div>
              </div>
            </div>
            
            <a 
              href={`${window.location.origin}/?view=feed`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-terracotta hover:text-terracotta/80 transition-colors shrink-0 ml-4"
            >
              LitFlow
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
