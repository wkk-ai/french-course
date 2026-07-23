'use client';

import { Flame, Trophy } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function TopBarClient({ streak, xp, email }: { streak: number; xp: number; email: string | null }) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:left-24 h-16 bg-surface-container-lowest border-b-2 border-surface-variant flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full">
          <Flame className="w-5 h-5 text-warning fill-warning/20" />
          <span className="font-bold text-on-surface">{streak}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 bg-primary-fixed rounded-full border border-primary-fixed-dim">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-label-caps text-primary">XP</span>
          <span className="font-bold text-primary">{xp}</span>
        </div>
        {email && <button onClick={signOut} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low"><LogOut className="size-4" /></button>}
      </div>
    </header>
  );
}
