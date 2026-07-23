INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000001', 'Les Fondamentaux', 'Alphabet, pronunciation rules, être/avoir, gender, singular/plural.', 'A1', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000101', '11111111-0000-0000-0000-000000000001', 'Bonjour, je m''appelle…', 'Greetings and introductions', 1, ARRAY['Subject pronouns', 'present être', 'c''est vs il/elle est'], 65, '{
     "tokens": [
       {"id": "t1", "text": "Bonjour", "syntax": "none", "translation": "Hello", "lemmaId": "32a8a816-c56b-4e67-8549-bdfbc98e9b60"},
       {"id": "t2", "text": ",", "syntax": "none"},
       {"id": "t3", "text": "je", "syntax": "noun", "translation": "I", "lemmaId": "12a8a816-c56b-4e67-8549-bdfbc98e9b60"},
       {"id": "t4", "text": "m''appelle", "syntax": "verb", "translation": "call myself", "lemmaId": "22a8a816-c56b-4e67-8549-bdfbc98e9b60", "isSilentTail": true},
       {"id": "t5", "text": "Marc", "syntax": "noun", "translation": "Marc", "lemmaId": "42a8a816-c56b-4e67-8549-bdfbc98e9b60"},
       {"id": "t6", "text": ".", "syntax": "none"}
     ]
   }')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000102', '11111111-0000-0000-0000-000000000001', 'Les chiffres et le calendrier', 'Numbers 0–100; days, months', 2, ARRAY['Numbers 0–100', 'days, months', 'il y a (age)'], 55, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000103', '11111111-0000-0000-0000-000000000001', 'Au café', 'Present -ER verbs', 3, ARRAY['Present -ER verbs', 'articles le/la/les', 'un/une/des'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000104', '11111111-0000-0000-0000-000000000001', 'Ma famille', 'Possessives & family vocabulary', 4, ARRAY['Possessives mon/ma/mes', 'family nouns', 'avoir + noun'], 60, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000002', 'La vie quotidienne', 'Routine, time, places in town, weather, basic negation.', 'A1', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000201', '11111111-0000-0000-0000-000000000002', 'Ma journée', 'Daily routine & reflexive verbs', 1, ARRAY['Present -IR/-RE', 'reflexive routine se lever', 'time à, de…à'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000202', '11111111-0000-0000-0000-000000000002', 'En ville', 'Town places & spatial prepositions', 2, ARRAY['Prepositions dans, sur, chez, à', 'il y a', 'place names'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000203', '11111111-0000-0000-0000-000000000002', 'Le temps qu''il fait', 'Weather & clothing', 3, ARRAY['Impersonal il', 'weather expressions', 'clothing adjectives'], 65, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000204', '11111111-0000-0000-0000-000000000002', 'Ce n''est pas possible', 'Expressing impossibility & negation', 4, ARRAY['Negation ne…pas/jamais/plus', 'personne, rien', 'de after negated verb'], 60, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000003', 'Passé et souvenirs', 'Passé composé with avoir/être, past time markers, imparfait intro.', 'A2', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000301', '11111111-0000-0000-0000-000000000003', 'Hier soir', 'Passé composé with avoir', 1, ARRAY['Passé composé (avoir)', 'time adverbs'], 80, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000302', '11111111-0000-0000-0000-000000000003', 'Vacances', 'Passé composé with être (VANDERTRAMP)', 2, ARRAY['PC with être', 'past participle agreement'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000303', '11111111-0000-0000-0000-000000000003', 'Quand j''étais petit', 'Imparfait formation & habits', 3, ARRAY['Imparfait formation & use', 'childhood vocabulary'], 85, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000304', '11111111-0000-0000-0000-000000000003', 'Il pleuvait', 'PC vs Imparfait contrast in narratives', 4, ARRAY['PC vs imparfait narrative rules', 'storytelling adverbs'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000004', 'Futur, projets et people', 'Futur simple, near future, object pronouns COD/COI, y and en.', 'A2', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000401', '11111111-0000-0000-0000-000000000004', 'Demain', 'Futur simple & work projects', 1, ARRAY['Futur simple regular & irregulars', 'future time markers'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000402', '11111111-0000-0000-0000-000000000004', 'Je te le dis', 'Direct and indirect object pronouns', 2, ARRAY['COD/COI pronouns le, la, les, lui, leur', 'communication verbs'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000403', '11111111-0000-0000-0000-000000000004', 'On y va', 'Adverbial pronouns y and en', 3, ARRAY['Y and En pronouns', 'on vs nous usage'], 65, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000404', '11111111-0000-0000-0000-000000000004', 'Les fêtes', 'Comparatives, superlatives & celebrations', 4, ARRAY['Comparatives plus/moins/aussi', 'superlative forms'], 80, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000005', 'Santé, corps et obligations', 'Modal nuance, imperative, health vocabulary, present participle intro.', 'B1', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000501', '11111111-0000-0000-0000-000000000005', 'Chez le médecin', 'Health, symptoms & doctor visits', 1, ARRAY['Il faut + infinitive', 'imperative mode'], 85, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000502', '11111111-0000-0000-0000-000000000005', 'Il faut que…', 'Subjunctive present introduction', 2, ARRAY['Subjunctive present triggers', 'irregular subjunctives'], 90, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000503', '11111111-0000-0000-0000-000000000005', 'En marchant', 'Present participle & gerund', 3, ARRAY['Present participle', 'en + gerund'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000504', '11111111-0000-0000-0000-000000000005', 'Les règles', 'Rules, signs & formal instructions', 4, ARRAY['Imperative affirmative/negative', 'formal register'], 65, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000006', 'Travail et société', 'Plus-que-parfait, conditionnel présent, hypothesis (si + imparfait).', 'B1', 6)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000601', '11111111-0000-0000-0000-000000000006', 'Mon premier job', 'Work experience & past before past', 1, ARRAY['Plus-que-parfait formation', 'past chronology'], 80, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000602', '11111111-0000-0000-0000-000000000006', 'Si j''avais…', 'Conditionnel present & hypothetical si clauses', 2, ARRAY['Conditionnel present', 'Si + imparfait -> conditionnel'], 85, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000603', '11111111-0000-0000-0000-000000000006', 'La presse', 'Media, journalism & relative pronouns', 3, ARRAY['Relative pronouns qui, que, où, dont'], 90, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000604', '11111111-0000-0000-0000-000000000006', 'Droit et devoirs', 'Civic duties, law & passive intro', 4, ARRAY['Passive voice intro', 'impersonal structures'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000007', 'Relations et émotions', 'Subjunctive vs indicative after emotion/doubt, relative pronouns lequel.', 'B1', 7)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000701', '11111111-0000-0000-0000-000000000007', 'Amitié et amour', 'Relationships & emotional nuance', 1, ARRAY['Subjunctive vs indicative (penser/croire)'], 80, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000702', '11111111-0000-0000-0000-000000000007', 'Ce qui me plaît', 'Demonstrative relative pronouns', 2, ARRAY['Ce qui, ce que, ce dont'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000703', '11111111-0000-0000-0000-000000000007', 'Se disputer', 'Conflict resolution & reciprocal verbs', 3, ARRAY['Reciprocal reflexive verbs', 'adverbs of intensity'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000704', '11111111-0000-0000-0000-000000000007', 'Lettres personnelles', 'Correspondence & register shifts', 4, ARRAY['Tu/Vous register rules', 'epistolary formulas'], 65, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000008', 'France et francophonie', 'Passive voice full, causative faire + inf, regional variations.', 'B2', 8)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000801', '11111111-0000-0000-0000-000000000008', 'La République', 'French institutions & government', 1, ARRAY['Passive voice complete', 'Il est + adj + de'], 85, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000802', '11111111-0000-0000-0000-000000000008', 'Québec, Sénégal, Belgique', 'Francophone world & lexical variations', 2, ARRAY['Regional French variations', 'cultural discourse'], 90, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000803', '11111111-0000-0000-0000-000000000008', 'D''ici demain', 'Futur antérieur & complex deadlines', 3, ARRAY['Futur antérieur', 'temporal conjunctions'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000804', '11111111-0000-0000-0000-000000000008', 'On se fait comprendre', 'Causative construction', 4, ARRAY['Causative faire + infinitive'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000009', 'Opinions et débats', 'Argument connectors, concessive subjunctive, conditionnel passé.', 'B2', 9)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000901', '11111111-0000-0000-0000-000000000009', 'Pour ou contre', 'Debate, arguments & rhetorical connectors', 1, ARRAY['Connectors cependant, en revanche, néanmoins'], 85, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000902', '11111111-0000-0000-0000-000000000009', 'Bien que ce soit difficile', 'Concessive clause & subjunctive', 2, ARRAY['Concessive subjunctive (bien que, quoique)'], 80, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000903', '11111111-0000-0000-0000-000000000009', 'Il a dit que…', 'Reported speech & tense agreement', 3, ARRAY['Reported speech (discours rapporté)', 'tense backshift'], 90, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000000904', '11111111-0000-0000-0000-000000000009', 'Si j''avais su', 'Conditionnel passé & regret', 4, ARRAY['Conditionnel passé', 'Si + plus-que-parfait -> conditionnel passé'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000010', 'Science, tech et environnement', 'Nominalization, advanced relative pronouns dont/lequel, passé simple recognition.', 'B2', 10)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001001', '11111111-0000-0000-0000-000000000010', 'Le numérique', 'Technology, AI & nominalization', 1, ARRAY['Nominalization (-tion, -ment)', 'tech register'], 95, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001002', '11111111-0000-0000-0000-000000000010', 'Le climat', 'Ecology, environment & quantities with dont', 2, ARRAY['Relative pronoun dont (quantities)', 'environmental discourse'], 90, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001003', '11111111-0000-0000-0000-000000000010', 'Il fit un geste', 'Passé simple literary recognition', 3, ARRAY['Passé simple 3rd person recognition'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001004', '11111111-0000-0000-0000-000000000010', 'La recherche', 'Academic prose & scientific citation', 4, ARRAY['Academic register', 'scientific citations'], 85, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000011', 'Art, littérature et registre', 'Literary tenses, figurative language, soutenu vs familier register.', 'C1 prep', 11)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001101', '11111111-0000-0000-0000-000000000011', 'Au musée', 'Art critique & visual description', 1, ARRAY['Descriptive imparfait', 'art critique lexicon'], 80, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001102', '11111111-0000-0000-0000-000000000011', 'Un extrait littéraire', 'Literary excerpt analysis', 2, ARRAY['Passé simple + imparfait narrative prose'], 85, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001103', '11111111-0000-0000-0000-000000000011', 'Argot et SMS', 'Colloquial French, argot & SMS decoding', 3, ARRAY['Register tags & argot decoding', 'idiom nuances'], 75, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001104', '11111111-0000-0000-0000-000000000011', 'Discours formel', 'Formal speeches & advanced subjunctive', 4, ARRAY['Subjunctive past', 'formal connectors & fixed expressions'], 70, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO modules (id, title, description, cefr_level, order_index)
VALUES ('11111111-0000-0000-0000-000000000012', 'Maîtrise et monde réel', 'Long-form synthesis, administrative French, false friends, capstone.', 'C1 prep', 12)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, cefr_level = EXCLUDED.cefr_level, order_index = EXCLUDED.order_index;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001201', '11111111-0000-0000-0000-000000000012', 'Administratif', 'Administrative documents & bureaucracy', 1, ARRAY['Administrative formal imperatives', 'legal boilerplate'], 90, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001202', '11111111-0000-0000-0000-000000000012', 'False friends', 'False cognates & subtle traps', 2, ARRAY['Faux amis trap list & precision reading'], 80, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001203', '11111111-0000-0000-0000-000000000012', 'Synthèse B2', 'Long-form synthesis essay', 3, ARRAY['Mixed-tense synthesis structures'], 60, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

INSERT INTO chapters (id, module_id, title, description, order_index, grammar_focus, new_lemmas_count, lesson_content)
VALUES ('22222222-0000-0000-0000-000000001204', '11111111-0000-0000-0000-000000000012', 'Capstone — In The Wild', 'Open-ended reading & self-annotation', 4, ARRAY['Self-annotation & mastery audit'], 40, '{}')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, order_index = EXCLUDED.order_index, grammar_focus = EXCLUDED.grammar_focus, new_lemmas_count = EXCLUDED.new_lemmas_count;

-- Starter curriculum: Module 1 is fully authored. Later modules remain visible
-- in the pathway, but intentionally show as coming soon until their content is authored.
INSERT INTO vocabulary (id, word, base_translation, part_of_speech, gender, register, ipa_pronunciation)
VALUES
  ('32a8a816-c56b-4e67-8549-bdfbc98e9b60', 'bonjour', 'hello; good morning', 'interjection', NULL, 'Courant', 'bɔ̃.ʒuʁ'),
  ('12a8a816-c56b-4e67-8549-bdfbc98e9b60', 'je', 'I', 'pronoun', NULL, 'Courant', 'ʒə'),
  ('22a8a816-c56b-4e67-8549-bdfbc98e9b60', 's''appeler', 'to be called', 'verb', NULL, 'Courant', 'sa.plə.le'),
  ('42a8a816-c56b-4e67-8549-bdfbc98e9b60', 'Marc', 'Marc', 'proper noun', NULL, 'Courant', 'maʁk'),
  ('10000000-0000-0000-0000-000000000001', 'être', 'to be', 'verb', NULL, 'Courant', 'ɛtʁ'),
  ('10000000-0000-0000-0000-000000000002', 'français', 'French', 'adjective', 'masculine', 'Courant', 'fʁɑ̃.sɛ'),
  ('10000000-0000-0000-0000-000000000003', 'Paris', 'Paris', 'proper noun', NULL, 'Courant', 'pa.ʁi'),
  ('10000000-0000-0000-0000-000000000004', 'comment', 'how', 'adverb', NULL, 'Courant', 'kɔ.mɑ̃'),
  ('10000000-0000-0000-0000-000000000005', 'ça', 'it; that', 'pronoun', NULL, 'Courant', 'sa'),
  ('10000000-0000-0000-0000-000000000006', 'bien', 'well', 'adverb', NULL, 'Courant', 'bjɛ̃'),
  ('10000000-0000-0000-0000-000000000007', 'merci', 'thank you', 'interjection', NULL, 'Courant', 'mɛʁ.si'),
  ('10000000-0000-0000-0000-000000000008', 'au revoir', 'goodbye', 'interjection', NULL, 'Courant', 'o ʁə.vwaʁ'),
  ('10000000-0000-0000-0000-000000000009', 'aujourd''hui', 'today', 'adverb', NULL, 'Courant', 'o.ʒuʁ.dɥi'),
  ('10000000-0000-0000-0000-000000000010', 'lundi', 'Monday', 'noun', 'masculine', 'Courant', 'lœ̃.di'),
  ('10000000-0000-0000-0000-000000000011', 'mardi', 'Tuesday', 'noun', 'masculine', 'Courant', 'maʁ.di'),
  ('10000000-0000-0000-0000-000000000012', 'mercredi', 'Wednesday', 'noun', 'masculine', 'Courant', 'mɛʁ.kʁə.di'),
  ('10000000-0000-0000-0000-000000000013', 'un', 'one', 'determiner', 'masculine', 'Courant', 'œ̃'),
  ('10000000-0000-0000-0000-000000000014', 'deux', 'two', 'determiner', NULL, 'Courant', 'dø'),
  ('10000000-0000-0000-0000-000000000015', 'trois', 'three', 'determiner', NULL, 'Courant', 'tʁwa'),
  ('10000000-0000-0000-0000-000000000016', 'avoir', 'to have', 'verb', NULL, 'Courant', 'a.vwaʁ'),
  ('10000000-0000-0000-0000-000000000017', 'ans', 'years old', 'noun', 'masculine', 'Courant', 'ɑ̃'),
  ('10000000-0000-0000-0000-000000000018', 'café', 'coffee; café', 'noun', 'masculine', 'Courant', 'ka.fe'),
  ('10000000-0000-0000-0000-000000000019', 'thé', 'tea', 'noun', 'masculine', 'Courant', 'te'),
  ('10000000-0000-0000-0000-000000000020', 'eau', 'water', 'noun', 'feminine', 'Courant', 'o'),
  ('10000000-0000-0000-0000-000000000021', 'croissant', 'croissant', 'noun', 'masculine', 'Courant', 'kʁwa.sɑ̃'),
  ('10000000-0000-0000-0000-000000000022', 'prendre', 'to take; to have', 'verb', NULL, 'Courant', 'pʁɑ̃dʁ'),
  ('10000000-0000-0000-0000-000000000023', 'vouloir', 'to want', 'verb', NULL, 'Courant', 'vu.lwaʁ'),
  ('10000000-0000-0000-0000-000000000024', 'payer', 'to pay', 'verb', NULL, 'Courant', 'pɛ.je'),
  ('10000000-0000-0000-0000-000000000025', 'famille', 'family', 'noun', 'feminine', 'Courant', 'fa.mij'),
  ('10000000-0000-0000-0000-000000000026', 'mère', 'mother', 'noun', 'feminine', 'Courant', 'mɛʁ'),
  ('10000000-0000-0000-0000-000000000027', 'père', 'father', 'noun', 'masculine', 'Courant', 'pɛʁ'),
  ('10000000-0000-0000-0000-000000000028', 'frère', 'brother', 'noun', 'masculine', 'Courant', 'fʁɛʁ'),
  ('10000000-0000-0000-0000-000000000029', 'sœur', 'sister', 'noun', 'feminine', 'Courant', 'sœʁ'),
  ('10000000-0000-0000-0000-000000000030', 'mon', 'my', 'determiner', 'masculine', 'Courant', 'mɔ̃'),
  ('10000000-0000-0000-0000-000000000031', 'ma', 'my', 'determiner', 'feminine', 'Courant', 'ma'),
  ('10000000-0000-0000-0000-000000000032', 'petit', 'small; little', 'adjective', 'masculine', 'Courant', 'pə.ti'),
  ('10000000-0000-0000-0000-000000000033', 'grand', 'big; tall', 'adjective', 'masculine', 'Courant', 'gʁɑ̃')
ON CONFLICT (id) DO UPDATE SET
  word = EXCLUDED.word,
  base_translation = EXCLUDED.base_translation,
  part_of_speech = EXCLUDED.part_of_speech,
  gender = EXCLUDED.gender,
  register = EXCLUDED.register,
  ipa_pronunciation = EXCLUDED.ipa_pronunciation;

INSERT INTO grammar_rules (id, slug, title, category, summary, full_explanation, examples)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'subject-pronouns', 'Subject pronouns', 'Syntax', 'French verb forms change with the subject: je, tu, il/elle/on, nous, vous, ils/elles.', 'A subject pronoun tells us who performs the action. French normally states it because verb endings alone are not always distinct.', '[{"french":"Je suis français.","english":"I am French."},{"french":"Nous sommes ici.","english":"We are here."}]'),
  ('30000000-0000-0000-0000-000000000002', 'etre-present', 'Être in the present tense', 'Verbs', 'Être means “to be” and is irregular in the present.', 'Use être for identity, nationality, and descriptions. Its forms are je suis, tu es, il/elle/on est, nous sommes, vous êtes, ils/elles sont.', '[{"french":"Je suis Marc.","english":"I am Marc."},{"french":"Elle est française.","english":"She is French."}]'),
  ('30000000-0000-0000-0000-000000000003', 'cest-versus-il-est', 'C''est vs il/elle est', 'Syntax', 'Use c''est before a noun or name; use il/elle est before an adjective or nationality.', 'C''est introduces or identifies something. Il/elle est describes a known person or thing.', '[{"french":"C''est Marc.","english":"That is Marc."},{"french":"Il est français.","english":"He is French."}]'),
  ('30000000-0000-0000-0000-000000000004', 'numbers-and-age', 'Numbers and age', 'Syntax', 'French uses avoir, not être, to say how old someone is.', 'Say j''ai vingt ans literally “I have twenty years.” Numbers generally stay unchanged before a noun.', '[{"french":"J''ai dix-huit ans.","english":"I am eighteen."},{"french":"Nous sommes trois.","english":"There are three of us."}]'),
  ('30000000-0000-0000-0000-000000000005', 'articles-partitives', 'Articles for food and drink', 'Nouns', 'Use un/une for one countable item and du/de la for an unspecified amount.', 'French articles carry gender and number. After vouloir or prendre, food often uses un/une for a unit and du/de la for an amount.', '[{"french":"Je prends un café.","english":"I am having a coffee."},{"french":"Elle veut de l''eau.","english":"She wants water."}]'),
  ('30000000-0000-0000-0000-000000000006', 'er-present', 'Regular -ER verbs in the present', 'Verbs', 'Remove -er and add -e, -es, -e, -ons, -ez, -ent.', 'Most French verbs follow this pattern. The -ent ending for ils/elles is normally silent.', '[{"french":"Je paie l''addition.","english":"I pay the bill."},{"french":"Ils parlent français.","english":"They speak French."}]'),
  ('30000000-0000-0000-0000-000000000007', 'possessive-adjectives', 'Possessive adjectives: mon, ma, mes', 'Nouns', 'Possessive adjectives agree with the noun possessed, not with the owner.', 'Use mon before masculine singular nouns, ma before feminine singular nouns, and mes before plural nouns.', '[{"french":"Mon frère est petit.","english":"My brother is small."},{"french":"Ma sœur est grande.","english":"My sister is tall."}]'),
  ('30000000-0000-0000-0000-000000000008', 'silent-final-consonants', 'Silent final consonants', 'Phonetics', 'Many final consonants are silent in ordinary speech, but spelling still records them.', 'Final -s in plural nouns and the -ent ending of ils/elles verbs are usually silent. The interface marks silent segments visually.', '[{"french":"Ils parlent.","english":"They speak."},{"french":"Les cafés.","english":"The cafés."}]')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  summary = EXCLUDED.summary,
  full_explanation = EXCLUDED.full_explanation,
  examples = EXCLUDED.examples;

INSERT INTO chapter_vocabulary (chapter_id, vocab_id)
VALUES
  ('22222222-0000-0000-0000-000000000101', '32a8a816-c56b-4e67-8549-bdfbc98e9b60'),
  ('22222222-0000-0000-0000-000000000101', '12a8a816-c56b-4e67-8549-bdfbc98e9b60'),
  ('22222222-0000-0000-0000-000000000101', '22a8a816-c56b-4e67-8549-bdfbc98e9b60'),
  ('22222222-0000-0000-0000-000000000101', '42a8a816-c56b-4e67-8549-bdfbc98e9b60'),
  ('22222222-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000101', '10000000-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000009'),
  ('22222222-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000010'),
  ('22222222-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000011'),
  ('22222222-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000012'),
  ('22222222-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000016'),
  ('22222222-0000-0000-0000-000000000102', '10000000-0000-0000-0000-000000000017'),
  ('22222222-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000018'),
  ('22222222-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000019'),
  ('22222222-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000020'),
  ('22222222-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000021'),
  ('22222222-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000022'),
  ('22222222-0000-0000-0000-000000000103', '10000000-0000-0000-0000-000000000023'),
  ('22222222-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000025'),
  ('22222222-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000026'),
  ('22222222-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000027'),
  ('22222222-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000028'),
  ('22222222-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000029'),
  ('22222222-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000030'),
  ('22222222-0000-0000-0000-000000000104', '10000000-0000-0000-0000-000000000031')
ON CONFLICT DO NOTHING;

INSERT INTO verb_conjugations (vocab_id, tense, pronoun, form, order_index)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'Présent', 'je', 'suis', 1),
  ('10000000-0000-0000-0000-000000000001', 'Présent', 'tu', 'es', 2),
  ('10000000-0000-0000-0000-000000000001', 'Présent', 'il / elle / on', 'est', 3),
  ('10000000-0000-0000-0000-000000000001', 'Présent', 'nous', 'sommes', 4),
  ('10000000-0000-0000-0000-000000000001', 'Présent', 'vous', 'êtes', 5),
  ('10000000-0000-0000-0000-000000000001', 'Présent', 'ils / elles', 'sont', 6),
  ('22a8a816-c56b-4e67-8549-bdfbc98e9b60', 'Présent', 'je', 'm''appelle', 1),
  ('22a8a816-c56b-4e67-8549-bdfbc98e9b60', 'Présent', 'tu', 't''appelles', 2),
  ('22a8a816-c56b-4e67-8549-bdfbc98e9b60', 'Présent', 'il / elle / on', 's''appelle', 3),
  ('22a8a816-c56b-4e67-8549-bdfbc98e9b60', 'Présent', 'nous', 'nous appelons', 4),
  ('22a8a816-c56b-4e67-8549-bdfbc98e9b60', 'Présent', 'vous', 'vous appelez', 5),
  ('22a8a816-c56b-4e67-8549-bdfbc98e9b60', 'Présent', 'ils / elles', 's''appellent', 6),
  ('10000000-0000-0000-0000-000000000016', 'Présent', 'je', 'ai', 1),
  ('10000000-0000-0000-0000-000000000016', 'Présent', 'tu', 'as', 2),
  ('10000000-0000-0000-0000-000000000016', 'Présent', 'il / elle / on', 'a', 3),
  ('10000000-0000-0000-0000-000000000016', 'Présent', 'nous', 'avons', 4),
  ('10000000-0000-0000-0000-000000000016', 'Présent', 'vous', 'avez', 5),
  ('10000000-0000-0000-0000-000000000016', 'Présent', 'ils / elles', 'ont', 6)
ON CONFLICT (vocab_id, tense, pronoun) DO UPDATE SET form = EXCLUDED.form, order_index = EXCLUDED.order_index;

UPDATE chapters SET lesson_content = $lesson$
{
  "brief": {"title": "Introduce yourself", "body": "French uses the subject pronoun **je** with a special form of *être*: **je suis**. To say your name, use **je m’appelle**. Use **c’est** to identify someone and **il/elle est** to describe them.", "ruleSlugs": ["subject-pronouns", "etre-present", "cest-versus-il-est"]},
  "reading": [{"tokens": [
    {"id":"c1-t1","text":"Bonjour","lemmaId":"32a8a816-c56b-4e67-8549-bdfbc98e9b60","syntax":"none"},
    {"id":"c1-t2","text":"!","syntax":"none"},
    {"id":"c1-t3","text":"Je","lemmaId":"12a8a816-c56b-4e67-8549-bdfbc98e9b60","syntax":"noun"},
    {"id":"c1-t4","text":"m’appelle","lemmaId":"22a8a816-c56b-4e67-8549-bdfbc98e9b60","syntax":"verb"},
    {"id":"c1-t5","text":"Marc","lemmaId":"42a8a816-c56b-4e67-8549-bdfbc98e9b60","syntax":"noun"},
    {"id":"c1-t6","text":"et","syntax":"none"},
    {"id":"c1-t7","text":"je","lemmaId":"12a8a816-c56b-4e67-8549-bdfbc98e9b60","syntax":"noun"},
    {"id":"c1-t8","text":"suis","lemmaId":"10000000-0000-0000-0000-000000000001","syntax":"verb"},
    {"id":"c1-t9","text":"français","lemmaId":"10000000-0000-0000-0000-000000000002","syntax":"adj"},
    {"id":"c1-t10","text":".","syntax":"none"},
    {"id":"c1-t11","text":"J’habite","syntax":"verb"},
    {"id":"c1-t12","text":"à","syntax":"none"},
    {"id":"c1-t13","text":"Paris","lemmaId":"10000000-0000-0000-0000-000000000003","syntax":"noun"},
    {"id":"c1-t14","text":".","syntax":"none"}
  ]}],
  "exercises": [{"id":"c1-e1","category":"être-present","prompt":"Choose the correct sentence.", "options":["Je est Marc.","Je suis Marc.","Je sont Marc."],"answer":1,"explanation":"With je, être becomes suis."},{"id":"c1-e2","category":"cest-versus-il-est","prompt":"Which form identifies a person?", "options":["C’est Marc.","Il est Marc.","Je est Marc."],"answer":0,"explanation":"Use c’est before a name."}],
  "wordCount": 17
}
$lesson$::jsonb
WHERE id = '22222222-0000-0000-0000-000000000101';

UPDATE chapters SET lesson_content = $lesson$
{
  "brief": {"title": "Numbers, days, and age", "body": "French says someone’s age with **avoir**: *j’ai vingt ans* literally means “I have twenty years.” Days of the week are not capitalized in French.", "ruleSlugs": ["numbers-and-age"]},
  "reading": [{"tokens": [
    {"id":"c2-t1","text":"Aujourd’hui","lemmaId":"10000000-0000-0000-0000-000000000009","syntax":"none"},
    {"id":"c2-t2","text":"c’est","syntax":"verb"},
    {"id":"c2-t3","text":"lundi","lemmaId":"10000000-0000-0000-0000-000000000010","syntax":"noun"},
    {"id":"c2-t4","text":".","syntax":"none"},
    {"id":"c2-t5","text":"Marc","lemmaId":"42a8a816-c56b-4e67-8549-bdfbc98e9b60","syntax":"noun"},
    {"id":"c2-t6","text":"a","lemmaId":"10000000-0000-0000-0000-000000000016","syntax":"verb"},
    {"id":"c2-t7","text":"vingt","syntax":"none"},
    {"id":"c2-t8","text":"ans","lemmaId":"10000000-0000-0000-0000-000000000017","syntax":"noun"},
    {"id":"c2-t9","text":"et","syntax":"none"},
    {"id":"c2-t10","text":"son","syntax":"none"},
    {"id":"c2-t11","text":"anniversaire","syntax":"noun"},
    {"id":"c2-t12","text":"est","lemmaId":"10000000-0000-0000-0000-000000000001","syntax":"verb"},
    {"id":"c2-t13","text":"mardi","lemmaId":"10000000-0000-0000-0000-000000000011","syntax":"noun"},
    {"id":"c2-t14","text":".","syntax":"none"}
  ]}],
  "exercises": [{"id":"c2-e1","category":"numbers-and-age","prompt":"How do you say “I am 20 years old”?", "options":["Je suis vingt ans.","J’ai vingt ans.","Je suis vingt."],"answer":1,"explanation":"Age uses avoir in French."},{"id":"c2-e2","category":"numbers-and-age","prompt":"Which day follows lundi?", "options":["mercredi","mardi","dimanche"],"answer":1,"explanation":"Mardi is Tuesday."}],
  "wordCount": 18
}
$lesson$::jsonb
WHERE id = '22222222-0000-0000-0000-000000000102';

UPDATE chapters SET lesson_content = $lesson$
{
  "brief": {"title": "Order politely at a café", "body": "Use **je prends** to order something in a café. Countable items use *un/une*; uncountable food and drink use *du, de la,* or *de l’*.", "ruleSlugs": ["articles-partitives", "er-present", "silent-final-consonants"]},
  "reading": [{"tokens": [
    {"id":"c3-t1","text":"Au","syntax":"none"},
    {"id":"c3-t2","text":"café","lemmaId":"10000000-0000-0000-0000-000000000018","syntax":"noun"},
    {"id":"c3-t3","text":",","syntax":"none"},
    {"id":"c3-t4","text":"Marc","lemmaId":"42a8a816-c56b-4e67-8549-bdfbc98e9b60","syntax":"noun"},
    {"id":"c3-t5","text":"prend","lemmaId":"10000000-0000-0000-0000-000000000022","syntax":"verb"},
    {"id":"c3-t6","text":"un","lemmaId":"10000000-0000-0000-0000-000000000013","syntax":"noun"},
    {"id":"c3-t7","text":"café","lemmaId":"10000000-0000-0000-0000-000000000018","syntax":"noun"},
    {"id":"c3-t8","text":"et","syntax":"none"},
    {"id":"c3-t9","text":"un","lemmaId":"10000000-0000-0000-0000-000000000013","syntax":"noun"},
    {"id":"c3-t10","text":"croissant","lemmaId":"10000000-0000-0000-0000-000000000021","syntax":"noun"},
    {"id":"c3-t11","text":".","syntax":"none"},
    {"id":"c3-t12","text":"Il","syntax":"noun"},
    {"id":"c3-t13","text":"veut","lemmaId":"10000000-0000-0000-0000-000000000023","syntax":"verb"},
    {"id":"c3-t14","text":"aussi","syntax":"none"},
    {"id":"c3-t15","text":"de","syntax":"none"},
    {"id":"c3-t16","text":"l’eau","lemmaId":"10000000-0000-0000-0000-000000000020","syntax":"noun"},
    {"id":"c3-t17","text":".","syntax":"none"}
  ]}],
  "exercises": [{"id":"c3-e1","category":"articles-partitives","prompt":"Choose the countable order.", "options":["Je prends eau.","Je prends un café.","Je prends de café."],"answer":1,"explanation":"Use un with one countable café."},{"id":"c3-e2","category":"er-present","prompt":"Which form matches il?", "options":["je prends","il prend","nous prenez"],"answer":1,"explanation":"Il prend is the third-person singular form."}],
  "wordCount": 22
}
$lesson$::jsonb
WHERE id = '22222222-0000-0000-0000-000000000103';

UPDATE chapters SET lesson_content = $lesson$
{
  "brief": {"title": "Talk about your family", "body": "French possessive adjectives agree with the thing owned: **mon frère** but **ma sœur**. Use **avoir** for family relationships: *j’ai un frère*.", "ruleSlugs": ["possessive-adjectives", "numbers-and-age"]},
  "reading": [{"tokens": [
    {"id":"c4-t1","text":"Ma","lemmaId":"10000000-0000-0000-0000-000000000031","syntax":"noun"},
    {"id":"c4-t2","text":"famille","lemmaId":"10000000-0000-0000-0000-000000000025","syntax":"noun"},
    {"id":"c4-t3","text":"est","lemmaId":"10000000-0000-0000-0000-000000000001","syntax":"verb"},
    {"id":"c4-t4","text":"petite","lemmaId":"10000000-0000-0000-0000-000000000032","syntax":"adj"},
    {"id":"c4-t5","text":".","syntax":"none"},
    {"id":"c4-t6","text":"Mon","lemmaId":"10000000-0000-0000-0000-000000000030","syntax":"noun"},
    {"id":"c4-t7","text":"père","lemmaId":"10000000-0000-0000-0000-000000000027","syntax":"noun"},
    {"id":"c4-t8","text":"et","syntax":"none"},
    {"id":"c4-t9","text":"ma","lemmaId":"10000000-0000-0000-0000-000000000031","syntax":"noun"},
    {"id":"c4-t10","text":"mère","lemmaId":"10000000-0000-0000-0000-000000000026","syntax":"noun"},
    {"id":"c4-t11","text":"ont","lemmaId":"10000000-0000-0000-0000-000000000016","syntax":"verb"},
    {"id":"c4-t12","text":"un","lemmaId":"10000000-0000-0000-0000-000000000013","syntax":"noun"},
    {"id":"c4-t13","text":"fils","syntax":"noun"},
    {"id":"c4-t14","text":"et","syntax":"none"},
    {"id":"c4-t15","text":"une","syntax":"noun"},
    {"id":"c4-t16","text":"fille","syntax":"noun"},
    {"id":"c4-t17","text":".","syntax":"none"},
    {"id":"c4-t18","text":"Mon","lemmaId":"10000000-0000-0000-0000-000000000030","syntax":"noun"},
    {"id":"c4-t19","text":"frère","lemmaId":"10000000-0000-0000-0000-000000000028","syntax":"noun"},
    {"id":"c4-t20","text":"est","lemmaId":"10000000-0000-0000-0000-000000000001","syntax":"verb"},
    {"id":"c4-t21","text":"grand","lemmaId":"10000000-0000-0000-0000-000000000033","syntax":"adj"},
    {"id":"c4-t22","text":".","syntax":"none"}
  ]}],
  "exercises": [{"id":"c4-e1","category":"possessive-adjectives","prompt":"Choose the correct phrase for “my sister”.", "options":["mon sœur","ma sœur","mes sœur"],"answer":1,"explanation":"Sœur is feminine singular, so use ma."},{"id":"c4-e2","category":"numbers-and-age","prompt":"Which verb means “to have”?", "options":["être","avoir","prendre"],"answer":1,"explanation":"Avoir means to have."}],
  "wordCount": 28
}
$lesson$::jsonb
WHERE id = '22222222-0000-0000-0000-000000000104';

