import { createClient } from '@/utils/supabase/server';
import TopBarClient from './TopBarClient';

export default async function TopBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let streak = 0;
  let xp = 0;

  if (user) {
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('current_streak')
      .eq('user_id', user.id)
      .single();
    streak = streakData?.current_streak || 0;

    // XP = total completed chapters * 100 + total vocab encounters * 5
    const { count: chapterCount } = await supabase
      .from('user_chapter_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    const { count: vocabCount } = await supabase
      .from('user_vocab_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    xp = (chapterCount || 0) * 100 + (vocabCount || 0) * 5;
  }

  return <TopBarClient streak={streak} xp={xp} email={user?.email ?? null} />;
}
