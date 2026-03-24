import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { Navbar } from '@/components/Navbar';
import { FeedCard } from '@/components/FeedCard';
import { LeaderboardWidget } from '@/components/LeaderboardWidget';
import { UserAvatar } from '@/components/UserAvatar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch recent tickles
  const recentTickles = await prisma.tickle.findMany({
    include: {
      giver: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  // Fetch recent tickles received by current user (last 24h)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentlyTickled = await prisma.tickle.findMany({
    where: {
      receiverId: session.user.id,
      createdAt: {
        gte: oneDayAgo,
      },
    },
    include: {
      giver: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Get unique users who tickled current user
  const uniqueTicklers = Array.from(
    new Map(
      recentlyTickled.map((t) => [t.giver.username, t.giver])
    ).values()
  );

  return (
    <>
      <Navbar />
      <main className="bg-fb-light-gray min-h-screen pt-6 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
          {/* Left Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-20">
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="block px-4 py-3 text-gray-900 font-semibold bg-fb-light-gray rounded-lg hover:bg-gray-200 transition-colors"
                >
                  🏠 Home
                </Link>
                <Link
                  href={`/profile/${session.user.username}`}
                  className="block px-4 py-3 text-gray-700 hover:bg-fb-light-gray rounded-lg transition-colors"
                >
                  👤 Profile
                </Link>
                <Link
                  href="/leaderboard"
                  className="block px-4 py-3 text-gray-700 hover:bg-fb-light-gray rounded-lg transition-colors"
                >
                  🏆 Leaderboard
                </Link>
                <Link
                  href="/search"
                  className="block px-4 py-3 text-gray-700 hover:bg-fb-light-gray rounded-lg transition-colors"
                >
                  🔍 Search
                </Link>
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <div className="lg:col-span-1 space-y-4">
            {/* Notification Banner */}
            {uniqueTicklers.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-900 font-semibold mb-2">
                  🎉 You've been tickled {recentlyTickled.length} time{recentlyTickled.length !== 1 ? 's' : ''} in the last 24 hours!
                </p>
                <div className="flex flex-wrap gap-2">
                  {uniqueTicklers.map((tickler) => (
                    <Link
                      key={tickler.username}
                      href={`/profile/${tickler.username}`}
                      className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm hover:opacity-80 transition-opacity"
                    >
                      <UserAvatar name={tickler.name || 'User'} image={tickler.image} size="sm" />
                      <span className="font-medium">{tickler.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Feed */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Tickles</h2>
              {recentTickles.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-600 text-lg">No tickles yet. Start tickling friends!</p>
                </div>
              ) : (
                recentTickles.map((tickle) => (
                  <FeedCard
                    key={tickle.id}
                    giverName={tickle.giver.name || 'Unknown'}
                    giverUsername={tickle.giver.username}
                    giverImage={tickle.giver.image}
                    receiverName={tickle.receiver.name || 'Unknown'}
                    receiverUsername={tickle.receiver.username}
                    receiverImage={tickle.receiver.image}
                    createdAt={new Date(tickle.createdAt)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <LeaderboardWidget />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
