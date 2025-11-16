import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchRepairs = createAsyncThunk('repairs/fetch', async (_, { rejectWithValue }) => {
  try {
    console.log('[REDUX-REPAIRS] Fetching repairs from API')
    const res = await api.get('/repairs/')
    console.log('[REDUX-REPAIRS] Received:', res.data)
    return res.data
  } catch (err) {
    console.error('[REDUX-REPAIRS] Error:', err.response?.data || err.message)
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch repairs')
  }
})

const repairSlice = createSlice({
  name: 'repairs',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    addRepair: (state, action) => {
      state.list.push(action.payload)
    },
    updateRepair: (state, action) => {
      const idx = state.list.findIndex(r => r.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    removeRepair: (state, action) => {
      state.list = state.list.filter(r => r.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepairs.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchRepairs.fulfilled, (state, action) => {
        state.list = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchRepairs.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export const { addRepair, updateRepair, removeRepair } = repairSlice.actions
export default repairSlice.reducer
