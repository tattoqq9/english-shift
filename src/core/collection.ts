import { BUILD_PROGRESS_KEY, readBuildProgress } from './build.js'
import { chapterMeta } from './navigationProgress.js'
import {
  activityCharacterPresentation,
  characterProfiles,
  type CharacterId,
} from '../data/characterRegistry.js'
import { level2BuildActivities } from '../data/level2BuildActivities.js'

export const COLLECTION_UI_STORAGE_KEY = 'english-shift-collection-v1'

export type CollectionAchievementId =
  | 'first-hello'
  | 'familiar-faces'
  | 'full-cast'
  | 'first-paired-shift'
  | 'store-regular'
  | 'store-master'
  | 'full-passport'

export type CollectionUiState = {
  version: 1
  seenCharacterIds: CharacterId[]
  seenAchievementIds: CollectionAchievementId[]
}

export type CollectionCharacterEntry = {
  id: CharacterId
  name: string
  age: number | null
  backgroundJa: string
  sceneFitJa: string
  unlocked: boolean
  firstMetDay: number | null
  firstMetStoreId: number | null
  firstMetStoreTitle: string | null
}

export type CollectionStoreEntry = {
  id: number
  title: string
  selectCompleted: number
  buildCompleted: number
  pairedCompleted: number
  regular: boolean
  master: boolean
}

export type CollectionAchievement = {
  id: CollectionAchievementId
  icon: string
  title: string
  description: string
  earned: boolean
}

export type CollectionSnapshot = {
  characters: CollectionCharacterEntry[]
  stores: CollectionStoreEntry[]
  achievements: CollectionAchievement[]
  unlockedCharacterIds: CharacterId[]
  earnedAchievementIds: CollectionAchievementId[]
  encounteredCharacters: number
  totalCharacters: number
  pairedDays: number
  storeRegulars: number
  storeMasters: number
}

type CollectionStorageRead = Pick<Storage, 'getItem'>
type CollectionStorageWrite = Pick<Storage, 'getItem' | 'setItem'>

const CHARACTER_IDS = Object.keys(characterProfiles) as CharacterId[]
const CHARACTER_ID_SET = new Set<string>(CHARACTER_IDS)
const ACHIEVEMENT_IDS: CollectionAchievementId[] = [
  'first-hello',
  'familiar-faces',
  'full-cast',
  'first-paired-shift',
  'store-regular',
  'store-master',
  'full-passport',
]
const ACHIEVEMENT_ID_SET = new Set<string>(ACHIEVEMENT_IDS)

export function emptyCollectionUiState(): CollectionUiState {
  return { version: 1, seenCharacterIds: [], seenAchievementIds: [] }
}

function isCharacterId(value: unknown): value is CharacterId {
  return typeof value === 'string' && CHARACTER_ID_SET.has(value)
}

function isAchievementId(value: unknown): value is CollectionAchievementId {
  return typeof value === 'string' && ACHIEVEMENT_ID_SET.has(value)
}

function normalizeUiState(value: unknown): CollectionUiState {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyCollectionUiState()
  const raw = value as Partial<CollectionUiState>
  return {
    version: 1,
    seenCharacterIds: Array.isArray(raw.seenCharacterIds)
      ? [...new Set(raw.seenCharacterIds.filter(isCharacterId))]
      : [],
    seenAchievementIds: Array.isArray(raw.seenAchievementIds)
      ? [...new Set(raw.seenAchievementIds.filter(isAchievementId))]
      : [],
  }
}

export function readCollectionUiState(storage?: CollectionStorageRead): CollectionUiState {
  if (!storage) return emptyCollectionUiState()
  try {
    const raw = storage.getItem(COLLECTION_UI_STORAGE_KEY)
    return raw ? normalizeUiState(JSON.parse(raw)) : emptyCollectionUiState()
  } catch {
    return emptyCollectionUiState()
  }
}

function readActualCompletedSelectDays(storage: CollectionStorageRead) {
  const result = new Set<number>()

  for (const chapter of chapterMeta) {
    const firstDay = (chapter.id - 1) * 6 + 1
    const lastDay = firstDay + 5
    try {
      const raw = storage.getItem(`english-shift-chapter${chapter.id}-progress-v1`)
      if (!raw) continue
      const parsed = JSON.parse(raw) as { completedDays?: unknown }
      if (!Array.isArray(parsed.completedDays)) continue

      for (const value of parsed.completedDays) {
        if (
          typeof value === 'number'
          && Number.isInteger(value)
          && value >= firstDay
          && value <= lastDay
        ) {
          result.add(value)
        }
      }
    } catch {
      // A malformed chapter record should not break the collection layer.
    }
  }

  return result
}

function dayFromSelectActivityId(activityId: string) {
  const match = /^d(\d+)-/.exec(activityId)
  if (!match) return null
  const day = Number(match[1])
  return Number.isInteger(day) && day >= 1 && day <= 48 ? day : null
}

function assignedDaysByCharacter() {
  const result = new Map<CharacterId, number[]>()
  for (const id of CHARACTER_IDS) result.set(id, [])

  for (const [activityId, presentation] of Object.entries(activityCharacterPresentation)) {
    if (presentation.presentation !== 'character') continue
    const day = dayFromSelectActivityId(activityId)
    if (day == null) continue
    const days = result.get(presentation.characterId) ?? []
    if (!days.includes(day)) days.push(day)
    result.set(presentation.characterId, days)
  }

  for (const days of result.values()) days.sort((a, b) => a - b)
  return result
}

