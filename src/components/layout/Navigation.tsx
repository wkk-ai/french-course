'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ScrollText, BarChart2 } from 'lucide-react';

const navItems = [
  { name: 'Learn', href: '/', icon: Home },
  { name: 'Review', href: '/review', icon: BookOpen },
  { name: 'Rules', href: '/rules', icon: ScrollText },
  { name: 'Center', href: '/center', icon: BarChart2 },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t-2 border-surface-variant flex justify-around items-center z-50 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full relative ${
                isActive ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {isActive && (
                <div className="absolute top-[-2px] left-0 right-0 h-[4px] bg-primary rounded-b-sm" />
              )}
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-primary/20 text-primary' : ''}`} />
              <span className="text-label-caps uppercase tracking-wider">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Desktop Left Sidebar */}
      <nav className="hidden md:flex fixed top-0 left-0 bottom-0 w-24 bg-surface-container-lowest border-r-2 border-surface-variant flex-col items-center py-6 z-50">
        <div className="w-12 h-12 bg-primary rounded-xl mb-8 flex items-center justify-center">
          <span className="text-on-primary font-bold text-xl">L&apos;</span>
        </div>
        
        <div className="flex flex-col space-y-6 w-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full py-3 relative ${
                  isActive ? 'text-primary bg-primary-fixed/30' : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 bottom-0 left-[-2px] w-[6px] bg-primary rounded-r-sm" />
                )}
                <Icon className={`w-7 h-7 mb-2 ${isActive ? 'fill-primary/20 text-primary' : ''}`} />
                <span className="text-label-caps uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
