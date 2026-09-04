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
  detail?: string
}

const STEPS: Step[] = [
  {
    eyebrow: 'WELCOME TO ENGLISH SHIFT',
    title: '英語を「見分ける・作る・直す」で身につける。',
    body: '接客シーンの中で英文法を使いながら、理解だけで終わらず、自分で使える英語へ段階的に進みます。',
    accent: '3 SKILLS',
    detail: 'SELECT · BUILD · REPAIR',
  },
  {
    eyebrow: 'STEP 1 · SELECT',
    title: 'まず、正しい英語を見分ける。',
    body: 'Level 1では、接客シーンで質問・提案・説明を選びながら、中学〜高校英文法の土台を身につけます。',
    accent: 'LEVEL 1',
    detail: 'Recognition / 見分ける力',
  },
  {
    eyebrow: 'STEP 2 · BUILD',
    title: '次に、自分で英文を組み立てる。',
    body: 'Level 2ではLevel 1と対応した場面を使い、chunkを自然な語順へ並べて、自分で英文を作る力を鍛えます。',
    accent: 'LEVEL 2',
    detail: 'Production / 作る力',
  },
  {
    eyebrow: 'STEP 3 · MASTERY',
    title: '苦手な「能力」まで見つけて復習する。',
    body: 'Grammar MasteryはSELECT / BUILD / REPAIRを文法ごとに別々に記録します。Weakness Reviewでは、弱い能力に合った問題を優先して復習できます。',
    accent: 'MASTERY',
    detail: 'Measure → Review → Improve',
  },
]

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
          <button type="button" className="onboarding-skip" onClick={onSkip}>Skip</button>
        </div>

        <div className="onboarding-progress" aria-label={`Onboarding step ${stepIndex + 1} of ${STEPS.length}`}>
          {STEPS.map((_, index) => (
            <span key={index} className={index <= stepIndex ? 'active' : ''} />
          ))}
        </div>

        <div className="onboarding-content">
          <div className="onboarding-step-mark"><span>{String(stepIndex + 1).padStart(2, '0')}</span><em>{step.accent}</em></div>
          <div className="eyebrow">{step.eyebrow}</div>
          <h1>{step.title}</h1>
          <p>{step.body}</p>
          {step.detail && <div className="onboarding-detail">{step.detail}</div>}

          {stepIndex === 0 && (
            <div className="onboarding-skill-grid" aria-label="English Shift skills">
              <div><span>SELECT</span><strong>見分ける</strong></div>
              <div><span>BUILD</span><strong>作る</strong></div>
              <div><span>REPAIR</span><strong>直す</strong></div>
            </div>
          )}

          {stepIndex === 3 && (
            <div className="onboarding-mastery-preview">
              <div><span>SELECT</span><strong>91%</strong></div>
              <div><span>BUILD</span><strong>62%</strong></div>
              <div><span>REPAIR</span><strong>78%</strong></div>
              <small>例：BUILDが弱ければLevel 2の復習を優先</small>
            </div>
          )}
        </div>

        <div className="onboarding-actions">
          <button type="button" className="onboarding-back" onClick={previous} disabled={stepIndex === 0}>Back</button>
          {last ? (
            <button type="button" className="onboarding-primary" onClick={onStart}>Start Level 1</button>
          ) : (
            <button type="button" className="onboarding-primary" onClick={next}>Next</button>
          )}
        </div>
      </section>
    </main>
  )
}
