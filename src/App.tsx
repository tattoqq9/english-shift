import { useState } from 'react'
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
import { HomeScreen } from './screens/HomeScreen'
import { LearnScreen } from './screens/LearnScreen'
import { MasteryScreen } from './screens/MasteryScreen'
import { MoreScreen } from './screens/MoreScreen'
import { Level2BuildScreen } from './screens/Level2BuildScreen'
import { RepairLabScreen } from './screens/RepairLabScreen'
import { FlowLabScreen } from './screens/FlowLabScreen'
import { DEBUG_UNLOCK_ALL_DAYS } from './runtimeMode'

export type AppView =
  | 'home'
  | 'learn'
  | 'mastery'
  | 'more'
  | 'chapter1'
  | 'chapter2'
  | 'chapter3'
  | 'chapter4'
  | 'chapter5'
  | 'chapter6'
  | 'chapter7'
  | 'chapter8'
  | 'exam'
  | 'build'
  | 'repair'
  | 'flow'
  | 'lab'

export default function App() {
  const [view, setView] = useState<AppView>('home')

  const navigate = (next: AppView) => {
    setView(next)
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
  }

  return (
    <div className="app-shell app-shell-v041">
      {DEBUG_UNLOCK_ALL_DAYS && <div className="debug-mode-badge">DEBUG · ALL DAYS UNLOCKED</div>}
      <TopBar view={view} onChangeView={navigate} />
      {view === 'home'
        ? <HomeScreen onNavigate={navigate} />
        : view === 'learn'
          ? <LearnScreen onNavigate={navigate} />
          : view === 'more'
            ? <MoreScreen onNavigate={navigate} />
            : view === 'lab'
              ? <GameLabScreen />
              : view === 'mastery'
                ? <MasteryScreen />
                : view === 'build'
                  ? <Level2BuildScreen />
                  : view === 'repair'
                    ? <RepairLabScreen />
                    : view === 'flow'
                      ? <FlowLabScreen />
                      : view === 'exam'
                    ? <ExamShiftScreen />
                    : view === 'chapter1'
                      ? <Chapter1Screen />
                      : view === 'chapter2'
                        ? <Chapter2Screen />
                        : view === 'chapter3'
                          ? <Chapter3Screen />
                          : view === 'chapter4'
                            ? <Chapter4Screen />
                            : view === 'chapter5'
                              ? <Chapter5Screen />
                              : view === 'chapter6'
                                ? <Chapter6Screen />
                                : view === 'chapter7'
                                  ? <Chapter7Screen />
                                  : <Chapter8Screen />}
    </div>
  )
}
