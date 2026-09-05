type RuntimeImportMeta = ImportMeta & {
  env?: {
    VITE_DEBUG_UNLOCK_ALL_DAYS?: string
  }
}

const runtimeEnv = (import.meta as RuntimeImportMeta).env

export const DEBUG_UNLOCK_ALL_DAYS = runtimeEnv?.VITE_DEBUG_UNLOCK_ALL_DAYS === 'true'

export function isDayUnlocked(normalUnlocked: boolean) {
  return DEBUG_UNLOCK_ALL_DAYS || normalUnlocked
}
