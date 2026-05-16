import { memo } from 'react'

const TabNav = ({ tabs, activeTab, onTabChange }) => (
  <nav className="nav" aria-label="Primary">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
)

export default memo(TabNav)
