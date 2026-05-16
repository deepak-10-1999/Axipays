import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { createPaymentHash } from '../utils/crypto.js'

const API_URL = 'https://payment-assignment.onrender.com/initiate-payment'

const initialForm = {
  cardHolderName: '',
  email: '',
  cardNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  amount: '',
  currency: 'USD',
  country: 'United States',
  address: '',
  phone: '',
}

export const initiatePayment = createAsyncThunk(
  'checkout/initiatePayment',
  async ({ formData, orderId }, { rejectWithValue }) => {
    try {
      const hash = await createPaymentHash(formData.email, formData.cardNumber)
      const payload = {
        orderid: orderId,
        cardHolderName : formData.cardHolderName.trim(),
        email: formData.email.trim(),
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cardCVC : formData.cvv,
        amount: Number(formData.amount),
        currency: formData.currency,
        country: formData.country,
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        cardNumber: formData.cardNumber.trim(),

      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Hash: hash,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        return rejectWithValue(data?.message || 'Payment initiation failed.')
      }

      const redirect = data?.redirect_url || data?.redirect_url
      if (!redirect) {
        return rejectWithValue('Redirection URL missing in response.')
      }

      return { redirectUrl: redirect }
    } catch (error) {
      return rejectWithValue(error.message || 'Payment initiation failed.')
    }
  },
)

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    formData: initialForm,
    errors: {},
    isSubmitting: false,
    apiError: '',
    redirectUrl: '',
    showIframe: false,
    statusModal: { open: false, status: 'pending', message: '' },
    statusMessage: '',
    orderId: '',
  },
  reducers: {
    updateField(state, action) {
      const { field, value } = action.payload
      state.formData[field] = value
      state.apiError = ''
      if (state.errors[field]) {
        delete state.errors[field]
      }
    },
    setErrors(state, action) {
      state.errors = action.payload
    },
    setShowIframe(state, action) {
      state.showIframe = action.payload
    },
    setStatusMessage(state, action) {
      state.statusMessage = action.payload
    },
    setStatusModal(state, action) {
      state.statusModal = action.payload
    },
    setOrderId(state, action) {
      state.orderId = action.payload
    },
    resetRedirect(state) {
      state.redirectUrl = ''
      state.showIframe = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.isSubmitting = true
        state.apiError = ''
        state.statusMessage = 'Initiating secure payment request.'
        state.redirectUrl = ''
        state.showIframe = false
        state.statusModal = { open: false, status: 'pending', message: '' }
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.isSubmitting = false
        state.redirectUrl = action.payload.redirectUrl
        state.statusMessage = 'Redirecting to secure payment confirmation.'
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.isSubmitting = false
        state.apiError = action.payload || action.error?.message || 'Something went wrong.'
      })
  },
})

export const {
  updateField,
  setErrors,
  setShowIframe,
  setStatusMessage,
  setStatusModal,
  setOrderId,
  resetRedirect,
} = checkoutSlice.actions

export default checkoutSlice.reducer
