export const APP_HISTORY_MARKER = 'english-shift'

export const APP_VIEWS = [
  'home',
  'learn',
  'mastery',
  'masteryDetails',
  'more',
  'onboarding',
  'chapter1',
  'chapter2',
  'chapter3',
  'chapter4',
  'chapter5',
  'chapter6',
  'chapter7',
  'chapter8',
  'exam',
  'build',
  'repair',
  'flow',
  'lab',
] as const

export type HistoryAppView = (typeof APP_VIEWS)[number]

export interface AppHistoryState {
  app: typeof APP_HISTORY_MARKER
  view: HistoryAppView
}

const APP_VIEW_SET = new Set<string>(APP_VIEWS)

export function isHistoryAppView(value: unknown): value is HistoryAppView {
  return typeof value === 'string' && APP_VIEW_SET.has(value)
}

export function makeAppHistoryState(view: HistoryAppView): AppHistoryState {
  return { app: APP_HISTORY_MARKER, view }
}

export function readAppHistoryView(state: unknown): HistoryAppView | null {
  if (!state || typeof state !== 'object') return null
  const candidate = state as Partial<AppHistoryState>
  if (candidate.app !== APP_HISTORY_MARKER || !isHistoryAppView(candidate.view)) return null
  return candidate.view
}
