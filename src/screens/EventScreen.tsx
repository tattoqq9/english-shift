import { useEffect, useMemo, useRef } from 'react'
import { CustomerPortrait } from '../components/CustomerPortrait'
import { ConversationLog } from '../components/ConversationLog'
import { storeEvents } from '../data/events'
import type { GrammarTag } from '../core/types'
import { useGameStore } from '../store/gameStore'

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollToPageTop() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: preferredScrollBehavior() }))
  })
}

const grammarLabels: Record<GrammarTag, string> = {
  WH_QUESTION: 'Wh-question',
  COMPARATIVE: 'Comparative',
  MODAL: 'Modal',
  PRESENT_PERFECT: 'Present perfect',
  CONJUNCTION: 'Conjunction',
  POLITE_REQUEST: 'Polite request',
  PAST_SIMPLE: 'Past simple',
  PASSIVE: 'Passive',
  CONDITIONAL: 'Conditional',
  INDIRECT_QUESTION: 'Indirect question',
  PRESENT_PERFECT_CONTINUOUS: 'Present perfect continuous',
  MODAL_PERFECT: 'Modal perfect',
}

const eventIcons = {
  RETURN: '↩',
  STOCKOUT: '!',
  COMPLAINT: '!!',
} as const

export function EventScreen() {
  const activeEventId = useGameStore((s) => s.activeEventId)
  const stepIndex = useGameStore((s) => s.eventStepIndex)
  const conversation = useGameStore((s) => s.eventConversation)
  const points = useGameStore((s) => s.eventPoints)
  const maxPoints = useGameStore((s) => s.eventMaxPoints)
  const history = useGameStore((s) => s.eventHistory)
  const result = useGameStore((s) => s.eventResult)
  const emotion = useGameStore((s) => s.eventEmotion)
  const motion = useGameStore((s) => s.eventMotion)
  const reactionTick = useGameStore((s) => s.eventReactionTick)
  const choose = useGameStore((s) => s.chooseEventChoice)
  const finishEvent = useGameStore((s) => s.finishEvent)
  const resultRef = useRef<HTMLElement>(null)

  const event = useMemo(
    () => storeEvents.find((item) => item.id === activeEventId),
    [activeEventId],
  )

  useEffect(() => {
    if (!result) return
    const frame = requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [result])

  if (!event) return null
  const step = event.steps[stepIndex]
  const completedSteps = history.length

  const handleContinue = () => {
    finishEvent()
    scrollToPageTop()
  }

  return (
    <main className="event-layout">
      <section className="event-panel">
        <div className="event-banner">
          <div className={`event-icon event-icon-${event.type.toLowerCase()}`} aria-hidden="true">{eventIcons[event.type]}</div>
          <div>
            <div className="eyebrow">STORE EVENT · {event.type}</div>
            <h2>{event.title}</h2>
            <p>{event.subtitle}</p>
          </div>
        </div>

        <div className="event-customer-header">
          <CustomerPortrait
            customerId={event.customerId}
            customerName={event.customerName}
            emotion={emotion}
            motion={motion}
            reactionTick={reactionTick}
          />
          <div className="customer-meta">
            <div className="eyebrow">CUSTOMER</div>
            <h3>{event.customerName}</h3>
            <p>{event.roleLabel}</p>
          </div>
        </div>

        <ConversationLog messages={conversation} className="event-conversation" />

        {!result && step && (
          <div className="event-decision">
            <div className="section-title">
              <h3>What do you say?</h3>
              <span>Step {completedSteps + 1}/{event.steps.length}</span>
            </div>
            <p className="event-instruction">{step.instruction}</p>
            <div className="event-choice-list">
              {step.choices.map((choice) => (
                <button
                  className="event-choice"
                  key={choice.id}
                  onClick={() => choose(choice.id)}
                >
                  <span>{choice.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="event-progress-card">
          <div><span>Event score</span><strong>{points}/{maxPoints}</strong></div>
          <div><span>Decisions</span><strong>{completedSteps}/{event.steps.length}</strong></div>
        </div>
      </section>

      <aside className="event-guide">
        <div className="eyebrow">GRAMMAR IN CONTEXT</div>
        <h3>このイベントで使う英語</h3>
        <div className="grammar-chip-list">
          {event.grammarFocus.map((tag) => <span className="grammar-chip" key={tag}>{grammarLabels[tag]}</span>)}
        </div>
        <p>文法名を当てるのではなく、客の問題を解決するために表現を使います。</p>
        <div className="event-tip">
          <strong>接客ポイント</strong>
          <p>正解は文法だけでは決まりません。丁寧さ、情報収集、解決策まで含めて評価されます。</p>
        </div>
      </aside>

      {result && (
        <section className={`event-result result-grade-${result.grade.toLowerCase()}`} ref={resultRef} aria-live="polite">
          <div className="result-effect" aria-hidden="true">
            {result.grade === 'S' && Array.from({ length: 18 }, (_, i) => <span className={`confetti confetti-${(i % 6) + 1}`} key={i} />)}
            {result.grade === 'A' && Array.from({ length: 8 }, (_, i) => <span className={`spark spark-${(i % 4) + 1}`} key={i}>✦</span>)}
          </div>
          <div className="result-heading-row">
            <div>
              <div className="eyebrow">EVENT RESULT</div>
              <h2>{result.grade === 'S' ? 'Handled perfectly!' : result.grade === 'A' ? 'Handled well!' : result.grade === 'B' ? 'Issue resolved.' : 'Customer left unhappy.'}</h2>
            </div>
            <div className={`grade-badge grade-${result.grade.toLowerCase()}`}>{result.grade}</div>
          </div>

          <div className="event-result-summary">
            <CustomerPortrait
              customerId={event.customerId}
              customerName={event.customerName}
              emotion={emotion}
              motion={motion}
              reactionTick={reactionTick}
              variant="result"
            />
            <div>
              <span>Event score</span>
              <strong>{result.points}/{result.maxPoints} · {Math.round(result.percent)}%</strong>
              <p>{result.grade === 'S' ? 'The customer feels heard and leaves with a clear solution.' : result.grade === 'A' ? 'You solved the problem with only minor room for improvement.' : result.grade === 'B' ? 'You reached a solution, but the conversation could have been smoother.' : 'The response missed important information or damaged customer trust.'}</p>
            </div>
          </div>

          <div className="event-review-list">
            {history.map((item, index) => (
              <div className={`event-review event-review-${item.quality}`} key={item.choiceId}>
                <div className="event-review-head">
                  <strong>Decision {index + 1}</strong>
                  <span>+{item.points}/{item.maxPoints}</span>
                </div>
                <div className="event-review-choice">“{item.choiceText}”</div>
                <p>{item.feedback}</p>
                {item.grammarTags.length > 0 && (
                  <div className="grammar-chip-list compact">
                    {item.grammarTags.map((tag) => <span className="grammar-chip" key={tag}>{grammarLabels[tag]}</span>)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="primary" onClick={handleContinue}>Continue shift</button>
        </section>
      )}
    </main>
  )
}
