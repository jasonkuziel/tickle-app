import { Navbar } from '@/components/Navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-fb-light-gray flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </>
  );
}
