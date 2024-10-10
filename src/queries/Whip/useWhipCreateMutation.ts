import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../states/User';
import { IWhip } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';
import { invalidateWhipPagedListQuery } from './useWhipPagedListQuery';

const collection = FirebaseFirestore().collection('Whips');

export function useWhipCreateMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (newWhip: IWhip) => void;
} = {}) {
  const { user } = useUser();
  const userAccountCreated = !!user?.account?.provider?.accountId;

  return useMutation({
    mutationFn: async ({
      body,
      shouldOptimisticUpdate,
    }: {
      body: IWhip;
      shouldOptimisticUpdate?: boolean;
    }) => {
      try {
        const payload: IWhip = {
          ...body,

          balance: 0,
          deposits: 0,
          refunds: 0,

          createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),

          creatorId: user?.uid,
          creatorName: user?.displayName,

          ownerId: user?.uid,
          ownerName: user?.displayName,

          friends: FirebaseFirestore.FieldValue.arrayUnion(
            user?.email,
          ) as unknown as FirebaseFirestoreTypes.FieldValue[],

          card: {
            status: 'PENDING',
          },

          subscription: {
            status: 'PENDING', // ACTIVE, CANCELLED, PENDING, SUSPENDED
            type: 'MONTHLY', // FREE, MONTHLY, QUARTERLY, YEARLY
            activatedAt: null,
            expiresAt: null,
          },

        };
        const docRef = collection.doc();
        docRef.set(payload);
        const response: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> & {
          isNew?: boolean;
        } = await docRef.get({ source: 'cache' });
        response.isNew = true;
        invalidateWhipPagedListQuery();
        // if (shouldOptimisticUpdate) {
        //   manuallyUpdateWhipPagedListQuery(response);
        // }
        return { ...response.data(), id: response.id } as IWhip;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipCreateMutation',
          error: error,
          loggedUser: user,
          message: 'Error captured in whip create',
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
