import { useMemo, useState } from 'react'
import { BuildActivityPlayer } from '../components/BuildActivityPlayer'
import { ChapterActivityPlayer } from '../components/ChapterActivityPlayer'
import { RepairActivityPlayer } from '../components/RepairActivityPlayer'
import { gradeFromPercent } from '../core/chapter1'
import type { GrammarKey, GrammarTier } from '../core/grammar'
import {
  emptyMasteryProgress,
  hasLegacyMastery,
  masterySkillStats,
  overallMasteryStats,
  readMasteryProgress,
  resetMasteryProgress,
  type GrammarMasteryProgress,
  type GrammarMasteryStats,
  type MasterySkill,
} from '../core/mastery'
import { weaknessPriorityBySkill, type ReviewFocusRef } from '../core/review'
import { grammarRegistry, grammarRegistryByKey } from '../data/grammarRegistry'
import { grammarTargetsForActivity } from '../data/grammarRuntime'
import { buildProgressAwareWeaknessReviewActivities, type WeaknessReviewRuntimeItem } from '../data/reviewRuntime'
import '../styles/masterySkills.css'

const TIER_ORDER: GrammarTier[] = ['ES-G1', 'ES-G2', 'ES-G3']
const SKILL_ORDER: MasterySkill[] = ['select', 'build', 'repair']

const SKILL_META: Record<MasterySkill, { label: string; ja: string; description: string }> = {
  select: { label: 'SELECT', ja: '見分ける', description: '正しい英語を選び、意味と用法を判断する力' },
  build: { label: 'BUILD', ja: '作る', description: '必要な語句を自分で並べ、英文を組み立てる力' },
  repair: { label: 'REPAIR', ja: '直す', description: '不自然・誤った英文を見抜き、修正する力' },
}

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

function skillValue(progress: GrammarMasteryProgress, ref: ReviewFocusRef) {
  return masterySkillStats(progress.entries[ref.key], ref.skill)?.mastery ?? null
}

function activityFocusKeys(item: WeaknessReviewRuntimeItem, refs: ReviewFocusRef[]) {
  const targets = item.skill === 'select'
    ? grammarTargetsForActivity(item.activity)
    : item.activity.grammarTargets
  return [...new Set(targets
    .map((target) => target.key)
    .filter((key) => refs.some((ref) => ref.skill === item.skill && ref.key === key)))]
}

