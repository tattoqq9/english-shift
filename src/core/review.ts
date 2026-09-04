import type { GrammarKey, GrammarRole, GrammarTargetRef } from './grammar.js'
import type { GrammarMasteryProgress } from './mastery.js'
import { masteryStats } from './mastery.js'

export interface ReviewActivityCandidate {
  activityId: string
  grammarTargets: GrammarTargetRef[]
}

export interface WeaknessReviewPlan {
  activityIds: string[]
  focusKeys: GrammarKey[]
  priorityKeys: GrammarKey[]
}

const roleWeight: Record<GrammarRole, number> = {
  target: 1,
  review: 0.78,
  exposure: 0.32,
}

export function needsReviewKey(progress: GrammarMasteryProgress, key: GrammarKey) {
  const entry = progress.entries[key]
  if (!entry) return false
  const stats = masteryStats(entry)
  return stats.mastery < 75 || (stats.hintedAttempts > 0 && stats.mastery < 85)
}

export function weaknessPriority(progress: GrammarMasteryProgress): GrammarKey[] {
  return (Object.values(progress.entries).filter(Boolean) as NonNullable<GrammarMasteryProgress['entries'][GrammarKey]>[])
    .map((entry) => masteryStats(entry))
    .filter((stats) => stats.mastery < 75 || (stats.hintedAttempts > 0 && stats.mastery < 85))
    .sort((a, b) => {
      if (a.mastery !== b.mastery) return a.mastery - b.mastery
      if (a.hintedAttempts !== b.hintedAttempts) return b.hintedAttempts - a.hintedAttempts
      if (a.attempts !== b.attempts) return a.attempts - b.attempts
      return a.key.localeCompare(b.key)
    })
    .map((stats) => stats.key)
}

function strongestRoles(refs: GrammarTargetRef[]) {
  const rank: Record<GrammarRole, number> = { exposure: 0, review: 1, target: 2 }
  const map = new Map<GrammarKey, GrammarRole>()
  for (const ref of refs) {
    const previous = map.get(ref.key)
    if (!previous || rank[ref.role] > rank[previous]) map.set(ref.key, ref.role)
  }
  return map
}

/**
 * Builds a short review set from the learner's weakest practiced concepts.
 * The planner favors activities that target weak grammar directly, spreads
 * coverage across several concepts, and avoids immediately replaying the exact
 * activity that produced the current weak score when another option exists.
 */
export function buildWeaknessReviewPlan(
  progress: GrammarMasteryProgress,
  candidates: ReviewActivityCandidate[],
  maxActivities = 5,
): WeaknessReviewPlan {
  const priorityKeys = weaknessPriority(progress)
  if (priorityKeys.length === 0 || maxActivities <= 0) {
    return { activityIds: [], focusKeys: [], priorityKeys }
  }

  const prioritySet = new Set(priorityKeys)
  const masteryByKey = new Map(priorityKeys.map((key) => {
    const entry = progress.entries[key]!
    return [key, masteryStats(entry)] as const
  }))

  const candidateRows = candidates
    .map((candidate) => {
      const roles = strongestRoles(candidate.grammarTargets)
      const weakRefs = [...roles.entries()].filter(([key]) => prioritySet.has(key))
      if (weakRefs.length === 0) return null

      let baseScore = 0
      let exactLastActivityHits = 0
      for (const [key, role] of weakRefs) {
        const stats = masteryByKey.get(key)!
        const deficit = Math.max(10, 100 - stats.mastery)
        baseScore += deficit * roleWeight[role]
        if (stats.lastActivityId === candidate.activityId) exactLastActivityHits += 1
      }

      return {
        ...candidate,
        roles,
        weakKeys: weakRefs.map(([key]) => key),
        baseScore,
        exactLastActivityHits,
      }
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row))

  const selected: typeof candidateRows = []
  const remaining = [...candidateRows]
  const covered = new Set<GrammarKey>()

  while (selected.length < Math.min(maxActivities, candidateRows.length) && remaining.length > 0) {
    let bestIndex = 0
    let bestScore = Number.NEGATIVE_INFINITY

    for (let index = 0; index < remaining.length; index += 1) {
      const row = remaining[index]
      const newCoverage = row.weakKeys.filter((key) => !covered.has(key)).length
      const directTargets = row.weakKeys.filter((key) => row.roles.get(key) === 'target').length
      const repeatPenalty = row.exactLastActivityHits > 0 && candidateRows.some((other) => (
        other.activityId !== row.activityId
        && other.weakKeys.some((key) => row.weakKeys.includes(key))
        && other.exactLastActivityHits === 0
      )) ? 32 : 0
      const score = row.baseScore + newCoverage * 46 + directTargets * 10 - repeatPenalty
      if (score > bestScore || (score === bestScore && row.activityId.localeCompare(remaining[bestIndex].activityId) < 0)) {
        bestScore = score
        bestIndex = index
      }
    }

    const [chosen] = remaining.splice(bestIndex, 1)
    selected.push(chosen)
    chosen.weakKeys.forEach((key) => covered.add(key))
  }

  // Prefer a compact session. Once at least three useful activities are chosen,
  // stop early if every current priority concept already has representation.
  const compact = selected.length > 3 && priorityKeys.every((key) => covered.has(key))
    ? selected.slice(0, Math.max(3, selected.findIndex((_, index) => {
        const prefixCovered = new Set(selected.slice(0, index + 1).flatMap((row) => row.weakKeys))
        return priorityKeys.every((key) => prefixCovered.has(key))
      }) + 1))
    : selected

  const activityIds = compact.map((row) => row.activityId)
  const focusKeys = priorityKeys.filter((key) => compact.some((row) => row.weakKeys.includes(key)))
  return { activityIds, focusKeys, priorityKeys }
}
