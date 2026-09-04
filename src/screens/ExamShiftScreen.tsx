import { useState } from 'react'
import { ChapterActivityPlayer } from '../components/ChapterActivityPlayer'
import { gradeFromPercent } from '../core/chapter1'
import { examActivityById, examModules } from '../data/postgameActivities'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'

const STORAGE_KEY = 'english-shift-exam-shift-progress-v1'

type ExamProgress = {
  completedModules: string[]
  bestScores: Record<string, number>
  bestHintCounts: Record<string, number>
}

function emptyProgress(): ExamProgress {
  return { completedModules: [], bestScores: {}, bestHintCounts: {} }
}

function readProgress(): ExamProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw) as Partial<ExamProgress>
    return {
      completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
      bestScores: parsed.bestScores ?? {},
      bestHintCounts: parsed.bestHintCounts ?? {},
    }
  } catch {
    return emptyProgress()
  }
}

function saveProgress(progress: ExamProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function level1CompletedShiftCount() {
  let completed = 0
  for (let chapter = 1; chapter <= 8; chapter += 1) {
    try {
      const raw = localStorage.getItem(`english-shift-chapter${chapter}-progress-v1`)
      if (!raw) continue
      const parsed = JSON.parse(raw) as { completedDays?: number[] }
      completed += Array.isArray(parsed.completedDays) ? new Set(parsed.completedDays).size : 0
    } catch {
      // Ignore malformed local progress and keep the gate conservative.
    }
  }
  return completed
}

function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
}

function LockedGate() {
  const completed = level1CompletedShiftCount()
  return (
    <main className="exam-shift-shell">
      <section className="exam-shift-locked">
        <div className="eyebrow">POSTGAME · ES-G3</div>
        <h2>Exam Shift: Advanced</h2>
        <p>大学受験・TOEIC向けの発展モードです。通常プレイではLevel 1の48 Shiftを完了すると解放されます。</p>
        <div className="exam-gate-progress"><span>LEVEL 1</span><strong>{completed}/48 Shifts</strong></div>
        <div className="chapter-progress-track"><span style={{ width: `${Math.min(100, (completed / 48) * 100)}%` }} /></div>
        <small>デバッグ起動ではLevel 1進捗に関係なく確認できます。</small>
      </section>
    </main>
  )
}

function ModuleMap({ progress, onSelect, onReset }: { progress: ExamProgress; onSelect: (id: string) => void; onReset: () => void }) {
  const completedCount = progress.completedModules.length
  const allComplete = completedCount === examModules.length

  return (
    <main className="exam-shift-shell">
      <section className="exam-shift-hero">
        <div>
          <div className="eyebrow">POSTGAME · ES-G3 · EXAM SHIFT</div>
          <h2>Exam Shift: Advanced</h2>
          <p>Level 1で完成したES-G1/G2を土台に、大学受験とTOEICで必要になる発展構文・高速文法判断を実務文脈で仕上げます。</p>
          <div className="exam-audience-row"><span>大学受験</span><span>TOEIC L&amp;R</span><span>ES-G3 · 26 concepts</span></div>
        </div>
        <div className="chapter-progress-ring"><strong>{completedCount}</strong><span>/ 6 modules</span></div>
      </section>

      <section className="exam-format-note">
        <strong>READ → DECIDE</strong>
        <span>短文だけでなく、通知・メール・規約・会話から意味を取る。Level 1のVisual Grammarをそのまま再利用します。</span>
      </section>

      <div className="exam-module-grid">
        {examModules.map((module, index) => {
          const completed = progress.completedModules.includes(module.id)
          const unlocked = DEBUG_UNLOCK_ALL_DAYS || index === 0 || progress.completedModules.includes(examModules[index - 1].id)
          const best = progress.bestScores[module.id]
          return (
            <button key={module.id} className={`exam-module-card ${completed ? 'completed' : ''}`} disabled={!unlocked} onClick={() => onSelect(module.id)}>
              <div className="exam-module-number">MODULE {module.number}</div>
              <h3>{module.title}</h3>
              <strong>{module.titleJa}</strong>
              <p>{module.subtitle}</p>
              <div className="exam-module-tags"><span>{module.examFocus}</span><span>{module.grammarKeys.length} concepts</span></div>
              <div className="chapter-day-meta"><span>{module.activityIds.length} Activities</span><strong>{completed ? `✓ ${best ?? 0}%` : unlocked ? 'PLAY' : 'LOCKED'}</strong></div>
            </button>
          )
        })}
      </div>

      {allComplete && (
        <section className="exam-complete-card">
          <div className="eyebrow">ES-G3 COMPLETE</div>
          <h2>Advanced Grammar Coverage · 26 / 26</h2>
          <p>発展文法を一通り実戦文脈で処理しました。今後はスコア・誤答傾向を使った反復モードへ接続できます。</p>
        </section>
      )}

      <details className="chapter-reset-details">
        <summary>Progress options</summary>
        <button className="secondary-button" onClick={onReset}>Reset Exam Shift progress</button>
      </details>
    </main>
  )
}

