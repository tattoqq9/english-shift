import { customers } from '../data/customers'
import { useGameStore } from '../store/gameStore'

export function FactGrid() {
  const index = useGameStore((s) => s.customerIndex)
  const revealed = useGameStore((s) => s.revealedFactKeys)
  const customer = customers[index]
  const known = new Set(revealed)
  return (
    <div className="fact-grid">
      {customer.facts.map((fact) => (
        <div className="fact" key={fact.key}>
          <span>{fact.label}</span>
          <strong>{known.has(fact.key) ? fact.value : '???'}</strong>
        </div>
      ))}
    </div>
  )
}
