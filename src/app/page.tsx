import { auth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  // Redirect authenticated users to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-fb-light-gray to-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-6">🤣</div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              The Social Network for <span className="text-fb-blue">Tickle Enthusiasts</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Connect with friends, spread joy, and track your tickle score. It's like poking, but better!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-fb-blue text-white px-10 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="border-2 border-fb-blue text-fb-blue px-10 py-4 rounded-lg font-bold text-lg hover:bg-fb-light-gray transition-colors"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-fb-light-gray">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Why Tickle?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Find Friends</h3>
                <p className="text-gray-600">
                  Discover and connect with people who love tickling as much as you do.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">🤣</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tickle Them</h3>
                <p className="text-gray-600">
                  Send tickles to your friends and make them laugh with a fun poke.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Track Your Score</h3>
                <p className="text-gray-600">
                  Climb the leaderboard and become the tickle champion!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-8">
                <div className="text-5xl font-bold text-fb-blue mb-2">∞</div>
                <p className="text-gray-600 text-lg">Tickles Sent</p>
              </div>
              <div className="p-8">
                <div className="text-5xl font-bold text-fb-blue mb-2">😂</div>
                <p className="text-gray-600 text-lg">Happy People</p>
              </div>
              <div className="p-8">
                <div className="text-5xl font-bold text-fb-blue mb-2">🌍</div>
                <p className="text-gray-600 text-lg">Worldwide</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-fb-blue text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Tickling?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of people tickling their friends every day.
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-fb-blue px-10 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Create Your Account
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold mb-4">Tickle</h4>
                <p className="text-sm">The social network for tickle enthusiasts.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>© 2026 Tickle. All rights reserved. Made with 🤣 and love.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
