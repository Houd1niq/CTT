import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { CTTApi } from '@shared/api/api';
import { authReducer } from '@features/auth/model/authSlice';

export const setupApiStore = (reducers: any[] = []) => {
  const store = configureStore({
    reducer: {
      [CTTApi.reducerPath]: CTTApi.reducer,
      authReducer,
      ...reducers.reduce((acc, reducer) => ({
        ...acc,
        [reducer.reducerPath]: reducer.reducer
      }), {})
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(CTTApi.middleware)
  });

  setupListeners(store.dispatch);

  return store;
}; 