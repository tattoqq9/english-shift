import type { Chapter1Activity } from '../core/chapter1.js'
import type { GrammarRole, GrammarTargetRef } from '../core/grammar.js'
import { resolveLegacyGrammarLabel } from './grammarRegistry.js'
import { activityGrammarOverrides, dayGrammarTargets } from './grammarSyllabus.js'

function dayFromActivityId(activityId: string) {
  const match = activityId.match(/^d(\d+)/)
  return match ? Number(match[1]) : undefined
}

function overrideRole(activityId: string, key: GrammarTargetRef['key']): GrammarRole | undefined {
  const override = activityGrammarOverrides[activityId]
  if (!override) return undefined
  if (override.target?.includes(key)) return 'target'
  if (override.review?.includes(key)) return 'review'
  if (override.exposure?.includes(key)) return 'exposure'
  return undefined
}

/**
 * Runtime equivalent of the grammar audit annotation logic.
 * It lets gameplay/mastery use the same canonical grammar concepts even while
 * older activities still carry some human-readable legacy labels.
 */
export function grammarTargetsForActivity(activity: Chapter1Activity): GrammarTargetRef[] {
  const day = dayFromActivityId(activity.id)
  const refs: GrammarTargetRef[] = []
  const seen = new Set<GrammarTargetRef['key']>()

  for (const ref of activity.grammarTargets ?? []) {
    if (seen.has(ref.key)) continue
    refs.push(ref)
    seen.add(ref.key)
  }

  for (const label of activity.grammar) {
    for (const key of resolveLegacyGrammarLabel(label)) {
      if (seen.has(key)) continue
      const role = overrideRole(activity.id, key)
        ?? (day != null && dayGrammarTargets[day]?.includes(key) ? 'target' : 'review')
      refs.push({ key, role })
      seen.add(key)
    }
  }

  return refs
}
