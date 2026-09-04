import { useMemo, useState } from 'react'
import { ChapterActivityPlayer } from '../components/ChapterActivityPlayer'
import { gradeFromPercent, type Chapter1Activity } from '../core/chapter1'
import type { GrammarKey, GrammarTier } from '../core/grammar'
import {
  emptyMasteryProgress,
  masteryStats,
  readMasteryProgress,
  resetMasteryProgress,
  type GrammarMasteryProgress,
  type GrammarMasteryStats,
} from '../core/mastery'
import { grammarRegistry, grammarRegistryByKey } from '../data/grammarRegistry'
import { grammarTargetsForActivity } from '../data/grammarRuntime'
import { buildWeaknessReviewActivities } from '../data/reviewRuntime'

const TIER_ORDER: GrammarTier[] = ['ES-G1', 'ES-G2', 'ES-G3']

const BAND_LABEL: Record<GrammarMasteryStats['band'], string> = {
  unseen: 'Not practiced',
  learning: 'Learning',
  developing: 'Developing',
  strong: 'Strong',
  mastered: 'Mastered',
}

function percentAverage(values: number[]) {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0
}

function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
}

type ActiveReview = {
  activities: Chapter1Activity[]
  focusKeys: GrammarKey[]
  priorityKeys: GrammarKey[]
  startingProgress: GrammarMasteryProgress
}

