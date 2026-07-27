'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

type VocabProgress = { created_at: string; last_reviewed_at: string | null }
type GrammarMastery = { grammar_category: string; total_attempts: number; correct_attempts: number }
type ChapterProgress = { status: string; completed_at: string | null }
type GrammarRuleSummary = { slug: string; title: string; category: string }

export default function CenterClient() {
  const [today] = useState(() => new Date().toISOString())
  const [vocabProgress, setVocabProgress] = useState<VocabProgress[]>([])
  const [grammarMastery, setGrammarMastery] = useState<GrammarMastery[]>([])
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([])
  const [grammarRules, setGrammarRules] = useState<GrammarRuleSummary[]>([])
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user || cancelled) {
          if (!cancelled) setBooting(false)
          return
        }

        const [vocabRes, grammarRes, chapterRes, rulesRes] = await Promise.all([
          supabase.from('user_vocab_progress').select('created_at, last_reviewed_at').eq('user_id', user.id).order('created_at', { ascending: true }),
          supabase.from('user_grammar_mastery').select('grammar_category, total_attempts, correct_attempts, updated_at').eq('user_id', user.id),
          supabase.from('user_chapter_progress').select('status, completed_at').eq('user_id', user.id),
          supabase.from('grammar_rules').select('slug, title, category'),
        ])
        if (cancelled) return
        setVocabProgress(vocabRes.data ?? [])
        setGrammarMastery(grammarRes.data ?? [])
        setChapterProgress(chapterRes.data ?? [])
        setGrammarRules(rulesRes.data ?? [])
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])
  // Build vocab growth chart data from actual progress
  const vocabChartData = useMemo(() => {
    if (vocabProgress.length === 0) {
      return [{ name: 'Now', words: 0 }];
    }
    // Group by week
    const weeks = new Map<string, number>();
    let cumulative = 0;
    vocabProgress.forEach((vp) => {
      const date = new Date(vp.created_at);
      const weekKey = `W${Math.ceil((date.getDate()) / 7)}`;
      cumulative++;
      weeks.set(weekKey, cumulative);
    });
    return Array.from(weeks.entries()).map(([name, words]) => ({ name, words }));
  }, [vocabProgress]);

  // Build grammar radar chart data
  const grammarChartData = useMemo(() => {
    if (grammarMastery.length === 0) {
      return [{ subject: 'No Data', A: 0, fullMark: 100 }];
    }
    return grammarMastery.map(gm => ({
      subject: grammarRules.find((rule) => rule.slug === gm.grammar_category)?.title.substring(0, 15) ?? gm.grammar_category,
      A: gm.total_attempts ? Math.round((gm.correct_attempts / gm.total_attempts) * 100) : 0,
      fullMark: 100
    }));
  }, [grammarMastery, grammarRules]);

  // Build activity heatmap from chapter progress
  const heatmapData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      
      // Count completions on this day
      const completions = chapterProgress.filter(cp => 
        cp.completed_at && cp.completed_at.startsWith(dateStr)
      ).length;

      const vocabReviews = vocabProgress.filter(vp => 
        vp.last_reviewed_at && vp.last_reviewed_at.startsWith(dateStr)
      ).length;

      const intensity = Math.min(completions + Math.floor(vocabReviews / 3), 4);
      return { date, intensity };
    });
    return days;
  }, [chapterProgress, vocabProgress, today]);

  const getIntensityClass = (intensity: number) => {
    switch(intensity) {
      case 1: return 'bg-success/30';
      case 2: return 'bg-success/60';
      case 3: return 'bg-success/80';
      case 4: return 'bg-success';
      default: return 'bg-surface-container-high';
    }
  };

  const completedChapters = chapterProgress.filter(cp => cp.status === 'completed').length;
  const totalVocab = vocabProgress.length;

  if (booting) {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-headline-lg text-on-surface">Command Center</h1>
          <p className="text-body-reading text-on-surface-variant mt-2">Loading your stats…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-headline-lg text-on-surface">Command Center</h1>
        <p className="text-body-reading text-on-surface-variant mt-2">Track your linguistic growth.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="tactile-card p-4 text-center">
          <p className="text-headline-lg text-primary font-bold">{totalVocab}</p>
          <p className="text-label-caps text-on-surface-variant">WORDS LEARNED</p>
        </div>
        <div className="tactile-card p-4 text-center">
          <p className="text-headline-lg text-success font-bold">{completedChapters}</p>
          <p className="text-label-caps text-on-surface-variant">CHAPTERS DONE</p>
        </div>
      </div>

      {/* Vocabulary Growth */}
      <section className="tactile-card p-6">
        <h2 className="text-body-ui font-bold text-on-surface mb-6">Vocabulary Growth</h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vocabChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-variant)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '8px', border: '2px solid var(--color-surface-variant)' }}
                itemStyle={{ color: 'var(--color-primary)' }}
              />
              <Area type="monotone" dataKey="words" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorWords)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Reading Activity (Heatmap) */}
      <section className="tactile-card p-6">
        <h2 className="text-body-ui font-bold text-on-surface mb-4">Reading Activity (30 Days)</h2>
        <div className="flex flex-wrap gap-2">
          {heatmapData.map((day, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-sm ${getIntensityClass(day.intensity)}`}
              title={`${day.date.toDateString()}`}
            />
          ))}
        </div>
      </section>

      {/* Grammar Accuracy (Radar) */}
      {grammarMastery.length > 0 && (
        <section className="tactile-card p-6">
          <h2 className="text-body-ui font-bold text-on-surface mb-6">Grammar Accuracy</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={grammarChartData}>
                <PolarGrid stroke="var(--color-surface-variant)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Accuracy" dataKey="A" stroke="var(--color-success)" strokeWidth={2} fill="var(--color-success)" fillOpacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '8px', border: '2px solid var(--color-surface-variant)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}
