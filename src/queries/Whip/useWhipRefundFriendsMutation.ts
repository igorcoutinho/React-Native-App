import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export const useWhipRefundFriendsMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async (
      operations: {
        fromAccountId: string;
        fromUserId: string;
        toUserId: string;
        whipId: string;
        amount: number;
        userDisplayName?: string;
        userEmail?: string;
        userPhoneNumber?: string;
      }[],
    ) => {
      try {
        const collection = FirebaseFirestore().collection('Refunds');
        operations.forEach(async operation => {
          await collection.add({
            ...operation,
            status: 'PENDING',
            createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
          });
        });
        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAccountBalanceSyncMutation',
          error: error,
          message: 'Error captured in whip refund friend',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
