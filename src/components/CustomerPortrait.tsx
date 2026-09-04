import type { CustomerEmotion, CustomerMotion } from '../core/reactions'

const illustratedCustomers = new Set(['mia', 'daniel', 'grace'])

type CustomerPortraitProps = {
  customerId: string
  customerName: string
  emotion: CustomerEmotion
  motion: CustomerMotion
  reactionTick: number
  variant?: 'header' | 'result'
}

export function CustomerPortrait({
  customerId,
  customerName,
  emotion,
  motion,
  reactionTick,
  variant = 'header',
}: CustomerPortraitProps) {
  const hasPortrait = illustratedCustomers.has(customerId)
  const animationKey = `${customerId}-${emotion}-${motion}-${reactionTick}`

  return (
    <div
      className={`customer-portrait customer-portrait-${variant} motion-${motion}`}
      key={animationKey}
      aria-label={`${customerName}: ${emotion}`}
    >
      {hasPortrait ? (
        <img
          src={`/characters/${customerId}/${emotion}.webp`}
          alt={`${customerName} reacting: ${emotion}`}
          draggable={false}
        />
      ) : (
        <div className="portrait-fallback" aria-hidden="true">{customerName[0]}</div>
      )}
    </div>
  )
}
