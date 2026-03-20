import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { QuoteCard } from '../components/QuoteCard';
import { QuoteCardSkeleton } from '../components/QuoteCardSkeleton';
import { Folder, Plus, ChevronRight, Bookmark, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote } from '../types';

export const SavedView: React.FC = () => {
  const { collections, fetchCollections, isFetchingQuotes, getCollectionQuotes } = useAppContext();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [collectionQuotes, setCollectionQuotes] = useState<Quote[]>([]);
  const [isFetchingCollectionQuotes, setIsFetchingCollectionQuotes] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionEmoji, setNewCollectionEmoji] = useState('📚');
  const { createCollection } = useAppContext();

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    const loadCollectionQuotes = async () => {
      if (selectedCollectionId) {
        setIsFetchingCollectionQuotes(true);
        const data = await getCollectionQuotes(selectedCollectionId);
        setCollectionQuotes(data);
        setIsFetchingCollectionQuotes(false);
      } else {
        setCollectionQuotes([]);
      }
    };
    loadCollectionQuotes();
  }, [selectedCollectionId]);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    await createCollection(newCollectionName.trim(), newCollectionEmoji);
    setNewCollectionName('');
    setIsCreating(false);
  };

  const selectedCollection = collections.find(c => c.id === selectedCollectionId);

  if (selectedCollectionId && selectedCollection) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
        <button 
          onClick={() => setSelectedCollectionId(null)}
          className="flex items-center space-x-2 text-ink/40 hover:text-ink mb-8 transition-colors font-bold uppercase text-xs tracking-widest"
        >
          <ChevronRight size={16} className="rotate-180" />
          <span>Back to Collections</span>
        </button>

        <div className="flex items-center space-x-4 mb-12">
          <div className="text-4xl">{selectedCollection.emoji}</div>
          <div>
            <h1 className="text-4xl font-serif font-bold text-ink">{selectedCollection.name}</h1>
            <p className="text-ink/40 italic mt-1">{collectionQuotes.length} quotes saved</p>
          </div>
        </div>

        {isFetchingCollectionQuotes ? (
          <div className="space-y-6">
            <QuoteCardSkeleton />
            <QuoteCardSkeleton />
          </div>
        ) : collectionQuotes.length > 0 ? (
          <div className="space-y-6">
            {collectionQuotes.map(quote => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/30 rounded-3xl border border-dashed border-ink/10">
            <p className="text-ink/30 italic">This collection is empty.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 pb-32">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-ink mb-2">Collections</h1>
          <p className="text-ink/60 text-lg italic">Organize your favorite literary moments.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="p-3 bg-terracotta text-cream rounded-2xl hover:bg-terracotta/90 transition-all shadow-lg"
        >
          <Plus size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 p-6 bg-white rounded-3xl border border-terracotta/20 shadow-xl"
          >
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newCollectionEmoji}
                  onChange={(e) => setNewCollectionEmoji(e.target.value)}
                  className="w-16 p-4 bg-ink/5 rounded-2xl text-center text-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                  placeholder="📚"
                />
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="flex-1 p-4 bg-ink/5 rounded-2xl font-serif text-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                  placeholder="Collection name..."
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-6 py-3 text-ink/40 font-bold hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-terracotta text-cream rounded-xl font-bold hover:bg-terracotta/90 transition-all shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCollectionId(collection.id)}
            className="group relative bg-white p-8 rounded-[2.5rem] border border-ink/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Folder size={80} />
            </div>
            <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-500 inline-block">
              {collection.emoji}
            </div>
            <h3 className="text-2xl font-serif font-bold text-ink mb-2">{collection.name}</h3>
            <p className="text-ink/40 text-sm font-medium uppercase tracking-widest">
              {collection.quoteIds.length} quotes
            </p>
          </motion.div>
        ))}

        {collections.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-24 bg-white/30 rounded-[2.5rem] border border-dashed border-ink/10">
            <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark size={32} className="text-ink/20" />
            </div>
            <h3 className="text-xl font-serif font-bold text-ink/40">No collections yet</h3>
            <p className="text-ink/30 mt-2 italic">Start organizing your favorite quotes.</p>
          </div>
        )}
      </div>
    </div>
  );
};
