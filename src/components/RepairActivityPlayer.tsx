import { useRef, useState } from 'react'
import { scoreRepair, type RepairActivity } from '../core/advanced'
import { recordMasteryAttempt } from '../core/mastery'

type Props = {
  activity: RepairActivity
  onExit: () => void
  onComplete: (score: number) => void
  exitLabel?: string
}

export function RepairActivityPlayer({ activity, onExit, onComplete, exitLabel = '← REPAIR LABへ戻る' }: Props) {
  const [replacement, setReplacement] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [resolved, setResolved] = useState(false)
  const recorded = useRef(false)

  const check = () => {
    if (!replacement || resolved) return
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    const result = scoreRepair(activity, replacement, nextAttempts, hintsUsed)
    setFeedback(result.feedbackJa)
    if (result.correct) {
      setResolved(true)
      if (!recorded.current) {
        recorded.current = true
        recordMasteryAttempt({
          activityId: activity.id,
          score: result.score,
          hintsUsed,
          grammarTargets: activity.grammarTargets,
          skill: 'repair',
        }, window.localStorage)
      }
    }
  }

  const score = resolved ? scoreRepair(activity, replacement, Math.max(1, attempts), hintsUsed).score : 0

  return <main className="advanced-play-shell">
    <button className="chapter-back" onClick={onExit}>{exitLabel}</button>
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
        <button className="secondary-button" onClick={() => setHintsUsed((value) => value + 1)}>Hint</button>
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
