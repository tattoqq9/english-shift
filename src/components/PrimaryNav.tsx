import type { AppView } from '../App'

type HubView = 'home' | 'learn' | 'mastery' | 'more'

type PrimaryNavProps = {
  view: AppView
  onChangeView: (view: AppView) => void
  placement: 'desktop' | 'mobile'
}

const items: Array<{ id: HubView; label: string; icon: 'home' | 'book' | 'chart' | 'more' }> = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'learn', label: 'Learn', icon: 'book' },
  { id: 'mastery', label: 'Mastery', icon: 'chart' },
  { id: 'more', label: 'More', icon: 'more' },
]

function activeHub(view: AppView): HubView {
  if (view === 'chapter1' || view === 'chapter2' || view === 'chapter3' || view === 'chapter4' || view === 'chapter5' || view === 'chapter6' || view === 'chapter7' || view === 'chapter8' || view === 'build' || view === 'exam' || view === 'repair' || view === 'flow') return 'learn'
  if (view === 'lab') return 'more'
  if (view === 'mastery') return 'mastery'
  if (view === 'more') return 'more'
  return 'home'
}

function NavIcon({ name }: { name: 'home' | 'book' | 'chart' | 'more' }) {
  if (name === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7v9.2h-5.3v-5.9H8.8v5.9H3.5z" /></svg>
  if (name === 'book') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4.5c3.5-.6 6.1.1 8 1.8v13c-1.9-1.7-4.5-2.4-8-1.8zm16 0c-3.5-.6-6.1.1-8 1.8v13c1.9-1.7 4.5-2.4 8-1.8z" /></svg>
  if (name === 'chart') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9h3v10zm5.5 0V4h3v15zm5.5 0v-7h3v7z" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
}

export function PrimaryNav({ view, onChangeView, placement }: PrimaryNavProps) {
  const active = activeHub(view)
  return (
    <nav className={`primary-nav primary-nav-${placement}`} aria-label="Primary navigation">
      {items.map((item) => (
        <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChangeView(item.id)} aria-current={active === item.id ? 'page' : undefined}>
          <NavIcon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
