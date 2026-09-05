import type { AppView } from '../App'
import { CustomerPortrait } from '../components/CustomerPortrait'
import { readMasteryProgress } from '../core/mastery'
import { navigationSnapshot } from '../core/navigationProgress'
import { weaknessPriorityBySkill } from '../core/review'
import { queueShiftLaunch } from '../core/shiftLaunch'
import { queueBuildDayLaunch, completedSelectDays } from '../core/buildDayFlow'
import { readBuildProgress } from '../core/build'
import { level2BuildActivities } from '../data/level2BuildActivities'

const CHAPTER_GUIDES: Record<number, { id: string; name: string }> = {
  1: { id: 'mia', name: 'Mia' },
  2: { id: 'sofia', name: 'Sofia' },
  3: { id: 'aisha', name: 'Aisha' },
  4: { id: 'leo', name: 'Leo' },
  5: { id: 'grace', name: 'Grace' },
  6: { id: 'oliver', name: 'Oliver' },
  7: { id: 'hana', name: 'Hana' },
  8: { id: 'ken', name: 'Ken' },
}

type Props = {
  onNavigate: (view: AppView) => void
}

export function TodayScreen({ onNavigate }: Props) {
  const snapshot = navigationSnapshot(window.localStorage)
  const mastery = readMasteryProgress(window.localStorage)
  const weakPoints = weaknessPriorityBySkill(mastery)

  const level1Done = snapshot.level1Completed >= snapshot.level1Total
  const buildDone = snapshot.buildCompleted >= snapshot.buildTotal
  const examDone = snapshot.examCompleted >= snapshot.examTotal

  const chapter = snapshot.continueChapter
  const chapterId = chapter?.id ?? 8
  const guide = CHAPTER_GUIDES[chapterId] ?? CHAPTER_GUIDES[1]

  const buildProgress = readBuildProgress(window.localStorage)
  const completedBuildIds = new Set(buildProgress.completedIds)
  const selectDays = completedSelectDays(window.localStorage)
  const incompleteBuildDays = selectDays.filter((day) => {
    const activities = level2BuildActivities.filter((activity) => activity.day === day)
    return activities.some((activity) => !completedBuildIds.has(activity.id))
  })
  const recommendedBuildDay = level1Done
    ? incompleteBuildDays[0] ?? null
    : incompleteBuildDays.length
      ? incompleteBuildDays[incompleteBuildDays.length - 1]
      : null
  const buildFirst = recommendedBuildDay != null

  const primaryView: AppView = buildFirst
    ? 'build'
    : !level1Done
      ? (`chapter${chapterId}` as AppView)
      : !buildDone
        ? 'build'
        : !examDone
          ? 'exam'
          : 'mastery'

  const missionEyebrow = buildFirst
    ? 'BUILD WHAT YOU LEARNED'
    : !level1Done
      ? "TODAY'S SHIFT"
      : !buildDone
        ? 'NEXT PRACTICE'
        : !examDone
          ? 'POSTGAME'
          : 'KEEP IT SHARP'

  const missionTitle = buildFirst
    ? `Day ${recommendedBuildDay} · BUILD`
    : !level1Done
      ? `${chapter?.title ?? 'Convenience Store'} · Day ${chapter?.nextDay ?? 1}`
      : !buildDone
        ? 'Build the English'
        : !examDone
          ? 'Exam Shift'
          : 'Review weak points'

  const missionCopy = buildFirst
    ? 'さっきSELECTで見分けた英語を、今度は自分で組み立てます。3 Activitiesだけです。'
    : !level1Done
      ? '接客シーンを1 Shiftだけ進めます。まず状況を見て、自然な英語を選びましょう。'
      : !buildDone
        ? 'SELECT済みのDayから、未完了のBUILDを続けます。'
        : !examDone
          ? '大学受験・TOEIC向けの発展文法を、実戦文脈で仕上げます。'
          : '一周した内容から、今いちばん弱い能力を短く復習します。'

  const primaryLabel = buildFirst
    ? `Build Day ${recommendedBuildDay}`
    : !level1Done
      ? "Start today's shift"
      : !buildDone
        ? 'Continue BUILD'
        : !examDone
          ? 'Open Exam Shift'
          : 'Open Review'

  const journeyPercent = Math.round((snapshot.level1Completed / Math.max(1, snapshot.level1Total)) * 100)

  const openPrimaryMission = () => {
    if (buildFirst && recommendedBuildDay != null) {
      queueBuildDayLaunch(recommendedBuildDay, window.sessionStorage)
    } else if (!level1Done) {
      const day = chapter?.nextDay ?? ((chapterId - 1) * 6 + 1)
      queueShiftLaunch(chapterId, day, true, window.sessionStorage)
    }
    onNavigate(primaryView)
  }

  return (
    <main className="v060-hub-main v060-today">
      <section className="v060-page-intro">
        <div>
          <span className="v060-kicker">TODAY</span>
          <h1>Ready for your next shift?</h1>
          <p>{snapshot.level1Completed} of {snapshot.level1Total} main shifts complete</p>
        </div>
      </section>

      <section className="v060-mission-hero">
        <div className="v060-mission-copy">
          <span className="v060-kicker">{missionEyebrow}</span>
          <div className="v060-mission-character">
            <CustomerPortrait
              customerId={guide.id}
              customerName={guide.name}
              emotion="happy"
              motion="idle"
              reactionTick={0}
            />
          </div>
          <h2>{missionTitle}</h2>
          <p>{missionCopy}</p>
          <div className="v060-mission-meta">
            <span>約3–5分</span>
            <span>{buildFirst ? 'BUILD' : !level1Done ? 'SELECT' : !buildDone ? 'BUILD' : !examDone ? 'EXAM' : 'REVIEW'}</span>
          </div>
        </div>
        <button className="v060-primary-cta" onClick={openPrimaryMission}>
          {primaryLabel}
        </button>
      </section>

      <section className="v060-quick-section" aria-label="Quick review">
        <div>
          <span className="v060-section-label">QUICK REVIEW</span>
          <strong>{weakPoints.length ? `${weakPoints.length} ability weak points` : 'Build your mastery baseline'}</strong>
          <p>{weakPoints.length ? '弱い能力だけを短く復習できます。' : 'プレイするとSELECT / BUILD / REPAIR別に弱点が見えてきます。'}</p>
        </div>
        <button className="v060-text-action" onClick={() => onNavigate('mastery')}>
          {weakPoints.length ? 'Review' : 'Open Review'} <span aria-hidden="true">→</span>
        </button>
      </section>

      <button className="v060-journey-snapshot" onClick={() => onNavigate('learn')}>
        <div className="v060-journey-snapshot-head">
          <span>
            <small>YOUR SHIFTS</small>
            <strong>{level1Done ? 'Main journey complete' : `${chapter?.title ?? 'Convenience Store'} · Day ${chapter?.nextDay ?? 1}`}</strong>
          </span>
          <em>{snapshot.level1Completed}/{snapshot.level1Total}</em>
        </div>
        <div className="v060-progress-track" aria-hidden="true">
          <span style={{ width: `${journeyPercent}%` }} />
        </div>
        <span className="v060-journey-link">View all shifts →</span>
      </button>
    </main>
  )
}
