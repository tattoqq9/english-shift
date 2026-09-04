import { useState } from 'react'
import { ADVANCED_PROGRESS_KEY, readAdvancedProgress, saveRepairResult, scoreRepair, type RepairActivity } from '../core/advanced'
import { recordMasteryAttempt } from '../core/mastery'
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

function RepairPlayer({ activity, onExit, onComplete }: { activity: RepairActivity; onExit: () => void; onComplete: (score: number) => void }) {
  const [replacement, setReplacement] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)

  const check = () => {
    if (!replacement || resolved) return
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    const result = scoreRepair(activity, replacement, nextAttempts, hintsUsed)
    setFeedback(result.feedbackJa)
    if (result.correct) {
      setResolved(true)
      recordMasteryAttempt({ activityId: activity.id, score: result.score, hintsUsed, grammarTargets: activity.grammarTargets }, window.localStorage)
    }
  }
  const score = resolved ? scoreRepair(activity, replacement, Math.max(1, attempts), hintsUsed).score : 0

  return <main className="advanced-play-shell">
    <button className="chapter-back" onClick={onExit}>← REPAIR LABへ戻る</button>
    <section className="advanced-hero repair"><div className="eyebrow">ADVANCED · REPAIR LAB</div><h2>{activity.title}</h2><p>{activity.store}</p></section>
    <section className="advanced-context-card"><span>SCENE</span><strong>{activity.customerContext}</strong><p>{activity.customerContextJa}</p></section>
    {!resolved ? <section className="repair-workbench">
      <div className="repair-focus-strip"><span>FOCUS</span><strong>{activity.focusJa}</strong></div>
      <div className="advanced-work-head"><div><span>FIX THE RESPONSE</span><strong>不自然な部分を、より自然な表現へ修正する</strong></div><em>Attempt {attempts + 1}</em></div>
      <div className="repair-sentence">
        {activity.before.map((part, index) => <span key={`${part}-${index}`} className={index === activity.brokenIndex ? 'broken' : ''}>{index === activity.brokenIndex && replacement ? replacement : part}</span>)}
      </div>
      <div className="repair-choice-bank">
        {activity.replacementChoices.map((choice) => <button key={choice} className={replacement === choice ? 'selected' : ''} onClick={() => { setReplacement(choice); setFeedback(null) }}>{choice}</button>)}
      </div>
      {hintsUsed > 0 && <div className="build-hint-note">💡 {activity.hintJa}</div>}
      {feedback && <div className="build-feedback-note">{feedback}</div>}
      <div className="build-actions">
        <button className="secondary-button" onClick={() => setHintsUsed((v) => v + 1)}>Hint</button>
        <button className="primary" disabled={!replacement} onClick={check}>Check repair</button>
      </div>
      {!replacement && <p className="build-check-helper">候補を1つ選ぶとチェックできます。</p>}
    </section> : <section className="advanced-result-card">
      <div className="build-result-head"><div><span>REPAIR COMPLETE</span><h2>{score} / 100</h2></div><strong className="build-result-pass">FIXED</strong></div>
      <div className="build-answer-review"><span>CORRECTED RESPONSE</span><strong>{activity.correctedSentence}</strong><p>{activity.correctedJapanese}</p></div>
      <div className="advanced-explanation"><strong>Why?</strong><p>{activity.explanationJa}</p></div>
      <button className="primary chapter-continue" onClick={() => onComplete(score)}>Continue</button>
    </section>}
  </main>
}

export function RepairLabScreen() {
  const [progress, setProgress] = useState(() => readAdvancedProgress(window.localStorage))
  const [active, setActive] = useState<RepairActivity | null>(null)
  if (!level1Complete()) return <main className="advanced-screen-shell"><section className="build-level-locked"><div className="eyebrow">ADVANCED · REPAIR LAB</div><h2>Level 1 completion required.</h2><p>Level 1を完了すると、英文を修理するAdvanced Trainingが解放されます。</p></section></main>
  if (active) return <RepairPlayer activity={active} onExit={() => setActive(null)} onComplete={(score) => {
    const next = saveRepairResult(progress, active.id, score); localStorage.setItem(ADVANCED_PROGRESS_KEY, JSON.stringify(next)); setProgress(next); setActive(null); window.scrollTo({ top: 0, behavior: 'smooth' })
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
