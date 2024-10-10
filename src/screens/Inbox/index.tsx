import React from 'react';
import { View } from 'react-native';
import { LineSeparator } from '../../components/elements/LineSeparator';
import { MainContainer } from '../../components/MainContainer';
import { Paragraph } from '../../components/Typography';
import { useNotifications } from '../../states/Notifications';
import {
  INotification,
  INotificationActionType,
  NotificationTypesButton
} from '../../states/Notifications/types';
import { WhipFriendInviteStatus } from '../../states/Whip/types';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import InviteFilterButtons from './components';
import { InboxList } from './InboxList';
import { useInboxHandlers } from './useInboxHandlers';
import { useInviteHandlers } from './useInviteHandlers';

export const Inbox = () => {
  const { notifications } = useNotifications();
  const [buttonSelected, setButtonSelect] = React.useState<string>(NotificationTypesButton.Recent);
  const [filteredNotifications, setFilteredNotifications] = React.useState<INotification[]>(notifications);

  const inboxHandlers = useInboxHandlers();
  const inviteHandlers = useInviteHandlers();

  const handleFilterPress = (value: string) => {
    setButtonSelect(value);
  };

  React.useEffect(() => {
    switch (buttonSelected) {
      case NotificationTypesButton.Recent:
        setFilteredNotifications(notifications?.filter(notification => !notification?.read));
        break;
      case NotificationTypesButton.Read:
        setFilteredNotifications(notifications?.filter(notification => notification?.read));
        break;
      default:
        setFilteredNotifications(notifications);
    }
  }, [notifications, buttonSelected]);


  const handleNotificationPress = (event: {
    action: string;
    data?: INotification;
  }) => {

    const { data: notification } = event;

    switch (event.action) {
      case 'view': // default action from Notification
        const { viewNotification } = inboxHandlers(notification);
        viewNotification();
        break;
      case 'hide': // default action from Notification
        const { markNotificationAsRead } = inboxHandlers(notification);
        markNotificationAsRead();
        break;
      case 'remove':
        const { removeNotification } = inboxHandlers(notification);
        removeNotification();
        break;
      case 'accept': // custom action from Invite
        const { acceptInvite } = inviteHandlers(notification);
        acceptInvite();
        break;
      case 'reject': // custom action from Invite
        const { rejectInvite } = inviteHandlers(notification);
        rejectInvite();
        break;
      default:
        break;
    }
  };


  const backgroundColor = (item: INotification) => {

    let inviteStatusColor: Colors = null;

    switch (item?.actionPayload?.status) {
      case WhipFriendInviteStatus.NEW:
        inviteStatusColor = Colors.brand;
        break;
      case WhipFriendInviteStatus.REJECTED:
        inviteStatusColor = Colors.dangerDark;
        break;
      case WhipFriendInviteStatus.ACCEPTED:
        inviteStatusColor = Colors.success;
        break;
      default:
        inviteStatusColor = Colors.grey;
        break;
    }
    return inviteStatusColor;
  }


  return (
    <MainContainer>
      <InviteFilterButtons
        buttons={Object.values(NotificationTypesButton)}
        selectedButton={buttonSelected}
        onPress={handleFilterPress}
      />
      <LineSeparator />

      <InboxList
        listData={filteredNotifications}
        onRenderBody={(item) => {
          if (item.actionType === INotificationActionType.INVITE) {
            return <Paragraph size={FontSize.small}>
              {item?.body}
              {item?.actionPayload?.budget
                ? ` and contribute with £${item?.actionPayload?.budget || 10}.`
                : ''}
            </Paragraph>
          }
          return <Paragraph>{item.body}</Paragraph>
        }}
        onRenderBottomRight={(item) => {
          if (item.actionType === INotificationActionType.INVITE) {
            return (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: backgroundColor(item),
                  borderRadius: 12,
                  padding: 2,
                  paddingHorizontal: 8
                }}
              >
                <Paragraph color={Colors.white} size="small">
                  {item?.actionPayload?.status}
                </Paragraph>
              </View>
            );
          }
          if (
            item.actionType === INotificationActionType.REMOVE && !item.read) {
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: backgroundColor(item),
                borderRadius: 12,
                padding: 2,
                paddingHorizontal: 8
              }}
            >
              <Paragraph color={Colors.white} size="small">
                {item?.actionPayload?.status}
              </Paragraph>
            </View>
          }

          return null;
        }}
        customOptions={(item) => item.actionType === INotificationActionType.INVITE
          && item?.actionPayload?.status === 'NEW'
          ? [{
            label: 'Accept',
            onPress: () => handleNotificationPress({
              action: 'accept',
              data: item
            }),
          }, {
            label: 'Reject',
            onPress: () => handleNotificationPress({
              action: 'reject',
              data: item
            }),
          }] : null}
        onPress={handleNotificationPress}
      />
    </MainContainer>
  );
};
