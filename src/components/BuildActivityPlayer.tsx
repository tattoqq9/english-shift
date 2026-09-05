import { useMemo, useRef, useState } from 'react'
import type { BuildActivity, BuildMode, BuildPresentation } from '../core/build'
import { assembleBuildSentence, scoreBuild } from '../core/build'
import { canCheckChangedAnswer, canRevealBestAnswer } from '../core/learningInteraction'
import { grammarRegistryByKey } from '../data/grammarRegistry'
import { recordMasteryAttempt } from '../core/mastery'

const SCENE = {
  1: { background: '/backgrounds/chapter-1-convenience.webp', position: 'center 42%' },
  2: { background: '/backgrounds/chapter-2-clothing.webp', position: 'center 37%' },
  3: { background: '/backgrounds/chapter-3-outdoor.webp', position: 'center 35%' },
  4: { background: '/backgrounds/chapter-4-electronics.webp', position: 'center 32%' },
  5: { background: '/backgrounds/chapter-5-cafe.webp', position: 'center 36%' },
  6: { background: '/backgrounds/chapter-6-hotel.webp', position: 'center 31%' },
  7: { background: '/backgrounds/chapter-7-department.webp', position: 'center 28%' },
  8: { background: '/backgrounds/chapter-8-flagship.webp', position: 'center 31%' },
} as const

type Props = {
  activity: BuildActivity
  mode: BuildMode
  presentation: BuildPresentation
  onComplete: (score: number) => void
  onExit: () => void
}

const PRESENTATION_LABEL: Record<BuildPresentation, string> = { guided: 'STRUCTURE SLOTS', semi: 'SEMI-GUIDED', free: 'FREE BUILD' }

