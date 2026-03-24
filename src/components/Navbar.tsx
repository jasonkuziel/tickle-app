import { auth, signOut } from '@/lib/auth';
import Link from 'next/link';
import { UserAvatar } from './UserAvatar';

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={session ? '/dashboard' : '/'} className="flex items-center gap-2 font-bold text-2xl text-fb-blue hover:opacity-80 transition-opacity">
            <span>🤣</span>
            <span>Tickle</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {session ? (
              <>
                {/* User menu */}
                <div className="flex items-center gap-2 pl-6 border-l border-gray-200">
                  <div className="text-sm font-medium text-gray-800">{session.user?.name}</div>
                  <div className="relative group cursor-pointer">
                    <UserAvatar
                      name={session.user?.name || 'User'}
                      image={session.user?.image}
                      size="sm"
                    />
                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <Link
                        href={`/profile/${session.user?.username}`}
                        className="block px-4 py-2 text-sm text-gray-800 hover:bg-fb-light-gray first:rounded-t-lg"
                      >
                        View Profile
                      </Link>
                      <form
                        action={async () => {
                          'use server';
                          await signOut();
                        }}
                        className="w-full"
                      >
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-fb-light-gray last:rounded-b-lg"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-fb-blue font-semibold hover:opacity-80 transition-opacity">
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-fb-blue text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
