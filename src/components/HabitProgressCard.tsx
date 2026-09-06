import { readRetentionProgress, retentionSummary } from '../core/retention'

export function HabitProgressCard() {
  const summary = retentionSummary(readRetentionProgress(window.localStorage))
  const hasHistory = summary.currentStreak > 0 || summary.activeDaysThisWeek > 0 || summary.totalWeeklyRewards > 0
  const percent = Math.min(100, Math.round((summary.activeDaysThisWeek / summary.weeklyTarget) * 100))

  return (
    <section className={`v062-habit-card ${summary.rewardEarnedThisWeek ? 'reward-earned' : ''}`} aria-label="Weekly learning rhythm">
      <div className="v062-habit-head">
        <span>
          <small>WEEKLY RHYTHM</small>
          <strong>{hasHistory ? `🔥 ${summary.currentStreak} day streak` : 'Start your learning streak'}</strong>
        </span>
        <div className="v062-weekly-stamp-mini">
          <small>WEEKLY STAMP</small>
          <strong>{summary.activeDaysThisWeek}/{summary.weeklyTarget}</strong>
        </div>
      </div>

      <div className="v062-week-days" aria-label={`${summary.activeDaysThisWeek} active days this week`}>
        {summary.weekDays.map((day) => (
          <div key={day.key} className={`${day.active ? 'active' : ''} ${day.today ? 'today' : ''}`}>
            <small>{day.label}</small>
            <span>{day.active ? '✓' : '·'}</span>
          </div>
        ))}
      </div>

      <div className="v062-week-progress" aria-hidden="true">
        <span style={{ width: `${percent}%` }} />
      </div>

      <div className="v062-habit-reward-copy">
        {summary.rewardEarnedThisWeek ? (
          <>
            <span className="v062-reward-seal" aria-hidden="true">★</span>
            <span><strong>Weekly Stamp earned</strong><small>今週の5日達成。Total {summary.totalWeeklyRewards} stamps.</small></span>
          </>
        ) : (
          <span>
            <strong>{summary.remainingThisWeek === summary.weeklyTarget ? '今週の最初の1回から始めよう' : `あと${summary.remainingThisWeek}日でWeekly Stamp`}</strong>
            <small>SELECT Shift / BUILD Day / 5問Reviewの完了で、その日が✓になります。</small>
          </span>
        )}
      </div>
    </section>
  )
}
