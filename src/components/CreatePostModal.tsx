import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { X, Loader2, BookOpen, PenTool } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { books, addQuote } = useAppContext();
  const [content, setContent] = useState('');
  const [type, setType] = useState<'book' | 'original'>('book');
  const [bookId, setBookId] = useState('');
  const [bookTitle, setBookTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MAX_LENGTH = 300;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    if (type === 'book' && !bookId && !bookTitle) return;

    setIsSubmitting(true);
    try {
      await addQuote({ 
        content, 
        is_original: type === 'original',
        book_id: bookId || undefined,
        book_title: bookTitle || undefined,
        author: author || undefined
      });
      setContent('');
      setBookId('');
      setBookTitle('');
      setAuthor('');
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-cream w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Form Section */}
          <div className="p-6 md:p-8 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold tracking-tight">New Quote</h2>
              <button
                onClick={onClose}
                className="p-2 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors md:hidden"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex space-x-2 mb-6 bg-ink/5 p-1 rounded-xl">
              <button
                onClick={() => setType('book')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  type === 'book' ? 'bg-cream text-ink shadow-sm' : 'text-ink/50 hover:text-ink'
                }`}
              >
                <BookOpen size={16} />
                <span>From a book</span>
              </button>
              <button
                onClick={() => setType('original')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-bold transition-all ${
                  type === 'original' ? 'bg-cream text-ink shadow-sm' : 'text-ink/50 hover:text-ink'
                }`}
              >
                <PenTool size={16} />
                <span>Original writing</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold uppercase tracking-widest text-ink/50">Quote</label>
                  <span className={`text-xs font-mono transition-colors ${content.length >= MAX_LENGTH ? 'text-terracotta font-bold' : 'text-ink/40'}`}>
                    {content.length}/{MAX_LENGTH}
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={MAX_LENGTH}
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ink focus:border-transparent transition-all outline-none resize-none h-32 font-serif text-lg leading-relaxed"
                    placeholder={type === 'book' ? "Share a quote that moved you..." : "What's on your mind?"}
                    required
                  />
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 h-1 bg-ink/5 w-full rounded-b-xl overflow-hidden">
                    <motion.div 
                      className={`h-full transition-colors ${
                        content.length >= MAX_LENGTH 
                          ? 'bg-terracotta' 
                          : content.length >= MAX_LENGTH * 0.9 
                            ? 'bg-amber-500' 
                            : 'bg-emerald-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(content.length / MAX_LENGTH) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {type === 'book' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-ink/50 mb-2">Book</label>
                    <select
                      value={bookId}
                      onChange={(e) => {
                        setBookId(e.target.value);
                        if (e.target.value === 'new') {
                          setBookTitle('');
                          setAuthor('');
                        }
                      }}
                      className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ink focus:border-transparent transition-all outline-none"
                    >
                      <option value="">Select a book...</option>
                      <option value="new">+ Add a new book</option>
                      {books.map((book) => (
                        <option key={book.id} value={book.id}>
                          {book.title} by {book.author}
                        </option>
                      ))}
                    </select>
                  </div>

                  {bookId === 'new' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <div>
                        <input
                          type="text"
                          value={bookTitle}
                          onChange={(e) => setBookTitle(e.target.value)}
                          maxLength={100}
                          placeholder="Book Title"
                          className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ink focus:border-transparent transition-all outline-none"
                          required={type === 'book' && bookId === 'new'}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          maxLength={100}
                          placeholder="Author"
                          className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-ink focus:border-transparent transition-all outline-none"
                          required={type === 'book' && bookId === 'new'}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || !content || (type === 'book' && !bookId && !bookTitle)}
                  className="w-full py-4 bg-charcoal text-cream rounded-xl font-bold tracking-wide hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'Post Quote'}
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="hidden md:block w-1/2 bg-stone-100 p-8 border-l border-ink/5 relative">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-ink/5 hover:bg-ink/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-sm font-bold uppercase tracking-widest text-ink/30 mb-8">Live Preview</h3>
            
            <div className="bg-cream rounded-2xl p-6 shadow-sm border border-ink/5">
              <p className="font-serif text-xl italic text-ink/80 leading-relaxed mb-6 break-words">
                "{content || 'Your quote will appear here...'}"
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  {type === 'book' ? (
                    <>
                      <div className="font-bold text-sm text-ink/60 uppercase tracking-wider">
                        {bookId && bookId !== 'new' ? books.find(b => b.id === bookId)?.title : (bookTitle || 'Book Title')}
                      </div>
                      <div className="text-xs text-ink/40 font-medium">
                        {bookId && bookId !== 'new' ? books.find(b => b.id === bookId)?.author : (author || 'Author')}
                      </div>
                    </>
                  ) : (
                    <div className="font-bold text-sm text-ink/60 uppercase tracking-wider">
                      Original Writing
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
