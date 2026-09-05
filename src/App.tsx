import { useEffect, useState } from 'react'
import { TopBar } from './components/TopBar'
import { Chapter1Screen } from './screens/Chapter1Screen'
import { Chapter2Screen } from './screens/Chapter2Screen'
import { Chapter3Screen } from './screens/Chapter3Screen'
import { Chapter4Screen } from './screens/Chapter4Screen'
import { Chapter5Screen } from './screens/Chapter5Screen'
import { Chapter6Screen } from './screens/Chapter6Screen'
import { Chapter7Screen } from './screens/Chapter7Screen'
import { Chapter8Screen } from './screens/Chapter8Screen'
import { GameLabScreen } from './screens/GameLabScreen'
import { ExamShiftScreen } from './screens/ExamShiftScreen'
import { JourneyScreen } from './screens/JourneyScreen'
import { MasteryScreen } from './screens/MasteryScreen'
import { MoreScreen } from './screens/MoreScreen'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { ReviewScreen } from './screens/ReviewScreen'
import { TodayScreen } from './screens/TodayScreen'
import { Level2BuildScreen } from './screens/Level2BuildScreen'
import { RepairLabScreen } from './screens/RepairLabScreen'
import { FlowLabScreen } from './screens/FlowLabScreen'
import { completeOnboarding, shouldShowOnboarding } from './core/onboarding'
import { makeAppHistoryState, readAppHistoryView, type HistoryAppView } from './core/appHistory'
import { queueShiftLaunch } from './core/shiftLaunch'
import { DEBUG_UNLOCK_ALL_DAYS } from './runtimeMode'

export type AppView = HistoryAppView

function initialView(): AppView {
  try {
    return shouldShowOnboarding(window.localStorage) ? 'onboarding' : 'home'
  } catch {
    return 'home'
  }
}

function scrollTop(behavior: ScrollBehavior = 'smooth') {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : behavior }))
}

export default function App() {
  const [view, setView] = useState<AppView>(() => initialView())
  const [onboardingReturnView, setOnboardingReturnView] = useState<AppView | null>(null)

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    try {
      if (!readAppHistoryView(window.history.state)) {
        window.history.replaceState(makeAppHistoryState(view), '')
      }
    } catch { /* History API can be restricted in embedded browsers. */ }

    const handlePopState = (event: PopStateEvent) => {
      const next = readAppHistoryView(event.state)
      if (!next) return
      setOnboardingReturnView(null)
      setView(next)
      scrollTop('auto')
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.history.scrollRestoration = previousScrollRestoration
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = (next: AppView, options?: { replace?: boolean }) => {
    if (next === 'onboarding' && view !== 'onboarding') setOnboardingReturnView(view)

    if (next === view && !options?.replace) {
      scrollTop()
      return
    }

    setView(next)
    try {
      const state = makeAppHistoryState(next)
      if (options?.replace) window.history.replaceState(state, '')
      else window.history.pushState(state, '')
    } catch { /* Navigation must continue even when History API is unavailable. */ }
    scrollTop()
  }

  const finishOnboarding = (destination: AppView, reason: 'completed' | 'skipped') => {
    try { completeOnboarding(window.localStorage, reason) } catch { /* do not block navigation */ }
    setOnboardingReturnView(null)
    navigate(destination, { replace: true })
  }

  if (view === 'onboarding') {
    return (
      <div className="app-shell app-shell-v060">
        <OnboardingScreen
          onStart={() => { queueShiftLaunch(1, 1, true, window.sessionStorage); finishOnboarding('chapter1', 'completed') }}
          onSkip={() => finishOnboarding(onboardingReturnView ?? 'home', 'skipped')}
        />
      </div>
    )
  }

  return (
    <div className="app-shell app-shell-v060">
      {DEBUG_UNLOCK_ALL_DAYS && <div className="debug-mode-badge">DEBUG · ALL DAYS UNLOCKED</div>}
      <TopBar view={view} onChangeView={navigate} />
      {view === 'home'
        ? <TodayScreen onNavigate={navigate} />
        : view === 'learn'
          ? <JourneyScreen onNavigate={navigate} />
          : view === 'more'
            ? <MoreScreen onNavigate={navigate} />
            : view === 'lab'
              ? <GameLabScreen />
              : view === 'mastery'
                ? <ReviewScreen onNavigate={navigate} />
                : view === 'masteryDetails'
                  ? <MasteryScreen />
                  : view === 'build'
                    ? <Level2BuildScreen onNavigate={navigate} />
                    : view === 'repair'
                      ? <RepairLabScreen />
                      : view === 'flow'
                        ? <FlowLabScreen />
                        : view === 'exam'
                          ? <ExamShiftScreen />
                          : view === 'chapter1'
                            ? <Chapter1Screen onNavigate={navigate} />
                            : view === 'chapter2'
                              ? <Chapter2Screen onNavigate={navigate} />
                              : view === 'chapter3'
                                ? <Chapter3Screen onNavigate={navigate} />
                                : view === 'chapter4'
                                  ? <Chapter4Screen onNavigate={navigate} />
                                  : view === 'chapter5'
                                    ? <Chapter5Screen onNavigate={navigate} />
                                    : view === 'chapter6'
                                      ? <Chapter6Screen onNavigate={navigate} />
                                      : view === 'chapter7'
                                        ? <Chapter7Screen onNavigate={navigate} />
                                        : <Chapter8Screen onNavigate={navigate} />}
    </div>
  )
}
