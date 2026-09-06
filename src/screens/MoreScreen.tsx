import { useEffect, useState } from 'react'
import type { AppView } from '../App'
import { DEBUG_UNLOCK_ALL_DAYS } from '../runtimeMode'
import { playGameFeel, readGameFeelSettings, saveGameFeelSettings, type GameFeelSettings } from '../core/gameFeel'
import { previewStoreAtmosphere, stopStoreAtmosphere } from '../core/audioAtmosphere'
import { CustomerBook } from '../components/CustomerBook'

export function MoreScreen({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  const [gameFeel, setGameFeel] = useState(() => readGameFeelSettings(window.localStorage))

  useEffect(() => () => stopStoreAtmosphere(120), [])

  const toggleGameFeel = (key: keyof GameFeelSettings) => {
    const next = { ...gameFeel, [key]: !gameFeel[key] }
    saveGameFeelSettings(next, window.localStorage)
    setGameFeel(next)
    if (key === 'music') {
      if (next.music) previewStoreAtmosphere(1, window.localStorage)
      else stopStoreAtmosphere(120)
    }
    if (key === 'soundFx' && next.soundFx) playGameFeel('correct', window.localStorage)
    if (key === 'haptics' && next.haptics) playGameFeel('stamp', window.localStorage)
  }

  return (
    <main className="v060-hub-main v060-more v060-more-v4">
      <section className="v060-page-intro">
        <div>
          <span className="v060-kicker">MORE</span>
          <h1>Collection & extras</h1>
          <p>Customer Book、設定、追加トレーニングなど、学習を続ける楽しみをまとめています。</p>
        </div>
      </section>

      <CustomerBook />

      <section className="v060-more-section">
        <div className="v060-more-section-head">
          <small>GAME FEEL</small>
          <strong>Sound, haptics & celebration</strong>
        </div>
        <div className="v060-more-list v061-gamefeel-panel">
          <button className="v061-gamefeel-row" type="button" onClick={() => toggleGameFeel('music')}>
            <span><strong>Music & ambience</strong><small>店舗ごとの低音量BGM。BUILD / REVIEWでは自動的にさらに静かになります。</small></span>
            <span className={`v061-toggle ${gameFeel.music ? 'on' : ''}`} aria-label={gameFeel.music ? 'Music and ambience on' : 'Music and ambience off'} />
          </button>
          <button className="v061-gamefeel-row" type="button" onClick={() => toggleGameFeel('soundFx')}>
            <span><strong>Sound effects</strong><small>正解・惜しい・Shift完了を短いSEで返します。</small></span>
            <span className={`v061-toggle ${gameFeel.soundFx ? 'on' : ''}`} aria-label={gameFeel.soundFx ? 'Sound effects on' : 'Sound effects off'} />
          </button>
          <button className="v061-gamefeel-row" type="button" onClick={() => toggleGameFeel('haptics')}>
            <span><strong>Haptics</strong><small>Correctでは軽く、Shift / BUILD Completeでは2〜3段で振動します。端末がサイレント設定では振動しない場合があります。</small></span>
            <span className={`v061-toggle ${gameFeel.haptics ? 'on' : ''}`} aria-label={gameFeel.haptics ? 'Haptics on' : 'Haptics off'} />
          </button>
          <button className="v061-gamefeel-row" type="button" onClick={() => toggleGameFeel('celebrations')}>
            <span><strong>Celebration animation</strong><small>Shift / BUILD Completeで✓のPop、金色Glow、カードの浮き上がり、Passport stampを演出します。</small></span>
            <span className={`v061-toggle ${gameFeel.celebrations ? 'on' : ''}`} aria-label={gameFeel.celebrations ? 'Celebration animation on' : 'Celebration animation off'} />
          </button>
          <button
            className="v063-audio-preview"
            type="button"
            disabled={!gameFeel.music}
            onClick={() => previewStoreAtmosphere(1, window.localStorage)}
          >
            <span><strong>▶ Preview store atmosphere</strong><small>Convenience Store themeを約5秒だけ試聴します。</small></span>
            <em>5 SEC</em>
          </button>
        </div>
        <p className="v061-audio-note">8店舗の音はWeb Audioで生成。歌詞・会話音は使わず、20〜40秒ごとの小さな環境音とslow variationでループ感を抑えます。SE時は自動duckingします。</p>
      </section>

      <section className="v060-more-section">
        <div className="v060-more-section-head">
          <small>HELP</small>
          <strong>English Shiftの使い方</strong>
        </div>
        <div className="v060-more-list">
          <button className="v060-more-row" onClick={() => onNavigate('onboarding')}>
            <span>
              <small>3-STEP GUIDE</small>
              <strong>How English Shift works</strong>
              <p>Today / Shifts / Reviewと、SELECT → BUILD → Reviewの流れを約30秒で確認。</p>
            </span>
            <em>Open →</em>
          </button>
        </div>
      </section>

      <section className="v060-more-section">
        <div className="v060-more-section-head">
          <small>OPTIONAL TRAINING</small>
          <strong>Labs</strong>
        </div>
        <div className="v060-more-list">
          <button className="v060-more-row" onClick={() => onNavigate('lab')}>
            <span>
              <small>EXPERIMENTAL</small>
              <strong>Game Lab</strong>
              <p>Recommendation / Investigation / Troubleshootingなど、別形式の問題を試す。</p>
            </span>
            <em>Open →</em>
          </button>

          <button className="v060-more-row" onClick={() => onNavigate('flow')}>
            <span>
              <small>OPTIONAL</small>
              <strong>FLOW LAB</strong>
              <p>複数の応答を並べ、会話全体の流れを組み立てる追加トレーニング。</p>
            </span>
            <em>Open →</em>
          </button>
        </div>
      </section>

      <section className="v060-more-section">
        <div className="v060-more-section-head">
          <small>ABOUT</small>
          <strong>Curriculum & version</strong>
        </div>
        <div className="v060-more-list">
          <article className="v060-more-row info">
            <span>
              <small>CURRICULUM</small>
              <strong>96 grammar concepts</strong>
              <p>ES-G1 / G2 / G3を、SELECT / BUILD / REPAIRの能力別に学習・測定します。</p>
            </span>
            <em>G1 · G2 · G3</em>
          </article>

          <article className="v060-more-row info">
            <span>
              <small>VERSION</small>
              <strong>v0.6.5 · Free BUILD Production</strong>
              <p>Standard後半とChallengeを本当の自由入力BUILDへ移行。端末内の保守的判定でCorrect / Almost / Not quiteを返します。</p>
            </span>
            <em>RC prep</em>
          </article>

          {DEBUG_UNLOCK_ALL_DAYS && (
            <article className="v060-more-row debug">
              <span>
                <small>DEBUG MODE</small>
                <strong>All learning routes unlocked</strong>
                <p>実機確認用。保存済み進捗そのものは変更しません。</p>
              </span>
              <em>DEV</em>
            </article>
          )}
        </div>
      </section>
    </main>
  )
}
