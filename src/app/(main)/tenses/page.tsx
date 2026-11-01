import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { TENSE_GOALS } from '@/lib/tenses/guide'

export const metadata = { title: 'How do I say it? · L’Art du Français' }

const OVERVIEW: Array<{ when: string; tense: string; example: string }> = [
  { when: 'Now, habits', tense: 'Présent', example: 'Je travaille.' },
  { when: 'Plans', tense: 'Futur proche', example: 'Je vais travailler.' },
  { when: 'Promises, formal future', tense: 'Futur simple', example: 'Je travaillerai.' },
  { when: 'Finished events', tense: 'Passé composé', example: "J'ai travaillé." },
  { when: 'Background, used to', tense: 'Imparfait', example: 'Je travaillais.' },
  { when: 'Just did / doing now', tense: 'venir de · en train de', example: 'Je viens de travailler.' },
  { when: 'Polite, would', tense: 'Conditionnel', example: 'Je travaillerais.' },
  { when: 'Orders, advice', tense: 'Impératif', example: 'Travaille !' },
]

export default function TensesHub() {
  const core = TENSE_GOALS.filter((goal) => goal.level !== 'Optional')
  const optional = TENSE_GOALS.filter((goal) => goal.level === 'Optional')

  return (
    <div className="space-y-8 pb-10">
      <header>
        <p className="text-label-caps text-primary">ALWAYS OPEN · PICK ANYTHING</p>
        <h1 className="mt-2 text-headline-lg">How do I say it?</h1>
        <p className="mt-3 text-body-ui text-on-surface-variant">
          Start from what you want to say. Each page is a full mini-lesson: when to use it, how to build it,
          real sentences from daily life and work, full conjugation tables, and a quick quiz. Jump straight in. No order needed.
        </p>
      </header>

      <section aria-labelledby="map" className="tactile-card p-4">
        <h2 id="map" className="text-headline-md">One verb, every time</h2>
        <p className="mt-1 text-sm text-on-surface-variant">The same verb (travailler) in each main tense.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-body-ui">
            <thead>
              <tr className="border-b-2 border-surface-variant text-xs text-on-surface-variant">
                <th className="py-2 pr-3 font-bold">I want to say…</th>
                <th className="py-2 pr-3 font-bold">Tense</th>
                <th className="py-2 font-bold">Example</th>
              </tr>
            </thead>
            <tbody>
              {OVERVIEW.map((row) => (
                <tr key={row.tense} className="border-b border-surface-container-high last:border-0">
                  <td className="py-2 pr-3 text-on-surface-variant">{row.when}</td>
                  <td className="py-2 pr-3 font-semibold">{row.tense}</td>
                  <td className="py-2 font-semibold text-ink-dark">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="goals">
        <h2 id="goals" className="text-headline-md">Pick what you want to say</h2>
        <ul className="mt-4 space-y-3">
          {core.map((goal) => (
            <li key={goal.slug}>
              <Link href={`/tenses/${goal.slug}/`} className="tactile-card flex min-h-16 items-center justify-between gap-3 p-4">
                <span>
                  <span className="block text-body-ui font-bold text-on-surface">{goal.title}</span>
                  <span className="block text-sm text-on-surface-variant">{goal.subtitle}</span>
                </span>
                <ChevronRight className="size-5 shrink-0 text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {optional.length > 0 && (
        <section aria-labelledby="optional">
          <h2 id="optional" className="text-headline-md">Optional · skip if you like</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Not needed for normal conversation. Come back later.</p>
          <ul className="mt-4 space-y-3">
            {optional.map((goal) => (
              <li key={goal.slug}>
                <Link href={`/tenses/${goal.slug}/`} className="tactile-card flex min-h-16 items-center justify-between gap-3 border-dashed p-4">
                  <span>
                    <span className="block text-body-ui font-bold text-on-surface">{goal.title}</span>
                    <span className="block text-sm text-on-surface-variant">{goal.subtitle}</span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-on-surface-variant" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
