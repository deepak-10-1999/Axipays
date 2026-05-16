import { memo } from 'react'
import { formatAmount, formatExpiry, maskCardNumber } from '../../utils/format.js'
import StatusBadge from '../StatusBadge.jsx'

const TransactionTable = ({
  transactions,
  loading,
  error,
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}) => (
  <div className="table-card">
    <div className="table-header">
      <div>
        <h2>Transaction History</h2>
        <p>Review every transaction with masked payment details.</p>
      </div>
      <div className="table-controls">
        <label>
          Rows per page
          <select value={limit} onChange={(event) => onLimitChange(Number(event.target.value))}>
            {[10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>

    {error && <div className="alert alert-error">{error}</div>}
    {loading && <div className="alert alert-info">Loading transactions...</div>}

    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Card Number</th>
            <th>Email</th>
            <th>Expiry</th>
            <th>Card CVC</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item, index) => (
            <tr key={`${item.orderId}-${index}`}>
              <td>{item.orderId}</td>
              <td>{maskCardNumber(item.cardNumber)}</td>
              <td>{item.email}</td>
              <td>{formatExpiry(item.expiryMonth, item.expiryYear)}</td>
              <td>***</td>
              <td>{formatAmount(item.amount, item.currency)}</td>
              <td>{item.currency}</td>
              <td>
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
          {!transactions.length && !loading && (
            <tr>
              <td colSpan="8" className="empty-state">
                No transactions available yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <div className="table-footer">
      <button
        type="button"
        className="button button-ghost"
        disabled={page === 1 || loading}
        onClick={() => onPageChange(Math.max(page - 1, 1))}
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="button button-ghost"
        disabled={page >= totalPages || loading}
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
      >
        Next
      </button>
    </div>
  </div>
)

export default memo(TransactionTable)
