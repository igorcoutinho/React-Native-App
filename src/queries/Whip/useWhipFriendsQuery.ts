import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { IWhipFriend } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const WhipFriendsQueryKey = 'WhipFriendsQuery';

export const useWhipFriendsQuery = ({
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
    queryFn: async (): Promise<IWhipFriend[]> => {
      const collection = FirebaseFirestore()
        .collection('Friends')
        .where('whipId', '==', whipId);
      try {
        const subscriber = collection.onSnapshot(document => {
          queryClient.setQueryData(
            [WhipFriendsQueryKey, whipId],
            document?.docs?.map(d => ({ ...d.data(), id: d.id })),
          );
        });
        unsubscribe.current = subscriber;
        const result = await collection.get();
        return result.docs.map(d => ({
          ...d.data(),
          id: d.id,
        })) as IWhipFriend[];
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipFriendsQuery',
          error: error,
          message: 'Error captured in whip friends list',
        });
        throw error;
      }
    },
    queryKey: [WhipFriendsQueryKey, whipId],
  });
};

export const resetWhipFriendsQuery = (whipId: string) =>
  queryClient.resetQueries({ queryKey: [WhipFriendsQueryKey, whipId] });
