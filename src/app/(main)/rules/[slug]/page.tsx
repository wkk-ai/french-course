import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import type { GrammarRule } from '@/lib/course'
import { RichText } from '@/components/RichText'
import { MODULE1_RULES } from '@/lib/module1-content'
import { createStaticClient } from '@/utils/supabase/static'

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const fromDb = supabase ? (await supabase.from('grammar_rules').select('slug')).data ?? [] : []
  const slugs = new Set([...fromDb.map((rule) => rule.slug), ...MODULE1_RULES.map((rule) => rule.slug)])
  return [...slugs].map((slug) => ({ slug }))
}

export default async function RuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createStaticClient()
  const { data } = supabase
    ? await supabase.from('grammar_rules').select('*').eq('slug', slug).maybeSingle()
    : { data: null }

  const rule = (data as GrammarRule | null) ?? MODULE1_RULES.find((item) => item.slug === slug)
  if (!rule) notFound()

  return (
    <article className="mx-auto max-w-[680px]">
      <Link href="/rules" className="inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" /> Back to Rulebook</Link>
      <div className="tactile-card mt-6 p-6">
        <p className="text-label-caps text-primary">{rule.category}</p>
        <h1 className="mt-2 text-headline-lg">{rule.title}</h1>
        <RichText text={rule.full_explanation} className="mt-4 text-body-reading text-on-surface-variant" />
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
