import {
  APP_VIEWS,
  isHistoryAppView,
  makeAppHistoryState,
  readAppHistoryView,
} from '../src/core/appHistory.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

for (const view of APP_VIEWS) {
  assert(isHistoryAppView(view), `Known view was rejected: ${view}`)
  const encoded = makeAppHistoryState(view)
  assert(readAppHistoryView(encoded) === view, `History round-trip failed: ${view}`)
}

assert(!isHistoryAppView('settings'), 'Unknown view must be rejected')
assert(readAppHistoryView(null) === null, 'Null state must be ignored')
assert(readAppHistoryView({ app: 'other-app', view: 'home' }) === null, 'Foreign history state must be ignored')
assert(readAppHistoryView({ app: 'english-shift', view: 'settings' }) === null, 'Malformed English Shift state must be ignored')

console.log('Release UX smoke: PASS')
console.log(`history-views=${APP_VIEWS.length} android-back=state-safe foreign-state=ignored`)
