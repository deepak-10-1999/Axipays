import { memo, useMemo } from 'react'
import { formatAmount } from '../../utils/format.js'

const chartColors = ['#2563eb', '#7c3aed', '#ec4899', '#14b8a6', '#f97316', '#22c55e']

const ChartGrid = ({ statusCounts, totalTransactions, volumeSeries, currencyTotals }) => {
  const maxVolume = Math.max(...volumeSeries.values, 0)
  const currencySegments = useMemo(() => Object.entries(currencyTotals), [currencyTotals])
  const currencyTotalAmount = currencySegments.reduce((acc, [, value]) => acc + value, 0)
  const donutGradient = currencySegments
    .map(([, value], index) => {
      const start = currencySegments
        .slice(0, index)
        .reduce((acc, [, segmentValue]) => acc + segmentValue, 0)
      const end = start + value
      const startPercent = currencyTotalAmount ? (start / currencyTotalAmount) * 100 : 0
      const endPercent = currencyTotalAmount ? (end / currencyTotalAmount) * 100 : 0
      const color = chartColors[index % chartColors.length]
      return `${color} ${startPercent}% ${endPercent}%`
    })
    .join(', ')

  return (
    <div className="chart-grid">
      <div className="chart-card">
        <div className="chart-header">
          <h2>Status Breakdown</h2>
          <p>Distribution across success, pending, and failed outcomes.</p>
        </div>
        <div className="status-breakdown">
          <div className="status-bar">
            <span
              className="status-bar__segment status-bar__segment--success"
              style={{ width: `${totalTransactions ? (statusCounts.success / totalTransactions) * 100 : 0}%` }}
            ></span>
            <span
              className="status-bar__segment status-bar__segment--pending"
              style={{ width: `${totalTransactions ? (statusCounts.pending / totalTransactions) * 100 : 0}%` }}
            ></span>
            <span
              className="status-bar__segment status-bar__segment--failed"
              style={{ width: `${totalTransactions ? (statusCounts.failed / totalTransactions) * 100 : 0}%` }}
            ></span>
          </div>
          <div className="status-legend">
            <div>
              <span className="legend-dot legend-dot--success"></span>
              Success ({statusCounts.success})
            </div>
            <div>
              <span className="legend-dot legend-dot--pending"></span>
              Pending ({statusCounts.pending})
            </div>
            <div>
              <span className="legend-dot legend-dot--failed"></span>
              Failed ({statusCounts.failed})
            </div>
          </div>
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h2>Volume Over Time</h2>
          <p>Recent transaction values to spot volume trends.</p>
        </div>
        <div className="volume-chart">
          {volumeSeries.values.map((value, index) => (
            <div key={`${volumeSeries.labels[index]}-${index}`} className="volume-bar">
              <div
                className="volume-bar__fill"
                style={{ height: maxVolume ? `${(value / maxVolume) * 100}%` : '0%' }}
              ></div>
              <span>{volumeSeries.labels[index]}</span>
            </div>
          ))}
          {!volumeSeries.values.length && <div className="empty-state">No volume data available.</div>}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h2>Currency Distribution</h2>
          <p>Share of processing volume by currency.</p>
        </div>
        <div className="donut-wrapper">
          <div
            className="donut"
            style={{
              background: currencySegments.length ? `conic-gradient(${donutGradient})` : '#e4e7ec',
            }}
          ></div>
          <div className="donut-legend">
            {currencySegments.length ? (
              currencySegments.map(([currency, value], index) => (
                <div key={currency}>
                  <span
                    className="legend-dot"
                    style={{ background: chartColors[index % chartColors.length] }}
                  ></span>
                  {currency} ({formatAmount(value, currency)})
                </div>
              ))
            ) : (
              <div className="empty-state">No currency data available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ChartGrid)
