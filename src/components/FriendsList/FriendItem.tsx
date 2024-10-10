import {
  faCopy,
  faCrown,
  faEllipsis,
  faFileInvoiceDollar,
  faMailForward,
  faMoneyBills,
  faUser,
  faUserXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { View } from 'react-native';
import { profileImage } from '../../constants';
import { useWhipContext } from '../../states/Whip';
import {
  IWhipFriend,
  WhipFriendActionType,
  WhipFriendInviteStatus
} from '../../states/Whip/types';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';
import { toCurrency } from '../../utils/masks';
import { getAvatarInitials } from '../../utils/utilities';
import { AvatarImage } from '../AvatarImage';
import { Box } from '../elements/Section';
import { SlideInMenu } from '../SlideInMenu';
import { Bold, Paragraph } from '../Typography';

export const FriendItem = ({
  data,
  onPress,
}: {
  data: IWhipFriend;
  onPress?: (event: { action: WhipFriendActionType; data: any }) => void;
}) => {
  const { whip } = useWhipContext();
  const amount = whip?.balance || 0;
  const name = data.displayName;
  const initials = getAvatarInitials(data.displayName);

  const haveDeposits = data?.deposits > 0;
  const whipHaveAmount = amount > 0;

  const deposits = (data?.deposits || 0) - (data?.refunds || 0);

  let inviteStatusColor: Colors = null;
  let inviteStatusLabel: string = null;

  switch (data.invite) {
    case WhipFriendInviteStatus.CONFIRMED:
      inviteStatusColor = Colors.success;
      inviteStatusLabel = 'Confirmed';
      break;
    case WhipFriendInviteStatus.PENDING:
      inviteStatusColor = Colors.attentionDark;
      inviteStatusLabel = 'Pending';
      break;
    case WhipFriendInviteStatus.REJECTED:
      inviteStatusColor = Colors.dangerDark;
      inviteStatusLabel = 'Rejected';
      break;
    default:

      break;
  }

  const options = [];

  const isOwner = data?.role === 'OWNER';


  const image = data?.userId ? profileImage(data?.userId) : null;


  if (data.invite === WhipFriendInviteStatus.PENDING && !isOwner) {
    options.push({
      label: 'Send Notification',
      onPress: () => onPress?.({ action: WhipFriendActionType.RESEND, data }),
      leftAccessory: (
        <FontAwesomeIcon icon={faMailForward} color={Colors.mutedDark} />
      ),
    });
    options.push({
      label: 'Copy Invite Link',
      onPress: () => onPress?.({ action: WhipFriendActionType.INVITE, data }),
      leftAccessory: <FontAwesomeIcon icon={faCopy} color={Colors.mutedDark} />,
    });
  }
  if (data?.active && !isOwner) {
    options.push({
      label: 'Edit Budget',
      onPress: () => onPress?.({ action: WhipFriendActionType.REQUEST, data }),
      leftAccessory: (
        <FontAwesomeIcon icon={faFileInvoiceDollar} color={Colors.mutedDark} />
      ),
    });
  }
  if (data?.active && haveDeposits && whipHaveAmount) {
    options.push({
      label: `Refund ${isOwner ? 'Me' : 'Friend'}`,
      onPress: () => onPress?.({ action: WhipFriendActionType.REFUND, data }),
      leftAccessory: (
        <FontAwesomeIcon icon={faMoneyBills} color={Colors.mutedDark} />
      ),
    });
  }

  if (__DEV__) {
    options.push({
      label: 'Send Notification',
      onPress: () => onPress?.({ action: WhipFriendActionType.RESEND, data }),
      leftAccessory: (
        <FontAwesomeIcon icon={faMailForward} color={Colors.mutedDark} />
      ),
    });
  }

  if (!isOwner) {
    options.push({
      color: Colors.danger,
      label: 'Remove Friend',
      onPress: () => onPress?.({ action: WhipFriendActionType.REMOVE, data }),
      leftAccessory: <FontAwesomeIcon icon={faUserXmark} color={Colors.danger} />,
    });
  }


  const renderTrigger = () => (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: Colors.greyXLight,
        borderRadius: 12,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        padding: 10,
      }}
    >
      <View
        style={{
          alignItems: 'flex-end',
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: Colors.greyLight,
              borderRadius: 100,
              height: 40,
              justifyContent: 'center',
              marginRight: 10,
              overflow: 'hidden',
              width: 40,
            }}
          >
            {isOwner ? (
              <FontAwesomeIcon
                color={Colors.brand}
                icon={faCrown}
                size={20}
              />
            )
              :
              <AvatarImage
                value={image}
                borderRadius={100}
                useIcon
                icon={faUser}
                iconSize={20}
              />
            }
          </View>
          <Box space={Size.x2Small} grow>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: 5,
              }}
            >
              <Paragraph
                color={Colors.dark}
                size="small"
                style={{ flex: 1 }}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                <Bold>
                  {name}
                  {data.isMe && !isOwner ? ' (me)' : ''}
                  {isOwner ? ' (Master)' : ''}
                </Bold>
              </Paragraph>
            </View>
            {/* {data.email && data.invite !== WhipFriendInviteStatus.PENDING ? (
              <Paragraph size="xSmall" ellipsizeMode="tail" numberOfLines={1}>
                {data.email}
              </Paragraph>
            ) : null} */}
          </Box>
        </View>
      </View>
      {onPress ? (
        <View style={{
          position: 'absolute',
          top: 2,
          right: 8,
        }}>
          <FontAwesomeIcon icon={faEllipsis} color={Colors.mutedDark} />
        </View>
      ) : null}
      {!data?.active ? (
        <View
          style={{
            alignSelf: 'flex-end',
            backgroundColor: inviteStatusColor,
            borderRadius: 12,
            padding: 2,
            paddingHorizontal: 6,
          }}
        >
          <Paragraph color={Colors.white} size="xSmall">
            Invite {inviteStatusLabel}
          </Paragraph>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
            gap: 2,
          }}
        >
          <View
            style={{
              alignSelf: 'flex-end',
              backgroundColor:
                data?.balance || 0 ? Colors.successDark : Colors.mutedDark,
              borderRadius: 12,
              padding: 1,
              paddingHorizontal: 5,
            }}
          >
            <Paragraph color={Colors.white} size="medium">
              <Bold>{toCurrency(deposits || 0)}</Bold>
            </Paragraph>
          </View>
          <Paragraph color={Colors.mutedDark} size="xSmall" style={{ marginRight: 2 }}>
            Net Deposits
            {/* <Paragraph color={Colors.successDark} size="xSmall">
              {' '}
              {Math.ceil(friendParticipation)}% ({toCurrency(deposits || 0)})
            </Paragraph> */}
          </Paragraph>
        </View>
      )}
    </View>
  );

  if (!onPress) {
    return renderTrigger();
  }

  return (
    <SlideInMenu
      triggerTitle={isOwner ? 'Me the Master' : name}
      options={options}
      renderTrigger={renderTrigger()}
    />
  );
};
