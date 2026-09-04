import { assembleBuildSentence, buildPresentation, classifyBuild, isBuildCorrect, saveBuildResult, scoreBuild, emptyBuildProgress } from '../src/core/build.js'
import { grammarRegistry } from '../src/data/grammarRegistry.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

assert(buildPresentation('standard', 0, 1) === 'guided', 'Standard Days 1–12 should be Guided')
assert(buildPresentation('standard', 57, 20) === 'semi', 'Standard Days 13–30 should be Semi-Guided')
assert(buildPresentation('standard', 117, 40) === 'free', 'Standard Days 31–48 should be Free Build')
assert(buildPresentation('guided', 117, 40) === 'guided', 'Guided must stay Guided')
assert(buildPresentation('challenge', 0, 1) === 'free', 'Challenge must always be Free Build')

assert(level2BuildActivities.length === 144, `expected 144 Level 2 activities, got ${level2BuildActivities.length}`)
assert(new Set(level2BuildActivities.map((activity) => activity.id)).size === 144, 'BUILD activity ids must be unique')
assert(new Set(level2BuildActivities.map((activity) => activity.sourceActivityId)).size === 144, 'each Level 1 source activity should map once')
assert(new Set(level2BuildActivities.map((activity) => activity.day)).size === 48, 'Level 2 should cover all 48 days')
assert(new Set(level2BuildActivities.map((activity) => activity.chapter)).size === 8, 'Level 2 should cover all 8 chapters')

for (let day = 1; day <= 48; day += 1) {
  const rows = level2BuildActivities.filter((activity) => activity.day === day)
  assert(rows.length === 3, `Day ${day}: expected 3 BUILD activities, got ${rows.length}`)
  assert(rows.map((activity) => activity.activityNo).join(',') === '1,2,3', `Day ${day}: activity numbers should be 1,2,3`)
}
for (let chapter = 1; chapter <= 8; chapter += 1) {
  assert(level2BuildActivities.filter((activity) => activity.chapter === chapter).length === 18, `Chapter ${chapter}: expected 18 BUILD activities`)
}

for (const activity of level2BuildActivities) {
  assert(activity.targetChunkIds.length >= 3 && activity.targetChunkIds.length <= 6, `${activity.id}: target should contain 3–6 chunks`)
  assert(activity.chunks.filter((chunk) => chunk.distractor).length >= 2, `${activity.id}: expected at least two distractor chunks`)
  assert(activity.grammarTargets.length > 0, `${activity.id}: missing grammar targets`)
  assert(isBuildCorrect(activity, activity.targetChunkIds), `${activity.id}: target ids should be exact correct order`)
  assert(assembleBuildSentence(activity, activity.targetChunkIds) === activity.targetSentence, `${activity.id}: assembled sentence mismatch\n${assembleBuildSentence(activity, activity.targetChunkIds)}\n${activity.targetSentence}`)
  const perfect = scoreBuild(activity, activity.targetChunkIds, 1, 0)
  assert(perfect.score === 100 && perfect.exact, `${activity.id}: first-try best route should score 100`)
  const swapped = [...activity.targetChunkIds]
  if (swapped.length > 1) [swapped[0], swapped[1]] = [swapped[1], swapped[0]]
  assert(classifyBuild(activity, swapped) === 'almost', `${activity.id}: all correct chunks in wrong order should be Almost`)
  const hinted = scoreBuild(activity, activity.targetChunkIds, 1, 1)
  assert(hinted.score < 100, `${activity.id}: hint should reduce score`)
  const revealed = scoreBuild(activity, activity.targetChunkIds, 3, 0, true)
  assert(revealed.score === 50 && !revealed.exact, `${activity.id}: revealed answer should score 50 and not count as exact`)
  assert(activity.customerOpeningJa !== activity.customerOpening, `${activity.id}: customer opening Japanese missing`)
  assert(activity.targetJapanese !== activity.targetSentence, `${activity.id}: target Japanese missing`)
}

const expectedG12 = new Set(grammarRegistry.filter((concept) => concept.tier === 'ES-G1' || concept.tier === 'ES-G2').map((concept) => concept.key))
const coveredG12 = new Set(level2BuildActivities.flatMap((activity) => activity.grammarTargets.map((ref) => ref.key)))
for (const key of expectedG12) assert(coveredG12.has(key), `Level 2 grammar coverage missing ${key}`)
for (const key of coveredG12) assert(expectedG12.has(key), `Level 2 should not target ES-G3 key ${key}`)
assert(expectedG12.size === 70, `expected 70 ES-G1/G2 grammar concepts, got ${expectedG12.size}`)
assert(coveredG12.size === 70, `expected Level 2 to cover all 70 ES-G1/G2 concepts, got ${coveredG12.size}`)

let progress = emptyBuildProgress()
progress = saveBuildResult(progress, level2BuildActivities[0].id, 70)
progress = saveBuildResult(progress, level2BuildActivities[0].id, 92)
assert(progress.completedIds.length === 1, 'replay should not duplicate completed ids')
assert(progress.bestScores[level2BuildActivities[0].id] === 92, 'best BUILD score should be retained')

console.log(`Level 2 BUILD smoke PASS · activities=144 · days=48 · chapters=8 · ES-G1/G2=${coveredG12.size}/${expectedG12.size} · first-try-best=100`)
