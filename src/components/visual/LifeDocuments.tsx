'use client'

import { useState, type ReactNode } from 'react'
import { CalendarDays, Eye, EyeOff, Receipt, Smartphone, UserRound, Users, UtensilsCrossed } from 'lucide-react'
import { SpeakButton } from '@/components/SpeakButton'
import type { LifeDocument, Line } from '@/lib/visual/types'

type RenderFrench = (text: string, prefix: string) => ReactNode

/** Shows real-life documents (chat, menu, bill, ID card, agenda, family) with tappable French. */
export function LifeDocuments({ documents, renderFrench }: { documents: LifeDocument[]; renderFrench: RenderFrench }) {
  const [showEnglish, setShowEnglish] = useState(false)
  if (!documents.length) return null

  return (
    <section aria-labelledby="in-real-life" className="mb-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-label-caps text-primary">IN REAL LIFE</p>
          <h2 id="in-real-life" className="text-headline-md">What you would really see</h2>
        </div>
        <button
          type="button"
          aria-pressed={showEnglish}
          onClick={() => setShowEnglish((value) => !value)}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-surface-variant bg-surface-container-lowest px-3 text-sm font-bold text-on-surface"
        >
          {showEnglish ? <EyeOff className="size-4" /> : <Eye className="size-4" />} {showEnglish ? 'Hide English' : 'Show English'}
        </button>
      </div>
      <p className="mt-1 text-sm text-on-surface-variant">Try to read first. Tap any word for its meaning.</p>
      <div className="mt-4 space-y-6">
        {documents.map((doc, index) => (
          <DocumentView key={`${doc.kind}-${index}`} doc={doc} docIndex={index} showEnglish={showEnglish} renderFrench={renderFrench} />
        ))}
      </div>
    </section>
  )
}

