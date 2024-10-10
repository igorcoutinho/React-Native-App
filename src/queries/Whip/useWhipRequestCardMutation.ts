import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

const collection = FirebaseFirestore().collection('Whips');

export const useWhipRequestCardMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({ whipId }: { whipId: string | undefined }) => {
      try {
        await collection.doc(whipId).set(
          {
            card: {
              status: 'PROCESSING',
            },
          },
          { merge: true },
        );
        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipRequestCardMutation',
          error: error,
          message: 'Error captured in whip request card',
        });
      }
    },
    onError,
    onSuccess,
  });
};
