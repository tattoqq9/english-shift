import { ADVANCED_PROGRESS_KEY } from '../src/core/advanced.js'
import { BUILD_PROGRESS_KEY } from '../src/core/build.js'
import {
  LEGACY_MASTERY_STORAGE_KEY,
  MASTERY_STORAGE_KEY,
} from '../src/core/mastery.js'
import { EXAM_PROGRESS_KEY, chapterMeta } from '../src/core/navigationProgress.js'
import { ONBOARDING_STORAGE_KEY } from '../src/core/onboarding.js'
import { allLearningActivities } from '../src/data/activityCatalog.js'
import { flowActivities, repairActivities, repairUnits } from '../src/data/advancedTrainingActivities.js'
import { chapter1Activities, chapter1Days } from '../src/data/chapter1.js'
import { chapter2Activities, chapter2Days } from '../src/data/chapter2.js'
import { chapter3Activities, chapter3Days } from '../src/data/chapter3.js'
import { chapter4Activities, chapter4Days } from '../src/data/chapter4.js'
import { chapter5Activities, chapter5Days } from '../src/data/chapter5.js'
import { chapter6Activities, chapter6Days } from '../src/data/chapter6.js'
import { chapter7Activities, chapter7Days } from '../src/data/chapter7.js'
import { chapter8Activities, chapter8Days } from '../src/data/chapter8.js'
import { grammarRegistry } from '../src/data/grammarRegistry.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'
import { examActivities, examModules } from '../src/data/postgameActivities.js'
import { reviewActivityCandidates } from '../src/data/reviewRuntime.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function assertUnique(values: string[], label: string) {
  assert(new Set(values).size === values.length, `${label}: duplicate values detected`)
}

function assertSameStringSet(actual: Iterable<string>, expected: Iterable<string>, label: string) {
  const actualSet = new Set(actual)
  const expectedSet = new Set(expected)
  const missing = [...expectedSet].filter((value) => !actualSet.has(value))
  const extra = [...actualSet].filter((value) => !expectedSet.has(value))
  assert(missing.length === 0 && extra.length === 0, `${label}: missing=[${missing.join(', ')}] extra=[${extra.join(', ')}]`)
}

const chapterActivities = [
  chapter1Activities,
  chapter2Activities,
  chapter3Activities,
  chapter4Activities,
  chapter5Activities,
  chapter6Activities,
  chapter7Activities,
  chapter8Activities,
]
const chapterDays = [
  chapter1Days,
  chapter2Days,
  chapter3Days,
  chapter4Days,
  chapter5Days,
  chapter6Days,
  chapter7Days,
  chapter8Days,
]

// Release surface: eight Level 1 chapters, 48 shifts, 144 activities.
assert(chapterMeta.length === 8, `RC expects 8 Level 1 chapters, got ${chapterMeta.length}`)
assert(chapterActivities.length === 8 && chapterDays.length === 8, 'RC chapter arrays are incomplete')

const level1Activities = chapterActivities.flat()
const level1Days = chapterDays.flat()
assert(level1Activities.length === 144, `RC expects 144 Level 1 activities, got ${level1Activities.length}`)
assert(level1Days.length === 48, `RC expects 48 Level 1 shifts, got ${level1Days.length}`)
assertUnique(level1Activities.map((activity) => activity.id), 'Level 1 activity ids')

const expectedDays = Array.from({ length: 48 }, (_, index) => index + 1)
const actualDays = [...level1Days.map((day) => day.day)].sort((a, b) => a - b)
assert(actualDays.join(',') === expectedDays.join(','), `Level 1 day coverage must be exactly 1..48, got ${actualDays.join(',')}`)

const level1IdSet = new Set(level1Activities.map((activity) => activity.id))
for (const day of level1Days) {
  assert(day.activityIds.length === 3, `Day ${day.day}: RC expects exactly 3 activities`)
  for (const id of day.activityIds) assert(level1IdSet.has(id), `Day ${day.day}: missing Level 1 activity ${id}`)
}

for (let chapter = 0; chapter < chapterActivities.length; chapter += 1) {
  assert(chapterActivities[chapter].length === 18, `Chapter ${chapter + 1}: RC expects 18 activities`)
  assert(chapterDays[chapter].length === 6, `Chapter ${chapter + 1}: RC expects 6 shifts`)
}

// SELECT catalog = Level 1 + Exam Shift. Keep this relationship exact so review routing cannot drift.
assert(examModules.length === 6, `RC expects 6 Exam Shift modules, got ${examModules.length}`)
assert(examActivities.length === 18, `RC expects 18 Exam Shift activities, got ${examActivities.length}`)
assert(allLearningActivities.length === 162, `RC expects 162 SELECT activities, got ${allLearningActivities.length}`)
assertUnique(allLearningActivities.map((activity) => activity.id), 'SELECT activity ids')
assertSameStringSet(
  allLearningActivities.map((activity) => activity.id),
  [...level1Activities, ...examActivities].map((activity) => activity.id),
  'SELECT catalog vs Level 1 + Exam',
)

