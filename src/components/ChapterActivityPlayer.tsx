import { useEffect, useMemo, useRef, useState } from 'react'
import { CustomerPortrait } from './CustomerPortrait'
import {
  gradeFromPercent,
  scoreDirectChoice,
  scoreInformationHunt,
  scoreIncidentInvestigation,
  scoreRapid,
  scoreStaffCoordination,
  scoreTroubleshooting,
  type Chapter1Activity,
  type Chapter1Choice,
  type Chapter1Question,
  type Chapter1DialogueActivity,
  type Chapter1InformationHuntActivity,
  type Chapter1IncidentInvestigationActivity,
  type Chapter1RapidActivity,
  type Chapter1Result,
  type Chapter1StaffCoordinationActivity,
  type Chapter1TroubleshootingActivity,
} from '../core/chapter1'
import { japaneseFor } from '../data/japaneseSupport'
import { grammarTargetsForActivity } from '../data/grammarRuntime'
import { rapidScenarioCharacter } from '../data/characterRegistry'
import { recordMasteryAttempt } from '../core/mastery'

type CompleteHandler = (score: number, japaneseHintsUsed: number) => void

type TranslationTracker = {
  open: Set<string>
  used: Set<string>
  toggle: (key: string) => void
}

function useTranslationTracker(): TranslationTracker {
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [usedKeys, setUsedKeys] = useState<string[]>([])

  const toggle = (key: string) => {
    setOpenKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key])
    setUsedKeys((current) => current.includes(key) ? current : [...current, key])
  }

  return {
    open: useMemo(() => new Set(openKeys), [openKeys]),
    used: useMemo(() => new Set(usedKeys), [usedKeys]),
    toggle,
  }
}

function scrollToResult() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => document.querySelector('.chapter-activity-result')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }))
}

function emotionForScore(score: number) {
  if (score >= 95) return { emotion: 'delighted' as const, motion: 'pop' as const }
  if (score >= 80) return { emotion: 'happy' as const, motion: 'nod' as const }
  if (score >= 60) return { emotion: 'thinking' as const, motion: 'tilt' as const }
  return { emotion: 'disappointed' as const, motion: 'shake' as const }
}

function activityTypeMeta(activity: Chapter1Activity) {
  const skill = activity.skill.toLowerCase()
  if (activity.kind === 'incident-investigation' || skill.includes('incident') || skill.includes('deduction')) return { icon: '🧩', label: activity.skill, ja: '証言と証拠から推理する' }
  if (activity.kind === 'troubleshooting' || skill.includes('troubleshooting') || skill.includes('diagnosis')) return { icon: '🛠', label: 'Troubleshooting', ja: '原因を切り分ける' }
  if (activity.kind === 'information-hunt' || skill.includes('hunt') || skill.includes('hidden need')) return { icon: '🔎', label: activity.skill, ja: '必要な情報を探す' }
  if (activity.kind === 'staff-coordination' || skill.includes('coordination') || skill.includes('handoff')) return { icon: '🤝', label: activity.skill, ja: '重要情報を整理して引き継ぐ' }
  if (activity.kind === 'rapid' || skill.includes('rush')) return { icon: '⚡', label: activity.skill, ja: '素早く判断する' }
  if (skill.includes('allergy')) return { icon: '⚠️', label: activity.skill, ja: 'アレルギー条件を安全に確認する' }
  if (skill.includes('quantity')) return { icon: '🔢', label: activity.skill, ja: '数量を正確に確認する' }
  if (skill.includes('order')) return { icon: '🍽️', label: activity.skill, ja: '注文を正確に処理する' }
  if (skill.includes('polite') || skill.includes('service')) return { icon: '✨', label: activity.skill, ja: '丁寧に接客する' }
  if (skill.includes('kitchen')) return { icon: '👨‍🍳', label: activity.skill, ja: '厨房へ重要情報を引き継ぐ' }
  if (skill.includes('complaint')) return { icon: '🧾', label: activity.skill, ja: '注文トラブルを修正する' }
  if (skill.includes('experience') || skill.includes('profile') || skill.includes('duration')) return { icon: '🧠', label: activity.skill, ja: '経験や継続を読み取る' }
  if (skill.includes('safety') || skill.includes('advice')) return { icon: '🛡', label: activity.skill, ja: '助言と安全条件を判断する' }
  if (skill.includes('condition') || skill.includes('hypothetical')) return { icon: '🌦', label: activity.skill, ja: '条件を変えて判断する' }
  if (skill.includes('recommend')) return { icon: '🎯', label: activity.skill, ja: '条件から最適案を選ぶ' }
  if (skill.includes('comparison') || skill.includes('fit') || skill.includes('equal')) return { icon: '⚖', label: activity.skill, ja: '比較して判断する' }
  if (skill.includes('checkout') || skill.includes('payment') || skill.includes('return') || skill.includes('alternative')) return { icon: '↔', label: activity.skill, ja: '手続きを正しく進める' }
  if (skill.includes('direction') || skill.includes('guidance')) return { icon: '🧭', label: activity.skill, ja: '場所や行動を案内する' }
  if (skill.includes('clarification') || skill.includes('preference')) return { icon: '💬', label: activity.skill, ja: '希望を明確にする' }
  if (skill.includes('history') || skill.includes('timeline') || skill.includes('future')) return { icon: '🕒', label: activity.skill, ja: '時系列を読み取る' }
  return { icon: '💬', label: activity.skill, ja: '英語で状況に対応する' }
}


