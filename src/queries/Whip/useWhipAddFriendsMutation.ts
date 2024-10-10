import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../states/User';
import { IWhipFriend } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export function useWhipAddFriendsMutation({
  onError,
  onSuccess,
  whipId,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: () => void;
  whipId: string;
}) {
  const { user } = useUser();
  return useMutation({
    mutationFn: async (friends: IWhipFriend[]) => {
      try {
        const collection = FirebaseFirestore().collection('Friends');
        friends.forEach(async friend => {
          const unmasked = friend?.budget
            ? Number(
              (String(friend?.budget || 0) || '')
                .replace('£ ', '')
                .replace(',', ''),
            ).toFixed(2)
            : null;
          await collection.add({
            whipId,
            invitedBy: user?.uid,
            invitedByName: user?.displayName || '',
            invite: 'PENDING',
            createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
            ...friend,
            budget: unmasked,
          });
        });
        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipAddFriendsMutation',
          error: error,
          loggedUser: user,
          message: 'Error captured in add friend',
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
