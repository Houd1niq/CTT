import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AuthState} from "@features/auth/model/types.ts";

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  recoveryEmail: null,
  recoveryToken: null
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    logOut(state) {
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },

    setRecoveryEmail(state, action: PayloadAction<string | null>) {
      state.recoveryEmail = action.payload
    },

    setRecoveryToken(state, action: PayloadAction<string | null>) {
      state.recoveryToken = action.payload
    }
  },
});

export const authReducer = AuthSlice.reducer
export const {setAccessToken, logOut, setRecoveryToken, setRecoveryEmail} = AuthSlice.actions;
