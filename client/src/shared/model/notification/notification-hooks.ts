import {useAppDispatch} from "@shared/utils/hooks.ts";
import {Notification, setNotificationState} from "./notificationSlice.ts";

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const setNotification = (notification: Notification) => {
    dispatch(setNotificationState(notification));
  }

  return {
    setNotification
  }
}
