import { storeEvents } from '../data/events'
import { useGameStore } from '../store/gameStore'

export function DayResultScreen() {
  const score = useGameStore((s) => s.score)
  const trust = useGameStore((s) => s.trust)
  const completedEventIds = useGameStore((s) => s.completedEventIds)
  const restart = useGameStore((s) => s.restart)
  const rank = score >= 1220 ? 'S' : score >= 980 ? 'A' : score >= 740 ? 'B' : 'C'

  return (
    <main className="day-result">
      <div className="eyebrow">SHIFT COMPLETE</div>
      <h2>Day 1 Complete</h2>
      <div className="day-result-grid day-result-grid-four">
        <div><span>Total Score</span><strong>{score}</strong></div>
        <div><span>Trust</span><strong>{trust}</strong></div>
        <div><span>Events</span><strong>{completedEventIds.length}/{storeEvents.length}</strong></div>
        <div><span>Rank</span><strong>{rank}</strong></div>
      </div>
      <p>今日は商品推薦だけでなく、返品・在庫切れ・クレームにも英語で対応しました。少ない質問でニーズを掴む力と、トラブル時に相手へ配慮しながら解決策を示す力の両方が評価されます。</p>
      <button className="primary" onClick={restart}>Play again</button>
    </main>
  )
}
