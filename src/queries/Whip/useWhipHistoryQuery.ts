import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { IWhipEventData } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const WhipHistoryQueryKey = 'WhipHistoryQuery';

export const useWhipHistoryQuery = ({
  enabled = false,
  whipId,
}: {
  enabled?: boolean;
  whipId?: string;
} = {}) => {
  const unsubscribe = React.useRef<any>(null);
  React.useEffect(() => {
    return () => {
      unsubscribe?.current?.();
    };
  }, []);

  return useQuery({
    enabled,
    queryFn: async (): Promise<IWhipEventData[]> => {
      const collection = FirebaseFirestore()
        .collection('Events')
        .where(
          FirebaseFirestore.Filter.or(
            FirebaseFirestore.Filter('type', '==', 'WHIP'),
            FirebaseFirestore.Filter('subType', '==', 'WHIP_EVENT')
          )
        )
        .where('data.whipId', '==', whipId)
        .orderBy('createdAt', 'desc');

      try {
        const subscriber = collection.onSnapshot(document => {
          queryClient.setQueryData(
            [WhipHistoryQueryKey, whipId],
            document?.docs?.map(d => ({ ...d.data(), id: d.id })),
          );
        });
        unsubscribe.current = subscriber;

        const result = await collection.get();
        const mappedResult = result?.docs?.map(d => ({ ...d.data(), id: d.id }));

        return mappedResult as IWhipEventData[];
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipHistoryQuery',
          error: error,
          message: 'Error captured in whip history',
        });
        throw error;
      }
    },
    queryKey: [WhipHistoryQueryKey, whipId],
  });
};

export const resetWhipHistoryQuery = (whipId: string) =>
  queryClient.resetQueries({ queryKey: [WhipHistoryQueryKey, whipId] });