type SceneSpeaker = 'you' | 'customer' | 'specialist' | 'clue'

type SceneTurn = {
  speaker: SceneSpeaker
  text: string
  label?: string
  detail?: string
}

const CHAPTER_SCENES = {
  1: { store: 'Convenience Store', background: '/backgrounds/chapter-1-convenience.webp', position: 'center 42%' },
  2: { store: 'Clothing Store', background: '/backgrounds/chapter-2-clothing.webp', position: 'center 37%' },
  3: { store: 'Sports / Outdoor Store', background: '/backgrounds/chapter-3-outdoor.webp', position: 'center 35%' },
  4: { store: 'Electronics Store', background: '/backgrounds/chapter-4-electronics.webp', position: 'center 32%' },
  5: { store: 'Restaurant / Café', background: '/backgrounds/chapter-5-cafe.webp', position: 'center 36%' },
  6: { store: 'Hotel', background: '/backgrounds/chapter-6-hotel.webp', position: 'center 31%' },
  7: { store: 'Department Store', background: '/backgrounds/chapter-7-department.webp', position: 'center 28%' },
  8: { store: 'International Flagship', background: '/backgrounds/chapter-8-flagship.webp', position: 'center 31%' },
  9: { store: 'Exam Shift Center', background: '/backgrounds/chapter-8-flagship.webp', position: 'center 31%' },
} as const

function chapterNumberForActivity(activity: Chapter1Activity) {
  if (activity.id.startsWith('exam-')) return 9
  const day = Number(activity.id.match(/^d(\d+)/)?.[1] ?? 1)
  if (day <= 6) return 1
  if (day <= 12) return 2
  if (day <= 18) return 3
  if (day <= 24) return 4
  if (day <= 30) return 5
  if (day <= 36) return 6
  if (day <= 42) return 7
  return 8
}

function sceneMeta(activity: Chapter1Activity) {
  const chapter = chapterNumberForActivity(activity)
  return { chapter, ...CHAPTER_SCENES[chapter as keyof typeof CHAPTER_SCENES] }
}

function turnsFromLegacyConversation(lines: string[], customerName: string): SceneTurn[] {
  return lines.map((line) => {
    if (line.startsWith('You: ')) return { speaker: 'you', label: 'YOU', text: line.slice(5) }
    if (line.startsWith(`${customerName}: `)) return { speaker: 'customer', label: customerName, text: line.slice(customerName.length + 2) }
    if (line.startsWith('Clue: ')) return { speaker: 'clue', label: 'CLUE', text: line.slice(6) }
    return { speaker: 'clue', text: line }
  })
}

