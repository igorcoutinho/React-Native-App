import { Alert, Linking } from 'react-native';
import { useViewLocker } from '../../components/ViewLocker';
import { useWhipRejectInvitationMutation } from '../../queries/Whip/useWhipRejectInvitationMutation';
import { useWhipVerifyInvitationMutation } from '../../queries/Whip/useWhipVerifyInvitationMutation';
import { INotification } from '../../states/Notifications/types';
import { handleError, handleSuccess } from './useInboxHandlers';
import { decodeNotificationActionData } from './utils';

export const useInviteHandlers = () => {
    const { toggleLocker } = useViewLocker();

    const whipVerifyInvitationMutation = useWhipVerifyInvitationMutation({
        onError: error => {
            toggleLocker(false);
            handleError('error', error);
        },
        onSuccess: (data: any) => {
            toggleLocker(false);
            Linking.openURL(`whipapp://goto/whip/${data.whipId}`);
            setTimeout(() => {
                handleSuccess('success', 'Invite accepted! Welcome.');
            }, 1000);
        },
    });

    const whipRejectInvitationMutation = useWhipRejectInvitationMutation({
        onError: error => {
            toggleLocker(false);
            handleError('error', error);
        },
        onSuccess: () => {
            toggleLocker(false);
            handleSuccess('success', 'Invite Rejected!');
        },
    });

    const initHandler = (notification: INotification) => {
        return {
            acceptInvite: () => {
                const valueDecoded = decodeNotificationActionData(
                    notification?.actionData,
                );
                Alert.alert(
                    'Accept Invitation',
                    'Are you sure you want to accept this whip invite?',
                    [
                        {
                            text: 'Cancel',
                            style: 'destructive',
                        },
                        {
                            text: 'Accept',
                            style: 'default',
                            onPress: () => {
                                toggleLocker(true);
                                whipVerifyInvitationMutation.mutate({
                                    hashCode: valueDecoded,
                                    whipId: notification.actionPayload.whipId,
                                    notificationId: notification.id,
                                    status: 'ACCEPTED',
                                });
                            },
                        },
                    ],
                );
            },
            rejectInvite: () => {
                const valueDecoded = decodeNotificationActionData(
                    notification?.actionData,
                );
                Alert.alert(
                    'Reject Invitation',
                    'Are you sure you want to reject this whip invite?',
                    [
                        {
                            text: 'Cancel',
                            style: 'destructive',
                        },
                        {
                            text: 'Reject',
                            style: 'default',
                            onPress: () =>
                                whipRejectInvitationMutation.mutate({
                                    hashCode: valueDecoded,
                                    whipId: notification.actionPayload.whipId,
                                    notificationId: notification.id,
                                    status: 'REJECTED',
                                }),
                        },
                    ],
                );
            },
        };
    };
    return initHandler;
};
