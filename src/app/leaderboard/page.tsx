import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { Navbar } from '@/components/Navbar';
import { UserAvatar } from '@/components/UserAvatar';
import Link from 'next/link';

export default async function LeaderboardPage() {
  const session = await auth();

  const leaderboard = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      ticklesReceived: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      ticklesReceived: {
        _count: 'desc',
      },
    },
  });

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <>
      <Navbar />
      <main className="bg-fb-light-gray min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Leaderboard</h1>
            <p className="text-gray-600 text-lg">
              Top ticklers and most tickled users
            </p>
          </div>

          {/* Leaderboard List */}
          <div className="space-y-2">
            {leaderboard.map((user, index) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-fb-blue transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="text-3xl font-bold w-12 text-center">
                    {index < 3 ? medals[index] : `#${index + 1}`}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <UserAvatar
                      name={user.name || 'User'}
                      image={user.image}
                      size="md"
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900">
                      {user.name}
                    </h3>
                    <p className="text-gray-600">@{user.username}</p>
                    {user.bio && (
                      <p className="text-sm text-gray-500 mt-1 truncate">{user.bio}</p>
                    )}
                  </div>

                  {/* Tickle Count */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-fb-blue">
                      {user.ticklesReceived.length}
                    </div>
                    <div className="text-xs text-gray-600">tickles</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {leaderboard.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-lg">
                No users yet. Start tickling to appear on the leaderboard!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
