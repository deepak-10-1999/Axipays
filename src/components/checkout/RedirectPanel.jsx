import { memo } from 'react'

const RedirectPanel = ({ redirectUrl, showIframe, orderId, onOpenWindow, onToggleIframe }) => (
  <div className="redirect-panel">
    <div className="redirect-header">
      <div>
        <h2>Payment Confirmation</h2>
        <p>Use the secure confirmation link below to finalize the payment.</p>
      </div>
      <div className="redirect-actions">
        <button type="button" className="button button-ghost" onClick={onOpenWindow}>
          Open in new tab
        </button>
        <button type="button" className="button button-outline" onClick={onToggleIframe}>
          {showIframe ? 'Hide iframe' : 'Open in iframe'}
        </button>
      </div>
    </div>
    {orderId && <div className="order-pill">Order {orderId}</div>}
    <div className="redirect-url">{redirectUrl}</div>
    {showIframe && (
      <div className="iframe-shell">
        <iframe src={redirectUrl} title="Payment confirmation" loading="lazy" />
      </div>
    )}
  </div>
)

export default memo(RedirectPanel)
