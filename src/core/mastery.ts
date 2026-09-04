import type { GrammarKey, GrammarRole, GrammarTargetRef } from './grammar.js'

export const LEGACY_MASTERY_STORAGE_KEY = 'english-shift-grammar-mastery-v1'
export const MASTERY_STORAGE_KEY = 'english-shift-grammar-mastery-v2'
export const MASTERY_SCHEMA_VERSION = 2

export const MASTERY_SKILLS = ['select', 'build', 'repair'] as const
export type MasterySkill = typeof MASTERY_SKILLS[number]
export type MasteryBand = 'unseen' | 'learning' | 'developing' | 'strong' | 'mastered'

interface MasteryCounters {
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

export interface GrammarMasterySkillEntry extends MasteryCounters {
  key: GrammarKey
  skill: MasterySkill
}

/**
 * v0.4.6 and earlier stored SELECT / BUILD / REPAIR in one aggregate entry.
 * Keep that aggregate intact after migration, but do not guess which ability
 * produced each historical attempt.
 */
export interface LegacyGrammarMasteryEntry extends MasteryCounters {
  key: GrammarKey
}

export interface GrammarMasteryEntry {
  key: GrammarKey
  skills: Partial<Record<MasterySkill, GrammarMasterySkillEntry>>
  legacyOverall?: LegacyGrammarMasteryEntry
}

export interface GrammarMasteryProgress {
  version: 2
  entries: Partial<Record<GrammarKey, GrammarMasteryEntry>>
  migratedFromVersion?: 1
  migratedAt?: string
}

export interface MasteryAttemptInput {
  activityId: string
  score: number
  hintsUsed: number
  grammarTargets: GrammarTargetRef[]
  skill?: MasterySkill
  completedAt?: string
}

export interface GrammarMasteryStats extends MasteryCounters {
  key: GrammarKey
  skill?: MasterySkill
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

function incrementRole(entry: MasteryCounters, role: GrammarRole) {
  if (role === 'target') entry.targetAttempts += 1
  else if (role === 'review') entry.reviewAttempts += 1
  else entry.exposureAttempts += 1
}

export function inferMasterySkill(activityId: string): MasterySkill | null {
  if (activityId.startsWith('build-')) return 'build'
  if (activityId.startsWith('repair-')) return 'repair'
  // FLOW LAB measures conversation strategy rather than the three grammar
  // abilities introduced in v0.4.7, so it must not leak into SELECT.
  if (activityId.startsWith('flow-')) return null
  return 'select'
}

function newSkillEntry(key: GrammarKey, skill: MasterySkill, activityId: string, completedAt: string): GrammarMasterySkillEntry {
  return {
    key,
    skill,
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
    lastActivityId: activityId,
  }
}

export function applyMasteryAttempt(
  progress: GrammarMasteryProgress,
  input: MasteryAttemptInput,
): GrammarMasteryProgress {
  const score = clampScore(input.score)
  const hints = Math.max(0, Math.round(input.hintsUsed))
  const completedAt = input.completedAt ?? new Date().toISOString()
  const skill = input.skill ?? inferMasterySkill(input.activityId)
  if (!skill) return progress
  const nextEntries = { ...progress.entries }

  // A single activity can expose the same canonical grammar concept through
  // multiple legacy labels. Count it once using target > review > exposure.
  const roleRank: Record<GrammarRole, number> = { exposure: 0, review: 1, target: 2 }
  const strongestRole = new Map<GrammarKey, GrammarRole>()
  for (const ref of input.grammarTargets) {
    const current = strongestRole.get(ref.key)
    if (!current || roleRank[ref.role] > roleRank[current]) strongestRole.set(ref.key, ref.role)
  }

  for (const [key, role] of strongestRole) {
    const previousConcept = nextEntries[key]
    const concept: GrammarMasteryEntry = previousConcept
      ? { ...previousConcept, skills: { ...previousConcept.skills } }
      : { key, skills: {} }
    const previousSkill = concept.skills[skill]
    const entry = previousSkill
      ? { ...previousSkill }
      : newSkillEntry(key, skill, input.activityId, completedAt)

    entry.attempts += 1
    entry.successfulAttempts += score >= 82 ? 1 : 0
    entry.totalScore += score
    entry.bestScore = Math.max(entry.bestScore, score)
    entry.hintedAttempts += hints > 0 ? 1 : 0
    entry.totalHints += hints
    entry.lastSeenAt = completedAt
    entry.lastActivityId = input.activityId
    incrementRole(entry, role)
    concept.skills[skill] = entry
    nextEntries[key] = concept
  }

  return {
    ...progress,
    version: MASTERY_SCHEMA_VERSION,
    entries: nextEntries,
  }
}

function masteryFromCounters(entry: LegacyGrammarMasteryEntry | GrammarMasterySkillEntry): GrammarMasteryStats {
  const attempts = Math.max(1, entry.attempts)
  const averageScore = entry.totalScore / attempts
  const successRate = (entry.successfulAttempts / attempts) * 100
  const hintFreeRate = ((entry.attempts - entry.hintedAttempts) / attempts) * 100

  // Performance is the main signal. Repetition is confidence, not a raw bonus.
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

/**
 * Skill-specific mastery. GrammarMasteryEntry is also accepted for backward
 * compatibility and resolves to the combined overall score.
 */
export function masteryStats(entry: GrammarMasterySkillEntry | LegacyGrammarMasteryEntry | GrammarMasteryEntry): GrammarMasteryStats {
  if ('skills' in entry) {
    const overall = overallMasteryStats(entry)
    if (overall) return overall
    // This branch is only reachable for a structurally empty concept entry.
    return masteryFromCounters({
      key: entry.key, attempts: 0, successfulAttempts: 0, totalScore: 0, bestScore: 0,
      hintedAttempts: 0, totalHints: 0, targetAttempts: 0, reviewAttempts: 0, exposureAttempts: 0,
      lastSeenAt: '', lastActivityId: '',
    })
  }
  return masteryFromCounters(entry)
}

export function masterySkillStats(entry: GrammarMasteryEntry | undefined, skill: MasterySkill): GrammarMasteryStats | null {
  const skillEntry = entry?.skills[skill]
  return skillEntry ? masteryStats(skillEntry) : null
}

function latestEntry(entries: Array<LegacyGrammarMasteryEntry | GrammarMasterySkillEntry>) {
  return [...entries].sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt))[0]
}

/**
 * Overall mastery preserves the historical aggregate and then adds new v2
 * ability-specific attempts. The historical aggregate is never copied into
 * SELECT / BUILD / REPAIR, because v1 did not retain enough information to
 * split it safely.
 */
export function overallMasteryStats(entry: GrammarMasteryEntry | undefined): GrammarMasteryStats | null {
  if (!entry) return null
  const sources = [
    ...(entry.legacyOverall ? [entry.legacyOverall] : []),
    ...MASTERY_SKILLS.map((skill) => entry.skills[skill]).filter((item): item is GrammarMasterySkillEntry => Boolean(item)),
  ]
  if (!sources.length) return null

  const latest = latestEntry(sources)
  const combined: LegacyGrammarMasteryEntry = {
    key: entry.key,
    attempts: sources.reduce((sum, item) => sum + item.attempts, 0),
    successfulAttempts: sources.reduce((sum, item) => sum + item.successfulAttempts, 0),
    totalScore: sources.reduce((sum, item) => sum + item.totalScore, 0),
    bestScore: Math.max(...sources.map((item) => item.bestScore)),
    hintedAttempts: sources.reduce((sum, item) => sum + item.hintedAttempts, 0),
    totalHints: sources.reduce((sum, item) => sum + item.totalHints, 0),
    targetAttempts: sources.reduce((sum, item) => sum + item.targetAttempts, 0),
    reviewAttempts: sources.reduce((sum, item) => sum + item.reviewAttempts, 0),
    exposureAttempts: sources.reduce((sum, item) => sum + item.exposureAttempts, 0),
    lastSeenAt: latest.lastSeenAt,
    lastActivityId: latest.lastActivityId,
  }
  return masteryStats(combined)
}

export function hasLegacyMastery(progress: GrammarMasteryProgress) {
  return Object.values(progress.entries).some((entry) => Boolean(entry?.legacyOverall))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function finiteNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function normalizeLegacyEntry(key: GrammarKey, raw: unknown): LegacyGrammarMasteryEntry | null {
  if (!isRecord(raw)) return null
  const attempts = Math.max(0, Math.round(finiteNumber(raw.attempts)))
  if (attempts <= 0) return null
  return {
    key,
    attempts,
    successfulAttempts: Math.max(0, Math.round(finiteNumber(raw.successfulAttempts))),
    totalScore: Math.max(0, finiteNumber(raw.totalScore)),
    bestScore: clampScore(finiteNumber(raw.bestScore)),
    hintedAttempts: Math.max(0, Math.round(finiteNumber(raw.hintedAttempts))),
    totalHints: Math.max(0, Math.round(finiteNumber(raw.totalHints))),
    targetAttempts: Math.max(0, Math.round(finiteNumber(raw.targetAttempts))),
    reviewAttempts: Math.max(0, Math.round(finiteNumber(raw.reviewAttempts))),
    exposureAttempts: Math.max(0, Math.round(finiteNumber(raw.exposureAttempts))),
    lastSeenAt: stringValue(raw.lastSeenAt),
    lastActivityId: stringValue(raw.lastActivityId),
  }
}

function normalizeSkillEntry(key: GrammarKey, skill: MasterySkill, raw: unknown): GrammarMasterySkillEntry | null {
  const legacy = normalizeLegacyEntry(key, raw)
  return legacy ? { ...legacy, skill } : null
}

function normalizeV2Progress(parsed: unknown): GrammarMasteryProgress | null {
  if (!isRecord(parsed) || !isRecord(parsed.entries)) return null
  const entries: GrammarMasteryProgress['entries'] = {}
  for (const [rawKey, rawEntry] of Object.entries(parsed.entries)) {
    if (!isRecord(rawEntry)) continue
    const key = rawKey as GrammarKey
    const skillsRaw = isRecord(rawEntry.skills) ? rawEntry.skills : {}
    const skills: GrammarMasteryEntry['skills'] = {}
    for (const skill of MASTERY_SKILLS) {
      const normalized = normalizeSkillEntry(key, skill, skillsRaw[skill])
      if (normalized) skills[skill] = normalized
    }
    const legacyOverall = normalizeLegacyEntry(key, rawEntry.legacyOverall)
    if (legacyOverall || Object.keys(skills).length) entries[key] = { key, skills, ...(legacyOverall ? { legacyOverall } : {}) }
  }
  return {
    version: MASTERY_SCHEMA_VERSION,
    entries,
    migratedFromVersion: parsed.migratedFromVersion === 1 ? 1 : undefined,
    migratedAt: typeof parsed.migratedAt === 'string' ? parsed.migratedAt : undefined,
  }
}

export function migrateLegacyMastery(rawLegacy: unknown, migratedAt = new Date().toISOString()): GrammarMasteryProgress {
  const progress: GrammarMasteryProgress = {
    version: MASTERY_SCHEMA_VERSION,
    entries: {},
    migratedFromVersion: 1,
    migratedAt,
  }
  if (!isRecord(rawLegacy) || !isRecord(rawLegacy.entries)) return progress

  for (const [rawKey, rawEntry] of Object.entries(rawLegacy.entries)) {
    const key = rawKey as GrammarKey
    const legacyOverall = normalizeLegacyEntry(key, rawEntry)
    if (legacyOverall) progress.entries[key] = { key, skills: {}, legacyOverall }
  }
  return progress
}

export function readMasteryProgress(storage?: StorageLike): GrammarMasteryProgress {
  if (!storage) return emptyMasteryProgress()

  // A damaged v2 payload must not prevent recovery from the untouched v1
  // payload. Parse the two generations independently.
  try {
    const currentRaw = storage.getItem(MASTERY_STORAGE_KEY)
    if (currentRaw) {
      const current = normalizeV2Progress(JSON.parse(currentRaw))
      if (current) return current
    }
  } catch { /* fall through to legacy recovery */ }

  try {
    const legacyRaw = storage.getItem(LEGACY_MASTERY_STORAGE_KEY)
    if (!legacyRaw) return emptyMasteryProgress()
    const migrated = migrateLegacyMastery(JSON.parse(legacyRaw))
    saveMasteryProgress(migrated, storage)
    return migrated
  } catch {
    return emptyMasteryProgress()
  }
}

export function saveMasteryProgress(progress: GrammarMasteryProgress, storage?: StorageLike) {
  if (!storage) return
  storage.setItem(MASTERY_STORAGE_KEY, JSON.stringify({ ...progress, version: MASTERY_SCHEMA_VERSION }))
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
  if (storage.removeItem) {
    storage.removeItem(MASTERY_STORAGE_KEY)
    storage.removeItem(LEGACY_MASTERY_STORAGE_KEY)
  } else {
    saveMasteryProgress(emptyMasteryProgress(), storage)
  }
}
