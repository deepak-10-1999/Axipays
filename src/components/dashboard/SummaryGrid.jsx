import { memo } from 'react'
import { formatAmount, formatNumber } from '../../utils/format.js'

const SummaryGrid = ({ totalTransactions, successVolume, totalVolumeCurrency, successCount, failedAndPending }) => (
  <div className="summary-grid">
    <div className="summary-card">
      <div className="summary-label">Total Transactions</div>
      <div className="summary-value">{formatNumber(totalTransactions)}</div>
    </div>
    <div className="summary-card">
      <div className="summary-label">Total Success Volume</div>
      <div className="summary-value">{formatAmount(successVolume, totalVolumeCurrency)}</div>
    </div>
    <div className="summary-card">
      <div className="summary-label">Total Success Count</div>
      <div className="summary-value">{formatNumber(successCount)}</div>
    </div>
    <div className="summary-card">
      <div className="summary-label">Total Failed + Pending</div>
      <div className="summary-value">{formatNumber(failedAndPending)}</div>
    </div>
  </div>
)

export default memo(SummaryGrid)