export function MasteryScreen() {
  const [progress, setProgress] = useState(() => readMasteryProgress(window.localStorage))
  const [review, setReview] = useState<ActiveReview | null>(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewScores, setReviewScores] = useState<number[]>([])
  const [reviewHints, setReviewHints] = useState<number[]>([])

  const rows = useMemo(() => grammarRegistry.map((concept) => {
    const entry = progress.entries[concept.key]
    return { concept, stats: entry ? masteryStats(entry) : null }
  }), [progress])

  const practiced = rows.filter((row) => row.stats)
  const overallMastery = percentAverage(practiced.map((row) => row.stats!.mastery))
  const mastered = practiced.filter((row) => row.stats!.band === 'mastered')
  const needsReview = practiced
    .filter((row) => row.stats!.mastery < 75 || (row.stats!.hintedAttempts > 0 && row.stats!.mastery < 85))
    .sort((a, b) => {
      const masteryDelta = a.stats!.mastery - b.stats!.mastery
      if (masteryDelta !== 0) return masteryDelta
      return b.stats!.hintedAttempts - a.stats!.hintedAttempts
    })
  const strengths = practiced
    .filter((row) => row.stats!.mastery >= 75)
    .sort((a, b) => b.stats!.mastery - a.stats!.mastery)
    .slice(0, 6)
  const reviewPreview = useMemo(() => buildWeaknessReviewActivities(progress, 5), [progress])

  const doReset = () => {
    if (!window.confirm('Reset all grammar mastery tracking data? Chapter and Exam progress will not be changed.')) return
    resetMasteryProgress(window.localStorage)
    setProgress(emptyMasteryProgress())
  }

  const startWeaknessReview = () => {
    const plan = buildWeaknessReviewActivities(progress, 5)
    if (plan.activities.length === 0) return
    setReview({
      activities: plan.activities,
      focusKeys: plan.focusKeys,
      priorityKeys: plan.priorityKeys,
      startingProgress: progress,
    })
    setReviewIndex(0)
    setReviewScores([])
    setReviewHints([])
    scrollTop()
  }

  const completeReviewActivity = (score: number, japaneseHintsUsed: number) => {
    setReviewScores((current) => [...current, score])
    setReviewHints((current) => [...current, japaneseHintsUsed])
    // ChapterActivityPlayer records mastery before calling this callback.
    setProgress(readMasteryProgress(window.localStorage))
    setReviewIndex((current) => current + 1)
    scrollTop()
  }

  const leaveReview = () => {
    setProgress(readMasteryProgress(window.localStorage))
    setReview(null)
    setReviewIndex(0)
    setReviewScores([])
    setReviewHints([])
    scrollTop()
  }

  if (review) {
    return (
      <WeaknessReviewSession
        review={review}
        activityIndex={reviewIndex}
        scores={reviewScores}
        hints={reviewHints}
        onComplete={completeReviewActivity}
        onExit={leaveReview}
      />
    )
  }

  return (
    <main className="mastery-shell">
      <section className="mastery-hero">
        <div>
          <div className="eyebrow">PLAYER MASTERY · PERSONAL LEARNING DATA</div>
          <h2>Grammar Mastery</h2>
          <p>得点、反復回数、日本語ヒントへの依存を組み合わせて、文法ごとの現在地を記録します。</p>
        </div>
        <div className="mastery-overall-ring" aria-label={`Overall mastery ${overallMastery}%`}>
          <strong>{overallMastery}%</strong>
          <span>Overall</span>
        </div>
      </section>

      <div className="mastery-tracking-note">
        <strong>TRACKING FROM v0.3.14</strong>
        <span>過去バージョンのクリア履歴は推測で補完せず、v0.3.14以降に完了したActivityから正確に記録します。</span>
      </div>

      <section className="mastery-summary-grid">
        <div><span>Practiced</span><strong>{practiced.length}<small> / {grammarRegistry.length}</small></strong></div>
        <div><span>Mastered</span><strong>{mastered.length}</strong></div>
        <div><span>Needs Review</span><strong>{needsReview.length}</strong></div>
        <div><span>Attempts</span><strong>{practiced.reduce((sum, row) => sum + row.stats!.attempts, 0)}</strong></div>
      </section>

      <section className="mastery-tier-grid">
        {TIER_ORDER.map((tier) => {
          const tierRows = rows.filter((row) => row.concept.tier === tier)
          const tierPracticed = tierRows.filter((row) => row.stats)
          const value = percentAverage(tierPracticed.map((row) => row.stats!.mastery))
          return (
            <div className="mastery-tier-card" key={tier}>
              <div><span>{tier}</span><strong>{value}%</strong></div>
              <div className="mastery-bar"><span style={{ width: `${value}%` }} /></div>
              <small>{tierPracticed.length}/{tierRows.length} concepts practiced</small>
            </div>
          )
        })}
      </section>

      <div className="mastery-focus-grid">
        <section className="mastery-panel mastery-review-panel">
          <div className="mastery-panel-head">
            <div><span>NEXT REVIEW</span><h3>優先して復習</h3></div>
            <strong>{needsReview.length}</strong>
          </div>
          {needsReview.length === 0 ? (
            <p className="mastery-empty">まだ弱点データはありません。Activityをプレイするとここに自動表示されます。</p>
          ) : (
            <>
              <div className="mastery-focus-list">
                {needsReview.slice(0, 8).map(({ concept, stats }) => <MasteryFocusRow key={concept.key} concept={concept} stats={stats!} />)}
              </div>
              <div className="weakness-review-launch">
                <div>
                  <span>WEAKNESS REVIEW</span>
                  <strong>{reviewPreview.activities.length} Activities · {reviewPreview.focusKeys.length} focus concepts</strong>
                  <small>現在の弱点を含む既存Activityを自動選択します。Chapter / Examの進行状況は変更しません。</small>
                </div>
                <button className="primary" onClick={startWeaknessReview} disabled={reviewPreview.activities.length === 0}>Review Weak Points</button>
              </div>
            </>
          )}
        </section>

        <section className="mastery-panel mastery-strength-panel">
          <div className="mastery-panel-head">
            <div><span>STRENGTHS</span><h3>現在の強み</h3></div>
            <strong>{strengths.length}</strong>
          </div>
          {strengths.length === 0 ? (
            <p className="mastery-empty">十分なプレイデータがたまると、強い文法がここに表示されます。</p>
          ) : (
            <div className="mastery-focus-list">
              {strengths.map(({ concept, stats }) => <MasteryFocusRow key={concept.key} concept={concept} stats={stats!} />)}
            </div>
          )}
        </section>
      </div>

      <details className="mastery-all-card">
        <summary>
          <span><strong>All Grammar Concepts</strong><small>96項目の詳細を見る</small></span>
          <strong>{practiced.length}/{grammarRegistry.length}</strong>
        </summary>
        <div className="mastery-all-body">
          {TIER_ORDER.map((tier) => (
            <section key={tier} className="mastery-tier-section">
              <div className="mastery-tier-heading"><span>{tier}</span><strong>{rows.filter((row) => row.concept.tier === tier && row.stats).length}/{rows.filter((row) => row.concept.tier === tier).length}</strong></div>
              <div className="mastery-concept-grid">
                {rows.filter((row) => row.concept.tier === tier).map(({ concept, stats }) => (
                  <div className={`mastery-concept-card ${stats ? `band-${stats.band}` : 'band-unseen'}`} key={concept.key}>
                    <div className="mastery-concept-head">
                      <div><strong>{concept.label}</strong><span>{concept.labelJa}</span></div>
                      <em>{stats ? `${stats.mastery}%` : '—'}</em>
                    </div>
                    {stats ? (
                      <div className="mastery-concept-meta">
                        <span>{BAND_LABEL[stats.band]}</span>
                        <span>Attempts {stats.attempts}</span>
                        <span>Success {stats.successfulAttempts}/{stats.attempts}</span>
                        <span>Best {stats.bestScore}</span>
                        <span>Hints {stats.totalHints}</span>
                        <span>T {stats.targetAttempts} · R {stats.reviewAttempts}</span>
                      </div>
                    ) : <div className="mastery-concept-meta"><span>Not practiced yet</span></div>}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </details>

      <section className="mastery-method-card">
        <div><span>HOW MASTERY WORKS</span><strong>1回の満点だけでは「習得済み」にしません。</strong></div>
        <p>Activityの平均得点・82点以上の成功率・ヒントなし率を中心にし、反復回数を信頼度として加味します。2回以上の安定した成功でMasteredへ到達します。</p>
      </section>

      <button className="secondary-button mastery-reset" onClick={doReset}>Reset mastery data only</button>
    </main>
  )
}

function WeaknessReviewSession({ review, activityIndex, scores, hints, onComplete, onExit }: {
  review: ActiveReview
  activityIndex: number
  scores: number[]
  hints: number[]
  onComplete: (score: number, japaneseHintsUsed: number) => void
  onExit: () => void
}) {
  const done = activityIndex >= review.activities.length

  if (done) {
    const current = readMasteryProgress(window.localStorage)
    const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0
    const hintCount = hints.reduce((sum, value) => sum + value, 0)
    const grade = gradeFromPercent(average)
    const changes = review.focusKeys.map((key) => {
      const concept = grammarRegistryByKey.get(key)
      const beforeEntry = review.startingProgress.entries[key]
      const afterEntry = current.entries[key]
      const before = beforeEntry ? masteryStats(beforeEntry).mastery : 0
      const after = afterEntry ? masteryStats(afterEntry).mastery : 0
      return { key, concept, before, after, delta: after - before }
    })
    const improved = changes.filter((item) => item.delta > 0).length

    return (
      <main className="weakness-review-shell">
        <section className="weakness-review-result">
          <div>
            <div className="eyebrow">WEAKNESS REVIEW · COMPLETE</div>
            <h2>Review Session Complete</h2>
            <p>弱点に関連する既存Activityだけを短く復習しました。結果はすでにGrammar Masteryへ反映されています。</p>
          </div>
          <div className={`grade-badge grade-${grade.toLowerCase()}`}>{grade}</div>
        </section>
        <section className="chapter-day-score-grid weakness-review-score-grid">
          <div><span>Average</span><strong>{average}%</strong></div>
          <div><span>Activities</span><strong>{scores.length}</strong></div>
          <div><span>Improved</span><strong>{improved}/{changes.length}</strong></div>
          <div><span>Japanese hints</span><strong>{hintCount}</strong></div>
        </section>
        <section className="weakness-review-change-card">
          <div className="eyebrow">MASTERY UPDATE</div>
          <div className="weakness-review-change-list">
            {changes.map((item) => (
              <div key={item.key}>
                <span><strong>{item.concept?.label ?? item.key}</strong><small>{item.concept?.labelJa}</small></span>
                <span className="weakness-review-change-score"><em>{item.before}%</em><b>→</b><strong>{item.after}%</strong><small>{item.delta > 0 ? `+${item.delta}` : item.delta}</small></span>
              </div>
            ))}
          </div>
        </section>
        <button className="primary chapter-start" onClick={onExit}>Back to Mastery</button>
      </main>
    )
  }

  const activity = review.activities[activityIndex]
  const activityFocusKeys = [...new Set(grammarTargetsForActivity(activity)
    .map((ref) => ref.key)
    .filter((key) => review.focusKeys.includes(key)))]

  return (
    <main className="chapter-play weakness-review-play">
      <button className="chapter-back" onClick={onExit}>← Exit review</button>
      <div className="weakness-review-play-head">
        <div>
          <div className="eyebrow">WEAKNESS REVIEW · ACTIVITY {activityIndex + 1}/{review.activities.length}</div>
          <h2>{activity.title}</h2>
        </div>
        <div className="weakness-review-focus-chips">
          {activityFocusKeys.map((key) => {
            const concept = grammarRegistryByKey.get(key)
            return <span key={key}>{concept?.labelJa ?? key}</span>
          })}
        </div>
      </div>
      <div className="chapter-progress-track"><span style={{ width: `${(activityIndex / review.activities.length) * 100}%` }} /></div>
      <section className="weakness-review-context-note">
        <strong>FOCUS</strong>
        <span>弱点文法を含む既存Activityです。ここでの結果はMasteryだけを更新し、Chapter / Exam進捗には影響しません。</span>
      </section>
      <ChapterActivityPlayer key={`${activity.id}:review:${activityIndex}`} activity={activity} onComplete={onComplete} />
    </main>
  )
}

function MasteryFocusRow({ concept, stats }: {
  concept: (typeof grammarRegistry)[number]
  stats: GrammarMasteryStats
}) {
  return (
    <div className={`mastery-focus-row band-${stats.band}`}>
      <div className="mastery-focus-copy">
        <strong>{concept.label}</strong>
        <span>{concept.labelJa}</span>
        <small>{concept.tier} · success {stats.successfulAttempts}/{stats.attempts} · best {stats.bestScore} · hints {stats.totalHints}</small>
      </div>
      <div className="mastery-focus-score"><strong>{stats.mastery}%</strong><span>{BAND_LABEL[stats.band]}</span></div>
    </div>
  )
}
