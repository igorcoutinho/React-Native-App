import React from 'react';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../../../components/BaseButton';
import { Section } from '../../../../components/elements/Section';
import { Spacer } from '../../../../components/elements/Spacer';
import { Heading, Paragraph } from '../../../../components/Typography';
import { useViewLocker } from '../../../../components/ViewLocker';
import { useWhipRemoveFriendMutation } from '../../../../queries/Whip/useWhipRemoveFriendMutation';
import { IWhipFriend } from '../../../../states/Whip/types';
import { Size } from '../../../../theme/sizes';

export const RemoveFriendFlow = ({
  onCancel,
  onSuccess,
  selectedFriend,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  selectedFriend: IWhipFriend;
}) => {
  const { toggleLocker } = useViewLocker();

  const whipRemoveFriendMutation = useWhipRemoveFriendMutation({
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'An error occurred: ' + error?.message + '. Please try again.',
      });
      toggleLocker(false);
      onSuccess();
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Friend removed successfully',
      });
      toggleLocker(false);
      onSuccess();
    },
  });

  const handleConfirmation = React.useCallback(() => {
    toggleLocker(true);
    whipRemoveFriendMutation.mutate(selectedFriend?.id);
  }, [selectedFriend]);

  return (
    <Section space={Size.xLarge}>
      <Section>
        <Heading>Remove Friend</Heading>
        <Paragraph>
          Are you sure you want to remove
          {'\n'}
          {selectedFriend?.displayName} from the whip?
        </Paragraph>
      </Section>
      <Spacer size={Size.x2Small} />
      <Section direction="row">
        <BaseButton grow variant="danger" onPress={handleConfirmation}>
          Remove
        </BaseButton>
        <BaseButton variant="muted" grow onPress={onCancel}>
          Cancel
        </BaseButton>
      </Section>
    </Section>
  );
};
