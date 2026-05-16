import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { statusLabel, normalizeStatus } from '../utils/status.js'

const STATUS_DESCRIPTION = {
  success: 'Your payment has been confirmed. A receipt is being prepared.',
  failed: 'The payment could not be completed. Please verify your details or try another card.',
  pending: 'The payment is still processing. We will update the status shortly.',
}
const STATUS_ICONS = {
  success: CheckCircle2,
  failed: AlertTriangle,
  pending: Clock,
}

const StatusModal = ({ status, message, onClose, isOpen }) => {
  if (!isOpen) {
    return null
  }

  const normalized = normalizeStatus(status)
  const title = statusLabel(normalized)
  const description = message || STATUS_DESCRIPTION[normalized]
  const StatusIcon = STATUS_ICONS[normalized] ?? Clock

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className={`modal-icon modal-icon--${normalized}`}>
          <StatusIcon className="modal-icon__svg" aria-hidden="true" />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <button type="button" className="button button-primary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default StatusModal
