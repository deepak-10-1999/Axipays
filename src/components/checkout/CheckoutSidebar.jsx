import { memo } from 'react'
import { formatAmount } from '../../utils/format.js'

const CheckoutSidebar = ({ formData, orderId }) => (
  <aside className="checkout-sidebar">
    <div className="info-card">
      <div className="info-card__title">Order overview</div>
      <div className="info-list">
        <div>
          <span>Order ID</span>
          <strong>{orderId || 'Generated on submit'}</strong>
        </div>
        <div>
          <span>Amount</span>
          <strong>{formatAmount(formData.amount || 0, formData.currency)}</strong>
        </div>
        <div>
          <span>Currency</span>
          <strong>{formData.currency}</strong>
        </div>
        <div>
          <span>Country</span>
          <strong>{formData.country}</strong>
        </div>
      </div>
    </div>

    <div className="info-card info-card--accent">
      <div className="info-card__title">Security & support</div>
      <ul className="info-list info-list--bullets">
        <li>PCI-compliant card vault with tokenization.</li>
        <li>Real-time fraud monitoring on every attempt.</li>
        <li>24/7 support with instant status updates.</li>
      </ul>
    </div>
  </aside>
)

export default memo(CheckoutSidebar)
