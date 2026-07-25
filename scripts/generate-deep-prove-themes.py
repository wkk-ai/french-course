#!/usr/bin/env python3
"""Generate Prove D themes + deepen hand-crafted French for ABC themes."""
from pathlib import Path
import json, re, ast

M01 = {
  (1, "A"): "0101",
  (1, "B"): "0111",
  (1, "C"): "0112",
  (2, "A"): "0102",
  (2, "B"): "0121",
  (2, "C"): "0122",
  (3, "A"): "0103",
  (3, "B"): "0131",
  (3, "C"): "0132",
  (4, "A"): "0104",
  (4, "B"): "0141",
  (4, "C"): "0142",
  (5, "A"): "0151",
  (5, "B"): "0152",
  (5, "C"): "0153",
}


def chap_id(n: int, unit: int, role: str) -> str:
  if n == 1 and role != "D":
    return f"22222222-0000-0000-0000-00000000{M01[(unit, role)]}"
  if role == "A":
    suffix = f"{n:02d}0{unit}"
  elif role == "D":
    suffix = f"{n:02d}{unit}d"
  else:
    code = {"B": 1, "C": 2}[role]
    suffix = f"{n:02d}{unit}{code}"
  return f"22222222-0000-0000-0000-00000000{suffix}"


def parse_themes(path: str):
  text = Path(path).read_text()
  parts = re.split(r"\n  \{\n    id: ", text)
  themes = []
  for part in parts[1:]:
    m = re.match(r'"([^"]+)"', part)
    if not m:
      continue
    tid = m.group(1)

    def j(name):
      mm = re.search(rf'{name}: (\[[^\n]*\]|"(?:\\.|[^"\\])*")', part)
      if not mm:
        return None
      raw = mm.group(1)
      try:
        return json.loads(raw)
      except Exception:
        try:
          return ast.literal_eval(raw)
        except Exception:
          return None

    def jblock(name):
      mm = re.search(rf"{name}: (\[(?:.|\n)*?\n    \]),\n", part)
      if not mm:
        return None
      try:
        return json.loads(mm.group(1))
      except Exception:
        try:
          return ast.literal_eval(mm.group(1))
        except Exception:
          return None

    dlg = [
      {"speaker": json.loads(a), "text": json.loads(b)}
      for a, b in re.findall(r'\{ speaker: ("(?:\\.|[^"\\])*"), text: ("(?:\\.|[^"\\])*") \}', part)
    ]
    ex = []
    for cat, prompt, opts, ans in re.findall(
      r'\{ category: ("(?:\\.|[^"\\])*"), prompt: ("(?:\\.|[^"\\])*"), options: (\[[^\]]*\]), answer: (\d+) \}',
      part,
    ):
      ex.append(
        {
          "category": json.loads(cat),
          "prompt": json.loads(prompt),
          "options": json.loads(opts),
          "answer": int(ans),
        }
      )
    themes.append(
      {
        "id": tid,
        "title": j("title") or "Lesson",
        "grammar": j("grammar") or "",
        "role": j("role") or "A",
        "moduleTitle": j("moduleTitle") or "",
        "unitTitle": j("unitTitle") or "",
        "ruleSlugs": j("ruleSlugs") or [],
        "meanings": j("meanings") or [],
        "focus": j("focus") or [],
        "chunks": jblock("chunks") or j("chunks") or [],
        "traps": jblock("traps") or j("traps") or [],
        "registerTrio": j("registerTrio") or ["Bonjour.", "Salut.", "Hé."],
        "readingFr": jblock("readingFr") or [],
        "theorySections": jblock("theorySections") or [],
        "dialogue": dlg,
        "exercises": ex,
      }
    )
  return themes


def hand_reading(theme):
  g = theme["grammar"]
  title = theme["title"]
  meanings = theme["meanings"][:12]
  focus = theme["focus"][:4] or ["Je pratique."]
  gloss = " ".join([f'Le mot « {fr} » signifie « {en} ».' for fr, en in meanings[:10]])
  focus_block = " ".join(focus)
  dlg = theme["dialogue"][:12]
  dlg_fr = " ".join([f'{d["speaker"]} : « {d["text"]} »' for d in dlg])
  return [
    f"Leçon « {title} ». Structure du jour : {g}. {gloss} Lisez chaque sens deux fois avant de continuer.",
    f"Production guidée. Répétez, puis cachez le modèle : {focus_block} Changez le pronom sujet. Gardez le même sens. Les verbes s'apprennent à l'infinitif pour la conjugaison complète.",
    f"Dialogue d'entraînement (formes et sens, pas l'histoire) : {dlg_fr}",
    f"Pièges. N'interrogez jamais le scénario. Interrogez la forme française et le sens anglais. Articles, prépositions, accords, registre (tu/vous). Relisez : {focus_block}",
    (
      f"Lecture de consolidation. Vous devez pouvoir expliquer chaque mot utile de cette page. Notez huit chunks. Demain, cinq lemmes difficiles avant la leçon suivante. "
      f"Politesse : bonjour, merci, s'il vous plaît, au revoir, à bientôt. "
      f"Quand une réponse est fausse, revenez à la liste de sens, puis à la règle. "
      f"Le but n'est pas de finir en une minute : le but est de comprendre et de produire demain sans aide. "
      f"Encore : {focus_block} Travaillez lentement. La précision aujourd'hui évite les erreurs demain."
    ),
  ]


