import { normalizeStatus } from './status.js'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const extractStatus = (value) => {
  const normalized = normalizeStatus(value)
  if (normalized) {
    return normalized
  }
  return null
}

const extractStatusFromText = (text) => {
  const lowered = String(text ?? '').toLowerCase()
  if (lowered.includes('success')) {
    return 'success'
  }
  if (lowered.includes('fail')) {
    return 'failed'
  }
  if (lowered.includes('pending') || lowered.includes('processing')) {
    return 'pending'
  }
  return null
}

const fetchPaymentStatus = async (redirectUrl) => {
  const response = await fetch(redirectUrl, { method: 'GET', redirect: 'follow' })
    const data = await response.json()
    const status = extractStatus(data?.status)
      if (status) {
      return status
    }
}

export const buildYears = (count = 12) => {
  const startYear = new Date().getFullYear()
  return Array.from({ length: count }, (_, index) => `${startYear + index}`)
}

export const buildMonths = () =>
  Array.from({ length: 12 }, (_, index) => `${index + 1}`.padStart(2, '0'))

export const createOrderId = () => {
  const random = Math.floor(100000 + Math.random() * 900000)
  return `order${random}`
}

export const resolveFinalStatus = async (url) => {
  const delays = [0, 3500, 7000]
  for (const delay of delays) {
    if (delay) {
      await wait(delay)
    }
    try {
      const status = await fetchPaymentStatus(url)
      if (status) {
        return status
      }
    } catch {
      if (delay === delays[delays.length - 1]) {
        return 'pending'
      }
    }
  }
  return 'pending'
}
