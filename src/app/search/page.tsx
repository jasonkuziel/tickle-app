'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { UserAvatar } from '@/components/UserAvatar';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  tickleCount: number;
}

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.users);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery) {
      router.push(`/search?q=${encodeURIComponent(newQuery)}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <>
      <Navbar />
      <main className="bg-fb-light-gray min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <input
                type="text"
                placeholder="Search for users by name, username, or email..."
                value={query}
                onChange={handleInputChange}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:border-fb-blue focus:ring-2 focus:ring-fb-blue focus:ring-opacity-10 text-lg transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin">
                <div className="text-4xl">🤔</div>
              </div>
              <p className="text-gray-600 mt-4">Searching...</p>
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-600 text-lg">
                No users found for "{query}". Try searching for a different name or username.
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Found {results.length} user{results.length !== 1 ? 's' : ''}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((user) => (
                  <Link
                    key={user.id}
                    href={`/profile/${user.username}`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-fb-blue transition-all text-center"
                  >
                    <div className="flex justify-center mb-4">
                      <UserAvatar
                        name={user.name || 'User'}
                        image={user.image}
                        size="lg"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {user.name || 'Unknown'}
                    </h3>
                    <p className="text-gray-600 mb-4">@{user.username}</p>
                    <div className="text-2xl font-bold text-fb-blue">
                      {user.tickleCount}
                    </div>
                    <p className="text-sm text-gray-600">tickles received</p>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!hasSearched && results.length === 0 && !isLoading && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-600 text-lg">
                Start typing to search for users!
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="bg-fb-light-gray min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
