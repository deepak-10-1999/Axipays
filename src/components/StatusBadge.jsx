import { statusLabel, normalizeStatus } from '../utils/status.js'

const StatusBadge = ({ status }) => {
  const normalized = normalizeStatus(status)
  return (
    <span className={`status-badge status-badge--${normalized}`}>
      {statusLabel(normalized)}
    </span>
  )
}

export default StatusBadge
