import { useEffect, useMemo, useRef } from 'react'

export interface LabScoreItem {
  label: string
  points: number
  max: number
  explanation: string
}

interface LabDetailedResultProps {
  total: number
  max?: number
  headline: string
  summary: string
  breakdown: LabScoreItem[]
  strengths?: string[]
  missed?: string[]
  bestRoute: string[]
  nextTime: string[]
}

function grade(percent: number) {
  if (percent >= 90) return 'S'
  if (percent >= 75) return 'A'
  if (percent >= 55) return 'B'
  return 'C'
}

export function LabDetailedResult({
  total,
  max = 100,
  headline,
  summary,
  breakdown,
  strengths = [],
  missed = [],
  bestRoute,
  nextTime,
}: LabDetailedResultProps) {
  const ref = useRef<HTMLDivElement>(null)
  const percent = max > 0 ? Math.round((total / max) * 100) : 0
  const resultGrade = grade(percent)
  const mainImprovement = nextTime[0] ?? '同じ判断をもう一度、より少ない手順で試してみましょう。'
  const maxScoreSum = useMemo(() => breakdown.reduce((sum, item) => sum + item.max, 0), [breakdown])

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }))
  }, [])

  return (
    <div ref={ref} className={`lab-result-detail result-grade-${resultGrade.toLowerCase()}`} aria-live="polite">
      <div className="lab-result-hero">
        <div>
          <div className="eyebrow">ACTIVITY RESULT</div>
          <div className="lab-result-score-line">
            <strong>{total}/{max}</strong>
            <span>{percent}%</span>
          </div>
          <h3>{headline}</h3>
          <p>{summary}</p>
        </div>
        <div className={`grade-badge grade-${resultGrade.toLowerCase()}`}>{resultGrade}</div>
      </div>

      <section className="lab-feedback-section">
        <div className="lab-feedback-title">
          <div><span>01</span><strong>Score breakdown</strong></div>
          <small>{maxScoreSum === max ? `合計 ${max} 点` : `表示項目 ${maxScoreSum} 点分`}</small>
        </div>
        <div className="lab-score-breakdown">
          {breakdown.map((item) => {
            const ratio = item.max > 0 ? Math.max(0, Math.min(100, Math.round((item.points / item.max) * 100))) : 0
            return (
              <article key={item.label} className="lab-score-item">
                <div className="lab-score-item-head">
                  <strong>{item.label}</strong>
                  <span>{item.points}/{item.max}</span>
                </div>
                <div className="lab-score-meter" aria-hidden="true"><span style={{ width: `${ratio}%` }} /></div>
                <p>{item.explanation}</p>
              </article>
            )
          })}
        </div>
      </section>

      {(strengths.length > 0 || missed.length > 0) && (
        <section className="lab-feedback-section lab-feedback-two-col">
          <div>
            <div className="lab-feedback-title"><div><span>02</span><strong>Why this score?</strong></div></div>
            <div className="lab-feedback-list positive">
              {strengths.length > 0 ? strengths.map((item) => <div key={item}><b>✓</b><span>{item}</span></div>) : <div><b>–</b><span>今回は加点につながる判断が少なめでした。</span></div>}
            </div>
          </div>
          <div>
            <div className="lab-feedback-title"><div><span>03</span><strong>Missed / unnecessary</strong></div></div>
            <div className="lab-feedback-list caution">
              {missed.length > 0 ? missed.map((item) => <div key={item}><b>△</b><span>{item}</span></div>) : <div><b>✓</b><span>大きな見逃しや無駄はありませんでした。</span></div>}
            </div>
          </div>
        </section>
      )}

      <section className="lab-feedback-section">
        <div className="lab-feedback-title"><div><span>04</span><strong>Best route</strong></div><small>この問題での一例</small></div>
        <div className="lab-best-route">
          {bestRoute.map((step, index) => (
            <div key={`${step}-${index}`} className="lab-route-step">
              <span>{index + 1}</span><strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="lab-feedback-section">
        <div className="lab-main-improvement">
          <span>MAIN IMPROVEMENT</span>
          <strong>{mainImprovement}</strong>
        </div>
        <div className="lab-next-time">
          <h4>NEXT TIME</h4>
          <ol>
            {nextTime.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
      </section>
    </div>
  )
}
