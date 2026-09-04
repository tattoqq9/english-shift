import { customers } from '../data/customers'
import { questionInformationGain } from '../core/information'
import { useGameStore } from '../store/gameStore'

export function QuestionList() {
  const index = useGameStore((s) => s.customerIndex)
  const asked = useGameStore((s) => s.askedQuestionIds)
  const revealed = useGameStore((s) => s.revealedFactKeys)
  const result = useGameStore((s) => s.result)
  const askQuestion = useGameStore((s) => s.askQuestion)
  const customer = customers[index]
  const askedSet = new Set(asked)
  const revealedSet = new Set(revealed)

  return (
    <div className="question-list">
      {customer.questions.map((question) => {
        const gain = questionInformationGain(customer, question, revealedSet)
        const done = askedSet.has(question.id)
        return (
          <button
            className="question-button"
            key={question.id}
            disabled={done || Boolean(result)}
            onClick={() => askQuestion(question.id)}
          >
            <span>{question.text}</span>
            <small>{done ? 'Asked' : `Info value ${gain.toFixed(0)} · Patience -${question.patienceCost}`}</small>
          </button>
        )
      })}
    </div>
  )
}
