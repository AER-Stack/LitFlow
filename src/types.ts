export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  stats: {
    quotes: number;
    followers: number;
    following: number;
  };
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  year: number;
  genres: string[];
  synopsis: string;
  buyLink: string;
}

export interface Quote {
  id: string;
  text: string;
  bookId: string;
  userId?: string; // If community post
  isCurated: boolean;
  likes: number;
  comments: number;
  timestamp: string;
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
