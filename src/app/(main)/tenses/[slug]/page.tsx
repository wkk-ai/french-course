import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { notFound } from 'next/navigation'
import { ConjugationGroups } from '@/components/tenses/ConjugationGroups'
import { ExampleBubbles } from '@/components/tenses/ExampleBubbles'
import { MiniQuiz } from '@/components/tenses/MiniQuiz'
import { Timeline } from '@/components/tenses/Timeline'
import { GOAL_BY_SLUG, TENSE_GOALS } from '@/lib/tenses/guide'
import { tablesForGoal } from '@/lib/tenses/tables'
import { DictionaryProvider, FrenchText } from '@/components/dictionary/Dictionary'

export function generateStaticParams() {
  return TENSE_GOALS.map((goal) => ({ slug: goal.slug }))
}

export default async function TenseGoalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const goal = GOAL_BY_SLUG.get(slug)
  if (!goal) notFound()

  const index = TENSE_GOALS.findIndex((item) => item.slug === goal.slug)
  const next = TENSE_GOALS[index + 1]
  const groups = tablesForGoal(goal).filter((group) => group.tables.length > 0)

  return (
    <DictionaryProvider>
    <article className="space-y-8 pb-10">
      <Link href="/tenses/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary">
        <ArrowLeft className="size-4" /> Grammar
      </Link>

      <header>
        <p className="text-label-caps text-primary">{goal.level}</p>
        <h1 className="mt-2 text-headline-lg">{goal.title}</h1>
        <p className="mt-1 text-body-ui font-semibold text-on-surface-variant">{goal.subtitle}</p>
        <p className="mt-3 text-body-ui text-on-surface">{goal.summary}</p>
      </header>

      <Timeline position={goal.timeline.position} label={goal.timeline.label} />

      <section aria-labelledby="when">
        <h2 id="when" className="text-headline-md">When to use it</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-body-ui marker:text-primary">
          {goal.whenToUse.map((line) => {
            // "English label: French example." — make the French half tappable.
            const cut = line.indexOf(': ')
            if (cut < 0) return <li key={line}>{line}</li>
            return (
              <li key={line}>
                {line.slice(0, cut + 2)}
                <FrenchText className="" text={line.slice(cut + 2)} />
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="text-headline-md">How to build it</h2>
        <ol className="mt-3 space-y-3">
          {goal.steps.map((step, stepIndex) => (
            <li key={step.title} className="tactile-card p-4">
              <p className="text-label-caps text-primary">Step {stepIndex + 1}</p>
              <p className="mt-1 font-bold text-on-surface">{step.title}</p>
              <p className="mt-1 text-body-ui text-on-surface-variant">{step.body}</p>
              {step.example && (
                <p className="mt-2 rounded-lg bg-primary-fixed/40 px-3 py-2 text-body-ui">
                  <FrenchText className="font-semibold text-ink-dark" text={step.example.fr} />
                  <span className="block text-sm text-on-surface-variant">{step.example.en}</span>
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="real">
        <h2 id="real" className="text-headline-md">Heard in real life</h2>
        <p className="mb-4 mt-1 text-sm text-on-surface-variant">Tap the speaker to hear a sentence.</p>
        <ExampleBubbles life={goal.life} work={goal.work} />
      </section>

      {goal.structure && (
        <section aria-labelledby="structure">
          <h2 id="structure" className="text-headline-md">{goal.structure.title}</h2>
          <div className="tactile-card mt-3 overflow-hidden">
            <table className="w-full text-left text-body-ui">
              <tbody>
                {goal.structure.rows.map(([pronoun, phrase]) => (
                  <tr key={pronoun} className="border-b last:border-0">
                    <td className="w-1/3 px-4 py-2 text-xs text-on-surface-variant">{pronoun}</td>
                    <td className="px-4 py-2 font-semibold text-ink-dark"><FrenchText text={phrase} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {groups.length > 0 && (
        <section aria-labelledby="tables">
          <h2 id="tables" className="text-headline-md">Full conjugation tables</h2>
          <p className="mb-4 mt-1 text-sm text-on-surface-variant">Same tables as the Conjugate button in lessons.</p>
          <ConjugationGroups groups={groups} />
        </section>
      )}

      <section aria-labelledby="traps">
        <h2 id="traps" className="text-headline-md">Common traps</h2>
        <ul className="mt-3 space-y-2">
          {goal.traps.map((trap) => (
            <li key={trap} className="rounded-xl border-2 border-warning/60 bg-warning/10 px-4 py-3 text-body-ui">{trap}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="quiz">
        <h2 id="quiz" className="text-headline-md">Try it</h2>
        <p className="mb-4 mt-1 text-sm text-on-surface-variant">Wrong answers can be retried.</p>
        <MiniQuiz questions={goal.quiz} />
      </section>

      {next && (
        <Link href={`/tenses/${next.slug}/`} className="tactile-button flex items-center justify-between gap-3 rounded-xl bg-primary px-5 py-4 font-bold text-on-primary">
          <span>NEXT: {next.title}</span>
          <ChevronRight className="size-5 shrink-0" />
        </Link>
      )}
    </article>
    </DictionaryProvider>
  )
}
