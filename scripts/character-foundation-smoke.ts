import {
  activityCharacterPresentation,
  CHARACTER_ASSIGNMENT_EXPECTED,
  RECURRING_CHARACTER_IDS,
  type CharacterId,
} from '../src/data/characterRegistry.js'
import { applyCharacterRuntime, characterRuntimeActivities } from '../src/data/characterRuntime.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

applyCharacterRuntime()

const activities = characterRuntimeActivities()
const assignments = Object.entries(activityCharacterPresentation)

assert(assignments.length === CHARACTER_ASSIGNMENT_EXPECTED.total, `assignment count=${assignments.length}`)
assert(activities.length === CHARACTER_ASSIGNMENT_EXPECTED.total, `runtime activity count=${activities.length}`)

const plannedCounts = new Map<CharacterId, number>()
let sceneCount = 0
let youngCount = 0
let pendingRewriteCount = 0

for (const [, assignment] of assignments) {
  if (assignment.presentation === 'scene') {
    sceneCount += 1
    continue
  }
  if (assignment.characterId === 'young-customer') youngCount += 1
  else plannedCounts.set(assignment.characterId, (plannedCounts.get(assignment.characterId) ?? 0) + 1)
  if (assignment.pendingRewrite) pendingRewriteCount += 1
}

assert(sceneCount === CHARACTER_ASSIGNMENT_EXPECTED.scenes, `scene count=${sceneCount}`)
assert(youngCount === CHARACTER_ASSIGNMENT_EXPECTED.youngCustomer, `young count=${youngCount}`)
assert([...plannedCounts.values()].reduce((sum, value) => sum + value, 0) === CHARACTER_ASSIGNMENT_EXPECTED.recurring, 'recurring total mismatch')
assert(pendingRewriteCount === 0, `pending rewrite count=${pendingRewriteCount}`)

const expectedRecurring: Record<string, number> = {
  mia: 12, sofia: 12, leo: 11, oliver: 12, aisha: 12,
  noah: 12, ken: 12, daniel: 12, hana: 12, grace: 12,
}
for (const id of RECURRING_CHARACTER_IDS) {
  assert(plannedCounts.get(id) === expectedRecurring[id], `${id} planned count=${plannedCounts.get(id)}`)
}

const byId = new Map(activities.map((activity) => [activity.id, activity]))
const runtimeSceneCount = activities.filter((activity) => activity.customer.id.startsWith('scene-')).length
assert(runtimeSceneCount === CHARACTER_ASSIGNMENT_EXPECTED.scenes, `runtime scene count=${runtimeSceneCount}`)
assert(byId.get('d4-child')?.customer.id === 'young-customer', 'Young Customer mapping missing')
assert(byId.get('d14-running-profile')?.customer.id === 'aisha', 'Aisha remap missing')
assert(byId.get('d31-room-change')?.customer.id === 'hana', 'Hana remap missing')
assert(byId.get('exam-m6-handoff')?.customer.id === 'ken', 'Ken remap missing')
assert(byId.get('d13-ever-used')?.customer.id === 'noah', 'Noah rewritten remap missing')
assert(byId.get('d21-indirect-hunt')?.customer.id === 'leo', 'Leo rewritten remap missing')
assert(byId.get('d46-vip-exception')?.customer.id === 'oliver', 'Oliver rewritten remap missing')

console.log('Character foundation smoke: PASS')
console.log(`assignments=${assignments.length} scenes=${sceneCount} recurring=${CHARACTER_ASSIGNMENT_EXPECTED.recurring} pendingRewrite=${pendingRewriteCount}`)
