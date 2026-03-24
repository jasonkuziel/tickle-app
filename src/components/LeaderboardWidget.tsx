import Link from 'next/link';
import { prisma } from '@/lib/db';
import { UserAvatar } from './UserAvatar';

export async function LeaderboardWidget() {
  const topUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
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
    take: 5,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span>🏆</span>
        Leaderboard
      </h3>

      <div className="space-y-3">
        {topUsers.map((user, index) => (
          <Link
            key={user.id}
            href={`/profile/${user.username}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-fb-light-gray transition-colors group"
          >
            <div className="text-lg font-bold text-gray-600 w-6 text-center">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${index + 1}`}
            </div>
            <UserAvatar name={user.name || 'User'} image={user.image} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate group-hover:text-fb-blue transition-colors">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">@{user.username}</div>
            </div>
            <div className="text-sm font-bold text-fb-blue whitespace-nowrap">
              {user.ticklesReceived.length}
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/leaderboard"
        className="block text-center mt-4 text-sm text-fb-blue font-semibold hover:opacity-80 transition-opacity py-2 border-t border-gray-200"
      >
        See full leaderboard
      </Link>
    </div>
  );
}
