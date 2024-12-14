import React, {useEffect} from "react";
import {useNotification} from "./hooks/notification-hooks.ts";
import {useAppSelector} from "../../store/hooks.ts";
import './notification.scss'

export const Notification: React.FC = () => {
  const {setNotification} = useNotification();
  const notification = useAppSelector(state => state.notificationReducer.notification);

  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification) {
    return null
  }

  return (
    <div className={`notification ${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
};
