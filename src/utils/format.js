import { normalizeStatus } from './status.js'

export const maskCardNumber = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (!digits) {
    return '••••'
  }
  const firstSix = digits.slice(0, 6)
  const lastFour = digits.slice(-4)
  if (digits.length <= 10) {
    return `${digits}••••`
  }
  return `${firstSix}••••${lastFour}`
}

export const maskCardPreview = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '')
  if (!digits) {
    return '•••• •••• •••• ••••'
  }
  const firstSix = digits.slice(0, 6)
  const lastFour = digits.slice(-4)
  if (digits.length <= 6) {
    return `${firstSix}•••• •••• ••••`
  }
  return `${firstSix}•••• ${lastFour}`
}

export const maskCvv = () => '***'

export const formatExpiry = (month, year) => {
  const mm = String(month ?? '').padStart(2, '0')
  const yyyy = String(year ?? '')
  if (!mm.trim() && !yyyy.trim()) {
    return '--'
  }
  return `${mm} / ${yyyy}`
}

export const formatAmount = (value, currency = 'USD') => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) {
    return '--'
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency}`
  }
}

export const formatNumber = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)

export const statusToneClass = (status) => {
  const normalized = normalizeStatus(status)
  if (normalized === 'success') {
    return 'tone-success'
  }
  if (normalized === 'failed') {
    return 'tone-failed'
  }
  return 'tone-pending'
}
