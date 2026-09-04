import type { AppView } from '../App'
import { navigationSnapshot } from '../core/navigationProgress'

export function HomeScreen({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  const snapshot = navigationSnapshot(window.localStorage)
  const level1Done = snapshot.level1Completed >= snapshot.level1Total
  const buildDone = snapshot.buildCompleted >= snapshot.buildTotal
  const examDone = snapshot.examCompleted >= snapshot.examTotal

  const continueView: AppView = !level1Done
    ? (`chapter${snapshot.continueChapter?.id ?? 1}` as AppView)
    : !buildDone
      ? 'build'
      : !examDone
        ? 'exam'
        : 'mastery'

  const continueLabel = !level1Done
    ? `Chapter ${snapshot.continueChapter?.id ?? 1} · ${snapshot.continueChapter?.nextDay ? `Day ${snapshot.continueChapter.nextDay}` : 'Level 1'}`
    : !buildDone
      ? 'Level 2 · BUILD · Continue'
      : !examDone
        ? `Exam Shift · Module ${Math.min(snapshot.examCompleted + 1, snapshot.examTotal)}`
        : 'Review your Mastery'

  const continueCopy = !level1Done
    ? `${snapshot.continueChapter?.title ?? 'Convenience Store'}でLevel 1の続きをプレイします。`
    : !buildDone
      ? '選択式で覚えた英語を、chunkから組み立てる練習へ進みます。'
      : !examDone
        ? '大学受験・TOEIC向けの発展文法を実戦文脈で仕上げます。'
        : '全コースを一周済みです。弱点を確認して短く復習しましょう。'

  return (
    <main className="home-shell">
      <section className="home-welcome">
        <div>
          <div className="eyebrow">ENGLISH SHIFT · LEARNING HOME</div>
          <h2>次にやることを、ひとつだけ。</h2>
          <p>接客英語を遊びながら、選ぶ → 組み立てる → 試験英語へ。迷ったらここから続けられます。</p>
        </div>
        <div className="home-level-badge"><strong>{snapshot.level1Completed}</strong><span>/ 48 Shifts</span></div>
      </section>

      <section className="home-continue-card">
        <div className="home-continue-icon">▶</div>
        <div className="home-continue-copy">
          <span>CONTINUE LEARNING</span>
          <h3>{continueLabel}</h3>
          <p>{continueCopy}</p>
        </div>
        <button className="primary home-continue-button" onClick={() => onNavigate(continueView)}>Continue</button>
      </section>

      <section className="home-quick-grid">
        <button className="home-quick-card" onClick={() => onNavigate('learn')}>
          <span>COURSE</span>
          <strong>Learn</strong>
          <p>Level 1・BUILD・Exam Shiftを一覧から選ぶ</p>
          <em>{snapshot.level1Completed}/48</em>
        </button>
        <button className="home-quick-card home-review-card" onClick={() => onNavigate('mastery')}>
          <span>SMART REVIEW</span>
          <strong>{snapshot.needsReview > 0 ? 'Weak Points' : 'Mastery'}</strong>
          <p>{snapshot.needsReview > 0 ? `${snapshot.needsReview} concepts need review` : 'プレイすると弱点を自動で検出します'}</p>
          <em>{snapshot.masteryOverall}%</em>
        </button>
      </section>

      <section className="home-section">
        <div className="home-section-head">
          <div><span>YOUR PATH</span><h3>Learning Path</h3></div>
          <button onClick={() => onNavigate('learn')}>View all</button>
        </div>
        <div className="home-path-grid">
          <button className="home-path-card" onClick={() => onNavigate('learn')}>
            <div className="home-path-number">1</div>
            <div><span>LEVEL 1 · SELECT</span><strong>Customer Service Foundations</strong><small>8 Chapters · 144 Activities</small></div>
            <div className="home-path-progress"><span style={{ width: `${Math.round((snapshot.level1Completed / 48) * 100)}%` }} /></div>
            <em>{snapshot.level1Completed}/48</em>
          </button>
          <button className="home-path-card" onClick={() => onNavigate('build')}>
            <div className="home-path-number">2</div>
            <div><span>LEVEL 2 · BUILD</span><strong>Sentence Assembly</strong><small>48 Days · 144 Activities</small></div>
            <div className="home-path-progress"><span style={{ width: `${Math.round((snapshot.buildCompleted / Math.max(1, snapshot.buildTotal)) * 100)}%` }} /></div>
            <em>{snapshot.buildCompleted}/{snapshot.buildTotal}</em>
          </button>
          <button className="home-path-card" onClick={() => onNavigate('exam')}>
            <div className="home-path-number">3</div>
            <div><span>POSTGAME · ES-G3</span><strong>Exam Shift: Advanced</strong><small>University Entrance + TOEIC</small></div>
            <div className="home-path-progress"><span style={{ width: `${Math.round((snapshot.examCompleted / Math.max(1, snapshot.examTotal)) * 100)}%` }} /></div>
            <em>{snapshot.examCompleted}/{snapshot.examTotal}</em>
          </button>
        </div>
      </section>

      <section className="home-mastery-strip" onClick={() => onNavigate('mastery')} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onNavigate('mastery') }}>
        <div><span>GRAMMAR MASTERY</span><strong>{snapshot.masteryPracticed}/{snapshot.masteryTotal} concepts practiced</strong></div>
        <div className="home-mastery-meter"><span style={{ width: `${snapshot.masteryOverall}%` }} /></div>
        <strong>{snapshot.masteryOverall}%</strong>
      </section>
    </main>
  )
}
