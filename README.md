# Tickle 🤣

A Facebook-Poke-style social app built with Next.js 14, Prisma, and Vercel Postgres.

## Features

- **User Authentication**: Sign up with email/password or OAuth (Google, GitHub)
- **Tickle System**: Send tickles to friends with a 24-hour cooldown
- **Profiles**: View user profiles with tickle count and bio
- **Leaderboard**: See who's been tickled the most
- **Search**: Find other users to tickle
- **Real-time Feed**: See recent tickles in your network
- **Notifications**: Get notified when someone tickles you
- **Responsive Design**: Works on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Vercel Postgres
- **Auth**: NextAuth.js v5
- **Password Hashing**: bcryptjs

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Push database schema
npm run db:push

# Seed with demo data
npm run db:seed

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Demo Credentials

- Email: `alice@example.com`
- Password: `password123`

### Production Deployment

See [SETUP.md](./SETUP.md) for detailed deployment instructions to Vercel.

## Project Structure

```
src/
├── app/                    # Next.js pages and API routes
├── components/             # React components
├── lib/                    # Utility functions (auth, db)
└── types/                  # TypeScript definitions
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Demo data
```

## Key Pages

- `/` - Landing page
- `/login` - Sign in
- `/register` - Create account
- `/dashboard` - Main feed
- `/profile/[username]` - User profile
- `/leaderboard` - Top users
- `/search` - Find users

## API Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth handlers
- `POST /api/tickle` - Send a tickle
- `GET /api/users/search` - Search users
- `GET /api/leaderboard` - Get leaderboard

## Development Notes

- All components are fully typed with TypeScript
- Server Components used for data fetching
- Client Components for interactivity
- Real-time animations with Tailwind keyframes
- Form validation on both client and server
- Optimistic UI updates for better UX

## Database Schema

### User
- id, name, email, username, password, image, bio, createdAt
- Relations: accounts, sessions, ticklesGiven, ticklesReceived

### Tickle
- id, giverId, receiverId, createdAt
- Relations: giver (User), receiver (User)
- Cooldown: Max 1 tickle per user pair per 24 hours

### Account, Session, VerificationToken
- Standard NextAuth tables for OAuth and sessions

## Customization

### Colors
Edit `tailwind.config.js` to change the primary color from Facebook blue (#1877f2)

### Demo Users
Edit `prisma/seed.ts` to create different demo users or tickles

### Cooldown Duration
Change the 24-hour cooldown in `src/app/api/tickle/route.ts`

## Performance

- ✅ Image optimization with Next.js Image
- ✅ Database query optimization with Prisma
- ✅ ISR (Incremental Static Regeneration) on feed
- ✅ Debounced search input
- ✅ Lazy loading leaderboard widget

## Security

- ✅ Password hashing with bcryptjs
- ✅ JWT sessions with NEXTAUTH_SECRET
- ✅ CSRF protection via NextAuth
- ✅ SQL injection prevention via Prisma
- ✅ Input validation on all endpoints

## Future Enhancements

- Real-time notifications with WebSockets
- Direct messaging
- User blocking
- Tickle reactions (laughing, surprised, etc.)
- Activity feed filtering
- Mobile app with React Native
- Dark mode

## Troubleshooting

See [SETUP.md](./SETUP.md) for detailed troubleshooting guide.

## License

MIT

## Made with ❤️ and 🤣
