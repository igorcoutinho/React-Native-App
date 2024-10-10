import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { INotification } from '../../states/Notifications/types';
import { CustomLogger } from '../../utils/CustomLogger';

export function useNotificationsDeleteMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (notification: INotification) => void;
} = {}) {
  return useMutation({
    mutationFn: async (notificationId: string): Promise<INotification> => {
      try {
        const collection = FirebaseFirestore().collection('Notifications');
        await collection.doc(notificationId).set(
          {
            deleted: true,
            updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );
        const notification = await FirebaseFirestore().collection('Notifications').doc(notificationId).get();
        return { ...notification.data(), id: notification.id } as INotification;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useNotificationsDeleteMutation',
          error: error,
          message: 'Error captured in ErrorBoundary',
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

