import {
  ONBOARDING_STORAGE_KEY,
  completeOnboarding,
  hasExistingEnglishShiftData,
  readOnboardingState,
  shouldShowOnboarding,
  type OnboardingStorageLike,
} from '../src/core/onboarding.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

class MemoryStorage implements OnboardingStorageLike {
  values = new Map<string, string>()
  get length() { return this.values.size }
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  key(index: number) { return [...this.values.keys()][index] ?? null }
}

const fresh = new MemoryStorage()
assert(shouldShowOnboarding(fresh) === true, 'Fresh profile should see onboarding')
assert(readOnboardingState(fresh) === null, 'Fresh profile must not be marked complete before action')

completeOnboarding(fresh, 'completed', '2026-09-04T00:00:00.000Z')
assert(shouldShowOnboarding(fresh) === false, 'Completed onboarding must stay hidden')
assert(readOnboardingState(fresh)?.reason === 'completed', 'Completion reason was not saved')

const skipped = new MemoryStorage()
completeOnboarding(skipped, 'skipped', '2026-09-04T00:05:00.000Z')
assert(shouldShowOnboarding(skipped) === false, 'Skipped onboarding must not reopen automatically')
assert(readOnboardingState(skipped)?.reason === 'skipped', 'Skip reason was not saved')

const existing = new MemoryStorage()
existing.setItem('english-shift-chapter3-progress-v1', JSON.stringify({ completedDays: [13] }))
assert(hasExistingEnglishShiftData(existing), 'Existing chapter progress was not detected')
assert(shouldShowOnboarding(existing) === false, 'Existing users must not be interrupted by onboarding')
assert(readOnboardingState(existing)?.reason === 'existing-user', 'Existing user migration marker was not written')

const buildOnly = new MemoryStorage()
buildOnly.setItem('english-shift-level2-build-mode-v1', 'challenge')
assert(hasExistingEnglishShiftData(buildOnly), 'Any previous English Shift local data should protect an existing user')
assert(shouldShowOnboarding(buildOnly) === false, 'Existing preference data should avoid a surprise onboarding')

const unrelated = new MemoryStorage()
unrelated.setItem('another-app-setting', '1')
assert(hasExistingEnglishShiftData(unrelated) === false, 'Unrelated localStorage must not count as English Shift progress')
assert(shouldShowOnboarding(unrelated) === true, 'Unrelated storage should still allow first-run onboarding')

const malformed = new MemoryStorage()
malformed.setItem(ONBOARDING_STORAGE_KEY, '{broken-json')
assert(shouldShowOnboarding(malformed) === true, 'Malformed onboarding state without prior learning data should recover to first-run')

console.log('Onboarding smoke: PASS')
console.log('fresh=show completed=hide skipped=hide existing=hide malformed=recover')
