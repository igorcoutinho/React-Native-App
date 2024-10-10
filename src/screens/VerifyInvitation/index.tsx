import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';

import React from 'react';
import { Linking } from 'react-native';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../components/BaseButton';
import { Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { MainContainer } from '../../components/MainContainer';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { queryClient } from '../../queries';
import { NotificationQueryKey, useNotificationQuery } from '../../queries/Notifications/useNotificationQuery';
import { useNotificationsMarkAsReadMutation } from '../../queries/Notifications/useNotificationsMarkAsReadMutation';
import { invalidateWhipPagedListQuery } from '../../queries/Whip/useWhipPagedListQuery';
import { useWhipRejectInvitationMutation } from '../../queries/Whip/useWhipRejectInvitationMutation';
import { useWhipVerifyInvitationMutation } from '../../queries/Whip/useWhipVerifyInvitationMutation';
import { INotification } from '../../states/Notifications/types';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';

const customColors = {
  backgroundColor: Colors.success,
  backgroundColorDark: Colors.success
}

export const VerifyInvitation = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();
  const [notification, setNotification] = React.useState<INotification | null>();
  const [loading, setLoading] = React.useState(true);
  const notificationsMarkAsReadMutation = useNotificationsMarkAsReadMutation();

  const whipVerifyInvitationMutation = useWhipVerifyInvitationMutation({
    onError: error => {
      Toast.show({
        type: 'error',
        text1: 'Invite Failed',
        text2: error.message,
      });
      notificationsMarkAsReadMutation.mutate(route?.params?.notificationId);
    },
    onSuccess: () => {
      invalidateWhipPagedListQuery();
      queryClient.invalidateQueries({ queryKey: [NotificationQueryKey, notification.id] });
      console.log('noti', notification);
      Toast.show({
        type: 'success',
        text1: 'Invite Accepted',
        text2: 'Invite verified! Go ahead and join the Whip!',
      });

    },
  });

  const whipRejectInvitationMutation = useWhipRejectInvitationMutation({
    onError: error => {
      Toast.show({
        type: 'error',
        text1: 'Rejection Failed',
        text2: error.message,
      });
      if (
        error.code === 'FRIEND_NOT_FOUND' ||
        error.code === 'WHIP_NOT_FOUND'
      ) {
        notificationsMarkAsReadMutation.mutate(route?.params?.notificationId);
      }
    },
    onSuccess: () => {
      notificationsMarkAsReadMutation.mutate(route?.params?.notificationId);
      invalidateWhipPagedListQuery();
      navigation.navigate('Inbox');
      Toast.show({
        type: 'success',
        text1: 'Rejection Success',
        text2: 'Invite reject! You rejected the whip invitation!',
      });
    },
  });


  const isLoading = whipVerifyInvitationMutation.isPending;
  const isLoadingReject = whipRejectInvitationMutation.isPending;

  const isVerified = Boolean(whipVerifyInvitationMutation.data?.success);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      whipVerifyInvitationMutation.reset();
      Toast.hide();
    });
    return unsubscribe;
  }, [navigation]);

  const getNotification = useNotificationQuery({ notificationId: route?.params.notificationId });

  React.useEffect(() => {
    if (getNotification.isSuccess) {
      setNotification(getNotification.data);
      setLoading(false);
    }

  }, [getNotification])

  if (loading) {
    return <></>
  }

  return (
    <MainContainer>
      <Spacer size={Size.x2Large} />


      <Section align="center">
        {isVerified || notification?.actionPayload?.status === 'ACCEPTED' &&
          <>
            <Heading>{'Your are in!'}
            </Heading>

            <BaseButton
              alignSelf="stretch"
              onPress={() => {
                if (isVerified || notification?.actionPayload?.status === 'ACCEPTED') {
                  Toast.hide();
                  Linking.openURL(`whipapp://goto/whip/${route?.params?.whipId}`);
                  return;
                }
              }}
            >
              {'Go Check it Out'}
            </BaseButton>
          </>
        }

        {notification?.actionPayload?.status === "REJECTED" &&
          <Section>
            <Heading>You already rejected this whip</Heading>
            <Paragraph>
              Invited by <Bold>{notification?.actionPayload?.invitedBy}</Bold>
            </Paragraph>
          </Section>
        }

        {notification.actionPayload?.status === 'NEW' &&
          <>
            <Section>
              <Heading>{notification?.title}</Heading>
              <Paragraph>
                Invited by <Bold>{notification?.actionPayload?.invitedBy}</Bold>
              </Paragraph>
            </Section>
            <Section direction="row">
              <BaseButton
                variant={'custom'}
                customColors={
                  customColors
                }
                disabled={isLoading || isLoadingReject}
                alignSelf="stretch"
                onPress={() => {
                  whipVerifyInvitationMutation.mutate({
                    hashCode: decodeURIComponent(route?.params?.hashCode),
                    whipId: route?.params?.whipId,
                    notificationId: route?.params?.notificationId,
                    status: 'ACCEPTED'
                  });
                }}
              >
                {'Verify Invite'}
              </BaseButton>

              <BaseButton
                variant={'danger'}
                disabled={isLoading || isLoadingReject}
                alignSelf="stretch"
                onPress={() => {
                  whipRejectInvitationMutation.mutate({
                    hashCode: decodeURIComponent(route?.params?.hashCode),
                    whipId: route?.params?.whipId,
                    notificationId: route?.params?.notificationId,
                    status: 'REJECTED'
                  });
                }}
              >
                {'Reject Invite'}
              </BaseButton>
            </Section>
          </>
        }

      </Section>
    </MainContainer>
  );
};
