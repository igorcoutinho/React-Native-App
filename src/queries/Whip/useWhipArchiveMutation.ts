import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';
import { invalidateWhipPagedListQuery } from './useWhipPagedListQuery';

const collection = FirebaseFirestore().collection('Whips');

export const useWhipArchiveMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (status: boolean) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({ whipId }: { whipId: string }) => {
      try {
        await collection.doc(whipId).set(
          {
            archived: true,
          },
          { merge: true },
        );
        invalidateWhipPagedListQuery();
        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipArchiveMutation',
          error: error,
          message: 'Error captured in useWhipArchiveMutation',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
