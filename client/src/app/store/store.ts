import {configureStore} from '@reduxjs/toolkit'
import {CTTApi} from "@shared/api/api.ts";
import notificationReducer from "@shared/model/notification/notificationSlice.ts";
import {authReducer} from "@features/auth";
import {searchReducer} from "@features/patentSearch";

export const store = configureStore({
  reducer: {
    [CTTApi.reducerPath]: CTTApi.reducer,
    authReducer,
    searchReducer,
    notificationReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      CTTApi.middleware,
    );
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


