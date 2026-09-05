import { isDayUnlocked } from '../runtimeMode'
import { readBuildProgress } from '../core/build'
import { level2BuildActivities } from '../data/level2BuildActivities'

type StoreShiftDay = {
  day: number
  title: string
  subtitle: string
  gameFocus: string
}

type StoreShiftProgress = {
  completedDays: number[]
  bestScores: Record<string, number>
}

type Props = {
  chapterId: number
  days: StoreShiftDay[]
  progress: StoreShiftProgress
  onSelectDay: (day: number) => void
  onBuildDay?: (day: number) => void
  onReset: () => void
}

const STORE_META: Record<number, {
  title: string
  range: string
  description: string
  background: string
  position: string
}> = {
  1: { title: 'Convenience Store', range: 'Days 1–6', description: '基本応対から、質問・案内・会計・Busy Shiftまで。', background: '/backgrounds/chapter-1-convenience.webp', position: 'center 42%' },
  2: { title: 'Clothing Store', range: 'Days 7–12', description: '比較・用途・購入履歴・交換理由から最適な対応を選ぶ。', background: '/backgrounds/chapter-2-clothing.webp', position: 'center 37%' },
  3: { title: 'Sports / Outdoor', range: 'Days 13–18', description: '経験・継続・助言・安全条件・天候判断を扱う。', background: '/backgrounds/chapter-3-outdoor.webp', position: 'center 35%' },
  4: { title: 'Electronics Store', range: 'Days 19–24', description: '商品仕様・丁寧な質問・機能説明・故障診断・引継ぎ。', background: '/backgrounds/chapter-4-electronics.webp', position: 'center 32%' },
  5: { title: 'Restaurant / Café', range: 'Days 25–30', description: '注文・数量・丁寧表現・アレルギー・混雑対応。', background: '/backgrounds/chapter-5-cafe.webp', position: 'center 36%' },
  6: { title: 'Hotel', range: 'Days 31–36', description: '予約履歴・時系列・伝聞・推理・サービス診断。', background: '/backgrounds/chapter-6-hotel.webp', position: 'center 31%' },
  7: { title: 'Department Store', range: 'Days 37–42', description: '仮定・後悔・比較・ポリシー判断を扱う。', background: '/backgrounds/chapter-7-department.webp', position: 'center 28%' },
  8: { title: 'International Flagship', range: 'Days 43–48', description: 'これまでの英語と判断を複合接客で統合する。', background: '/backgrounds/chapter-8-flagship.webp', position: 'center 31%' },
}

export function StoreShiftMap({
  chapterId,
  days,
  progress,
  onSelectDay,
  onBuildDay,
  onReset,
}: Props) {
  const meta = STORE_META[chapterId]
  const firstDay = (chapterId - 1) * 6 + 1
  const lastDay = firstDay + 5
  const completed = new Set(progress.completedDays)
  const completedCount = days.filter((day) => completed.has(day.day)).length
  const nextDay = days.find((day) => !completed.has(day.day))?.day ?? null
  const unlockedThrough = Math.min(lastDay, Math.max(firstDay, firstDay + completedCount))
  const storeComplete = completedCount >= days.length
  const buildProgress = readBuildProgress(window.localStorage)
  const buildCompleted = new Set(buildProgress.completedIds)

  return (
    <main className="v060-store-detail">
      <section className="v060-store-detail-hero">
        <div
          className="v060-store-detail-image"
          style={{ backgroundImage: `url(${meta.background})`, backgroundPosition: meta.position }}
          aria-hidden="true"
        >
          <div className="v060-store-detail-image-shade" />
          <div className="v060-store-detail-image-label">
            <span>CHAPTER {chapterId}</span>
            <strong>{meta.range}</strong>
          </div>
        </div>

        <div className="v060-store-detail-hero-body">
          <div>
            <span className="v060-kicker">{storeComplete ? 'STORE COMPLETE' : 'SHIFT SELECT'}</span>
            <h1>{meta.title}</h1>
            <p>{meta.description}</p>
          </div>
          <div className="v060-store-detail-count" aria-label={`${completedCount} of ${days.length} SELECT shifts complete`}>
            <strong>{completedCount}</strong>
            <span>/ {days.length}</span>
          </div>
        </div>
      </section>

      <section className="v060-store-shift-section">
        <div className="v060-store-shift-section-head">
          <div>
            <span>SHIFTS IN THIS STORE</span>
            <strong>{storeComplete ? 'All SELECT shifts complete' : nextDay ? `Next: Day ${nextDay}` : 'Choose a shift'}</strong>
          </div>
          <small>SELECT → BUILD</small>
        </div>

        <div className="v060-unified-day-list">
          {days.map((day) => {
            const selectDone = completed.has(day.day)
            const isNext = !storeComplete && day.day === nextDay
            const selectUnlocked = isDayUnlocked(selectDone || day.day <= unlockedThrough)
            const best = progress.bestScores[String(day.day)]
            const buildActivities = level2BuildActivities.filter((activity) => activity.day === day.day)
            const buildDone = buildActivities.filter((activity) => buildCompleted.has(activity.id)).length
            const buildReady = selectDone
            const buildComplete = buildDone >= 3

            return (
              <article
                key={day.day}
                className={`v060-unified-day-card ${selectDone ? 'select-complete' : ''} ${isNext ? 'is-next' : ''}`}
              >
                <button
                  type="button"
                  className="v060-unified-day-main"
                  disabled={!selectUnlocked}
                  onClick={() => onSelectDay(day.day)}
                >
                  <span className="v060-store-shift-number">{selectDone ? '✓' : day.day}</span>
                  <span className="v060-store-shift-copy">
                    <small>DAY {day.day}{isNext ? ' · NEXT' : ''}</small>
                    <strong>{day.title}</strong>
                    <em>{day.subtitle}</em>
                  </span>
                  <span className="v060-store-shift-meta">
                    {selectDone && typeof best === 'number' ? <small>Best {best}%</small> : <small>{day.gameFocus}</small>}
                    <strong>{selectDone ? 'Replay' : isNext ? 'Start' : selectUnlocked ? 'Open' : 'Locked'}</strong>
                  </span>
                </button>

                <div className="v060-day-skill-status">
                  <span className={`v060-day-skill v060-day-skill-select ${selectDone ? 'complete' : selectUnlocked ? 'ready' : 'locked'}`}>
                    <small>SELECT</small>
                    <strong>{selectDone ? '✓ Complete' : isNext ? 'Start' : selectUnlocked ? 'Ready' : 'Locked'}</strong>
                  </span>

                  <button
                    type="button"
                    className={`v060-day-skill v060-day-skill-build ${buildComplete ? 'complete' : buildReady ? 'ready' : 'locked'}`}
                    disabled={!buildReady || !onBuildDay}
                    onClick={() => onBuildDay?.(day.day)}
                  >
                    <small>BUILD</small>
                    <strong>{buildComplete ? '✓ Complete' : buildDone > 0 ? `${buildDone}/3 · Resume` : buildReady ? 'Start' : 'Finish SELECT first'}</strong>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {storeComplete && (
        <section className="v060-store-complete-note">
          <span>✓</span>
          <div>
            <strong>{meta.title} SELECT complete</strong>
            <p>完了したDayはBUILDへ進めます。SELECTのReplayもいつでもできます。</p>
          </div>
        </section>
      )}

      <details className="v060-store-progress-options">
        <summary>Progress options</summary>
        <button type="button" className="secondary-button" onClick={onReset}>Reset this store progress</button>
      </details>
    </main>
  )
}
