-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Master Vocabulary & Idiom Dictionary
CREATE TABLE vocabulary (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   word VARCHAR(255) NOT NULL,
   base_translation VARCHAR(255) NOT NULL,
   part_of_speech VARCHAR(50),
   gender VARCHAR(10),
   register VARCHAR(50) DEFAULT 'Courant', -- 'Soutenu', 'Courant', 'Familier', 'Argot'
   ipa_pronunciation VARCHAR(255),
   is_idiom BOOLEAN DEFAULT FALSE,
   is_slang BOOLEAN DEFAULT FALSE,
   idiom_explanation TEXT,
   memory_hook TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User SRS Progress (The "Vocab Vault")
CREATE TABLE user_vocab_progress (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   vocab_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,

   -- SRS Algorithm Fields (SM-2)
   repetition_count INTEGER DEFAULT 0,
   ease_factor REAL DEFAULT 2.5,
   interval_days INTEGER DEFAULT 0,

   -- Timing & Mistake Tracking
   next_review_at TIMESTAMPTZ DEFAULT NOW(),
   last_reviewed_at TIMESTAMPTZ,
   total_encounters INTEGER DEFAULT 1,
   mistake_count INTEGER DEFAULT 0,
   is_graduated BOOLEAN DEFAULT FALSE,

   UNIQUE(user_id, vocab_id)
);

-- 3. Mistake Log & Remediation Tracking ("Most Mistaken Words")
CREATE TABLE user_mistakes (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   vocab_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE,
   grammar_category VARCHAR(100),
   error_context TEXT,
   error_count INTEGER DEFAULT 1,
   is_resolved BOOLEAN DEFAULT FALSE,
   resolved_at TIMESTAMPTZ,
   last_error_at TIMESTAMPTZ DEFAULT NOW(),
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Streak & Banked Time Tracking
CREATE TABLE user_streaks (
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
   current_streak INTEGER DEFAULT 0,
   longest_streak INTEGER DEFAULT 0,
   banked_minutes REAL DEFAULT 0.0,
   streak_freezes_available INTEGER DEFAULT 0,
   last_active_date DATE DEFAULT CURRENT_DATE
);

-- 5. Learner Grammar Mastery Metrics (Command Center)
CREATE TABLE user_grammar_mastery (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   grammar_category VARCHAR(100) NOT NULL,
   total_attempts INTEGER DEFAULT 0,
   correct_attempts INTEGER DEFAULT 0,
   updated_at TIMESTAMPTZ DEFAULT NOW(),
   UNIQUE(user_id, grammar_category)
);

-- 6. Custom "In The Wild" Saved Texts
CREATE TABLE user_custom_texts (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   title VARCHAR(255) NOT NULL,
   content TEXT NOT NULL,
   word_count INTEGER NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Grammar Reference Library
CREATE TABLE grammar_rules (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   slug VARCHAR(100) UNIQUE NOT NULL,
   title VARCHAR(255) NOT NULL,
   category VARCHAR(100) NOT NULL,
   summary TEXT NOT NULL,
   full_explanation TEXT NOT NULL,
   examples JSONB NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bookmarked Sentences (Contextual Vault)
CREATE TABLE user_bookmarked_sentences (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   sentence_french TEXT NOT NULL,
   sentence_english TEXT NOT NULL,
   highlighted_word_id UUID REFERENCES vocabulary(id),
   source_type VARCHAR(50) NOT NULL, -- 'module', 'in_the_wild'
   notes TEXT,
   created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Daily Volume Tracking
CREATE TABLE user_daily_reading_stats (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
   date DATE DEFAULT CURRENT_DATE,
   words_read INTEGER DEFAULT 0,
   minutes_spent REAL DEFAULT 0.0,
   articles_completed INTEGER DEFAULT 0,
   UNIQUE(user_id, date)
);

-- Row Level Security (RLS) Policies
ALTER TABLE user_vocab_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_grammar_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_custom_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bookmarked_sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_reading_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access own vocab progress" ON user_vocab_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own mistakes" ON user_mistakes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own streaks" ON user_streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own grammar mastery" ON user_grammar_mastery FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own custom texts" ON user_custom_texts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public view grammar rules" ON grammar_rules FOR SELECT USING (true);
CREATE POLICY "Users access own bookmarked sentences" ON user_bookmarked_sentences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own daily reading stats" ON user_daily_reading_stats FOR ALL USING (auth.uid() = user_id);
