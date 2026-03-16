import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Book, Quote } from '../types';
import { users, books, quotes } from '../data';

interface AppContextType {
  currentUser: User;
  books: Book[];
  quotes: Quote[];
  currentView: 'feed' | 'discover' | 'profile';
  setCurrentView: (view: 'feed' | 'discover' | 'profile') => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  likedQuotes: Set<string>;
  toggleLike: (quoteId: string) => void;
  savedQuotes: Set<string>;
  toggleSave: (quoteId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'feed' | 'discover' | 'profile'>('feed');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(new Set());
  const [savedQuotes, setSavedQuotes] = useState<Set<string>>(new Set());

  const toggleLike = (quoteId: string) => {
    setLikedQuotes(prev => {
      const next = new Set(prev);
      if (next.has(quoteId)) next.delete(quoteId);
      else next.add(quoteId);
      return next;
    });
  };

  const toggleSave = (quoteId: string) => {
    setSavedQuotes(prev => {
      const next = new Set(prev);
      if (next.has(quoteId)) next.delete(quoteId);
      else next.add(quoteId);
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser: users[0], // Elara V.
        books,
        quotes,
        currentView,
        setCurrentView,
        selectedBook,
        setSelectedBook,
        likedQuotes,
        toggleLike,
        savedQuotes,
        toggleSave,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
