import { useMemo } from 'react'
import { BuildActivityPlayer } from './BuildActivityPlayer'
import { ChapterActivityPlayer } from './ChapterActivityPlayer'
import { RepairActivityPlayer } from './RepairActivityPlayer'
import { buildPresentation, readBuildMode } from '../core/build'
import type { ReviewFocusRef } from '../core/review'
import type { WeaknessReviewRuntimeItem } from '../data/reviewRuntime'
import { grammarRegistryByKey } from '../data/grammarRegistry'

type Props = {
  items: WeaknessReviewRuntimeItem[]
  focusRefs: ReviewFocusRef[]
  transferChallenge: boolean
  index: number
  scores: number[]
  onComplete: (score: number, hintsUsed?: number) => void
  onExit: () => void
}

const SKILL_LABEL = {
  select: 'SELECT',
  build: 'BUILD',
  repair: 'REPAIR',
} as const

function average(values: number[]) {
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0
}

export function ReviewPracticeSession({
  items,
  focusRefs,
  transferChallenge,
  index,
  scores,
  onComplete,
  onExit,
}: Props) {
  const item = items[index]
  const finished = index >= items.length
  const focusLabels = useMemo(
    () => focusRefs.slice(0, 4).map((ref) => {
      const concept = grammarRegistryByKey.get(ref.key)
      return `${SKILL_LABEL[ref.skill]} · ${concept?.label ?? ref.key}`
    }),
    [focusRefs],
  )

  if (finished) {
    return (
      <main className="v060-review-session v060-review-session-complete">
        <section className="v060-review-session-complete-card">
          <div className="v060-review-complete-mark" aria-hidden="true">✓</div>
          <span className="v060-kicker">REVIEW COMPLETE</span>
          <h1>{average(scores)}%</h1>
          <p>{items.length} Activitiesを完了しました。</p>

          <div className="v060-review-focus-summary">
            <span>FOCUS</span>
            {focusLabels.map((label) => <strong key={label}>{label}</strong>)}
          </div>

          <button className="v060-primary-cta review" onClick={onExit}>
            Back to Review
          </button>
        </section>
      </main>
    )
  }

  if (!item) return null

  const skill = item.skill
  const activityTitle = item.activity.title

  return (
    <main className="v060-review-session">
      <header className="v060-review-session-header">
        <button type="button" onClick={onExit}>← Review</button>
        <div>
          <span className={`v060-skill-pill ${skill}`}>{SKILL_LABEL[skill]}</span>
          <strong>{index + 1} / {items.length}</strong>
        </div>
        <div className="v060-review-session-progress" aria-hidden="true">
          <span style={{ width: `${(index / items.length) * 100}%` }} />
        </div>
        {transferChallenge && <small>TRANSFER CHALLENGE · 新しい文脈で応用</small>}
        <h1>{activityTitle}</h1>
      </header>

      {skill === 'select' ? (
        <ChapterActivityPlayer
          key={item.activity.id}
          activity={item.activity}
          onComplete={(score, hintsUsed) => onComplete(score, hintsUsed)}
        />
      ) : skill === 'build' ? (
        <BuildActivityPlayer
          key={item.activity.id}
          activity={item.activity}
          mode={readBuildMode(window.localStorage)}
          presentation={buildPresentation(readBuildMode(window.localStorage), (item.activity.day - 1) * 3 + item.activity.activityNo - 1, item.activity.day)}
          onExit={onExit}
          onComplete={(score) => onComplete(score, 0)}
        />
      ) : (
        <RepairActivityPlayer
          key={item.activity.id}
          activity={item.activity}
          exitLabel="← Reviewへ戻る"
          onExit={onExit}
          onComplete={(score) => onComplete(score, 0)}
        />
      )}
    </main>
  )
}
