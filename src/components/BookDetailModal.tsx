import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Star, ExternalLink, Share2, BookOpen, Loader2, ShoppingBag, CheckCircle2, Clock, BookmarkPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * BookDetailModal.tsx
 * 
 * This component displays detailed information about a selected book.
 * It allows users to:
 * - View book details (title, author, synopsis, genres).
 * - Update their reading status (Want to Read, Reading, Finished).
 * - Buy the book via affiliate links (Amazon, Bookshop.org).
 * - Share the book with others.
 * - Preview the book.
 * 
 * Affiliate links are tracked via the `trackClick` function in AppContext.
 */
export const BookDetailModal: React.FC = () => {
  const { selectedBook, setSelectedBook, updateReadingStatus, readingList, trackClick } = useAppContext();
  const [isSharing, setIsSharing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const currentStatus = readingList.find(item => item.bookId === selectedBook?.id)?.status;

  const handleStatusUpdate = async (status: 'want_to_read' | 'currently_reading' | 'finished') => {
    if (!selectedBook) return;
    setIsUpdatingStatus(true);
    try {
      await updateReadingStatus(selectedBook.id, status);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const amazonTag = (import.meta as any).env.VITE_AMAZON_AFFILIATE_TAG || 'litflow-20';
  const bookshopId = (import.meta as any).env.VITE_BOOKSHOP_AFFILIATE_ID || 'litflow-20';

  const amazonLink = `https://www.amazon.com/s?k=${encodeURIComponent(`${selectedBook?.title} ${selectedBook?.author}`)}&tag=${amazonTag}`;
  const bookshopLink = `https://uk.bookshop.org/search?keywords=${encodeURIComponent(selectedBook?.title || '')}&affiliate=${bookshopId}`;

  const handleAffiliateClick = (platform: 'amazon' | 'bookshop') => {
    if (selectedBook) {
      trackClick(selectedBook.id, platform);
    }
  };

  const handleShare = async () => {
    if (!selectedBook) return;
    
    setIsSharing(true);
    const shareData = {
      title: `LitFlow: ${selectedBook.title}`,
      text: `Check out "${selectedBook.title}" by ${selectedBook.author} on LitFlow!`,
      url: `https://uk.bookshop.org/search?keywords=${encodeURIComponent(selectedBook.title)}&affiliate=${bookshopId}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    } finally {
      setIsSharing(false);
    }
  };

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
              src={selectedBook.cover_url}
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
              <div className="text-ink/40 font-mono text-sm">{selectedBook.year}</div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {selectedBook.genres.map(genre => (
                <span key={genre} className="px-3 py-1 bg-sage/10 text-sage text-xs font-bold uppercase tracking-wider rounded-full">
                  {genre}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h3 className="text-xs uppercase tracking-widest font-bold text-ink/40 mb-4">Reading Status</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleStatusUpdate('want_to_read')}
                  disabled={isUpdatingStatus}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    currentStatus === 'want_to_read' 
                      ? 'bg-sage text-cream shadow-md' 
                      : 'bg-sage/10 text-sage hover:bg-sage/20'
                  }`}
                >
                  <BookmarkPlus size={16} />
                  <span>Want to Read</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate('currently_reading')}
                  disabled={isUpdatingStatus}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    currentStatus === 'currently_reading' 
                      ? 'bg-blue-500 text-cream shadow-md' 
                      : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
                  }`}
                >
                  <Clock size={16} />
                  <span>Reading</span>
                </button>
                <button
                  onClick={() => handleStatusUpdate('finished')}
                  disabled={isUpdatingStatus}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    currentStatus === 'finished' 
                      ? 'bg-emerald-500 text-cream shadow-md' 
                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  }`}
                >
                  <CheckCircle2 size={16} />
                  <span>Finished</span>
                </button>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-widest font-bold text-ink/40 mb-4">Synopsis</h3>
              <p className="text-ink/80 leading-relaxed font-serif text-lg">
                {selectedBook.synopsis}
              </p>
            </div>

            <div className="mb-8 p-6 bg-white/50 rounded-3xl border border-ink/5">
              <h3 className="text-xs uppercase tracking-widest font-bold text-ink/40 mb-4 flex items-center space-x-2">
                <ShoppingBag size={14} />
                <span>Buy this book</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={amazonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleAffiliateClick('amazon')}
                  className="flex items-center justify-center space-x-2 bg-[#FF9900] text-white py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-md"
                >
                  <ExternalLink size={18} />
                  <span>Buy on Amazon</span>
                </a>
                <a
                  href={bookshopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleAffiliateClick('bookshop')}
                  className="flex items-center justify-center space-x-2 bg-terracotta text-cream py-3 rounded-2xl font-bold hover:opacity-90 transition-all shadow-md"
                >
                  <ExternalLink size={18} />
                  <span>Buy on Bookshop</span>
                </a>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 flex items-center justify-center space-x-2 bg-sage/20 text-sage py-4 rounded-2xl font-bold hover:bg-sage/30 transition-all">
                <BookOpen size={18} />
                <span>Preview</span>
              </button>
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="p-4 bg-ink/5 hover:bg-ink/10 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSharing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
