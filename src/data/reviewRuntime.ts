import type { Chapter1Activity } from '../core/chapter1.js'
import type { GrammarMasteryProgress } from '../core/mastery.js'
import { buildWeaknessReviewPlan, type ReviewActivityCandidate } from '../core/review.js'
import { allLearningActivities, learningActivityById } from './activityCatalog.js'
import { grammarTargetsForActivity } from './grammarRuntime.js'

export const reviewActivityCandidates: ReviewActivityCandidate[] = allLearningActivities.map((activity) => ({
  activityId: activity.id,
  grammarTargets: grammarTargetsForActivity(activity),
}))

export function buildWeaknessReviewActivities(progress: GrammarMasteryProgress, maxActivities = 5) {
  const plan = buildWeaknessReviewPlan(progress, reviewActivityCandidates, maxActivities)
  return {
    ...plan,
    activities: plan.activityIds.map((id) => learningActivityById(id)).filter((activity): activity is Chapter1Activity => Boolean(activity)),
  }
}
