import React from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Star, ExternalLink, Share2, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BookDetailModal: React.FC = () => {
  const { selectedBook, setSelectedBook } = useAppContext();

  if (!selectedBook) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedBook(null)}
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row"
        >
          <button
            onClick={() => setSelectedBook(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>

          {/* Left: Cover */}
          <div className="w-full md:w-2/5 bg-charcoal p-12 flex items-center justify-center">
            <img
              src={selectedBook.cover}
              alt={selectedBook.title}
              className="w-full max-w-[240px] shadow-2xl rounded-xl transform -rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-4xl font-serif font-bold mb-2 tracking-tight">{selectedBook.title}</h2>
              <p className="text-xl text-ink/60 italic">{selectedBook.author}</p>
            </div>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-1 text-terracotta">
                <Star size={20} fill="currentColor" />
                <span className="font-bold">{selectedBook.rating}</span>
              </div>
              <div className="text-ink/40 font-mono text-sm">{selectedBook.year}</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {selectedBook.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-sage/10 text-sage text-xs font-bold uppercase tracking-wider rounded-full">
                  {genre}
                </span>
              ))}
            </div>

            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-widest font-bold text-ink/40 mb-4">Synopsis</h3>
              <p className="text-ink/80 leading-relaxed font-serif text-lg">
                {selectedBook.synopsis}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href={selectedBook.buyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-charcoal text-cream py-4 rounded-2xl font-bold hover:bg-ink transition-all shadow-lg"
              >
                <ExternalLink size={18} />
                <span>Buy on Bookshop</span>
              </a>
              <div className="flex space-x-2">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-sage/20 text-sage py-4 rounded-2xl font-bold hover:bg-sage/30 transition-all">
                  <BookOpen size={18} />
                  <span>Preview</span>
                </button>
                <button className="p-4 bg-ink/5 hover:bg-ink/10 rounded-2xl transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
