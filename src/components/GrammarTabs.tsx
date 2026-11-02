import Link from 'next/link'

/** Segmented switch between the two halves of the Grammar tab. */
export function GrammarTabs({ active }: { active: 'tenses' | 'rules' }) {
  const item = (key: 'tenses' | 'rules', label: string, href: string) => (
    <Link
      href={href}
      aria-current={active === key ? 'page' : undefined}
      className={`flex min-h-9 items-center justify-center rounded-[9px] text-sm ${active === key ? 'bg-white font-semibold text-on-surface shadow-sm' : 'font-medium text-on-surface-variant'}`}
    >
      {label}
    </Link>
  )
  return (
    <nav aria-label="Grammar sections" className="grid grid-cols-2 gap-1 rounded-xl bg-surface-container-low p-1">
      {item('tenses', 'Tenses', '/tenses/')}
      {item('rules', 'Rules', '/rules/')}
    </nav>
  )
}
