import type { AppView } from '../App'
import { PrimaryNav } from './PrimaryNav'

type TopBarProps = {
  view: AppView
  onChangeView: (view: AppView) => void
}

const detailMeta: Partial<Record<AppView, { parent: AppView; parentLabel: string; label: string }>> = {
  chapter1: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 1 · Convenience Store' },
  chapter2: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 2 · Clothing Store' },
  chapter3: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 3 · Sports / Outdoor' },
  chapter4: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 4 · Electronics' },
  chapter5: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 5 · Restaurant / Café' },
  chapter6: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 6 · Hotel' },
  chapter7: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 7 · Department Store' },
  chapter8: { parent: 'learn', parentLabel: 'Learn', label: 'Chapter 8 · International Flagship' },
  build: { parent: 'learn', parentLabel: 'Learn', label: 'Level 2 · BUILD' },
  exam: { parent: 'learn', parentLabel: 'Learn', label: 'Exam Shift: Advanced' },
  repair: { parent: 'learn', parentLabel: 'Learn', label: 'Advanced · REPAIR LAB' },
  flow: { parent: 'learn', parentLabel: 'Learn', label: 'Advanced · FLOW LAB' },
  lab: { parent: 'more', parentLabel: 'More', label: 'Game Lab' },
}

export function TopBar({ view, onChangeView }: TopBarProps) {
  const detail = detailMeta[view]
  return (
    <>
      <header className={`topbar topbar-v041 ${detail ? 'detail' : 'hub'}`}>
        <div className="topbar-brand-v041">
          <button className="brand-button" onClick={() => onChangeView('home')} aria-label="Go to Home">
            <span className="brand-mark">ES</span>
            <span><strong>English Shift</strong><small>Customer Service English</small></span>
          </button>
          {detail && (
            <div className="detail-breadcrumb">
              <button onClick={() => onChangeView(detail.parent)}>← {detail.parentLabel}</button>
              <span>{detail.label}</span>
            </div>
          )}
        </div>
        {!detail && <PrimaryNav view={view} onChangeView={onChangeView} placement="desktop" />}
      </header>
      {!detail && <PrimaryNav view={view} onChangeView={onChangeView} placement="mobile" />}
    </>
  )
}
