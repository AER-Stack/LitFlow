import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const isProduction = process.env.NODE_ENV === 'production';
const hasDbUrl = !!process.env.DATABASE_URL;

let pool: any;

if (hasDbUrl) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });

  pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
  });

  // Initialize database schema
  const initDb = async () => {
    try {
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS following TEXT[] DEFAULT \'{}\'');
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_genres TEXT[] DEFAULT \'{}\'');
      await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS followed_authors TEXT[] DEFAULT \'{}\'');
      
      // Collections table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS collections (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          name VARCHAR(100) NOT NULL,
          emoji VARCHAR(10),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Collection Quotes junction table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS collection_quotes (
          collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
          quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (collection_id, quote_id)
        )
      `);

      // Reading List table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS reading_list (
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          book_id UUID REFERENCES books(id) ON DELETE CASCADE,
          status VARCHAR(50) NOT NULL, -- 'want_to_read', 'currently_reading', 'finished'
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (user_id, book_id)
        )
      `);

      // Notifications table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
          type VARCHAR(50) NOT NULL, -- 'like', 'comment', 'follow', 'mention', 'comment_like'
          target_id UUID,
          text TEXT NOT NULL,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('Database schema initialized');
    } catch (err) {
      console.error('Error initializing database schema', err);
    }
  };
  initDb();

  pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
  });
} else {
  console.warn('DATABASE_URL not found. Running in mock mode with dummy data.');
}

// Mock data for fallback
const mockData: any = {
  users: [
    { 
      id: '1', 
      username: 'bookworm', 
      email: 'bookworm@example.com', 
      password: '$2a$10$X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78', // mock hash for 'password123'
      avatar_url: 'https://picsum.photos/seed/user1/200', 
      bio: 'I love reading!',
      followed_authors: [],
      preferred_genres: [],
      following: ['2']
    },
    { 
      id: '2', 
      username: 'lit_lover', 
      email: 'lit@example.com', 
      password: '$2a$10$X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78X78',
      avatar_url: 'https://picsum.photos/seed/user2/200', 
      bio: 'Literature is life.',
      followed_authors: [],
      preferred_genres: [],
      following: []
    }
  ],
  quotes: [
    { id: '1', content: 'The only way to do great work is to love what you do.', book_id: '1', user_id: '1', is_curated: true, created_at: new Date() },
    { id: '2', content: 'Stay hungry, stay foolish.', book_id: '2', user_id: '1', is_curated: false, created_at: new Date() }
  ],
  books: [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover_url: 'https://picsum.photos/seed/gatsby/200/300' },
    { id: '2', title: '1984', author: 'George Orwell', cover_url: 'https://picsum.photos/seed/1984/200/300' }
  ],
  likes: [],
  comments: []
};

