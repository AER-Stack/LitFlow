# LitFlow - Social Literary Platform

LitFlow is a social literary platform where quotes flow like viral content. Discover personalized 'For You' feeds, organize quotes into collections, track your reading list, and connect with fellow bibliophiles.

## Features

- **Personalized Feeds**: 'For You' and 'Trending' tabs to discover new quotes.
- **Quote Collections**: Organize your favorite quotes into custom collections.
- **Reading List**: Track books you want to read, are currently reading, or have finished.
- **Social Interaction**: Like, comment, and share quotes with others.
- **Affiliate Integration**: Buy books directly from Amazon or Bookshop.org with affiliate tracking.
- **Onboarding**: Personalized experience based on your favorite genres.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, PostgreSQL.
- **Database**: PostgreSQL with `pg` library.
- **Authentication**: JWT-based authentication.

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL database

### Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
DATABASE_URL=postgres://username:password@hostname:port/dbname
JWT_SECRET=your_jwt_secret_here
VITE_BOOKSHOP_AFFILIATE_ID=litflow-20
VITE_AMAZON_AFFILIATE_TAG=litflow-20
PORT=3000
NODE_ENV=development
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   Run the SQL commands in `server/schema.sql` against your PostgreSQL database.

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Deployment

### Frontend (Vercel/Netlify)

The frontend is a standard Vite application. You can deploy it by connecting your repository to Vercel or Netlify. Ensure you set the `VITE_` environment variables in your deployment settings.

### Backend (Railway/Heroku)

The backend is an Express server. You can deploy it to Railway or Heroku. Ensure you set the `DATABASE_URL`, `JWT_SECRET`, and `PORT` environment variables.

## Testing Instructions

1. **Onboarding**: Create a new account and complete the onboarding flow. Verify that your bio and preferred genres are saved.
2. **Feeds**: Check the 'For You' and 'Trending' tabs in the Discover view. Verify that infinite scrolling works.
3. **Quotes**: Like, comment, and share a quote. Verify that the counts update correctly.
4. **Collections**: Create a new collection and save a quote to it.
5. **Reading List**: Update the reading status of a book in the Book Detail Modal.
6. **Affiliate Links**: Click on the "Buy on Amazon" or "Buy on Bookshop" buttons. Verify that they open in a new tab and that the click is tracked (check the `clicks` table in the database).

## Maintenance

The project is designed to be modular. You can easily add new features or affiliate programs by following the existing patterns in `src/views`, `src/components`, and `server/routes`.
