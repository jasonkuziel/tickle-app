import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { Navbar } from '@/components/Navbar';
import { UserAvatar } from '@/components/UserAvatar';
import { TickleButton } from '@/components/TickleButton';
import { FeedCard } from '@/components/FeedCard';
import { notFound } from 'next/navigation';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await auth();

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      ticklesReceived: {
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
        take: 20,
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Check cooldown for current user
  let cooldownRemaining: number | null = null;
  if (session?.user?.id && session.user.id !== user.id) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const lastTickle = await prisma.tickle.findFirst({
      where: {
        giverId: session.user.id,
        receiverId: user.id,
        createdAt: {
          gte: oneDayAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (lastTickle) {
      const now = new Date();
      const tickleTime = new Date(lastTickle.createdAt);
      const diffMs = now.getTime() - tickleTime.getTime();
      cooldownRemaining = Math.ceil((24 * 60 * 60 * 1000 - diffMs) / (60 * 60 * 1000));
      cooldownRemaining = Math.max(1, cooldownRemaining);
    }
  }

  const tickleCount = user.ticklesReceived.length;
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <Navbar />
      <main className="bg-fb-light-gray min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-fb-blue via-purple-500 to-pink-500"></div>

          {/* Profile Content */}
          <div className="bg-white px-6 pb-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start -mt-16 mb-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <UserAvatar
                  name={user.name || 'User'}
                  image={user.image}
                  size="lg"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 pt-4">
                <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600 text-lg">@{user.username}</p>
                {user.bio && <p className="text-gray-700 mt-2">{user.bio}</p>}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                  <div>
                    <span className="font-bold text-fb-blue">{tickleCount}</span> tickles received
                  </div>
                  <div>Joined {joinDate}</div>
                </div>
              </div>

              {/* Tickle Button */}
              {session?.user?.id && session.user.id !== user.id && (
                <div className="flex-shrink-0">
                  <TickleButton
                    targetUserId={user.id}
                    targetUsername={user.username}
                    initialTickleCount={tickleCount}
                    cooldownRemaining={cooldownRemaining}
                  />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-b border-gray-200 mb-6"></div>

            {/* Recent Tickles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Tickles</h2>
              {user.ticklesReceived.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No tickles yet. Be the first to tickle!</p>
              ) : (
                <div className="space-y-4">
                  {user.ticklesReceived.map((tickle) => (
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
