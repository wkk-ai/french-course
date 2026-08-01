'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { mergeCompletedChapterIds, readLocalCompletedChapters, subscribeCompletedChapters } from '@/lib/local-progress'
import { getAllLocalVocabulary } from '@/lib/local-vocab-vault'

type VocabProgress = { vocab_id?: string; created_at: string; last_reviewed_at: string | null }
type GrammarMastery = { grammar_category: string; total_attempts: number; correct_attempts: number }
type ChapterProgress = { chapter_id?: string; status: string; completed_at: string | null }
type GrammarRuleSummary = { slug: string; title: string; category: string }
type DailyReading = { date: string; words_read: number }

function weekLabel(date: Date): string {
  const month = date.toLocaleString('en-US', { month: 'short' })
  const weekOfMonth = Math.ceil(date.getDate() / 7)
  const year = date.getFullYear()
  return `${month} W${weekOfMonth} '${String(year).slice(2)}`
}

export default function CenterClient() {
  const [today] = useState(() => new Date().toISOString())
  const [vocabProgress, setVocabProgress] = useState<VocabProgress[]>([])
  const [grammarMastery, setGrammarMastery] = useState<GrammarMastery[]>([])
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([])
  const [dailyReading, setDailyReading] = useState<DailyReading[]>([])
  const [grammarRules, setGrammarRules] = useState<GrammarRuleSummary[]>([])
  const [localCompleted, setLocalCompleted] = useState(0)
  const [localReviewed, setLocalReviewed] = useState(0)
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const refreshLocal = () => {
      setLocalCompleted(readLocalCompletedChapters().length)
      setLocalReviewed(getAllLocalVocabulary().filter((item) => item.last_reviewed_at).length)
    }
    refreshLocal()
    return subscribeCompletedChapters(refreshLocal)
  }, [])

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

        const since = new Date()
        since.setUTCDate(since.getUTCDate() - 30)
        const sinceStr = since.toISOString().split('T')[0]

        const [vocabRes, grammarRes, chapterRes, rulesRes, readingRes] = await Promise.all([
          supabase.from('user_vocab_progress').select('vocab_id, created_at, last_reviewed_at').eq('user_id', user.id).order('created_at', { ascending: true }),
          supabase.from('user_grammar_mastery').select('grammar_category, total_attempts, correct_attempts, updated_at').eq('user_id', user.id),
          supabase.from('user_chapter_progress').select('chapter_id, status, completed_at').eq('user_id', user.id),
          supabase.from('grammar_rules').select('slug, title, category'),
          supabase
            .from('user_daily_reading_stats')
            .select('date, words_read')
            .eq('user_id', user.id)
            .gte('date', sinceStr),
        ])
        if (cancelled) return
        setVocabProgress(vocabRes.data ?? [])
        setGrammarMastery(grammarRes.data ?? [])
        setChapterProgress(chapterRes.data ?? [])
        setGrammarRules(rulesRes.data ?? [])
        setDailyReading(readingRes.data ?? [])
        setLocalCompleted(
          mergeCompletedChapterIds((chapterRes.data ?? []).map((row) => row.chapter_id).filter((id): id is string => Boolean(id))).size,
        )
        setLocalReviewed(getAllLocalVocabulary().filter((item) => item.last_reviewed_at).length)
      } finally {
        if (!cancelled) setBooting(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const vocabChartData = useMemo(() => {
    if (vocabProgress.length === 0) {
      return [{ name: 'Now', words: 0 }];
    }
    const weeks = new Map<string, number>();
    let cumulative = 0;
    vocabProgress.forEach((vp) => {
      const date = new Date(vp.created_at);
      const weekKey = weekLabel(date);
      cumulative++;
      weeks.set(weekKey, cumulative);
    });
    return Array.from(weeks.entries()).map(([name, words]) => ({ name, words }));
  }, [vocabProgress]);

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

  const heatmapData = useMemo(() => {
    const byDate = new Map(dailyReading.map((row) => [row.date, row.words_read ?? 0]))
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setUTCDate(date.getUTCDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      const words = byDate.get(dateStr) ?? 0
      // 0 / ~75 / ~150 / ~225 / 300+ words
      const intensity = words <= 0 ? 0 : words < 75 ? 1 : words < 150 ? 2 : words < 225 ? 3 : 4
      return { date, intensity, words };
    });
    return days;
  }, [dailyReading, today]);

  const getIntensityClass = (intensity: number) => {
    switch(intensity) {
      case 1: return 'bg-success/30';
      case 2: return 'bg-success/60';
      case 3: return 'bg-success/80';
      case 4: return 'bg-success';
      default: return 'bg-surface-container-high';
    }
  };

  const wordsLearned = useMemo(() => {
    const reviewed = new Set<string>()
    for (const vp of vocabProgress) {
      if (vp.last_reviewed_at && vp.vocab_id) reviewed.add(vp.vocab_id)
    }
    for (const item of getAllLocalVocabulary()) {
      if (item.last_reviewed_at) reviewed.add(item.vocab_id)
    }
    // Fallback when remote rows lack vocab_id in older clients.
    if (reviewed.size === 0) {
      return Math.max(
        vocabProgress.filter((vp) => vp.last_reviewed_at).length,
        localReviewed,
      )
    }
    return reviewed.size
  }, [vocabProgress, localReviewed])

  const completedChapters = Math.max(
    chapterProgress.filter(cp => cp.status === 'completed').length,
    localCompleted,
  )

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

      <div className="grid grid-cols-2 gap-4">
        <div className="tactile-card p-4 text-center">
          <p className="text-headline-lg text-primary font-bold">{wordsLearned}</p>
          <p className="text-label-caps text-on-surface-variant">WORDS REVIEWED</p>
        </div>
        <div className="tactile-card p-4 text-center">
          <p className="text-headline-lg text-success font-bold">{completedChapters}</p>
          <p className="text-label-caps text-on-surface-variant">CHAPTERS DONE</p>
        </div>
      </div>

      <section className="tactile-card p-6">
        <h2 className="text-body-ui font-bold text-on-surface mb-6">Words added to Review (queue)</h2>
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

      <section className="tactile-card p-6">
        <h2 className="text-body-ui font-bold text-on-surface mb-4">Reading Activity (30 Days)</h2>
        <p className="mb-3 text-sm text-on-surface-variant">Darker = more words read that day.</p>
        <div className="flex flex-wrap gap-2">
          {heatmapData.map((day, i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-sm ${getIntensityClass(day.intensity)}`}
              title={`${day.date.toDateString()}: ${day.words} words`}
            />
          ))}
        </div>
      </section>

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
