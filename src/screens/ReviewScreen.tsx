import { useMemo, useState } from 'react'
import type { AppView } from '../App'
import { ReviewPracticeSession } from '../components/ReviewPracticeSession'
import {
  masterySkillStats,
  readMasteryProgress,
  type GrammarMasteryProgress,
  type MasterySkill,
} from '../core/mastery'
import { weaknessPriorityBySkill } from '../core/review'
import { readAdvancedProgress } from '../core/advanced'
import { completedSelectDays } from '../core/buildDayFlow'
import {
  buildProgressAwareWeaknessReviewActivities,
  type WeaknessReviewRuntimeItem,
} from '../data/reviewRuntime'
import { repairActivities } from '../data/advancedTrainingActivities'
import { grammarRegistry, grammarRegistryByKey } from '../data/grammarRegistry'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'

type Props = {
  onNavigate: (view: AppView) => void
}

const SKILLS: Array<{
  id: MasterySkill
  label: string
  ja: string
  description: string
}> = [
  { id: 'select', label: 'SELECT', ja: '見分ける', description: '正しい意味・用法を判断する' },
  { id: 'build', label: 'BUILD', ja: '作る', description: '自分で自然な英文を組み立てる' },
  { id: 'repair', label: 'REPAIR', ja: '直す', description: '誤りを見抜き、自然な形へ直す' },
]

type ActiveReview = {
  items: WeaknessReviewRuntimeItem[]
  focusRefs: ReturnType<typeof weaknessPriorityBySkill>
  transferChallenge: boolean
}

function average(values: number[]) {
  return values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : null
}

function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
}

function skillSummary(progress: GrammarMasteryProgress, skill: MasterySkill) {
  const values = grammarRegistry
    .map((concept) => masterySkillStats(progress.entries[concept.key], skill))
    .filter((stats): stats is NonNullable<typeof stats> => Boolean(stats))
    .map((stats) => stats.mastery)

  return {
    value: average(values),
    measured: values.length,
  }
}

