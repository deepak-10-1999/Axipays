export const createPaymentHash = async (email, cardNumber) => {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure hashing is unavailable in this browser.')
  }

  const firstSix = cardNumber.slice(0, 6)
  const lastFour = cardNumber.slice(-4)
  const combined = `${firstSix}${lastFour}`
  const reversedCombined = combined.split('').reverse().join('')
  const reversedEmail = email.split('').reverse().join('')
  const message = `${reversedEmail}AXIPAYS${reversedCombined}`.toUpperCase()
  const encoder = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode('AXI2026'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message),
  )
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}
