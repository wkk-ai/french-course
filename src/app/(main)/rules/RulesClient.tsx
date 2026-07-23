'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
import type { GrammarRule } from '@/lib/course';

const categoryColorMap: Record<string, string> = {
  'Verbs': 'bg-syntax-verb',
  'Nouns': 'bg-syntax-noun',
  'Syntax': 'bg-syntax-adj',
  'Phonetics': 'bg-primary',
};

type Mastery = {
  grammar_category: string;
  total_attempts: number;
  correct_attempts: number;
};

export default function RulesClient({ rules }: { rules: GrammarRule[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mastery, setMastery] = useState<Mastery[]>([]);

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || cancelled) return
      const { data } = await supabase
        .from('user_grammar_mastery')
        .select('grammar_category, total_attempts, correct_attempts')
        .eq('user_id', user.id)
      if (!cancelled) setMastery(data ?? [])
    })().catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const categories = ['All', ...Array.from(new Set(rules.map(r => r.category)))];

  const filteredRules = rules.filter(rule => {
    const matchesCategory = activeCategory === 'All' || rule.category === activeCategory;
    const matchesSearch = !searchQuery || 
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getMastery = (category: string) => {
    const m = mastery.find((item) => item.grammar_category === category);
    return m && m.total_attempts > 0 ? Math.round((m.correct_attempts / m.total_attempts) * 100) : 0;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
        <input 
          type="text" 
          placeholder="Search grammar rules..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface-container-lowest border-2 border-surface-variant rounded-full py-3 pl-12 pr-4 text-body-ui text-on-surface outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Title Block */}
      <div>
        <h1 className="text-headline-lg text-on-surface">Grammar Rulebook</h1>
        <p className="text-body-reading text-on-surface-variant mt-2">Your complete reference guide to French structure.</p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 hide-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-label-caps font-bold transition-colors ${
              activeCategory === cat 
                ? 'bg-primary text-on-primary' 
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rule Cards */}
      {filteredRules.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant">
          <p className="text-body-ui">No grammar rules found. Complete lessons to unlock rules!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map(rule => {
            const masteryPct = getMastery(rule.slug);
            const colorClass = categoryColorMap[rule.category] || 'bg-primary';
            return (
              <Link href={`/rules/${rule.slug}`} key={rule.id} className="tactile-card p-4 flex flex-col hover:bg-surface-container-low cursor-pointer transition-colors group">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-on-primary ${colorClass}`}>
                    {rule.category}
                  </span>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-body-ui font-bold text-on-surface mb-1">{rule.title}</h3>
                <p className="text-body-ui text-on-surface-variant text-sm line-clamp-2 flex-1 mb-4">{rule.summary}</p>
                
                {/* Mastery Bar */}
                <div className="flex items-center gap-2 mt-auto">
                  <span className="text-label-caps text-on-surface-variant">MASTERY</span>
                  <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        masteryPct >= 80 ? 'bg-success' : masteryPct > 30 ? 'bg-warning' : 'bg-surface-variant'
                      }`} 
                      style={{ width: `${Math.max(masteryPct, 5)}%` }} 
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
