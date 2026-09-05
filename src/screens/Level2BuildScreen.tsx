import { useEffect, useMemo, useState } from 'react'
import type { AppView } from '../App'
import { BuildActivityPlayer } from '../components/BuildActivityPlayer'
import {
  buildPresentation,
  readBuildMode,
  readBuildProgress,
  saveBuildMode,
  saveBuildResult,
  BUILD_PROGRESS_KEY,
  type BuildActivity,
  type BuildMode,
  type BuildProgress,
} from '../core/build'
import { clearBuildDayLaunch, isSelectDayComplete, readBuildDayLaunch } from '../core/buildDayFlow'
import { chapterMeta } from '../core/navigationProgress'
import { level2BuildActivities, level2BuildDayMeta } from '../data/level2BuildActivities'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'

type Props = {
  onNavigate: (view: AppView) => void
}

const modeCopy: Record<BuildMode, string> = {
  standard: 'Standard',
  guided: 'Guided',
  challenge: 'Challenge',
}

function dayActivities(day: number) {
  return level2BuildActivities
    .filter((activity) => activity.day === day)
    .sort((a, b) => a.activityNo - b.activityNo)
}

function dayBuildCompleted(day: number, progress: BuildProgress) {
  const completed = new Set(progress.completedIds)
  return dayActivities(day).filter((activity) => completed.has(activity.id)).length
}

function firstIncompleteIndex(day: number, progress: BuildProgress) {
  const activities = dayActivities(day)
  const completed = new Set(progress.completedIds)
  const index = activities.findIndex((activity) => !completed.has(activity.id))
  return index < 0 ? 0 : index
}

function buildDayUnlocked(day: number) {
  return DEBUG_UNLOCK_ALL_DAYS || isSelectDayComplete(day, window.localStorage)
}

function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
}

