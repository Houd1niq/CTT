import React, {useEffect} from "react";
import {useNotification} from "@shared/model/notification/notification-hooks.ts";
import {useAppSelector} from "@shared/utils/hooks.ts";
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
    <div data-testid="notification" className={`notification ${notification.type}`}>
      <p>{notification.message}</p>
    </div>
  );
};
