import Image from 'next/image';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ name = 'User', image, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-24 h-24 text-2xl',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = [
    'bg-blue-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-indigo-500',
  ];

  const colorIndex = (name?.charCodeAt(0) ?? 0) % colors.length;

  if (image) {
    return (
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden flex-shrink-0`}>
        <Image
          src={image}
          alt={name || 'User'}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
    >
      {getInitials(name || 'User')}
    </div>
  );
}
