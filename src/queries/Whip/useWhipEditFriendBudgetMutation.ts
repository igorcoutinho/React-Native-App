import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

const collection = FirebaseFirestore().collection('Friends');

export const useWhipEditFriendBudgetMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      friendId,
      budget,
    }: {
      friendId: string;
      budget: number;
    }) => {
      try {
        await FirebaseFirestore().collection('Friends').doc(friendId).set(
          {
            budget,
          },
          { merge: true },
        );
        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipEditFriendBudgetMutation',
          error: error,
          message: 'Error captured in edit friend budget',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