type ActiveReview = {
  items: WeaknessReviewRuntimeItem[]
  focusRefs: ReviewFocusRef[]
  priorityRefs: ReviewFocusRef[]
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
    return {
      concept,
      entry,
      overall: overallMasteryStats(entry),
      skills: {
        select: masterySkillStats(entry, 'select'),
        build: masterySkillStats(entry, 'build'),
        repair: masterySkillStats(entry, 'repair'),
      },
    }
  }), [progress])

  const practiced = rows.filter((row) => row.overall)
  const overallMastery = percentAverage(practiced.map((row) => row.overall!.mastery))
  const mastered = practiced.filter((row) => row.overall!.band === 'mastered')
  const priorityRefs = useMemo(() => weaknessPriorityBySkill(progress), [progress])
  const needsReview = priorityRefs.map((ref) => ({
    ref,
    concept: grammarRegistryByKey.get(ref.key),
    stats: masterySkillStats(progress.entries[ref.key], ref.skill)!,
  }))
  const strengths = practiced
    .filter((row) => row.overall!.mastery >= 75)
    .sort((a, b) => b.overall!.mastery - a.overall!.mastery)
    .slice(0, 6)
  const reviewPreview = useMemo(() => buildProgressAwareWeaknessReviewActivities(progress, 5, window.localStorage), [progress])
  const legacyPreserved = hasLegacyMastery(progress)

  const skillSummary = SKILL_ORDER.map((skill) => {
    const measured = rows.map((row) => row.skills[skill]).filter((stats): stats is GrammarMasteryStats => Boolean(stats))
    return {
      skill,
      value: percentAverage(measured.map((stats) => stats.mastery)),
      measured: measured.length,
      attempts: measured.reduce((sum, stats) => sum + stats.attempts, 0),
    }
  })

  const doReset = () => {
    if (!window.confirm('Reset all grammar mastery tracking data? Chapter, Level 2, Exam, and Advanced progress will not be changed.')) return
    resetMasteryProgress(window.localStorage)
    setProgress(emptyMasteryProgress())
  }

  const startWeaknessReview = () => {
    const plan = buildProgressAwareWeaknessReviewActivities(progress, 5, window.localStorage)
    if (plan.items.length === 0) return
    setReview({
      items: plan.items,
      focusRefs: plan.focusRefs,
      priorityRefs: plan.priorityRefs,
      startingProgress: progress,
    })
    setReviewIndex(0)
    setReviewScores([])
    setReviewHints([])
    scrollTop()
  }

  const completeReviewActivity = (score: number, hintsUsed = 0) => {
    setReviewScores((current) => [...current, score])
    setReviewHints((current) => [...current, hintsUsed])
    // Each player records mastery before calling this callback.
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
    return <WeaknessReviewSession
      review={review}
      activityIndex={reviewIndex}
      scores={reviewScores}
      hints={reviewHints}
      onComplete={completeReviewActivity}
      onExit={leaveReview}
    />
  }

  return (
    <main className="mastery-shell">
      <section className="mastery-hero">
        <div>
          <div className="eyebrow">PLAYER MASTERY · v0.4.7</div>
          <h2>Grammar Mastery</h2>
          <p>文法ごとに「見分ける・作る・直す」を分けて記録します。総合値は残しつつ、能力差を隠さないMasteryへ更新しました。</p>
        </div>
        <div className="mastery-overall-ring" aria-label={`Overall mastery ${overallMastery}%`}>
          <strong>{overallMastery}%</strong>
          <span>Overall</span>
        </div>
      </section>

      {legacyPreserved ? (
        <div className="mastery-tracking-note mastery-migration-note">
          <strong>v0.4.6 DATA PRESERVED</strong>
          <span>以前のMasteryは総合値として保持しました。旧データはSELECT / BUILD / REPAIRへ安全に分解できないため、3能力の内訳はv0.4.7以降の実測だけで表示します。</span>
        </div>
      ) : (
        <div className="mastery-tracking-note">
          <strong>ABILITY TRACKING</strong>
          <span>Level 1 / Exam ShiftはSELECT、Level 2はBUILD、REPAIR LABはREPAIRとして別々に記録します。</span>
        </div>
      )}

      <section className="mastery-summary-grid">
        <div><span>Practiced</span><strong>{practiced.length}<small> / {grammarRegistry.length}</small></strong></div>
        <div><span>Mastered</span><strong>{mastered.length}</strong></div>
        <div><span>Skill Weaknesses</span><strong>{needsReview.length}</strong></div>
        <div><span>Measured Skills</span><strong>{skillSummary.reduce((sum, item) => sum + item.measured, 0)}</strong></div>
      </section>

      <section className="mastery-skill-overview" aria-label="Ability mastery overview">
        {skillSummary.map(({ skill, value, measured, attempts }) => {
          const meta = SKILL_META[skill]
          return <article className={`mastery-skill-summary-card skill-${skill}`} key={skill}>
            <div className="mastery-skill-summary-head">
              <span>{meta.label}</span><strong>{measured ? `${value}%` : '—'}</strong>
            </div>
            <h3>{meta.ja}</h3>
            <p>{meta.description}</p>
            <div className="mastery-skill-track"><span style={{ width: `${measured ? value : 0}%` }} /></div>
            <small>{measured}/{grammarRegistry.length} concepts · {attempts} attempts</small>
          </article>
        })}
      </section>

      <section className="mastery-tier-grid">
        {TIER_ORDER.map((tier) => {
          const tierRows = rows.filter((row) => row.concept.tier === tier)
          const tierPracticed = tierRows.filter((row) => row.overall)
          const value = percentAverage(tierPracticed.map((row) => row.overall!.mastery))
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
            <div><span>NEXT REVIEW · BY ABILITY</span><h3>優先して復習</h3></div>
            <strong>{needsReview.length}</strong>
          </div>
          {needsReview.length === 0 ? (
            <p className="mastery-empty">能力別の弱点データはまだありません。Level 1 / Level 2 / REPAIR LABをプレイすると、SELECT / BUILD / REPAIR別に表示されます。</p>
          ) : (
            <>
              <div className="mastery-focus-list mastery-skill-focus-list">
                {needsReview.slice(0, 8).map(({ ref, concept, stats }) => (
                  <div className="mastery-skill-focus-row" key={`${ref.skill}:${ref.key}`}>
                    <span className={`mastery-skill-badge skill-${ref.skill}`}>{SKILL_META[ref.skill].label}</span>
                    <span className="mastery-skill-focus-copy"><strong>{concept?.label ?? ref.key}</strong><small>{concept?.labelJa} · {SKILL_META[ref.skill].ja}</small></span>
                    <span className="mastery-skill-focus-score"><strong>{stats.mastery}%</strong><small>{BAND_LABEL[stats.band]}</small></span>
                  </div>
                ))}
              </div>
              <div className="weakness-review-launch">
                <div>
                  <span>WEAKNESS REVIEW</span>
                  <strong>{reviewPreview.items.length} Activities · {reviewPreview.focusRefs.length} ability targets</strong>
                  <small>SELECTはLevel 1 / Exam、BUILDはLevel 2、REPAIRはREPAIR LABから現在の弱点に合う問題を選びます。</small>
                </div>
                <button className="primary" onClick={startWeaknessReview} disabled={reviewPreview.items.length === 0}>Review Weak Points</button>
              </div>
            </>
          )}
        </section>

        <section className="mastery-panel mastery-strength-panel">
          <div className="mastery-panel-head">
            <div><span>OVERALL STRENGTHS</span><h3>現在の強み</h3></div>
            <strong>{strengths.length}</strong>
          </div>
          {strengths.length === 0 ? (
            <p className="mastery-empty">十分なプレイデータがたまると、強い文法がここに表示されます。</p>
          ) : (
            <div className="mastery-focus-list">
              {strengths.map(({ concept, overall }) => (
                <div className="mastery-overall-focus-row" key={concept.key}>
                  <span><strong>{concept.label}</strong><small>{concept.labelJa}</small></span>
                  <span><strong>{overall!.mastery}%</strong><small>{BAND_LABEL[overall!.band]}</small></span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <details className="mastery-all-card">
        <summary>
          <span><strong>All Grammar Concepts</strong><small>{grammarRegistry.length}項目の能力別詳細を見る</small></span>
          <strong>{practiced.length}/{grammarRegistry.length}</strong>
        </summary>
        <div className="mastery-all-body">
          {TIER_ORDER.map((tier) => (
            <section key={tier} className="mastery-tier-section">
              <div className="mastery-tier-heading"><span>{tier}</span><strong>{rows.filter((row) => row.concept.tier === tier && row.overall).length}/{rows.filter((row) => row.concept.tier === tier).length}</strong></div>
              <div className="mastery-concept-grid mastery-concept-grid-v047">
                {rows.filter((row) => row.concept.tier === tier).map(({ concept, overall, skills, entry }) => {
                  const measuredSkills = SKILL_ORDER.filter((skill) => skills[skill])
                  const weakest = measuredSkills.length
                    ? [...measuredSkills].sort((a, b) => skills[a]!.mastery - skills[b]!.mastery)[0]
                    : null
                  return <article className={`mastery-concept-card mastery-concept-card-v047 ${overall ? `band-${overall.band}` : 'band-unseen'}`} key={concept.key}>
                    <div className="mastery-concept-head">
                      <div><strong>{concept.label}</strong><span>{concept.labelJa}</span></div>
                      <em>{overall ? `${overall.mastery}%` : '—'}</em>
                    </div>
                    <div className="mastery-skill-bars">
                      {SKILL_ORDER.map((skill) => {
                        const stats = skills[skill]
                        return <div className="mastery-skill-bar-row" key={skill}>
                          <span className={`mastery-skill-badge skill-${skill}`}>{SKILL_META[skill].label}</span>
                          <div className="mastery-skill-track"><span style={{ width: `${stats?.mastery ?? 0}%` }} /></div>
                          <strong>{stats ? `${stats.mastery}%` : '—'}</strong>
                        </div>
                      })}
                    </div>
                    <div className="mastery-concept-meta">
                      <span>{overall ? BAND_LABEL[overall.band] : 'Not practiced yet'}</span>
                      {overall && <span>Overall attempts {overall.attempts}</span>}
                      {entry?.legacyOverall && <span>Legacy overall preserved</span>}
                    </div>
                    {weakest && skills[weakest]!.mastery < 75 && <div className="mastery-next-recommendation"><span>NEXT</span><strong>{SKILL_META[weakest].label}を復習</strong></div>}
                  </article>
                })}
              </div>
            </section>
          ))}
        </div>
      </details>

      <section className="mastery-method-card">
        <div><span>HOW MASTERY WORKS · v0.4.7</span><strong>「分かる」と「作れる」と「直せる」を同じ点数にしません。</strong></div>
        <p>各能力は平均得点・82点以上の成功率・ヒントなし率を中心に計算し、反復回数を信頼度として加味します。総合Masteryは既存データを保持しつつ、新しい3能力の実測を統合します。</p>
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
  onComplete: (score: number, hintsUsed?: number) => void
  onExit: () => void
}) {
  const done = activityIndex >= review.items.length

  if (done) {
    const current = readMasteryProgress(window.localStorage)
    const average = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : 0
    const hintCount = hints.reduce((sum, value) => sum + value, 0)
    const grade = gradeFromPercent(average)
    const changes = review.focusRefs.map((ref) => {
      const concept = grammarRegistryByKey.get(ref.key)
      const before = skillValue(review.startingProgress, ref)
      const after = skillValue(current, ref)
      const delta = before != null && after != null ? after - before : null
      return { ref, concept, before, after, delta }
    })
    const improved = changes.filter((item) => item.delta != null && item.delta > 0).length
    const newlyMeasured = changes.filter((item) => item.before == null && item.after != null).length

    return (
      <main className="weakness-review-shell">
        <section className="weakness-review-result">
          <div>
            <div className="eyebrow">WEAKNESS REVIEW · COMPLETE</div>
            <h2>Ability Review Complete</h2>
            <p>弱点のある能力に対応した問題だけを復習しました。結果はSELECT / BUILD / REPAIRの該当欄へ反映されています。</p>
          </div>
          <div className={`grade-badge grade-${grade.toLowerCase()}`}>{grade}</div>
        </section>
        <section className="chapter-day-score-grid weakness-review-score-grid">
          <div><span>Average</span><strong>{average}%</strong></div>
          <div><span>Activities</span><strong>{scores.length}</strong></div>
          <div><span>Improved</span><strong>{improved}</strong></div>
          <div><span>Newly measured</span><strong>{newlyMeasured}</strong></div>
        </section>
        <section className="weakness-review-change-card">
          <div className="eyebrow">ABILITY MASTERY UPDATE</div>
          <div className="weakness-review-change-list">
            {changes.map((item) => (
              <div key={`${item.ref.skill}:${item.ref.key}`}>
                <span><span className={`mastery-skill-badge skill-${item.ref.skill}`}>{SKILL_META[item.ref.skill].label}</span><strong>{item.concept?.label ?? item.ref.key}</strong><small>{item.concept?.labelJa}</small></span>
                <span className="weakness-review-change-score"><em>{item.before == null ? '—' : `${item.before}%`}</em><b>→</b><strong>{item.after == null ? '—' : `${item.after}%`}</strong><small>{item.delta == null ? 'NEW' : item.delta > 0 ? `+${item.delta}` : item.delta}</small></span>
              </div>
            ))}
          </div>
        </section>
        {hintCount > 0 && <p className="mastery-review-hint-total">Japanese / guided hints used: {hintCount}</p>}
        <button className="primary chapter-start" onClick={onExit}>Back to Mastery</button>
      </main>
    )
  }

  const item = review.items[activityIndex]
  const focusKeys = activityFocusKeys(item, review.focusRefs)
  const meta = SKILL_META[item.skill]
  const reviewHeader = <section className="mastery-review-ability-head">
    <div><span>WEAKNESS REVIEW · {activityIndex + 1}/{review.items.length}</span><strong>{meta.label} · {meta.ja}</strong></div>
    <div>{focusKeys.map((key) => <span key={key}>{grammarRegistryByKey.get(key)?.labelJa ?? key}</span>)}</div>
  </section>

  if (item.skill === 'build') {
    return <>
      {reviewHeader}
      <BuildActivityPlayer
        activity={item.activity}
        mode="challenge"
        presentation="free"
        onComplete={(score) => onComplete(score, 0)}
        onExit={onExit}
      />
    </>
  }

  if (item.skill === 'repair') {
    return <>
      {reviewHeader}
      <RepairActivityPlayer
        activity={item.activity}
        exitLabel="← Exit review"
        onComplete={(score) => onComplete(score, 0)}
        onExit={onExit}
      />
    </>
  }

  return <main className="weakness-review-shell weakness-review-play">
    <button className="chapter-back" onClick={onExit}>← Exit review</button>
    {reviewHeader}
    <div className="chapter-progress-track"><span style={{ width: `${(activityIndex / review.items.length) * 100}%` }} /></div>
    <ChapterActivityPlayer activity={item.activity} onComplete={(score, japaneseHintsUsed) => onComplete(score, japaneseHintsUsed)} />
  </main>
}
