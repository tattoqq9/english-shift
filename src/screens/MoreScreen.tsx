import type { AppView } from '../App'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'

export function MoreScreen({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <main className="more-shell">
      <section className="more-hero">
        <div className="eyebrow">MORE</div>
        <h2>Tools & Extras</h2>
        <p>毎日の学習に必須ではない機能は、メインの学習導線から分離してここにまとめます。</p>
      </section>

      <section className="more-card-grid">
        <button className="more-card" onClick={() => onNavigate('onboarding')}>
          <span>GUIDE</span>
          <strong>Getting Started</strong>
          <p>SELECT → BUILD → REPAIR / MASTERYの学習ループを、チュートリアルでもう一度確認できます。進捗は変更しません。</p>
          <em>View tutorial →</em>
        </button>
        <button className="more-card" onClick={() => onNavigate('lab')}>
          <span>EXPERIMENTAL</span>
          <strong>Game Lab</strong>
          <p>Recommendation / Investigation / Troubleshooting / Handoff / Incidentのゲーム形式を確認できます。</p>
          <em>Open Lab →</em>
        </button>
        <article className="more-card info">
          <span>CURRICULUM</span>
          <strong>ES Grammar System</strong>
          <p>Level 1でES-G1/G2、Exam ShiftでES-G3をカバー。Level 2は英文生成、Advanced TrainingはREPAIR / FLOWとして能力別に分離しています。</p>
          <em>G1 + G2 + G3</em>
        </article>
        <article className="more-card info">
          <span>RELEASE</span>
          <strong>v0.5.1 · Characters & Context</strong>
          <p>11人のRecurring Castを6表情で統一し、SELECTとBUILDで同じ人物を継承。Rapid / Queueも対応中のCustomerを個別表示し、人物設定に合わせて教材文を同期調整しました。</p>
          <em>Character integration pass</em>
        </article>
        {DEBUG_UNLOCK_ALL_DAYS && (
          <article className="more-card debug">
            <span>DEBUG MODE</span>
            <strong>All learning routes unlocked</strong>
            <p>全Day・BUILD・Exam Shiftを進捗に関係なく直接確認できます。保存済み進捗自体は変更しません。</p>
            <em>Developer launch</em>
          </article>
        )}
      </section>
    </main>
  )
}
