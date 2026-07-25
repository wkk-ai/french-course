-- Rebuild Module 01 pathway: 5 units × A/B/C = 15 sub-chapters.
-- Keep shipped lesson IDs …0101–…0104 as U1–U4 Learn (A).

UPDATE modules
SET
  title = 'Les Fondamentaux',
  description = 'Grand Pathway M01 · 5 units × Learn/Apply/Integrate. Identity, numbers, café, family, sounds — A1.1 foundation.',
  cefr_level = 'A1',
  order_index = 1
WHERE id = '11111111-0000-0000-0000-000000000001';

-- Existing Learn (A) rows: new titles + pathway order
UPDATE chapters SET title = 'First meetings', description = 'Introduce yourself; greetings; tu/vous', order_index = 1,
  grammar_focus = ARRAY['Subject pronouns', 'present être', 'c''est vs il/elle est'], new_lemmas_count = 70
WHERE id = '22222222-0000-0000-0000-000000000101';

UPDATE chapters SET title = 'Age & dates', description = 'Numbers, days, age with avoir', order_index = 4,
  grammar_focus = ARRAY['Numbers 0–100', 'days', 'avoir for age'], new_lemmas_count = 70
WHERE id = '22222222-0000-0000-0000-000000000102';

UPDATE chapters SET title = 'Ordering', description = 'Order drinks and food; partitives', order_index = 7,
  grammar_focus = ARRAY['prendre/vouloir/aimer/payer', 'articles & partitives'], new_lemmas_count = 70
WHERE id = '22222222-0000-0000-0000-000000000103';

UPDATE chapters SET title = 'Close family', description = 'mon/ma/mes; parents, siblings', order_index = 10,
  grammar_focus = ARRAY['Possessives mon/ma/mes', 'family nouns', 'avoir + people'], new_lemmas_count = 70
WHERE id = '22222222-0000-0000-0000-000000000104';

-- New Apply / Integrate / Unit 5 rows
INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES
  ('22222222-0000-0000-0000-000000000111', '11111111-0000-0000-0000-000000000001', 'Nationality & origin', 'Nationality adjectives; habiter; countries', 2, ARRAY['être + nationality', 'habiter'], 50, '{}'),
  ('22222222-0000-0000-0000-000000000112', '11111111-0000-0000-0000-000000000001', 'Checkpoint: trois présentations', 'Mixed practice — three introduction scenes', 3, ARRAY['Unit 1 spiral'], 30, '{}'),
  ('22222222-0000-0000-0000-000000000121', '11111111-0000-0000-0000-000000000001', 'Planning the week', 'Schedules; aujourd''hui / demain / hier', 5, ARRAY['Days', 'time adverbs'], 50, '{}'),
  ('22222222-0000-0000-0000-000000000122', '11111111-0000-0000-0000-000000000001', 'Checkpoint: un agenda', 'Mixed practice — a full week agenda', 6, ARRAY['Unit 2 spiral'], 30, '{}'),
  ('22222222-0000-0000-0000-000000000131', '11111111-0000-0000-0000-000000000001', 'Bill & politeness', 'L''addition; s''il vous plaît; café verbs', 8, ARRAY['Politeness', 'payer'], 50, '{}'),
  ('22222222-0000-0000-0000-000000000132', '11111111-0000-0000-0000-000000000001', 'Checkpoint: une terrasse', 'Mixed practice — terrace scene', 9, ARRAY['Unit 3 spiral'], 30, '{}'),
  ('22222222-0000-0000-0000-000000000141', '11111111-0000-0000-0000-000000000001', 'Descriptions with être', 'Family descriptions; agreement', 11, ARRAY['être + adjectives', 'agreement'], 50, '{}'),
  ('22222222-0000-0000-0000-000000000142', '11111111-0000-0000-0000-000000000001', 'Checkpoint: arbre généalogique', 'Mixed practice — family tree', 12, ARRAY['Unit 4 spiral'], 30, '{}'),
  ('22222222-0000-0000-0000-000000000151', '11111111-0000-0000-0000-000000000001', 'Alphabet & accents', 'French alphabet; acute, grave, circumflex', 13, ARRAY['Alphabet', 'accents'], 40, '{}'),
  ('22222222-0000-0000-0000-000000000152', '11111111-0000-0000-0000-000000000001', 'Silent letters', 'Final consonants; liaison awareness', 14, ARRAY['Silent finals', 'liaison'], 40, '{}'),
  ('22222222-0000-0000-0000-000000000153', '11111111-0000-0000-0000-000000000001', 'Checkpoint: noms propres', 'Mixed practice — spelling names aloud', 15, ARRAY['Unit 5 spiral'], 25, '{}')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  grammar_focus = EXCLUDED.grammar_focus,
  new_lemmas_count = EXCLUDED.new_lemmas_count,
  module_id = EXCLUDED.module_id;
