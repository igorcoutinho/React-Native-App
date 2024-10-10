import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { IWhip } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';
import { invalidateWhipPagedListQuery } from './useWhipPagedListQuery';

const collection = FirebaseFirestore().collection('Whips');

export function useWhipUpdateMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (newWhip: IWhip) => void;
} = {}) {

  const collection = FirebaseFirestore().collection('Whips');

  return useMutation({
    mutationFn: async ({
      id,
      newWhipName,
    }: {
      id: string;
      newWhipName: string;
    }) => {
      try {

        await collection.doc(id).update(
          {
            name: newWhipName
          }
        )

        const whipSnapshot = await collection.doc(id).get();
        if (!whipSnapshot.exists) {
          throw new Error('Whip not found');
        }
        invalidateWhipPagedListQuery();
        return { whipSnapshot, id: whipSnapshot.id };
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipUpdateMutation',
          error: error,
          message: 'Error captured in whip update',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
    retry: false,
    throwOnError: false,
  });
}
