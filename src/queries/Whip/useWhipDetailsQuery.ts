import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { IWhip } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const WhipDetailsQueryKey = 'WhipDetailsQuery';

export const useWhipDetailsQuery = ({
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
    enabled: !!whipId,
    queryFn: async (): Promise<IWhip> => {
      const collection = FirebaseFirestore().collection('Whips').doc(whipId);
      try {
        const subscriber = collection.onSnapshot(document => {
          queryClient.setQueryData(
            [WhipDetailsQueryKey, whipId],
            {
              ...document?.data(),
              id: document.id,
            } || {},
          );
        });
        unsubscribe.current = subscriber;
        const result = await collection.get();
        return { ...result.data(), id: result.id } as IWhip;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipDetailsQuery',
          error: error,
          message: 'Error captured in get whip details',
        });
        throw error;
      }
    },
    queryKey: [WhipDetailsQueryKey, whipId],
  });
};

export const resetWhipDetailsQuery = (whipId: string) =>
  queryClient.resetQueries({ queryKey: [WhipDetailsQueryKey, whipId] });
