'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🤣</div>
        <h1 className="text-3xl font-bold text-gray-900">Tickle</h1>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Log In</h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-fb-blue focus:ring-2 focus:ring-fb-blue focus:ring-opacity-10 transition-all"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-fb-blue focus:ring-2 focus:ring-fb-blue focus:ring-opacity-10 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-fb-blue text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('google')}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            <span>🔷</span>
            Log in with Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('github')}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            <span>🐙</span>
            Log in with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 pt-6">
          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-fb-blue font-bold hover:opacity-80 transition-opacity">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Demo Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-sm text-blue-800">
        <p className="font-semibold mb-2">Demo Credentials</p>
        <p>Email: <code className="bg-white px-2 py-1 rounded">alice@example.com</code></p>
        <p>Password: <code className="bg-white px-2 py-1 rounded">password123</code></p>
      </div>
    </div>
  );
}
