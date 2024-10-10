import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { INotification } from '../../states/Notifications/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const NotificationsQueryKey = 'NotificationsQuery';

export const useNotificationsQuery = ({
  enabled = false,
  userId,
}: {
  enabled?: boolean;
  userId?: string;
} = {}) => {
  const unsubscribe = React.useRef<any>(null);

  React.useEffect(() => {
    return () => {
      unsubscribe?.current?.();
    };
  }, []);

  return useQuery({
    enabled,
    queryFn: async () => {
      const collection = FirebaseFirestore()
        .collection('Notifications')
        .orderBy('createdAt', 'desc')
        .where('toUserId', '==', userId);

      try {
        const subscriber = collection.onSnapshot(document => {
          const filteredDocs = document.docs
            .filter(d => !d.data().deleted)
            .map(d => ({ ...d.data(), id: d.id }));

          queryClient.setQueryData(
            [NotificationsQueryKey, userId],
            filteredDocs,
          );
        });

        unsubscribe.current = subscriber;

        const result = await collection.get();

        const data = result.docs
          .map(d => ({
            ...d.data(),
            id: d.id,
          })) as INotification[];

        return data.filter(d => !d.deleted)
          ;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useNotificationsQuery',
          error: error,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    queryKey: [NotificationsQueryKey, userId],
  });
};
