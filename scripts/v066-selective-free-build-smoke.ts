import { buildPresentation } from '../src/core/build.js'
import { standardFreeBuildDecision } from '../src/core/freeBuild.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

const standardRange = level2BuildActivities.filter((activity) => activity.day >= 31)
const eligible = standardRange.filter((activity) => standardFreeBuildDecision(activity).eligible)
const assisted = standardRange.filter((activity) => !standardFreeBuildDecision(activity).eligible)

assert(standardRange.length === 54, `Expected 54 Day31-48 activities, got ${standardRange.length}`)
assert(eligible.length === 28, `Expected 28 Standard Free activities from audited corpus, got ${eligible.length}`)
assert(assisted.length === 26, `Expected 26 Standard Semi-guided fallbacks from audited corpus, got ${assisted.length}`)

const managerHandoff = level2BuildActivities.find((activity) => activity.id === 'build-d36-manager-handoff')
assert(managerHandoff, 'build-d36-manager-handoff missing')
const managerDecision = standardFreeBuildDecision(managerHandoff)
assert(!managerDecision.eligible, '25-word/3-sentence manager handoff must not be default Free typing')
assert(managerDecision.risk >= 5, 'manager handoff must remain HIGH risk')

const breakfastHistory = level2BuildActivities.find((activity) => activity.id === 'build-d31-breakfast-history')
assert(breakfastHistory, 'build-d31-breakfast-history missing')
const breakfastDecision = standardFreeBuildDecision(breakfastHistory)
assert(breakfastDecision.eligible, 'audited Day31 breakfast response should remain Free typing')
assert(breakfastDecision.risk < 5, 'eligible Free BUILD must be below HIGH threshold')

for (const activity of level2BuildActivities) {
  assert(buildPresentation('challenge', 0, activity.day) === 'free', `${activity.id}: Challenge must remain Free`)
  assert(buildPresentation('guided', 0, activity.day) === 'guided', `${activity.id}: Guided must remain Guided`)
}

console.log('English Shift v0.6.6 Selective Free BUILD core smoke: PASS')
console.log(`Standard Day31-48 = ${eligible.length} Free typing + ${assisted.length} Semi-guided complex responses · Challenge = all Free`)
