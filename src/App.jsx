import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Checkout from './components/checkout/Checkout.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import AppFooter from './components/layout/AppFooter.jsx'
import AppHeader from './components/layout/AppHeader.jsx'
import { setActiveTab } from './store/uiSlice.js'
import './App.css'

const App = () => {
  const dispatch = useDispatch()
  const activeTab = useSelector((state) => state.ui.activeTab)

  const handleTabChange = useCallback(
    (tabId) => {
      dispatch(setActiveTab(tabId))
    },
    [dispatch],
  )

  return (
    <div className="app">
      <AppHeader activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="app-main">
        {activeTab === 'checkout' ? <Checkout /> : <Dashboard />}
      </main>

      <AppFooter />
    </div>
  )
}

export default App
