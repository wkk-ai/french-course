import { AuthGate } from '@/components/AuthGate';
import { Navigation } from '@/components/layout/Navigation';
import TopBar from '@/components/layout/TopBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="min-h-screen pb-16 md:pb-0 md:pl-24 pt-16 relative">
        <TopBar />
        <Navigation />
        <main className="max-w-[680px] mx-auto p-4 md:p-12">
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
