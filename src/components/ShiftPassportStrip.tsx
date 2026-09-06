export type PassportStampStatus = 'empty' | 'select' | 'paired'

export type PassportStamp = {
  day: number
  status: PassportStampStatus
}

type Props = {
  storeTitle: string
  stamps: PassportStamp[]
  highlightDay?: number
}

function statusLabel(status: PassportStampStatus) {
  if (status === 'paired') return 'SELECT + BUILD complete'
  if (status === 'select') return 'SELECT complete'
  return 'Not completed yet'
}

export function ShiftPassportStrip({ storeTitle, stamps, highlightDay }: Props) {
  const paired = stamps.filter((stamp) => stamp.status === 'paired').length
  const selected = stamps.filter((stamp) => stamp.status !== 'empty').length
  const mastered = paired === stamps.length && stamps.length > 0

  return (
    <section className={`v061-passport ${mastered ? 'mastered' : ''}`} aria-label={`${storeTitle} Shift Passport`}>
      <div className="v061-passport-head">
        <span>
          <small>{mastered ? 'STORE MASTERED' : 'SHIFT PASSPORT'}</small>
          <strong>{storeTitle}</strong>
        </span>
        <em>{paired}/{stamps.length} paired</em>
      </div>

      <div className="v061-passport-stamps">
        {stamps.map((stamp) => (
          <div
            key={stamp.day}
            className={`v061-passport-stamp ${stamp.status} ${stamp.day === highlightDay ? 'highlight' : ''}`}
            aria-label={`Day ${stamp.day}: ${statusLabel(stamp.status)}`}
          >
            <span>{stamp.status === 'paired' ? '✓' : stamp.status === 'select' ? '◐' : '○'}</span>
            <small>D{stamp.day}</small>
          </div>
        ))}
      </div>

      <div className="v061-passport-legend">
        <span><i className="select" />SELECT</span>
        <span><i className="paired" />SELECT + BUILD</span>
        <strong>{selected}/{stamps.length} shifts started</strong>
      </div>
    </section>
  )
}
