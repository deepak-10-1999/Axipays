import { normalizeStatus } from './status.js'

const getValue = (item, keys, fallback = '') => {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== '') {
      return item[key]
    }
  }
  return fallback
}

export const normalizeTransaction = (item, index) => {
  const status = normalizeStatus(
    getValue(item, ['status', 'payment_status', 'paymentStatus', 'result'], 'pending'),
  )
  return {
    orderId: getValue(item, ['order_id', 'orderId', 'reference', 'id'], `TXN-${index + 1}`),
    cardNumber: getValue(item, ['card_number', 'cardNumber', 'card'], ''),
    email: getValue(item, ['email', 'cardholder_email', 'payer_email'], '--'),
    expiryMonth: getValue(item, ['expiry_month', 'expiryMonth', 'exp_month', 'card_expiry_month'], ''),
    expiryYear: getValue(item, ['expiry_year', 'expiryYear', 'exp_year', 'card_expiry_year'], ''),
    amount: getValue(item, ['amount', 'payment_amount', 'value', 'total'], 0),
    currency: getValue(item, ['currency', 'payment_currency'], 'USD'),
    status,
    createdAt: getValue(item, ['created_at', 'createdAt', 'date', 'timestamp'], ''),
  }
}

export const parseResponse = (data) => {
  if (Array.isArray(data)) {
    return { items: data, totalCount: data.length }
  }
  if (Array.isArray(data?.data)) {
    return { items: data.data, totalCount: data.total ?? data.data.length }
  }
  if (Array.isArray(data?.transactions)) {
    return { items: data.transactions, totalCount: data.total ?? data.transactions.length }
  }
  return { items: [], totalCount: 0 }
}

export const buildStatusCounts = (transactions) =>
  transactions.reduce(
    (acc, item) => {
      acc[normalizeStatus(item.status)] += 1
      return acc
    },
    { success: 0, failed: 0, pending: 0 },
  )

export const buildCurrencyTotals = (transactions) => {
  return transactions.reduce((acc, item) => {
    const currency = item.currency || 'USD'
    const amount = Number(item.amount)
    if (!Number.isFinite(amount)) {
      return acc
    }
    acc[currency] = (acc[currency] || 0) + amount
    return acc
  }, {})
}

export const buildVolumeSeries = (transactions) => {
  if (!transactions.length) {
    return { labels: [], values: [] }
  }
  const sorted = [...transactions].sort((a, b) => {
    const aDate = new Date(a.createdAt || 0).getTime()
    const bDate = new Date(b.createdAt || 0).getTime()
    return aDate - bDate
  })
  const recent = sorted.slice(-7)
  const labels = recent.map((item, index) => {
    const date = new Date(item.createdAt)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    return `#${index + 1}`
  })
  const values = recent.map((item) => Number(item.amount) || 0)
  return { labels, values }
}

export const calculateSuccessVolume = (transactions) =>
  transactions.reduce((acc, item) => {
    if (normalizeStatus(item.status) === 'success') {
      const amount = Number(item.amount)
      return acc + (Number.isFinite(amount) ? amount : 0)
    }
    return acc
  }, 0)
