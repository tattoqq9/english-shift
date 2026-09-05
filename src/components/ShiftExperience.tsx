type ShiftDay = {
  day: number
  title: string
  subtitle: string
  gameFocus: string
  activityIds: string[]
  newLanguage: string[]
  reviewLanguage: string[]
  canDo: string[]
}

type IntroProps = {
  chapterId: number
  day: ShiftDay
  onStart: () => void
  onBack: () => void
}

type ResultProps = {
  chapterId: number
  day: ShiftDay
  scores: number[]
  hintCounts: number[]
  onFinish: (percent: number, hintsUsed: number) => void
  onBuild?: () => void
}

const STORE_META: Record<number, { title: string; background: string; position: string }> = {
  1: { title: 'Convenience Store', background: '/backgrounds/chapter-1-convenience.webp', position: 'center 42%' },
  2: { title: 'Clothing Store', background: '/backgrounds/chapter-2-clothing.webp', position: 'center 37%' },
  3: { title: 'Sports / Outdoor', background: '/backgrounds/chapter-3-outdoor.webp', position: 'center 35%' },
  4: { title: 'Electronics Store', background: '/backgrounds/chapter-4-electronics.webp', position: 'center 32%' },
  5: { title: 'Restaurant / Café', background: '/backgrounds/chapter-5-cafe.webp', position: 'center 36%' },
  6: { title: 'Hotel', background: '/backgrounds/chapter-6-hotel.webp', position: 'center 31%' },
  7: { title: 'Department Store', background: '/backgrounds/chapter-7-department.webp', position: 'center 28%' },
  8: { title: 'International Flagship', background: '/backgrounds/chapter-8-flagship.webp', position: 'center 31%' },
}

function sessionMinutes(activityCount: number) {
  return Math.max(3, Math.min(7, activityCount + 2))
}

export function ShiftIntro({ chapterId, day, onStart, onBack }: IntroProps) {
  const store = STORE_META[chapterId]
  return (
    <main className="v060-shift-intro">
      <button type="button" className="v060-inline-back" onClick={onBack}>← {store.title}</button>

      <section className="v060-shift-intro-card">
        <div
          className="v060-shift-intro-image"
          style={{ backgroundImage: `url(${store.background})`, backgroundPosition: store.position }}
          aria-hidden="true"
        >
          <div className="v060-shift-intro-image-shade" />
          <div className="v060-shift-intro-location">
            <span>{store.title}</span>
            <strong>Day {day.day}</strong>
          </div>
        </div>

        <div className="v060-shift-intro-body">
          <span className="v060-kicker">NEXT SHIFT</span>
          <h1>{day.title}</h1>
          <p>{day.subtitle}</p>

          <div className="v060-shift-intro-meta">
            <span><strong>{day.activityIds.length}</strong> Activities</span>
            <span><strong>約{sessionMinutes(day.activityIds.length)}分</strong></span>
          </div>

          <section className="v060-shift-can-do">
            <span>TODAY'S GOAL</span>
            <strong>{day.canDo[0] ?? day.gameFocus}</strong>
            {day.canDo.length > 1 && <small>＋ {day.canDo.length - 1} more</small>}
          </section>

          <button type="button" className="v060-primary-cta v060-shift-start" onClick={onStart}>
            Start Shift
          </button>
        </div>
      </section>
    </main>
  )
}

export function ShiftDayResult({ chapterId, day, scores, hintCounts, onFinish, onBuild }: ResultProps) {
  const store = STORE_META[chapterId]
  const total = scores.reduce((sum, value) => sum + value, 0)
  const percent = scores.length ? Math.round(total / scores.length) : 0
  const hintsUsed = hintCounts.reduce((sum, value) => sum + value, 0)

  return (
    <main className="v060-shift-complete">
      <section className="v060-shift-complete-card">
        <div className="v060-shift-complete-mark" aria-hidden="true">✓</div>
        <span className="v060-kicker">SHIFT COMPLETE</span>
        <h1>{percent}%</h1>
        <h2>{day.title}</h2>
        <p>{store.title} · Day {day.day}</p>

        <div className="v060-shift-result-stats">
          <div><span>Activities</span><strong>{scores.length}/{day.activityIds.length}</strong></div>
          <div><span>Hints</span><strong>{hintsUsed}</strong></div>
          <div><span>Best</span><strong>{scores.length ? `${Math.max(...scores)}%` : '—'}</strong></div>
        </div>

        <section className="v060-shift-learned">
          <span>YOU PRACTICED</span>
          {day.canDo.slice(0, 3).map((item) => <p key={item}>✓ {item}</p>)}
        </section>

        {onBuild ? (
          <div className="v060-shift-result-actions">
            <button
              type="button"
              className="v060-primary-cta"
              onClick={() => {
                onFinish(percent, hintsUsed)
                onBuild()
              }}
            >
              Build today's English
            </button>
            <button
              type="button"
              className="v060-secondary-cta"
              onClick={() => onFinish(percent, hintsUsed)}
            >
              Finish for now
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="v060-primary-cta"
            onClick={() => onFinish(percent, hintsUsed)}
          >
            Finish Shift
          </button>
        )}
      </section>
    </main>
  )
}
