import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { GrammarRule } from '@/lib/course'
import { createClient } from '@/utils/supabase/server'

export default async function RuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('grammar_rules').select('*').eq('slug', slug).maybeSingle()
  if (!data) notFound()

  const rule = data as GrammarRule
  return (
    <article className="mx-auto max-w-[680px]">
      <Link href="/rules" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" /> Back to Rulebook</Link>
      <div className="tactile-card mt-6 p-6">
        <p className="text-label-caps text-primary">{rule.category}</p>
        <h1 className="mt-2 text-headline-lg">{rule.title}</h1>
        <p className="mt-4 text-body-reading text-on-surface-variant">{rule.full_explanation}</p>
        <h2 className="mt-8 text-headline-md">Examples</h2>
        <div className="mt-4 grid gap-3">
          {rule.examples.map((example) => (
            <blockquote key={example.french} className="rounded-lg border-l-4 border-primary bg-surface-container-low p-4">
              <p className="font-reading text-lg">{example.french}</p>
              <p className="mt-1 text-sm text-on-surface-variant">{example.english}</p>
            </blockquote>
          ))}
        </div>
      </div>
    </article>
  )
}
