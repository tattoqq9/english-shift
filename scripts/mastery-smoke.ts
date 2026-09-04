import {
  LEGACY_MASTERY_STORAGE_KEY,
  MASTERY_STORAGE_KEY,
  applyMasteryAttempt,
  emptyMasteryProgress,
  inferMasterySkill,
  masterySkillStats,
  overallMasteryStats,
  readMasteryProgress,
  type StorageLike,
} from '../src/core/mastery.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

class MemoryStorage implements StorageLike {
  values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

assert(inferMasterySkill('d21-indirect-question') === 'select', 'Level 1 must infer SELECT')
assert(inferMasterySkill('exam-m3-inversion') === 'select', 'Exam Shift must infer SELECT')
assert(inferMasterySkill('build-d21-indirect-question') === 'build', 'Level 2 must infer BUILD')
assert(inferMasterySkill('repair-05') === 'repair', 'REPAIR LAB must infer REPAIR')
assert(inferMasterySkill('flow-01') === null, 'FLOW LAB must not leak into SELECT / BUILD / REPAIR')

// v0.4.6 migration: preserve the old aggregate, but do not invent a skill split.
const storage = new MemoryStorage()
storage.setItem(LEGACY_MASTERY_STORAGE_KEY, JSON.stringify({
  version: 1,
  entries: {
    PRESENT_PERFECT: {
      key: 'PRESENT_PERFECT',
      attempts: 3,
      successfulAttempts: 2,
      totalScore: 252,
      bestScore: 96,
      hintedAttempts: 1,
      totalHints: 1,
      targetAttempts: 2,
      reviewAttempts: 1,
      exposureAttempts: 0,
      lastSeenAt: '2026-09-03T00:00:00.000Z',
      lastActivityId: 'd13-first-trail-shoes',
    },
  },
}))

let progress = readMasteryProgress(storage)
const migrated = progress.entries.PRESENT_PERFECT
assert(migrated?.legacyOverall?.attempts === 3, 'Legacy overall attempts were not preserved')
assert(!migrated.skills.select && !migrated.skills.build && !migrated.skills.repair, 'Migration must not guess historical ability')
assert(Boolean(storage.getItem(MASTERY_STORAGE_KEY)), 'Migration must persist the v2 payload')

// New attempts are separated by ability.
progress = applyMasteryAttempt(progress, {
  activityId: 'd13-select-test',
  score: 100,
  hintsUsed: 0,
  grammarTargets: [{ key: 'PRESENT_PERFECT', role: 'target' }],
  completedAt: '2026-09-04T00:00:00.000Z',
})
progress = applyMasteryAttempt(progress, {
  activityId: 'build-d13-build-test',
  score: 58,
  hintsUsed: 2,
  grammarTargets: [{ key: 'PRESENT_PERFECT', role: 'target' }],
  completedAt: '2026-09-04T00:05:00.000Z',
})
progress = applyMasteryAttempt(progress, {
  activityId: 'repair-test-present-perfect',
  score: 88,
  hintsUsed: 0,
  grammarTargets: [{ key: 'PRESENT_PERFECT', role: 'review' }],
  completedAt: '2026-09-04T00:10:00.000Z',
})

const entry = progress.entries.PRESENT_PERFECT
assert(entry, 'v2 concept entry missing')
const select = masterySkillStats(entry, 'select')
const build = masterySkillStats(entry, 'build')
const repair = masterySkillStats(entry, 'repair')
assert(select?.attempts === 1 && select.averageScore === 100, 'SELECT attempt was not isolated')
assert(build?.attempts === 1 && build.averageScore === 58 && build.totalHints === 2, 'BUILD attempt was not isolated')
assert(repair?.attempts === 1 && repair.averageScore === 88, 'REPAIR attempt was not isolated')
assert(select.mastery > build.mastery, 'Recognition should be able to score above production independently')

const overall = overallMasteryStats(entry)
assert(overall?.attempts === 6, `Overall should combine 3 legacy + 3 v2 attempts, got ${overall?.attempts}`)

// A damaged v2 payload must still recover from untouched v1 data.
storage.setItem(MASTERY_STORAGE_KEY, '{broken-json')
const recovered = readMasteryProgress(storage)
assert(recovered.entries.PRESENT_PERFECT?.legacyOverall?.attempts === 3, 'Legacy recovery failed when v2 payload was malformed')

// Fresh progress must still require repetition for mastered status.
let fresh = emptyMasteryProgress()
fresh = applyMasteryAttempt(fresh, {
  activityId: 'build-test-1', score: 100, hintsUsed: 0,
  grammarTargets: [{ key: 'PAST_PERFECT', role: 'target' }],
})
const first = masterySkillStats(fresh.entries.PAST_PERFECT, 'build')!
assert(first.band !== 'mastered', 'One perfect BUILD attempt must not equal mastery')
fresh = applyMasteryAttempt(fresh, {
  activityId: 'build-test-2', score: 100, hintsUsed: 0,
  grammarTargets: [{ key: 'PAST_PERFECT', role: 'target' }],
})
const second = masterySkillStats(fresh.entries.PAST_PERFECT, 'build')!
assert(second.band === 'mastered', 'Two stable perfect BUILD attempts should reach mastered')

console.log('Mastery v2 smoke: PASS')
console.log(`SELECT=${select.mastery}% BUILD=${build.mastery}% REPAIR=${repair.mastery}% overallAttempts=${overall?.attempts}`)
