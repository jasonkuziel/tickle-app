# Tickle App - Setup Guide

A complete production-ready Next.js 14 social tickling app with Prisma ORM, NextAuth.js v5, and Vercel Postgres.

## Prerequisites

- Node.js 18+
- A GitHub account (for pushing code)
- A Vercel account (for deployment)
- Google OAuth credentials (optional, for social login)
- GitHub OAuth credentials (optional, for social login)

## Local Development

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd tickle-app
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and update with your values:

```bash
cp .env.example .env.local
```

For local development, you can use a local PostgreSQL database:

```
POSTGRES_PRISMA_URL="postgresql://postgres:password@localhost:5432/tickle_db"
POSTGRES_URL_NON_POOLING="postgresql://postgres:password@localhost:5432/tickle_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

If using local PostgreSQL:

```bash
# Create database
createdb tickle_db

# Push schema
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Demo Credentials

- Email: `alice@example.com`
- Password: `password123`

Other demo users: bob, charlie, diana, evan (all with password123)

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Tickle app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tickle-app.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Paste your GitHub repo URL
5. Click "Import"

### 3. Set Up Vercel Postgres

1. In Vercel dashboard, go to your project
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Name it "tickle-postgres"
5. Select a region closest to you
6. Click "Create"

Vercel will automatically add these environment variables:
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

### 4. Configure Environment Variables

In Vercel dashboard, go to "Settings" → "Environment Variables" and add:

```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=<generate with openssl rand -base64 32>
```

### 5. Configure Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web Application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-project.vercel.app/api/auth/callback/google`
7. Copy Client ID and Client Secret
8. Add to Vercel environment variables:
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### 6. Configure GitHub OAuth (Optional)

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: `Tickle`
   - Homepage URL: `https://your-project.vercel.app`
   - Authorization callback URL: `https://your-project.vercel.app/api/auth/callback/github`
4. Copy Client ID and Client Secret
5. Add to Vercel environment variables:
   ```
   GITHUB_ID=your-client-id
   GITHUB_SECRET=your-client-secret
   ```

### 7. Deploy

1. Go back to Vercel
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment
4. Wait for deployment to complete

Your app is now live! 🎉

### 8. Initialize Production Database

After deployment, you need to run migrations on the production database:

1. In Vercel, click "Deployments"
2. Click "Function Logs" to open the terminal
3. Or, use Vercel CLI:

```bash
vercel env pull  # Downloads production env vars
npm run db:push   # Pushes schema to production
npm run db:seed   # (Optional) Seeds demo data
```

## Database Schema

### User
- `id` - Unique identifier
- `email` - User email (unique)
- `username` - Username (unique)
- `name` - Display name
- `password` - Hashed password (nullable for OAuth)
- `image` - Avatar URL
- `bio` - User bio
- `createdAt` - Account creation date

### Tickle
- `id` - Unique identifier
- `giverId` - User who gave the tickle
- `receiverId` - User who received the tickle
- `createdAt` - Tickle timestamp

### Cooldown Rules
- Users can tickle each other once per 24 hours
- Cooldown is enforced at the API level in `/api/tickle`

## Features

- ✅ User authentication (Credentials, Google, GitHub)
- ✅ User profiles with bio and avatar
- ✅ Tickle system with 24-hour cooldown
- ✅ Real-time notifications for recent tickles
- ✅ Leaderboard ranking
- ✅ User search with debouncing
- ✅ Recent tickles feed
- ✅ Responsive design with Tailwind CSS
- ✅ Animation effects (wiggle, float)
- ✅ Production-ready error handling

## Project Structure

```
tickle-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth pages layout
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/                      # API routes
│   │   │   ├── auth/
│   │   │   ├── tickle/route.ts
│   │   │   ├── users/search/route.ts
│   │   │   └── leaderboard/route.ts
│   │   ├── dashboard/page.tsx        # Main feed
│   │   ├── profile/[username]/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── search/page.tsx
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── components/                   # React components
│   │   ├── Navbar.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── FeedCard.tsx
│   │   ├── TickleButton.tsx
│   │   ├── LeaderboardWidget.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── db.ts                     # Prisma client singleton
│   │   └── auth.ts                   # NextAuth config
│   └── types/
│       └── next-auth.d.ts            # NextAuth type extensions
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Database seeding script
├── public/                           # Static files
├── .env.example                      # Environment variables template
├── .gitignore
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json
└── SETUP.md                          # This file
```

## Troubleshooting

### Database Connection Issues
- Check that `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` are correct
- For Vercel Postgres, use the URLs provided automatically
- Ensure non-pooling URL is used for migrations (Vercel requirement)

### OAuth Not Working
- Verify redirect URLs match exactly (including protocol and path)
- Check that Client ID and Secret are correct
- Clear browser cookies and try again

### Cooldown Not Working
- Ensure database timezone is UTC
- Check that tickle creation timestamps are being saved correctly

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `npm run build`
- Check Node.js version (18+)

## API Documentation

### POST /api/auth/register
Create a new user account.

**Request:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "username": "alice",
  "password": "password123"
}
```

### POST /api/tickle
Send a tickle to another user.

**Request:**
```json
{
  "receiverId": "user-id"
}
```

**Response:**
```json
{
  "message": "Tickled successfully!",
  "count": 5
}
```

### GET /api/users/search?q=alice
Search for users.

**Response:**
```json
{
  "users": [
    {
      "id": "user-id",
      "name": "Alice",
      "username": "alice",
      "image": "https://...",
      "tickleCount": 5
    }
  ]
}
```

### GET /api/leaderboard
Get top 20 users by tickle count.

**Response:**
```json
{
  "users": [
    {
      "rank": 1,
      "id": "user-id",
      "name": "Alice",
      "username": "alice",
      "image": "https://...",
      "tickleCount": 5
    }
  ]
}
```

## Performance Tips

1. **Image Optimization**: Use Next.js Image component (already in place)
2. **Database Indexing**: Indexes on foreign keys and createdAt (already in schema)
3. **Query Caching**: Use revalidateTag() for ISR where appropriate
4. **Load Testing**: Test with Artillery or K6 before production launch

## Security Considerations

- ✅ Passwords hashed with bcryptjs
- ✅ JWT sessions with NEXTAUTH_SECRET
- ✅ CSRF protection via NextAuth
- ✅ Rate limiting at API level (cooldown)
- ✅ Input validation on all endpoints
- ✅ SQL injection protection via Prisma ORM

## License

MIT

## Support

For issues or questions, check the code comments or open a GitHub issue.

Happy tickling! 🤣
