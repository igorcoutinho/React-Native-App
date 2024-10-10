import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const useWhipVerifyInvitationMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
} = {}) => {
  return useMutation({
    mutationFn: async ({
      hashCode,
      whipId,
      notificationId,
      status,
    }: {
      hashCode: string;
      whipId: string;
      notificationId?: string;
      status?: string;
    }) => {
      try {
        const userIdToken = await FirebaseAuth().currentUser?.getIdToken();

        const collection = FirebaseFirestore().collection('Notifications');
        const notificationRef = collection.doc(notificationId);
        const notificationDoc = await notificationRef.get();
        const existingPayload = notificationDoc.data()?.actionPayload || {};


        const response = await axios.post(
          setAPIUrl('publicPostConfirmInvitation'),
          {
            whipId,
          },
          {
            headers: {
              authorization: userIdToken,
              'whip-hash-code': hashCode,
            },
          },
        );

        if (!response?.data?.success) {
          throw response?.data;
        }

        await collection.doc(notificationId).update(
          {
            read: true,
            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
            actionPayload: {
              ...existingPayload,
              status: status,
            }
          }
        );

        return { data: response?.data, whipId };
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipVerifyInvitationMutation',
          error: error,
          message: 'Error captured in whip verify invitation',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
