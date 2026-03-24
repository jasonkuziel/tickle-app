import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-fb-light-gray min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 text-lg mb-8">
            The user or page you're looking for doesn't exist.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-fb-blue text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
        </div>
      </main>
    </>
  );
}