function SceneDialogue({ turns }: { turns: SceneTurn[] }) {
  if (!turns.length) return null
  return (
    <div className="scene-dialogue-log" aria-label="Conversation">
      {turns.map((turn, index) => (
        <div key={`${turn.speaker}-${index}-${turn.text}`} className={`scene-turn scene-turn-${turn.speaker}`}>
          {turn.speaker === 'clue' ? (
            <div className="scene-clue"><span>🔎 {turn.label ?? 'CLUE'}</span><strong>{turn.text}</strong>{turn.detail && <small>{turn.detail}</small>}</div>
          ) : (
            <>
              <div className="scene-turn-label">
                <span className="scene-turn-avatar" aria-hidden="true">{turn.speaker === 'you' ? '🧑‍💼' : turn.speaker === 'specialist' ? (turn.label === 'MANAGER' ? '👔' : '👨‍🔧') : '👤'}</span>
                <strong>{turn.label ?? (turn.speaker === 'you' ? 'YOU' : turn.speaker === 'specialist' ? 'SPECIALIST' : 'CUSTOMER')}</strong>
              </div>
              <div className="scene-speech-bubble">{turn.text}</div>
              {turn.detail && <small className="scene-turn-detail">{turn.detail}</small>}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

function TranslationHelp({ id, english, tracker, compact = false }: {
  id: string
  english: string
  tracker: TranslationTracker
  compact?: boolean
}) {
  const japanese = japaneseFor(english)
  if (!japanese) return null
  const shown = tracker.open.has(id)
  return (
    <div className={`jp-help ${compact ? 'compact' : ''}`}>
      <button type="button" className="jp-toggle" onClick={() => tracker.toggle(id)} aria-expanded={shown}>
        <span>🇯🇵</span>{shown ? '日本語を隠す' : compact ? '訳' : '日本語を見る'}
      </button>
      {shown && <div className="jp-reveal">{japanese}</div>}
    </div>
  )
}

function ActivityHeader({ activity, score, tracker }: { activity: Chapter1Activity; score?: number; tracker: TranslationTracker }) {
  const reaction = emotionForScore(score ?? 70)
  const type = activityTypeMeta(activity)
  const scene = sceneMeta(activity)
  const openingJa = japaneseFor(activity.customer.opening)
  return (
    <section className={`chapter-scene chapter-scene-${scene.chapter}`}>
      <div
        className="scene-store-hero"
        style={{ backgroundImage: `url(${scene.background})`, backgroundPosition: scene.position }}
        role="img"
        aria-label={`${scene.store} interior`}
      >
        <div className="scene-store-hero-shade" />
        <div className="scene-store-title"><span>📍 CURRENT STORE</span><strong>{scene.store}</strong></div>
      </div>

      <div className="chapter-scene-content">
        <div className="chapter-scene-top">
          <div className="activity-type-badge scene-activity-type" title={type.ja}>
            <span className="activity-type-icon" aria-hidden="true">{type.icon}</span>
            <span><strong>{type.label}</strong><small>{type.ja}</small></span>
          </div>
          <div className="scene-situation-card">
            <span>SITUATION</span>
            <strong>{activity.title}</strong>
            <small>{activity.customer.roleLabel}</small>
          </div>
        </div>

        <div className="chapter-scene-stage chapter-scene-stage-focus">
          <div className="scene-customer-focus">
            <div className="scene-customer-identity">
              <CustomerPortrait
                customerId={activity.customer.id}
                customerName={activity.customer.name}
                emotion={score == null ? 'neutral' : reaction.emotion}
                motion={score == null ? 'idle' : reaction.motion}
                reactionTick={score == null ? 0 : 1}
              />
              <div className="scene-customer-name">
                <span>CUSTOMER</span>
                <strong>{activity.customer.name}</strong>
              </div>
            </div>
            <div className="scene-opening-bubble scene-opening-bubble-primary">
              <span className="scene-bubble-speaker">💬 CUSTOMER ORDER</span>
              <strong>“{activity.customer.opening}”</strong>
              {score == null ? (
                <TranslationHelp id={`${activity.id}:opening`} english={activity.customer.opening} tracker={tracker} />
              ) : openingJa ? (
                <div className="jp-auto-review"><span>日本語</span>{openingJa}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
function ChoiceButton({ id, text, tracker, onClick, disabled = false, selected = false, detail }: {
  id: string
  text: string
  tracker: TranslationTracker
  onClick: () => void
  disabled?: boolean
  selected?: boolean
  detail?: string
}) {
  return (
    <div className={`chapter-choice-with-help ${selected ? 'selected' : ''}`}>
      <button className={`chapter-answer-button ${selected ? 'selected' : ''}`} disabled={disabled} onClick={onClick}>
        {text}{detail && <small>{detail}</small>}
      </button>
      <TranslationHelp id={id} english={text} tracker={tracker} compact />
    </div>
  )
}


interface AnswerReviewItem {
  label: string
  yourAnswer?: string
  correctAnswer: string
  note?: string
  isCorrect?: boolean
}

function BilingualAnswer({ english }: { english: string }) {
  const japanese = japaneseFor(english)
  return (
    <div className="answer-review-answer">
      <strong>{english}</strong>
      {japanese && <small>{japanese}</small>}
    </div>
  )
}

function AnswerReview({ items, extra }: { items: AnswerReviewItem[]; extra?: React.ReactNode }) {
  return (
    <details className="answer-review-card">
      <summary>
        <span className="answer-review-summary-icon" aria-hidden="true">✓</span>
        <span><strong>Answer Review</strong><small>答えを見る</small></span>
      </summary>
      <div className="answer-review-body">
        {items.map((item, index) => (
          <div key={`${item.label}-${index}`} className={`answer-review-item ${item.isCorrect === true ? 'correct' : item.isCorrect === false ? 'incorrect' : ''}`}>
            <div className="answer-review-label">{item.label}</div>
            {item.yourAnswer != null && (
              <div className="answer-review-comparison">
                <span>YOUR ANSWER</span>
                <BilingualAnswer english={item.yourAnswer} />
              </div>
            )}
            <div className="answer-review-comparison">
              <span>BEST ANSWER</span>
              <BilingualAnswer english={item.correctAnswer} />
            </div>
            {item.note && <p>{item.note}</p>}
          </div>
        ))}
        {extra}
      </div>
    </details>
  )
}

function bestChoice(choices: Chapter1Choice[]) {
  return [...choices].sort((a, b) => b.points - a.points)[0]
}

function bestQuestions(questions: Chapter1Question[], count: number) {
  return [...questions]
    .sort((a, b) => (b.points ?? b.value) - (a.points ?? a.value))
    .slice(0, count)
}

interface ReviewEntry {
  label: string
  english: string
}

function LanguageReview({ activity, entries, hintsUsed }: { activity: Chapter1Activity; entries: ReviewEntry[]; hintsUsed: number }) {
  const unique = entries.filter((entry, index, all) => all.findIndex((other) => other.english === entry.english && other.label === entry.label) === index)
  return (
    <section className="language-review-card">
      <div className="language-review-head">
        <div><span>LANGUAGE REVIEW</span><strong>英語と意味を確認</strong></div>
        <small>回答前の日本語ヒント: {hintsUsed}</small>
      </div>
      <div className="language-review-list">
        {unique.map((entry, index) => (
          <div key={`${entry.label}-${entry.english}-${index}`} className="language-review-item">
            <span>{entry.label}</span>
            <strong>{entry.english}</strong>
            <p>{japaneseFor(entry.english) ?? '日本語訳は今後追加予定です。'}</p>
          </div>
        ))}
      </div>
      <div className="language-focus-row">
        <span>KEY LANGUAGE</span>
        {activity.grammar.map((tag) => <strong key={tag}>{tag}</strong>)}
      </div>
    </section>
  )
}

function ActivityResultPanel({ result, bestRoute, onContinue, continueLabel = 'Continue', languageReview, answerReview }: {
  result: Chapter1Result
  bestRoute: string[]
  onContinue: () => void
  continueLabel?: string
  languageReview: React.ReactNode
  answerReview: React.ReactNode
}) {
  const grade = gradeFromPercent(result.total)
  return (
    <section className={`chapter-activity-result result-grade-${grade.toLowerCase()}`}>
      <div className="chapter-result-head">
        <div>
          <div className="eyebrow">ACTIVITY RESULT</div>
          <h3>{result.total} / 100</h3>
        </div>
        <div className={`grade-badge grade-${grade.toLowerCase()}`}>{grade}</div>
      </div>
      {languageReview}
      {answerReview}
      <div className="chapter-score-breakdown">
        {result.breakdown.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{item.points} / {item.max}</strong>
            <small>{item.explanation}</small>
          </div>
        ))}
      </div>
      <div className="chapter-feedback-columns">
        <div>
          <strong>Good</strong>
          {result.strengths.length ? result.strengths.map((item) => <p key={item}>✓ {item}</p>) : <p>—</p>}
        </div>
        <div>
          <strong>Improve</strong>
          {result.missed.length ? result.missed.map((item) => <p key={item}>△ {item}</p>) : <p>大きな見逃しはありません。</p>}
        </div>
      </div>
      <details className="chapter-result-details">
        <summary>Best route / 詳細を見る</summary>
        <ol>{bestRoute.map((item) => <li key={item}>{item}</li>)}</ol>
        <strong>Next time</strong>
        <ul>{result.nextTime.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
      </details>
      <button className="primary chapter-continue" onClick={onContinue}>{continueLabel}</button>
    </section>
  )
}

function DirectActivity({ activity, onComplete }: { activity: Chapter1DialogueActivity; onComplete: CompleteHandler }) {
  const [choiceId, setChoiceId] = useState<string | null>(null)
  const tracker = useTranslationTracker()
  const choice = activity.choices.find((item) => item.id === choiceId)
  const result = choice ? scoreDirectChoice(choice) : null

  useEffect(() => { if (result) scrollToResult() }, [choiceId])

  return (
    <div className="chapter-activity-stage visual-mode-direct">
      <ActivityHeader activity={activity} score={result?.total} tracker={tracker} />
      <div className="chapter-objective"><strong>Goal</strong><span>{activity.objective}</span></div>
      <div className="chapter-grammar-row">{activity.grammar.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {!result && (
        <div className="chapter-choice-list visual-direct-response-deck">
          {activity.choices.map((item) => (
            <ChoiceButton key={item.id} id={`${activity.id}:choice:${item.id}`} text={item.text} tracker={tracker} onClick={() => setChoiceId(item.id)} />
          ))}
        </div>
      )}
      {choice && <SceneDialogue turns={[
        { speaker: 'you', label: 'YOU', text: choice.text },
        { speaker: 'customer', label: activity.customer.name, text: choice.response },
      ]} />}
      {result && choice && (
        <ActivityResultPanel
          result={result}
          bestRoute={activity.bestRoute}
          onContinue={() => onComplete(result.total, tracker.used.size)}
          languageReview={<LanguageReview activity={activity} hintsUsed={tracker.used.size} entries={[{ label: 'YOUR CHOICE', english: choice.text }]} />}
          answerReview={(() => {
            const best = bestChoice(activity.choices)
            return <AnswerReview items={[{
              label: 'Response',
              yourAnswer: choice.reviewText ?? choice.text,
              correctAnswer: best.reviewText ?? best.text,
              isCorrect: choice.id === best.id,
              note: best.explanation,
            }]} />
          })()}
        />
      )}
    </div>
  )
}

function HuntActivity({ activity, onComplete }: { activity: Chapter1InformationHuntActivity; onComplete: CompleteHandler }) {
  const [asked, setAsked] = useState<string[]>([])
  const [conversation, setConversation] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const tracker = useTranslationTracker()
  const result = finished && selected ? scoreInformationHunt(activity, asked, selected) : null

  useEffect(() => { if (result) scrollToResult() }, [finished])

  const ask = (id: string) => {
    if (finished || asked.includes(id) || asked.length >= activity.maxQuestions) return
    const question = activity.questions.find((item) => item.id === id)
    if (!question) return
    setAsked((current) => [...current, id])
    setConversation((current) => [...current, `You: ${question.text}`, `${activity.customer.name}: ${question.response}`, `Clue: ${question.reveal}`])
  }

  const askedQuestions = asked.map((id) => activity.questions.find((q) => q.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item))

  return (
    <div className="chapter-activity-stage visual-mode-investigate">
      <ActivityHeader activity={activity} score={result?.total} tracker={tracker} />
      <div className="chapter-objective"><strong>Goal</strong><span>{activity.objective}</span></div>
      <div className="chapter-grammar-row">{activity.grammar.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {conversation.length > 0 && <SceneDialogue turns={turnsFromLegacyConversation(conversation, activity.customer.name)} />}
      {!finished && (
        <>
          <div className="visual-investigate-workspace">
            <div className="section-title"><h3>Ask</h3><span>{asked.length}/{activity.maxQuestions}</span></div>
            <div className="chapter-choice-list compact visual-question-bank">
            {activity.questions.map((q) => (
              <ChoiceButton
                key={q.id}
                id={`${activity.id}:question:${q.id}`}
                text={q.text}
                detail={asked.includes(q.id) ? q.reveal : undefined}
                tracker={tracker}
                disabled={asked.includes(q.id) || asked.length >= activity.maxQuestions}
                onClick={() => ask(q.id)}
              />
            ))}
            </div>
          </div>
          <div className="visual-decision-tray">
            <div className="section-title"><h3>Choose target</h3><span>Compare clues</span></div>
            <div className="chapter-candidate-grid">
            {activity.candidates.map((candidate) => (
              <button key={candidate.id} className={selected === candidate.id ? 'selected' : ''} onClick={() => setSelected(candidate.id)}>
                <strong>{candidate.name}</strong><small>{candidate.details}</small>
              </button>
            ))}
            </div>
            <button className="primary chapter-submit" disabled={!selected} onClick={() => setFinished(true)}>Confirm answer</button>
          </div>
        </>
      )}
      {result && (
        <ActivityResultPanel
          result={result}
          bestRoute={activity.bestRoute}
          onContinue={() => onComplete(result.total, tracker.used.size)}
          languageReview={<LanguageReview activity={activity} hintsUsed={tracker.used.size} entries={askedQuestions.map((q) => ({ label: 'YOU ASKED', english: q.text }))} />}
          answerReview={(() => {
            const yourTarget = activity.candidates.find((item) => item.id === selected)
            const correctTarget = activity.candidates.find((item) => item.correct)!
            const optimal = bestQuestions(activity.questions, activity.maxQuestions)
            return <AnswerReview
              items={[{
                label: 'Target',
                yourAnswer: yourTarget?.name ?? 'No answer',
                correctAnswer: correctTarget.name,
                isCorrect: Boolean(yourTarget?.correct),
                note: correctTarget.details,
              }]}
              extra={<div className="answer-review-extra">
                <strong>BEST QUESTIONS</strong>
                {optimal.map((q, index) => (
                  <div key={q.id} className="answer-review-question">
                    <span>{index + 1}</span>
                    <div><BilingualAnswer english={q.text} /><p>Customer: {q.response}</p><small>Clue: {q.reveal}</small></div>
                  </div>
                ))}
              </div>}
            />
          })()}
        />
      )}
    </div>
  )
}

function TroubleshootingActivity({ activity, onComplete }: { activity: Chapter1TroubleshootingActivity; onComplete: CompleteHandler }) {
  const [asked, setAsked] = useState<string[]>([])
  const [eliminated, setEliminated] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState<string | null>(null)
  const [conversation, setConversation] = useState<string[]>([])
  const [solutionId, setSolutionId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const tracker = useTranslationTracker()
  const result = finished && solutionId ? scoreTroubleshooting(activity, asked, solutionId) : null

  useEffect(() => { if (result) scrollToResult() }, [finished])

  const ask = (id: string) => {
    if (finished || asked.includes(id) || asked.length >= activity.maxQuestions) return
    const q = activity.questions.find((item) => item.id === id)
    if (!q) return
    setAsked((current) => [...current, id])
    setEliminated((current) => [...new Set([...current, ...(q.eliminates ?? [])])])
    if (q.confirms) setConfirmed(q.confirms)
    setConversation((current) => [...current, `You: ${q.text}`, `${activity.customer.name}: ${q.response}`])
  }

  const askedQuestions = asked.map((id) => activity.questions.find((q) => q.id === id)).filter((item): item is NonNullable<typeof item> => Boolean(item))
  const solution = activity.solutions.find((item) => item.id === solutionId)

  return (
    <div className="chapter-activity-stage visual-mode-investigate">
      <ActivityHeader activity={activity} score={result?.total} tracker={tracker} />
      <div className="chapter-objective"><strong>Goal</strong><span>{activity.objective}</span></div>
      <div className="chapter-grammar-row">{activity.grammar.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="visual-investigate-workspace">
        <div className="chapter-cause-board">
        {activity.causes.map((cause) => (
          <div key={cause.id} className={`${eliminated.includes(cause.id) ? 'eliminated' : ''} ${confirmed === cause.id ? 'confirmed' : ''}`}>
            <span>{eliminated.includes(cause.id) ? '×' : confirmed === cause.id ? '✓' : '?'}</span><strong>{cause.label}</strong>
          </div>
        ))}
        </div>
        {conversation.length > 0 && <SceneDialogue turns={turnsFromLegacyConversation(conversation, activity.customer.name)} />}
      </div>
      {!finished && (
        <>
          <div className="visual-investigate-workspace visual-question-workspace">
          <div className="section-title"><h3>Diagnose</h3><span>{asked.length}/{activity.maxQuestions}</span></div>
          <div className="chapter-choice-list compact visual-question-bank">
            {activity.questions.map((q) => (
              <ChoiceButton key={q.id} id={`${activity.id}:question:${q.id}`} text={q.text} tracker={tracker} disabled={asked.includes(q.id) || asked.length >= activity.maxQuestions} onClick={() => ask(q.id)} />
            ))}
          </div>
          </div>
          <div className="visual-decision-tray">
          <div className="section-title"><h3>Choose action</h3><span>Use your evidence</span></div>
          <div className="chapter-choice-list compact visual-decision-options">
            {activity.solutions.map((item) => (
              <ChoiceButton key={item.id} id={`${activity.id}:solution:${item.id}`} text={item.text} tracker={tracker} selected={solutionId === item.id} onClick={() => setSolutionId(item.id)} />
            ))}
          </div>
          <button className="primary chapter-submit" disabled={!solutionId} onClick={() => setFinished(true)}>Apply solution</button>
          </div>
        </>
      )}
      {result && solution && (
        <ActivityResultPanel
          result={result}
          bestRoute={activity.bestRoute}
          onContinue={() => onComplete(result.total, tracker.used.size)}
          languageReview={<LanguageReview activity={activity} hintsUsed={tracker.used.size} entries={[
            ...askedQuestions.map((q) => ({ label: 'YOU ASKED', english: q.text })),
            { label: 'YOUR ACTION', english: solution.text },
          ]} />}
          answerReview={(() => {
            const cause = activity.causes.find((item) => item.id === activity.correctCause)
            const correctSolution = activity.solutions.find((item) => item.cause === activity.correctCause)!
            const optimal = bestQuestions(activity.questions, activity.maxQuestions)
            return <AnswerReview
              items={[{
                label: `Correct cause: ${cause?.label ?? activity.correctCause}`,
                yourAnswer: solution.text,
                correctAnswer: correctSolution.text,
                isCorrect: solution.id === correctSolution.id,
                note: '集めた証拠と一致する原因・Actionを選びます。',
              }]}
              extra={<div className="answer-review-extra">
                <strong>BEST DIAGNOSIS QUESTIONS</strong>
                {optimal.map((q, index) => (
                  <div key={q.id} className="answer-review-question">
                    <span>{index + 1}</span>
                    <div><BilingualAnswer english={q.text} /><p>Customer: {q.response}</p></div>
                  </div>
                ))}
              </div>}
            />
          })()}
        />
      )}
    </div>
  )
}

function StaffCoordinationActivity({ activity, onComplete }: { activity: Chapter1StaffCoordinationActivity; onComplete: CompleteHandler }) {
  const [factIds, setFactIds] = useState<string[]>([])
  const [handoffId, setHandoffId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const tracker = useTranslationTracker()
  const handoff = activity.handoffOptions.find((item) => item.id === handoffId)
  const result = finished && handoffId ? scoreStaffCoordination(activity, factIds, handoffId) : null

  useEffect(() => { if (result) scrollToResult() }, [finished])

  const toggleFact = (id: string) => {
    if (finished) return
    setFactIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= activity.maxFacts) return current
      return [...current, id]
    })
  }

  const selectedFacts = activity.facts.filter((item) => factIds.includes(item.id))
  const bestFacts = activity.facts.filter((item) => item.essential)
  const bestHandoff = bestChoice(activity.handoffOptions)

  return (
    <div className="chapter-activity-stage visual-mode-handoff">
      <ActivityHeader activity={activity} score={result?.total} tracker={tracker} />
      <div className="chapter-objective"><strong>Goal</strong><span>{activity.objective}</span></div>
      <div className="chapter-grammar-row">{activity.grammar.map((tag) => <span key={tag}>{tag}</span>)}</div>
      {!finished && (
        <>
          <div className="visual-handoff-clipboard">
          <div className="section-title"><h3>{activity.factsHeading ?? 'Pick key facts'}</h3><span>{factIds.length}/{activity.maxFacts}</span></div>
          <div className="chapter-staff-facts">
            {activity.facts.map((fact) => {
              const selected = factIds.includes(fact.id)
              return (
                <div key={fact.id} className={`chapter-staff-fact ${selected ? 'selected' : ''}`}>
                  <button disabled={!selected && factIds.length >= activity.maxFacts} onClick={() => toggleFact(fact.id)}>
                    <span>{selected ? '✓' : '○'}</span><strong>{fact.text}</strong>
                  </button>
                  <TranslationHelp id={`${activity.id}:fact:${fact.id}`} english={fact.text} tracker={tracker} compact />
                </div>
              )
            })}
          </div>
          <div className="chapter-staff-notes">
            <span>{activity.notesHeading ?? 'HANDOFF NOTES'}</span>
            {selectedFacts.length ? selectedFacts.map((fact) => <strong key={fact.id}>{fact.text}</strong>) : <em>Select up to {activity.maxFacts} facts</em>}
          </div>
          </div>
          <div className="visual-handoff-tray">
          <div className="section-title"><h3>{activity.handoffHeading ?? 'Tell the specialist'}</h3><span>Choose the clearest handoff</span></div>
          <div className="chapter-choice-list compact">
            {activity.handoffOptions.map((item) => (
              <ChoiceButton key={item.id} id={`${activity.id}:handoff:${item.id}`} text={item.text} tracker={tracker} selected={handoffId === item.id} onClick={() => setHandoffId(item.id)} />
            ))}
          </div>
          <button className="primary chapter-submit" disabled={factIds.length === 0 || !handoffId} onClick={() => setFinished(true)}>Complete handoff</button>
          </div>
        </>
      )}
      {handoff && <SceneDialogue turns={[
        { speaker: 'you', label: 'YOU', text: handoff.text },
        { speaker: 'specialist', label: activity.handoffTargetLabel ?? 'SPECIALIST', text: handoff.response },
      ]} />}
      {result && handoff && (
        <ActivityResultPanel
          result={result}
          bestRoute={activity.bestRoute}
          onContinue={() => onComplete(result.total, tracker.used.size)}
          languageReview={<LanguageReview activity={activity} hintsUsed={tracker.used.size} entries={[
            ...selectedFacts.map((fact) => ({ label: 'HANDOFF FACT', english: fact.text })),
            { label: 'YOUR HANDOFF', english: handoff.text },
          ]} />}
          answerReview={<AnswerReview
            items={[{
              label: 'Handoff sentence',
              yourAnswer: handoff.reviewText ?? handoff.text,
              correctAnswer: bestHandoff.reviewText ?? bestHandoff.text,
              isCorrect: handoff.id === bestHandoff.id,
              note: bestHandoff.explanation,
            }]}
            extra={<div className="answer-review-extra">
              <strong>KEY FACTS</strong>
              {bestFacts.map((fact, index) => (
                <div key={fact.id} className="answer-review-question">
                  <span>{index + 1}</span><div><BilingualAnswer english={fact.text} /></div>
                </div>
              ))}
            </div>}
          />}
        />
      )}
    </div>
  )
}

function IncidentInvestigationActivity({ activity, onComplete }: { activity: Chapter1IncidentInvestigationActivity; onComplete: CompleteHandler }) {
  const [interviewIds, setInterviewIds] = useState<string[]>([])
  const [conclusionId, setConclusionId] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const tracker = useTranslationTracker()
  const conclusion = activity.conclusions.find((item) => item.id === conclusionId)
  const result = finished && conclusionId ? scoreIncidentInvestigation(activity, interviewIds, conclusionId) : null

  useEffect(() => { if (result) scrollToResult() }, [finished])

  const interview = (id: string) => {
    if (finished || interviewIds.includes(id) || interviewIds.length >= activity.maxInterviews) return
    setInterviewIds((current) => [...current, id])
  }

  const interviewed = activity.witnesses.filter((witness) => interviewIds.includes(witness.id))
  const bestWitnesses = [...activity.witnesses].sort((a, b) => b.value - a.value).slice(0, activity.maxInterviews)
  const bestConclusion = activity.conclusions.find((item) => item.correct)!
  const recordMode = activity.sourceMode === 'records'

  return (
    <div className="chapter-activity-stage visual-mode-investigate">
      <ActivityHeader activity={activity} score={result?.total} tracker={tracker} />
      <div className="chapter-objective"><strong>Goal</strong><span>{activity.objective}</span></div>
      <div className="chapter-grammar-row">{activity.grammar.map((tag) => <span key={tag}>{tag}</span>)}</div>

      {!finished && (
        <>
          <div className="visual-investigate-workspace">
          <div className="section-title"><h3>{activity.sourceHeading ?? (recordMode ? 'Review records' : 'Interview')}</h3><span>{interviewIds.length}/{activity.maxInterviews}</span></div>
          <div className="chapter-incident-witness-grid">
            {activity.witnesses.map((witness) => {
              const selected = interviewIds.includes(witness.id)
              const blocked = !selected && interviewIds.length >= activity.maxInterviews
              return (
                <div key={witness.id} className={`chapter-incident-witness ${selected ? 'interviewed' : ''}`}>
                  <button disabled={blocked} onClick={() => interview(witness.id)}>
                    <strong>{witness.name}</strong>
                    <span>{witness.role}</span>
                    {!selected && <small>{blocked ? (recordMode ? 'Review limit reached' : 'Interview limit reached') : (activity.sourceActionLabel ?? (recordMode ? 'Tap to review' : 'Tap to interview'))}</small>}
                  </button>
                  {selected && (
                    <div className="chapter-witness-statement">
                      <p>{recordMode ? witness.statement : `“${witness.statement}”`}</p>
                      <TranslationHelp id={`${activity.id}:witness:${witness.id}`} english={witness.statement} tracker={tracker} compact />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="chapter-evidence-board">
            <span>{activity.evidenceHeading ?? (recordMode ? 'RELEVANT INFORMATION' : 'EVIDENCE BOARD')}</span>
            {interviewed.length ? interviewed.map((witness) => <strong key={witness.id}>{witness.evidence}</strong>) : <em>No statements collected yet</em>}
          </div>
          </div>

          <div className="visual-decision-tray">
          <div className="section-title"><h3>Conclusion</h3><span>What most likely happened?</span></div>
          <div className="chapter-incident-conclusions">
            {activity.conclusions.map((item) => (
              <div key={item.id} className={`chapter-choice-with-help ${conclusionId === item.id ? 'selected' : ''}`}>
                <button className={`chapter-answer-button ${conclusionId === item.id ? 'selected' : ''}`} onClick={() => setConclusionId(item.id)}>{item.text}</button>
                <TranslationHelp id={`${activity.id}:conclusion:${item.id}`} english={item.text} tracker={tracker} compact />
              </div>
            ))}
          </div>
          <button className="primary chapter-submit" disabled={!conclusionId} onClick={() => setFinished(true)}>Submit conclusion</button>
          </div>
        </>
      )}

      {conclusion && <SceneDialogue turns={[{ speaker: 'you', label: 'YOU', text: conclusion.text }]} />}

      {result && conclusion && (
        <ActivityResultPanel
          result={result}
          bestRoute={activity.bestRoute}
          onContinue={() => onComplete(result.total, tracker.used.size)}
          languageReview={<LanguageReview activity={activity} hintsUsed={tracker.used.size} entries={[
            ...interviewed.map((witness) => ({ label: `${witness.name.toUpperCase()} ${recordMode ? 'RECORD' : 'STATEMENT'}`, english: witness.statement })),
            { label: 'YOUR CONCLUSION', english: conclusion.text },
          ]} />}
          answerReview={<AnswerReview
            items={[{
              label: 'Conclusion',
              yourAnswer: conclusion.reviewText ?? conclusion.text,
              correctAnswer: bestConclusion.reviewText ?? bestConclusion.text,
              isCorrect: conclusion.id === bestConclusion.id,
              note: bestConclusion.explanation,
            }]}
            extra={<div className="answer-review-extra">
              <strong>BEST EVIDENCE</strong>
              {bestWitnesses.map((witness, index) => (
                <div key={witness.id} className="answer-review-question">
                  <span>{index + 1}</span><div><strong>{witness.name} · {witness.role}</strong><BilingualAnswer english={witness.statement} /><small>{witness.evidence}</small></div>
                </div>
              ))}
            </div>}
          />}
        />
      )}
    </div>
  )
}

function RapidActivity({ activity, onComplete }: { activity: Chapter1RapidActivity; onComplete: CompleteHandler }) {
  const [index, setIndex] = useState(0)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const tracker = useTranslationTracker()
  const scenario = activity.scenarios[index]
  const result = finished ? scoreRapid(activity, selectedIds) : null
  const scenarioCharacter = rapidScenarioCharacter(activity.id, index)

  useEffect(() => { if (result) scrollToResult() }, [finished])

  const choose = (id: string) => {
    const next = [...selectedIds, id]
    setSelectedIds(next)
    if (index + 1 >= activity.scenarios.length) setFinished(true)
    else setIndex(index + 1)
  }

  const reviewEntries: ReviewEntry[] = []
  activity.scenarios.forEach((item, scenarioIndex) => {
    const miniCustomer = rapidScenarioCharacter(activity.id, scenarioIndex)
    reviewEntries.push({ label: `${miniCustomer.name.toUpperCase()} · ${item.customer}`, english: item.line })
    const selected = item.choices.find((choice) => choice.id === selectedIds[scenarioIndex])
    if (selected) reviewEntries.push({ label: 'YOUR CHOICE', english: selected.text })
  })

  return (
    <div className="chapter-activity-stage visual-mode-queue">
      <ActivityHeader activity={activity} score={result?.total} tracker={tracker} />
      <div className="chapter-objective"><strong>Goal</strong><span>{activity.objective}</span></div>
      {selectedIds.length > 0 && <SceneDialogue turns={activity.scenarios.slice(0, selectedIds.length).flatMap((item, scenarioIndex) => {
        const selected = item.choices.find((choice) => choice.id === selectedIds[scenarioIndex])
        const miniCustomer = rapidScenarioCharacter(activity.id, scenarioIndex)
        return selected ? [
          { speaker: 'customer' as const, label: miniCustomer.name, text: item.line },
          { speaker: 'you' as const, label: 'YOU', text: selected.text },
          { speaker: 'customer' as const, label: item.customer, text: selected.response },
        ] : []
      })} />}
      {!finished && scenario && (
        <div className="visual-queue-workspace">
          <div className="visual-queue-rail" aria-hidden="true">
            {activity.scenarios.map((item, itemIndex) => <span key={item.id} className={itemIndex < index ? 'done' : itemIndex === index ? 'current' : ''} />)}
          </div>
        <div className="chapter-rush-card visual-queue-current">
          <div className="chapter-rush-progress">Customer {index + 1}/{activity.scenarios.length}</div>
          <div className="rapid-mini-customer">
            <CustomerPortrait customerId={scenarioCharacter.id} customerName={scenarioCharacter.name} emotion="neutral" motion="idle" reactionTick={index} />
            <div className="rapid-mini-customer-copy"><span>CUSTOMER</span><h3>{scenarioCharacter.name}</h3><small>{scenario.customer}</small></div>
          </div>
          <div className="chapter-opening">“{scenario.line}”</div>
          <TranslationHelp id={`${activity.id}:scenario:${scenario.id}:line`} english={scenario.line} tracker={tracker} />
          <div className="chapter-choice-list compact">
            {scenario.choices.map((choice) => (
              <ChoiceButton key={choice.id} id={`${activity.id}:scenario:${scenario.id}:choice:${choice.id}`} text={choice.text} tracker={tracker} onClick={() => choose(choice.id)} />
            ))}
          </div>
        </div>
        </div>
      )}
      {result && (
        <ActivityResultPanel
          result={result}
          bestRoute={activity.bestRoute}
          onContinue={() => onComplete(result.total, tracker.used.size)}
          languageReview={<LanguageReview activity={activity} hintsUsed={tracker.used.size} entries={reviewEntries} />}
          answerReview={<AnswerReview items={activity.scenarios.map((item, scenarioIndex) => {
            const chosen = item.choices.find((choice) => choice.id === selectedIds[scenarioIndex])
            const best = bestChoice(item.choices)
            return {
              label: `${rapidScenarioCharacter(activity.id, scenarioIndex).name}: ${item.line}`,
              yourAnswer: chosen?.text ?? 'No answer',
              correctAnswer: best.text,
              isCorrect: chosen?.id === best.id,
              note: best.explanation,
            }
          })} />}
        />
      )}
    </div>
  )
}

export function ChapterActivityPlayer({ activity, onComplete }: { activity: Chapter1Activity; onComplete: CompleteHandler }) {
  const masteryRecorded = useRef(false)
  const completeWithMastery: CompleteHandler = (score, japaneseHintsUsed) => {
    if (!masteryRecorded.current) {
      masteryRecorded.current = true
      recordMasteryAttempt({
        activityId: activity.id,
        score,
        hintsUsed: japaneseHintsUsed,
        grammarTargets: grammarTargetsForActivity(activity),
      }, window.localStorage)
    }
    onComplete(score, japaneseHintsUsed)
  }

  if (activity.kind === 'information-hunt') return <HuntActivity activity={activity} onComplete={completeWithMastery} />
  if (activity.kind === 'incident-investigation') return <IncidentInvestigationActivity activity={activity} onComplete={completeWithMastery} />
  if (activity.kind === 'troubleshooting') return <TroubleshootingActivity activity={activity} onComplete={completeWithMastery} />
  if (activity.kind === 'rapid') return <RapidActivity activity={activity} onComplete={completeWithMastery} />
  if (activity.kind === 'staff-coordination') return <StaffCoordinationActivity activity={activity} onComplete={completeWithMastery} />
  return <DirectActivity activity={activity} onComplete={completeWithMastery} />
}
