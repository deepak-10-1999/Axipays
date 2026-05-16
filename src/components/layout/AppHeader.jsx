import { memo } from 'react'
import { ShieldCheck } from 'lucide-react'
import TabNav from './TabNav.jsx'

const tabs = [
  { id: 'checkout', label: 'Checkout' },
  { id: 'dashboard', label: 'Dashboard' },
]

const AppHeader = ({ activeTab, onTabChange }) => (
  <header className="app-header">
    <div className="brand">
      <span className="brand-mark" aria-hidden="true">
        <ShieldCheck className="brand-mark__icon" />
      </span>
      <div>
        <div className="brand-title">AXIPAYS</div>
        <div className="brand-subtitle">Secure payment experiences</div>
      </div>
    </div>
    <TabNav tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
  </header>
)

export default memo(AppHeader)
