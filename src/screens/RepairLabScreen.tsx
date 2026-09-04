import { useState } from 'react'
import { RepairActivityPlayer } from '../components/RepairActivityPlayer'
import { ADVANCED_PROGRESS_KEY, readAdvancedProgress, saveRepairResult, type RepairActivity } from '../core/advanced'
import { repairActivities, repairUnits } from '../data/advancedTrainingActivities'
import { grammarRegistryByKey } from '../data/grammarRegistry'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'

function level1Complete() {
  if (DEBUG_UNLOCK_ALL_DAYS) return true
  let completed = 0
  for (let chapter = 1; chapter <= 8; chapter += 1) {
    try {
      const raw = localStorage.getItem(`english-shift-chapter${chapter}-progress-v1`)
      const days = raw ? (JSON.parse(raw) as { completedDays?: number[] }).completedDays ?? [] : []
      const first = (chapter - 1) * 6 + 1
      completed += Array.from({ length: 6 }, (_, i) => first + i).filter((day) => days.includes(day)).length
    } catch { /* ignore */ }
  }
  return completed === 48
}

export function RepairLabScreen() {
  const [progress, setProgress] = useState(() => readAdvancedProgress(window.localStorage))
  const [active, setActive] = useState<RepairActivity | null>(null)

  if (!level1Complete()) return <main className="advanced-screen-shell"><section className="build-level-locked"><div className="eyebrow">ADVANCED · REPAIR LAB</div><h2>Level 1 completion required.</h2><p>Level 1を完了すると、英文を修理するAdvanced Trainingが解放されます。</p></section></main>

  if (active) return <RepairActivityPlayer activity={active} onExit={() => setActive(null)} onComplete={(score) => {
    const next = saveRepairResult(progress, active.id, score)
    localStorage.setItem(ADVANCED_PROGRESS_KEY, JSON.stringify(next))
    setProgress(next)
    setActive(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }} />

  const suggestedUnitId = repairUnits.find((unit) => repairActivities.some((activity) => activity.unitId === unit.id && !progress.repairCompleted.includes(activity.id)))?.id ?? repairUnits[0].id

  return <main className="advanced-screen-shell">
    <section className="advanced-hero repair"><div><div className="eyebrow">ADVANCED TRAINING</div><h2>REPAIR LAB</h2><p>少し壊れた英文を見抜き、正しい・自然な英語へ修正します。</p></div><div className="advanced-progress"><strong>{progress.repairCompleted.length}</strong><span>/ {repairActivities.length}</span></div></section>
    <section className="advanced-mode-note"><strong>鍛える力：Grammar Diagnosis</strong><p>6つのUnitを、基本文 → 時制 → 助動詞 → 動詞の型 → 節 → 実戦文法の順に進めます。間違いを直したあと、必ず「なぜ？」を確認します。</p></section>
    <div className="repair-unit-list">
      {repairUnits.map((unit) => {
        const missions = repairActivities.filter((activity) => activity.unitId === unit.id)
        const completed = missions.filter((activity) => progress.repairCompleted.includes(activity.id)).length
        return <details className="repair-unit-section" key={unit.id} open={unit.id === suggestedUnitId}>
          <summary className="repair-unit-head">
            <div className="repair-unit-number">{completed === missions.length ? '✓' : unit.number}</div>
            <div><span>UNIT {unit.number} · {unit.title}</span><h3>{unit.titleJa}</h3><p>{unit.descriptionJa}</p></div>
            <strong>{completed}/{missions.length}</strong>
          </summary>
          <div className="advanced-mission-grid repair-unit-missions">{missions.map((activity, index) => <article className="advanced-mission-card repair" key={activity.id}>
            <span>REPAIR {unit.number}-{index + 1}</span><h3>{activity.title}</h3><p>{activity.store}</p>
            <small className="repair-focus-label">{activity.focusJa}</small>
            <div className="build-mission-grammar">{activity.grammarTargets.map((ref) => <span key={ref.key}>{grammarRegistryByKey.get(ref.key)?.labelJa ?? ref.key}</span>)}</div>
            <div className="build-mission-card-bottom"><em>{progress.repairCompleted.includes(activity.id) ? `Best ${progress.repairBest[activity.id] ?? 0}%` : 'Ready'}</em><button className="secondary-button" onClick={() => setActive(activity)}>{progress.repairCompleted.includes(activity.id) ? 'Replay' : 'Start'}</button></div>
          </article>)}</div>
        </details>
      })}
    </div>
  </main>
}
