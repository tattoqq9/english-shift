import { collectionSnapshot, collectionUnseen, readCollectionUiState } from '../core/collection'

type Props = {
  onOpen: () => void
}

export function CollectionProgressCard({ onOpen }: Props) {
  const snapshot = collectionSnapshot(window.localStorage)
  const uiState = readCollectionUiState(window.localStorage)
  const unseen = collectionUnseen(snapshot, uiState)
  const newCount = unseen.characterIds.length + unseen.achievementIds.length
  const recent = snapshot.characters
    .filter((entry) => entry.unlocked)
    .sort((a, b) => (b.firstMetDay ?? 0) - (a.firstMetDay ?? 0))
    .slice(0, 4)

  return (
    <section className="v064-collection-card" aria-label="Customer collection">
      <div className="v064-collection-card-copy">
        <span className="v064-collection-kicker">
          CUSTOMER BOOK
          {newCount > 0 && <em>{newCount} NEW</em>}
        </span>
        <strong>{snapshot.encounteredCharacters}/{snapshot.totalCharacters} customers met</strong>
        <p>Shiftを進めると、出会ったCustomerとStore Badgeが自然に増えていきます。</p>
        <div className="v064-collection-mini-stats">
          <span><b>{snapshot.earnedAchievementIds.length}</b> badges</span>
          <span><b>{snapshot.storeMasters}</b>/8 masters</span>
          <span><b>{snapshot.pairedDays}</b>/48 paired</span>
        </div>
      </div>

      <div className="v064-collection-card-side">
        <div className="v064-avatar-stack" aria-hidden="true">
          {recent.length ? recent.map((entry) => (
            <img
              key={entry.id}
              src={`/characters/${entry.id}/happy.webp`}
              alt=""
              draggable={false}
            />
          )) : (
            <>
              <span>?</span><span>?</span><span>?</span>
            </>
          )}
        </div>
        <button type="button" onClick={onOpen}>
          Open book <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}
