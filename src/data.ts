import { Book, User, Quote, Challenge, Author } from './types';

export const books: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://picsum.photos/seed/gatsby/400/600',
    rating: 4.5,
    year: 1925,
    genres: ['Classic', 'Fiction', 'Jazz Age'],
    synopsis: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    buyLink: 'https://bookshop.org/search?keywords=The+Great+Gatsby'
  },
  {
    id: '2',
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    cover: 'https://picsum.photos/seed/addie/400/600',
    rating: 4.8,
    year: 2020,
    genres: ['Fantasy', 'Historical', 'Romance'],
    synopsis: 'A life no one will remember. A story you will never forget.',
    buyLink: 'https://bookshop.org/search?keywords=Addie+LaRue'
  },
  {
    id: '3',
    title: 'Circe',
    author: 'Madeline Miller',
    cover: 'https://picsum.photos/seed/circe/400/600',
    rating: 4.7,
    year: 2018,
    genres: ['Mythology', 'Fantasy', 'Fiction'],
    synopsis: 'In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born.',
    buyLink: 'https://bookshop.org/search?keywords=Circe'
  },
  {
    id: '4',
    title: 'Normal People',
    author: 'Sally Rooney',
    cover: 'https://picsum.photos/seed/normal/400/600',
    rating: 4.2,
    year: 2018,
    genres: ['Contemporary', 'Romance', 'Literary Fiction'],
    synopsis: 'Connell and Marianne grow up in the same small town in the west of Ireland, but the similarities end there.',
    buyLink: 'https://bookshop.org/search?keywords=Normal+People'
  },
  {
    id: '5',
    title: 'The Secret History',
    author: 'Donna Tartt',
    cover: 'https://picsum.photos/seed/secret/400/600',
    rating: 4.6,
    year: 1992,
    genres: ['Dark Academia', 'Mystery', 'Fiction'],
    synopsis: 'Under the influence of their charismatic classics professor, a group of clever, eccentric misfits at an elite New England college discover a way of thinking and living that is a world away from the humdrum existence of their contemporaries.',
    buyLink: 'https://bookshop.org/search?keywords=The+Secret+History'
  },
  {
    id: '6',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    cover: 'https://picsum.photos/seed/achilles/400/600',
    rating: 4.9,
    year: 2011,
    genres: ['Mythology', 'Romance', 'Historical'],
    synopsis: 'A thrilling, profound, and deeply moving retelling of the epic Battle of Troy and the relationship between Achilles and Patroclus.',
    buyLink: 'https://bookshop.org/search?keywords=Song+of+Achilles'
  },
  {
    id: '7',
    title: 'A Little Life',
    author: 'Hanya Yanagihara',
    cover: 'https://picsum.photos/seed/littlelife/400/600',
    rating: 4.4,
    year: 2015,
    genres: ['Contemporary', 'Literary Fiction', 'Drama'],
    synopsis: 'A Little Life follows four college classmates—broke, adrift, and buoyed only by their friendship and ambition—as they move to New York in search of fortune and fame.',
    buyLink: 'https://bookshop.org/search?keywords=A+Little+Life'
  },
  {
    id: '8',
    title: 'Bunny',
    author: 'Mona Awad',
    cover: 'https://picsum.photos/seed/bunny/400/600',
    rating: 4.1,
    year: 2019,
    genres: ['Horror', 'Dark Academia', 'Satire'],
    synopsis: 'Samantha Heather Mackey is an outsider in her small, highly selective MFA program at Warren University.',
    buyLink: 'https://bookshop.org/search?keywords=Bunny+Mona+Awad'
  }
];

export const users: User[] = [
  {
    id: 'u1',
    name: 'Elara V.',
    handle: '@elarav',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elara',
    bio: 'Lost in the pages of history. Dark Academia enthusiast. 🕯️',
    stats: { quotes: 42, followers: 1200, following: 350 }
  },
  {
    id: 'u2',
    name: 'Julian Thorne',
    handle: '@jthorne',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian',
    bio: 'Classics major. Coffee and Homer.',
    stats: { quotes: 15, followers: 450, following: 200 }
  },
  {
    id: 'u3',
    name: 'Maya Reed',
    handle: '@mayareads',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    bio: 'Contemporary romance is my therapy.',
    stats: { quotes: 89, followers: 2300, following: 800 }
  },
  {
    id: 'u4',
    name: 'Silas Vance',
    handle: '@silasv',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Silas',
    bio: 'Gothic literature and rainy days.',
    stats: { quotes: 24, followers: 890, following: 120 }
  },
  {
    id: 'u5',
    name: 'Clara Belle',
    handle: '@clara_reads',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara',
    bio: 'Fantasy world-builder and quote collector.',
    stats: { quotes: 56, followers: 1500, following: 600 }
  }
];

export const quotes: Quote[] = [
  {
    id: 'q1',
    text: 'So we beat on, boats against the current, borne back ceaselessly into the past.',
    bookId: '1',
    isCurated: true,
    likes: 1240,
    comments: 89,
    timestamp: '2h ago'
  },
  {
    id: 'q2',
    text: 'What is a person, if not the marks they leave behind?',
    bookId: '2',
    userId: 'u2',
    isCurated: false,
    likes: 850,
    comments: 45,
    timestamp: '4h ago'
  },
  {
    id: 'q3',
    text: 'I will not be a story in your head. I will be the person who writes it.',
    bookId: '3',
    isCurated: true,
    likes: 2100,
    comments: 120,
    timestamp: '1d ago'
  },
  {
    id: 'q4',
    text: 'It’s not like I’m a different person. I’m just the same person, but I’m not the same.',
    bookId: '4',
    userId: 'u3',
    isCurated: false,
    likes: 670,
    comments: 32,
    timestamp: '6h ago'
  },
  {
    id: 'q5',
    text: 'Beauty is terror. Whatever we call beautiful, we quiver before it.',
    bookId: '5',
    isCurated: true,
    likes: 3400,
    comments: 210,
    timestamp: '2d ago'
  },
  {
    id: 'q6',
    text: 'I could recognize him by touch alone, by smell; I would know him blind, by the way his breaths came and his feet struck the earth.',
    bookId: '6',
    userId: 'u5',
    isCurated: false,
    likes: 4500,
    comments: 340,
    timestamp: '12h ago'
  },
  {
    id: 'q7',
    text: 'Things get broken, and sometimes they get repaired, and in most cases, you realize that no matter what gets damaged, life rearranges itself to compensate for your loss, sometimes wonderfully.',
    bookId: '7',
    isCurated: true,
    likes: 1800,
    comments: 95,
    timestamp: '3d ago'
  },
  {
    id: 'q8',
    text: 'We were the Bunnies. We were the girls who didn’t belong.',
    bookId: '8',
    userId: 'u4',
    isCurated: false,
    likes: 920,
    comments: 56,
    timestamp: '18h ago'
  },
  {
    id: 'q9',
    text: 'He was my friend, and I loved him, and I would have done anything for him.',
    bookId: '6',
    isCurated: true,
    likes: 2800,
    comments: 150,
    timestamp: '4d ago'
  },
  {
    id: 'q10',
    text: 'I am a creature of the night. I am a ghost in the machine.',
    bookId: '5',
    userId: 'u1',
    isCurated: false,
    likes: 310,
    comments: 12,
    timestamp: '1h ago'
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
