import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchPayments = createAsyncThunk('payments/fetch', async (_, { rejectWithValue }) => {
  try {
    console.log('[REDUX-PAYMENTS] Fetching payments from API')
    const res = await api.get('/payments/')
    console.log('[REDUX-PAYMENTS] Received:', res.data)
    return res.data
  } catch (err) {
    console.error('[REDUX-PAYMENTS] Error:', err.response?.data || err.message)
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch payments')
  }
})

const paymentSlice = createSlice({
  name: 'payments',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    addPayment: (state, action) => {
      state.list.push(action.payload)
    },
    updatePayment: (state, action) => {
      const idx = state.list.findIndex(p => p.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    removePayment: (state, action) => {
      state.list = state.list.filter(p => p.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.list = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchPayments.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export const { addPayment, updatePayment, removePayment } = paymentSlice.actions
export default paymentSlice.reducer
