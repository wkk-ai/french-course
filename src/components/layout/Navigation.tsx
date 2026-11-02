'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, BookOpen, House, Layers } from 'lucide-react';
import { useReviewSessionLock } from '@/components/review/ReviewSessionLock';

/** Four tabs. Grammar holds Tenses and Rules; Progress holds stats, account and offline save. */
const navItems = [
  { name: 'Learn', href: '/', icon: House, match: ['/'] },
  { name: 'Review', href: '/review/', icon: Layers, match: ['/review'] },
  { name: 'Grammar', href: '/tenses/', icon: BookOpen, match: ['/tenses', '/rules'] },
  { name: 'Progress', href: '/center/', icon: BarChart3, match: ['/center'] },
];

export function Navigation() {
  const pathname = usePathname();
  const { active: reviewSessionActive } = useReviewSessionLock();
  const current = (pathname ?? '/').replace(/\/+$/, '') || '/';

  if (reviewSessionActive) return null;

  const isItemActive = (match: string[]) =>
    match.some((target) => (target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`)));

  return (
    <>
      {/* Phone: floating translucent tab bar */}
      <nav
        aria-label="Main"
        className="fixed inset-x-4 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-50 grid h-16 grid-cols-4 items-center rounded-full bg-white/85 shadow-[0_8px_30px_rgba(17,17,20,0.12)] backdrop-blur-xl md:hidden"
      >
        {navItems.map((item) => {
          const isActive = isItemActive(item.match);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] ${isActive ? 'font-semibold text-primary' : 'font-medium text-on-surface-variant'}`}
            >
              <Icon className="size-[22px]" strokeWidth={isActive ? 2.3 : 1.8} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Desktop: quiet left rail */}
      <nav aria-label="Main" className="fixed bottom-0 left-0 top-0 z-50 hidden w-24 flex-col items-center gap-2 bg-surface-container-low py-8 md:flex">
        {navItems.map((item) => {
          const isActive = isItemActive(item.match);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-20 flex-col items-center gap-1 rounded-2xl py-3 text-xs ${isActive ? 'bg-white font-semibold text-primary shadow-sm' : 'font-medium text-on-surface-variant hover:bg-white/60'}`}
            >
              <Icon className="size-6" strokeWidth={isActive ? 2.3 : 1.8} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
