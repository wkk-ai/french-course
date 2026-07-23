-- Course platform integrity, discovery, and progression.

ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view vocabulary" ON vocabulary FOR SELECT USING (true);

ALTER TABLE user_vocab_progress
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE INDEX IF NOT EXISTS user_vocab_progress_due_reviews_idx
  ON user_vocab_progress (user_id, next_review_at);
CREATE INDEX IF NOT EXISTS user_chapter_progress_user_status_idx
  ON user_chapter_progress (user_id, status);
CREATE INDEX IF NOT EXISTS user_daily_reading_stats_user_date_idx
  ON user_daily_reading_stats (user_id, date);

CREATE TABLE chapter_vocabulary (
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
  vocab_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (chapter_id, vocab_id)
);

CREATE TABLE verb_conjugations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vocab_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,
  tense VARCHAR(100) NOT NULL,
  pronoun VARCHAR(50) NOT NULL,
  form VARCHAR(255) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  UNIQUE (vocab_id, tense, pronoun)
);

ALTER TABLE chapter_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE verb_conjugations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view chapter vocabulary" ON chapter_vocabulary FOR SELECT USING (true);
CREATE POLICY "Public view verb conjugations" ON verb_conjugations FOR SELECT USING (true);

-- Atomically records a completed lesson, exposes the next authored lesson,
-- and updates activity metrics. All writes remain scoped to auth.uid().
CREATE OR REPLACE FUNCTION complete_chapter(
  p_chapter_id UUID,
  p_score INTEGER DEFAULT 100,
  p_words_read INTEGER DEFAULT 0,
  p_grammar_results JSONB DEFAULT '[]'::jsonb
)
RETURNS TABLE(next_chapter_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_next_chapter_id UUID;
  v_today DATE := CURRENT_DATE;
  v_last_active_date DATE;
  v_current_streak INTEGER;
  v_result JSONB;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM chapters WHERE id = p_chapter_id) THEN
    RAISE EXCEPTION 'Chapter not found';
  END IF;

  INSERT INTO user_chapter_progress (user_id, chapter_id, status, score, completed_at)
  VALUES (v_user_id, p_chapter_id, 'completed', GREATEST(0, LEAST(100, p_score)), NOW())
  ON CONFLICT (user_id, chapter_id) DO UPDATE SET
    status = 'completed',
    score = GREATEST(user_chapter_progress.score, EXCLUDED.score),
    completed_at = COALESCE(user_chapter_progress.completed_at, EXCLUDED.completed_at);

  SELECT c.id
  INTO v_next_chapter_id
  FROM chapters c
  JOIN modules m ON m.id = c.module_id
  JOIN chapters current_chapter ON current_chapter.id = p_chapter_id
  JOIN modules current_module ON current_module.id = current_chapter.module_id
  WHERE (m.order_index, c.order_index) > (current_module.order_index, current_chapter.order_index)
    AND c.lesson_content <> '{}'::jsonb
  ORDER BY m.order_index, c.order_index
  LIMIT 1;

  IF v_next_chapter_id IS NOT NULL THEN
    INSERT INTO user_chapter_progress (user_id, chapter_id, status)
    VALUES (v_user_id, v_next_chapter_id, 'active')
    ON CONFLICT (user_id, chapter_id) DO UPDATE SET
      status = CASE
        WHEN user_chapter_progress.status = 'locked' THEN 'active'
        ELSE user_chapter_progress.status
      END;
  END IF;

  INSERT INTO user_vocab_progress (user_id, vocab_id, next_review_at)
  SELECT v_user_id, cv.vocab_id, NOW()
  FROM chapter_vocabulary cv
  WHERE cv.chapter_id = p_chapter_id
  ON CONFLICT (user_id, vocab_id) DO UPDATE SET
    total_encounters = user_vocab_progress.total_encounters + 1;

  INSERT INTO user_daily_reading_stats (user_id, date, words_read, minutes_spent, articles_completed)
  VALUES (v_user_id, v_today, GREATEST(0, p_words_read), 0, 1)
  ON CONFLICT (user_id, date) DO UPDATE SET
    words_read = user_daily_reading_stats.words_read + EXCLUDED.words_read,
    articles_completed = user_daily_reading_stats.articles_completed + 1;

  INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_active_date)
  VALUES (v_user_id, 1, 1, v_today)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT last_active_date, current_streak
  INTO v_last_active_date, v_current_streak
  FROM user_streaks
  WHERE user_id = v_user_id;

  IF v_last_active_date < v_today THEN
    UPDATE user_streaks
    SET current_streak = CASE
          WHEN v_last_active_date = v_today - 1 THEN v_current_streak + 1
          ELSE 1
        END,
        longest_streak = GREATEST(
          longest_streak,
          CASE WHEN v_last_active_date = v_today - 1 THEN v_current_streak + 1 ELSE 1 END
        ),
        last_active_date = v_today
    WHERE user_id = v_user_id;
  END IF;

  FOR v_result IN SELECT value FROM jsonb_array_elements(p_grammar_results)
  LOOP
    INSERT INTO user_grammar_mastery (
      user_id, grammar_category, total_attempts, correct_attempts, updated_at
    )
    VALUES (
      v_user_id,
      v_result->>'category',
      1,
      CASE WHEN COALESCE((v_result->>'correct')::BOOLEAN, FALSE) THEN 1 ELSE 0 END,
      NOW()
    )
    ON CONFLICT (user_id, grammar_category) DO UPDATE SET
      total_attempts = user_grammar_mastery.total_attempts + 1,
      correct_attempts = user_grammar_mastery.correct_attempts
        + CASE WHEN COALESCE((v_result->>'correct')::BOOLEAN, FALSE) THEN 1 ELSE 0 END,
      updated_at = NOW();

    IF NOT COALESCE((v_result->>'correct')::BOOLEAN, FALSE) THEN
      INSERT INTO user_mistakes (user_id, grammar_category, error_context)
      VALUES (v_user_id, v_result->>'category', 'Lesson exercise');
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_next_chapter_id;
END;
$$;

GRANT EXECUTE ON FUNCTION complete_chapter(UUID, INTEGER, INTEGER, JSONB) TO authenticated;
