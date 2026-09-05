import type { AppView } from '../App'
import { PrimaryNav } from './PrimaryNav'

type TopBarProps = {
  view: AppView
  onChangeView: (view: AppView) => void
}

const detailMeta: Partial<Record<AppView, { parent: AppView; parentLabel: string; label: string }>> = {
  chapter1: { parent: 'learn', parentLabel: 'All Shifts', label: 'Convenience Store' },
  chapter2: { parent: 'learn', parentLabel: 'All Shifts', label: 'Clothing Store' },
  chapter3: { parent: 'learn', parentLabel: 'All Shifts', label: 'Sports / Outdoor' },
  chapter4: { parent: 'learn', parentLabel: 'All Shifts', label: 'Electronics Store' },
  chapter5: { parent: 'learn', parentLabel: 'All Shifts', label: 'Restaurant / Café' },
  chapter6: { parent: 'learn', parentLabel: 'All Shifts', label: 'Hotel' },
  chapter7: { parent: 'learn', parentLabel: 'All Shifts', label: 'Department Store' },
  chapter8: { parent: 'learn', parentLabel: 'All Shifts', label: 'International Flagship' },
  build: { parent: 'learn', parentLabel: 'Shifts', label: 'BUILD' },
  exam: { parent: 'learn', parentLabel: 'Shifts', label: 'Exam Shift' },
  repair: { parent: 'mastery', parentLabel: 'Review', label: 'REPAIR LAB' },
  masteryDetails: { parent: 'mastery', parentLabel: 'Review', label: 'Mastery details' },
  flow: { parent: 'more', parentLabel: 'More', label: 'FLOW LAB' },
  lab: { parent: 'more', parentLabel: 'More', label: 'Game Lab' },
}

const hubLabel: Partial<Record<AppView, string>> = {
  home: 'Today',
  learn: 'Shifts',
  mastery: 'Review',
  more: 'More',
}

export function TopBar({ view, onChangeView }: TopBarProps) {
  const detail = detailMeta[view]
  return (
    <>
      <header className={`v060-topbar ${detail ? 'detail' : 'hub'}`}>
        <div className="v060-topbar-inner">
          <button className="v060-brand" onClick={() => onChangeView('home')} aria-label="Go to Today">
            <span className="v060-brand-mark">ES</span>
            <span>
              <strong>English Shift</strong>
              <small>{detail ? detail.label : hubLabel[view] ?? 'Customer Service English'}</small>
            </span>
          </button>

          {detail ? (
            <button className="v060-context-back" onClick={() => onChangeView(detail.parent)}>
              <span aria-hidden="true">←</span>
              <span>{detail.parentLabel}</span>
            </button>
          ) : (
            <PrimaryNav view={view} onChangeView={onChangeView} placement="desktop" />
          )}
        </div>
      </header>

      {!detail && <PrimaryNav view={view} onChangeView={onChangeView} placement="mobile" />}
    </>
  )
}
