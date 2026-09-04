import { applyMasteryAttempt, emptyMasteryProgress, masteryStats } from '../src/core/mastery.js'
import { chapter6Activities } from '../src/data/chapter6.js'
import { examActivities } from '../src/data/postgameActivities.js'
import { grammarTargetsForActivity } from '../src/data/grammarRuntime.js'


const day31 = chapter6Activities.find((activity) => activity.id.startsWith('d31-'))
if (!day31) throw new Error('Day 31 activity not found for runtime grammar mapping')
const day31Keys = new Set(grammarTargetsForActivity(day31).map((ref) => ref.key))
if (!day31Keys.has('PAST_PERFECT')) throw new Error('Runtime grammar mapping missed Day 31 past perfect')

const exam = examActivities[0]
const examRefs = grammarTargetsForActivity(exam)
if (!examRefs.some((ref) => ref.role === 'target' && ref.key === 'PARTICIPIAL_CONSTRUCTIONS')) {
  throw new Error('Runtime grammar mapping missed explicit ES-G3 target')
}

let progress = emptyMasteryProgress()
progress = applyMasteryAttempt(progress, {
  activityId: 'test-1',
  score: 100,
  hintsUsed: 0,
  grammarTargets: [{ key: 'PRESENT_PERFECT', role: 'target' }],
  completedAt: '2026-09-03T00:00:00.000Z',
})

const first = progress.entries.PRESENT_PERFECT
if (!first) throw new Error('Mastery entry was not created')
const firstStats = masteryStats(first)
if (firstStats.attempts !== 1 || firstStats.mastery >= 85 || firstStats.band === 'mastered') {
  throw new Error(`Single perfect attempt must not equal mastery: ${JSON.stringify(firstStats)}`)
}

progress = applyMasteryAttempt(progress, {
  activityId: 'test-2',
  score: 100,
  hintsUsed: 0,
  grammarTargets: [
    { key: 'PRESENT_PERFECT', role: 'review' },
    { key: 'PRESENT_PERFECT', role: 'exposure' },
  ],
  completedAt: '2026-09-03T00:05:00.000Z',
})

const second = progress.entries.PRESENT_PERFECT
if (!second) throw new Error('Second mastery entry missing')
const secondStats = masteryStats(second)
if (secondStats.attempts !== 2 || secondStats.reviewAttempts !== 1 || secondStats.exposureAttempts !== 0) {
  throw new Error(`Duplicate concept roles must count once with strongest role: ${JSON.stringify(secondStats)}`)
}
if (secondStats.band !== 'mastered') throw new Error(`Two stable perfect attempts should reach mastered: ${secondStats.mastery}`)

progress = applyMasteryAttempt(progress, {
  activityId: 'test-3',
  score: 60,
  hintsUsed: 2,
  grammarTargets: [{ key: 'PAST_PERFECT', role: 'target' }],
  completedAt: '2026-09-03T00:10:00.000Z',
})
const weak = progress.entries.PAST_PERFECT
if (!weak) throw new Error('Weak mastery entry missing')
const weakStats = masteryStats(weak)
if (weakStats.hintedAttempts !== 1 || weakStats.totalHints !== 2 || weakStats.mastery >= firstStats.mastery) {
  throw new Error(`Hints / lower score should lower mastery: ${JSON.stringify(weakStats)}`)
}

console.log('Mastery smoke: PASS')
console.log(`single-perfect=${firstStats.mastery}% two-perfect=${secondStats.mastery}% hinted-60=${weakStats.mastery}%`)
