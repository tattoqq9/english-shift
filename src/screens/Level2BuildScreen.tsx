import { useMemo, useState } from 'react'
import { BuildActivityPlayer } from '../components/BuildActivityPlayer'
import { buildPresentation, readBuildMode, readBuildProgress, saveBuildMode, saveBuildResult, BUILD_PROGRESS_KEY, type BuildActivity, type BuildMode } from '../core/build'
import { masteryStats, readMasteryProgress } from '../core/mastery'
import { chapterMeta } from '../core/navigationProgress'
import { level2BuildActivities, level2BuildById, level2BuildDayMeta } from '../data/level2BuildActivities'
import { grammarRegistryByKey } from '../data/grammarRegistry'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'

function level1Complete() {
  if (DEBUG_UNLOCK_ALL_DAYS) return true
  let completed = 0
  for (let chapter = 1; chapter <= 8; chapter += 1) {
    try {
      const raw = localStorage.getItem(`english-shift-chapter${chapter}-progress-v1`)
      if (!raw) continue
      const parsed = JSON.parse(raw) as { completedDays?: number[] }
      const firstDay = (chapter - 1) * 6 + 1
      const expected = Array.from({ length: 6 }, (_, index) => firstDay + index)
      completed += expected.filter((day) => parsed.completedDays?.includes(day)).length
    } catch { /* ignore */ }
  }
  return completed === 48
}

function validCompletedIds(ids: string[]) {
  return new Set(ids.filter((id) => level2BuildById.has(id)))
}

function missionUnlocked(activity: BuildActivity, completed: Set<string>) {
  if (DEBUG_UNLOCK_ALL_DAYS) return true
  const index = level2BuildActivities.findIndex((item) => item.id === activity.id)
  if (index <= 0) return true
  return completed.has(level2BuildActivities[index - 1].id)
}

function recommendedActivity(completed: Set<string>) {
  const mastery = readMasteryProgress(window.localStorage)
  const unlockedActivities = level2BuildActivities.filter((activity) => missionUnlocked(activity, completed))
  const remaining = unlockedActivities.filter((activity) => !completed.has(activity.id))
  const pool = remaining.length ? remaining : unlockedActivities
  return [...pool].sort((a, b) => {
    const score = (activity: BuildActivity) => {
      const values = activity.grammarTargets.map((ref) => mastery.entries[ref.key]).filter(Boolean).map((entry) => masteryStats(entry!).mastery)
      return values.length ? Math.min(...values) : 50
    }
    return score(a) - score(b)
  })[0]
}

const modeCopy: Record<BuildMode, { title: string; desc: string }> = {
  standard: { title: 'Standard', desc: 'Days 1–12はStructure、13–30はSemi、31–48はFreeへ段階的に移行します。' },
  guided: { title: 'Guided', desc: '全144問で文の役割を示すStructure Slotsを使います。' },
  challenge: { title: 'Challenge', desc: '全144問をスロットなしのFree Build + Checkで進めます。' },
}

