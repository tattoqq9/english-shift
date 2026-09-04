import type { Chapter1Activity } from '../core/chapter1.js'
import type { BuildActivity } from '../core/build.js'
import type { RepairActivity } from '../core/advanced.js'
import type { GrammarMasteryProgress, MasterySkill } from '../core/mastery.js'
import { buildWeaknessReviewPlan, type ReviewActivityCandidate } from '../core/review.js'
import { allLearningActivities, learningActivityById } from './activityCatalog.js'
import { level2BuildActivities, level2BuildById } from './level2BuildActivities.js'
import { repairActivities } from './advancedTrainingActivities.js'
import { grammarTargetsForActivity } from './grammarRuntime.js'

export type WeaknessReviewRuntimeItem =
  | { skill: 'select'; activity: Chapter1Activity }
  | { skill: 'build'; activity: BuildActivity }
  | { skill: 'repair'; activity: RepairActivity }

const repairActivityById = new Map(repairActivities.map((activity) => [activity.id, activity]))

export const reviewActivityCandidates: ReviewActivityCandidate[] = [
  ...allLearningActivities.map((activity) => ({
    activityId: activity.id,
    skill: 'select' as const,
    grammarTargets: grammarTargetsForActivity(activity),
  })),
  ...level2BuildActivities.map((activity) => ({
    activityId: activity.id,
    skill: 'build' as const,
    grammarTargets: activity.grammarTargets,
  })),
  ...repairActivities.map((activity) => ({
    activityId: activity.id,
    skill: 'repair' as const,
    grammarTargets: activity.grammarTargets,
  })),
]

export function weaknessReviewActivity(skill: MasterySkill, id: string): WeaknessReviewRuntimeItem | null {
  if (skill === 'select') {
    const activity = learningActivityById(id)
    return activity ? { skill, activity } : null
  }
  if (skill === 'build') {
    const activity = level2BuildById.get(id)
    return activity ? { skill, activity } : null
  }
  const activity = repairActivityById.get(id)
  return activity ? { skill, activity } : null
}

export function buildWeaknessReviewActivities(progress: GrammarMasteryProgress, maxActivities = 5) {
  const plan = buildWeaknessReviewPlan(progress, reviewActivityCandidates, maxActivities)
  return {
    ...plan,
    items: plan.selections
      .map((selection) => weaknessReviewActivity(selection.skill, selection.activityId))
      .filter((item): item is WeaknessReviewRuntimeItem => Boolean(item)),
  }
}
