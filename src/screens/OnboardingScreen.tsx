import { useState } from 'react'
import '../styles/onboarding.css'

type Props = {
  onStart: () => void
  onSkip: () => void
}

type Step = {
  eyebrow: string
  title: string
  body: string
  accent: string
  kind: 'welcome' | 'loop' | 'navigation'
}

const STEPS: Step[] = [
  {
    eyebrow: 'WELCOME TO ENGLISH SHIFT',
    title: 'まず、1 Shiftだけやってみる。',
    body: '接客シーンの中で英語を選び、使った表現をその日のうちに自分で組み立てます。最初から大量のメニューを覚える必要はありません。',
    accent: 'ABOUT 4 MIN',
    kind: 'welcome',
  },
  {
    eyebrow: 'HOW YOU LEARN',
    title: '見分ける → 作る → 弱点を直す。',
    body: '各DayはSELECTを終えると同じDayのBUILDが解放されます。苦手が見えてきたらReviewとREPAIRで必要な力だけを短く復習します。',
    accent: '3 SKILLS',
    kind: 'loop',
  },
  {
    eyebrow: 'YOU ONLY NEED THREE PLACES',
    title: '迷ったらTodayを開けば大丈夫。',
    body: 'Todayは今やること、Shiftsは店舗とDayを選ぶ場所、Reviewは弱点を直す場所です。Moreは必要なときだけ使います。',
    accent: 'READY',
    kind: 'navigation',
  },
]

function WelcomePreview() {
  return (
    <div className="onboarding-shift-preview" aria-label="Example Shift">
      <div
        className="onboarding-shift-image"
        style={{ backgroundImage: "url('/backgrounds/chapter-1-convenience.webp')" }}
        aria-hidden="true"
      >
        <span>CONVENIENCE STORE</span>
        <strong>Day 1</strong>
      </div>
      <div className="onboarding-shift-preview-body">
        <span>FIRST SHIFT</span>
        <strong>3 Activities</strong>
        <small>状況を見る → 英語を選ぶ → 結果を確認</small>
      </div>
    </div>
  )
}

function LearningLoopPreview() {
  return (
    <div className="onboarding-loop-preview" aria-label="English Shift learning loop">
      <div className="select">
        <span>01</span>
        <small>SELECT</small>
        <strong>見分ける</strong>
        <em>3 Activities</em>
      </div>
      <div className="onboarding-loop-arrow" aria-hidden="true">→</div>
      <div className="build">
        <span>02</span>
        <small>BUILD</small>
        <strong>作る</strong>
        <em>SELECT後に解放</em>
      </div>
      <div className="onboarding-loop-arrow" aria-hidden="true">→</div>
      <div className="repair">
        <span>03</span>
        <small>REVIEW</small>
        <strong>弱点を直す</strong>
        <em>必要なときだけ</em>
      </div>
    </div>
  )
}

function NavigationPreview() {
  return (
    <div className="onboarding-nav-preview" aria-label="Main navigation">
      <div className="primary">
        <span>01</span>
        <strong>Today</strong>
        <small>今やる</small>
      </div>
      <div>
        <span>02</span>
        <strong>Shifts</strong>
        <small>選ぶ・Replay</small>
      </div>
      <div>
        <span>03</span>
        <strong>Review</strong>
        <small>弱点を直す</small>
      </div>
    </div>
  )
}

export function OnboardingScreen({ onStart, onSkip }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const step = STEPS[stepIndex]
  const last = stepIndex === STEPS.length - 1

  const previous = () => setStepIndex((current) => Math.max(0, current - 1))
  const next = () => setStepIndex((current) => Math.min(STEPS.length - 1, current + 1))

  return (
    <main className="onboarding-shell">
      <section className="onboarding-card" aria-live="polite">
        <div className="onboarding-topline">
          <div className="onboarding-brand" aria-label="English Shift">
            <span>ES</span>
            <strong>English Shift</strong>
          </div>
          <button type="button" className="onboarding-skip" onClick={onSkip}>
            Skip guide
          </button>
        </div>

        <div className="onboarding-progress" aria-label={`Guide ${stepIndex + 1} of ${STEPS.length}`}>
          {STEPS.map((_, index) => (
            <span key={index} className={index <= stepIndex ? 'active' : ''} />
          ))}
        </div>

        <div className="onboarding-content">
          <div className="onboarding-step-mark">
            <span>{String(stepIndex + 1).padStart(2, '0')}</span>
            <em>{step.accent}</em>
          </div>
          <div className="eyebrow">{step.eyebrow}</div>
          <h1>{step.title}</h1>
          <p>{step.body}</p>

          {step.kind === 'welcome' && <WelcomePreview />}
          {step.kind === 'loop' && <LearningLoopPreview />}
          {step.kind === 'navigation' && <NavigationPreview />}
        </div>

        <div className="onboarding-actions">
          <button type="button" className="onboarding-back" onClick={previous} disabled={stepIndex === 0}>
            Back
          </button>
          {last ? (
            <button type="button" className="onboarding-primary" onClick={onStart}>
              Start Day 1
            </button>
          ) : (
            <button type="button" className="onboarding-primary" onClick={next}>
              Next
            </button>
          )}
        </div>
      </section>
    </main>
  )
}
