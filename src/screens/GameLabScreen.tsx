import { useEffect, useMemo, useState } from 'react'
import { CustomerPortrait } from '../components/CustomerPortrait'
import { LabDetailedResult, type LabScoreItem } from '../components/LabDetailedResult'
import {
  gameplayPrototypeSummaries,
  incidentInvestigationPrototype,
  informationHuntPrototype,
  recommendationPrototype,
  staffCoordinationPrototype,
  troubleshootingPrototype,
  type GameplayPrototypeId,
} from '../data/gameplayPrototypes'

function scrollTop() {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }))
}

function LabCustomer({ id, name, roleLabel, opening }: { id: string; name: string; roleLabel: string; opening: string }) {
  return (
    <div className="lab-customer">
      <CustomerPortrait customerId={id} customerName={name} emotion="neutral" motion="idle" reactionTick={0} />
      <div className="lab-customer-copy">
        <div className="eyebrow">CUSTOMER</div>
        <h3>{name}</h3>
        <span>{roleLabel}</span>
        <div className="lab-opening">“{opening}”</div>
      </div>
    </div>
  )
}

function RecommendationLab() {
  const data = recommendationPrototype
  const [asked, setAsked] = useState<string[]>([])
  const [conversation, setConversation] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const selectedProduct = data.products.find((item) => item.id === selected)
  const productPoints = selectedProduct ? Math.round(selectedProduct.score * .8) : 0
  const efficiencyPoints = selectedProduct && selectedProduct.score >= 90
    ? Math.max(0, 20 - Math.max(0, asked.length - 1) * 10)
    : 0
  const points = productPoints + efficiencyPoints
  const askedQuestions = asked.map((id) => data.questions.find((q) => q.id === id)).filter(Boolean)
  const strongestAsked = [...askedQuestions].sort((a, b) => (b?.value ?? 0) - (a?.value ?? 0))[0]

  const ask = (id: string) => {
    if (finished || asked.includes(id) || asked.length >= data.maxQuestions) return
    const q = data.questions.find((item) => item.id === id)
    if (!q) return
    setAsked((current) => [...current, id])
    setConversation((current) => [...current, `You: ${q.text}`, `${data.customer.name}: ${q.response}`])
  }

  const breakdown: LabScoreItem[] = selectedProduct ? [
    {
      label: 'Product Match', points: productPoints, max: 80,
      explanation: `${selectedProduct.name} の適合度 ${selectedProduct.score}% を80点満点へ換算。商品そのものが客の条件にどれだけ合うかです。`,
    },
    {
      label: 'Question Efficiency', points: efficiencyPoints, max: 20,
      explanation: selectedProduct.score >= 90
        ? `${asked.length}回の質問で最適商品へ到達。0〜1問なら20点、2問なら10点です。`
        : '商品選択が十分に合っていないため、質問数が少なくてもEfficiency Bonusは付きません。',
    },
  ] : []

  const strengths = selectedProduct ? [
    ...(selectedProduct.score >= 90 ? [`${selectedProduct.name} は「運動後」「甘すぎない」という主要条件に最も合っています。`] : []),
    ...(strongestAsked && (strongestAsked.value ?? 0) >= 4 ? [`「${strongestAsked.text}」は情報価値の高い質問でした。`] : []),
    ...(asked.length <= 1 && selectedProduct.score >= 90 ? ['少ない質問で判断できており、接客効率が高いです。'] : []),
  ] : []

  const missed = selectedProduct ? [
    ...(selectedProduct.score < 90 ? [`選んだ ${selectedProduct.name} は適合度 ${selectedProduct.score}% 。Light Sports Waterなら100%でした。`] : []),
    ...(asked.length >= 2 && selectedProduct.score >= 90 ? ['2問目は確認として有効ですが、この客は最初の発言だけでも主要条件をかなり示しています。'] : []),
    ...(asked.includes('rec-age') ? ['年齢は今回の商品差をほとんど絞らないため、優先度の低い質問です。'] : []),
  ] : []

  return (
    <div className="lab-stage">
      <LabCustomer {...data.customer} />
      <div className="lab-objective"><strong>Goal</strong><span>最大2回の質問でニーズを絞り、最適な飲み物を薦める。</span></div>
      {conversation.length > 0 && <div className="lab-transcript">{conversation.map((line, i) => <div key={`${line}-${i}`}>{line}</div>)}</div>}
      <div className="section-title"><h3>Ask</h3><span>{asked.length}/{data.maxQuestions}</span></div>
      <div className="lab-choice-grid">
        {data.questions.map((q) => (
          <button key={q.id} disabled={finished || asked.includes(q.id) || asked.length >= data.maxQuestions} onClick={() => ask(q.id)}>
            <strong>{q.text}</strong><span>{asked.includes(q.id) ? q.reveals : 'Ask customer'}</span>
          </button>
        ))}
      </div>
      <div className="section-title"><h3>Recommend</h3><span>Best fit wins</span></div>
      <div className="lab-candidate-grid">
        {data.products.map((p) => (
          <button key={p.id} className={selected === p.id ? 'selected' : ''} disabled={finished} onClick={() => setSelected(p.id)}>
            <strong>{p.name}</strong><span>{p.price}</span><small>{p.note}</small>
          </button>
        ))}
      </div>
      {!finished && <button className="primary lab-submit" disabled={!selected} onClick={() => setFinished(true)}>Recommend</button>}
      {finished && selectedProduct && (
        <LabDetailedResult
          total={points}
          headline={selectedProduct.score >= 90 ? 'Good recommendation' : 'Recommendation needs work'}
          summary="点数は商品適合度80点＋質問効率20点。『少なく聞いて正しく選ぶ』ほど高得点です。"
          breakdown={breakdown}
          strengths={strengths}
          missed={missed}
          bestRoute={['最初の発言から「運動後」「甘すぎない」を拾う', '候補の Low sugar / electrolytes を比較する', 'Light Sports Water を薦める']}
          nextTime={selectedProduct.score < 90
            ? ['商品の特徴を客の発言と1つずつ対応させてから選ぶ。', '「not too sweet」を最重要条件として扱う。', '高額・高性能ではなく、用途への適合度を優先する。']
            : asked.length >= 2
              ? ['答えが見えているときは確認質問を減らす。', '質問するなら商品候補を大きく分ける条件から聞く。', '最適商品を維持したまま1問以内を狙う。']
              : ['同じ正解を、別の客でも少ない質問数で再現する。', '客の最初の一言に含まれるHidden Needを意識する。']}
        />
      )}
    </div>
  )
}

