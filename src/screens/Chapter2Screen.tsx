import { useState } from 'react'
import { isDayUnlocked } from '../runtimeMode'
import { ChapterActivityPlayer } from '../components/ChapterActivityPlayer'
import { gradeFromPercent } from '../core/chapter1'
import { chapter2ActivityById, chapter2Days } from '../data/chapter2'

const STORAGE_KEY = 'english-shift-chapter2-progress-v1'

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

function ChapterMap({ progress, onSelectDay, onReset }: { progress: ChapterProgress; onSelectDay: (day: number) => void; onReset: () => void }) {
  const unlockedDay = Math.min(12, Math.max(7, 7 + progress.completedDays.length))
  const chapterComplete = progress.completedDays.includes(12)

  return (
    <main className="chapter-map chapter-two">
      <section className="chapter-hero">
        <div>
          <div className="eyebrow">LEVEL 1 · CHAPTER 2</div>
          <h2>Clothing Store</h2>
          <p>Day 7〜12では、商品を「見つける」だけでなく、比較・用途・過去の購入・交換理由から最適な1着を判断します。</p>
          <p className="chapter-free-access-note">前のChapterを未完了でも、このChapterから自由に始められます。DayはChapter内で順番に解禁されます。</p>
        </div>
        <div className="chapter-progress-ring"><strong>{progress.completedDays.length}</strong><span>/ 6 shifts</span></div>
      </section>

      <div className="chapter-day-grid">
        {chapter2Days.map((day) => {
          const completed = progress.completedDays.includes(day.day)
          const unlocked = isDayUnlocked(completed || day.day <= unlockedDay)
          const best = progress.bestScores[String(day.day)]
          return (
            <button key={day.day} className={`chapter-day-card ${completed ? 'completed' : ''}`} disabled={!unlocked} onClick={() => onSelectDay(day.day)}>
              <div className="chapter-day-number">DAY {day.day}</div>
              <h3>{day.title}</h3>
              <p>{day.subtitle}</p>
              <div className="chapter-day-meta"><span>{day.gameFocus}</span><strong>{completed ? `✓ ${best ?? 0}%` : unlocked ? 'PLAY' : 'LOCKED'}</strong></div>
            </button>
          )
        })}
      </div>

      {chapterComplete && (
        <section className="chapter-clear-card">
          <div className="eyebrow">CHAPTER CLEAR</div>
          <h2>Clothing Store Complete</h2>
          <p>比較・用途・購入履歴・交換までをLevel 1の選択式で一周しました。次Chapterでは経験・助言・条件表現へ進めます。</p>
        </section>
      )}

      <details className="chapter-reset-details">
        <summary>Progress options</summary>
        <button className="secondary-button" onClick={onReset}>Reset Chapter 2 progress</button>
      </details>
    </main>
  )
}

function DayIntro({ dayNumber, onStart, onBack }: { dayNumber: number; onStart: () => void; onBack: () => void }) {
  const day = chapter2Days.find((item) => item.day === dayNumber)!
  return (
    <main className="chapter-day-intro">
      <button className="chapter-back" onClick={onBack}>← Chapter map</button>
      <div className="eyebrow">CHAPTER 2 · DAY {day.day}</div>
      <h2>{day.title}</h2>
      <p className="chapter-day-subtitle">{day.subtitle}</p>
      <div className="chapter-plan-grid">
        <div><span>Game focus</span><strong>{day.gameFocus}</strong></div>
        <div><span>Activities</span><strong>{day.activityIds.length}</strong></div>
      </div>
      <section className="chapter-language-card">
        <div><strong>NEW</strong>{day.newLanguage.length ? day.newLanguage.map((item) => <span key={item}>{item}</span>) : <span>新規なし・総復習</span>}</div>
        <div><strong>REVIEW</strong>{day.reviewLanguage.length ? day.reviewLanguage.map((item) => <span key={item}>{item}</span>) : <span>—</span>}</div>
      </section>
      <section className="chapter-can-do"><div className="eyebrow">TODAY'S CAN-DO</div>{day.canDo.map((item) => <p key={item}>✓ {item}</p>)}</section>
      <button className="primary chapter-start" onClick={onStart}>Start Day {day.day}</button>
    </main>
  )
}

function DayResult({ dayNumber, scores, hintCounts, onFinish }: { dayNumber: number; scores: number[]; hintCounts: number[]; onFinish: (percent: number, hintsUsed: number) => void }) {
  const day = chapter2Days.find((item) => item.day === dayNumber)!
  const total = scores.reduce((sum, value) => sum + value, 0)
  const max = day.activityIds.length * 100
  const percent = max ? Math.round((total / max) * 100) : 0
  const grade = gradeFromPercent(percent)
  const hintsUsed = hintCounts.reduce((sum, value) => sum + value, 0)

  return (
    <main className="chapter-day-result">
      <div className="eyebrow">SHIFT COMPLETE · DAY {day.day}</div>
      <div className="chapter-result-head">
        <div><h2>{day.title} Complete</h2><p>{day.subtitle}</p></div>
        <div className={`grade-badge grade-${grade.toLowerCase()}`}>{grade}</div>
      </div>
      <div className="chapter-day-score-grid">
        <div><span>Score</span><strong>{percent}%</strong></div>
        <div><span>Activities</span><strong>{scores.length}/{day.activityIds.length}</strong></div>
        <div><span>Best activity</span><strong>{Math.max(...scores)}%</strong></div>
        <div><span>Japanese hints</span><strong>{hintsUsed}</strong></div>
      </div>
      <div className="chapter-hint-note">日本語ヒントは減点されません。少ないほど、自力で読めた英文が増えた目安になります。</div>
      <section className="chapter-can-do result-can-do">
        <div className="eyebrow">YOU PRACTICED</div>
        {day.canDo.map((item) => <p key={item}>✓ {item}</p>)}
      </section>
      <div className="chapter-activity-score-list">
        {scores.map((score, index) => <div key={index}><span>Activity {index + 1}</span><strong>{score}/100</strong></div>)}
      </div>
      <button className="primary chapter-start" onClick={() => onFinish(percent, hintsUsed)}>{day.day === 12 ? 'Complete Chapter' : 'Finish Day'}</button>
    </main>
  )
}

export function Chapter2Screen() {
  const [progress, setProgress] = useState<ChapterProgress>(() => readProgress())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [started, setStarted] = useState(false)
  const [activityIndex, setActivityIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [hintCounts, setHintCounts] = useState<number[]>([])
  const day = selectedDay ? chapter2Days.find((item) => item.day === selectedDay) : undefined
  const activity = day ? chapter2ActivityById(day.activityIds[activityIndex]) : undefined
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

  if (!selectedDay) return <ChapterMap progress={progress} onSelectDay={selectDay} onReset={reset} />
  if (!started) return <DayIntro dayNumber={selectedDay} onStart={startDay} onBack={() => { setSelectedDay(null); scrollTop() }} />
  if (dayDone) return <DayResult dayNumber={selectedDay} scores={scores} hintCounts={hintCounts} onFinish={finishDay} />
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
