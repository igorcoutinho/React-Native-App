import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import Toast from 'react-native-toast-message';
import { DialogV2 } from '../../../../components/DialogV2';
import { FriendsList } from '../../../../components/FriendsList';
import { LineSeparator } from '../../../../components/elements/LineSeparator';
import {
  Section,
  SectionHeader,
} from '../../../../components/elements/Section';
import { useWhipResendInviteMutation } from '../../../../queries/Whip/useWhipResendInviteMutation';
import { useWhipContext } from '../../../../states/Whip';
import {
  IWhipFriend,
  WhipFriendActionType,
} from '../../../../states/Whip/types';
import { EditFriendBudgetFlow } from './EditFriendBudgetFlow';
import { InviteFriendFlow } from './InviteFriendFlow';
import { RefundFriendFlow } from './RefundFriendFlow';
import { RemoveFriendFlow } from './RemoveFriendFlow';

export const FriendsSection = () => {
  const { whip, friends, me, isArchived } = useWhipContext();

  const [selectedFriend, setSelectedFriend] = React.useState<IWhipFriend>(null);
  const [action, setAction] = React.useState<WhipFriendActionType>(null);

  const copyInviteLinkToClipboard = React.useCallback((link: string) => {
    Clipboard.setString(link);
  }, []);

  const whipResendInviteMutation = useWhipResendInviteMutation({
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Invite Resend Failed',
        text2: 'Please try again.',
      });
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Invite Sent',
        text2: 'Your friend has been invited to join the Whip!',
      });
    },
  });

  const handleFriendAction = (event: {
    action: WhipFriendActionType;
    data: IWhipFriend;
  }) => {
    if (event.action === WhipFriendActionType.REQUEST) {
      setSelectedFriend(event?.data);
      setAction(event.action);
    }
    if (event.action === WhipFriendActionType.REFUND) {
      setSelectedFriend(event?.data);
      setAction(event.action);
    }
    if (event.action === WhipFriendActionType.REMOVE) {
      setSelectedFriend(event?.data);
      setAction(event.action);
    }
    if (event.action === WhipFriendActionType.RESEND) {
      whipResendInviteMutation.mutate({ friendId: event?.data?.id });
    }
    if (event.action === WhipFriendActionType.INVITE) {
      copyInviteLinkToClipboard(event?.data?.hash?.activationSite);
    }
  };

  return (
    <>
      <LineSeparator />
      <SectionHeader
        title="Friends"
        rightAccessory={
          <Section direction="row" style={{ marginBottom: -4, marginTop: -4 }}>
            {whip?.isOwner && whip.subscriptionActive && !isArchived ? <InviteFriendFlow /> : null}
          </Section>
        }
      />
      <FriendsList
        data={friends
          .filter(
            (f: any) =>
              // f.userId !== me?.userId &&
              // f.email !== me?.email &&
              // f.role !== 'OWNER',
              true,
          )
          .map((f: any) => {
            if (f?.userId === me?.userId) {
              return { ...f, isMe: true };
            }
            return f;
          })}
        onPress={whip?.isOwner && !isArchived ? handleFriendAction : null}
      />
      <DialogV2 visible={!!selectedFriend} autoHeight>
        <>
          {action === WhipFriendActionType.REQUEST ? (
            <EditFriendBudgetFlow
              onCancel={() => setSelectedFriend(null)}
              onSuccess={() => setSelectedFriend(null)}
              selectedFriend={selectedFriend}
            />
          ) : null}
          {action === WhipFriendActionType.REFUND ? (
            <RefundFriendFlow
              onCancel={() => setSelectedFriend(null)}
              onSuccess={() => setSelectedFriend(null)}
              selectedFriend={selectedFriend}
            />
          ) : null}
          {action === WhipFriendActionType.REMOVE ? (
            <RemoveFriendFlow
              onCancel={() => setSelectedFriend(null)}
              onSuccess={() => setSelectedFriend(null)}
              selectedFriend={selectedFriend}
            />
          ) : null}
        </>
      </DialogV2>
    </>
  );
};