function InformationHuntLab() {
  const data = informationHuntPrototype
  const [asked, setAsked] = useState<string[]>([])
  const [clues, setClues] = useState<string[]>([])
  const [conversation, setConversation] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const correct = data.candidates.find((item) => item.correct)
  const selectedCandidate = data.candidates.find((item) => item.id === selected)
  const clueValue = asked.reduce((sum, id) => sum + (data.questions.find((q) => q.id === id)?.value ?? 0), 0)
  const accuracyPoints = selectedCandidate?.correct ? 70 : 0
  const questionPoints = Math.min(30, clueValue * 4)
  const points = finished && selectedCandidate ? accuracyPoints + questionPoints : 0
  const askedQuestions = asked.map((id) => data.questions.find((q) => q.id === id)).filter(Boolean)
  const missedHighValue = data.questions.filter((q) => !asked.includes(q.id) && q.value >= 4)

  const ask = (id: string) => {
    if (finished || asked.includes(id) || asked.length >= data.maxQuestions) return
    const q = data.questions.find((item) => item.id === id)
    if (!q) return
    setAsked((current) => [...current, id])
    setClues((current) => [...current, q.revealKey])
    setConversation((current) => [...current, `You: ${q.text}`, `${data.customer.name}: ${q.response}`])
  }

  const breakdown: LabScoreItem[] = selectedCandidate ? [
    {
      label: 'Target Accuracy', points: accuracyPoints, max: 70,
      explanation: selectedCandidate.correct ? `${selectedCandidate.name} を正しく特定しました。` : `${selectedCandidate.name} を選択。正解は ${correct?.name} でした。`,
    },
    {
      label: 'Question Quality', points: questionPoints, max: 30,
      explanation: `質問の情報価値は合計 ${clueValue}。価値×4点で計算し、30点を上限としています。`,
    },
  ] : []

  const strengths = [
    ...(selectedCandidate?.correct ? ['4候補から正しい充電器を特定できました。'] : []),
    ...askedQuestions.filter((q) => (q?.value ?? 0) >= 4).map((q) => `「${q?.text}」は候補を大きく減らす高情報価値の質問です。`),
  ]
  const missed = [
    ...missedHighValue.map((q) => `未使用の「${q.text}」は情報価値 ${q.value}。より強く候補を絞れます。`),
    ...(askedQuestions.filter((q) => (q?.value ?? 0) <= 2).map((q) => `「${q?.text}」は情報価値が低めで、質問枠を1つ使っています。`)),
    ...(!selectedCandidate?.correct ? [`証拠と候補表を照合すると正解は ${correct?.name} です。`] : []),
  ]

  return (
    <div className="lab-stage">
      <LabCustomer {...data.customer} />
      <div className="lab-objective"><strong>Goal</strong><span>質問は2回まで。客が昨日見た充電器を4候補から特定する。</span></div>
      {conversation.length > 0 && <div className="lab-transcript">{conversation.map((line, i) => <div key={`${line}-${i}`}>{line}</div>)}</div>}
      <div className="lab-clue-board"><span>Known clues</span>{clues.length ? clues.map((clue) => <strong key={clue}>{clue}</strong>) : <em>No extra clues yet</em>}</div>
      <div className="section-title"><h3>Interview</h3><span>{asked.length}/{data.maxQuestions}</span></div>
      <div className="lab-choice-grid">
        {data.questions.map((q) => <button key={q.id} disabled={finished || asked.includes(q.id) || asked.length >= data.maxQuestions} onClick={() => ask(q.id)}><strong>{q.text}</strong><span>{asked.includes(q.id) ? q.revealKey : 'Ask'}</span></button>)}
      </div>
      <div className="section-title"><h3>Which charger?</h3><span>Use the clues</span></div>
      <div className="lab-candidate-grid">
        {data.candidates.map((candidate) => <button key={candidate.id} className={selected === candidate.id ? 'selected' : ''} disabled={finished} onClick={() => setSelected(candidate.id)}><strong>{candidate.name}</strong><small>{candidate.details}</small></button>)}
      </div>
      {!finished && <button className="primary lab-submit" disabled={!selected} onClick={() => setFinished(true)}>Identify product</button>}
      {finished && selectedCandidate && (
        <LabDetailedResult
          total={points}
          headline={selectedCandidate.correct ? 'Target identified' : 'Wrong target'}
          summary="70点は最終特定、30点は質問の情報価値。正解しても質問の質で差が付きます。"
          breakdown={breakdown}
          strengths={strengths}
          missed={missed}
          bestRoute={['Were both ports USB-C?（情報価値5）', 'Do you remember the price?（情報価値4）', 'Pocket Dual C を選ぶ']}
          nextTime={selectedCandidate.correct && questionPoints >= 30
            ? ['高情報価値の質問を先に選ぶ判断を別の問題でも再現する。', '「どの回答なら候補が最も分裂するか」を考える。']
            : ['候補表を見て、回答によって候補が大きく分かれる質問を先にする。', '色のような共通特徴より、端子構成や価格を優先する。', '最終回答前に得たclueを候補の各項目と照合する。']}
        />
      )}
    </div>
  )
}

