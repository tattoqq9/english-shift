import type { AppView } from '../App'
import { navigationSnapshot } from '../core/navigationProgress'
import { readAdvancedProgress } from '../core/advanced'
import { repairActivities, flowActivities } from '../data/advancedTrainingActivities'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'

export function LearnScreen({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  const snapshot = navigationSnapshot(window.localStorage)
  const advanced = readAdvancedProgress(window.localStorage)
  const advancedUnlocked = DEBUG_UNLOCK_ALL_DAYS || snapshot.level1Completed >= snapshot.level1Total

  return (
    <main className="learn-shell">
      <section className="learn-hero">
        <div>
          <div className="eyebrow">COURSE MAP</div>
          <h2>Learn</h2>
          <p>学習モードをタブで横並びにせず、コース階層として整理しました。Level 1から順に進めても、必要な場所へ直接戻っても構いません。</p>
        </div>
        <div className="learn-progress-summary"><strong>{snapshot.level1Completed}</strong><span>/ 48 Level 1 Shifts</span></div>
      </section>

      <section className="course-section">
        <div className="course-section-head">
          <div className="course-level-mark">1</div>
          <div><span>LEVEL 1 · SELECT</span><h3>Customer Service Foundations</h3><p>8店舗を回りながら、ES-G1 / ES-G2を実戦文脈で学びます。</p></div>
          <strong>{snapshot.level1Completed}/48</strong>
        </div>
        <div className="chapter-path-list">
          {snapshot.chapters.map((chapter, index) => (
            <div className="chapter-path-item" key={chapter.id}>
              <div className={`chapter-path-node ${chapter.completed === 6 ? 'complete' : chapter.completed > 0 ? 'active' : ''}`}>{chapter.completed === 6 ? '✓' : chapter.id}</div>
              {index < snapshot.chapters.length - 1 && <div className={`chapter-path-line ${chapter.completed === 6 ? 'complete' : ''}`} />}
              <button className="chapter-path-card" onClick={() => onNavigate(`chapter${chapter.id}` as AppView)}>
                <div>
                  <span>CHAPTER {chapter.id} · {chapter.days}</span>
                  <strong>{chapter.title}</strong>
                  <small>{chapter.subtitle}</small>
                </div>
                <div className="chapter-path-meta">
                  <em>{chapter.completed}/6</em>
                  <span>{chapter.completed === 6 ? 'Complete' : chapter.completed > 0 ? `Continue Day ${chapter.nextDay}` : 'Open'}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="course-mode-grid">
        <button className="course-mode-card build" onClick={() => onNavigate('build')}>
          <div className="course-mode-top"><span>LEVEL 2 · BUILD</span><em>{snapshot.buildCompleted}/{snapshot.buildTotal}</em></div>
          <h3>Sentence Assembly</h3>
          <p>Level 1と対応する48 Days・144 Activities。接客意図からchunkを組み立てます。</p>
          <div className="course-mode-track"><span style={{ width: `${Math.round((snapshot.buildCompleted / Math.max(1, snapshot.buildTotal)) * 100)}%` }} /></div>
          <strong>Open BUILD →</strong>
        </button>
        <button className="course-mode-card exam" onClick={() => onNavigate('exam')}>
          <div className="course-mode-top"><span>EXAM SHIFT · ES-G3</span><em>{snapshot.examCompleted}/{snapshot.examTotal}</em></div>
          <h3>Exam Training</h3>
          <p>大学受験・TOEIC向け発展文法を、メール・規約・会話で処理します。</p>
          <div className="course-mode-track"><span style={{ width: `${Math.round((snapshot.examCompleted / Math.max(1, snapshot.examTotal)) * 100)}%` }} /></div>
          <strong>Open Exam Shift →</strong>
        </button>
      </section>


      <section className="advanced-course-section">
        <div className="advanced-course-head">
          <div><span>ADVANCED TRAINING</span><h3>Specialized Practice</h3><p>Level 2本編から分離した、診断力と会話設計の追加コースです。</p></div>
          <strong>{advancedUnlocked ? 'OPEN' : 'LEVEL 1 REQUIRED'}</strong>
        </div>
        <div className="advanced-course-grid">
          <button className="advanced-course-card repair" disabled={!advancedUnlocked} onClick={() => onNavigate('repair')}>
            <div><span>REPAIR LAB</span><em>{advanced.repairCompleted.length}/{repairActivities.length}</em></div>
            <h3>Fix broken English</h3>
            <p>少し不自然な英文を見抜き、より正しい・自然な形へ修正します。</p>
            <strong>{advancedUnlocked ? 'Open Repair Lab →' : 'Locked'}</strong>
          </button>
          <button className="advanced-course-card flow" disabled={!advancedUnlocked} onClick={() => onNavigate('flow')}>
            <div><span>FLOW LAB</span><em>{advanced.flowCompleted.length}/{flowActivities.length}</em></div>
            <h3>Build complete conversations</h3>
            <p>謝罪・確認・提案などを、接客として自然な順番に組み立てます。</p>
            <strong>{advancedUnlocked ? 'Open Flow Lab →' : 'Locked'}</strong>
          </button>
        </div>
      </section>
    </main>
  )
}
