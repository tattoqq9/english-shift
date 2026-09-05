import type { AppView } from '../App'

type HubView = 'home' | 'learn' | 'mastery' | 'more'

type PrimaryNavProps = {
  view: AppView
  onChangeView: (view: AppView) => void
  placement: 'desktop' | 'mobile'
}

const items: Array<{ id: HubView; label: string; icon: 'today' | 'shifts' | 'review' | 'more' }> = [
  { id: 'home', label: 'Today', icon: 'today' },
  { id: 'learn', label: 'Shifts', icon: 'shifts' },
  { id: 'mastery', label: 'Review', icon: 'review' },
  { id: 'more', label: 'More', icon: 'more' },
]

function activeHub(view: AppView): HubView {
  if (view === 'learn') return 'learn'
  if (
    view === 'chapter1' || view === 'chapter2' || view === 'chapter3' || view === 'chapter4'
    || view === 'chapter5' || view === 'chapter6' || view === 'chapter7' || view === 'chapter8'
    || view === 'build' || view === 'exam'
  ) return 'learn'
  if (view === 'repair' || view === 'masteryDetails' || view === 'mastery') return 'mastery'
  if (view === 'flow' || view === 'lab' || view === 'more') return 'more'
  return 'home'
}

function NavIcon({ name }: { name: 'today' | 'shifts' | 'review' | 'more' }) {
  if (name === 'today') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 1 0 8.5 8.5A8.5 8.5 0 0 0 12 3.5Zm0 4v5l3.2 2" /></svg>
  }
  if (name === 'shifts') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14v3H5zM5 10.5h14v3H5zM5 15.5h14v3H5z" /></svg>
  }
  if (name === 'review') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 8.5A7 7 0 1 0 19 16M19 8.5V4.7M19 8.5h-3.8M5 15.5v3.8M5 15.5h3.8" /></svg>
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" /></svg>
}

export function PrimaryNav({ view, onChangeView, placement }: PrimaryNavProps) {
  const active = activeHub(view)
  return (
    <nav className={`v060-primary-nav v060-primary-nav-${placement}`} aria-label="Primary navigation">
      {items.map((item) => (
        <button
          key={item.id}
          className={active === item.id ? 'active' : ''}
          onClick={() => onChangeView(item.id)}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <NavIcon name={item.icon} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
