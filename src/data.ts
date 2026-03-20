import { Book, User, Quote, Challenge, Author } from './types';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover_url: 'https://picsum.photos/seed/gatsby/400/600',
    year: 1925,
    genres: ['Classic', 'Fiction', 'Jazz Age'],
    synopsis: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
  },
  {
    id: '2',
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    cover_url: 'https://picsum.photos/seed/addie/400/600',
    year: 2020,
    genres: ['Fantasy', 'Historical', 'Romance'],
    synopsis: 'A life no one will remember. A story you will never forget.',
  },
  {
    id: '3',
    title: 'Circe',
    author: 'Madeline Miller',
    cover_url: 'https://picsum.photos/seed/circe/400/600',
    year: 2018,
    genres: ['Mythology', 'Fantasy', 'Fiction'],
    synopsis: 'In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born.',
  },
  {
    id: '4',
    title: 'Normal People',
    author: 'Sally Rooney',
    cover_url: 'https://picsum.photos/seed/normal/400/600',
    year: 2018,
    genres: ['Contemporary', 'Romance', 'Literary Fiction'],
    synopsis: 'Connell and Marianne grow up in the same small town in the west of Ireland, but the similarities end there.',
  },
  {
    id: '5',
    title: 'The Secret History',
    author: 'Donna Tartt',
    cover_url: 'https://picsum.photos/seed/secret/400/600',
    year: 1992,
    genres: ['Dark Academia', 'Mystery', 'Fiction'],
    synopsis: 'Under the influence of their charismatic classics professor, a group of clever, eccentric misfits at an elite New England college discover a way of thinking and living that is a world away from the humdrum existence of their contemporaries.',
  },
  {
    id: '6',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    cover_url: 'https://picsum.photos/seed/achilles/400/600',
    year: 2011,
    genres: ['Mythology', 'Romance', 'Historical'],
    synopsis: 'A thrilling, profound, and deeply moving retelling of the epic Battle of Troy and the relationship between Achilles and Patroclus.',
  },
  {
    id: '7',
    title: 'A Little Life',
    author: 'Hanya Yanagihara',
    cover_url: 'https://picsum.photos/seed/littlelife/400/600',
    year: 2015,
    genres: ['Contemporary', 'Literary Fiction', 'Drama'],
    synopsis: 'A Little Life follows four college classmates—broke, adrift, and buoyed only by their friendship and ambition—as they move to New York in search of fortune and fame.',
  },
  {
    id: '8',
    title: 'Bunny',
    author: 'Mona Awad',
    cover_url: 'https://picsum.photos/seed/bunny/400/600',
    year: 2019,
    genres: ['Horror', 'Dark Academia', 'Satire'],
    synopsis: 'Samantha Heather Mackey is an outsider in her small, highly selective MFA program at Warren University.',
  }
];

export const users: User[] = [
  {
    id: 'u1',
    username: 'Elara V.',
    email: 'elara@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara',
    bio: 'Lost in the pages of history. Dark Academia enthusiast. 🕯️',
    created_at: new Date().toISOString(),
    stats: { quotes: 42, likes: 350 },
    following: ['u2'],
    followedAuthors: ['Madeline Miller'],
    preferredGenres: ['Dark Academia', 'Classic', 'Fiction']
  },
  {
    id: 'u2',
    username: 'Julian Thorne',
    email: 'julian@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
    bio: 'Classics major. Coffee and Homer.',
    created_at: new Date().toISOString(),
    stats: { quotes: 15, likes: 200 },
    following: ['u1'],
    followedAuthors: ['F. Scott Fitzgerald'],
    preferredGenres: ['Classic', 'Fiction']
  },
  {
    id: 'u3',
    username: 'Maya Reed',
    email: 'maya@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    bio: 'Contemporary romance is my therapy.',
    created_at: new Date().toISOString(),
    stats: { quotes: 89, likes: 800 },
    followedAuthors: ['Madeline Miller', 'Sally Rooney'],
    preferredGenres: ['Contemporary', 'Romance']
  },
  {
    id: 'u4',
    username: 'Silas Vance',
    email: 'silas@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Silas',
    bio: 'Gothic literature and rainy days.',
    created_at: new Date().toISOString(),
    stats: { quotes: 24, likes: 120 },
    followedAuthors: ['Mona Awad'],
    preferredGenres: ['Horror', 'Dark Academia', 'Gothic']
  },
  {
    id: 'u5',
    username: 'Clara Belle',
    email: 'clara@example.com',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara',
    bio: 'Fantasy world-builder and quote collector.',
    created_at: new Date().toISOString(),
    stats: { quotes: 56, likes: 600 },
    followedAuthors: ['Madeline Miller', 'V.E. Schwab'],
    preferredGenres: ['Fantasy', 'Mythology']
  }
];

