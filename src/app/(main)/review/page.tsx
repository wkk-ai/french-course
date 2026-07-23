import { createClient } from '@/utils/supabase/server';
import ReviewClient from './ReviewClient';

export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let dueWords = [];
  let mistakes = [];
  
  if (user) {
    const [dueResult, mistakesResult] = await Promise.all([
      supabase
        .from('user_vocab_progress')
        .select('*, vocabulary(*)')
        .eq('user_id', user.id)
        .lte('next_review_at', new Date().toISOString())
        .order('next_review_at')
        .limit(20),
      supabase
        .from('user_mistakes')
        .select('*, vocabulary(word, base_translation)')
        .eq('user_id', user.id)
        .eq('is_resolved', false)
        .order('last_error_at', { ascending: false })
        .limit(10),
    ]);
    dueWords = dueResult.data ?? [];
    mistakes = mistakesResult.data ?? [];
  }

  return <ReviewClient initialDueWords={dueWords} initialMistakes={mistakes} />;
}
