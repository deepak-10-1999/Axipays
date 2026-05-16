import { memo } from 'react'
import { formatAmount } from '../../utils/format.js'

const CheckoutHeader = ({ amount, currency, orderId }) => (
  <div className="panel-header">
    <div>
      <p className="panel-eyebrow">Payments</p>
      <h1>Secure Checkout</h1>
      <p>Provide your payment details to complete the transaction with confidence.</p>
    </div>
    <div className="panel-summary">
      <div className="summary-label">Amount</div>
      <div className="summary-value">{formatAmount(amount || 0, currency)}</div>
      <div className="summary-caption">
        {orderId ? `Order ${orderId}` : 'Order ID is generated when you submit.'}
      </div>
    </div>
  </div>
)

export default memo(CheckoutHeader)