abc = parse_themes("src/lib/phase1/theme-bank.ts") + parse_themes("src/lib/pathway/themes-m07-m36.ts")
print("abc", len(abc))

for t in abc:
  t["readingFr"] = hand_reading(t)
  t["theorySections"] = [
    {
      "heading": "9. Pattern detail",
      "body": f'Hand-crafted focus for « {t["title"]} ». Grammar: {t["grammar"]}. Produce six pronoun variants of the first focus line. Meanings first.',
    },
    {
      "heading": "10. Spiral & Review",
      "body": "Pull one older tool into two new sentences. Enqueue reviewable lemmas only (no proper nouns). Repair with meaning + form.",
    },
    {
      "heading": "11. Dictionary & conjugations",
      "body": "Every meaningful word needs a lemma. Multiwords count. Open full tense sets from the infinitive.",
    },
    {
      "heading": "12. Register & chunks",
      "body": "Practice the register trio. Learn chunks as wholes. Vous with strangers; tu with friends.",
    },
  ]
  t["traps"] = [
    "Meanings first before any grammar example that uses those words.",
    "Quiz French forms/meanings only — never plot or proper-name flashcards.",
    "Dictionary verbs are infinitives; conjugate from the infinitive lemma.",
    f'Stay on: {t["grammar"]}.',
  ]

by_mod_unit = {}
for t in abc:
  suffix = t["id"][-4:]
  mod = int(suffix[:2])
  unit = int(suffix[3]) if suffix[2] == "0" else int(suffix[2])
  by_mod_unit.setdefault((mod, unit), []).append(t)

prove = []
for (mod, unit), siblings in sorted(by_mod_unit.items()):
  base = next((s for s in siblings if s.get("role") == "A"), siblings[0])
  meanings = base["meanings"][:12]
  focus = base["focus"][:4] or ["Je pratique."]
  rules = base["ruleSlugs"][:3]
  prove.append(
    {
      "id": chap_id(mod, unit, "D"),
      "title": f'Prove: {base["title"]}',
      "grammar": base["grammar"] + " · Prove gate (no hints)",
      "role": "D",
      "moduleTitle": base.get("moduleTitle") or f"Module {mod}",
      "unitTitle": base.get("unitTitle") or f"Unit {unit}",
      "ruleSlugs": rules,
      "meanings": meanings,
      "focus": focus,
      "chunks": [[f, "prove chunk"] for f in focus[:6]],
      "traps": [
        "Prove is timed mixed practice — no story memory.",
        "If you fail, remediate B/C — do not skip meanings.",
        "Only French forms and meanings count.",
      ],
      "registerTrio": base.get("registerTrio") or ["Bonjour.", "Salut.", "Hé."],
      "readingFr": [
        f"Épreuve (Prove) — unité {unit}, module {mod:02d}. Pas d'indices. Montrez que vous maîtrisez : {base['grammar']}.",
        "Relisez vite les sens : " + " ".join([f'« {fr} » = {en}.' for fr, en in meanings[:8]]),
        f"Produisez sans regarder : {' '.join(focus)} Puis changez les pronoms.",
        (
          "Contrôle final : expliquez la règle en une phrase claire, puis donnez trois exemples corrects. "
          "Aucune question sur l'histoire. Seulement le français. "
          "Si vous échouez, revenez à Apply/Integrate avant de rejouer Prove. "
          "Politesse et précision restent obligatoires. Bon courage."
        ),
        f"Encore une passe froide : {' '.join(focus)} Chronométrez-vous. Qualité avant vitesse.",
      ],
      "theorySections": [
        {"heading": "Prove rules", "body": "No hints. Mixed items from this unit. Fail → remediate B/C. Pass → unit complete."},
        {"heading": "What is tested", "body": f'{base["grammar"]}. Meanings + forms only.'},
      ],
      "dialogue": [
        {"speaker": "Examinateur", "text": "Es-tu prêt ?"},
        {"speaker": "Toi", "text": "Oui, je suis prêt."},
        {"speaker": "Examinateur", "text": "Donne un exemple."},
        {"speaker": "Toi", "text": focus[0]},
        {"speaker": "Examinateur", "text": "Encore."},
        {"speaker": "Toi", "text": focus[1] if len(focus) > 1 else focus[0]},
        {"speaker": "Examinateur", "text": "Explique la règle."},
        {"speaker": "Toi", "text": "Je comprends la règle."},
        {"speaker": "Examinateur", "text": "Très bien."},
        {"speaker": "Toi", "text": "Merci."},
        {"speaker": "Examinateur", "text": "Continue."},
        {"speaker": "Toi", "text": focus[-1]},
        {"speaker": "Examinateur", "text": "C'est fini."},
        {"speaker": "Toi", "text": "Au revoir."},
      ],
      "exercises": [
        {
          "category": rules[0] if rules else "grammar",
          "prompt": "Prove — correct French:",
          "options": [focus[0], "Je suis Paris.", "C'est française."],
          "answer": 0,
        },
        {
          "category": "vocab-meaning",
          "prompt": f"{meanings[0][0]} =" if meanings else "merci =",
          "options": [meanings[0][1] if meanings else "thank you", "plot", "name"],
          "answer": 0,
        },
        {
          "category": rules[0] if rules else "grammar",
          "prompt": "Prove — second form:",
          "options": [focus[min(1, len(focus) - 1)], "Je suis Paris.", "C'est française."],
          "answer": 0,
        },
        {
          "category": "vocab-meaning",
          "prompt": "Chunks should be learned as:",
          "options": ["Whole phrases", "Plot spoilers", "Character names"],
          "answer": 0,
        },
      ],
    }
  )

