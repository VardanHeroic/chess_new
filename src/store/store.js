import { configureStore } from "@reduxjs/toolkit"
import logger from "redux-logger"
import { reducer as matrixReducer } from "./matrixSlice"
import componentActionTrackerMiddleware from "./middleware"

export const store = configureStore({
	reducer: {
		matrixReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: false,
		}).concat([componentActionTrackerMiddleware]),
})
