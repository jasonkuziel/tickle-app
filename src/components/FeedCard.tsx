import Link from 'next/link';
import { UserAvatar } from './UserAvatar';

interface FeedCardProps {
  giverName: string;
  giverUsername: string;
  giverImage: string | null;
  receiverName: string;
  receiverUsername: string;
  receiverImage: string | null;
  createdAt: Date;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export function FeedCard({
  giverName,
  giverUsername,
  giverImage,
  receiverName,
  receiverUsername,
  receiverImage,
  createdAt,
}: FeedCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Link href={`/profile/${giverUsername}`}>
          <UserAvatar name={giverName} image={giverImage} size="md" />
        </Link>

        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-900">
            <Link href={`/profile/${giverUsername}`} className="hover:text-fb-blue transition-colors">
              {giverName}
            </Link>
            <span className="mx-1 text-gray-600">tickled</span>
            <Link href={`/profile/${receiverUsername}`} className="hover:text-fb-blue transition-colors">
              {receiverName}
            </Link>
            <span className="ml-1">🤣</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">{formatTimeAgo(createdAt)}</div>
        </div>

        <Link href={`/profile/${receiverUsername}`}>
          <UserAvatar name={receiverName} image={receiverImage} size="md" />
        </Link>
      </div>
    </div>
  );
}
