import { applyMasteryAttempt, emptyMasteryProgress, type MasterySkill } from '../src/core/mastery.js'
import { buildWeaknessReviewPlan } from '../src/core/review.js'
import { repairActivities } from '../src/data/advancedTrainingActivities.js'
import { allLearningActivities } from '../src/data/activityCatalog.js'
import { grammarTargetsForActivity } from '../src/data/grammarRuntime.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'
import { reviewActivityCandidates } from '../src/data/reviewRuntime.js'
import type { GrammarTargetRef } from '../src/core/grammar.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

assert(allLearningActivities.length === 162, `Expected 162 SELECT activities, got ${allLearningActivities.length}`)
assert(level2BuildActivities.length === 144, `Expected 144 BUILD activities, got ${level2BuildActivities.length}`)
assert(repairActivities.length === 24, `Expected 24 REPAIR activities, got ${repairActivities.length}`)
assert(reviewActivityCandidates.length === 330, `Expected 330 ability review candidates, got ${reviewActivityCandidates.length}`)

const selectSource = allLearningActivities.find((activity) => activity.id === 'd31-room-change') ?? allLearningActivities[0]
const buildSource = level2BuildActivities.find((activity) => activity.grammarTargets.length > 0)!
const repairSource = repairActivities[0]

function verifyAbility(skill: MasterySkill, activityId: string, grammarTargets: GrammarTargetRef[]) {
  let progress = emptyMasteryProgress()
  progress = applyMasteryAttempt(progress, {
    activityId,
    skill,
    score: 52,
    hintsUsed: 2,
    grammarTargets,
  })

  const plan = buildWeaknessReviewPlan(progress, reviewActivityCandidates, 5)
  assert(plan.selections.length > 0, `${skill}: expected at least one review activity`)
  assert(plan.focusRefs.length > 0, `${skill}: expected at least one focus ref`)
  assert(plan.focusRefs.every((ref) => ref.skill === skill), `${skill}: focus crossed an ability boundary`)
  assert(plan.selections.every((selection) => selection.skill === skill), `${skill}: selected an activity from the wrong ability`)

  for (const selection of plan.selections) {
    const candidate = reviewActivityCandidates.find((item) => item.activityId === selection.activityId && item.skill === selection.skill)
    assert(candidate, `${skill}: candidate not found ${selection.activityId}`)
    assert(candidate.grammarTargets.some((ref) => plan.focusRefs.some((focus) => focus.skill === skill && focus.key === ref.key)), `${skill}: candidate does not cover a focus grammar key`)
  }
  return plan.selections.length
}

const selectCount = verifyAbility('select', selectSource.id, grammarTargetsForActivity(selectSource))
const buildCount = verifyAbility('build', buildSource.id, buildSource.grammarTargets)
const repairCount = verifyAbility('repair', repairSource.id, repairSource.grammarTargets)

const emptyPlan = buildWeaknessReviewPlan(emptyMasteryProgress(), reviewActivityCandidates, 5)
assert(emptyPlan.selections.length === 0, 'Unmeasured abilities must not be treated as weaknesses')

console.log('Ability weakness review smoke: PASS')
console.log(`Candidates=${reviewActivityCandidates.length} SELECT=${selectCount} BUILD=${buildCount} REPAIR=${repairCount}`)
