import { useEffect, useState } from 'react'
import {
  collectionSnapshot,
  collectionUnseen,
  markCollectionSeen,
  readCollectionUiState,
} from '../core/collection'

export function CustomerBook() {
  const [snapshot] = useState(() => collectionSnapshot(window.localStorage))
  const [initialState] = useState(() => readCollectionUiState(window.localStorage))
  const unseen = collectionUnseen(snapshot, initialState)
  const newCharacters = new Set(unseen.characterIds)
  const newAchievements = new Set(unseen.achievementIds)

  useEffect(() => {
    markCollectionSeen(snapshot, window.localStorage)
  }, [snapshot])

  return (
    <section className="v064-customer-book" aria-labelledby="v064-customer-book-title">
      <div className="v064-book-head">
        <div>
          <span className="v064-collection-kicker">COLLECTION</span>
          <h2 id="v064-customer-book-title">Customer Book</h2>
          <p>出会ったCustomerを記録。正答率ではなく、プレイした経験そのものがCollectionになります。</p>
        </div>
        <div className="v064-book-count">
          <strong>{snapshot.encounteredCharacters}</strong>
          <span>/ {snapshot.totalCharacters}</span>
        </div>
      </div>

      <div className="v064-book-summary">
        <div>
          <small>CUSTOMERS</small>
          <strong>{snapshot.encounteredCharacters}/{snapshot.totalCharacters}</strong>
        </div>
        <div>
          <small>BADGES</small>
          <strong>{snapshot.earnedAchievementIds.length}/{snapshot.achievements.length}</strong>
        </div>
        <div>
          <small>STORE MASTER</small>
          <strong>{snapshot.storeMasters}/8</strong>
        </div>
      </div>

      <div className="v064-customer-grid">
        {snapshot.characters.map((entry) => {
          const isNew = newCharacters.has(entry.id)
          return (
            <article
              key={entry.id}
              className={`v064-customer-card ${entry.unlocked ? 'unlocked' : 'locked'} ${isNew ? 'new' : ''}`}
            >
              {isNew && <span className="v064-new-ribbon">NEW</span>}
              <div className="v064-book-portrait">
                <img
                  src={`/characters/${entry.id}/neutral.webp`}
                  alt={entry.unlocked ? entry.name : ''}
                  draggable={false}
                />
              </div>

              {entry.unlocked ? (
                <>
                  <strong>{entry.name}</strong>
                  <small>{entry.backgroundJa}</small>
                  <p>{entry.firstMetDay ? `Day ${entry.firstMetDay}` : 'Met'}{entry.firstMetStoreTitle ? ` · ${entry.firstMetStoreTitle}` : ''}</p>
                </>
              ) : (
                <>
                  <strong>???</strong>
                  <small>Not met yet</small>
                  <p>Shiftsを進めて出会おう</p>
                </>
              )}
            </article>
          )
        })}
      </div>

      <details className="v064-collection-details">
        <summary>
          <span>
            <small>BADGES & STORES</small>
            <strong>Collection progress</strong>
          </span>
          <em>{snapshot.earnedAchievementIds.length}/{snapshot.achievements.length} badges</em>
        </summary>

        <div className="v064-badge-grid">
          {snapshot.achievements.map((badge) => (
            <article
              key={badge.id}
              className={`v064-badge-card ${badge.earned ? 'earned' : 'locked'} ${newAchievements.has(badge.id) ? 'new' : ''}`}
            >
              {newAchievements.has(badge.id) && <span className="v064-new-ribbon">NEW</span>}
              <span className="v064-badge-icon" aria-hidden="true">{badge.earned ? badge.icon : '·'}</span>
              <span>
                <strong>{badge.title}</strong>
                <small>{badge.description}</small>
              </span>
            </article>
          ))}
        </div>

        <div className="v064-store-collection">
          <div className="v064-store-collection-head">
            <small>STORE COLLECTION</small>
            <strong>3 paired Shifts = REGULAR · 6 paired Shifts = MASTER</strong>
          </div>

          <div className="v064-store-grid">
            {snapshot.stores.map((store) => {
              const percent = Math.round((store.pairedCompleted / 6) * 100)
              return (
                <article className={`v064-store-card ${store.master ? 'master' : store.regular ? 'regular' : ''}`} key={store.id}>
                  <div className="v064-store-card-head">
                    <span>
                      <small>STORE {store.id}</small>
                      <strong>{store.title}</strong>
                    </span>
                    <em>{store.master ? 'MASTER' : store.regular ? 'REGULAR' : `${store.pairedCompleted}/6`}</em>
                  </div>
                  <div className="v064-store-progress" aria-hidden="true">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                  <p>
                    SELECT {store.selectCompleted}/6 · BUILD {store.buildCompleted}/6 · Paired {store.pairedCompleted}/6
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </details>
    </section>
  )
}
