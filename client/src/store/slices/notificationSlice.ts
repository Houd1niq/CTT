import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type Notification = {
  message: string;
  type: 'success' | 'error';
} | null

interface NotificationState {
  notification: Notification
}

const initialState: NotificationState = {
  notification: null
};

const NotificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationState(state, action: PayloadAction<Notification>) {
      state.notification = action.payload;
    },
  },
});

export const {setNotificationState} = NotificationSlice.actions;
export default NotificationSlice.reducer;