// BUILD must remain a one-to-one production counterpart of the 144 Level 1 activities.
assert(level2BuildActivities.length === 144, `RC expects 144 BUILD activities, got ${level2BuildActivities.length}`)
assertUnique(level2BuildActivities.map((activity) => activity.id), 'BUILD activity ids')
assertUnique(level2BuildActivities.map((activity) => activity.sourceActivityId), 'BUILD source activity ids')
assertSameStringSet(
  level2BuildActivities.map((activity) => activity.sourceActivityId),
  level1Activities.map((activity) => activity.id),
  'BUILD source mapping vs Level 1',
)
for (let day = 1; day <= 48; day += 1) {
  assert(level2BuildActivities.filter((activity) => activity.day === day).length === 3, `BUILD Day ${day}: RC expects 3 activities`)
}
for (let chapter = 1; chapter <= 8; chapter += 1) {
  assert(level2BuildActivities.filter((activity) => activity.chapter === chapter).length === 18, `BUILD Chapter ${chapter}: RC expects 18 activities`)
}

// Advanced scope is intentionally frozen for RC: REPAIR is supported; FLOW remains a small optional foundation.
assert(repairUnits.length === 6, `RC expects 6 REPAIR units, got ${repairUnits.length}`)
assert(repairActivities.length === 24, `RC expects 24 REPAIR activities, got ${repairActivities.length}`)
assert(flowActivities.length === 3, `RC expects 3 optional FLOW activities, got ${flowActivities.length}`)
assertUnique(repairActivities.map((activity) => activity.id), 'REPAIR activity ids')
assertUnique(flowActivities.map((activity) => activity.id), 'FLOW activity ids')

// Grammar inventory is the release contract: ES-G1/G2 for the core game + 26 ES-G3 postgame concepts.
const g12 = grammarRegistry.filter((concept) => concept.tier === 'ES-G1' || concept.tier === 'ES-G2')
const g3 = grammarRegistry.filter((concept) => concept.tier === 'ES-G3')
assert(grammarRegistry.length === 96, `RC expects 96 canonical grammar concepts, got ${grammarRegistry.length}`)
assert(g12.length === 70, `RC expects 70 ES-G1/G2 concepts, got ${g12.length}`)
assert(g3.length === 26, `RC expects 26 ES-G3 concepts, got ${g3.length}`)
assertUnique(grammarRegistry.map((concept) => concept.key), 'Grammar Registry keys')

// Weakness Review must expose the exact three measured abilities and no FLOW leakage.
const reviewCounts = { select: 0, build: 0, repair: 0 }
for (const candidate of reviewActivityCandidates) reviewCounts[candidate.skill] += 1
assert(reviewActivityCandidates.length === 330, `RC expects 330 Weakness Review candidates, got ${reviewActivityCandidates.length}`)
assert(reviewCounts.select === 162, `RC expects 162 SELECT review candidates, got ${reviewCounts.select}`)
assert(reviewCounts.build === 144, `RC expects 144 BUILD review candidates, got ${reviewCounts.build}`)
assert(reviewCounts.repair === 24, `RC expects 24 REPAIR review candidates, got ${reviewCounts.repair}`)
assertSameStringSet(
  reviewActivityCandidates.filter((candidate) => candidate.skill === 'select').map((candidate) => candidate.activityId),
  allLearningActivities.map((activity) => activity.id),
  'SELECT review candidates',
)
assertSameStringSet(
  reviewActivityCandidates.filter((candidate) => candidate.skill === 'build').map((candidate) => candidate.activityId),
  level2BuildActivities.map((activity) => activity.id),
  'BUILD review candidates',
)
assertSameStringSet(
  reviewActivityCandidates.filter((candidate) => candidate.skill === 'repair').map((candidate) => candidate.activityId),
  repairActivities.map((activity) => activity.id),
  'REPAIR review candidates',
)

// Persistent keys are part of the upgrade contract. RC must not accidentally alias independent progress domains.
const persistentKeys = [
  BUILD_PROGRESS_KEY,
  ADVANCED_PROGRESS_KEY,
  EXAM_PROGRESS_KEY,
  LEGACY_MASTERY_STORAGE_KEY,
  MASTERY_STORAGE_KEY,
  ONBOARDING_STORAGE_KEY,
]
assertUnique(persistentKeys, 'Persistent storage keys')
assert(persistentKeys.every((key) => key.startsWith('english-shift-')), 'Persistent storage keys must stay namespaced')

console.log('Release Candidate smoke: PASS')
console.log('Level1=48 shifts/144 activities · SELECT=162 · BUILD=144 · REPAIR=24 · FLOW=3')
console.log('Grammar=96 (ES-G1/G2=70, ES-G3=26) · WeaknessReview=330 · storage-keys=isolated')
