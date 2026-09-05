import type { CustomerEmotion, CustomerMotion } from '../core/reactions'

const illustratedCustomers = new Set(['mia', 'sofia', 'leo', 'oliver', 'aisha', 'noah', 'ken', 'daniel', 'hana', 'grace', 'young-customer'])

function sceneIcon(customerId: string) {
  if (customerId === 'scene-exam') return '📄'
  if (customerId === 'scene-incident') return '🧩'
  if (customerId === 'scene-queue') return '👥'
  return null
}

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
  const icon = sceneIcon(customerId)
  const hasPortrait = illustratedCustomers.has(customerId)
  const animationKey = `${customerId}-${emotion}-${motion}-${reactionTick}`

  return (
    <div
      className={`customer-portrait customer-portrait-${variant} motion-${motion}`}
      key={animationKey}
      aria-label={icon ? customerName : `${customerName}: ${emotion}`}
    >
      {icon ? (
        <div className="portrait-fallback portrait-scene" aria-hidden="true">{icon}</div>
      ) : hasPortrait ? (
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
