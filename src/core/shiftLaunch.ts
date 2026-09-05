export const SHIFT_LAUNCH_KEY = 'english-shift-v060-shift-launch'

export type ShiftLaunchRequest = {
  chapterId: number
  day: number
  autoStart: boolean
}

export type ShiftLaunchStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem?(key: string): void
}

function validRequest(value: unknown): value is ShiftLaunchRequest {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<ShiftLaunchRequest>
  return Number.isInteger(item.chapterId)
    && Number.isInteger(item.day)
    && typeof item.autoStart === 'boolean'
    && (item.chapterId ?? 0) >= 1
    && (item.chapterId ?? 0) <= 8
    && (item.day ?? 0) >= 1
    && (item.day ?? 0) <= 48
}

export function queueShiftLaunch(
  chapterId: number,
  day: number,
  autoStart: boolean,
  storage: ShiftLaunchStorage,
) {
  const request: ShiftLaunchRequest = { chapterId, day, autoStart }
  storage.setItem(SHIFT_LAUNCH_KEY, JSON.stringify(request))
}

export function readShiftLaunch(
  chapterId: number,
  storage: ShiftLaunchStorage,
): ShiftLaunchRequest | null {
  try {
    const raw = storage.getItem(SHIFT_LAUNCH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!validRequest(parsed) || parsed.chapterId !== chapterId) return null
    const firstDay = (chapterId - 1) * 6 + 1
    const lastDay = firstDay + 5
    if (parsed.day < firstDay || parsed.day > lastDay) return null
    return parsed
  } catch {
    return null
  }
}

export function clearShiftLaunch(storage: ShiftLaunchStorage) {
  storage.removeItem?.(SHIFT_LAUNCH_KEY)
}
