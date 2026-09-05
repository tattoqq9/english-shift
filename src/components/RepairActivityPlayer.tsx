import { useRef, useState } from 'react'
import { scoreRepair, type RepairActivity } from '../core/advanced'
import { canCheckChangedAnswer, canRevealBestAnswer, reviewRevealScore } from '../core/learningInteraction'
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
  const [revealed, setRevealed] = useState(false)
  const [lastCheckedReplacement, setLastCheckedReplacement] = useState<string | null>(null)
  const recorded = useRef(false)

  const currentSignature = replacement ?? ''
  const canCheck = canCheckChangedAnswer(currentSignature, lastCheckedReplacement)
  const canReveal = canRevealBestAnswer(attempts, hintsUsed, 1)

  const record = (score: number) => {
    if (recorded.current) return
    recorded.current = true
    recordMasteryAttempt({
      activityId: activity.id,
      score,
      hintsUsed,
      grammarTargets: activity.grammarTargets,
      skill: 'repair',
    }, window.localStorage)
  }

  const check = () => {
    if (!canCheck || resolved || !replacement) return
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setLastCheckedReplacement(replacement)
    const result = scoreRepair(activity, replacement, nextAttempts, hintsUsed)
    setFeedback(result.feedbackJa)
    if (result.correct) {
      setResolved(true)
      record(result.score)
    }
  }

  const showHint = () => {
    if (resolved || hintsUsed >= 1) return
    setHintsUsed(1)
  }

  const revealCorrection = () => {
    if (!canReveal || resolved) return
    const score = reviewRevealScore(hintsUsed)
    setReplacement(activity.correctReplacement)
    setRevealed(true)
    setResolved(true)
    setFeedback('正解例を確認しました。元の表現と比べて、どこが変わったかを確認しましょう。')
    record(score)
  }

  const score = resolved
    ? revealed
      ? reviewRevealScore(hintsUsed)
      : scoreRepair(activity, replacement, Math.max(1, attempts), hintsUsed).score
    : 0

  return <main className="advanced-play-shell">
    <button className="chapter-back" onClick={onExit}>{exitLabel}</button>
    <section className="advanced-hero repair"><div className="eyebrow">ADVANCED · REPAIR LAB</div><h2>{activity.title}</h2><p>{activity.store}</p></section>
    <section className="advanced-context-card"><span>SCENE</span><strong>{activity.customerContext}</strong><p>{activity.customerContextJa}</p></section>
    {!resolved ? <section className="repair-workbench">
      <div className="repair-focus-strip"><span>FOCUS</span><strong>{activity.focusJa}</strong></div>
      <div className="advanced-work-head"><div><span>FIX THE RESPONSE</span><strong>不自然な部分を、より自然な表現へ修正する</strong></div></div>
      <div className="repair-sentence">
        {activity.before.map((part, index) => <span key={`${part}-${index}`} className={index === activity.brokenIndex ? 'broken' : ''}>{index === activity.brokenIndex && replacement ? replacement : part}</span>)}
      </div>
      <div className="repair-choice-bank">
        {activity.replacementChoices.map((choice) => <button key={choice} className={replacement === choice ? 'selected' : ''} onClick={() => { setReplacement(choice); setFeedback(null) }}>{choice}</button>)}
      </div>
      {hintsUsed > 0 && <div className="build-hint-note">💡 {activity.hintJa}</div>}
      {feedback && <div className="build-feedback-note">{feedback}</div>}
      <div className="build-actions">
        <button className="secondary-button" onClick={showHint} disabled={hintsUsed >= 1}>Hint</button>
        <button className="primary" disabled={!canCheck} onClick={check}>Check repair</button>
      </div>
      {!replacement ? (
        <p className="build-check-helper">候補を1つ選ぶとチェックできます。迷ったらHintを使えます。</p>
      ) : !canCheck ? (
        <p className="learning-support-note"><strong>同じ回答は再チェックしません。</strong> 別の候補を選ぶか、Hint / 正解例で確認できます。</p>
      ) : attempts > 0 ? (
        <p className="learning-support-note">別の候補を試すか、Hint / 正解例で確認できます。</p>
      ) : null}
      {canReveal && (
        <div className="learning-reveal-zone">
          <span>答えを確認する</span>
          <button className="secondary-button learning-reveal-action" onClick={revealCorrection}>See correction</button>
        </div>
      )}
    </section> : <section className="advanced-result-card">
      <div className="build-result-head"><div><span>{revealed ? 'REPAIR REVIEW' : 'REPAIR COMPLETE'}</span><h2>{score} / 100</h2></div><strong className={revealed ? 'build-result-retry' : 'build-result-pass'}>{revealed ? 'REVIEW' : 'FIXED'}</strong></div>
      <div className="build-result-grid"><div><span>Checks</span><strong>{attempts}</strong></div><div><span>Hint</span><strong>{hintsUsed}</strong></div></div>
      <div className="build-answer-review"><span>CORRECTED RESPONSE</span><strong>{activity.correctedSentence}</strong><p>{activity.correctedJapanese}</p></div>
      <div className="advanced-explanation"><strong>Why?</strong><p>{activity.explanationJa}</p></div>
      <button className="primary chapter-continue" onClick={() => onComplete(score)}>Continue</button>
    </section>}
  </main>
}
