-- Filter proper nouns out of chapter_vocabulary Review seed on complete_chapter.
-- Also avoid bumping articles_completed when words_read is 0 (client records separately).

CREATE OR REPLACE FUNCTION complete_chapter(
  p_chapter_id UUID,
  p_score INTEGER,
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
  v_result JSONB;
  v_today DATE := CURRENT_DATE;
  v_last_active_date DATE;
  v_current_streak INTEGER;
  v_existing_mistake_id UUID;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO user_chapter_progress (user_id, chapter_id, status, score, completed_at)
  VALUES (v_user_id, p_chapter_id, 'completed', p_score, NOW())
  ON CONFLICT (user_id, chapter_id) DO UPDATE SET
    status = 'completed',
    score = EXCLUDED.score,
    completed_at = NOW();

  -- Seed Review from chapter_vocabulary — skip proper nouns / names.
  INSERT INTO user_vocab_progress (user_id, vocab_id, next_review_at)
  SELECT v_user_id, cv.vocab_id, NOW()
  FROM chapter_vocabulary cv
  JOIN vocabulary v ON v.id = cv.vocab_id
  WHERE cv.chapter_id = p_chapter_id
    AND lower(coalesce(v.part_of_speech, '')) NOT IN ('proper noun', 'proper_noun', 'name')
  ON CONFLICT (user_id, vocab_id) DO UPDATE SET
    total_encounters = user_vocab_progress.total_encounters + 1;

  -- Only bump articles_completed when this call also carries reading words.
  IF GREATEST(p_words_read, 0) > 0 THEN
    INSERT INTO user_daily_reading_stats (user_id, date, words_read, articles_completed)
    VALUES (v_user_id, v_today, GREATEST(p_words_read, 0), 1)
    ON CONFLICT (user_id, date) DO UPDATE SET
      words_read = user_daily_reading_stats.words_read + GREATEST(p_words_read, 0),
      articles_completed = user_daily_reading_stats.articles_completed + 1;
  END IF;

  SELECT last_active_date, current_streak
  INTO v_last_active_date, v_current_streak
  FROM user_streaks
  WHERE user_id = v_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_active_date)
    VALUES (v_user_id, 1, 1, v_today);
  ELSE
    UPDATE user_streaks
    SET
      current_streak = CASE
        WHEN v_last_active_date = v_today THEN current_streak
        WHEN v_last_active_date = v_today - 1 THEN current_streak + 1
        ELSE 1
      END,
      longest_streak = GREATEST(
        longest_streak,
        CASE WHEN v_last_active_date = v_today - 1 THEN v_current_streak + 1 ELSE 1 END
      ),
      last_active_date = v_today
    WHERE user_id = v_user_id;
  END IF;

  SELECT c.id INTO v_next_chapter_id
  FROM chapters c
  JOIN modules m ON m.id = c.module_id
  WHERE c.lesson_content IS NOT NULL
    AND c.lesson_content <> '{}'::jsonb
    AND c.id <> p_chapter_id
    AND NOT EXISTS (
      SELECT 1 FROM user_chapter_progress ucp
      WHERE ucp.user_id = v_user_id AND ucp.chapter_id = c.id AND ucp.status = 'completed'
    )
  ORDER BY m.order_index, c.order_index
  LIMIT 1;

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
      SELECT id INTO v_existing_mistake_id
      FROM user_mistakes
      WHERE user_id = v_user_id
        AND grammar_category = v_result->>'category'
        AND is_resolved = FALSE
        AND vocab_id IS NULL
      LIMIT 1;

      IF v_existing_mistake_id IS NULL THEN
        INSERT INTO user_mistakes (user_id, grammar_category, error_context)
        VALUES (v_user_id, v_result->>'category', v_result->>'context');
      ELSE
        UPDATE user_mistakes
        SET error_count = error_count + 1,
            last_error_at = NOW(),
            error_context = v_result->>'context'
        WHERE id = v_existing_mistake_id;
      END IF;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_next_chapter_id;
END;
$$;
