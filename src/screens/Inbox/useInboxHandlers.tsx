import { Alert, Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { useNotificationsDeleteMutation } from '../../queries/Notifications/useNotificationsDeleteMutation';
import { useNotificationsMarkAsReadMutation } from '../../queries/Notifications/useNotificationsMarkAsReadMutation';
import { invalidateWhipPagedListQuery } from '../../queries/Whip/useWhipPagedListQuery';
import { INotification } from '../../states/Notifications/types';

export const handleSuccess = (type: string, message: string, callback?: () => void) => {
    Toast.show({
        type,
        text1: message,
    });
    callback?.();
};

export const handleError = (type: string, error: any, callback?: () => void) => {
    Toast.show({
        type,
        text1: `${type} Failed`,
        text2: error.message,
    });
    callback?.();
};

export const useInboxHandlers = () => {

    const notificationsMarkAsReadMutation = useNotificationsMarkAsReadMutation({
        onError: (error) => () => {
            handleError('error', error);
        },
        onSuccess: () => {
            handleSuccess('success', 'Notification marked as read', () => {
                invalidateWhipPagedListQuery();
            });
        },
    });

    const notificationsDeleteMutation = useNotificationsDeleteMutation({
        onError: (error) => () => {
            handleError('error', error);
        },
        onSuccess: () => {
            handleSuccess('success', 'Notification removed', () => {
                invalidateWhipPagedListQuery();
            });
        },
    });

    const initHandler = (notification: INotification) => {
        return {
            viewNotification: () => {
                Linking.openURL(
                    `${notification?.actionData}?notificationId=${notification?.id}`,
                );
            },
            markNotificationAsRead: () => notificationsMarkAsReadMutation.mutate(notification?.id),
            removeNotification: () => {
                Alert.alert(
                    'Remove Notification',
                    'Are you sure you want to remove this notification?',
                    [
                        {
                            text: 'Cancel',
                            style: 'destructive',
                        },
                        {
                            text: 'Accept',
                            style: 'default',
                            onPress: () => {
                                notificationsDeleteMutation.mutate(notification?.id)
                            },
                        },
                    ],
                );

            }
        };
    }
    return initHandler;
};
