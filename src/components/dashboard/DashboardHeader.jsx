import { memo } from 'react'
import { formatAmount } from '../../utils/format.js'

const DashboardHeader = ({ successVolume, totalVolumeCurrency, onRefresh, loading }) => (
  <div className="panel-header">
    <div>
      <p className="panel-eyebrow">Insights</p>
      <h1>Transaction Dashboard</h1>
      <p>Monitor your payment activity and review every transaction in detail.</p>
    </div>
    <div className="panel-summary panel-summary--stacked">
      <div>
        <div className="summary-label">Total Volume</div>
        <div className="summary-value">{formatAmount(successVolume, totalVolumeCurrency)}</div>
        <div className="summary-caption">Based on successful transactions.</div>
      </div>
      <button
        type="button"
        className="button button-outline button-small"
        onClick={onRefresh}
        disabled={loading}
      >
        {loading ? 'Refreshing...' : 'Refresh data'}
      </button>
    </div>
  </div>
)

export default memo(DashboardHeader)
