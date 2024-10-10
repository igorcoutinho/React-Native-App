import FirebaseFirestore from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { INotification } from '../../states/Notifications/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const NotificationQueryKey = 'NotificationQueryKey';

export const useNotificationQuery = ({
    notificationId,
}: {
    notificationId?: string;
} = {}) => {
    return useQuery({
        enabled: !!notificationId,
        queryFn: async () => {
            try {

                const notificationDoc = await FirebaseFirestore()
                    .collection('Notifications')
                    .doc(notificationId)
                    .get();

                if (notificationDoc.exists) {
                    return {
                        id: notificationDoc.id,
                        ...notificationDoc.data(),
                    } as INotification;
                } else {
                    throw 'Notification not found';
                }
            } catch (error: Error | any) {
                CustomLogger({
                    componentStack: 'useNotificationQuery',
                    error: error,
                    message: 'Error captured in ErrorBoundary',
                });

                throw error;
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
        queryKey: [NotificationQueryKey, notificationId],
    });
};