export function Level2BuildScreen() {
  const [progress, setProgress] = useState(() => readBuildProgress(window.localStorage))
  const [mode, setMode] = useState<BuildMode>(() => readBuildMode(window.localStorage))
  const [active, setActive] = useState<BuildActivity | null>(null)
  const unlocked = level1Complete()
  const completed = useMemo(() => validCompletedIds(progress.completedIds), [progress])
  const recommended = useMemo(() => recommendedActivity(completed), [progress, completed])
  const activeIndex = active ? level2BuildActivities.findIndex((item) => item.id === active.id) : -1
  const nextIncomplete = level2BuildActivities.find((activity) => !completed.has(activity.id))
  const nextChapter = nextIncomplete?.chapter ?? 8

  if (!unlocked) return <main className="build-screen-shell"><section className="build-level-locked"><div className="eyebrow">LEVEL 2 · BUILD</div><h2>Complete Level 1 to unlock BUILD.</h2><p>48 Shiftsを完了すると、Level 1の144 Activityを「選ぶ」から「自分で組み立てる」練習へ変換したLevel 2へ進めます。</p><strong>DEBUG起動では最初から全144問を確認できます。</strong></section></main>

  if (active) return <BuildActivityPlayer activity={active} mode={mode} presentation={buildPresentation(mode, activeIndex, active.day)} onExit={() => setActive(null)} onComplete={(score) => {
    const next = saveBuildResult(progress, active.id, score); window.localStorage.setItem(BUILD_PROGRESS_KEY, JSON.stringify(next)); setProgress(next); setActive(null); window.scrollTo({ top: 0, behavior: 'smooth' })
  }} />

  const changeMode = (next: BuildMode) => { setMode(next); saveBuildMode(next, window.localStorage) }

  return <main className="build-screen-shell">
    <section className="build-level-hero"><div><div className="eyebrow">LEVEL 2 · BUILD · FULL COURSE</div><h2>Build the English yourself.</h2><p>Level 1の全144 Activityと1対1で対応。同じ接客状況を、今度はchunkから自分で英文へ組み立てます。48 Days × 3 Activitiesです。</p></div><div className="build-level-progress"><strong>{completed.size}</strong><span>/ {level2BuildActivities.length} activities</span></div></section>

    <section className="build-mode-selector">
      <div className="build-mode-selector-head"><span>BUILD MODE</span><strong>補助の量を選ぶ</strong><p>Standardが基本です。モードを変えても同じ144問・同じ進捗を使います。</p></div>
      <div className="build-mode-options">{(Object.keys(modeCopy) as BuildMode[]).map((id) => <button key={id} className={mode === id ? 'active' : ''} onClick={() => changeMode(id)}><span>{mode === id ? '●' : '○'}</span><strong>{modeCopy[id].title}</strong><p>{modeCopy[id].desc}</p></button>)}</div>
    </section>

    <section className="build-system-guide"><div><span>1</span><strong>Days 1–12</strong><p>Structure Slotsで文の骨格を見ながら作る。</p></div><div><span>2</span><strong>Days 13–30</strong><p>Semi-Guidedで役割ラベルを外す。</p></div><div><span>3</span><strong>Days 31–48</strong><p>Free Build + Checkで自力生成する。</p></div></section>

    {recommended && <section className="build-recommended-card"><div><span>RECOMMENDED NEXT</span><strong>Day {recommended.day} · {recommended.title}</strong><small>現在のMasteryと解放済みActivityから選択</small></div><button className="primary" onClick={() => setActive(recommended)}>Start recommended</button></section>}

    <section className="build-course-list">
      {chapterMeta.map((chapter) => {
        const chapterActivities = level2BuildActivities.filter((activity) => activity.chapter === chapter.id)
        const chapterCompleted = chapterActivities.filter((activity) => completed.has(activity.id)).length
        const chapterPercent = Math.round((chapterCompleted / chapterActivities.length) * 100)
        const chapterFirstDay = (chapter.id - 1) * 6 + 1
        return <details key={chapter.id} className="build-chapter-group" open={DEBUG_UNLOCK_ALL_DAYS ? chapter.id === 1 : chapter.id === nextChapter}>
          <summary>
            <div className="build-chapter-number">{chapterCompleted === 18 ? '✓' : chapter.id}</div>
            <div className="build-chapter-summary-copy"><span>CHAPTER {chapter.id} · DAYS {chapterFirstDay}–{chapterFirstDay + 5}</span><strong>{chapter.title}</strong><small>{chapter.subtitle}</small></div>
            <div className="build-chapter-summary-progress"><strong>{chapterCompleted}/18</strong><span>{chapterPercent}%</span></div>
          </summary>
          <div className="build-day-list">
            {Array.from({ length: 6 }, (_, dayOffset) => chapterFirstDay + dayOffset).map((day) => {
              const meta = level2BuildDayMeta.find((item) => item.day === day)
              const dayActivities = chapterActivities.filter((activity) => activity.day === day)
              const dayCompleted = dayActivities.filter((activity) => completed.has(activity.id)).length
              const dayUnlocked = DEBUG_UNLOCK_ALL_DAYS || dayActivities.some((activity) => missionUnlocked(activity, completed)) || dayCompleted > 0
              const presentation = buildPresentation(mode, (day - 1) * 3, day)
              return <details key={day} className={`build-day-group ${dayCompleted === 3 ? 'complete' : ''} ${!dayUnlocked ? 'locked' : ''}`} open={day === nextIncomplete?.day}>
                <summary>
                  <div><span>DAY {day}</span><strong>{meta?.title ?? `Build Day ${day}`}</strong><small>{meta?.subtitle ?? '3 BUILD Activities'}</small></div>
                  <div className="build-day-summary-meta"><span className={`build-support-badge ${presentation}`}>{presentation === 'guided' ? 'Structure' : presentation === 'semi' ? 'Semi' : 'Free'}</span><strong>{dayCompleted}/3</strong></div>
                </summary>
                <div className="build-day-activities">
                  {dayActivities.map((activity) => {
                    const complete = completed.has(activity.id)
                    const isUnlocked = missionUnlocked(activity, completed)
                    const best = progress.bestScores[activity.id]
                    return <article key={activity.id} className={`build-mission-card compact ${complete ? 'complete' : ''} ${!isUnlocked ? 'locked' : ''}`}>
                      <div className="build-mission-card-top"><span>ACTIVITY {activity.activityNo}</span><strong>{activity.skill ?? ''}</strong></div>
                      <h3>{activity.title}</h3>
                      <div className="build-mission-grammar">{activity.grammarTargets.map((ref) => <span key={ref.key}>{grammarRegistryByKey.get(ref.key)?.labelJa ?? ref.key}</span>)}</div>
                      <div className="build-mission-card-bottom"><span>{complete ? `Best ${best ?? 0}%` : isUnlocked ? 'Ready' : 'Locked'}</span><button className="secondary-button" disabled={!isUnlocked} onClick={() => setActive(activity)}>{complete ? 'Replay' : 'Start'}</button></div>
                    </article>
                  })}
                </div>
              </details>
            })}
          </div>
        </details>
      })}
    </section>

    <section className="build-foundation-note"><span>LEVEL 2 CURRICULUM</span><strong>48 Days × 3 Activities = 144 BUILD Activities</strong><p>Level 1と同じ接客状況・文法順序を使うため、「見分ける → 組み立てる」の学習転移をそのまま確認できます。REPAIR LAB / FLOW LABはAdvanced Trainingとして別コースのままです。</p></section>
  </main>
}
