import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { IWhipChat } from '../../states/Chat/types';
import { useUser } from '../../states/User';
import { CustomLogger } from '../../utils/CustomLogger';

export function useWhipAddChatMutation({
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
    mutationFn: async (chat: IWhipChat) => {

      try {
        const collection = FirebaseFirestore().collection('Chats');
        await collection.add({
          whipId,
          active: true,
          email: user?.email,
          userId: user?.uid,
          message: chat.message,
          createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
          displayName: user?.displayName
        });

        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipAddChatMutation',
          error: error,
          loggedUser: user,
          message: 'Error captured in add chat ',
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