export const query = async (text: string, params?: any[]) => {
  if (hasDbUrl) {
    return pool.query(text, params);
  }

  // Very basic mock query logic for demonstration
  console.log('Mock Query:', text, params);
  
  if (text.includes('SELECT') && text.includes('FROM users') && text.includes('WHERE id = $1')) {
    const user = mockData.users.find((u: any) => u.id == params?.[0]);
    return { rows: user ? [user] : [] };
  }

  if (text.includes('SELECT') && text.includes('FROM users') && text.includes('WHERE email = $1')) {
    const user = mockData.users.find((u: any) => u.email === params?.[0]);
    return { rows: user ? [user] : [] };
  }

  if (text.includes('INSERT INTO users')) {
    const [username, email, password, avatar_url, bio] = params || [];
    const newUser = {
      id: (mockData.users.length + 1).toString(),
      username,
      email,
      password,
      avatar_url,
      bio,
      followedAuthors: [],
      preferredGenres: [],
      created_at: new Date()
    };
    mockData.users.push(newUser);
    return { rows: [newUser] };
  }

  if (text.includes('SELECT') && text.includes('FROM users') && text.includes('WHERE username = $1 AND id != $2')) {
    const [username, id] = params || [];
    const user = mockData.users.find((u: any) => u.username === username && u.id != id);
    return { rows: user ? [user] : [] };
  }

  if (text.includes('UPDATE users')) {
    const [username, bio, avatar_url, id] = params || [];
    console.log('Mock Update User:', { id, username, bio, avatar_url });
    const userIndex = mockData.users.findIndex((u: any) => u.id == id);
    console.log('User Index found:', userIndex);
    if (userIndex === -1) {
      console.log('Available User IDs:', mockData.users.map((u: any) => u.id));
      return { rows: [] };
    }

    const user = mockData.users[userIndex];
    const updatedUser = {
      ...user,
      username: username || user.username,
      bio: bio || user.bio,
      avatar_url: avatar_url || user.avatar_url
    };
    mockData.users[userIndex] = updatedUser;
    return { rows: [updatedUser] };
  }

  if (text.includes('SELECT following, preferred_genres, followed_authors FROM users WHERE id = $1')) {
    const [id] = params || [];
    const user = mockData.users.find((u: any) => u.id == id);
    return { rows: user ? [{ 
      following: user.following || [], 
      preferred_genres: user.preferred_genres || [], 
      followed_authors: user.followed_authors || [] 
    }] : [] };
  }

  if (text.includes('SELECT following FROM users WHERE id = $1')) {
    const [id] = params || [];
    const user = mockData.users.find((u: any) => u.id == id);
    return { rows: user ? [{ following: user.following || [] }] : [] };
  }

  if (text.includes('SELECT COUNT(*) FROM quotes')) {
    let filtered = [...mockData.quotes];
    if (text.includes('is_curated = true')) filtered = filtered.filter((q: any) => q.is_curated);
    if (text.includes('is_curated = false')) filtered = filtered.filter((q: any) => !q.is_curated);
    if (text.includes('user_id = ANY')) {
      const following = params?.[0] || [];
      filtered = filtered.filter((q: any) => following.includes(q.user_id));
    }
    return { rows: [{ count: filtered.length.toString() }] };
  }

  if (text.includes('SELECT') && text.includes('FROM quotes')) {
    let filtered = [...mockData.quotes];
    if (text.includes('is_curated = true')) filtered = filtered.filter((q: any) => q.is_curated);
    if (text.includes('is_curated = false')) filtered = filtered.filter((q: any) => !q.is_curated);
    if (text.includes('user_id = ANY')) {
      const following = params?.[0] || [];
      filtered = filtered.filter((q: any) => following.includes(q.user_id));
    }

    return { rows: filtered.map((q: any) => ({
      ...q,
      username: mockData.users.find((u: any) => u.id == q.user_id)?.username || 'bookworm',
      avatar_url: mockData.users.find((u: any) => u.id == q.user_id)?.avatar_url || 'https://picsum.photos/seed/user1/200',
      book_title: mockData.books.find((b: any) => b.id == q.book_id)?.title || 'Mock Book',
      book_author: mockData.books.find((b: any) => b.id == q.book_id)?.author || 'Mock Author',
      book_cover: mockData.books.find((b: any) => b.id == q.book_id)?.cover_url || 'https://picsum.photos/seed/mock/200/300',
      likes_count: 0,
      comments_count: 0
    })) };
  }

  if (text.includes('SELECT') && text.includes('FROM books')) {
    return { rows: mockData.books };
  }

  if (text.includes('INSERT INTO books')) {
    const [title, author] = params || [];
    const newBook = {
      id: (mockData.books.length + 1).toString(),
      title,
      author,
      cover_url: `https://picsum.photos/seed/book${mockData.books.length + 1}/200/300`
    };
    mockData.books.push(newBook);
    return { rows: [newBook] };
  }

  if (text.includes('INSERT INTO quotes')) {
    const [content, book_id, user_id, is_curated] = params || [];
    const newQuote = {
      id: (mockData.quotes.length + 1).toString(),
      content,
      book_id,
      user_id,
      is_curated: !!is_curated,
      created_at: new Date()
    };
    mockData.quotes.push(newQuote);
    return { rows: [newQuote] };
  }

  if (text.includes('SELECT * FROM likes WHERE user_id = $1 AND quote_id = $2')) {
    const [user_id, quote_id] = params || [];
    const like = mockData.likes.find((l: any) => l.user_id == user_id && l.quote_id == quote_id);
    return { rows: like ? [like] : [] };
  }

  if (text.includes('INSERT INTO likes')) {
    const [user_id, quote_id] = params || [];
    const newLike = { user_id, quote_id };
    mockData.likes.push(newLike);
    return { rows: [newLike] };
  }

  if (text.includes('DELETE FROM likes')) {
    const [user_id, quote_id] = params || [];
    mockData.likes = mockData.likes.filter((l: any) => !(l.user_id == user_id && l.quote_id == quote_id));
    return { rows: [] };
  }

  if (text.includes('INSERT INTO comments')) {
    const [user_id, quote_id, content] = params || [];
    const newComment = {
      id: (mockData.comments.length + 1).toString(),
      user_id,
      quote_id,
      content,
      created_at: new Date()
    };
    mockData.comments.push(newComment);
    return { rows: [newComment] };
  }

  if (text.includes('SELECT c.*, u.username, u.avatar_url') && text.includes('FROM comments c')) {
    const [id_or_quote_id] = params || [];
    const isById = text.includes('c.id = $1');
    
    let results = [];
    if (isById) {
      const comment = mockData.comments.find((c: any) => c.id == id_or_quote_id);
      if (comment) {
        const user = mockData.users.find((u: any) => u.id == comment.user_id);
        results.push({
          ...comment,
          username: user?.username || 'unknown',
          avatar_url: user?.avatar_url || ''
        });
      }
    } else {
      results = mockData.comments
        .filter((c: any) => c.quote_id == id_or_quote_id)
        .map((c: any) => {
          const user = mockData.users.find((u: any) => u.id == c.user_id);
          return {
            ...c,
            username: user?.username || 'unknown',
            avatar_url: user?.avatar_url || ''
          };
        });
    }
    return { rows: results };
  }

  if (text.includes('SELECT q.*, u.username, u.avatar_url, b.title as book_title') && text.includes('FROM quotes q')) {
    const [id] = params || [];
    const quote = mockData.quotes.find((q: any) => q.id == id);
    if (quote) {
      const user = mockData.users.find((u: any) => u.id == quote.user_id);
      const book = mockData.books.find((b: any) => b.id == quote.book_id);
      return { rows: [{
        ...quote,
        username: user?.username || 'unknown',
        avatar_url: user?.avatar_url || '',
        book_title: book?.title || 'Unknown Book',
        book_author: book?.author || 'Unknown Author',
        book_cover: book?.cover_url || '',
        likes_count: mockData.likes.filter((l: any) => l.quote_id == quote.id).length,
        comments_count: mockData.comments.filter((c: any) => c.quote_id == quote.id).length
      }] };
    }
    return { rows: [] };
  }

  return { rows: [] };
};

export default pool;
