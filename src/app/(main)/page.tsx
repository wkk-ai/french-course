import { createStaticClient } from '@/utils/supabase/static'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const supabase = createStaticClient()
  if (!supabase) {
    return (
      <section className="tactile-card p-6">
        <h1 className="text-headline-md">Course content is not available yet</h1>
        <p className="mt-2 text-on-surface-variant">Set Supabase environment variables before building or deploying.</p>
      </section>
    )
  }

  const [{ data: modules }, { data: chapters }] = await Promise.all([
    supabase.from('modules').select('*').order('order_index'),
    supabase.from('chapters').select('*').order('order_index'),
  ])

  if (!modules?.length || !chapters?.length) {
    return (
      <section className="tactile-card p-6">
        <h1 className="text-headline-md">Course content is not available yet</h1>
        <p className="mt-2 text-on-surface-variant">Run the Supabase migrations and seed file to load the learning pathway.</p>
      </section>
    )
  }

  return <HomeClient modules={modules} chapters={chapters} />
}
