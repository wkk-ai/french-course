import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { RuleDetailClient } from '@/components/rules/RuleDetailClient'
import { MODULE1_RULES, getRuleBySlug } from '@/lib/rules/catalog'

export async function generateStaticParams() {
  return MODULE1_RULES.map((rule) => ({ slug: rule.slug }))
}

export default async function RuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const rule = getRuleBySlug(slug)
  if (!rule) notFound()

  return (
    <article className="mx-auto max-w-[680px] pb-10">
      <Link href="/rules/" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
        <ArrowLeft className="size-4" /> Back to Rulebook
      </Link>
      <RuleDetailClient rule={rule} />
    </article>
  )
}
