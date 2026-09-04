import type { GrammarKey, GrammarRole, GrammarTargetRef } from './grammar.js'
import type { GrammarMasteryProgress, MasterySkill } from './mastery.js'
import { MASTERY_SKILLS, masterySkillStats } from './mastery.js'

export interface ReviewFocusRef {
  key: GrammarKey
  skill: MasterySkill
}

export interface ReviewActivityCandidate {
  activityId: string
  skill: MasterySkill
  grammarTargets: GrammarTargetRef[]
}

export interface WeaknessReviewSelection {
  activityId: string
  skill: MasterySkill
}

export interface WeaknessReviewPlan {
  selections: WeaknessReviewSelection[]
  focusRefs: ReviewFocusRef[]
  priorityRefs: ReviewFocusRef[]
  // Backward-compatible summaries for older callers / diagnostics.
  activityIds: string[]
  focusKeys: GrammarKey[]
  priorityKeys: GrammarKey[]
}

const roleWeight: Record<GrammarRole, number> = {
  target: 1,
  review: 0.78,
  exposure: 0.32,
}

function refId(ref: ReviewFocusRef) {
  return `${ref.skill}:${ref.key}`
}

export function needsReviewSkill(progress: GrammarMasteryProgress, key: GrammarKey, skill: MasterySkill) {
  const stats = masterySkillStats(progress.entries[key], skill)
  if (!stats) return false
  return stats.mastery < 75 || (stats.hintedAttempts > 0 && stats.mastery < 85)
}

/** Backward-compatible concept-level check: true if any measured ability is weak. */
export function needsReviewKey(progress: GrammarMasteryProgress, key: GrammarKey) {
  return MASTERY_SKILLS.some((skill) => needsReviewSkill(progress, key, skill))
}

export function weaknessPriorityBySkill(progress: GrammarMasteryProgress): ReviewFocusRef[] {
  const rows: Array<ReviewFocusRef & { mastery: number; hintedAttempts: number; attempts: number }> = []
  for (const entry of Object.values(progress.entries)) {
    if (!entry) continue
    for (const skill of MASTERY_SKILLS) {
      const stats = masterySkillStats(entry, skill)
      if (!stats) continue
      if (stats.mastery >= 75 && !(stats.hintedAttempts > 0 && stats.mastery < 85)) continue
      rows.push({ key: entry.key, skill, mastery: stats.mastery, hintedAttempts: stats.hintedAttempts, attempts: stats.attempts })
    }
  }
  return rows
    .sort((a, b) => {
      if (a.mastery !== b.mastery) return a.mastery - b.mastery
      if (a.hintedAttempts !== b.hintedAttempts) return b.hintedAttempts - a.hintedAttempts
      if (a.attempts !== b.attempts) return a.attempts - b.attempts
      if (a.skill !== b.skill) return MASTERY_SKILLS.indexOf(a.skill) - MASTERY_SKILLS.indexOf(b.skill)
      return a.key.localeCompare(b.key)
    })
    .map(({ key, skill }) => ({ key, skill }))
}

/** Backward-compatible concept-only ordering. */
export function weaknessPriority(progress: GrammarMasteryProgress): GrammarKey[] {
  const seen = new Set<GrammarKey>()
  return weaknessPriorityBySkill(progress)
    .map((item) => item.key)
    .filter((key) => {
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
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
 * Builds a compact review session for the learner's weakest measured ability.
 * SELECT candidates only repair SELECT, BUILD candidates only repair BUILD,
 * and REPAIR candidates only repair REPAIR. This prevents a high recognition
 * score from masking a sentence-production weakness.
 */
export function buildWeaknessReviewPlan(
  progress: GrammarMasteryProgress,
  candidates: ReviewActivityCandidate[],
  maxActivities = 5,
): WeaknessReviewPlan {
  const priorityRefs = weaknessPriorityBySkill(progress)
  if (priorityRefs.length === 0 || maxActivities <= 0) {
    return { selections: [], focusRefs: [], priorityRefs, activityIds: [], focusKeys: [], priorityKeys: [] }
  }

  const priorityMap = new Map(priorityRefs.map((ref) => [refId(ref), ref]))
  const statsMap = new Map(priorityRefs.map((ref) => {
    const stats = masterySkillStats(progress.entries[ref.key], ref.skill)!
    return [refId(ref), stats] as const
  }))

  const candidateRows = candidates
    .map((candidate) => {
      const roles = strongestRoles(candidate.grammarTargets)
      const weakRefs = [...roles.entries()]
        .map(([key, role]) => ({ key, role, skill: candidate.skill, id: refId({ key, skill: candidate.skill }) }))
        .filter((item) => priorityMap.has(item.id))
      if (weakRefs.length === 0) return null

      let baseScore = 0
      let exactLastActivityHits = 0
      for (const ref of weakRefs) {
        const stats = statsMap.get(ref.id)!
        const deficit = Math.max(10, 100 - stats.mastery)
        baseScore += deficit * roleWeight[ref.role]
        if (stats.lastActivityId === candidate.activityId) exactLastActivityHits += 1
      }

      return {
        ...candidate,
        roles,
        weakRefs,
        baseScore,
        exactLastActivityHits,
      }
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row))

  const selected: typeof candidateRows = []
  const remaining = [...candidateRows]
  const covered = new Set<string>()

  while (selected.length < Math.min(maxActivities, candidateRows.length) && remaining.length > 0) {
    let bestIndex = 0
    let bestScore = Number.NEGATIVE_INFINITY

    for (let index = 0; index < remaining.length; index += 1) {
      const row = remaining[index]
      const newCoverage = row.weakRefs.filter((ref) => !covered.has(ref.id)).length
      const directTargets = row.weakRefs.filter((ref) => row.roles.get(ref.key) === 'target').length
      const repeatPenalty = row.exactLastActivityHits > 0 && candidateRows.some((other) => (
        other.activityId !== row.activityId
        && other.skill === row.skill
        && other.weakRefs.some((otherRef) => row.weakRefs.some((ref) => ref.id === otherRef.id))
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
    chosen.weakRefs.forEach((ref) => covered.add(ref.id))
  }

  const allPriorityCoveredAt = selected.findIndex((_, index) => {
    const prefix = new Set(selected.slice(0, index + 1).flatMap((row) => row.weakRefs.map((ref) => ref.id)))
    return priorityRefs.every((ref) => prefix.has(refId(ref)))
  })
  const compact = selected.length > 3 && allPriorityCoveredAt >= 2
    ? selected.slice(0, allPriorityCoveredAt + 1)
    : selected

  const selections = compact.map((row) => ({ activityId: row.activityId, skill: row.skill }))
  const focusRefs = priorityRefs.filter((ref) => compact.some((row) => row.weakRefs.some((weak) => weak.id === refId(ref))))
  const uniqueKeys = (refs: ReviewFocusRef[]) => [...new Set(refs.map((ref) => ref.key))]

  return {
    selections,
    focusRefs,
    priorityRefs,
    activityIds: selections.map((item) => item.activityId),
    focusKeys: uniqueKeys(focusRefs),
    priorityKeys: uniqueKeys(priorityRefs),
  }
}
