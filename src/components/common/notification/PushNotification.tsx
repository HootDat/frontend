import { createContext } from 'react';

export type Notification = {
  message: string;
  severity?: 'error' | 'warning' | 'info' | 'success';
};

export type NotificationHandler = (notif: Notification) => void;
const PushNotification = createContext<NotificationHandler>(() => {});

export default PushNotification;
