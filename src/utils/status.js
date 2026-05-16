const STATUS_MAP = {
  success: 'success',
  succeeded: 'success',
  approved: 'success',
  completed: 'success',
  failed: 'failed',
  failure: 'failed',
  declined: 'failed',
  rejected: 'failed',
  pending: 'pending',
  processing: 'pending',
  queued: 'pending',
}

export const normalizeStatus = (value) => {
  const text = String(value ?? '').toLowerCase().trim()
  if (!text) {
    return 'pending'
  }
  if (text.includes('success')) {
    return 'success'
  }
  if (text.includes('fail') || text.includes('declin') || text.includes('reject')) {
    return 'failed'
  }
  if (text.includes('pending') || text.includes('process') || text.includes('queue')) {
    return 'pending'
  }
  return STATUS_MAP[text] ?? 'pending'
}

export const statusLabel = (status) => {
  const normalized = normalizeStatus(status)
  if (normalized === 'success') {
    return 'Success'
  }
  if (normalized === 'failed') {
    return 'Failed'
  }
  return 'Pending'
}
