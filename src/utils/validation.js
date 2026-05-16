export const normalizeDigits = (value, maxLength = 32) =>
  value.replace(/\D/g, '').slice(0, maxLength)

export const luhnCheck = (value) => {
  const digits = value.replace(/\D/g, '')
  if (digits.length < 12) {
    return false
  }

  let sum = 0
  let shouldDouble = false

  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i])
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum % 10 === 0
}

export const isValidEmail = (value) => {
  const trimmed = value.trim()
  return /\S+@\S+\.\S+/.test(trimmed)
}

export const isPositiveAmount = (value) => {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0
}
