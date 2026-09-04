import { BUILD_PROGRESS_KEY, readBuildProgress } from './build.js'
import { masteryStats, readMasteryProgress, type StorageLike } from './mastery.js'
import { level2BuildActivities, level2BuildValidIds } from '../data/level2BuildActivities.js'
import { examModules } from '../data/postgameActivities.js'
import { grammarRegistry } from '../data/grammarRegistry.js'

export const EXAM_PROGRESS_KEY = 'english-shift-exam-shift-progress-v1'

export type ChapterMeta = {
  id: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
  title: string
  subtitle: string
  days: string
}

export const chapterMeta: ChapterMeta[] = [
  { id: 1, title: 'Convenience Store', subtitle: '基本応対と質問', days: 'Days 1–6' },
  { id: 2, title: 'Clothing Store', subtitle: '比較・説明・返品', days: 'Days 7–12' },
  { id: 3, title: 'Sports / Outdoor', subtitle: '経験・継続・提案', days: 'Days 13–18' },
  { id: 4, title: 'Electronics', subtitle: '故障診断・間接疑問', days: 'Days 19–24' },
  { id: 5, title: 'Restaurant / Café', subtitle: '依頼・条件・安全確認', days: 'Days 25–30' },
  { id: 6, title: 'Hotel', subtitle: '予約履歴・時系列・引継ぎ', days: 'Days 31–36' },
  { id: 7, title: 'Department Store', subtitle: '規約・仮定・判断', days: 'Days 37–42' },
  { id: 8, title: 'International Flagship', subtitle: '総合接客・複合判断', days: 'Days 43–48' },
]

export type ChapterProgressSummary = ChapterMeta & {
  completed: number
  total: number
  percent: number
  nextDay: number | null
}

export type NavigationSnapshot = {
  chapters: ChapterProgressSummary[]
  level1Completed: number
  level1Total: number
  buildCompleted: number
  buildTotal: number
  examCompleted: number
  examTotal: number
  masteryPracticed: number
  masteryTotal: number
  masteryOverall: number
  needsReview: number
  continueChapter: ChapterProgressSummary | null
}

function uniqueNumbers(values: unknown) {
  if (!Array.isArray(values)) return []
  return [...new Set(values.filter((value): value is number => typeof value === 'number' && Number.isFinite(value)))]
}

function readChapter(storage: StorageLike, meta: ChapterMeta): ChapterProgressSummary {
  const firstDay = (meta.id - 1) * 6 + 1
  const expected = Array.from({ length: 6 }, (_, index) => firstDay + index)
  let completedDays: number[] = []
  try {
    const raw = storage.getItem(`english-shift-chapter${meta.id}-progress-v1`)
    if (raw) completedDays = uniqueNumbers((JSON.parse(raw) as { completedDays?: unknown }).completedDays)
  } catch {
    completedDays = []
  }
  const completed = expected.filter((day) => completedDays.includes(day)).length
  const nextDay = expected.find((day) => !completedDays.includes(day)) ?? null
  return { ...meta, completed, total: 6, percent: Math.round((completed / 6) * 100), nextDay }
}

function readExamCompleted(storage: StorageLike) {
  try {
    const raw = storage.getItem(EXAM_PROGRESS_KEY)
    if (!raw) return 0
    const parsed = JSON.parse(raw) as { completedModules?: unknown }
    if (!Array.isArray(parsed.completedModules)) return 0
    return new Set(parsed.completedModules.filter((value): value is string => typeof value === 'string')).size
  } catch {
    return 0
  }
}

export function navigationSnapshot(storage: StorageLike): NavigationSnapshot {
  const chapters = chapterMeta.map((meta) => readChapter(storage, meta))
  const level1Completed = chapters.reduce((sum, chapter) => sum + chapter.completed, 0)
  const build = readBuildProgress(storage)
  const buildCompleted = new Set(build.completedIds.filter((id) => level2BuildValidIds.has(id))).size
  const examCompleted = readExamCompleted(storage)
  const mastery = readMasteryProgress(storage)
  const masteryRows = Object.values(mastery.entries).filter(Boolean).map((entry) => masteryStats(entry!))
  const masteryOverall = masteryRows.length
    ? Math.round(masteryRows.reduce((sum, row) => sum + row.mastery, 0) / masteryRows.length)
    : 0
  const needsReview = masteryRows.filter((row) => row.mastery < 75 || (row.hintedAttempts > 0 && row.mastery < 85)).length

  const partialChapters = chapters.filter((chapter) => chapter.completed > 0 && chapter.completed < chapter.total)
  const continueChapter = partialChapters.length
    ? partialChapters[partialChapters.length - 1]
    : chapters.find((chapter) => chapter.completed < chapter.total) ?? null

  return {
    chapters,
    level1Completed,
    level1Total: 48,
    buildCompleted,
    buildTotal: level2BuildActivities.length,
    examCompleted,
    examTotal: examModules.length,
    masteryPracticed: masteryRows.length,
    masteryTotal: grammarRegistry.length,
    masteryOverall,
    needsReview,
    continueChapter,
  }
}
