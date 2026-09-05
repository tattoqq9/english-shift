import type { AppView } from '../App'
import { useEffect, useState } from 'react'
import { clearShiftLaunch, readShiftLaunch } from '../core/shiftLaunch'
import { queueBuildDayLaunch } from '../core/buildDayFlow'
import { ChapterActivityPlayer } from '../components/ChapterActivityPlayer'
import { ShiftDayResult, ShiftIntro } from '../components/ShiftExperience'
import { StoreShiftMap } from '../components/StoreShiftMap'
import { chapter8ActivityById, chapter8Days } from '../data/chapter8'

const STORAGE_KEY = 'english-shift-chapter8-progress-v1'

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


type Level1ChapterSummary = {
  chapter: number
  completed: number
  average: number | null
}

type Level1SummaryData = {
  completedDays: number
  completedChapters: number
  average: number | null
  hintFreeDays: number
  chapters: Level1ChapterSummary[]
}

function readLevel1Summary(): Level1SummaryData {
  const chapters: Level1ChapterSummary[] = []
  let completedDays = 0
  let completedChapters = 0
  let scoreSum = 0
  let scoreCount = 0
  let hintFreeDays = 0

  for (let chapter = 1; chapter <= 8; chapter += 1) {
    const firstDay = (chapter - 1) * 6 + 1
    const expectedDays = Array.from({ length: 6 }, (_, index) => firstDay + index)
    try {
      const raw = localStorage.getItem(`english-shift-chapter${chapter}-progress-v1`)
      const parsed = raw ? JSON.parse(raw) as ChapterProgress : { completedDays: [], bestScores: {}, lastHintCounts: {}, bestHintCounts: {} }
      const chapterCompleted = expectedDays.filter((day) => parsed.completedDays?.includes(day))
      const chapterScores = chapterCompleted
        .map((day) => parsed.bestScores?.[String(day)])
        .filter((score): score is number => typeof score === 'number')
      completedDays += chapterCompleted.length
      if (chapterCompleted.length === 6) completedChapters += 1
      chapterScores.forEach((score) => { scoreSum += score; scoreCount += 1 })
      chapterCompleted.forEach((day) => {
        if (parsed.bestHintCounts?.[String(day)] === 0) hintFreeDays += 1
      })
      chapters.push({
        chapter,
        completed: chapterCompleted.length,
        average: chapterScores.length ? Math.round(chapterScores.reduce((sum, score) => sum + score, 0) / chapterScores.length) : null,
      })
    } catch {
      chapters.push({ chapter, completed: 0, average: null })
    }
  }

  return {
    completedDays,
    completedChapters,
    average: scoreCount ? Math.round(scoreSum / scoreCount) : null,
    hintFreeDays,
    chapters,
  }
}

function Level1Summary() {
  const summary = readLevel1Summary()
  const complete = summary.completedDays === 48
  return (
    <section className="level1-final-summary">
      <div className="eyebrow">{complete ? 'LEVEL 1 COMPLETE' : 'LEVEL 1 PROGRESS SUMMARY'}</div>
      <h2>{complete ? '48 Shifts Complete' : `${summary.completedDays} / 48 Shifts Complete`}</h2>
      <p>{complete
        ? '8つの店舗を通して、英語を読んで情報を集め、比較し、判断し、引き継ぐLevel 1を一周しました。'
        : 'Final Chapterは完了しました。未プレイのShiftはChapterメニューからいつでも戻って実行できます。'}</p>
      <div className="level1-summary-grid">
        <div><span>Shifts</span><strong>{summary.completedDays}/48</strong></div>
        <div><span>Chapters</span><strong>{summary.completedChapters}/8</strong></div>
        <div><span>Best-score avg.</span><strong>{summary.average == null ? '—' : `${summary.average}%`}</strong></div>
        <div><span>Hint-free shifts</span><strong>{summary.hintFreeDays}</strong></div>
      </div>
      <div className="level1-chapter-summary-list">
        {summary.chapters.map((chapter) => (
          <div key={chapter.chapter}>
            <span>Chapter {chapter.chapter}</span>
            <strong>{chapter.completed}/6{chapter.average == null ? '' : ` · ${chapter.average}%`}</strong>
          </div>
        ))}
      </div>
      <div className="level1-next-note">
        <strong>{complete ? 'NEXT · LEVEL 2' : 'NEXT · COMPLETE THE REMAINING SHIFTS'}</strong>
        <span>{complete
          ? 'Level 2では同じ学習範囲を、選択式からBUILD形式へ段階的に変えて再利用できます。'
          : '全Chapterは自由に選べるため、未完了の範囲だけ後から埋められます。'}</span>
      </div>
    </section>
  )
}

function ChapterMap({ progress, onSelectDay, onBuildDay, onReset }: { progress: ChapterProgress; onSelectDay: (day: number) => void; onBuildDay?: (day: number) => void; onReset: () => void }) {
  const chapterComplete = progress.completedDays.includes(48)
  return <>
    <StoreShiftMap chapterId={8} days={chapter8Days} progress={progress} onSelectDay={onSelectDay} onBuildDay={onBuildDay} onReset={onReset} />
    {chapterComplete && <Level1Summary />}
  </>
}

function DayIntro({ dayNumber, onStart, onBack }: { dayNumber: number; onStart: () => void; onBack: () => void }) {
  const day = chapter8Days.find((item) => item.day === dayNumber)!
  return <ShiftIntro chapterId={8} day={day} onStart={onStart} onBack={onBack} />
}

function DayResult({ dayNumber, scores, hintCounts, onFinish, onBuild }: { dayNumber: number; scores: number[]; hintCounts: number[]; onFinish: (percent: number, hintsUsed: number) => void; onBuild?: () => void }) {
  const day = chapter8Days.find((item) => item.day === dayNumber)!
  return <ShiftDayResult chapterId={8} day={day} scores={scores} hintCounts={hintCounts} onFinish={onFinish} onBuild={onBuild} />
}

export function Chapter8Screen({ onNavigate }: { onNavigate?: (view: AppView) => void }) {
  const [launchRequest] = useState(() => readShiftLaunch(8, window.sessionStorage))
  useEffect(() => {
    if (launchRequest) clearShiftLaunch(window.sessionStorage)
  }, [launchRequest])
  const [progress, setProgress] = useState<ChapterProgress>(() => readProgress())
  const [selectedDay, setSelectedDay] = useState<number | null>(() => launchRequest?.day ?? null)
  const [started, setStarted] = useState(() => Boolean(launchRequest?.autoStart))
  const [activityIndex, setActivityIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [hintCounts, setHintCounts] = useState<number[]>([])
  const day = selectedDay ? chapter8Days.find((item) => item.day === selectedDay) : undefined
  const activity = day ? chapter8ActivityById(day.activityIds[activityIndex]) : undefined
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
