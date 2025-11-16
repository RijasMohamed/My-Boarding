import { configureStore } from '@reduxjs/toolkit'
import memberReducer from './memberSlice'
import scheduleReducer from './scheduleSlice'
import paymentReducer from './paymentSlice'
import billReducer from './billSlice'
import repairReducer from './repairSlice'

export const store = configureStore({
  reducer: {
    members: memberReducer,
    schedules: scheduleReducer,
    payments: paymentReducer,
    bills: billReducer,
    repairs: repairReducer,
  },
})
