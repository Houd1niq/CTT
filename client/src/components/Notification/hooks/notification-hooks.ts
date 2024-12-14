import {useAppDispatch} from "../../../store/hooks.ts";
import {Notification, setNotificationState} from "../../../store/slices/notificationSlice.ts";

export const useNotification = () => {
  const dispatch = useAppDispatch();
  const setNotification = (notification: Notification) => {
    dispatch(setNotificationState(notification));
  }

  return {
    setNotification
  }
}
