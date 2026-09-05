import type { AppView } from '../App'
import { chapterMeta, navigationSnapshot } from '../core/navigationProgress'
import { queueShiftLaunch } from '../core/shiftLaunch'

type Props = {
  onNavigate: (view: AppView) => void
}

const STORE_VISUALS: Record<number, { background: string; position: string }> = {
  1: { background: '/backgrounds/chapter-1-convenience.webp', position: 'center 42%' },
  2: { background: '/backgrounds/chapter-2-clothing.webp', position: 'center 37%' },
  3: { background: '/backgrounds/chapter-3-outdoor.webp', position: 'center 35%' },
  4: { background: '/backgrounds/chapter-4-electronics.webp', position: 'center 32%' },
  5: { background: '/backgrounds/chapter-5-cafe.webp', position: 'center 36%' },
  6: { background: '/backgrounds/chapter-6-hotel.webp', position: 'center 31%' },
  7: { background: '/backgrounds/chapter-7-department.webp', position: 'center 28%' },
  8: { background: '/backgrounds/chapter-8-flagship.webp', position: 'center 31%' },
}

function openChapter(onNavigate: Props['onNavigate'], chapterId: number) {
  onNavigate(`chapter${chapterId}` as AppView)
}

export function JourneyScreen({ onNavigate }: Props) {
  const snapshot = navigationSnapshot(window.localStorage)
  const level1Done = snapshot.level1Completed >= snapshot.level1Total
  const currentChapter = snapshot.continueChapter ?? snapshot.chapters[7]
  const currentChapterId = currentChapter.id
  const currentDay = currentChapter.nextDay ?? ((currentChapterId - 1) * 6 + 6)
  const currentVisual = STORE_VISUALS[currentChapterId]
  const progressPercent = Math.round((snapshot.level1Completed / Math.max(1, snapshot.level1Total)) * 100)

  const continueShift = () => {
    if (level1Done) {
      onNavigate('exam')
      return
    }
    queueShiftLaunch(currentChapterId, currentDay, true, window.sessionStorage)
    openChapter(onNavigate, currentChapterId)
  }

  return (
    <main className="v060-hub-main v060-shifts">
      <section className="v060-shifts-heading">
        <div>
          <span className="v060-kicker">ALL SHIFTS</span>
          <h1>Your 48 shifts</h1>
          <p>{snapshot.level1Completed} / {snapshot.level1Total} complete</p>
        </div>
      </section>

      <div className="v060-progress-track v060-shifts-progress" aria-label={`${snapshot.level1Completed} of ${snapshot.level1Total} shifts complete`}>
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <section className="v060-current-store-card">
        <div
          className="v060-current-store-image"
          style={{ backgroundImage: `url(${currentVisual.background})`, backgroundPosition: currentVisual.position }}
          aria-hidden="true"
        >
          <div className="v060-current-store-shade" />
        </div>
        <div className="v060-current-store-body">
          <span className="v060-kicker">{level1Done ? 'MAIN COURSE COMPLETE' : 'CURRENT STORE'}</span>
          <h2>{currentChapter.title}</h2>
          <p>
            {level1Done
              ? '48 Shiftを完了しました。発展トレーニングへ進めます。'
              : `${currentChapter.completed} of 6 shifts complete · Next: Day ${currentDay}`}
          </p>
          <button className="v060-primary-cta" onClick={continueShift}>
            {level1Done ? 'Open Exam Shift' : `Continue Day ${currentDay}`}
          </button>
        </div>
      </section>

      <section className="v060-shifts-route" aria-label="Store route">
        <div className="v060-shifts-route-title">
          <span>YOUR ROUTE</span>
          <small>店舗を選ぶと、その6 Shiftを確認できます。</small>
        </div>

        <div className="v060-shifts-store-list">
          {snapshot.chapters.map((chapter) => {
            const complete = chapter.completed >= chapter.total
            const current = !level1Done && chapter.id === currentChapterId
            const visual = STORE_VISUALS[chapter.id]
            return (
              <button
                className={`v060-shifts-store-row ${complete ? 'is-complete' : ''} ${current ? 'is-current' : ''}`}
                key={chapter.id}
                onClick={() => openChapter(onNavigate, chapter.id)}
              >
                <span
                  className="v060-shifts-store-thumb"
                  style={{ backgroundImage: `url(${visual.background})`, backgroundPosition: visual.position }}
                  aria-hidden="true"
                >
                  <span />
                </span>

                <span className="v060-shifts-route-node" aria-hidden="true">
                  {complete ? '✓' : current ? '●' : chapter.id}
                </span>

                <span className="v060-shifts-store-copy">
                  <strong>{chapter.title}</strong>
                  <small>{current ? `YOU ARE HERE · ${chapter.days}` : chapter.days}</small>
                </span>

                <span className="v060-shifts-store-count">{chapter.completed}/6</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}
