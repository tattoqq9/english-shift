import { BUILD_PROGRESS_KEY } from '../src/core/build.js'
import {
  collectionSnapshot,
  collectionUnseen,
  emptyCollectionUiState,
  markCollectionSeen,
  readCollectionUiState,
} from '../src/core/collection.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'

class MemoryStorage {
  private values = new Map<string, string>()

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

const storage = new MemoryStorage()

let snapshot = collectionSnapshot(storage)
assert(snapshot.encounteredCharacters === 0, 'fresh collection should have 0 customers')
assert(snapshot.pairedDays === 0, 'fresh collection should have 0 paired days')
assert(snapshot.storeMasters === 0, 'fresh collection should have 0 store masters')

storage.setItem(
  'english-shift-chapter1-progress-v1',
  JSON.stringify({ completedDays: [1] }),
)

snapshot = collectionSnapshot(storage)
assert(snapshot.encounteredCharacters === 3, `Day 1 should unlock 3 recurring customers, got ${snapshot.encounteredCharacters}`)
assert(snapshot.unlockedCharacterIds.includes('mia'), 'Day 1 should unlock Mia')
assert(snapshot.unlockedCharacterIds.includes('noah'), 'Day 1 should unlock Noah')
assert(snapshot.unlockedCharacterIds.includes('daniel'), 'Day 1 should unlock Daniel')
assert(snapshot.earnedAchievementIds.includes('first-hello'), 'First Hello should be earned')

const day1BuildIds = level2BuildActivities.filter((activity) => activity.day === 1).map((activity) => activity.id)
assert(day1BuildIds.length === 3, 'Day 1 BUILD must contain 3 activities')
storage.setItem(
  BUILD_PROGRESS_KEY,
  JSON.stringify({ version: 1, completedIds: day1BuildIds, bestScores: {} }),
)

snapshot = collectionSnapshot(storage)
assert(snapshot.pairedDays === 1, 'Day 1 should become a paired SELECT + BUILD day')
assert(snapshot.earnedAchievementIds.includes('first-paired-shift'), 'Paired Shift badge should be earned')

const unseenBefore = collectionUnseen(snapshot, emptyCollectionUiState())
assert(unseenBefore.characterIds.length === snapshot.encounteredCharacters, 'fresh collection UI should mark unlocked customers unseen')
markCollectionSeen(snapshot, storage)
const ui = readCollectionUiState(storage)
const unseenAfter = collectionUnseen(snapshot, ui)
assert(unseenAfter.characterIds.length === 0, 'markCollectionSeen should clear customer NEW state')
assert(unseenAfter.achievementIds.length === 0, 'markCollectionSeen should clear badge NEW state')

// Complete all 6 SELECT + BUILD days in Store 1.
storage.setItem(
  'english-shift-chapter1-progress-v1',
  JSON.stringify({ completedDays: [1, 2, 3, 4, 5, 6] }),
)
const store1BuildIds = level2BuildActivities
  .filter((activity) => activity.day >= 1 && activity.day <= 6)
  .map((activity) => activity.id)
storage.setItem(
  BUILD_PROGRESS_KEY,
  JSON.stringify({ version: 1, completedIds: store1BuildIds, bestScores: {} }),
)

snapshot = collectionSnapshot(storage)
const store1 = snapshot.stores.find((store) => store.id === 1)
assert(store1?.pairedCompleted === 6, 'Store 1 should have 6 paired days')
assert(store1?.regular === true, 'Store 1 should be REGULAR')
assert(store1?.master === true, 'Store 1 should be MASTER')
assert(snapshot.earnedAchievementIds.includes('store-regular'), 'Store Regular badge should be earned')
assert(snapshot.earnedAchievementIds.includes('store-master'), 'Store Master badge should be earned')

console.log('English Shift v0.6.4 Collection core smoke: PASS')
console.log(`customers=${snapshot.encounteredCharacters}/11 · store1=${store1?.pairedCompleted}/6 MASTER · NEW-state isolated`)
