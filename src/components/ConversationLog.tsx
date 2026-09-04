import { useEffect, useRef } from 'react'
import { useGameStore, type ConversationMessage } from '../store/gameStore'

function preferredScrollBehavior(): ScrollBehavior {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

type ConversationLogProps = {
  messages?: ConversationMessage[]
  className?: string
}

export function ConversationLog({ messages, className = '' }: ConversationLogProps) {
  const storeConversation = useGameStore((s) => s.conversation)
  const conversation = messages ?? storeConversation
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const log = logRef.current
      if (!log) return
      log.scrollTo({ top: log.scrollHeight, behavior: preferredScrollBehavior() })
    })
    return () => cancelAnimationFrame(frame)
  }, [conversation.length])

  return (
    <div className={`conversation ${className}`.trim()} aria-live="polite" ref={logRef}>
      {conversation.map((message, index) => (
        <div
          className={`bubble ${message.speaker} ${index >= conversation.length - 2 && conversation.length > 1 ? 'bubble-new' : ''}`}
          key={`${index}-${message.text}`}
        >
          <div className="bubble-label">{message.speaker === 'customer' ? 'Customer' : 'You'}</div>
          <div>“{message.text}”</div>
        </div>
      ))}
    </div>
  )
}
