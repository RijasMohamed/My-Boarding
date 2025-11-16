import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../services/api'

export const fetchMembers = createAsyncThunk('members/fetch', async (_, { rejectWithValue }) => {
  try {
    console.log('[REDUX-MEMBERS] Fetching members from API')
    const res = await api.get('/members/')
    console.log('[REDUX-MEMBERS] Received:', res.data)
    return res.data
  } catch (err) {
    console.error('[REDUX-MEMBERS] Error fetching members:', err.response?.data || err.message)
    return rejectWithValue(err.response?.data?.detail || 'Failed to fetch members')
  }
})

const memberSlice = createSlice({
  name: 'members',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {
    addMember: (state, action) => {
      state.list.push(action.payload)
    },
    updateMember: (state, action) => {
      const idx = state.list.findIndex(m => m.id === action.payload.id)
      if (idx >= 0) state.list[idx] = action.payload
    },
    removeMember: (state, action) => {
      state.list = state.list.filter(m => m.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => { 
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.list = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchMembers.rejected, (state, action) => { 
        state.status = 'failed'
        state.error = action.payload || 'Failed to fetch members'
      })
  }
})

export const { addMember, updateMember, removeMember } = memberSlice.actions
export default memberSlice.reducer
