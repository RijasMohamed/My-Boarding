import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchSchedules = createAsyncThunk('schedules/fetch', async (_, { rejectWithValue }) => {
  try {
    console.log('[REDUX-SCHEDULES] Fetching schedules from API')
    const res = await api.get('/schedules/')
    console.log('[REDUX-SCHEDULES] Received:', res.data)
    return res.data
  } catch (err) {
    console.error('[REDUX-SCHEDULES] Error:', err.response?.data || err.message)
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch schedules')
  }
})

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    addSchedule: (state, action) => {
      state.list.push(action.payload)
    },
    updateSchedule: (state, action) => {
      const idx = state.list.findIndex(s => s.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    removeSchedule: (state, action) => {
      state.list = state.list.filter(s => s.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedules.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.list = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchSchedules.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })
  }
})

export const { addSchedule, updateSchedule, removeSchedule } = scheduleSlice.actions
export default scheduleSlice.reducer
