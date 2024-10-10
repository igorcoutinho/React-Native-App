import FirebaseAuth from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const useWhipResendInviteMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({ friendId }: { friendId: string }) => {
      try {
        const userIdToken = await FirebaseAuth().currentUser?.getIdToken();
        const response = await axios.post(
          setAPIUrl('whipResendInviteNotification'),
          {
            friendId,
          },
          {
            headers: {
              authorization: userIdToken,
            },
          },
        );
        if (!response?.data?.success) {
          throw response?.data;
        }
        return response?.data;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipResendInviteMutation',
          error: error,
          message: 'Error captured in whip resend invite',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