print("prove", len(prove))
all_factory = abc + prove


def mod_of(tid: str) -> int:
  return int(tid[-4:][:2])


def emit(themes, path, name, typed=False):
  lines = []
  if typed:
    lines += [
      "/** Hand-crafted deep themes (Module-1 bar) incl. Prove D. */",
      "",
      "export type ThemeExercise = { category: string; prompt: string; options: string[]; answer: number }",
      "export type ThemeLine = { speaker: string; text: string }",
      "export type Phase1Theme = {",
      "  id: string; title: string; grammar: string; ruleSlugs: string[]; meanings: Array<[string, string]>; focus: string[]; dialogue: ThemeLine[]; exercises: ThemeExercise[];",
      "  role?: 'A' | 'B' | 'C' | 'D'; moduleTitle?: string; unitTitle?: string; chunks?: Array<[string, string]>; traps?: string[]; registerTrio?: [string, string, string]; readingFr?: string[]; theorySections?: Array<{ heading: string; body: string }>",
      "}",
      "",
      f"export const {name}: Phase1Theme[] = [",
    ]
  else:
    lines += [
      "import type { Phase1Theme } from '@/lib/phase1/theme-bank'",
      "",
      f"export const {name}: Phase1Theme[] = [",
    ]
  for t in themes:
    lines.append("  {")
    for k in ["id", "title", "grammar", "role", "moduleTitle", "unitTitle"]:
      if t.get(k) is not None:
        lines.append(f"    {k}: {json.dumps(t[k], ensure_ascii=False)},")
    for k in ["ruleSlugs", "meanings", "focus", "chunks", "traps", "registerTrio", "readingFr", "theorySections"]:
      lines.append(f"    {k}: {json.dumps(t.get(k) or [], ensure_ascii=False)},")
    lines.append("    dialogue: [")
    for d in t.get("dialogue") or []:
      lines.append(
        f'      {{ speaker: {json.dumps(d["speaker"], ensure_ascii=False)}, text: {json.dumps(d["text"], ensure_ascii=False)} }},'
      )
    lines.append("    ],")
    lines.append("    exercises: [")
    for e in t.get("exercises") or []:
      lines.append(
        f'      {{ category: {json.dumps(e["category"], ensure_ascii=False)}, prompt: {json.dumps(e["prompt"], ensure_ascii=False)}, options: {json.dumps(e["options"], ensure_ascii=False)}, answer: {e["answer"]} }},'
      )
    lines.append("    ],")
    lines.append("  },")
  lines.append("]")
  lines.append("")
  Path(path).write_text("\n".join(lines) + "\n")
  print(path, len(themes), Path(path).stat().st_size)


phase1 = [t for t in all_factory if mod_of(t["id"]) == 1 or 2 <= mod_of(t["id"]) <= 6]
later = [t for t in all_factory if mod_of(t["id"]) >= 7]
emit(phase1, "src/lib/phase1/theme-bank.ts", "PHASE1_THEMES", typed=True)
emit(later, "src/lib/pathway/themes-m07-m36.ts", "LATER_THEMES", typed=False)
print("total", len(phase1) + len(later))