function TroubleshootingLab() {
  const data = troubleshootingPrototype
  const [asked, setAsked] = useState<string[]>([])
  const [eliminated, setEliminated] = useState<string[]>([])
  const [confirmed, setConfirmed] = useState<string | null>(null)
  const [conversation, setConversation] = useState<string[]>([])
  const [solution, setSolution] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const selectedSolution = data.solutions.find((item) => item.id === solution)
  const diagnosticRaw = asked.reduce((sum, id) => sum + (data.questions.find((q) => q.id === id)?.points ?? 0), 0)
  const bestDiagnosticRaw = [...data.questions].sort((a, b) => b.points - a.points).slice(0, data.maxQuestions).reduce((sum, q) => sum + q.points, 0)
  const diagnosticPoints = Math.round(Math.min(1, diagnosticRaw / bestDiagnosticRaw) * 50)
  const solutionPoints = selectedSolution?.cause === data.correctCause ? 50 : 0
  const points = finished && selectedSolution ? diagnosticPoints + solutionPoints : 0
  const askedQuestions = asked.map((id) => data.questions.find((q) => q.id === id)).filter(Boolean)
  const remainingCauses = data.causes.filter((cause) => !eliminated.includes(cause.id) && confirmed !== cause.id)

  const ask = (id: string) => {
    if (finished || asked.includes(id) || asked.length >= data.maxQuestions) return
    const q = data.questions.find((item) => item.id === id)
    if (!q) return
    setAsked((current) => [...current, id])
    setEliminated((current) => [...new Set([...current, ...q.eliminates])])
    if (q.confirms) setConfirmed(q.confirms)
    setConversation((current) => [...current, `You: ${q.text}`, `${data.customer.name}: ${q.response}`])
  }

  const breakdown: LabScoreItem[] = selectedSolution ? [
    {
      label: 'Diagnosis Evidence', points: diagnosticPoints, max: 50,
      explanation: `選んだ診断質問の証拠価値は ${diagnosticRaw}/${bestDiagnosticRaw}。この問題で選べる最善の2質問を50点として正規化しています。`,
    },
    {
      label: 'Correct Action', points: solutionPoints, max: 50,
      explanation: selectedSolution.cause === data.correctCause ? '原因「Old pairing」に対応する再ペアリングを選べました。' : `選んだ対処は ${selectedSolution.cause} 向け。実際の原因は ${data.correctCause} です。`,
    },
  ] : []

  const strengths = [
    ...askedQuestions.filter((q) => (q?.points ?? 0) >= 20).map((q) => `「${q?.text}」は原因を直接確認する強い診断質問でした。`),
    ...(selectedSolution?.cause === data.correctCause ? ['原因に対応した対処を選べました。'] : []),
    ...(confirmed === data.correctCause ? ['質問からpairing問題を直接confirmできています。'] : []),
  ]
  const missed = [
    ...remainingCauses.map((cause) => `${cause.label} がまだ未確認のまま残っています。`),
    ...askedQuestions.filter((q) => (q?.points ?? 0) <= 7).map((q) => `「${q?.text}」は証拠価値 ${q?.points} と低く、2回しかない診断枠では効率が悪めです。`),
    ...(selectedSolution?.cause !== data.correctCause ? ['診断結果と選択したActionが一致していません。'] : []),
  ]

  return (
    <div className="lab-stage">
      <LabCustomer {...data.customer} />
      <div className="lab-objective"><strong>Goal</strong><span>2回以内の診断質問で原因を絞り、正しい対処を選ぶ。</span></div>
      {conversation.length > 0 && <div className="lab-transcript">{conversation.map((line, i) => <div key={`${line}-${i}`}>{line}</div>)}</div>}
      <div className="lab-cause-board">
        {data.causes.map((cause) => {
          const isEliminated = eliminated.includes(cause.id)
          const isConfirmed = confirmed === cause.id
          return <div key={cause.id} className={isConfirmed ? 'confirmed' : isEliminated ? 'eliminated' : ''}><span>{isConfirmed ? '✓' : isEliminated ? '×' : '?'}</span><strong>{cause.label}</strong></div>
        })}
      </div>
      <div className="section-title"><h3>Diagnostic question</h3><span>{asked.length}/{data.maxQuestions}</span></div>
      <div className="lab-choice-grid">
        {data.questions.map((q) => <button key={q.id} disabled={finished || asked.includes(q.id) || asked.length >= data.maxQuestions} onClick={() => ask(q.id)}><strong>{q.text}</strong><span>{asked.includes(q.id) ? 'Checked' : 'Ask'}</span></button>)}
      </div>
      <div className="section-title"><h3>Action</h3><span>Choose a fix</span></div>
      <div className="lab-choice-grid">
        {data.solutions.map((item) => <button key={item.id} className={solution === item.id ? 'selected' : ''} disabled={finished} onClick={() => setSolution(item.id)}><strong>{item.text}</strong><span>Apply solution</span></button>)}
      </div>
      {!finished && <button className="primary lab-submit" disabled={!solution} onClick={() => setFinished(true)}>Apply solution</button>}
      {finished && selectedSolution && (
        <LabDetailedResult
          total={points}
          headline={selectedSolution.cause === data.correctCause ? 'Problem solved' : 'Diagnosis incomplete'}
          summary="診断50点＋対処50点。v0.1.5では最善の2質問を選べば診断部分が満点になるよう補正しました。"
          breakdown={breakdown}
          strengths={strengths}
          missed={missed}
          bestRoute={['Have you connected them to another phone recently?（pairingをconfirm）', 'Is Bluetooth turned on?（別原因を除外）', 'Forget the old connection and pair them again.']}
          nextTime={selectedSolution.cause === data.correctCause && diagnosticPoints >= 50
            ? ['原因を直接confirmできる質問を最優先する。', '正しい対処の前に、もう1つ独立した原因を除外する。']
            : ['症状ではなく「原因候補を一番減らす質問」を選ぶ。', 'Have you ... recently? のように直前の変更を確認する。', 'Actionは診断で残ったcauseと一致させる。']}
        />
      )}
    </div>
  )
}

