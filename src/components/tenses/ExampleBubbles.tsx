'use client'

import { Briefcase, Coffee } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import type { GuideExample } from '@/lib/tenses/guide'

/** Real sentences as chat bubbles: everyday life on the left, work on the right. */
export function ExampleBubbles({ life, work }: { life: GuideExample[]; work: GuideExample[] }) {
  return (
    <div className="space-y-6">
      <BubbleGroup title="Everyday life" icon="life" examples={life} />
      <BubbleGroup title="At work" icon="work" examples={work} />
    </div>
  )
}

function BubbleGroup({ title, icon, examples }: { title: string; icon: 'life' | 'work'; examples: GuideExample[] }) {
  if (!examples.length) return null
  const Icon = icon === 'life' ? Coffee : Briefcase
  const isWork = icon === 'work'
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-label-caps text-on-surface-variant">
        <Icon className="size-4" /> {title.toUpperCase()}
      </p>
      <ul className="space-y-3">
        {examples.map((example) => (
          <li key={example.fr} className={`flex ${isWork ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[92%] rounded-2xl border-2 px-4 py-3 ${
                isWork
                  ? 'rounded-br-sm border-primary-container bg-primary-fixed/40'
                  : 'rounded-bl-sm border-surface-variant bg-surface-container-lowest'
              }`}
            >
              <div className="flex items-start gap-1">
                <p className="text-body-reading text-ink-dark">{example.fr}</p>
                <SpeakButton text={example.fr} />
              </div>
              <p className="text-sm text-on-surface-variant">{example.en}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
