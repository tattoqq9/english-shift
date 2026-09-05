import { level2BuildActivities } from '../src/data/level2BuildActivities.js'
import { japaneseFor } from '../src/data/japaneseSupport.js'
import { rapidScenarioCharacter } from '../src/data/characterRegistry.js'
import { applyCharacterRuntime, characterRuntimeActivities } from '../src/data/characterRuntime.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

applyCharacterRuntime()
const runtime = characterRuntimeActivities()
const byId = new Map(runtime.map((activity) => [activity.id, activity]))
const level1 = runtime.filter((activity) => /^d\d+-/.test(activity.id))
const sourceById = new Map(level1.map((activity) => [activity.id, activity]))

assert(level1.length === 144, `expected 144 Level 1 runtime activities, got ${level1.length}`)
assert(level2BuildActivities.length === 144, `expected 144 BUILD activities, got ${level2BuildActivities.length}`)

for (const build of level2BuildActivities) {
  const source = sourceById.get(build.sourceActivityId)
  assert(source, `${build.id}: source activity missing`)
  assert(build.customerId === source.customer.id, `${build.id}: customerId ${build.customerId} != source ${source.customer.id}`)
  assert(build.customerName === source.customer.name, `${build.id}: customerName ${build.customerName} != source ${source.customer.name}`)
}

const expectedCharacters: Record<string, string> = {
  'd13-trail-experience': 'aisha',
  'd13-ever-used': 'noah',
  'd17-if-i-were-you': 'noah',
  'd18-expedition-kit': 'noah',
  'd20-laptop-that': 'leo',
  'd20-device-which': 'leo',
  'd21-indirect-hunt': 'leo',
  'd22-how-to-connect': 'leo',
  'd24-repair-handoff': 'leo',
  'd26-party-order': 'mia',
  'd38-giftwrap-incident': 'daniel',
  'd46-vip-exception': 'oliver',
}
for (const [activityId, characterId] of Object.entries(expectedCharacters)) {
  const activity = byId.get(activityId)
  assert(activity?.customer.id === characterId, `${activityId}: expected ${characterId}, got ${activity?.customer.id}`)
  assert(Boolean(activity?.customer.opening && japaneseFor(activity.customer.opening)), `${activityId}: rewritten opening missing Japanese`)
}

const d24 = byId.get('d24-repair-handoff')
assert(d24?.kind === 'staff-coordination', 'd24 repair handoff type mismatch')
if (d24?.kind === 'staff-coordination') {
  const best = d24.handoffOptions.find((choice) => choice.id === 'd24h-best')
  assert(Boolean(best?.text.startsWith('He says')), 'd24 handoff pronoun was not synchronized')
  assert(Boolean(best && japaneseFor(best.text)), 'd24 rewritten handoff missing Japanese')
}

let rapidScenarioCount = 0
for (const activity of level1) {
  if (activity.kind !== 'rapid') continue
  activity.scenarios.forEach((_, index) => {
    const character = rapidScenarioCharacter(activity.id, index)
    assert(!character.id.startsWith('scene-'), `${activity.id}:${index}: rapid scenario resolved to scene id`)
    rapidScenarioCount += 1
  })
}
assert(rapidScenarioCount > 0, 'rapid scenario character mapping did not run')

console.log('Character integration smoke: PASS')
console.log(`BUILD inheritance=144/144 · rewritten copy=12/12 · rapid mini-customers=${rapidScenarioCount}`)