function StaffCoordinationLab() {
  const data = staffCoordinationPrototype
  const [facts, setFacts] = useState<string[]>([])
  const [handoff, setHandoff] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const selectedHandoff = data.handoffOptions.find((item) => item.id === handoff)
  const essentialSelected = data.facts.filter((item) => item.essential && facts.includes(item.id)).length
  const nonEssentialSelected = data.facts.filter((item) => !item.essential && facts.includes(item.id)).length
  const factPoints = Math.min(60, Math.max(0, essentialSelected * 20 - nonEssentialSelected * 8))
  const handoffPoints = selectedHandoff?.points ?? 0
  const concisionPoints = facts.length === data.maxFacts && essentialSelected === data.maxFacts && nonEssentialSelected === 0 ? 10 : 0
  const points = finished && selectedHandoff ? factPoints + handoffPoints + concisionPoints : 0
  const selectedFacts = data.facts.filter((item) => facts.includes(item.id))
  const missedEssential = data.facts.filter((item) => item.essential && !facts.includes(item.id))

  const toggleFact = (id: string) => {
    if (finished) return
    setFacts((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      if (current.length >= data.maxFacts) return current
      return [...current, id]
    })
  }

  const breakdown: LabScoreItem[] = selectedHandoff ? [
    {
      label: 'Key Information', points: factPoints, max: 60,
      explanation: `重要情報1件20点。現在 ${essentialSelected}/3 件を選択し、不要情報 ${nonEssentialSelected} 件には減点があります。`,
    },
    {
      label: 'Handoff Clarity', points: handoffPoints, max: 30,
      explanation: selectedHandoff.quality === 'best' ? '症状・期限・receiptを一文で明確に伝えています。' : `選んだ引継ぎ文は ${selectedHandoff.quality} 評価です。`,
    },
    {
      label: 'Concision', points: concisionPoints, max: 10,
      explanation: concisionPoints === 10 ? '3枠をすべて必要情報だけで使えました。' : '必要な情報だけを3件に圧縮できると10点加点されます。',
    },
  ] : []

  const strengths = [
    ...selectedFacts.filter((fact) => fact.essential).map((fact) => `「${fact.text}」は次の担当者の判断に必要な情報です。`),
    ...(selectedHandoff?.quality === 'best' ? ['引継ぎ英文が簡潔で、重要情報を自然にまとめています。'] : []),
  ]
  const missed = [
    ...missedEssential.map((fact) => `重要情報「${fact.text}」を引継ぎメモから外しています。`),
    ...selectedFacts.filter((fact) => !fact.essential).map((fact) => `「${fact.text}」は今回の修理判断には優先度が低い情報です。`),
    ...(selectedHandoff?.quality !== 'best' ? ['最終の英語引継ぎで、症状・期限・receiptをまとめて伝えられていません。'] : []),
  ]

  return (
    <div className="lab-stage">
      <LabCustomer {...data.customer} />
      <div className="lab-objective"><strong>Goal</strong><span>修理担当がすぐ判断できるように、重要情報を3つだけ選んで引き継ぐ。</span></div>
      <div className="section-title"><h3>Pick key facts</h3><span>{facts.length}/{data.maxFacts}</span></div>
      <div className="lab-fact-selector">
        {data.facts.map((fact) => <button key={fact.id} className={facts.includes(fact.id) ? 'selected' : ''} disabled={finished || (!facts.includes(fact.id) && facts.length >= data.maxFacts)} onClick={() => toggleFact(fact.id)}>{fact.text}</button>)}
      </div>
      <div className="lab-relay-preview">
        <span>Handoff notes</span>
        {facts.length ? facts.map((id) => <strong key={id}>{data.facts.find((fact) => fact.id === id)?.text}</strong>) : <em>Select up to three facts</em>}
      </div>
      <div className="section-title"><h3>Tell the specialist</h3><span>Choose the clearest handoff</span></div>
      <div className="lab-choice-grid">
        {data.handoffOptions.map((item) => <button key={item.id} className={handoff === item.id ? 'selected' : ''} disabled={finished} onClick={() => setHandoff(item.id)}><strong>{item.text}</strong><span>Relay</span></button>)}
      </div>
      {!finished && <button className="primary lab-submit" disabled={facts.length === 0 || !handoff} onClick={() => setFinished(true)}>Complete handoff</button>}
      {finished && selectedHandoff && (
        <LabDetailedResult
          total={points}
          headline={points >= 90 ? 'Clean handoff' : 'Handoff can be sharper'}
          summary="重要情報60点＋英語での引継ぎ30点＋簡潔さ10点。何でも伝えるのではなく、次の担当者に必要な情報を圧縮します。"
          breakdown={breakdown}
          strengths={strengths}
          missed={missed}
          bestRoute={['Screen flickers below 30% brightness', 'Needs it for work tomorrow', 'Has the receipt', 'Best handoff sentence を選ぶ']}
          nextTime={points >= 90
            ? ['「次の担当者が何を判断するか」から必要情報を逆算する。', '同じ内容をより短い英語で伝える練習をする。']
            : ['症状・緊急度・手続きに必要な証拠を優先する。', '色や現在地など、判断を変えない情報を外す。', '最後の英文にも選んだ重要情報を反映させる。']}
        />
      )}
    </div>
  )
}

