import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Book, Quote, Comment, Activity, Notification, Collection, ReadingListEntry } from '../types';
import { api } from '../services/api';

interface AppContextType {
  currentUser: User | null;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  books: Book[];
  quotes: Quote[];
  currentView: 'feed' | 'discover' | 'profile' | 'embed' | 'saved' | 'settings' | 'notifications';
  setCurrentView: (view: 'feed' | 'discover' | 'profile' | 'embed' | 'saved' | 'settings' | 'notifications') => void;
  collections: Collection[];
  readingList: ReadingListEntry[];
  createCollection: (name: string, emoji?: string) => Promise<void>;
  saveToCollection: (collectionId: string, quoteId: string) => Promise<void>;
  updateReadingStatus: (bookId: string, status: ReadingListEntry['status']) => Promise<void>;
  fetchCollections: () => Promise<void>;
  fetchReadingList: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  feedType: 'following' | 'foryou';
  setFeedType: (type: 'following' | 'foryou') => void;
  getPersonalizedQuotes: () => Quote[];
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  likedQuotes: Set<string>;
  toggleLike: (quoteId: string) => Promise<void>;
  savedQuotes: Set<string>;
  toggleSave: (quoteId: string) => void;
  followedUsers: Set<string>;
  toggleFollow: (userId: string) => void;
  toggleFollowAuthor: (authorName: string) => void;
  comments: Comment[];
  addComment: (quoteId: string, text: string) => Promise<void>;
  addQuote: (quoteData: { content: string; book_id?: string; book_title?: string; author?: string; is_original?: boolean }) => Promise<void>;
  followedAuthors: string[];
  preferredGenres: string[];
  activities: Activity[];
  serendipityQuote: Quote | null;
  triggerSerendipity: () => void;
  isSerendipityLoading: boolean;
  isInitialLoading: boolean;
  viewingUserId: string | null;
  viewProfile: (userId: string) => void;
  viewingQuoteId: string | null;
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  likedComments: Set<string>;
  toggleCommentLike: (commentId: string) => void;
  trackShare: (quoteId: string, platform: string) => Promise<void>;
  trackClick: (bookId: string, platform: string) => Promise<void>;
  fetchQuotes: (filter?: string, genre?: string, author?: string, search?: string, sortBy?: string) => Promise<void>;
  isFetchingQuotes: boolean;
  isFetchingActivities: boolean;
  pagination: { page: number; totalPages: number; hasMore: boolean };
  fetchMoreQuotes: (filter?: string, genre?: string, author?: string, search?: string, sortBy?: string) => Promise<void>;
  getCollectionQuotes: (collectionId: string) => Promise<Quote[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * AppContext.tsx
 * 
 * This is the central state management hub for the LitFlow application.
 * It provides:
 * - User authentication state and profile management.
 * - Global data state (quotes, books, collections, reading list).
 * - Social interaction logic (likes, follows, comments, shares).
 * - Feed management (fetching, pagination, filtering).
 * - Navigation and view state.
 * - Real-time notification management.
 * - Affiliate click tracking.
 */
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'feed' | 'discover' | 'profile' | 'embed' | 'saved' | 'settings' | 'notifications'>('feed');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [readingList, setReadingList] = useState<ReadingListEntry[]>([]);
  const [feedType, setFeedType] = useState<'following' | 'foryou'>('foryou');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [likedQuotes, setLikedQuotes] = useState<Set<string>>(new Set());
  const [savedQuotes, setSavedQuotes] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Comment[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [serendipityQuote, setSerendipityQuote] = useState<Quote | null>(null);
  const [isSerendipityLoading, setIsSerendipityLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [appBooks, setAppBooks] = useState<Book[]>([]);
  const [appQuotes, setAppQuotes] = useState<Quote[]>([]);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [viewingQuoteId, setViewingQuoteId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [followedAuthors, setFollowedAuthors] = useState<string[]>([]);
  const [preferredGenres, setPreferredGenres] = useState<string[]>([]);

  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [isFetchingActivities, setIsFetchingActivities] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, hasMore: false });

  useEffect(() => {
    if (currentUser && currentUser.following) {
      setFollowedUsers(new Set(currentUser.following));
    } else {
      setFollowedUsers(new Set());
    }

    const fetchLikes = async () => {
      if (currentUser) {
        const likes = await api.getUserLikes(currentUser.id);
        setLikedQuotes(new Set(likes));
      } else {
        setLikedQuotes(new Set());
      }
    };
    fetchLikes();
  }, [currentUser]);

  // Handle URL parameters for embedding
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const embedId = params.get('embed');
    if (embedId) {
      setViewingQuoteId(embedId);
      setCurrentView('embed');
    }
  }, []);

