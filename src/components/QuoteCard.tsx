import React from 'react';
import { Quote, Book, User } from '../types';
import { books, users } from '../data';
import { useAppContext } from '../context/AppContext';
import { renderCommentText } from '../utils/textUtils';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, UserPlus, UserCheck, Send, Code, X, Copy, Check, Download, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

interface QuoteCardProps {
  quote: Quote;
  recommendationLabel?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, recommendationLabel }) => {
  const { setSelectedBook, toggleLike, likedQuotes, toggleSave, savedQuotes, currentUser, followedUsers, toggleFollow, toggleFollowAuthor, followedAuthors, comments, addComment, viewProfile, likedComments, toggleCommentLike, books, collections, saveToCollection, trackShare } = useAppContext();
  const [showComments, setShowComments] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [isSavingToCollection, setIsSavingToCollection] = React.useState(false);
  const [newComment, setNewComment] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [mentionQuery, setMentionQuery] = React.useState('');
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const [showEmbedModal, setShowEmbedModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [showHeartPop, setShowHeartPop] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const book = books.find(b => b.id === quote.book_id);
  
  const isLiked = likedQuotes.has(quote.id);
  const isSaved = savedQuotes.has(quote.id);
  const isFollowing = quote.user_id ? followedUsers.has(quote.user_id) : false;
  const quoteComments = comments.filter(c => c.quoteId === quote.id);

  const handleDoubleTap = () => {
    if (!isLiked) {
      toggleLike(quote.id);
    }
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const pos = e.target.selectionStart || 0;
    setNewComment(value);
    setCursorPosition(pos);

    // Check if typing a mention
    const textBeforeCursor = value.substring(0, pos);
    const lastAt = textBeforeCursor.lastIndexOf('@');
    
    if (lastAt !== -1 && !textBeforeCursor.substring(lastAt).includes(' ')) {
      const query = textBeforeCursor.substring(lastAt + 1);
      setMentionQuery(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectMention = (user: User) => {
    const lastAtIndex = newComment.lastIndexOf('@', cursorPosition - 1);
    const textBeforeAt = newComment.substring(0, lastAtIndex);
    const textAfterCursor = newComment.substring(cursorPosition);
    const updatedComment = `${textBeforeAt}${user.username} ${textAfterCursor}`;
    setNewComment(updatedComment);
    setShowSuggestions(false);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(mentionQuery.toLowerCase())
  ).slice(0, 5);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(quote.id, newComment);
      setNewComment('');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'LitFlow Quote',
      text: `"${quote.content}" — ${book?.author || quote.book_author} (${book?.title || quote.book_title})`,
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        await trackShare(quote.id, 'web_share');
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\nShared from LitFlow`);
        await trackShare(quote.id, 'clipboard');
        // We could add a toast here, but for now we'll just copy to clipboard
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    }
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#141414', // Match charcoal background
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `litflow-quote-${quote.id}.png`;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const embedCode = `<iframe src="${window.location.origin}/?embed=${quote.id}" width="100%" height="400" frameborder="0" style="border-radius: 32px; overflow: hidden;"></iframe>`;

  const handleSaveClick = () => {
    if (isSaved) {
      toggleSave(quote.id);
    } else {
      setShowSaveModal(true);
    }
  };

  const handleSaveToCollection = async (collectionId: string) => {
    setIsSavingToCollection(true);
    try {
      await saveToCollection(collectionId, quote.id);
      setShowSaveModal(false);
    } finally {
      setIsSavingToCollection(false);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="bg-charcoal rounded-3xl p-8 mb-6 shadow-xl relative overflow-hidden group"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles size={120} className="text-cream" />
      </div>

      <div className="relative z-10" onDoubleClick={handleDoubleTap}>
        {/* Heart Pop Animation */}
        <AnimatePresence>
          {showHeartPop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.5, y: -100 }}
              exit={{ opacity: 0, scale: 0.5, y: -150 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <Heart size={120} fill="#FF6321" className="text-terracotta drop-shadow-2xl" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Recommendation Label */}
        {recommendationLabel && (
          <div className="mb-4 flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-terracotta/60">
            <Sparkles size={12} />
            <span>{recommendationLabel}</span>
          </div>
        )}
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {quote.is_curated ? (
              <span className="text-[10px] uppercase tracking-widest font-bold text-sage bg-sage/10 px-3 py-1 rounded-full">
                Curated
              </span>
            ) : (
              <div 
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => quote.user_id && viewProfile(quote.user_id)}
              >
                <img src={quote.avatar_url || 'https://picsum.photos/seed/avatar/200/200'} alt={quote.username} className="w-8 h-8 rounded-full border border-cream/20" />
                <span className="text-sm font-medium text-cream/80">{quote.username}</span>
              </div>
            )}
            {quote.score && quote.score > 150 && (
              <span className="text-[10px] uppercase tracking-widest font-bold text-terracotta bg-terracotta/10 px-3 py-1 rounded-full flex items-center space-x-1">
                <Sparkles size={10} />
                <span>Top Match</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {quote.user_id && currentUser && quote.user_id !== currentUser.id && !quote.is_curated && (
              <button
                onClick={() => toggleFollow(quote.user_id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                  isFollowing 
                    ? 'bg-sage/20 text-sage border border-sage/30' 
                    : 'bg-cream/10 text-cream/60 hover:bg-cream/20 hover:text-cream border border-cream/10'
                }`}
              >
                {isFollowing ? <UserCheck size={12} /> : <UserPlus size={12} />}
                <span>{isFollowing ? 'Following' : 'Follow'}</span>
              </button>
            )}
            <span className="text-xs text-cream/40 font-mono">
              {formatDistanceToNow(new Date(quote.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Quote Text */}
        <blockquote className="text-2xl md:text-3xl font-serif text-cream leading-relaxed mb-8 italic">
          "{quote.content}"
        </blockquote>

        {/* Book Chip or Original Writing */}
        {quote.book_id || quote.book_title ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between bg-cream/5 p-3 rounded-2xl w-full gap-4">
            <button
              onClick={() => book && setSelectedBook(book)}
              className="flex items-center space-x-4 text-left flex-1"
            >
              {(book?.cover_url || quote.book_cover) ? (
                <img src={book?.cover_url || quote.book_cover} alt={book?.title || quote.book_title} className="w-12 h-16 object-cover rounded-lg shadow-md" />
              ) : (
                <div className="w-12 h-16 bg-cream/10 rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-cream/40 text-xs font-serif">Book</span>
                </div>
              )}
              <div>
                <div className="text-cream font-medium text-sm line-clamp-1">{book?.title || quote.book_title}</div>
                <div className="text-cream/60 text-xs">{book?.author || quote.book_author}</div>
              </div>
            </button>
            {(book?.author || quote.book_author) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowAuthor(book?.author || quote.book_author || '');
                }}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap self-start md:self-center ${
                  followedAuthors.includes(book?.author || quote.book_author || '')
                    ? 'bg-sage/20 text-sage border border-sage/30'
                    : 'bg-cream/10 text-cream/60 hover:bg-cream/20 hover:text-cream border border-cream/10'
                }`}
              >
                {followedAuthors.includes(book?.author || quote.book_author || '') ? (
                  <span className="flex items-center space-x-1">
                    <UserCheck size={12} />
                    <span>Following Author</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <UserPlus size={12} />
                    <span>Follow Author</span>
                  </span>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-cream/5 p-3 rounded-2xl w-max">
            <span className="text-[10px] uppercase tracking-widest font-bold text-cream/60">
              Original Writing
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream/10">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => toggleLike(quote.id)}
              className={`flex items-center space-x-2 transition-all duration-300 ${isLiked ? 'text-terracotta scale-110' : 'text-cream/60 hover:text-cream'}`}
            >
              <motion.div
                whileTap={{ scale: 1.5 }}
                animate={{ 
                  scale: isLiked ? [1, 1.4, 1] : 1,
                  rotate: isLiked ? [0, 15, -15, 0] : 0
                }}
                transition={{ duration: 0.4 }}
              >
                <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'drop-shadow-[0_0_8px_rgba(255,99,33,0.4)]' : ''} />
              </motion.div>
              <span className={`text-xs font-bold transition-all ${isLiked ? 'text-terracotta' : 'text-cream/60'}`}>
                {quote.likes_count || 0}
              </span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center space-x-2 transition-colors ${showComments ? 'text-sage' : 'text-cream/60 hover:text-cream'}`}
            >
              <MessageCircle size={20} />
              <span className="text-xs font-medium">{(quote.comments_count || 0) + quoteComments.length}</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleSaveClick}
              className={`transition-all duration-300 ${isSaved ? 'text-sage scale-110' : 'text-cream/60 hover:text-cream'}`}
            >
              <motion.div
                whileTap={{ scale: 1.5 }}
                animate={{ 
                  scale: isSaved ? [1, 1.4, 1] : 1,
                  y: isSaved ? [0, -4, 0] : 0
                }}
                transition={{ duration: 0.4 }}
              >
                <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} className={isSaved ? 'drop-shadow-[0_0_8px_rgba(110,121,105,0.4)]' : ''} />
              </motion.div>
            </button>
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 text-cream/60 hover:text-cream transition-colors"
              title="Share"
            >
              <Share2 size={20} />
              <span className="text-xs font-medium">{quote.shares_count || 0}</span>
            </button>
            <button 
              onClick={handleShareImage}
              className="text-cream/60 hover:text-cream transition-colors"
              title="Download Image"
              disabled={isExporting}
            >
              <Download size={20} className={isExporting ? 'opacity-50' : ''} />
            </button>
            <button 
              onClick={() => setShowEmbedModal(true)}
              className="text-cream/60 hover:text-cream transition-colors"
              title="Embed"
            >
              <Code size={20} />
            </button>
          </div>
        </div>

        {/* Save to Collection Modal */}
        <AnimatePresence>
          {showSaveModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-cream w-full max-w-sm rounded-[40px] p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowSaveModal(false)}
                  className="absolute top-6 right-6 p-2 text-ink/40 hover:text-ink transition-colors"
                >
                  <X size={24} />
                </button>

                <h3 className="text-2xl font-serif italic text-ink mb-2">Save to Collection</h3>
                <p className="text-ink/60 text-sm mb-6">Choose a collection for this quote.</p>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {collections.map(collection => (
                    <button
                      key={collection.id}
                      onClick={() => handleSaveToCollection(collection.id)}
                      disabled={isSavingToCollection}
                      className="w-full flex items-center justify-between p-4 bg-ink/5 hover:bg-ink/10 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{collection.emoji}</span>
                        <span className="font-serif font-bold text-ink">{collection.name}</span>
                      </div>
                      <ChevronRight size={16} className="text-ink/20 group-hover:text-ink/40 transition-colors" />
                    </button>
                  ))}
                </div>

                {collections.length === 0 && (
                  <div className="text-center py-8 bg-ink/5 rounded-2xl border border-dashed border-ink/10">
                    <p className="text-ink/40 text-sm italic">No collections yet.</p>
                    <button 
                      onClick={() => {
                        setShowSaveModal(false);
                        // In a real app, we'd open a "Create Collection" modal here
                      }}
                      className="mt-4 text-terracotta text-sm font-bold hover:underline"
                    >
                      Go to Collections to create one
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Embed Modal */}
        <AnimatePresence>
          {showEmbedModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-cream w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative"
              >
                <button 
                  onClick={() => setShowEmbedModal(false)}
                  className="absolute top-6 right-6 p-2 text-ink/40 hover:text-ink transition-colors"
                >
                  <X size={24} />
                </button>

                <h3 className="text-2xl font-serif italic text-ink mb-2">Embed Quote</h3>
                <p className="text-ink/60 text-sm mb-6">Copy this code to embed this quote on your website.</p>

                <div className="bg-ink/5 rounded-2xl p-4 font-mono text-xs text-ink/80 break-all relative group">
                  {embedCode}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="absolute top-2 right-2 p-2 bg-ink text-cream rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-ink/10">
                  <p className="text-xs text-ink/40 uppercase tracking-widest font-bold mb-4">Preview</p>
                  <div className="rounded-2xl overflow-hidden border border-ink/10">
                    <div className="bg-ink p-6">
                      <p className="text-cream font-serif italic text-lg leading-relaxed">"{quote.content}"</p>
                      <div className="mt-4 flex items-center space-x-2">
                        <span className="text-[10px] text-cream/40 uppercase tracking-widest">LitFlow Embed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Comments Section */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-8 pt-6 border-t border-cream/10"
          >
            <div className="space-y-6 mb-8">
              {quoteComments.length === 0 ? (
                <p className="text-cream/40 text-sm italic">No comments yet. Be the first to discuss this quote.</p>
              ) : (
                quoteComments.map(comment => {
                  const commenter = users.find(u => u.id === comment.userId) || currentUser;
                  return (
                    <div key={comment.id} className="flex space-x-4">
                      <img src={commenter?.avatar_url || 'https://picsum.photos/seed/avatar/200/200'} alt={commenter?.username} className="w-8 h-8 rounded-full border border-cream/10" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-cream">{commenter?.username}</span>
                          <span className="text-[10px] text-cream/40 font-mono">
                            {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-cream/80 leading-relaxed mb-2">{renderCommentText(comment.text, viewProfile)}</p>
                        <div className="flex items-center space-x-4">
                          <button 
                            onClick={() => toggleCommentLike(comment.id)}
                            className={`flex items-center space-x-1.5 transition-colors ${likedComments.has(comment.id) ? 'text-terracotta' : 'text-cream/40 hover:text-cream'}`}
                          >
                            <Heart size={12} fill={likedComments.has(comment.id) ? 'currentColor' : 'none'} />
                            <span className="text-[10px] font-bold">{comment.likes || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleAddComment} className="relative">
              {showSuggestions && filteredUsers.length > 0 && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-charcoal border border-cream/10 rounded-2xl overflow-hidden shadow-2xl z-50">
                  {filteredUsers.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => selectMention(u)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-cream/5 transition-colors text-left"
                    >
                      <img src={u.avatar_url || 'https://picsum.photos/seed/avatar/200/200'} alt={u.username} className="w-8 h-8 rounded-full border border-cream/10" />
                      <div>
                        <div className="text-sm font-bold text-cream">{u.username}</div>
                        <div className="text-xs text-cream/40">{u.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={newComment}
                onChange={handleInputChange}
                placeholder="Add a comment..."
                className="w-full bg-cream/5 border border-cream/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:ring-1 focus:ring-sage/50 transition-all"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sage disabled:text-cream/20 transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
