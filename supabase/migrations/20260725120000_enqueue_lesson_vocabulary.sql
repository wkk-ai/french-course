-- Allow authenticated users to upsert dictionary rows needed for Review FK,
-- and provide a SECURITY DEFINER RPC that seeds the infinite review loop.

CREATE POLICY "Authenticated upsert vocabulary"
  ON vocabulary
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated update vocabulary"
  ON vocabulary
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION enqueue_lesson_vocabulary(
  p_vocab_rows JSONB DEFAULT '[]'::jsonb,
  p_lemma_ids UUID[] DEFAULT ARRAY[]::UUID[]
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_row JSONB;
  v_id UUID;
  v_inserted INTEGER := 0;
  v_index INTEGER := 0;
  v_due TIMESTAMPTZ;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Upsert dictionary rows so FK on user_vocab_progress succeeds for bundled Module 1 lemmas.
  FOR v_row IN SELECT value FROM jsonb_array_elements(COALESCE(p_vocab_rows, '[]'::jsonb))
  LOOP
    INSERT INTO vocabulary (
      id, word, base_translation, part_of_speech, gender, register,
      ipa_pronunciation, is_idiom, is_slang, idiom_explanation
    )
    VALUES (
      (v_row->>'id')::UUID,
      v_row->>'word',
      COALESCE(v_row->>'base_translation', ''),
      v_row->>'part_of_speech',
      v_row->>'gender',
      COALESCE(v_row->>'register', 'Courant'),
      v_row->>'ipa_pronunciation',
      COALESCE((v_row->>'is_idiom')::BOOLEAN, FALSE),
      COALESCE((v_row->>'is_slang')::BOOLEAN, FALSE),
      v_row->>'idiom_explanation'
    )
    ON CONFLICT (id) DO UPDATE SET
      word = EXCLUDED.word,
      base_translation = EXCLUDED.base_translation,
      part_of_speech = COALESCE(EXCLUDED.part_of_speech, vocabulary.part_of_speech),
      gender = COALESCE(EXCLUDED.gender, vocabulary.gender),
      register = COALESCE(EXCLUDED.register, vocabulary.register);
  END LOOP;

  IF p_lemma_ids IS NULL OR array_length(p_lemma_ids, 1) IS NULL THEN
    RETURN 0;
  END IF;

  FOREACH v_id IN ARRAY p_lemma_ids
  LOOP
    -- Stagger: first 10 due now, rest spread over next 7 days.
    IF v_index < 10 THEN
      v_due := NOW();
    ELSE
      v_due := NOW() + (((v_index - 10) % 7) + 1) * INTERVAL '1 day';
    END IF;

    INSERT INTO user_vocab_progress (user_id, vocab_id, next_review_at)
    VALUES (v_user_id, v_id, v_due)
    ON CONFLICT (user_id, vocab_id) DO UPDATE SET
      total_encounters = user_vocab_progress.total_encounters + 1;

    v_inserted := v_inserted + 1;
    v_index := v_index + 1;
  END LOOP;

  RETURN v_inserted;
END;
$$;

GRANT EXECUTE ON FUNCTION enqueue_lesson_vocabulary(JSONB, UUID[]) TO authenticated;

-- Also re-seed from chapter_vocabulary on complete_chapter when that table has rows.
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

  -- Seed Review from chapter_vocabulary when present (thin seed lists OK as baseline).
  INSERT INTO user_vocab_progress (user_id, vocab_id, next_review_at)
  SELECT v_user_id, cv.vocab_id, NOW()
  FROM chapter_vocabulary cv
  WHERE cv.chapter_id = p_chapter_id
  ON CONFLICT (user_id, vocab_id) DO UPDATE SET
    total_encounters = user_vocab_progress.total_encounters + 1;

  INSERT INTO user_daily_reading_stats (user_id, date, words_read, articles_completed)
  VALUES (v_user_id, v_today, GREATEST(p_words_read, 0), 1)
  ON CONFLICT (user_id, date) DO UPDATE SET
    words_read = user_daily_reading_stats.words_read + GREATEST(p_words_read, 0),
    articles_completed = user_daily_reading_stats.articles_completed + 1;

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
        AND vocab_id IS NULL
        AND is_resolved = FALSE
      ORDER BY last_error_at DESC
      LIMIT 1;

      IF v_existing_mistake_id IS NOT NULL THEN
        UPDATE user_mistakes
        SET error_count = error_count + 1,
            last_error_at = NOW(),
            error_context = COALESCE(v_result->>'context', 'Lesson exercise')
        WHERE id = v_existing_mistake_id;
      ELSE
        INSERT INTO user_mistakes (user_id, grammar_category, error_context)
        VALUES (v_user_id, v_result->>'category', COALESCE(v_result->>'context', 'Lesson exercise'));
      END IF;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_next_chapter_id;
END;
$$;
