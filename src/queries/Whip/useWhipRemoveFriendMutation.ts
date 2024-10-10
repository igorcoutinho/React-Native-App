import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const useWhipRemoveFriendMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: () => void;
} = {}) => {
  return useMutation({
    mutationFn: async (friendId: string) => {
      try {
        const userIdToken = await FirebaseAuth().currentUser?.getIdToken();
        const response = await axios.post(
          setAPIUrl('whipSendRemoveNotification'),
          {
            friendId,
          },
          {
            headers: {
              authorization: userIdToken,
            },
          },
        );

        const collection = FirebaseFirestore().collection('Friends');
        await collection.doc(friendId).delete();
        if (!response?.data?.success) {
          throw response?.data;
        }
        return response?.data;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipRemoveFriendMutation',
          error: error,
          message: 'Error captured in remove friend',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
