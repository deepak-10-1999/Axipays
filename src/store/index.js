import { configureStore } from '@reduxjs/toolkit'
import checkoutReducer from './checkoutSlice.js'
import dashboardReducer from './dashboardSlice.js'
import uiReducer from './uiSlice.js'

const store = configureStore({
  reducer: {
    ui: uiReducer,
    checkout: checkoutReducer,
    dashboard: dashboardReducer,
  },
})

export default store