function IncidentInvestigationLab() {
  const data = incidentInvestigationPrototype
  const [interviews, setInterviews] = useState<string[]>([])
  const [evidence, setEvidence] = useState<string[]>([])
  const [conclusion, setConclusion] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const selectedConclusion = data.conclusions.find((item) => item.id === conclusion)
  const evidenceValue = interviews.reduce((sum, id) => sum + (data.witnesses.find((w) => w.id === id)?.value ?? 0), 0)
  const evidencePoints = Math.min(30, evidenceValue * 3)
  const conclusionPoints = selectedConclusion?.correct ? 70 : 0
  const points = finished && selectedConclusion ? evidencePoints + conclusionPoints : 0
  const interviewedWitnesses = data.witnesses.filter((w) => interviews.includes(w.id))
  const missedCritical = data.witnesses.filter((w) => !interviews.includes(w.id) && w.value >= 5)

  const interview = (id: string) => {
    if (finished || interviews.includes(id) || interviews.length >= data.maxInterviews) return
    const witness = data.witnesses.find((item) => item.id === id)
    if (!witness) return
    setInterviews((current) => [...current, id])
    setEvidence((current) => [...current, witness.evidence])
  }

  const breakdown: LabScoreItem[] = selectedConclusion ? [
    {
      label: 'Evidence Selection', points: evidencePoints, max: 30,
      explanation: `聞き込んだ2人の証拠価値は合計 ${evidenceValue}。価値×3点で30点を上限としています。`,
    },
    {
      label: 'Inference', points: conclusionPoints, max: 70,
      explanation: selectedConclusion.correct ? '6:12の取り違えと6:15の返却をつなげ、最も妥当な結論を選べました。' : '集めた証言からは、意図的な盗難より取り違え＋返却の方が強く支持されます。',
    },
  ] : []

  const strengths = [
    ...interviewedWitnesses.filter((w) => w.value >= 5).map((w) => `${w.name} の証言は時系列を直接支える重要証拠です。`),
    ...(selectedConclusion?.correct ? ['証拠の強さに合わせて、過剰に「盗難」と断定しませんでした。'] : []),
  ]
  const missed = [
    ...missedCritical.map((w) => `${w.name} を聞き逃しました。この証言は証拠価値 ${w.value} の重要証言です。`),
    ...interviewedWitnesses.filter((w) => w.value === 0).map((w) => `${w.name} は直接証拠を持たず、限られた聞き込み枠を消費しています。`),
    ...(!selectedConclusion?.correct ? ['最終結論が、収集した時系列証拠と一致していません。'] : []),
  ]

  return (
    <div className="lab-stage">
      <div className="lab-incident-banner"><div className="lab-incident-icon">!</div><div><div className="eyebrow">INCIDENT</div><h3>{data.title}</h3><p>{data.opening}</p></div></div>
      <div className="lab-objective"><strong>Goal</strong><span>聞き込みは2人まで。証言の時系列から最も妥当な結論を選ぶ。</span></div>
      <div className="section-title"><h3>Interview witnesses</h3><span>{interviews.length}/{data.maxInterviews}</span></div>
      <div className="lab-witness-grid">
        {data.witnesses.map((witness) => {
          const interviewed = interviews.includes(witness.id)
          return <button key={witness.id} className={interviewed ? 'interviewed' : ''} disabled={finished || interviewed || interviews.length >= data.maxInterviews} onClick={() => interview(witness.id)}><strong>{witness.name}</strong><span>{witness.role}</span>{interviewed && <p>“{witness.statement}”</p>}</button>
        })}
      </div>
      <div className="lab-timeline"><span>Evidence board</span>{evidence.length ? evidence.map((item) => <strong key={item}>{item}</strong>) : <em>No statements collected yet</em>}</div>
      <div className="section-title"><h3>Conclusion</h3><span>What most likely happened?</span></div>
      <div className="lab-choice-grid">
        {data.conclusions.map((item) => <button key={item.id} className={conclusion === item.id ? 'selected' : ''} disabled={finished} onClick={() => setConclusion(item.id)}><strong>{item.text}</strong><span>Choose conclusion</span></button>)}
      </div>
      {!finished && <button className="primary lab-submit" disabled={!conclusion} onClick={() => setFinished(true)}>Submit conclusion</button>}
      {finished && selectedConclusion && (
        <LabDetailedResult
          total={points}
          headline={selectedConclusion.correct ? 'Evidence supports your conclusion' : 'Evidence does not support the conclusion'}
          summary="証拠選択30点＋推論70点。限られた聞き込み枠を、時系列を直接埋める人物へ使うことが重要です。"
          breakdown={breakdown}
          strengths={strengths}
          missed={missed}
          bestRoute={['Alexを聞く → 6:12「似た袋を2つ取った」', 'Securityを聞く → 6:15「間違えて取った袋を返却」', '取り違えて後で返した、と結論づける']}
          nextTime={selectedConclusion.correct && evidencePoints >= 30
            ? ['証言の「直接見た事実」と推測を区別する。', '時刻の空白を埋める人物から聞く。']
            : ['誰が事件の時系列を直接見ているかを先に考える。', '「I did not see...」のような非証拠に聞き込み枠を使わない。', '結論は最も強い2つの証拠が同時に説明できるものを選ぶ。']}
        />
      )}
    </div>
  )
}

