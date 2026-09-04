export const DEBUG_UNLOCK_ALL_DAYS = import.meta.env.VITE_DEBUG_UNLOCK_ALL_DAYS === 'true'

export function isDayUnlocked(normalUnlocked: boolean) {
  return DEBUG_UNLOCK_ALL_DAYS || normalUnlocked
}
