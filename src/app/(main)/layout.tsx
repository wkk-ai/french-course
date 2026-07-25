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
      <div className="relative min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom,0px))] pt-16 md:pb-0 md:pl-24">
        <TopBar />
        <Navigation />
        <main className="mx-auto max-w-[680px] p-4 md:p-12">
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
