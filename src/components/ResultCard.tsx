import { useEffect, useRef } from 'react'
import { products } from '../data/products'
import { customers } from '../data/customers'
import { eventAfterCustomer } from '../data/events'
import { customerResultLine } from '../core/reactions'
import { CustomerPortrait } from './CustomerPortrait'
import { useGameStore, currentBestProduct } from '../store/gameStore'

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

function scrollToPageTop() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: preferredScrollBehavior() })
    })
  })
}

export function ResultCard() {
  const result = useGameStore((s) => s.result)
  const selectedId = useGameStore((s) => s.selectedProductId)
  const nextCustomer = useGameStore((s) => s.nextCustomer)
  const index = useGameStore((s) => s.customerIndex)
  const customerEmotion = useGameStore((s) => s.customerEmotion)
  const customerMotion = useGameStore((s) => s.customerMotion)
  const reactionTick = useGameStore((s) => s.reactionTick)
  const completedEventIds = useGameStore((s) => s.completedEventIds)
  const cardRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!result) return
    const frame = requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' })
    })
    return () => cancelAnimationFrame(frame)
  }, [result])

  if (!result || !selectedId) return null

  const chosen = products.find((item) => item.id === selectedId)
  const best = currentBestProduct()
  const customer = customers[index]

  const grade = result.choiceQuality >= 98 ? 'S' : result.choiceQuality >= 90 ? 'A' : result.choiceQuality >= 75 ? 'B' : 'C'
  const label = grade === 'S'
    ? 'Excellent recommendation!'
    : grade === 'A'
      ? 'Great recommendation!'
      : grade === 'B'
        ? 'Reasonable choice.'
        : 'Poor match.'

  const pendingEvent = eventAfterCustomer(index)
  const hasPendingEvent = Boolean(pendingEvent && !completedEventIds.includes(pendingEvent.id))

  const handleNext = () => {
    nextCustomer()
    scrollToPageTop()
  }

  return (
    <section className={`result-card result-grade-${grade.toLowerCase()}`} ref={cardRef} aria-live="polite">
      <div className="result-effect" aria-hidden="true">
        {grade === 'S' && Array.from({ length: 18 }, (_, i) => <span className={`confetti confetti-${(i % 6) + 1}`} key={i} />)}
        {grade === 'A' && Array.from({ length: 8 }, (_, i) => <span className={`spark spark-${(i % 4) + 1}`} key={i}>✦</span>)}
      </div>
      <div className="result-heading-row">
        <div>
          <div className="eyebrow">RESULT</div>
          <h2>{label}</h2>
        </div>
        <div className={`grade-badge grade-${grade.toLowerCase()}`} aria-label={`Grade ${grade}`}>{grade}</div>
      </div>

      <div className="customer-result-reaction">
        <CustomerPortrait
          customerId={customer.id}
          customerName={customer.name}
          emotion={customerEmotion}
          motion={customerMotion}
          reactionTick={reactionTick}
          variant="result"
        />
        <div className="customer-result-copy">
          <span>{customer.name}'s reaction</span>
          <strong>“{customerResultLine(result.choiceQuality)}”</strong>
        </div>
      </div>

      <div className="result-grid">
        <div><span>Product Fit</span><strong>{Math.round(result.match.finalScore)}%</strong></div>
        <div><span>Choice Quality</span><strong>{Math.round(result.choiceQuality)}%</strong></div>
        <div><span>Match Points</span><strong>+{result.matchPoints}</strong></div>
        <div><span>Efficiency</span><strong>+{result.efficiencyBonus}</strong></div>
        <div><span>Information</span><strong>+{result.informationBonus}</strong></div>
      </div>
      <p className="result-copy">You chose <strong>{chosen?.name}</strong>. Best calculated fit: <strong>{best.name}</strong>.</p>
      <div className="english-tip">
        <span>Recommended English</span>
        <strong>“I'd recommend this one because it matches what you're looking for.”</strong>
      </div>
      <button className="primary" onClick={handleNext}>{hasPendingEvent ? 'Handle store event' : index === 9 ? 'Finish shift' : 'Next customer'}</button>
    </section>
  )
}