export function BuildActivityPlayer({ activity, mode, presentation, onComplete, onExit }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [attempts, setAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintTexts, setHintTexts] = useState<string[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [checkLabel, setCheckLabel] = useState<'Correct' | 'Almost' | 'Not quite' | null>(null)
  const [resolved, setResolved] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [lastCheckedSentence, setLastCheckedSentence] = useState<string | null>(null)
  const [lastCheckedSignature, setLastCheckedSignature] = useState<string | null>(null)
  const [showOpeningJa, setShowOpeningJa] = useState(false)
  const recorded = useRef(false)
  const scene = SCENE[activity.chapter]

  const selectedSentence = useMemo(() => assembleBuildSentence(activity, selectedIds), [activity, selectedIds])
  const currentSignature = selectedIds.join('|')
  const available = activity.chunks.filter((chunk) => !selectedIds.includes(chunk.id))
  const canCheck = canCheckChangedAnswer(currentSignature, lastCheckedSignature)
  const canReveal = canRevealBestAnswer(attempts, hintsUsed, 3)
  const finalScore = resolved ? scoreBuild(activity, selectedIds, attempts, hintsUsed, revealed) : null

  const selectChunk = (id: string) => {
    if (resolved || selectedIds.length >= activity.targetChunkIds.length + 1) return
    setSelectedIds((current) => [...current, id])
    setFeedback(null); setCheckLabel(null)
  }
  const removeAt = (index: number) => {
    if (resolved) return
    setSelectedIds((current) => current.filter((_, itemIndex) => itemIndex !== index))
    setFeedback(null); setCheckLabel(null)
  }

  const checkSentence = () => {
    if (!canCheck || resolved) return
    const nextAttempts = attempts + 1
    setAttempts(nextAttempts)
    setLastCheckedSignature(currentSignature)
    const result = scoreBuild(activity, selectedIds, nextAttempts, hintsUsed)
    setLastCheckedSentence(selectedSentence)
    setFeedback(result.feedback)
    setCheckLabel(result.check === 'correct' ? 'Correct' : result.check === 'almost' ? 'Almost' : 'Not quite')
    if (result.exact) {
      setResolved(true)
      if (!recorded.current) {
        recorded.current = true
        recordMasteryAttempt({ activityId: activity.id, score: result.score, hintsUsed, grammarTargets: activity.grammarTargets }, window.localStorage)
      }
    }
  }

  const showHint = () => {
    if (resolved || hintsUsed >= 3) return
    const hints = activity.hintsJa ?? []
    const index = Math.min(hintsUsed, 2)
    const next = hints[index] ?? '英文の役割と語順をもう一度確認してみましょう。'
    setHintsUsed(index + 1)
    setHintTexts((current) => [...current, next])
  }

  const revealAnswer = () => {
    if (!canReveal || resolved) return
    if (selectedSentence) setLastCheckedSentence(selectedSentence)
    setSelectedIds(activity.targetChunkIds)
    setRevealed(true); setResolved(true); setCheckLabel(null)
    const result = scoreBuild(activity, activity.targetChunkIds, attempts, hintsUsed, true)
    setFeedback(result.feedback)
    if (!recorded.current) {
      recorded.current = true
      recordMasteryAttempt({ activityId: activity.id, score: result.score, hintsUsed, grammarTargets: activity.grammarTargets }, window.localStorage)
    }
  }

  const slots = Array.from({ length: activity.targetChunkIds.length }, (_, index) => selectedIds[index] ?? null)

  return (
    <main className="build-play-shell">
      <button className="chapter-back" onClick={onExit}>← Exit BUILD</button>
      <section className="build-scene-card">
        <div className="build-store-hero" style={{ backgroundImage: `url(${scene.background})`, backgroundPosition: scene.position }}>
          <div className="scene-store-hero-shade" /><div className="scene-store-title"><span>LEVEL 2 · BUILD</span><strong>{activity.store}</strong></div>
        </div>
        <div className="build-scene-body">
          <div className="build-mission-head"><div><span>DAY {activity.day} · ACTIVITY {activity.activityNo} · {PRESENTATION_LABEL[presentation]} · {mode.toUpperCase()}</span><h2>{activity.title}</h2></div><div className="build-grammar-chips">{activity.grammarTargets.map((ref) => <span key={ref.key}>{grammarRegistryByKey.get(ref.key)?.labelJa ?? ref.key}</span>)}</div></div>
          <div className="build-customer-row"><div className="build-customer-label"><span>👤</span><strong>{activity.customerName}</strong><small>CUSTOMER</small></div><div className="build-opening-card"><strong>“{activity.customerOpening}”</strong><button className="jp-toggle" onClick={() => setShowOpeningJa((value) => !value)}><span>🇯🇵</span>{showOpeningJa ? '日本語を隠す' : '日本語を見る'}</button>{showOpeningJa && <div className="jp-reveal">{activity.customerOpeningJa}</div>}</div></div>
          <div className="build-intent-card"><span>YOUR INTENT</span><strong>{activity.intentJa}</strong></div>
        </div>
      </section>

      {!resolved ? (
        <section className="build-workbench">
          <div className="build-workbench-head"><div><span>ASSEMBLE YOUR RESPONSE</span><strong>{presentation === 'guided' ? '文の役割を見ながら組み立てる' : presentation === 'semi' ? 'スロットだけを手がかりに組み立てる' : '自力で自然な語順を作る'}</strong></div></div>

          {presentation !== 'free' ? <div className={`build-slot-tray ${presentation}`}>
            {slots.map((id, index) => {
              const chunk = id ? activity.chunks.find((item) => item.id === id) : null
              return <button key={index} className={chunk ? 'filled' : ''} onClick={() => chunk && removeAt(index)} disabled={!chunk}>
                {presentation === 'guided' && <small>{activity.slotLabels?.[index] ?? `PART ${index + 1}`}</small>}
                <strong>{chunk?.text ?? `Slot ${index + 1}`}</strong>
              </button>
            })}
          </div> : <div className={`build-sentence-tray ${selectedIds.length ? 'has-chunks' : ''}`}>
            {selectedIds.length === 0 ? <span className="build-placeholder">下のchunkをタップして英文を組み立ててください。</span> : selectedIds.map((id, index) => { const chunk = activity.chunks.find((item) => item.id === id)!; return <button key={`${id}-${index}`} onClick={() => removeAt(index)}>{chunk.text}</button> })}
          </div>}

          {selectedSentence && <div className="build-sentence-preview"><span>YOUR SENTENCE</span><strong>{selectedSentence}</strong></div>}
          <div className="build-chunk-bank">{available.map((chunk) => <button key={chunk.id} onClick={() => selectChunk(chunk.id)}>{chunk.text}</button>)}</div>

          {hintTexts.length > 0 && <div className="build-hint-stack">{hintTexts.map((text, index) => <div className="build-hint-note" key={`${index}-${text}`}><strong>HINT {index + 1}</strong><span>{text}</span></div>)}</div>}
          {feedback && <div className={`build-feedback-note ${checkLabel === 'Almost' ? 'almost' : checkLabel === 'Correct' ? 'correct' : 'not-quite'}`}><strong>{checkLabel === 'Correct' ? 'Correct · 正解' : checkLabel === 'Almost' ? 'Almost · あと少し' : 'Not quite · もう一度'}</strong><span>{feedback}</span></div>}
          <div className="build-actions">
            <button className="secondary-button" onClick={() => { setSelectedIds([]); setFeedback(null); setCheckLabel(null) }} disabled={!selectedIds.length}>Clear</button>
            <button className="secondary-button" onClick={showHint} disabled={hintsUsed >= 3}>Hint {Math.min(hintsUsed + 1, 3)} / 3</button>
            <button className="primary" onClick={checkSentence} disabled={!canCheck}>Check my sentence</button>
          </div>
          {!selectedIds.length ? (
            <p className="build-check-helper">フレーズを選ぶとチェックできます。最初から難しいときはHintを使えます。</p>
          ) : !canCheck ? (
            <p className="learning-support-note"><strong>同じ回答は再チェックしません。</strong> 回答を変えると再チェックできます。HintやBest answerで確認することもできます。</p>
          ) : attempts > 0 ? (
            <p className="learning-support-note">修正してもう一度試すか、Hint / Best answerで確認できます。</p>
          ) : null}
          {canReveal && (
            <div className="learning-reveal-zone">
              <span>答えを確認する</span>
              <button className="secondary-button learning-reveal-action" onClick={revealAnswer}>See best answer</button>
            </div>
          )}
        </section>
      ) : finalScore ? (
        <section className="build-result-card">
          <div className="build-result-head"><div><span>BUILD RESULT</span><h2>{finalScore.score} / 100</h2></div><strong className={finalScore.score >= 82 ? 'build-result-pass' : 'build-result-retry'}>{revealed ? 'REVIEW' : 'SUCCESS'}</strong></div>
          <div className="build-result-grid"><div><span>Checks</span><strong>{finalScore.attempts}</strong></div><div><span>Hints</span><strong>{hintsUsed}</strong></div><div><span>Mode</span><strong>{PRESENTATION_LABEL[presentation]}</strong></div></div>
          {lastCheckedSentence && lastCheckedSentence !== activity.targetSentence && <div className="build-last-try-review"><span>YOUR LAST TRY</span><strong>{lastCheckedSentence}</strong></div>}
          <div className="build-answer-review"><span>BEST RESPONSE</span><strong>{activity.targetSentence}</strong><p>{activity.targetJapanese}</p></div>
          <div className="build-structure-review"><span>STRUCTURE MAP</span><div>{activity.targetChunkIds.map((id, index) => { const chunk = activity.chunks.find((item) => item.id === id); return <div key={id}><small>{activity.slotLabels?.[index] ?? `PART ${index + 1}`}</small><strong>{chunk?.text}</strong></div> })}</div></div>
          <div className="build-why-review"><span>WHY?</span><div className="build-grammar-chips">{activity.grammarTargets.map((ref) => <span key={ref.key}>{grammarRegistryByKey.get(ref.key)?.labelJa ?? ref.key}</span>)}</div><ol>{activity.bestRoute.map((item) => <li key={item}>{item}</li>)}</ol></div>
          <div className="build-response-review"><span>CUSTOMER</span><strong>{activity.customerResponse}</strong><p>{activity.customerResponseJa}</p></div>
          <button className="primary chapter-continue" onClick={() => onComplete(finalScore.score)}>Continue</button>
        </section>
      ) : null}
    </main>
  )
}
