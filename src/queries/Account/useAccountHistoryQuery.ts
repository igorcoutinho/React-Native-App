import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { IWhipEventData } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const AccountHistoryQueryKey = 'AccountHistoryQuery';

export const useAccountHistoryQuery = ({
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
  const collection = FirebaseFirestore()
    .collection(`Users/${userId}/Events`)
    .orderBy('createdAt', 'desc');
  return useQuery({
    enabled,

    queryFn: async (): Promise<IWhipEventData[]> => {
      const collection = FirebaseFirestore()
        .collection('Events')
        .where(
          FirebaseFirestore.Filter.or(
            FirebaseFirestore.Filter('type', '==', 'ACCOUNT'),
            FirebaseFirestore.Filter('subType', '==', 'ACCOUNT_EVENT')
          )
        )
        .where('data.userId', '==', userId)
        .orderBy('createdAt', 'desc');

      const result = await collection.get();
      const mappedResult = result?.docs?.map(d => ({ ...d.data(), id: d.id }));

      try {
        const subscriber = collection.onSnapshot(document => {
          queryClient.setQueryData(
            [AccountHistoryQueryKey, userId],
            document.docs.map(d => ({ ...d.data(), id: d.id })),
          );
        });
        unsubscribe.current = subscriber;

        return mappedResult as IWhipEventData[];

      } catch (error: Error | any) {

        CustomLogger({
          componentStack: 'useAccountHistoryQuery',
          error: error,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    queryKey: [AccountHistoryQueryKey, userId],
  });
};

export const resetAccountHistoryQuery = (userId: string) =>
  queryClient.resetQueries({ queryKey: [AccountHistoryQueryKey, userId] });
