import { applyMasteryAttempt, emptyMasteryProgress } from '../src/core/mastery.js'
import { buildWeaknessReviewPlan } from '../src/core/review.js'
import { reviewActivityCandidates } from '../src/data/reviewRuntime.js'
import { allLearningActivities } from '../src/data/activityCatalog.js'
import { grammarTargetsForActivity } from '../src/data/grammarRuntime.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

assert(allLearningActivities.length === 162, `Expected 162 learning activities, got ${allLearningActivities.length}`)

let progress = emptyMasteryProgress()
progress = applyMasteryAttempt(progress, {
  activityId: 'd31-room-change',
  score: 52,
  hintsUsed: 2,
  grammarTargets: grammarTargetsForActivity(allLearningActivities.find((activity) => activity.id === 'd31-room-change')!),
  completedAt: '2026-09-03T00:00:00.000Z',
})
progress = applyMasteryAttempt(progress, {
  activityId: 'exam-m3-inversion',
  score: 61,
  hintsUsed: 1,
  grammarTargets: grammarTargetsForActivity(allLearningActivities.find((activity) => activity.id === 'exam-m3-inversion')!),
  completedAt: '2026-09-03T00:05:00.000Z',
})

const plan = buildWeaknessReviewPlan(progress, reviewActivityCandidates, 5)
assert(plan.activityIds.length >= 2 && plan.activityIds.length <= 5, `Unexpected review length ${plan.activityIds.length}`)
assert(plan.focusKeys.length >= 1, 'Expected at least one focus grammar key')
for (const id of plan.activityIds) {
  const candidate = reviewActivityCandidates.find((item) => item.activityId === id)
  assert(candidate, `Review activity not found: ${id}`)
  assert(candidate.grammarTargets.some((ref) => plan.focusKeys.includes(ref.key)), `Review activity ${id} does not cover a focus key`)
}

const perfect = emptyMasteryProgress()
const emptyPlan = buildWeaknessReviewPlan(perfect, reviewActivityCandidates, 5)
assert(emptyPlan.activityIds.length === 0, 'Unseen grammar should not be treated as a weakness review queue')

console.log('Weakness review smoke: PASS')
console.log(`Catalog=${allLearningActivities.length} Selected=${plan.activityIds.length} Focus=${plan.focusKeys.length}`)
console.log(`Activities=${plan.activityIds.join(', ')}`)
