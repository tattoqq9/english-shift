import type { GrammarKey, GrammarRole, GrammarTargetRef } from './grammar.js'

export const MASTERY_STORAGE_KEY = 'english-shift-grammar-mastery-v1'
export const MASTERY_SCHEMA_VERSION = 1

export type MasteryBand = 'unseen' | 'learning' | 'developing' | 'strong' | 'mastered'

export interface GrammarMasteryEntry {
  key: GrammarKey
  attempts: number
  successfulAttempts: number
  totalScore: number
  bestScore: number
  hintedAttempts: number
  totalHints: number
  targetAttempts: number
  reviewAttempts: number
  exposureAttempts: number
  lastSeenAt: string
  lastActivityId: string
}

export interface GrammarMasteryProgress {
  version: number
  entries: Partial<Record<GrammarKey, GrammarMasteryEntry>>
}

export interface MasteryAttemptInput {
  activityId: string
  score: number
  hintsUsed: number
  grammarTargets: GrammarTargetRef[]
  completedAt?: string
}

export interface GrammarMasteryStats extends GrammarMasteryEntry {
  averageScore: number
  successRate: number
  hintFreeRate: number
  mastery: number
  band: MasteryBand
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem?(key: string): void
}

export function emptyMasteryProgress(): GrammarMasteryProgress {
  return { version: MASTERY_SCHEMA_VERSION, entries: {} }
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function incrementRole(entry: GrammarMasteryEntry, role: GrammarRole) {
  if (role === 'target') entry.targetAttempts += 1
  else if (role === 'review') entry.reviewAttempts += 1
  else entry.exposureAttempts += 1
}

export function applyMasteryAttempt(
  progress: GrammarMasteryProgress,
  input: MasteryAttemptInput,
): GrammarMasteryProgress {
  const score = clampScore(input.score)
  const hints = Math.max(0, Math.round(input.hintsUsed))
  const completedAt = input.completedAt ?? new Date().toISOString()
  const nextEntries = { ...progress.entries }

  // An activity can surface the same canonical concept through multiple legacy
  // labels. Count the concept once per completed activity and use the strongest
  // pedagogical role: target > review > exposure.
  const roleRank: Record<GrammarRole, number> = { exposure: 0, review: 1, target: 2 }
  const strongestRole = new Map<GrammarKey, GrammarRole>()
  for (const ref of input.grammarTargets) {
    const current = strongestRole.get(ref.key)
    if (!current || roleRank[ref.role] > roleRank[current]) strongestRole.set(ref.key, ref.role)
  }

  for (const [key, role] of strongestRole) {
    const previous = nextEntries[key]
    const entry: GrammarMasteryEntry = previous
      ? { ...previous }
      : {
          key,
          attempts: 0,
          successfulAttempts: 0,
          totalScore: 0,
          bestScore: 0,
          hintedAttempts: 0,
          totalHints: 0,
          targetAttempts: 0,
          reviewAttempts: 0,
          exposureAttempts: 0,
          lastSeenAt: completedAt,
          lastActivityId: input.activityId,
        }

    entry.attempts += 1
    entry.successfulAttempts += score >= 82 ? 1 : 0
    entry.totalScore += score
    entry.bestScore = Math.max(entry.bestScore, score)
    entry.hintedAttempts += hints > 0 ? 1 : 0
    entry.totalHints += hints
    entry.lastSeenAt = completedAt
    entry.lastActivityId = input.activityId
    incrementRole(entry, role)
    nextEntries[key] = entry
  }

  return { version: MASTERY_SCHEMA_VERSION, entries: nextEntries }
}

export function masteryStats(entry: GrammarMasteryEntry): GrammarMasteryStats {
  const attempts = Math.max(1, entry.attempts)
  const averageScore = entry.totalScore / attempts
  const successRate = (entry.successfulAttempts / attempts) * 100
  const hintFreeRate = ((entry.attempts - entry.hintedAttempts) / attempts) * 100

  // Performance is the main signal. Repetition acts as confidence rather than
  // raw bonus so a single perfect attempt does not immediately become mastery.
  const performance = averageScore * 0.6 + successRate * 0.25 + hintFreeRate * 0.15
  const confidence = Math.min(1, 0.78 + Math.max(0, entry.attempts - 1) * 0.11)
  const mastery = Math.round(Math.max(0, Math.min(100, performance * confidence)))

  let band: MasteryBand
  if (entry.attempts <= 0) band = 'unseen'
  else if (mastery >= 85 && entry.attempts >= 2 && successRate >= 75) band = 'mastered'
  else if (mastery >= 75) band = 'strong'
  else if (mastery >= 55) band = 'developing'
  else band = 'learning'

  return {
    ...entry,
    averageScore: Math.round(averageScore),
    successRate: Math.round(successRate),
    hintFreeRate: Math.round(hintFreeRate),
    mastery,
    band,
  }
}

export function readMasteryProgress(storage?: StorageLike): GrammarMasteryProgress {
  if (!storage) return emptyMasteryProgress()
  try {
    const raw = storage.getItem(MASTERY_STORAGE_KEY)
    if (!raw) return emptyMasteryProgress()
    const parsed = JSON.parse(raw) as Partial<GrammarMasteryProgress>
    if (!parsed || typeof parsed !== 'object' || typeof parsed.entries !== 'object') return emptyMasteryProgress()
    return {
      version: MASTERY_SCHEMA_VERSION,
      entries: parsed.entries as GrammarMasteryProgress['entries'],
    }
  } catch {
    return emptyMasteryProgress()
  }
}

export function saveMasteryProgress(progress: GrammarMasteryProgress, storage?: StorageLike) {
  if (!storage) return
  storage.setItem(MASTERY_STORAGE_KEY, JSON.stringify(progress))
}

export function recordMasteryAttempt(input: MasteryAttemptInput, storage?: StorageLike) {
  if (!storage) return emptyMasteryProgress()
  const current = readMasteryProgress(storage)
  const next = applyMasteryAttempt(current, input)
  saveMasteryProgress(next, storage)
  return next
}

export function resetMasteryProgress(storage?: StorageLike) {
  if (!storage) return
  if (storage.removeItem) storage.removeItem(MASTERY_STORAGE_KEY)
  else saveMasteryProgress(emptyMasteryProgress(), storage)
}
