import type { AppView } from '../App'
import { useEffect, useState } from 'react'
import { clearShiftLaunch, readShiftLaunch } from '../core/shiftLaunch'
import { queueBuildDayLaunch } from '../core/buildDayFlow'
import { ChapterActivityPlayer } from '../components/ChapterActivityPlayer'
import { ShiftDayResult, ShiftIntro } from '../components/ShiftExperience'
import { StoreShiftMap } from '../components/StoreShiftMap'
import { chapter3ActivityById, chapter3Days } from '../data/chapter3'

const STORAGE_KEY = 'english-shift-chapter3-progress-v1'

type ChapterProgress = {
  completedDays: number[]
  bestScores: Record<string, number>
  lastHintCounts: Record<string, number>
  bestHintCounts: Record<string, number>
}

function readProgress(): ChapterProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completedDays: [], bestScores: {}, lastHintCounts: {}, bestHintCounts: {} }
    const parsed = JSON.parse(raw) as ChapterProgress
    return {
      completedDays: Array.isArray(parsed.completedDays) ? parsed.completedDays : [],
      bestScores: parsed.bestScores ?? {},
      lastHintCounts: parsed.lastHintCounts ?? {},
      bestHintCounts: parsed.bestHintCounts ?? {},
    }
  } catch {
    return { completedDays: [], bestScores: {}, lastHintCounts: {}, bestHintCounts: {} }
  }
}

function saveProgress(progress: ChapterProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
}

function ChapterMap({ progress, onSelectDay, onBuildDay, onReset }: { progress: ChapterProgress; onSelectDay: (day: number) => void; onBuildDay?: (day: number) => void; onReset: () => void }) {
  return <StoreShiftMap chapterId={3} days={chapter3Days} progress={progress} onSelectDay={onSelectDay} onBuildDay={onBuildDay} onReset={onReset} />
}

function DayIntro({ dayNumber, onStart, onBack }: { dayNumber: number; onStart: () => void; onBack: () => void }) {
  const day = chapter3Days.find((item) => item.day === dayNumber)!
  return <ShiftIntro chapterId={3} day={day} onStart={onStart} onBack={onBack} />
}

function DayResult({ dayNumber, scores, hintCounts, onFinish, onBuild }: { dayNumber: number; scores: number[]; hintCounts: number[]; onFinish: (percent: number, hintsUsed: number) => void; onBuild?: () => void }) {
  const day = chapter3Days.find((item) => item.day === dayNumber)!
  return <ShiftDayResult chapterId={3} day={day} scores={scores} hintCounts={hintCounts} onFinish={onFinish} onBuild={onBuild} />
}

export function Chapter3Screen({ onNavigate }: { onNavigate?: (view: AppView) => void }) {
  const [launchRequest] = useState(() => readShiftLaunch(3, window.sessionStorage))
  useEffect(() => {
    if (launchRequest) clearShiftLaunch(window.sessionStorage)
  }, [launchRequest])
  const [progress, setProgress] = useState<ChapterProgress>(() => readProgress())
  const [selectedDay, setSelectedDay] = useState<number | null>(() => launchRequest?.day ?? null)
  const [started, setStarted] = useState(() => Boolean(launchRequest?.autoStart))
  const [activityIndex, setActivityIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [hintCounts, setHintCounts] = useState<number[]>([])
  const day = selectedDay ? chapter3Days.find((item) => item.day === selectedDay) : undefined
  const activity = day ? chapter3ActivityById(day.activityIds[activityIndex]) : undefined
  const dayDone = Boolean(day && started && activityIndex >= day.activityIds.length)


  const selectDay = (dayNumber: number) => {
    setSelectedDay(dayNumber)
    setStarted(false)
    setActivityIndex(0)
    setScores([])
    setHintCounts([])
    scrollTop()
  }

  const startDay = () => {
    setStarted(true)
    setActivityIndex(0)
    setScores([])
    setHintCounts([])
    scrollTop()
  }

  const completeActivity = (score: number, hintsUsed: number) => {
    setScores((current) => [...current, score])
    setHintCounts((current) => [...current, hintsUsed])
    setActivityIndex((current) => current + 1)
    scrollTop()
  }

  const finishDay = (percent: number, hintsUsed: number) => {
    if (!selectedDay) return
    const completedDays = [...new Set([...progress.completedDays, selectedDay])].sort((a, b) => a - b)
    const currentBest = progress.bestScores[String(selectedDay)] ?? 0
    const previousBestHints = progress.bestHintCounts[String(selectedDay)]
    const nextProgress = {
      completedDays,
      bestScores: { ...progress.bestScores, [String(selectedDay)]: Math.max(currentBest, percent) },
      lastHintCounts: { ...progress.lastHintCounts, [String(selectedDay)]: hintsUsed },
      bestHintCounts: {
        ...progress.bestHintCounts,
        [String(selectedDay)]: previousBestHints == null ? hintsUsed : Math.min(previousBestHints, hintsUsed),
      },
    }
    setProgress(nextProgress)
    saveProgress(nextProgress)
    setSelectedDay(null)
    setStarted(false)
    setActivityIndex(0)
    setScores([])
    setHintCounts([])
    scrollTop()
  }

  const reset = () => {
    const empty = { completedDays: [], bestScores: {}, lastHintCounts: {}, bestHintCounts: {} }
    setProgress(empty)
    saveProgress(empty)
    setSelectedDay(null)
    setStarted(false)
    scrollTop()
  }

  if (!selectedDay) return <ChapterMap progress={progress} onSelectDay={selectDay} onBuildDay={onNavigate ? (day) => { queueBuildDayLaunch(day, window.sessionStorage); onNavigate('build') } : undefined} onReset={reset} />
  if (!started) return <DayIntro dayNumber={selectedDay} onStart={startDay} onBack={() => { setSelectedDay(null); scrollTop() }} />
  if (dayDone) return <DayResult dayNumber={selectedDay} scores={scores} hintCounts={hintCounts} onFinish={finishDay} onBuild={onNavigate ? () => { queueBuildDayLaunch(selectedDay, window.sessionStorage); onNavigate('build') } : undefined} />
  if (!activity || !day) return <main className="chapter-day-result"><h2>Activity data not found.</h2></main>

  return (
    <main className="chapter-play">
      <div className="chapter-play-header">
        <div><div className="eyebrow">DAY {day.day} · ACTIVITY {activityIndex + 1}/{day.activityIds.length}</div><h2>{activity.title}</h2></div>
        <div className="chapter-mini-score"><span>Day score</span><strong>{scores.reduce((sum, value) => sum + value, 0)}</strong></div>
      </div>
      <div className="chapter-progress-track"><span style={{ width: `${(activityIndex / day.activityIds.length) * 100}%` }} /></div>
      <ChapterActivityPlayer key={activity.id} activity={activity} onComplete={completeActivity} />
    </main>
  )
}
