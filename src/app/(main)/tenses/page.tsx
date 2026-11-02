import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { GrammarTabs } from '@/components/GrammarTabs'
import { TENSE_GOALS, type TenseGoal } from '@/lib/tenses/guide'

export const metadata = { title: 'Grammar · L’Art du Français' }

/** Each goal's small colored tag (tint + ink pairs pass 4.5:1). */
const TAGS: Record<string, { tag: string; tint: string; ink: string }> = {
  now: { tag: 'Now', tint: '#E4EBFF', ink: '#1A3BA8' },
  plans: { tag: 'Next', tint: '#E3F4EC', ink: '#13693A' },
  future: { tag: 'Will', tint: '#E3F4EC', ink: '#13693A' },
  'past-done': { tag: 'Past', tint: '#FCEBDD', ink: '#9A3A0A' },
  'past-background': { tag: 'Was', tint: '#FCEBDD', ink: '#9A3A0A' },
  recent: { tag: 'Just', tint: '#E4EBFF', ink: '#1A3BA8' },
  polite: { tag: 'Would', tint: '#F1E6FB', ink: '#6B2BA3' },
  commands: { tag: 'Do!', tint: '#F1E6FB', ink: '#6B2BA3' },
  if: { tag: 'If', tint: '#F1E6FB', ink: '#6B2BA3' },
  'must-want': { tag: 'Must', tint: '#F1E6FB', ink: '#6B2BA3' },
  advanced: { tag: 'More', tint: '#EBEBEF', ink: '#3F3F48' },
}

const TIMELINE: Array<{ label: string; align: string; text: string; items: Array<{ slug: string; name: string }> }> = [
  { label: 'Before', align: 'items-start', text: 'text-left', items: [{ slug: 'past-done', name: 'Passé composé' }, { slug: 'past-background', name: 'Imparfait' }] },
  { label: 'Now', align: 'items-center', text: 'text-center', items: [{ slug: 'now', name: 'Présent' }, { slug: 'recent', name: 'Venir de' }] },
  { label: 'Later', align: 'items-end', text: 'text-right', items: [{ slug: 'plans', name: 'Futur proche' }, { slug: 'future', name: 'Futur simple' }] },
]

function GoalRow({ goal }: { goal: TenseGoal }) {
  const tag = TAGS[goal.slug] ?? TAGS.advanced
  return (
    <li>
      <Link href={`/tenses/${goal.slug}/`} className="flex min-h-14 items-center gap-3 rounded-xl py-2 hover:bg-surface-container-low">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold" style={{ background: tag.tint, color: tag.ink }}>{tag.tag}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-body-ui font-semibold">{goal.title}</span>
          <span className="block truncate font-reading text-[15px] text-on-surface-variant">{goal.life[0]?.fr}</span>
        </span>
        <ChevronRight className="size-5 shrink-0 text-outline" />
      </Link>
    </li>
  )
}

export default function TensesHub() {
  const core = TENSE_GOALS.filter((goal) => goal.level !== 'Optional')
  const optional = TENSE_GOALS.filter((goal) => goal.level === 'Optional')

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg">Grammar</h1>
      <GrammarTabs active="tenses" />

      <section aria-label="Tenses on a timeline" className="flex flex-col gap-3 rounded-[20px] bg-surface-container-low p-4">
        <div className="relative h-5" aria-hidden="true">
          <span className="absolute inset-x-2 top-[9px] h-0.5 bg-outline-variant" />
          <span className="absolute left-0 top-1 size-3.5 rounded-full bg-white shadow-[inset_0_0_0_3px_var(--color-outline)]" />
          <span className="absolute left-[calc(50%-7px)] top-1 size-3.5 rounded-full bg-primary" />
          <span className="absolute right-0 top-1 size-3.5 rounded-full bg-white shadow-[inset_0_0_0_3px_var(--color-outline)]" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TIMELINE.map((column) => (
            <div key={column.label} className={`flex flex-col gap-1.5 ${column.align}`}>
              <p className={`text-xs font-semibold ${column.label === 'Now' ? 'text-primary' : 'text-on-surface-variant'}`}>{column.label}</p>
              {column.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/tenses/${item.slug}/`}
                  className={`w-full rounded-[10px] px-2 py-2 text-[13px] font-semibold ${column.text} ${item.slug === 'now' ? 'bg-primary text-on-primary' : 'bg-white text-on-surface'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="goals">
        <h2 id="goals" className="text-headline-md">I want to…</h2>
        <ul className="mt-2">
          {core.map((goal) => <GoalRow key={goal.slug} goal={goal} />)}
        </ul>
      </section>

      {optional.length > 0 && (
        <section aria-labelledby="optional">
          <h2 id="optional" className="text-headline-md">Optional</h2>
          <p className="text-sm text-on-surface-variant">Not needed for normal conversation.</p>
          <ul className="mt-2">
            {optional.map((goal) => <GoalRow key={goal.slug} goal={goal} />)}
          </ul>
        </section>
      )}
    </div>
  )
}
