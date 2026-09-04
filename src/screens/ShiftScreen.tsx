import { customers } from '../data/customers'
import { useGameStore } from '../store/gameStore'
import { ConversationLog } from '../components/ConversationLog'
import { FactGrid } from '../components/FactGrid'
import { QuestionList } from '../components/QuestionList'
import { ProductList } from '../components/ProductList'
import { ResultCard } from '../components/ResultCard'
import { CustomerPortrait } from '../components/CustomerPortrait'

export function ShiftScreen() {
  const index = useGameStore((s) => s.customerIndex)
  const patience = useGameStore((s) => s.patience)
  const questions = useGameStore((s) => s.askedQuestionIds.length)
  const selected = useGameStore((s) => s.selectedProductId)
  const result = useGameStore((s) => s.result)
  const customerEmotion = useGameStore((s) => s.customerEmotion)
  const customerMotion = useGameStore((s) => s.customerMotion)
  const reactionTick = useGameStore((s) => s.reactionTick)
  const recommend = useGameStore((s) => s.recommend)
  const customer = customers[index]

  return (
    <main className="shift-layout">
      <section className="customer-panel">
        <div className="customer-header">
          <CustomerPortrait
            customerId={customer.id}
            customerName={customer.name}
            emotion={customerEmotion}
            motion={customerMotion}
            reactionTick={reactionTick}
          />
          <div className="customer-meta"><div className="eyebrow">CUSTOMER</div><h2>{customer.name}</h2><p>{customer.roleLabel} · Age {customer.age}</p></div>
        </div>
        <ConversationLog />
        <div className="patience-row"><span>Patience</span><strong>{patience}</strong></div>
        <div className="meter"><span style={{ width: `${patience}%` }} /></div>
        <h3>Known information</h3>
        <FactGrid />
        <div className="section-title"><h3>Ask a question</h3><span>{questions} asked · optimal {customer.optimalQuestionCount}</span></div>
        <QuestionList />
      </section>

      <aside className="catalog-panel">
        <div className="section-title"><h3>Products</h3><span>Choose carefully</span></div>
        <ProductList />
        <button className="primary recommend" disabled={!selected || Boolean(result)} onClick={recommend}>Recommend selected product</button>
        <div className="rule-card">
          <strong>Efficiency rule</strong>
          <p>Match 90%+ のときだけ効率ボーナス。最適質問数なら +30、余分な質問1回ごとに -10。</p>
        </div>
      </aside>
      <ResultCard />
    </main>
  )
}
