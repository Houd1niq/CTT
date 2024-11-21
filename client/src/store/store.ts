import {configureStore} from '@reduxjs/toolkit'
import {CTTApi} from "../services/CTTApi/api.ts";
import authReducer from "./slices/authSlice";
import searchReducer from "./slices/searchSlice";

export const store = configureStore({
  reducer: {
    [CTTApi.reducerPath]: CTTApi.reducer,
    authReducer,
    searchReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      CTTApi.middleware,
    );
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


