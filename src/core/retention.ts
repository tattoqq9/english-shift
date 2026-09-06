export const RETENTION_STORAGE_KEY = 'english-shift-retention-v1'
export const WEEKLY_ACTIVE_DAY_TARGET = 5

export type RetentionSource = 'select_shift' | 'build_day' | 'review'

export type RetentionProgress = {
  version: 1
  activeDates: string[]
  sourcesByDate: Record<string, RetentionSource[]>
  weeklyRewards: string[]
}

type RetentionStorage = Pick<Storage, 'getItem' | 'setItem'>

export type RetentionWeekDay = {
  key: string
  label: string
  active: boolean
  today: boolean
}

export type RetentionSummary = {
  currentStreak: number
  activeDaysThisWeek: number
  weeklyTarget: number
  remainingThisWeek: number
  rewardEarnedThisWeek: boolean
  totalWeeklyRewards: number
  weekDays: RetentionWeekDay[]
}

const WEEK_LABELS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const

export function emptyRetentionProgress(): RetentionProgress {
  return { version: 1, activeDates: [], sourcesByDate: {}, weeklyRewards: [] }
}

function pad2(value: number) {
  return String(value).padStart(2, '0')
}

export function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

function localNoon(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
}

function addDays(date: Date, amount: number) {
  const next = localNoon(date)
  next.setDate(next.getDate() + amount)
  return next
}

function mondayOf(date: Date) {
  const normalized = localNoon(date)
  const day = normalized.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return addDays(normalized, offset)
}

function isDateKey(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function isSource(value: unknown): value is RetentionSource {
  return value === 'select_shift' || value === 'build_day' || value === 'review'
}

function normalizeProgress(value: unknown): RetentionProgress {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return emptyRetentionProgress()
  const raw = value as Partial<RetentionProgress>
  const activeDates = Array.isArray(raw.activeDates)
    ? [...new Set(raw.activeDates.filter(isDateKey))].sort()
    : []
  const sourcesByDate: Record<string, RetentionSource[]> = {}
  if (raw.sourcesByDate && typeof raw.sourcesByDate === 'object' && !Array.isArray(raw.sourcesByDate)) {
    for (const [key, sources] of Object.entries(raw.sourcesByDate)) {
      if (!isDateKey(key) || !Array.isArray(sources)) continue
      const normalized = [...new Set(sources.filter(isSource))]
      if (normalized.length) sourcesByDate[key] = normalized
    }
  }
  const weeklyRewards = Array.isArray(raw.weeklyRewards)
    ? [...new Set(raw.weeklyRewards.filter(isDateKey))].sort()
    : []
  return { version: 1, activeDates, sourcesByDate, weeklyRewards }
}

export function readRetentionProgress(storage?: Pick<Storage, 'getItem'>): RetentionProgress {
  if (!storage) return emptyRetentionProgress()
  try {
    const raw = storage.getItem(RETENTION_STORAGE_KEY)
    return raw ? normalizeProgress(JSON.parse(raw)) : emptyRetentionProgress()
  } catch {
    return emptyRetentionProgress()
  }
}

export function saveRetentionProgress(progress: RetentionProgress, storage?: Pick<Storage, 'setItem'>) {
  storage?.setItem(RETENTION_STORAGE_KEY, JSON.stringify({ ...progress, version: 1 }))
}

function activeDaysInWeek(progress: RetentionProgress, now: Date) {
  const active = new Set(progress.activeDates)
  const monday = mondayOf(now)
  return Array.from({ length: 7 }, (_, index) => localDateKey(addDays(monday, index)))
    .filter((key) => active.has(key)).length
}

export function recordRetentionSession(
  source: RetentionSource,
  storage?: RetentionStorage,
  now = new Date(),
) {
  if (!storage) return emptyRetentionProgress()
  const current = readRetentionProgress(storage)
  const day = localDateKey(now)
  const nextDates = current.activeDates.includes(day)
    ? current.activeDates
    : [...current.activeDates, day].sort()
  const daySources = current.sourcesByDate[day] ?? []
  const nextSources = daySources.includes(source) ? daySources : [...daySources, source]
  const next: RetentionProgress = {
    version: 1,
    activeDates: nextDates,
    sourcesByDate: { ...current.sourcesByDate, [day]: nextSources },
    weeklyRewards: [...current.weeklyRewards],
  }

  const weekKey = localDateKey(mondayOf(now))
  if (activeDaysInWeek(next, now) >= WEEKLY_ACTIVE_DAY_TARGET && !next.weeklyRewards.includes(weekKey)) {
    next.weeklyRewards = [...next.weeklyRewards, weekKey].sort()
  }

  // Keep enough history for long-term reward counts without allowing an
  // unbounded localStorage payload.
  if (next.activeDates.length > 800) next.activeDates = next.activeDates.slice(-800)
  if (next.weeklyRewards.length > 160) next.weeklyRewards = next.weeklyRewards.slice(-160)
  const retained = new Set(next.activeDates)
  next.sourcesByDate = Object.fromEntries(
    Object.entries(next.sourcesByDate).filter(([key]) => retained.has(key)),
  )

  saveRetentionProgress(next, storage)
  return next
}

export function retentionSummary(progress: RetentionProgress, now = new Date()): RetentionSummary {
  const active = new Set(progress.activeDates)
  const today = localNoon(now)
  const todayKey = localDateKey(today)

  let cursor = today
  if (!active.has(todayKey)) {
    cursor = addDays(today, -1)
    if (!active.has(localDateKey(cursor))) cursor = addDays(today, -4000)
  }

  let currentStreak = 0
  if (active.has(localDateKey(cursor))) {
    while (active.has(localDateKey(cursor))) {
      currentStreak += 1
      cursor = addDays(cursor, -1)
    }
  }

  const monday = mondayOf(now)
  const weekDays: RetentionWeekDay[] = WEEK_LABELS.map((label, index) => {
    const date = addDays(monday, index)
    const key = localDateKey(date)
    return { key, label, active: active.has(key), today: key === todayKey }
  })
  const activeDaysThisWeek = weekDays.filter((day) => day.active).length
  const weekKey = localDateKey(monday)
  const rewardEarnedThisWeek = progress.weeklyRewards.includes(weekKey)
    || activeDaysThisWeek >= WEEKLY_ACTIVE_DAY_TARGET

  return {
    currentStreak,
    activeDaysThisWeek,
    weeklyTarget: WEEKLY_ACTIVE_DAY_TARGET,
    remainingThisWeek: Math.max(0, WEEKLY_ACTIVE_DAY_TARGET - activeDaysThisWeek),
    rewardEarnedThisWeek,
    totalWeeklyRewards: progress.weeklyRewards.length,
    weekDays,
  }
}
