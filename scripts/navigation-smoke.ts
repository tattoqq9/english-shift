import { navigationSnapshot } from '../src/core/navigationProgress.js'
import type { StorageLike } from '../src/core/mastery.js'
import { BUILD_PROGRESS_KEY } from '../src/core/build.js'
import { level2BuildActivities } from '../src/data/level2BuildActivities.js'
import { examModules } from '../src/data/postgameActivities.js'

class MemoryStorage implements StorageLike {
  private data = new Map<string, string>()
  getItem(key: string) { return this.data.get(key) ?? null }
  setItem(key: string, value: string) { this.data.set(key, value) }
  removeItem(key: string) { this.data.delete(key) }
}

const storage = new MemoryStorage()
let snap = navigationSnapshot(storage)
if (snap.level1Completed !== 0 || snap.continueChapter?.id !== 1 || snap.continueChapter.nextDay !== 1) throw new Error('Empty navigation snapshot is invalid')

storage.setItem('english-shift-chapter1-progress-v1', JSON.stringify({ completedDays: [1, 2, 3, 4, 5, 6] }))
storage.setItem('english-shift-chapter4-progress-v1', JSON.stringify({ completedDays: [19, 20] }))
storage.setItem(BUILD_PROGRESS_KEY, JSON.stringify({ completedIds: [level2BuildActivities[0].id], bestScores: {} }))
storage.setItem('english-shift-exam-shift-progress-v1', JSON.stringify({ completedModules: [examModules[0].id], bestScores: {}, bestHintCounts: {} }))
snap = navigationSnapshot(storage)
if (snap.level1Completed !== 8) throw new Error(`Expected 8 completed Level 1 shifts, got ${snap.level1Completed}`)
if (snap.continueChapter?.id !== 4 || snap.continueChapter.nextDay !== 21) throw new Error('Continue chapter selection is invalid')
if (snap.buildCompleted !== 1 || snap.examCompleted !== 1) throw new Error('Secondary course progress is invalid')

console.log(`Navigation smoke PASS · Level1=${snap.level1Completed}/48 · continue=Ch${snap.continueChapter.id}/Day${snap.continueChapter.nextDay} · BUILD=${snap.buildCompleted}/${snap.buildTotal} · Exam=${snap.examCompleted}/${snap.examTotal}`)
