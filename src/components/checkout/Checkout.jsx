import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  initiatePayment,
  setErrors,
  setOrderId,
  setShowIframe,
  setStatusMessage,
  setStatusModal,
  updateField,
} from '../../store/checkoutSlice.js'
import { buildMonths, buildYears, createOrderId, resolveFinalStatus } from '../../utils/payment.js'
import { statusLabel } from '../../utils/status.js'
import { isPositiveAmount, isValidEmail, luhnCheck, normalizeDigits } from '../../utils/validation.js'
import CheckoutForm from './CheckoutForm.jsx'
import CheckoutHeader from './CheckoutHeader.jsx'
import CheckoutSidebar from './CheckoutSidebar.jsx'
import RedirectPanel from './RedirectPanel.jsx'
import StatusModal from '../StatusModal.jsx'

const currencies = ['USD', 'EUR', 'GBP', 'INR', 'AED', 'SGD']
const countries = ['United States', 'United Kingdom', 'India', 'United Arab Emirates', 'Singapore']

const Checkout = () => {
  const dispatch = useDispatch()
  const {
    formData,
    errors,
    isSubmitting,
    apiError,
    redirectUrl,
    showIframe,
    statusModal,
    statusMessage,
    orderId,
  } = useSelector((state) => state.checkout)

  const months = useMemo(() => buildMonths(), [])
  const years = useMemo(() => buildYears(), [])
  const redirectOpened = useRef(false)

  const handleChange = useCallback(
    (field) => (event) => {
      dispatch(updateField({ field, value: event.target.value }))
    },
    [dispatch],
  )

  const handleCardNumberChange = useCallback(
    (event) => {
      const digits = normalizeDigits(event.target.value, 19)
      dispatch(updateField({ field: 'cardNumber', value: digits }))
    },
    [dispatch],
  )

  const handleCvvChange = useCallback(
    (event) => {
      const digits = normalizeDigits(event.target.value, 4)
      dispatch(updateField({ field: 'cvv', value: digits }))
    },
    [dispatch],
  )

  const validateForm = useCallback(() => {
    const nextErrors = {}
    if (!formData.cardHolderName.trim()) {
      nextErrors.cardHolderName = 'Card holder name is required.'
    }
    if (!isValidEmail(formData.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!formData.cardNumber.trim()) {
      nextErrors.cardNumber = 'Card number is required.'
    } else if (!luhnCheck(formData.cardNumber)) {
      nextErrors.cardNumber = 'Card number failed validation.'
    }
    if (!formData.expiryMonth) {
      nextErrors.expiryMonth = 'Select the expiry month.'
    }
    if (!formData.expiryYear) {
      nextErrors.expiryYear = 'Select the expiry year.'
    }
    if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      nextErrors.cvv = 'CVV must be 3 or 4 digits.'
    }
    if (!isPositiveAmount(formData.amount)) {
      nextErrors.amount = 'Enter a valid amount.'
    }
    if (!formData.currency) {
      nextErrors.currency = 'Select a currency.'
    }
    if (!formData.country) {
      nextErrors.country = 'Select a country.'
    }
    if (!formData.address.trim()) {
      nextErrors.address = 'Billing address is required.'
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required.'
    }
    return nextErrors
  }, [formData])

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const nextErrors = validateForm()
      dispatch(setErrors(nextErrors))
      if (Object.keys(nextErrors).length > 0) {
        return
      }
      const nextOrderId = createOrderId()
      dispatch(setOrderId(nextOrderId))
      dispatch(initiatePayment({ formData, orderId: nextOrderId }))
    },
    [dispatch, formData, validateForm],
  )

  useEffect(() => {
    if (!redirectUrl) {
      redirectOpened.current = false
      return
    }
    if (!redirectOpened.current) {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer')
      redirectOpened.current = true
    }
    let isActive = true
    dispatch(
      setStatusMessage(
        orderId ? `Order ${orderId} submitted. Awaiting confirmation.` : 'Awaiting confirmation.',
      ),
    )
    resolveFinalStatus(redirectUrl).then((finalStatus) => {
      if (!isActive) {
        return
      }
      dispatch(
        setStatusModal({
          open: true,
          status: finalStatus,
          message: `Payment status: ${statusLabel(finalStatus)}.`,
        }),
      )
    })
    return () => {
      isActive = false
    }
  }, [dispatch, orderId, redirectUrl])

  return (
    <section className="panel checkout-panel">
      <CheckoutHeader amount={formData.amount} currency={formData.currency} orderId={orderId} />

      <div className="checkout-grid">
        <div className="checkout-main">
          <form className="form" onSubmit={handleSubmit}>
            <CheckoutForm
              formData={formData}
              errors={errors}
              months={months}
              years={years}
              currencies={currencies}
              countries={countries}
              onChange={handleChange}
              onCardNumberChange={handleCardNumberChange}
              onCvvChange={handleCvvChange}
            />

            {apiError && <div className="alert alert-error">{apiError}</div>}
            {statusMessage && <div className="alert alert-info">{statusMessage}</div>}

            <div className="form-actions">
              <button type="submit" className="button button-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Pay Securely'}
              </button>
              <span className="form-note">We never store your CVV. All details are encrypted.</span>
            </div>
          </form>

          {redirectUrl && (
            <RedirectPanel
              redirectUrl={redirectUrl}
              showIframe={showIframe}
              orderId={orderId}
              onOpenWindow={() => window.open(redirectUrl, '_blank', 'noopener,noreferrer')}
              onToggleIframe={() => dispatch(setShowIframe(!showIframe))}
            />
          )}
        </div>

        <CheckoutSidebar formData={formData} orderId={orderId} />
      </div>

      <StatusModal
        status={statusModal.status}
        message={statusModal.message}
        isOpen={statusModal.open}
        onClose={() => dispatch(setStatusModal({ ...statusModal, open: false }))}
      />
    </section>
  )
}

export default Checkout
