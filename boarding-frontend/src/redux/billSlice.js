import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchBills = createAsyncThunk('bills/fetch', async (_, { rejectWithValue }) => {
  try {
    console.log('[REDUX-BILLS] Fetching bills from API')
    const res = await api.get('/bills/')
    console.log('[REDUX-BILLS] Received:', res.data)
    return res.data
  } catch (err) {
    console.error('[REDUX-BILLS] Error:', err.response?.data || err.message)
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch bills')
  }
})

const billSlice = createSlice({
  name: 'bills',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    addBill: (state, action) => {
      state.list.push(action.payload)
    },
    updateBill: (state, action) => {
      const idx = state.list.findIndex(b => b.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    removeBill: (state, action) => {
      state.list = state.list.filter(b => b.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.list = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchBills.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export const { addBill, updateBill, removeBill } = billSlice.actions
export default billSlice.reducer