export function ReviewScreen({ onNavigate }: Props) {
  const [progress, setProgress] = useState(() => readMasteryProgress(window.localStorage))
  const [activeReview, setActiveReview] = useState<ActiveReview | null>(null)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [reviewScores, setReviewScores] = useState<number[]>([])

  const priorities = useMemo(() => weaknessPriorityBySkill(progress), [progress])
  const plan = useMemo(
    () => buildProgressAwareWeaknessReviewActivities(progress, 5, window.localStorage),
    [progress],
  )

  const next = priorities[0]
  const nextConcept = next ? grammarRegistryByKey.get(next.key) : undefined
  const nextStats = next ? masterySkillStats(progress.entries[next.key], next.skill) : null

  const summaries = SKILLS.map((skill) => ({
    ...skill,
    ...skillSummary(progress, skill.id),
  }))

  const advanced = readAdvancedProgress(window.localStorage)
  const selectDaysDone = completedSelectDays(window.localStorage).length
  const repairUnlocked = DEBUG_UNLOCK_ALL_DAYS || selectDaysDone >= 48

  const startReview = () => {
    const nextPlan = buildProgressAwareWeaknessReviewActivities(progress, 5, window.localStorage)
    if (!nextPlan.items.length) return
    setActiveReview({
      items: nextPlan.items,
      focusRefs: nextPlan.focusRefs,
      transferChallenge: nextPlan.transferChallenge,
    })
    setReviewIndex(0)
    setReviewScores([])
    scrollTop()
  }

  const completeActivity = (score: number) => {
    setReviewScores((current) => [...current, score])
    setProgress(readMasteryProgress(window.localStorage))
    setReviewIndex((current) => current + 1)
    scrollTop()
  }

  const leaveReview = () => {
    setProgress(readMasteryProgress(window.localStorage))
    setActiveReview(null)
    setReviewIndex(0)
    setReviewScores([])
    scrollTop()
  }

  if (activeReview) {
    return (
      <ReviewPracticeSession
        items={activeReview.items}
        focusRefs={activeReview.focusRefs}
        transferChallenge={activeReview.transferChallenge}
        index={reviewIndex}
        scores={reviewScores}
        onComplete={completeActivity}
        onExit={leaveReview}
      />
    )
  }

  return (
    <main className="v060-hub-main v060-review v060-review-v3">
      <section className="v060-page-intro v060-review-intro">
        <div>
          <span className="v060-kicker">REVIEW</span>
          <h1>Fix what is holding you back.</h1>
          <p>弱点を分析するだけでなく、そのまま短い復習へ入ります。</p>
        </div>
      </section>

      <section className={`v060-review-hero v060-review-action-hero ${next ? 'has-weakness' : 'is-empty'}`}>
        <span className="v060-kicker">{next ? 'NEXT BEST REVIEW' : 'BUILD YOUR BASELINE'}</span>

        {next && nextStats ? (
          <>
            <div className="v060-review-next-focus">
              <div>
                <span className={`v060-skill-pill ${next.skill} active`}>
                  {next.skill.toUpperCase()}
                </span>
                <h2>{nextConcept?.label ?? next.key}</h2>
                <small>{nextConcept?.labelJa ?? ''}</small>
              </div>
              <strong>{nextStats.mastery}%</strong>
            </div>

            <p className="v060-review-next-copy">
              {next.skill === 'build'
                ? '意味は分かっていても、自分で作る段階がまだ不安定です。'
                : next.skill === 'repair'
                  ? '誤りを見抜き、自然な形へ直す力を優先して整えます。'
                  : '意味と用法を見分ける精度を、既習シーンで確認します。'}
            </p>

            <div className="v060-review-plan-meta">
              <span>{plan.items.length} Activities</span>
              <span>約{Math.max(3, plan.items.length)}分</span>
              <span>{plan.transferChallenge ? 'Transfer Challenge' : 'Practiced content only'}</span>
            </div>

            <button
              className="v060-primary-cta review"
              onClick={startReview}
              disabled={!plan.items.length}
            >
              Review {plan.items.length || 5} activities
            </button>
          </>
        ) : (
          <>
            <h2>No weak points yet</h2>
            <p>まずShiftsを進めると、SELECT / BUILD / REPAIR別に弱点を測定できます。</p>
            <button className="v060-primary-cta review" onClick={() => onNavigate('learn')}>
              Go to Shifts
            </button>
          </>
        )}
      </section>

      <section className="v060-review-section">
        <div className="v060-section-head">
          <span>
            <small>YOUR ABILITIES</small>
            <strong>Three skills</strong>
          </span>
        </div>

        <div className="v060-skill-summary-grid v060-skill-summary-compact">
          {summaries.map((skill) => (
            <article className={`v060-skill-summary ${skill.id}`} key={skill.id}>
              <div className="v060-skill-summary-head">
                <span className={`v060-skill-pill ${skill.id}`}>{skill.label}</span>
                <strong>{skill.value == null ? '—' : `${skill.value}%`}</strong>
              </div>
              <h3>{skill.ja}</h3>
              <p>{skill.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="v060-review-section">
        <div className="v060-section-head">
          <span>
            <small>WEAK POINTS</small>
            <strong>{priorities.length ? 'Top priorities' : 'No measured weak points'}</strong>
          </span>
          <em className="v060-review-count">{priorities.length}</em>
        </div>

        {priorities.length ? (
          <div className="v060-weak-list">
            {priorities.slice(0, 5).map((ref, index) => {
              const concept = grammarRegistryByKey.get(ref.key)
              const stats = masterySkillStats(progress.entries[ref.key], ref.skill)
              return (
                <div className="v060-weak-row v060-weak-row-static" key={`${ref.skill}:${ref.key}`}>
                  <span className="v060-weak-rank">{index + 1}</span>
                  <span className={`v060-skill-pill ${ref.skill}`}>{ref.skill.toUpperCase()}</span>
                  <span>
                    <strong>{concept?.label ?? ref.key}</strong>
                    <small>{concept?.labelJa ?? ''}</small>
                  </span>
                  <em>{stats ? `${stats.mastery}%` : '—'}</em>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="v060-review-empty-row">プレイデータがたまると、優先弱点をここに表示します。</div>
        )}
      </section>

      <section className="v060-review-section">
        <div className="v060-section-head">
          <span>
            <small>REPAIR</small>
            <strong>Fix broken English</strong>
          </span>
        </div>

        <button
          className={`v060-repair-route-card ${repairUnlocked ? '' : 'locked'}`}
          onClick={() => onNavigate('repair')}
        >
          <div>
            <span className="v060-skill-pill repair">REPAIR LAB</span>
            <h3>英文を直して理解を深める</h3>
            <p>誤りを見つけ、正しい・自然な英語へ修正する24問。</p>
          </div>
          <div className="v060-repair-route-progress">
            <strong>{advanced.repairCompleted.length}</strong>
            <span>/ {repairActivities.length}</span>
            <em>{repairUnlocked ? 'Open →' : `${selectDaysDone}/48 SELECT`}</em>
          </div>
        </button>
      </section>

      <details className="v060-review-details">
        <summary>
          <span>
            <strong>Advanced mastery details</strong>
            <small>96文法項目の能力別スコア・履歴</small>
          </span>
          <span>＋</span>
        </summary>
        <div>
          <p>より細かい文法別Mastery、履歴、旧データの確認はこちらから開けます。</p>
          <button className="v060-secondary-cta" onClick={() => onNavigate('masteryDetails')}>
            Open 96-concept details
          </button>
        </div>
      </details>
    </main>
  )
}