function ActivePrototype({ id }: { id: GameplayPrototypeId }) {
  if (id === 'recommendation') return <RecommendationLab />
  if (id === 'information-hunt') return <InformationHuntLab />
  if (id === 'troubleshooting') return <TroubleshootingLab />
  if (id === 'staff-coordination') return <StaffCoordinationLab />
  return <IncidentInvestigationLab />
}

export function GameLabScreen() {
  const [active, setActive] = useState<GameplayPrototypeId>('recommendation')
  const [runKey, setRunKey] = useState(0)
  const activeSummary = useMemo(() => gameplayPrototypeSummaries.find((item) => item.id === active)!, [active])

  useEffect(() => { scrollTop() }, [active])

  const selectActivity = (id: GameplayPrototypeId) => {
    setActive(id)
    setRunKey((value) => value + 1)
  }

  return (
    <main className="game-lab">
      <section className="lab-intro">
        <div>
          <div className="eyebrow">LEVEL 1 GAMEPLAY LAB</div>
          <h2>同じSELECT英語でも、遊び方を変える</h2>
          <p>5種類をAndroidで触り比べ、English Shiftの48 Shiftを支えられるゲームループか確認するための試作画面です。v0.1.5では採点根拠と改善方法まで表示します。</p>
        </div>
        <button className="secondary-button" onClick={() => setRunKey((value) => value + 1)}>Reset current</button>
      </section>

      <nav className="lab-activity-tabs" aria-label="Gameplay prototype selector">
        {gameplayPrototypeSummaries.map((item) => (
          <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => selectActivity(item.id)}>
            <span className="lab-tab-icon">{item.icon}</span>
            <span><strong>{item.shortTitle}</strong><small>{item.skill}</small></span>
          </button>
        ))}
      </nav>

      <section className="lab-activity-heading">
        <div><div className="eyebrow">{activeSummary.skill}</div><h2>{activeSummary.title}</h2><p>{activeSummary.subtitle}</p></div>
      </section>

      <ActivePrototype id={active} key={`${active}-${runKey}`} />
    </main>
  )
}
