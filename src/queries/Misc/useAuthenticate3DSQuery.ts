import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export const Authenticate3DSQueryKey = 'Authenticate3DSQueryKey';

export const useAuthenticate3DSQuery = ({
  enabled = false,
  ticketId,
}: {
  enabled?: boolean;
  ticketId?: string;
} = {}) => {
  return useQuery({
    enabled,
    queryFn: async () => {
      try {

        const result = await FirebaseFirestore()
          .collection('Tickets')
          .doc(ticketId)
          .get();
        return {
          id: result.id,
          ...result.data(),
        } as any;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAuthenticate3DSQuery',
          error: error,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    queryKey: [Authenticate3DSQueryKey, ticketId],
  });
};
