import { User, Quote, Book, Collection, ReadingListEntry, Comment, Notification } from '../types';
import { books as initialBooks, quotes as initialQuotes, users as initialUsers } from '../data';

const fakeDelay = (ms = 500) => new Promise(res => setTimeout(res, ms));

// Helper to get from localStorage
const getStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Helper to save to localStorage
const setStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initialize state from localStorage or initial data
let mockQuotes = getStorage<Quote[]>('litflow_mock_quotes', initialQuotes);
let mockCollections = getStorage<Collection[]>('litflow_mock_collections', []);
let mockReadingList = getStorage<ReadingListEntry[]>('litflow_mock_reading_list', []);
let mockLikes = getStorage<string[]>('litflow_mock_likes', []);
let mockSavedQuotes = getStorage<string[]>('litflow_mock_saved_quotes', []);
let mockComments = getStorage<Comment[]>('litflow_mock_comments', []);
let mockNotifications = getStorage<Notification[]>('litflow_mock_notifications', []);

export const api = {
  // Auth
  register: async (userData: any) => {
    await fakeDelay(800);
    const mockUser: User = {
      id: `u-${Date.now()}`,
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      bio: 'This is a temporary development account.',
      preferredGenres: [],
      followedAuthors: [],
      following: [],
      created_at: new Date().toISOString(),
      stats: { quotes: 0, likes: 0 }
    };
    return { token: 'mock-jwt-token', user: mockUser };
  },

  login: async (credentials: any) => {
    await fakeDelay(800);
    const mockUser: User = {
      id: 'mock-user-id',
      username: credentials.email.split('@')[0] || 'devuser',
      email: credentials.email,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
      bio: 'This is a temporary development account.',
      preferredGenres: [],
      followedAuthors: [],
      following: [],
      created_at: new Date().toISOString(),
      stats: { quotes: 0, likes: 0 }
    };
    localStorage.setItem('litflow_token', 'mock-jwt-token');
    localStorage.setItem('litflow_user', JSON.stringify(mockUser));
    return { token: 'mock-jwt-token', user: mockUser };
  },

  logout: () => {
    localStorage.removeItem('litflow_token');
    localStorage.removeItem('litflow_user');
  },

  // Quotes
  getQuotes: async (filter?: string, page = 1, limit = 10, genre?: string, author?: string, search?: string, sortBy?: string) => {
    await fakeDelay(600);
    let filtered = [...mockQuotes];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(q => 
        q.content.toLowerCase().includes(s) || 
        q.book_title?.toLowerCase().includes(s) || 
        q.book_author?.toLowerCase().includes(s)
      );
    }

    if (genre) {
      const bookIds = initialBooks.filter(b => b.genres.includes(genre)).map(b => b.id);
      filtered = filtered.filter(q => bookIds.includes(q.book_id));
    }

    if (author) {
      filtered = filtered.filter(q => q.book_author === author);
    }

    if (sortBy === 'trending') {
      filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      quotes: paginated.map(q => {
        const book = initialBooks.find(b => b.id === q.book_id);
        const user = initialUsers.find(u => u.id === q.user_id);
        return {
          ...q,
          book_title: book?.title || q.book_title,
          book_author: book?.author || q.book_author,
          book_cover: book?.cover_url || q.book_cover,
          username: user?.username || q.username,
          avatar_url: user?.avatar_url || q.avatar_url
        };
      }),
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
        total: filtered.length
      }
    };
  },

  createQuote: async (quoteData: any) => {
    await fakeDelay(500);
    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      content: quoteData.content,
      book_id: quoteData.book_id || '',
      user_id: 'mock-user-id',
      is_curated: false,
      created_at: new Date().toISOString(),
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      book_title: quoteData.book_title,
      book_author: quoteData.author,
      username: 'devuser',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devuser'
    };
    mockQuotes = [newQuote, ...mockQuotes];
    setStorage('litflow_mock_quotes', mockQuotes);
    return newQuote;
  },

  likeQuote: async (quoteId: string) => {
    await fakeDelay(200);
    const isLiked = mockLikes.includes(quoteId);
    if (isLiked) {
      mockLikes = mockLikes.filter(id => id !== quoteId);
    } else {
      mockLikes.push(quoteId);
    }
    setStorage('litflow_mock_likes', mockLikes);
    
    mockQuotes = mockQuotes.map(q => 
      q.id === quoteId 
        ? { ...q, likes_count: (q.likes_count || 0) + (isLiked ? -1 : 1) } 
        : q
    );
    setStorage('litflow_mock_quotes', mockQuotes);
    return { success: true, liked: !isLiked };
  },

  commentOnQuote: async (quoteId: string, content: string) => {
    await fakeDelay(300);
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      quoteId,
      userId: 'mock-user-id',
      text: content,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    mockComments = [...mockComments, newComment];
    setStorage('litflow_mock_comments', mockComments);
    
    mockQuotes = mockQuotes.map(q => 
      q.id === quoteId 
        ? { ...q, comments_count: (q.comments_count || 0) + 1 } 
        : q
    );
    setStorage('litflow_mock_quotes', mockQuotes);
    return newComment;
  },
  
  trackShare: async (quoteId: string, platform: string) => {
    await fakeDelay(100);
    mockQuotes = mockQuotes.map(q => 
      q.id === quoteId 
        ? { ...q, shares_count: (q.shares_count || 0) + 1 } 
        : q
    );
    setStorage('litflow_mock_quotes', mockQuotes);
    console.log(`Shared quote ${quoteId} to ${platform}`);
    return { success: true };
  },

  getComments: async (quoteId: string) => {
    await fakeDelay(200);
    return mockComments.filter(c => c.quoteId === quoteId);
  },

  // Users
  getUserProfile: async (userId: string) => {
    await fakeDelay(400);
    const user = initialUsers.find(u => u.id === userId);
    const userQuotes = mockQuotes.filter(q => q.user_id === userId);
    
    if (user) return { user, quotes: userQuotes };
    
    return {
      user: {
        id: userId,
        username: 'User',
        email: 'user@example.com',
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        bio: 'A LitFlow user.',
        preferredGenres: [],
        followedAuthors: [],
        following: [],
        created_at: new Date().toISOString(),
        stats: { quotes: userQuotes.length, likes: 0 }
      },
      quotes: userQuotes
    };
  },

  getUserLikes: async (userId: string) => {
    await fakeDelay(300);
    return mockLikes;
  },

  followUser: async (userId: string) => {
    await fakeDelay(200);
    return { success: true };
  },

  unfollowUser: async (userId: string) => {
    await fakeDelay(200);
    return { success: true };
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    await fakeDelay(500);
    return { success: true, user: updates };
  },

  // Collections
  getCollections: async () => {
    await fakeDelay(300);
    return mockCollections;
  },

  createCollection: async (name: string, emoji?: string) => {
    await fakeDelay(400);
    const newCollection: Collection = {
      id: `col-${Date.now()}`,
      user_id: 'mock-user-id',
      name,
      emoji: emoji || '📚',
      quotes_count: 0,
      created_at: new Date().toISOString()
    };
    mockCollections = [...mockCollections, newCollection];
    setStorage('litflow_mock_collections', mockCollections);
    return newCollection;
  },

  saveQuoteToCollection: async (collectionId: string, quoteId: string) => {
    await fakeDelay(300);
    mockCollections = mockCollections.map(c => 
      c.id === collectionId 
        ? { ...c, quotes_count: (c.quotes_count || 0) + 1 } 
        : c
    );
    // In a real app we'd have a junction table, here we just track counts
    setStorage('litflow_mock_collections', mockCollections);
    return { success: true };
  },

  saveQuote: async (quoteId: string) => {
    await fakeDelay(200);
    const isSaved = mockSavedQuotes.includes(quoteId);
    if (isSaved) {
      mockSavedQuotes = mockSavedQuotes.filter(id => id !== quoteId);
    } else {
      mockSavedQuotes.push(quoteId);
    }
    setStorage('litflow_mock_saved_quotes', mockSavedQuotes);
    return { success: true, saved: !isSaved };
  },

  getSavedQuotes: async () => {
    await fakeDelay(300);
    return mockSavedQuotes;
  },

  getCollectionQuotes: async (collectionId: string) => {
    await fakeDelay(400);
    // Mock: return some random quotes for any collection
    return mockQuotes.slice(0, 3);
  },

  // Reading List
  getReadingList: async () => {
    await fakeDelay(300);
    return mockReadingList;
  },

  updateReadingStatus: async (bookId: string, status: 'want_to_read' | 'currently_reading' | 'finished') => {
    await fakeDelay(300);
    const book = initialBooks.find(b => b.id === bookId);
    const existing = mockReadingList.find(e => e.book_id === bookId);
    
    if (existing) {
      mockReadingList = mockReadingList.map(e => 
        e.book_id === bookId ? { ...e, status } : e
      );
    } else {
      mockReadingList.push({
        user_id: 'mock-user-id',
        book_id: bookId,
        status,
        book_title: book?.title,
        book_author: book?.author,
        book_cover: book?.cover_url,
        created_at: new Date().toISOString()
      });
    }
    setStorage('litflow_mock_reading_list', mockReadingList);
    return { success: true };
  },

  // Notifications
  getNotifications: async () => {
    await fakeDelay(200);
    return mockNotifications;
  },

  // Books
  getBooks: async () => {
    await fakeDelay(400);
    return initialBooks;
  },

  // Affiliate Clicks
  trackClick: async (bookId: string, platform: string) => {
    await fakeDelay(100);
    console.log(`Tracked click for book ${bookId} on ${platform}`);
    return { success: true };
  }
};

