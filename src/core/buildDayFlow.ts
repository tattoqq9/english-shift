import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode.js'

export const BUILD_DAY_LAUNCH_KEY = 'english-shift-v060-build-day-launch'

type StorageRead = Pick<Storage, 'getItem'>
type StorageWrite = Pick<Storage, 'setItem'>
type StorageRemove = Pick<Storage, 'removeItem'>

export function chapterForDay(day: number) {
  return Math.min(8, Math.max(1, Math.ceil(day / 6)))
}

export function isSelectDayComplete(day: number, storage: StorageRead) {
  if (DEBUG_UNLOCK_ALL_DAYS) return true
  if (!Number.isInteger(day) || day < 1 || day > 48) return false
  const chapter = chapterForDay(day)
  try {
    const raw = storage.getItem(`english-shift-chapter${chapter}-progress-v1`)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { completedDays?: unknown }
    return Array.isArray(parsed.completedDays) && parsed.completedDays.includes(day)
  } catch {
    return false
  }
}

export function completedSelectDays(storage: StorageRead) {
  const result: number[] = []
  for (let day = 1; day <= 48; day += 1) {
    if (isSelectDayComplete(day, storage)) result.push(day)
  }
  return result
}

export function queueBuildDayLaunch(day: number, storage: StorageWrite) {
  if (!Number.isInteger(day) || day < 1 || day > 48) return
  storage.setItem(BUILD_DAY_LAUNCH_KEY, JSON.stringify({ day }))
}

export function readBuildDayLaunch(storage: StorageRead) {
  try {
    const raw = storage.getItem(BUILD_DAY_LAUNCH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { day?: unknown }
    return typeof parsed.day === 'number' && Number.isInteger(parsed.day) && parsed.day >= 1 && parsed.day <= 48
      ? parsed.day
      : null
  } catch {
    return null
  }
}

export function clearBuildDayLaunch(storage: StorageRemove) {
  storage.removeItem(BUILD_DAY_LAUNCH_KEY)
}
