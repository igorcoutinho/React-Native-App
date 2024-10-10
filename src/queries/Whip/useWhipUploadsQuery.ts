import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { useUser } from '../../states/User';
import { useWhipContext } from '../../states/Whip';
import { CustomLogger } from '../../utils/CustomLogger';

export const WhipUploadsQueryKey = 'WhipUploadsQuery';

export const useWhipUploadsQuery = ({ } = {}) => {
  const { user } = useUser();
  const { whip } = useWhipContext();
  const unsubscribe = React.useRef<any>(null);

  React.useEffect(() => {
    return () => {
      unsubscribe?.current?.();
    };
  }, []);

  return useQuery({
    enabled: !!whip.id,
    queryFn: async (): Promise<any> => {
      const collection = FirebaseFirestore().collection('Uploads')
        .where(
          FirebaseFirestore.Filter.or(
            FirebaseFirestore.Filter('status', '==', 'PENDING'),
            FirebaseFirestore.Filter('status', '==', 'PROCESSING')
          )
        )
        .where('destination', '==', 'WHIP_ACCOUNT')
        .where('checkout.whipId', '==', whip?.id)
        .where('checkout.userId', '==', user?.uid);
      try {
        const subscriber = collection.onSnapshot(document => {
          queryClient.setQueryData(
            [WhipUploadsQueryKey],
            document?.docs?.map(d => ({ ...d.data(), id: d.id })),
          );
        });
        unsubscribe.current = subscriber;
        const result = await collection.get();
        return result?.docs?.map(d => ({ ...d.data(), id: d.id })) as any;
      } catch (error: Error | any) {
        console.log('useWhipUploadsQuery', error);
        CustomLogger({
          componentStack: 'useWhipUploadsQuery',
          error: error,
          message: 'Error captured in get whip details',
        });
        throw error;
      }
    },
    queryKey: [WhipUploadsQueryKey],
  });
};

export const resetWhipUploadsQuery = () =>
  queryClient.resetQueries({ queryKey: [WhipUploadsQueryKey] });
