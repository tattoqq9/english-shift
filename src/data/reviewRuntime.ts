import type { Chapter1Activity } from '../core/chapter1.js'
import type { BuildActivity } from '../core/build.js'
import { readBuildProgress } from '../core/build.js'
import type { RepairActivity } from '../core/advanced.js'
import { readAdvancedProgress } from '../core/advanced.js'
import type { GrammarMasteryProgress, MasterySkill, StorageLike } from '../core/mastery.js'
import { buildWeaknessReviewPlan, type ReviewActivityCandidate } from '../core/review.js'
import { isSelectDayComplete } from '../core/buildDayFlow.js'
import { allLearningActivities, learningActivityById } from './activityCatalog.js'
import { level2BuildActivities, level2BuildById } from './level2BuildActivities.js'
import { repairActivities } from './advancedTrainingActivities.js'
import { examModules } from './postgameActivities.js'
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

function examCompletedModules(storage: StorageLike) {
  try {
    const raw = storage.getItem('english-shift-exam-shift-progress-v1')
    if (!raw) return new Set<string>()
    const parsed = JSON.parse(raw) as { completedModules?: unknown }
    return new Set(
      Array.isArray(parsed.completedModules)
        ? parsed.completedModules.filter((id): id is string => typeof id === 'string')
        : [],
    )
  } catch {
    return new Set<string>()
  }
}

function selectEncountered(activityId: string, storage: StorageLike, completedExam: Set<string>) {
  const dayMatch = activityId.match(/^d(\d+)-/)
  if (dayMatch) return isSelectDayComplete(Number(dayMatch[1]), storage)
  if (activityId.startsWith('exam-')) {
    const module = examModules.find((item) => item.activityIds.includes(activityId))
    return Boolean(module && completedExam.has(module.id))
  }
  return false
}

export function encounteredReviewActivityCandidates(storage: StorageLike) {
  const build = readBuildProgress(storage)
  const completedBuild = new Set(build.completedIds)
  const advanced = readAdvancedProgress(storage)
  const completedRepair = new Set(advanced.repairCompleted)
  const completedExam = examCompletedModules(storage)

  return reviewActivityCandidates.filter((candidate) => {
    if (candidate.skill === 'select') return selectEncountered(candidate.activityId, storage, completedExam)
    if (candidate.skill === 'build') return completedBuild.has(candidate.activityId)
    return completedRepair.has(candidate.activityId)
  })
}

function runtimeItems(selections: Array<{ activityId: string; skill: MasterySkill }>) {
  return selections
    .map((selection) => weaknessReviewActivity(selection.skill, selection.activityId))
    .filter((item): item is WeaknessReviewRuntimeItem => Boolean(item))
}

export function buildWeaknessReviewActivities(progress: GrammarMasteryProgress, maxActivities = 5) {
  const plan = buildWeaknessReviewPlan(progress, reviewActivityCandidates, maxActivities)
  return {
    ...plan,
    transferChallenge: false,
    candidateScope: 'all' as const,
    items: runtimeItems(plan.selections),
  }
}

/**
 * Normal v0.6 Review:
 * 1. first reuse only activities the learner has actually encountered,
 * 2. if none can address the measured weakness, fall back to the full pool and
 *    clearly mark the session as a Transfer Challenge.
 */
export function buildProgressAwareWeaknessReviewActivities(
  progress: GrammarMasteryProgress,
  maxActivities = 5,
  storage?: StorageLike,
) {
  if (!storage) return buildWeaknessReviewActivities(progress, maxActivities)

  const encounteredCandidates = encounteredReviewActivityCandidates(storage)
  const encounteredPlan = buildWeaknessReviewPlan(progress, encounteredCandidates, maxActivities)

  if (encounteredPlan.selections.length > 0) {
    return {
      ...encounteredPlan,
      transferChallenge: false,
      candidateScope: 'encountered' as const,
      items: runtimeItems(encounteredPlan.selections),
    }
  }

  const transferPlan = buildWeaknessReviewPlan(progress, reviewActivityCandidates, maxActivities)
  return {
    ...transferPlan,
    transferChallenge: transferPlan.selections.length > 0,
    candidateScope: 'transfer' as const,
    items: runtimeItems(transferPlan.selections),
  }
}