function English({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null
  return <span className="english-gloss block text-sm text-on-surface-variant">{children}</span>
}

function DocumentView({ doc, docIndex, showEnglish, renderFrench }: { doc: LifeDocument; docIndex: number; showEnglish: boolean; renderFrench: RenderFrench }) {
  const key = (n: string) => `doc${docIndex}-${n}`
  const fr = (line: Line, n: string) => renderFrench(line.fr, key(n))

  switch (doc.kind) {
    case 'chat':
      return (
        <figure aria-label={doc.title} className="overflow-hidden rounded-2xl border-2 border-surface-variant bg-surface-container-low">
          <figcaption className="flex items-center gap-2 border-b-2 border-surface-variant bg-surface-container-lowest px-4 py-3">
            <Smartphone className="size-4 text-primary" />
            <span className="text-sm font-bold">{doc.app}</span>
            <span className="text-sm text-on-surface-variant">· {doc.contact}</span>
          </figcaption>
          <ul className="space-y-3 p-4">
            {doc.messages.map((message, i) => (
              <li key={i} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] rounded-2xl px-4 py-2 ${message.from === 'me' ? 'rounded-br-sm bg-primary-fixed' : 'rounded-bl-sm border-2 border-surface-variant bg-surface-container-lowest'}`}>
                  {message.name && <p className="text-xs font-bold text-primary">{message.name}</p>}
                  <div className="flex items-start gap-1">
                    <div>{fr(message, `m${i}`)}</div>
                    <SpeakButton text={message.fr} />
                  </div>
                  <English show={showEnglish}>{message.en}</English>
                </div>
              </li>
            ))}
          </ul>
        </figure>
      )

    case 'menu':
      return (
        <figure aria-label={doc.title} className="rounded-2xl border-2 border-dashed border-ink-medium bg-reading-bg p-5">
          <figcaption className="text-center">
            <UtensilsCrossed className="mx-auto size-5 text-secondary" />
            <div className="mt-1 text-headline-md">{fr(doc.place, 'place')}</div>
            <English show={showEnglish}>{doc.place.en}</English>
          </figcaption>
          {doc.sections.map((section, s) => (
            <div key={s} className="mt-5">
              <div className="border-b-2 border-ink-dark pb-1 text-label-caps text-secondary">{fr(section.heading, `h${s}`)}</div>
              <English show={showEnglish}>{section.heading.en}</English>
              <ul className="mt-2 space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3">
                    <div>
                      {fr(item, `s${s}i${i}`)}
                      <English show={showEnglish}>{item.en}</English>
                    </div>
                    <span className="shrink-0 font-bold text-ink-dark">{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </figure>
      )

    case 'receipt':
      return (
        <figure aria-label={doc.title} className="mx-auto max-w-sm rounded-sm border-2 border-dashed border-ink-medium bg-reading-bg p-5 font-mono">
          <figcaption className="text-center">
            <Receipt className="mx-auto size-5 text-ink-medium" />
            <div className="mt-1 text-lg font-bold">{fr(doc.place, 'place')}</div>
            <English show={showEnglish}>{doc.place.en}</English>
          </figcaption>
          <ul className="mt-4 space-y-2 border-y-2 border-dashed border-ink-medium py-3">
            {doc.lines.map((line, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3">
                <div>
                  {fr(line, `l${i}`)}
                  <English show={showEnglish}>{line.en}</English>
                </div>
                <span className="shrink-0">{line.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between gap-3 font-bold">
            <div>
              {fr(doc.total.label, 'total')}
              <English show={showEnglish}>{doc.total.label.en}</English>
            </div>
            <span>{doc.total.amount}</span>
          </div>
          <div className="mt-4 text-center">
            {fr(doc.footer, 'footer')}
            <English show={showEnglish}>{doc.footer.en}</English>
          </div>
        </figure>
      )

    case 'idcard':
      return (
        <figure aria-label={doc.title} className="rounded-2xl border-2 border-primary-container bg-primary-fixed/40 p-5">
          <figcaption className="flex items-center gap-2 text-label-caps text-primary"><UserRound className="size-4" />{fr(doc.header, 'header')}</figcaption>
          <English show={showEnglish}>{doc.header.en}</English>
          <dl className="mt-3 grid grid-cols-2 gap-3">
            {doc.fields.map((field, i) => (
              <div key={i}>
                <dt className="text-xs font-bold text-on-surface-variant">{fr(field.label, `fl${i}`)}</dt>
                <dd className="font-semibold">{fr(field.value, `fv${i}`)}</dd>
                <English show={showEnglish}>{field.label.en}: {field.value.en}</English>
              </div>
            ))}
          </dl>
        </figure>
      )

    case 'agenda':
      return (
        <figure aria-label={doc.title} className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest">
          <figcaption className="flex items-center gap-2 border-b-2 border-surface-variant px-4 py-3 text-sm font-bold"><CalendarDays className="size-4 text-primary" /> {doc.title}</figcaption>
          <ul className="divide-y divide-surface-variant">
            {doc.days.map((day, d) => (
              <li key={d} className="flex gap-4 px-4 py-3">
                <div className="w-24 shrink-0">
                  <div className="font-bold text-primary">{fr(day.day, `d${d}`)}</div>
                  <English show={showEnglish}>{day.day.en}</English>
                </div>
                <ul className="space-y-1">
                  {day.items.map((item, i) => (
                    <li key={i}>
                      {item.time && <span className="mr-2 rounded bg-surface-container px-1.5 py-0.5 text-xs font-bold">{item.time}</span>}
                      {fr(item, `d${d}i${i}`)}
                      <English show={showEnglish}>{item.en}</English>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </figure>
      )

    case 'family':
      return (
        <figure aria-label={doc.title} className="rounded-2xl border-2 border-surface-variant bg-surface-container-lowest p-5">
          <figcaption className="flex items-center gap-2 text-sm font-bold"><Users className="size-4 text-primary" /> {doc.title}</figcaption>
          <div className="mt-4 flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-3">
              {doc.parents.map((person, i) => <PersonBox key={i} line={person} n={`p${i}`} showEnglish={showEnglish} fr={fr} />)}
            </div>
            <div aria-hidden className="h-4 w-0.5 bg-ink-medium" />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <PersonBox line={doc.siblings[0]} n="s0" showEnglish={showEnglish} fr={fr} />
              <PersonBox line={doc.me} n="me" showEnglish={showEnglish} fr={fr} highlight />
              {doc.siblings.slice(1).map((person, i) => <PersonBox key={i} line={person} n={`s${i + 1}`} showEnglish={showEnglish} fr={fr} />)}
            </div>
          </div>
        </figure>
      )
  }
}

function PersonBox({ line, n, showEnglish, fr, highlight }: { line: Line; n: string; showEnglish: boolean; fr: (line: Line, n: string) => ReactNode; highlight?: boolean }) {
  return (
    <div className={`min-w-28 rounded-xl border-2 px-3 py-2 text-center ${highlight ? 'border-primary bg-primary text-on-primary [&_.english-gloss]:text-on-primary' : 'border-surface-variant bg-surface-container-low'}`}>
      <div className={highlight ? '[&_button]:text-on-primary [&_p]:text-on-primary' : ''}>{fr(line, n)}</div>
      <English show={showEnglish}>{line.en}</English>
    </div>
  )
}
