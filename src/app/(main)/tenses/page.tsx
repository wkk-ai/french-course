import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { GrammarTabs } from '@/components/GrammarTabs'
import { TENSE_GOALS, type TenseGoal } from '@/lib/tenses/guide'

export const metadata = { title: 'Grammar · L’Art du Français' }

/** The French name of each page, as a learner would look it up. */
const NAME: Record<string, string> = {
  now: 'Présent',
  recent: 'Venir de · En train de',
  'while-doing': 'Gérondif',
  commands: 'Impératif',
  'past-done': 'Passé composé',
  'past-background': 'Imparfait',
  'past-before': 'Plus-que-parfait',
  plans: 'Futur proche',
  future: 'Futur simple',
  'will-have': 'Futur antérieur',
  polite: 'Conditionnel',
  if: 'Si (if)',
  'must-want': 'Subjonctif',
  'would-have': 'Conditionnel passé',
  'as-if': 'Comme si',
  'must-past': 'Subjonctif passé',
  'books-only': 'Passé simple',
}

type Group = { id: string; title: string; line: string; color: string; tint: string; slugs: string[] }

/** Ordered by what you need first to hold a conversation. */
const GROUPS: Group[] = [
  { id: 'now', title: 'Now', line: 'Habits, facts and what is happening', color: '#2450D6', tint: '#E4EBFF', slugs: ['now', 'recent', 'commands', 'while-doing'] },
  { id: 'past', title: 'Past', line: 'What happened and how things were', color: '#B4530F', tint: '#FCEBDD', slugs: ['past-done', 'past-background', 'past-before'] },
  { id: 'future', title: 'Future', line: 'Plans, promises and predictions', color: '#13814A', tint: '#E3F4EC', slugs: ['plans', 'future', 'will-have'] },
  { id: 'polite', title: 'Polite, if & wishes', line: 'Asking nicely, what-ifs, feelings', color: '#7A35B8', tint: '#F1E6FB', slugs: ['polite', 'if', 'must-want', 'would-have', 'as-if', 'must-past'] },
  { id: 'books', title: 'Only in books', line: 'Recognise it; you never need to say it', color: '#5B5B66', tint: '#EBEBEF', slugs: ['books-only'] },
]

function GoalRow({ goal, group }: { goal: TenseGoal; group: Group }) {
  const later = goal.level !== 'Core'
  return (
    <li>
      <Link href={`/tenses/${goal.slug}/`} className="flex min-h-[64px] items-center gap-3 px-4 py-3 active:bg-surface-container">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ background: later ? 'var(--color-outline-variant)' : group.color }} />
        <span className="min-w-0 flex-1">
          <span className="block text-body-ui font-bold text-on-surface">{NAME[goal.slug] ?? goal.timeline.label}</span>
          <span className="block text-sm text-on-surface-variant">{goal.title}</span>
        </span>
        {later && <span className="shrink-0 rounded-full bg-surface-container px-2 py-0.5 text-[11px] font-semibold text-on-surface-variant">Later</span>}
        <ChevronRight className="size-5 shrink-0 text-outline" />
      </Link>
    </li>
  )
}

export default function TensesHub() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg">Grammar</h1>
      <GrammarTabs active="tenses" />

      <p className="-mt-2 text-body-ui text-on-surface-variant">Pick what you want to say. Start with the coloured dots; grey “Later” pages can wait.</p>

      <nav aria-label="Jump to" className="grid grid-cols-2 gap-2">
        {GROUPS.slice(0, 4).map((group) => (
          <a key={group.id} href={`#${group.id}`} className="flex min-h-[64px] flex-col justify-center rounded-2xl px-4 py-3" style={{ background: group.tint }}>
            <span className="text-body-ui font-bold" style={{ color: group.color }}>{group.title}</span>
            <span className="text-xs text-on-surface-variant">{group.slugs.length} pages</span>
          </a>
        ))}
      </nav>

      {GROUPS.map((group) => {
        const goals = group.slugs.map((slug) => TENSE_GOALS.find((goal) => goal.slug === slug)).filter((goal): goal is TenseGoal => Boolean(goal))
        return (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-6">
            <div className="mb-2 px-1">
              <h2 id={`${group.id}-title`} className="text-headline-md" style={{ color: group.color }}>{group.title}</h2>
              <p className="text-sm text-on-surface-variant">{group.line}</p>
            </div>
            <ul className="divide-y divide-surface-variant overflow-hidden rounded-[20px] bg-surface-container-low">
              {goals.map((goal) => <GoalRow key={goal.slug} goal={goal} group={group} />)}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
