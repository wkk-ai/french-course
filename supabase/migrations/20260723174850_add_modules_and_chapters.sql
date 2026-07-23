CREATE TABLE modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cefr_level VARCHAR(10) NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chapters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    lesson_content JSONB NOT NULL,
    grammar_focus TEXT[],
    new_lemmas_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_chapter_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
    status VARCHAR(50) DEFAULT 'locked', -- 'locked', 'active', 'completed'
    score INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, chapter_id)
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Public view chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Users access own chapter progress" ON user_chapter_progress FOR ALL USING (auth.uid() = user_id);