function completedBuildDays(storage: CollectionStorageRead) {
  const progress = readBuildProgress(storage)
  const completedIds = new Set(progress.completedIds)
  const result = new Set<number>()

  for (let day = 1; day <= 48; day += 1) {
    const activities = level2BuildActivities.filter((activity) => activity.day === day)
    if (activities.length === 3 && activities.every((activity) => completedIds.has(activity.id))) {
      result.add(day)
    }
  }

  return result
}

function achievement(
  id: CollectionAchievementId,
  icon: string,
  title: string,
  description: string,
  earned: boolean,
): CollectionAchievement {
  return { id, icon, title, description, earned }
}

export function collectionSnapshot(storage: CollectionStorageRead): CollectionSnapshot {
  const selectDays = readActualCompletedSelectDays(storage)
  const buildDays = completedBuildDays(storage)
  const pairedDaySet = new Set(
    [...selectDays].filter((day) => buildDays.has(day)),
  )

  const assigned = assignedDaysByCharacter()
  const characters: CollectionCharacterEntry[] = CHARACTER_IDS.map((id) => {
    const profile = characterProfiles[id]
    const firstMetDay = (assigned.get(id) ?? []).find((day) => selectDays.has(day)) ?? null
    const firstMetStoreId = firstMetDay == null ? null : Math.ceil(firstMetDay / 6)
    const firstMetStoreTitle = firstMetStoreId == null
      ? null
      : chapterMeta.find((chapter) => chapter.id === firstMetStoreId)?.title ?? null

    return {
      id,
      name: profile.name,
      age: profile.age,
      backgroundJa: profile.backgroundJa,
      sceneFitJa: profile.sceneFitJa,
      unlocked: firstMetDay != null,
      firstMetDay,
      firstMetStoreId,
      firstMetStoreTitle,
    }
  })

  const stores: CollectionStoreEntry[] = chapterMeta.map((chapter) => {
    const firstDay = (chapter.id - 1) * 6 + 1
    const days = Array.from({ length: 6 }, (_, index) => firstDay + index)
    const selectCompleted = days.filter((day) => selectDays.has(day)).length
    const buildCompleted = days.filter((day) => buildDays.has(day)).length
    const pairedCompleted = days.filter((day) => pairedDaySet.has(day)).length

    return {
      id: chapter.id,
      title: chapter.title,
      selectCompleted,
      buildCompleted,
      pairedCompleted,
      regular: pairedCompleted >= 3,
      master: pairedCompleted >= 6,
    }
  })

  const unlockedCharacterIds = characters.filter((entry) => entry.unlocked).map((entry) => entry.id)
  const encounteredCharacters = unlockedCharacterIds.length
  const pairedDays = pairedDaySet.size
  const storeRegulars = stores.filter((store) => store.regular).length
  const storeMasters = stores.filter((store) => store.master).length

  const achievements = [
    achievement(
      'first-hello',
      '👋',
      'First Hello',
      '最初のCustomerに出会う',
      encounteredCharacters >= 1,
    ),
    achievement(
      'familiar-faces',
      '🙂',
      'Familiar Faces',
      '5人のCustomerをCustomer Bookに記録',
      encounteredCharacters >= 5,
    ),
    achievement(
      'full-cast',
      '★',
      'Full Cast',
      '11人すべてのCustomerに出会う',
      encounteredCharacters >= CHARACTER_IDS.length,
    ),
    achievement(
      'first-paired-shift',
      '✓',
      'Paired Shift',
      '同じDayのSELECTとBUILDを両方完了',
      pairedDays >= 1,
    ),
    achievement(
      'store-regular',
      'R',
      'Store Regular',
      '1店舗でSELECT + BUILDを3/6までペア完了',
      storeRegulars >= 1,
    ),
    achievement(
      'store-master',
      'M',
      'Store Master',
      '1店舗で6/6のSELECT + BUILDを完了',
      storeMasters >= 1,
    ),
    achievement(
      'full-passport',
      '◆',
      'Full Passport',
      '48 DaysすべてをSELECT + BUILDでペア完了',
      pairedDays >= 48,
    ),
  ]

  const earnedAchievementIds = achievements.filter((item) => item.earned).map((item) => item.id)

  return {
    characters,
    stores,
    achievements,
    unlockedCharacterIds,
    earnedAchievementIds,
    encounteredCharacters,
    totalCharacters: CHARACTER_IDS.length,
    pairedDays,
    storeRegulars,
    storeMasters,
  }
}

export function collectionUnseen(snapshot: CollectionSnapshot, state: CollectionUiState) {
  const seenCharacters = new Set(state.seenCharacterIds)
  const seenAchievements = new Set(state.seenAchievementIds)

  return {
    characterIds: snapshot.unlockedCharacterIds.filter((id) => !seenCharacters.has(id)),
    achievementIds: snapshot.earnedAchievementIds.filter((id) => !seenAchievements.has(id)),
  }
}

export function markCollectionSeen(
  snapshot: CollectionSnapshot,
  storage?: CollectionStorageWrite,
): CollectionUiState {
  if (!storage) return emptyCollectionUiState()
  const current = readCollectionUiState(storage)
  const next: CollectionUiState = {
    version: 1,
    seenCharacterIds: [...new Set([...current.seenCharacterIds, ...snapshot.unlockedCharacterIds])],
    seenAchievementIds: [...new Set([...current.seenAchievementIds, ...snapshot.earnedAchievementIds])],
  }
  storage.setItem(COLLECTION_UI_STORAGE_KEY, JSON.stringify(next))
  return next
}

// Exported only for smoke tests and migration audits.
export const COLLECTION_BUILD_PROGRESS_KEY = BUILD_PROGRESS_KEY
