export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  following?: string[];
  stats?: {
    quotes: number;
    likes: number;
    books_completed?: number;
    currently_reading?: number;
  };
  followedAuthors: string[];
  preferredGenres: string[];
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  emoji?: string;
  quotes_count?: number;
  created_at: string;
}

export interface ReadingListEntry {
  user_id: string;
  book_id: string;
  status: 'want_to_read' | 'currently_reading' | 'finished';
  book_title?: string;
  book_author?: string;
  book_cover?: string;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  rating?: number;
  year: number;
  genres: string[];
  synopsis: string;
  buyLink?: string;
  isbn?: string;
  publisher?: string;
}

export interface Quote {
  id: string;
  content: string;
  book_id: string;
  user_id: string;
  is_curated: boolean;
  created_at: string;
  username?: string;
  avatar_url?: string;
  book_title?: string;
  book_author?: string;
  book_cover?: string;
  likes_count?: number;
  comments_count?: number;
  shares_count?: number;
  score?: number;
}

export interface Challenge {
  id: string;
  title: string;
  progress: number;
  participants: number;
  image: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  isVerified: boolean;
  image: string;
}

export interface Comment {
  id: string;
  quoteId: string;
  userId: string;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Activity {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'comment_like';
  targetId: string;
  timestamp: string;
  details?: string;
}

export interface Notification {
  id: string;
  userId: string;
  actorId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'comment_like';
  targetId?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}
