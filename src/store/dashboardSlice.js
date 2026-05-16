import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { normalizeTransaction, parseResponse } from '../utils/transactions.js'

const API_URL = 'https://payment-assignment.onrender.com/transactions'

export const fetchTransactions = createAsyncThunk(
  'dashboard/fetchTransactions',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`)
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        return rejectWithValue(data?.message || 'Unable to load transactions.')
      }
      const parsed = parseResponse(data)
      const normalized = parsed.items.map(normalizeTransaction)
      const total = Number(parsed.totalCount)
      const totalPages = total ? Math.max(1, Math.ceil(total / limit)) : 1
      return { transactions: normalized, totalPages, totalCount: total }
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load transactions.')
    }
  },
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    transactions: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    totalCount: 0,
    loading: false,
    error: '',
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload
    },
    setLimit(state, action) {
      state.limit = action.payload
      state.page = 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false
        state.transactions = action.payload.transactions
        state.totalPages = action.payload.totalPages
        state.totalCount = action.payload.totalCount
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error?.message || 'Unable to load transactions.'
      })
  },
})

export const { setPage, setLimit } = dashboardSlice.actions

export default dashboardSlice.reducer
