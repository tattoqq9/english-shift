import { useMemo, useState } from 'react'
import { ADVANCED_PROGRESS_KEY, isFlowCorrect, readAdvancedProgress, saveFlowResult, scoreFlow, type FlowActivity } from '../core/advanced'
import { recordMasteryAttempt } from '../core/mastery'
import { flowActivities } from '../data/advancedTrainingActivities'
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

function FlowPlayer({ activity, onExit, onComplete }: { activity: FlowActivity; onExit: () => void; onComplete: (score: number) => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)
  const available = useMemo(() => activity.steps.filter((step) => !selected.includes(step.id)), [activity, selected])
  const add = (id: string) => { if (!resolved) { setSelected((v) => [...v, id]); setFeedback(null) } }
  const remove = (index: number) => { if (!resolved) { setSelected((v) => v.filter((_, i) => i !== index)); setFeedback(null) } }
  const check = () => {
    if (!selected.length || resolved) return
    const nextAttempts = attempts + 1; setAttempts(nextAttempts)
    const result = scoreFlow(activity, selected, nextAttempts, hintsUsed); setFeedback(result.feedbackJa)
    if (result.correct) { setResolved(true); recordMasteryAttempt({ activityId: activity.id, score: result.score, hintsUsed, grammarTargets: activity.grammarTargets }, window.localStorage) }
  }
  const result = resolved ? scoreFlow(activity, selected, Math.max(1, attempts), hintsUsed) : null
  return <main className="advanced-play-shell">
    <button className="chapter-back" onClick={onExit}>← FLOW LABへ戻る</button>
    <section className="advanced-hero flow"><div className="eyebrow">ADVANCED · FLOW LAB</div><h2>{activity.title}</h2><p>{activity.store}</p></section>
    <section className="advanced-context-card"><span>CUSTOMER</span><strong>“{activity.customerOpening}”</strong><p>{activity.customerOpeningJa}</p></section>
    <section className="build-intent-card"><span>YOUR GOAL</span><strong>{activity.goalJa}</strong></section>
    {!resolved ? <section className="flow-workbench">
      <div className="advanced-work-head"><div><span>BUILD THE SERVICE FLOW</span><strong>何を言うかだけでなく、伝える順番も組み立てる</strong></div><em>Attempt {attempts + 1}</em></div>
      <div className="flow-sequence">
        {selected.length === 0 ? <span className="build-placeholder">下の対応カードを、自然な順番に選んでください。</span> : selected.map((id, index) => {
          const step = activity.steps.find((item) => item.id === id)!; return <button key={`${id}-${index}`} onClick={() => remove(index)}><em>{index + 1}</em><span>{step.label}</span><strong>{step.labelJa}</strong></button>
        })}
      </div>
      <div className="flow-bank">{available.map((step) => <button key={step.id} onClick={() => add(step.id)}><span>{step.label}</span><strong>{step.labelJa}</strong><small>{step.response}</small></button>)}</div>
      {hintsUsed > 0 && <div className="build-hint-note">💡 まずお客様の感情や問題を受け止め、その後に確認・行動へ進むと自然です。</div>}
      {feedback && <div className="build-feedback-note">{feedback}</div>}
      <div className="build-actions"><button className="secondary-button" onClick={() => setSelected([])} disabled={!selected.length}>Clear</button><button className="secondary-button" onClick={() => setHintsUsed((v) => v + 1)}>Hint</button><button className="primary" onClick={check} disabled={!selected.length}>Check service flow</button></div>
    </section> : result ? <section className="advanced-result-card">
      <div className="build-result-head"><div><span>FLOW COMPLETE</span><h2>{result.score} / 100</h2></div><strong className="build-result-pass">FLOW</strong></div>
      <div className="flow-model-response">{activity.targetStepIds.map((id, index) => { const step = activity.steps.find((item) => item.id === id)!; return <div key={id}><em>{index + 1}</em><span>{step.labelJa}</span><strong>{step.response}</strong><p>{step.responseJa}</p></div> })}</div>
      <div className="advanced-explanation"><strong>Service Logic</strong><p>{activity.resultJa}</p></div>
      <button className="primary chapter-continue" onClick={() => onComplete(result.score)}>Continue</button>
    </section> : null}
  </main>
}

export function FlowLabScreen() {
  const [progress, setProgress] = useState(() => readAdvancedProgress(window.localStorage))
  const [active, setActive] = useState<FlowActivity | null>(null)
  if (!level1Complete()) return <main className="advanced-screen-shell"><section className="build-level-locked"><div className="eyebrow">ADVANCED · FLOW LAB</div><h2>Level 1 completion required.</h2><p>Level 1を完了すると、会話全体の組み立てを練習するAdvanced Trainingが解放されます。</p></section></main>
  if (active) return <FlowPlayer activity={active} onExit={() => setActive(null)} onComplete={(score) => { const next = saveFlowResult(progress, active.id, score); localStorage.setItem(ADVANCED_PROGRESS_KEY, JSON.stringify(next)); setProgress(next); setActive(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
  return <main className="advanced-screen-shell">
    <section className="advanced-hero flow"><div><div className="eyebrow">ADVANCED TRAINING</div><h2>FLOW LAB</h2><p>文法だけでなく、接客で「何を、どの順番で伝えるか」を組み立てます。</p></div><div className="advanced-progress"><strong>{progress.flowCompleted.length}</strong><span>/ {flowActivities.length}</span></div></section>
    <section className="advanced-mode-note"><strong>鍛える力：Conversation Strategy</strong><p>English / Service Flow / Trust / Efficiencyにつながる、English Shiftらしい応答設計を練習します。</p></section>
    <section className="advanced-mission-grid">{flowActivities.map((activity, index) => <article className="advanced-mission-card flow" key={activity.id}>
      <span>FLOW {index + 1}</span><h3>{activity.title}</h3><p>{activity.store}</p><div className="build-mission-grammar">{activity.grammarTargets.map((ref) => <span key={ref.key}>{grammarRegistryByKey.get(ref.key)?.labelJa ?? ref.key}</span>)}</div>
      <div className="build-mission-card-bottom"><em>{progress.flowCompleted.includes(activity.id) ? `Best ${progress.flowBest[activity.id] ?? 0}%` : 'Ready'}</em><button className="secondary-button" onClick={() => setActive(activity)}>{progress.flowCompleted.includes(activity.id) ? 'Replay' : 'Start'}</button></div>
    </article>)}</section>
  </main>
}