function ModuleIntro({ moduleId, onStart, onBack }: { moduleId: string; onStart: () => void; onBack: () => void }) {
  const module = examModules.find((item) => item.id === moduleId)!
  return (
    <main className="chapter-day-intro exam-module-intro">
      <button className="chapter-back" onClick={onBack}>← Exam Shift map</button>
      <div className="eyebrow">EXAM SHIFT · MODULE {module.number}</div>
      <h2>{module.title}</h2>
      <p className="chapter-day-subtitle">{module.subtitle}</p>
      <div className="chapter-plan-grid">
        <div><span>Exam focus</span><strong>{module.examFocus}</strong></div>
        <div><span>Activities</span><strong>{module.activityIds.length}</strong></div>
      </div>
      <section className="chapter-language-card exam-grammar-targets">
        <div><strong>ES-G3 TARGETS</strong>{module.grammarKeys.map((key) => <span key={key}>{key}</span>)}</div>
      </section>
      <button className="primary chapter-start" onClick={onStart}>Start Module {module.number}</button>
    </main>
  )
}

function ModuleResult({ moduleId, scores, hints, onFinish }: { moduleId: string; scores: number[]; hints: number[]; onFinish: (score: number, hints: number) => void }) {
  const module = examModules.find((item) => item.id === moduleId)!
  const score = Math.round(scores.reduce((sum, value) => sum + value, 0) / Math.max(1, scores.length))
  const hintCount = hints.reduce((sum, value) => sum + value, 0)
  const grade = gradeFromPercent(score)
  return (
    <main className="chapter-day-result">
      <div className="eyebrow">EXAM MODULE COMPLETE · {module.number}/6</div>
      <div className="chapter-result-head">
        <div><h2>{module.title} Complete</h2><p>{module.subtitle}</p></div>
        <div className={`grade-badge grade-${grade.toLowerCase()}`}>{grade}</div>
      </div>
      <div className="chapter-day-score-grid">
        <div><span>Score</span><strong>{score}%</strong></div>
        <div><span>Activities</span><strong>{scores.length}/{module.activityIds.length}</strong></div>
        <div><span>ES-G3 targets</span><strong>{module.grammarKeys.length}</strong></div>
        <div><span>Japanese hints</span><strong>{hintCount}</strong></div>
      </div>
      <section className="chapter-can-do result-can-do">
        <div className="eyebrow">GRAMMAR COVERAGE</div>
        {module.grammarKeys.map((key) => <p key={key}>✓ {key}</p>)}
      </section>
      <button className="primary chapter-start" onClick={() => onFinish(score, hintCount)}>{module.number === 6 ? 'Complete ES-G3' : 'Finish Module'}</button>
    </main>
  )
}

export function ExamShiftScreen() {
  const unlocked = DEBUG_UNLOCK_ALL_DAYS || level1CompletedShiftCount() >= 48
  const [progress, setProgress] = useState<ExamProgress>(() => readProgress())
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [started, setStarted] = useState(false)
  const [activityIndex, setActivityIndex] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [hints, setHints] = useState<number[]>([])

  if (!unlocked) return <LockedGate />

  const module = selectedModule ? examModules.find((item) => item.id === selectedModule) : undefined
  const activity = module ? examActivityById(module.activityIds[activityIndex]) : undefined
  const moduleDone = Boolean(module && started && activityIndex >= module.activityIds.length)

  const select = (id: string) => {
    setSelectedModule(id); setStarted(false); setActivityIndex(0); setScores([]); setHints([]); scrollTop()
  }
  const start = () => {
    setStarted(true); setActivityIndex(0); setScores([]); setHints([]); scrollTop()
  }
  const completeActivity = (score: number, japaneseHintsUsed: number) => {
    setScores((current) => [...current, score])
    setHints((current) => [...current, japaneseHintsUsed])
    setActivityIndex((current) => current + 1)
    scrollTop()
  }
  const finishModule = (score: number, hintCount: number) => {
    if (!selectedModule) return
    const next: ExamProgress = {
      completedModules: [...new Set([...progress.completedModules, selectedModule])],
      bestScores: { ...progress.bestScores, [selectedModule]: Math.max(progress.bestScores[selectedModule] ?? 0, score) },
      bestHintCounts: { ...progress.bestHintCounts, [selectedModule]: Math.min(progress.bestHintCounts[selectedModule] ?? Number.POSITIVE_INFINITY, hintCount) },
    }
    setProgress(next); saveProgress(next)
    setSelectedModule(null); setStarted(false); setActivityIndex(0); setScores([]); setHints([]); scrollTop()
  }
  const reset = () => {
    const empty = emptyProgress(); setProgress(empty); saveProgress(empty); setSelectedModule(null); setStarted(false); scrollTop()
  }

  if (!selectedModule) return <ModuleMap progress={progress} onSelect={select} onReset={reset} />
  if (!started) return <ModuleIntro moduleId={selectedModule} onStart={start} onBack={() => { setSelectedModule(null); scrollTop() }} />
  if (moduleDone) return <ModuleResult moduleId={selectedModule} scores={scores} hints={hints} onFinish={finishModule} />
  if (!module || !activity) return <main className="chapter-day-result"><h2>Exam activity data not found.</h2></main>

  return (
    <main className="chapter-play exam-shift-play">
      <div className="chapter-play-header">
        <div><div className="eyebrow">MODULE {module.number} · ACTIVITY {activityIndex + 1}/{module.activityIds.length}</div><h2>{activity.title}</h2></div>
        <div className="chapter-mini-score"><span>Module score</span><strong>{scores.reduce((sum, value) => sum + value, 0)}</strong></div>
      </div>
      <div className="chapter-progress-track"><span style={{ width: `${(activityIndex / module.activityIds.length) * 100}%` }} /></div>
      <ChapterActivityPlayer key={activity.id} activity={activity} onComplete={completeActivity} />
    </main>
  )
}
