import { User } from '../types';

const API_BASE_URL = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('litflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth
  register: async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Registration failed');
    }
    return res.json();
  },

  login: async (credentials: any) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Login failed');
    }
    return res.json();
  },

  // Quotes
  getQuotes: async (filter?: string, page = 1, limit = 10, genre?: string, author?: string, search?: string, sortBy?: string) => {
    try {
      const query = new URLSearchParams({ 
        ...(filter ? { filter } : {}),
        ...(genre ? { genre } : {}),
        ...(author ? { author } : {}),
        ...(search ? { search } : {}),
        ...(sortBy ? { sortBy } : {}),
        page: page.toString(),
        limit: limit.toString()
      });
      const res = await fetch(`${API_BASE_URL}/quotes?${query}`, {
        headers: getHeaders(),
      });
      if (!res.ok) return { quotes: [] };
      const data = await res.json();
      return data && data.quotes ? data : { quotes: [] };
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return { quotes: [] };
    }
  },

  createQuote: async (quoteData: any) => {
    const res = await fetch(`${API_BASE_URL}/quotes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(quoteData),
    });
    return res.json();
  },

  likeQuote: async (quoteId: string) => {
    const res = await fetch(`${API_BASE_URL}/quotes/${quoteId}/like`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  commentOnQuote: async (quoteId: string, content: string) => {
    const res = await fetch(`${API_BASE_URL}/quotes/${quoteId}/comment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content }),
    });
    return res.json();
  },
  
  trackShare: async (quoteId: string, platform: string) => {
    const res = await fetch(`${API_BASE_URL}/quotes/${quoteId}/share`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ platform }),
    });
    return res.json();
  },

  getComments: async (quoteId: string) => {
    const res = await fetch(`${API_BASE_URL}/quotes/${quoteId}/comments`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  // Users
  getUserProfile: async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  getUserLikes: async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${userId}/likes`, {
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    } catch (error) {
      console.error('Error fetching user likes:', error);
      return [];
    }
  },

  followUser: async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to follow user');
    }
    return res.json();
  },

  unfollowUser: async (userId: string) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/unfollow`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to unfollow user');
    }
    return res.json();
  },

  updateProfile: async (userId: string, updates: Partial<User>) => {
    const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    return res.json();
  },

  // Collections
  getCollections: async () => {
    const res = await fetch(`${API_BASE_URL}/collections`, {
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  createCollection: async (name: string, emoji?: string) => {
    const res = await fetch(`${API_BASE_URL}/collections`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, emoji }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create collection');
    }
    return res.json();
  },

  saveQuoteToCollection: async (collectionId: string, quoteId: string) => {
    const res = await fetch(`${API_BASE_URL}/collections/${collectionId}/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ quoteId }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to save to collection');
    }
    return res.json();
  },

  getCollectionQuotes: async (collectionId: string) => {
    const res = await fetch(`${API_BASE_URL}/collections/${collectionId}/quotes`, {
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  // Reading List
  getReadingList: async () => {
    const res = await fetch(`${API_BASE_URL}/reading-list`, {
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  updateReadingStatus: async (bookId: string, status: string) => {
    const res = await fetch(`${API_BASE_URL}/reading-list`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ bookId, status }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update reading status');
    }
    return res.json();
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  // Books
  getBooks: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  // Affiliate Clicks
  trackClick: async (bookId: string, platform: string) => {
    const res = await fetch(`${API_BASE_URL}/clicks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ bookId, platform }),
    });
    return res.json();
  }
};
