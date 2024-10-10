import React from 'react';
import { Chatlist } from '../../../../components/ChatList';
import { useViewLocker } from '../../../../components/ViewLocker';
import { LineSeparator } from '../../../../components/elements/LineSeparator';
import { SectionHeader } from '../../../../components/elements/Section';
import { useWhipAddChatMutation } from '../../../../queries/Whip/useWhipAddChatMutation';
import { useWhipContext } from '../../../../states/Whip';
import { Gap } from '../../../../theme/sizes';
import { ChatForm, IChatFormData } from './ChatForm';


export const ChatSection = ({ onFinish }: { onFinish?: () => void }) => {
  const { whip, chats, me } = useWhipContext();
  const { toggleLocker } = useViewLocker();

  const whipAddChatMutation = useWhipAddChatMutation({
    whipId: whip?.id,
    onError: () => {
      toggleLocker(false);
    },
    onSuccess: () => {
      toggleLocker(false);
      onFinish?.();
    },
  });

  const handleConfirmation = React.useCallback(
    (chat: IChatFormData) => {
      whipAddChatMutation.mutate(chat as IChatFormData);
    },
    [chats],
  );

  return (
    <>
      <SectionHeader
        title="Conversation"
      />
      <Chatlist
        data={chats}
      />

      <LineSeparator margin={Gap.x2Small} />

      <ChatForm
        onConfirm={formData => {
          handleConfirmation(formData);
        }}
      />
    </>
  );
};
