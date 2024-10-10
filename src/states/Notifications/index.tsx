import React, { createContext } from 'react';
import { useNotificationsQuery } from '../../queries/Notifications/useNotificationsQuery';
import { useUser } from '../User';
import { INotification } from './types';

export const NotificationsContext = createContext<{
  isLoading: boolean;
  notifications: INotification[];
  unread: number;
}>({
  isLoading: true,
  notifications: [],
  unread: 0,
});

export function NotificationsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  const notificationsQuery = useNotificationsQuery({
    enabled: !!user?.uid,
    userId: user?.uid,
  });

  const data: INotification[] = notificationsQuery?.data;

  return (
    <NotificationsContext.Provider
      value={{
        isLoading: notificationsQuery?.isLoading,
        notifications: data,
        unread: (data?.filter(n => n.read === false) || []).length,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const context = React.useContext(NotificationsContext);
  return context;
};
