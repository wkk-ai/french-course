import { AuthGate } from '@/components/AuthGate';

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background relative flex flex-col">
        {children}
      </div>
    </AuthGate>
  );
}
