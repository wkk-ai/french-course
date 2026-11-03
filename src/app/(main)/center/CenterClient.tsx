'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { mergeCompletedChapterIds, readLocalCompletedChapters, readLocalDailyReadingHistory, readLocalStreak, subscribeCompletedChapters } from '@/lib/local-progress'
import { AccountMenu } from '@/components/auth/AccountMenu'
import { SaveCourseCard } from '@/components/SaveCourseCard'
import { SoundTest } from '@/components/SoundTest'
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
  const [grammarMastery] = useState<GrammarMastery[]>([])
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress[]>([])
  const [dailyReading, setDailyReading] = useState<DailyReading[]>([])
  const [grammarRules] = useState<GrammarRuleSummary[]>([])
  const [localCompleted, setLocalCompleted] = useState(0)
  const [localReviewed, setLocalReviewed] = useState(0)
  const [booting, setBooting] = useState(true)
  const [streakDays, setStreakDays] = useState(0)

  useEffect(() => {
    const refreshLocal = () => {
      setLocalCompleted(readLocalCompletedChapters().length)
      setStreakDays(readLocalStreak())
      setLocalReviewed(getAllLocalVocabulary().filter((item) => item.last_reviewed_at).length)
    }
    refreshLocal()
    return subscribeCompletedChapters(refreshLocal)
  }, [])

  useEffect(() => {
    void Promise.resolve().then(() => {
      const vault = getAllLocalVocabulary()
      setVocabProgress(
        vault.map((item) => ({
          vocab_id: item.vocab_id,
          created_at: item.last_reviewed_at ?? item.next_review_at,
          last_reviewed_at: item.last_reviewed_at,
        })),
      )
      setChapterProgress(
        readLocalCompletedChapters().map((id) => ({
          chapter_id: id,
          status: 'completed',
          completed_at: null,
        })),
      )
      setDailyReading(readLocalDailyReadingHistory())
      setLocalCompleted(mergeCompletedChapterIds([]).size)
      setLocalReviewed(vault.filter((item) => item.last_reviewed_at).length)
      setBooting(false)
    })
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
      <div className="flex flex-col gap-6">
        <h1 className="text-headline-lg text-on-surface">Progress</h1>
        <p className="text-sm text-on-surface-variant">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-headline-lg text-on-surface">Progress</h1>

      <div className="grid grid-cols-3 gap-3">
        <div className="tactile-card p-4">
          <p className="text-2xl font-bold text-on-surface">{streakDays}</p>
          <p className="text-xs text-on-surface-variant">Day streak</p>
        </div>
        <div className="tactile-card p-4">
          <p className="text-2xl font-bold text-on-surface">{completedChapters}</p>
          <p className="text-xs text-on-surface-variant">Lessons done</p>
        </div>
        <div className="tactile-card p-4">
          <p className="text-2xl font-bold text-on-surface">{wordsLearned}</p>
          <p className="text-xs text-on-surface-variant">Words reviewed</p>
        </div>
      </div>

      <section aria-label="Account and offline" className="tactile-card divide-y divide-surface-variant overflow-hidden">
        <AccountMenu variant="row" />
        <SaveCourseCard />
        <SoundTest />
      </section>

      <section className="tactile-card p-5">
        <h2 className="text-body-ui font-bold text-on-surface mb-6">Words in your review queue</h2>
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
                contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '8px', border: 'none', boxShadow: '0 6px 24px rgba(17,17,20,0.12)' }}
                itemStyle={{ color: 'var(--color-primary)' }}
              />
              <Area type="monotone" dataKey="words" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorWords)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="tactile-card p-5">
        <h2 className="text-body-ui font-bold text-on-surface mb-4">Reading, last 30 days</h2>
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
        <section className="tactile-card p-5">
          <h2 className="text-body-ui font-bold text-on-surface mb-6">Grammar accuracy</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={grammarChartData}>
                <PolarGrid stroke="var(--color-surface-variant)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Accuracy" dataKey="A" stroke="var(--color-success)" strokeWidth={2} fill="var(--color-success)" fillOpacity={0.5} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '8px', border: 'none', boxShadow: '0 6px 24px rgba(17,17,20,0.12)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </div>
  );
}