export const quotes: Quote[] = [
  {
    id: 'q1',
    content: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    book_id: '1',
    user_id: 'u1',
    is_curated: true,
    likes_count: 1240,
    comments_count: 89,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q2',
    content: 'What is a person, if not the marks they leave behind?',
    book_id: '2',
    user_id: 'u2',
    is_curated: false,
    likes_count: 850,
    comments_count: 45,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q3',
    content: 'I will not be a story in your head. I will be the person who writes it.',
    book_id: '3',
    user_id: 'u5',
    is_curated: true,
    likes_count: 2100,
    comments_count: 120,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q4',
    content: 'It’s not like I’m a different person. I’m just the same person, but I’m not the same.',
    book_id: '4',
    user_id: 'u3',
    is_curated: false,
    likes_count: 670,
    comments_count: 32,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q5',
    content: 'Beauty is terror. Whatever we call beautiful, we quiver before it.',
    book_id: '5',
    user_id: 'u4',
    is_curated: true,
    likes_count: 3400,
    comments_count: 210,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q6',
    content: 'I could recognize him by touch alone, by smell; I would know him blind, by the way his breaths came and his feet struck the earth.',
    book_id: '6',
    user_id: 'u5',
    is_curated: false,
    likes_count: 4500,
    comments_count: 340,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q7',
    content: 'Things get broken, and sometimes they get repaired, and in most cases, you realize that no matter what gets damaged, life rearranges itself to compensate for your loss, sometimes wonderfully.',
    book_id: '7',
    user_id: 'u2',
    is_curated: true,
    likes_count: 1800,
    comments_count: 95,
    created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q8',
    content: 'We were the Bunnies. We were the girls who didn’t belong.',
    book_id: '8',
    user_id: 'u4',
    is_curated: false,
    likes_count: 920,
    comments_count: 56,
    created_at: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q9',
    content: 'He was my friend, and I loved him, and I would have done anything for him.',
    book_id: '6',
    user_id: 'u5',
    is_curated: true,
    likes_count: 2800,
    comments_count: 150,
    created_at: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'q10',
    content: 'I am a creature of the night. I am a ghost in the machine.',
    book_id: '5',
    user_id: 'u1',
    is_curated: false,
    likes_count: 310,
    comments_count: 12,
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  }
];

export const challenges: Challenge[] = [
  {
    id: 'c1',
    title: 'The Dark Academia Sprint',
    progress: 65,
    participants: 1240,
    image: 'https://picsum.photos/seed/challenge1/400/200'
  },
  {
    id: 'c2',
    title: 'Mythology Retold',
    progress: 30,
    participants: 850,
    image: 'https://picsum.photos/seed/challenge2/400/200'
  }
];

export const authors: Author[] = [
  {
    id: 'a1',
    name: 'Madeline Miller',
    bio: 'Author of Circe and The Song of Achilles.',
    isVerified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Madeline'
  },
  {
    id: 'a2',
    name: 'V.E. Schwab',
    bio: 'Master of worlds and shadows.',
    isVerified: true,
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Schwab'
  }
];