export function Level2BuildScreen({ onNavigate }: Props) {
  const [progress, setProgress] = useState(() => readBuildProgress(window.localStorage))
  const [mode, setMode] = useState<BuildMode>(() => readBuildMode(window.localStorage))
  const [launchDay] = useState(() => readBuildDayLaunch(window.sessionStorage))
  const initialDay = launchDay && buildDayUnlocked(launchDay) ? launchDay : null
  const [activeDay, setActiveDay] = useState<number | null>(initialDay)
  const [activityIndex, setActivityIndex] = useState(() => initialDay ? firstIncompleteIndex(initialDay, progress) : 0)
  const [sessionScores, setSessionScores] = useState<number[]>([])
  const [dayFinished, setDayFinished] = useState(false)

  useEffect(() => {
    if (launchDay) clearBuildDayLaunch(window.sessionStorage)
  }, [launchDay])

  const activeActivities = useMemo(() => activeDay ? dayActivities(activeDay) : [], [activeDay])
  const activeActivity = activeActivities[activityIndex]
  const completed = useMemo(() => new Set(progress.completedIds), [progress])

  const openDay = (day: number) => {
    if (!buildDayUnlocked(day)) return
    setActiveDay(day)
    setActivityIndex(firstIncompleteIndex(day, progress))
    setSessionScores([])
    setDayFinished(false)
    scrollTop()
  }

  const exitDay = () => {
    setActiveDay(null)
    setActivityIndex(0)
    setSessionScores([])
    setDayFinished(false)
    scrollTop()
  }

  const completeActivity = (activity: BuildActivity, score: number) => {
    const next = saveBuildResult(progress, activity.id, score)
    window.localStorage.setItem(BUILD_PROGRESS_KEY, JSON.stringify(next))
    setProgress(next)
    setSessionScores((scores) => [...scores, score])

    if (activityIndex < activeActivities.length - 1) {
      setActivityIndex((index) => index + 1)
    } else {
      setDayFinished(true)
    }
    scrollTop()
  }

  const changeMode = (next: BuildMode) => {
    setMode(next)
    saveBuildMode(next, window.localStorage)
  }

  if (activeDay && dayFinished) {
    const activities = dayActivities(activeDay)
    const bestScores = activities
      .map((activity) => progress.bestScores[activity.id] ?? 0)
      .filter((score) => score > 0)
    const bestAverage = bestScores.length
      ? Math.round(bestScores.reduce((sum, score) => sum + score, 0) / bestScores.length)
      : 0
    const meta = level2BuildDayMeta.find((item) => item.day === activeDay)

    return (
      <main className="v060-build-day-complete">
        <section className="v060-build-day-complete-card">
          <div className="v060-shift-complete-mark" aria-hidden="true">✓</div>
          <span className="v060-kicker">BUILD COMPLETE</span>
          <h1>Day {activeDay}</h1>
          <h2>{meta?.title ?? 'Build the English'}</h2>
          <p>同じDayの3 Activitiesを「見分ける」から「作る」へ進めました。</p>

          <div className="v060-build-day-stats">
            <div><span>BUILD</span><strong>{dayBuildCompleted(activeDay, progress)}/3</strong></div>
            <div><span>Best avg.</span><strong>{bestAverage}%</strong></div>
            <div><span>Mode</span><strong>{modeCopy[mode]}</strong></div>
          </div>

          <button className="v060-primary-cta" onClick={() => onNavigate('home')}>
            Continue learning
          </button>
          <button className="v060-secondary-cta" onClick={() => onNavigate('learn')}>
            Back to Shifts
          </button>
        </section>
      </main>
    )
  }

  if (activeDay && activeActivity) {
    return (
      <main className="v060-build-day-session">
        <header className="v060-build-day-header">
          <button type="button" onClick={exitDay}>← Exit BUILD</button>
          <div>
            <span>DAY {activeDay} · BUILD</span>
            <strong>Activity {activityIndex + 1} / {activeActivities.length}</strong>
          </div>
          <div className="v060-build-day-progress" aria-hidden="true">
            <span style={{ width: `${(activityIndex / activeActivities.length) * 100}%` }} />
          </div>
        </header>

        <BuildActivityPlayer
          key={activeActivity.id}
          activity={activeActivity}
          mode={mode}
          presentation={buildPresentation(mode, (activeDay - 1) * 3 + activityIndex, activeDay)}
          onExit={exitDay}
          onComplete={(score) => completeActivity(activeActivity, score)}
        />
      </main>
    )
  }

  const unlockedDays = Array.from({ length: 48 }, (_, index) => index + 1)
    .filter((day) => buildDayUnlocked(day))

  return (
    <main className="v060-build-hub">
      <section className="v060-build-hub-head">
        <span className="v060-kicker">BUILD</span>
        <h1>Build what you learned.</h1>
        <p>SELECTを完了したDayだけが解放されます。1 Day = 3 BUILD Activitiesです。</p>
      </section>

      <details className="v060-build-settings">
        <summary>Practice settings · {modeCopy[mode]}</summary>
        <div>
          {(Object.keys(modeCopy) as BuildMode[]).map((id) => (
            <button
              type="button"
              key={id}
              className={mode === id ? 'active' : ''}
              onClick={() => changeMode(id)}
            >
              {modeCopy[id]}
            </button>
          ))}
        </div>
      </details>

      <section className="v060-build-ready-days">
        {chapterMeta.map((chapter) => {
          const firstDay = (chapter.id - 1) * 6 + 1
          const days = Array.from({ length: 6 }, (_, offset) => firstDay + offset)
          const visible = days.filter((day) => DEBUG_UNLOCK_ALL_DAYS || unlockedDays.includes(day))
          if (!visible.length) return null

          return (
            <section key={chapter.id} className="v060-build-chapter-block">
              <div className="v060-build-chapter-head">
                <span>CHAPTER {chapter.id}</span>
                <strong>{chapter.title}</strong>
              </div>
              <div className="v060-build-day-grid">
                {visible.map((day) => {
                  const done = dayBuildCompleted(day, progress)
                  const meta = level2BuildDayMeta.find((item) => item.day === day)
                  return (
                    <button
                      type="button"
                      key={day}
                      className={`v060-build-day-tile ${done === 3 ? 'complete' : ''}`}
                      onClick={() => openDay(day)}
                    >
                      <span>DAY {day}</span>
                      <strong>{meta?.title ?? `Build Day ${day}`}</strong>
                      <small>{done === 3 ? '✓ Complete · Replay' : done > 0 ? `${done}/3 · Resume` : '3 Activities · Start'}</small>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </section>

      {!unlockedDays.length && (
        <section className="v060-build-empty">
          <strong>Complete a SELECT Shift first.</strong>
          <p>SELECT Day 1を終えると、BUILD Day 1がここに解放されます。</p>
          <button className="v060-primary-cta" onClick={() => onNavigate('home')}>Go to Today</button>
        </section>
      )}
    </main>
  )
}
