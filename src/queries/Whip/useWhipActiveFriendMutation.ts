import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export function useWhipActiveFriendMutation({
  onError,
  onSuccess,
  userId,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (userId?: string) => void;
  userId?: string;
} = {}) {
  return useMutation({
    mutationFn: async (friendId: string) => {
      try {
        const collection = FirebaseFirestore().collection('Friends');
        await collection.doc(friendId).set(
          {
            active: true,
            displayName: FirebaseAuth()?.currentUser?.displayName,
            email: FirebaseAuth()?.currentUser?.email,
            phoneNumber: FirebaseAuth()?.currentUser?.phoneNumber,
            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
            userId,
          },
          { merge: true },
        );
        return userId;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipActiveFriendMutation',
          error: error,
          message: 'Error captured in active friend',
        }); throw error;
      }
    },
    onError,
    onSuccess,
    retry: false,
    throwOnError: false,
  });
}
