import type { TimelinePosition } from '@/lib/tenses/guide'

const SEGMENTS: Array<{ key: TimelinePosition | 'now'; label: string }> = [
  { key: 'past', label: 'BEFORE' },
  { key: 'now', label: 'NOW' },
  { key: 'future', label: 'LATER' },
]

/** Three-block picture: where on the time line does this tense live? */
export function Timeline({ position, label }: { position: TimelinePosition; label: string }) {
  const active = position === 'wish' ? 'now' : position
  return (
    <figure aria-label={`${label} sits ${position === 'wish' ? 'outside real time (wishes, politeness, what-ifs)' : position === 'now' ? 'at the present' : position === 'past' ? 'in the past' : 'in the future'}`}>
      <div className="flex overflow-hidden rounded-xl border-2 border-surface-variant">
        {SEGMENTS.map((segment) => {
          const on = segment.key === active
          return (
            <div
              key={segment.key}
              className={`flex-1 px-2 py-4 text-center ${on ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}
            >
              <p className="text-label-caps">{segment.label}</p>
              {on && <p className="mt-1 text-sm font-bold">{label}</p>}
            </div>
          )
        })}
      </div>
      {position === 'wish' && (
        <figcaption className="mt-2 text-sm text-on-surface-variant">
          Not a time: this tense is about politeness, wishes, conditions or what must happen.
        </figcaption>
      )}
    </figure>
  )
}