  const viewProfile = (userId: string) => {
    if (currentUser && userId === currentUser.id) {
      setViewingUserId(null);
    } else {
      setViewingUserId(userId);
    }
    setCurrentView('profile');
  };

  const mapUser = (user: any): User => {
    if (!user) return null as any;
    return {
      ...user,
      followedAuthors: user.followed_authors || user.followedAuthors || [],
      preferredGenres: user.preferred_genres || user.preferredGenres || []
    };
  };

  const login = async (credentials: any) => {
    const data = await api.login(credentials);
    localStorage.setItem('litflow_token', data.token);
    const mappedUser = mapUser(data.user);
    localStorage.setItem('litflow_user', JSON.stringify(mappedUser));
    setCurrentUser(mappedUser);
  };

  const register = async (userData: any) => {
    const data = await api.register(userData);
    localStorage.setItem('litflow_token', data.token);
    const mappedUser = mapUser(data.user);
    localStorage.setItem('litflow_user', JSON.stringify(mappedUser));
    setCurrentUser(mappedUser);
  };

  const logout = () => {
    localStorage.removeItem('litflow_token');
    localStorage.removeItem('litflow_user');
    setCurrentUser(null);
  };

  const fetchQuotes = async (filter?: string, genre?: string, author?: string, search?: string, sortBy?: string) => {
    setIsFetchingQuotes(true);
    try {
      const data = await api.getQuotes(filter, 1, 10, genre, author, search, sortBy);
      setAppQuotes(data.quotes);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        hasMore: data.pagination.page < data.pagination.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  const fetchMoreQuotes = async (filter?: string, genre?: string, author?: string, search?: string, sortBy?: string) => {
    if (isFetchingQuotes || !pagination.hasMore) return;
    
    setIsFetchingQuotes(true);
    try {
      const nextPage = pagination.page + 1;
      const data = await api.getQuotes(filter, nextPage, 10, genre, author, search, sortBy);
      
      setAppQuotes(prev => [...prev, ...data.quotes]);
      setPagination({
        page: data.pagination.page,
        totalPages: data.pagination.totalPages,
        hasMore: data.pagination.page < data.pagination.totalPages
      });
    } catch (error) {
      console.error('Failed to fetch more quotes:', error);
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsInitialLoading(true);
      try {
        // Check for stored user
        const storedUser = localStorage.getItem('litflow_user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          // Verify user still exists in backend (especially important for mock mode)
          const profile = await api.getUserProfile(user.id);
          if (profile && profile.user) {
            const mappedUser = mapUser(profile.user);
            setCurrentUser(mappedUser);
            localStorage.setItem('litflow_user', JSON.stringify(mappedUser));
          } else {
            console.warn('User session invalid or user not found in backend. Logging out.');
            localStorage.removeItem('litflow_token');
            localStorage.removeItem('litflow_user');
            setCurrentUser(null);
          }
        }

        // Fetch books and quotes
        const [booksData, quotesData] = await Promise.all([
          api.getBooks(),
          api.getQuotes()
        ]);
        
        setAppBooks(booksData);
        setAppQuotes(quotesData.quotes);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadData();
  }, []);

  const toggleLike = async (quoteId: string) => {
    if (!currentUser) return;
    
    // Optimistic update
    const isCurrentlyLiked = likedQuotes.has(quoteId);
    
    setLikedQuotes(prev => {
      const next = new Set(prev);
      if (isCurrentlyLiked) next.delete(quoteId);
      else next.add(quoteId);
      return next;
    });

    setAppQuotes(prev => prev.map(q => 
      q.id === quoteId ? { ...q, likes_count: (q.likes_count || 0) + (isCurrentlyLiked ? -1 : 1) } : q
    ));
    
    try {
      const result = await api.likeQuote(quoteId);
      // If the backend state differs from our optimistic update, revert/sync
      if (result.liked === isCurrentlyLiked) {
        setLikedQuotes(prev => {
          const next = new Set(prev);
          if (result.liked) next.add(quoteId);
          else next.delete(quoteId);
          return next;
        });
        setAppQuotes(prev => prev.map(q => 
          q.id === quoteId ? { ...q, likes_count: (q.likes_count || 0) + (result.liked ? 1 : -1) } : q
        ));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      setLikedQuotes(prev => {
        const next = new Set(prev);
        if (isCurrentlyLiked) next.add(quoteId);
        else next.delete(quoteId);
        return next;
      });
      setAppQuotes(prev => prev.map(q => 
        q.id === quoteId ? { ...q, likes_count: (q.likes_count || 0) + (isCurrentlyLiked ? 1 : -1) } : q
      ));
    }
  };

  const addComment = async (quoteId: string, text: string) => {
    if (!currentUser) return;

    try {
      const newComment = await api.commentOnQuote(quoteId, text);
      setComments(prev => [...prev, newComment]);
      
      // Update local quote comment count
      setAppQuotes(prev => prev.map(q => 
        q.id === quoteId ? { ...q, comments_count: (q.comments_count || 0) + 1 } : q
      ));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const addQuote = async (quoteData: { content: string; book_id?: string; book_title?: string; author?: string; is_original?: boolean }) => {
    if (!currentUser) return;

    try {
      const newQuote = await api.createQuote(quoteData);
      setAppQuotes(prev => [newQuote, ...prev]);
    } catch (error) {
      console.error('Failed to add quote:', error);
      throw error;
    }
  };

  const getPersonalizedQuotes = () => {
    const now = new Date().getTime();
    
    // Calculate user engagement patterns
    const engagedGenres = new Map<string, number>();
    const engagedAuthors = new Map<string, number>();
    
    appQuotes.forEach(q => {
      if (likedQuotes.has(q.id) || savedQuotes.has(q.id)) {
        const book = appBooks.find(b => b.id === q.book_id);
        if (book) {
          const weight = likedQuotes.has(q.id) && savedQuotes.has(q.id) ? 2 : 1;
          engagedAuthors.set(book.author, (engagedAuthors.get(book.author) || 0) + weight);
          (book.genres || []).forEach(g => {
            engagedGenres.set(g, (engagedGenres.get(g) || 0) + weight);
          });
        }
      }
    });

    // Calculate global genre popularity
    const globalGenrePopularity = new Map<string, number>();
    appQuotes.forEach(q => {
      const book = appBooks.find(b => b.id === q.book_id);
      if (book) {
        const engagement = (q.likes_count || 0) + (q.comments_count || 0) * 2 + 1;
        (book.genres || []).forEach(g => {
          globalGenrePopularity.set(g, (globalGenrePopularity.get(g) || 0) + engagement);
        });
      }
    });
    
    // Normalize global genre popularity
    const maxGlobalGenrePop = Math.max(1, ...Array.from(globalGenrePopularity.values()));

    const isColdStart = !followedAuthors.length && 
                        !preferredGenres.length && 
                        followedUsers.size === 0 && 
                        likedQuotes.size === 0 && 
                        savedQuotes.size === 0;

    return [...appQuotes].map(quote => {
      let score = 0;
      const book = appBooks.find(b => b.id === quote.book_id);
      
      // 1. Recency (Exponential decay: halves every 24 hours)
      const quoteTime = new Date(quote.created_at).getTime();
      const ageHours = (now - quoteTime) / (1000 * 60 * 60);
      score += 100 * Math.exp(-ageHours / 24);

      // 2. Popularity (Logarithmic scale to prevent highly popular quotes from dominating forever)
      const engagement = (quote.likes_count || 0) + (quote.comments_count || 0) * 2;
      score += Math.log1p(engagement) * 10;

      if (book) {
        // 3. Followed Authors (100 points)
        if (followedAuthors.includes(book.author)) {
          score += 100;
        }

        // 4. Preferred Genres (20 points per match)
        const genreMatches = (book.genres || []).filter(g => preferredGenres.includes(g));
        score += (genreMatches.length || 0) * 20;
        
        // 5. User Engagement Patterns (Implicit preferences)
        const authorEngagement = engagedAuthors.get(book.author) || 0;
        score += Math.min(50, authorEngagement * 10); // Cap at 50
        
        let genreEngagementScore = 0;
        let globalGenreScore = 0;
        (book.genres || []).forEach(g => {
          genreEngagementScore += engagedGenres.get(g) || 0;
          globalGenreScore += (globalGenrePopularity.get(g) || 0) / maxGlobalGenrePop;
        });
        score += Math.min(40, genreEngagementScore * 5); // Cap at 40
        
        // 6. Global Genre Popularity (up to 15 points)
        score += (globalGenreScore / Math.max(1, (book.genres || []).length)) * 15;
      }

      // 7. Followed Users (80 points)
      if (quote.user_id && followedUsers.has(quote.user_id)) {
        score += 80;
      }

      // 8. Curated Content (25 points)
      if (quote.is_curated) score += 25;
      
      // 9. Cold Start Strategy
      if (isColdStart) {
        // Add some randomness to help discoverability
        score += Math.random() * 40;
        // Boost curated content more for new users
        if (quote.is_curated) score += 30;
      }

      return { ...quote, score };
    })
    .sort((a, b) => (b as any).score - (a as any).score);
  };

  const fetchCollections = async () => {
    try {
      const data = await api.getCollections();
      setCollections(data);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  const createCollection = async (name: string, emoji?: string) => {
    try {
      const newCollection = await api.createCollection(name, emoji);
      setCollections(prev => [...prev, newCollection]);
    } catch (error) {
      console.error('Failed to create collection:', error);
      throw error;
    }
  };

  const saveToCollection = async (collectionId: string, quoteId: string) => {
    try {
      await api.saveQuoteToCollection(collectionId, quoteId);
      // Update local state if needed (e.g., increment quote count)
      setCollections(prev => prev.map(c => 
        c.id === collectionId ? { ...c, quotes_count: (c.quotes_count || 0) + 1 } : c
      ));
    } catch (error) {
      console.error('Failed to save to collection:', error);
      throw error;
    }
  };

  const fetchReadingList = async () => {
    try {
      const data = await api.getReadingList();
      setReadingList(data);
    } catch (error) {
      console.error('Failed to fetch reading list:', error);
    }
  };

  const updateReadingStatus = async (bookId: string, status: ReadingListEntry['status']) => {
    try {
      const updatedEntry = await api.updateReadingStatus(bookId, status);
      setReadingList(prev => {
        const index = prev.findIndex(e => e.book_id === bookId);
        if (index > -1) {
          const next = [...prev];
          next[index] = updatedEntry;
          return next;
        }
        return [...prev, updatedEntry];
      });
      
      // Update user stats if needed
      if (currentUser) {
        const profile = await api.getUserProfile(currentUser.id);
        setCurrentUser(profile);
      }
    } catch (error) {
      console.error('Failed to update reading status:', error);
      throw error;
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleSetCurrentView = (view: 'feed' | 'discover' | 'profile' | 'embed' | 'saved' | 'settings' | 'notifications') => {
    if (view !== 'profile') {
      setViewingUserId(null);
    } else if (currentView === 'profile' && viewingUserId !== null) {
      setViewingUserId(null);
    }
    setCurrentView(view);
  };

  const toggleSave = (id: string) => {
    setSavedQuotes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleFollow = async (id: string) => {
    if (!currentUser) return;
    
    try {
      const isFollowing = followedUsers.has(id);
      if (isFollowing) {
        await api.unfollowUser(id);
      } else {
        await api.followUser(id);
      }
      
      setFollowedUsers(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        
        // Update currentUser following array
        if (currentUser) {
          const updatedFollowing = Array.from(next);
          const updatedUser = { ...currentUser, following: updatedFollowing };
          setCurrentUser(updatedUser);
          localStorage.setItem('litflow_user', JSON.stringify(updatedUser));
        }
        
        return next;
      });
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const toggleFollowAuthor = (author: string) => {
    setFollowedAuthors(prev => {
      if (prev.includes(author)) {
        return prev.filter(a => a !== author);
      }
      return [...prev, author];
    });
  };

  const triggerSerendipity = () => {
    setIsSerendipityLoading(true);
    setTimeout(() => {
      const randomQuote = appQuotes[Math.floor(Math.random() * appQuotes.length)];
      setSerendipityQuote(randomQuote);
      setIsSerendipityLoading(false);
    }, 1500);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleCommentLike = (id: string) => {
    setLikedComments(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const trackShare = async (quoteId: string, platform: string) => {
    try {
      await api.trackShare(quoteId, platform);
      setAppQuotes(prev => prev.map(q => 
        q.id === quoteId ? { ...q, shares_count: (q.shares_count || 0) + 1 } : q
      ));
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  const trackClick = async (bookId: string, platform: string) => {
    try {
      await api.trackClick(bookId, platform);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const updateProfile = async (updates: any) => {
    if (!currentUser) return;
    try {
      // Map back to snake_case for the API if needed
      const apiUpdates: any = { ...updates };
      if (updates.preferredGenres) {
        apiUpdates.preferred_genres = updates.preferredGenres;
      }
      if (updates.followedAuthors) {
        apiUpdates.followed_authors = updates.followedAuthors;
      }

      const updatedUser = await api.updateProfile(currentUser.id, apiUpdates);
      const mappedUser = mapUser(updatedUser);
      
      // Merge stats and other local-only properties back into the updated user
      // since the backend might not return them in the update response
      const finalUser = {
        ...currentUser,
        ...mappedUser,
        stats: currentUser.stats
      };
      
      setCurrentUser(finalUser);
      localStorage.setItem('litflow_user', JSON.stringify(finalUser));
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Optionally throw the error to be handled by the UI
      throw error;
    }
  };

  const getCollectionQuotes = async (collectionId: string) => {
    try {
      return await api.getCollectionQuotes(collectionId);
    } catch (error) {
      console.error('Failed to fetch collection quotes:', error);
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        updateProfile,
        books: appBooks,
        quotes: appQuotes,
        currentView,
        setCurrentView: handleSetCurrentView,
        collections,
        readingList,
        createCollection,
        saveToCollection,
        updateReadingStatus,
        fetchCollections,
        fetchReadingList,
        fetchNotifications,
        feedType,
        setFeedType,
        getPersonalizedQuotes,
        selectedBook,
        setSelectedBook,
        likedQuotes,
        toggleLike,
        savedQuotes,
        toggleSave,
        followedUsers,
        toggleFollow,
        toggleFollowAuthor,
        comments,
        addComment,
        addQuote,
        followedAuthors,
        preferredGenres,
        activities,
        serendipityQuote,
        triggerSerendipity,
        isSerendipityLoading,
        isInitialLoading,
        viewingUserId,
        viewProfile,
        viewingQuoteId,
        notifications,
        markAsRead,
        markAllAsRead,
        likedComments,
        toggleCommentLike,
        trackShare,
        trackClick,
        fetchQuotes,
        fetchMoreQuotes,
        isFetchingQuotes,
        isFetchingActivities,
        pagination,
        getCollectionQuotes,
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
