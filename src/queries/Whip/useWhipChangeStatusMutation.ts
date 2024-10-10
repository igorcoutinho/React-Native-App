import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';
import { invalidateWhipPagedListQuery } from './useWhipPagedListQuery';

const collection = FirebaseFirestore().collection('Whips');

export const useWhipChangeStatusMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (status: boolean) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({ whipId, status }: { whipId: string | undefined, status: boolean }) => {
      try {
        await collection.doc(whipId).set(
          {
            disabled: status
          },
          { merge: true },
        );
        invalidateWhipPagedListQuery();
        return status;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipChangeStatusMutation',
          error: error,
          message: 'Error captured in whip block card',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
