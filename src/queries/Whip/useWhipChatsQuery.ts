import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { IWhipChat } from '../../states/Chat/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const WhipChatsQueryKey = 'WhipChatsQuery';

export const useWhipChatsQuery = ({
  whipId,
}: {
  whipId?: string;
} = {}) => {
  const unsubscribe = React.useRef<any>(null);
  React.useEffect(() => {
    return () => {
      unsubscribe?.current?.();
    };
  }, []);

  return useQuery({
    queryFn: async (): Promise<IWhipChat[]> => {
      const collection = FirebaseFirestore()
        .collection('Chats')
        .where('whipId', '==', whipId)
        .orderBy('createdAt', 'asc');

      try {
        const subscriber = collection.onSnapshot(document => {
          queryClient.setQueryData(
            [WhipChatsQueryKey, whipId],
            document?.docs?.map(d => ({ ...d.data(), id: d.id })),
          );
        });
        unsubscribe.current = subscriber;
        const result = await collection.get();
        return result.docs.map(d => ({
          ...d.data(),
          id: d.id,
        })) as IWhipChat[];
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipChatsQuery',
          error: error,
          message: 'Error captured in get whip chat',
        });

        throw error;
      }
    },
    queryKey: [WhipChatsQueryKey, whipId],
  });
};

export const resetWhipChatsQuery = (whipId: string) =>
  queryClient.resetQueries({ queryKey: [WhipChatsQueryKey, whipId] });
