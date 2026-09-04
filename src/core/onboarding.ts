export const ONBOARDING_STORAGE_KEY = 'english-shift-onboarding-v1'
export const ONBOARDING_SCHEMA_VERSION = 1

export type OnboardingCompletionReason = 'completed' | 'skipped' | 'existing-user'

export interface OnboardingState {
  version: number
  completed: boolean
  completedAt: string
  reason: OnboardingCompletionReason
}

export interface OnboardingStorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  readonly length?: number
  key?(index: number): string | null
}

const KNOWN_PROGRESS_KEYS = [
  'english-shift-exam-shift-progress-v1',
  'english-shift-level2-build-progress-v1',
  'english-shift-advanced-training-progress-v1',
  'english-shift-grammar-mastery-v1',
  'english-shift-grammar-mastery-v2',
]

for (let chapter = 1; chapter <= 8; chapter += 1) {
  KNOWN_PROGRESS_KEYS.push(`english-shift-chapter${chapter}-progress-v1`)
}

function safeParse(raw: string | null): OnboardingState | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Partial<OnboardingState>
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.version !== ONBOARDING_SCHEMA_VERSION || parsed.completed !== true) return null
    return {
      version: ONBOARDING_SCHEMA_VERSION,
      completed: true,
      completedAt: typeof parsed.completedAt === 'string' ? parsed.completedAt : '',
      reason: parsed.reason === 'skipped' || parsed.reason === 'existing-user' ? parsed.reason : 'completed',
    }
  } catch {
    return null
  }
}

export function readOnboardingState(storage?: OnboardingStorageLike): OnboardingState | null {
  if (!storage) return null
  try {
    return safeParse(storage.getItem(ONBOARDING_STORAGE_KEY))
  } catch {
    return null
  }
}

export function hasExistingEnglishShiftData(storage?: OnboardingStorageLike) {
  if (!storage) return false

  try {
    if (typeof storage.length === 'number' && typeof storage.key === 'function') {
      for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index)
        if (key?.startsWith('english-shift-') && key !== ONBOARDING_STORAGE_KEY) return true
      }
    }

    return KNOWN_PROGRESS_KEYS.some((key) => storage.getItem(key) != null)
  } catch {
    return false
  }
}

export function completeOnboarding(
  storage: OnboardingStorageLike | undefined,
  reason: OnboardingCompletionReason = 'completed',
  completedAt = new Date().toISOString(),
) {
  if (!storage) return
  const state: OnboardingState = {
    version: ONBOARDING_SCHEMA_VERSION,
    completed: true,
    completedAt,
    reason,
  }
  try {
    storage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage can be unavailable in privacy-restricted environments. Onboarding
    // must never block the learner from entering the app.
  }
}

/**
 * First-run policy for v0.4.8:
 * - brand-new browser profile -> show onboarding once
 * - already completed/skipped -> do not show
 * - any pre-v0.4.8 English Shift data -> silently mark as existing-user and do not interrupt
 */
export function shouldShowOnboarding(storage?: OnboardingStorageLike) {
  if (!storage) return false
  if (readOnboardingState(storage)?.completed) return false
  if (hasExistingEnglishShiftData(storage)) {
    completeOnboarding(storage, 'existing-user')
    return false
  }
  return true
}
