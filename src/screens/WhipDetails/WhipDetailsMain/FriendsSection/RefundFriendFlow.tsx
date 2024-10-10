import React from 'react';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../../../components/BaseButton';
import { Bold, Heading, Paragraph } from '../../../../components/Typography';
import { useViewLocker } from '../../../../components/ViewLocker';
import { LineSeparator } from '../../../../components/elements/LineSeparator';
import { Section } from '../../../../components/elements/Section';
import { Spacer } from '../../../../components/elements/Spacer';
import { InputText } from '../../../../components/form/InputText';
import { useWhipRefundFriendsMutation } from '../../../../queries/Whip/useWhipRefundFriendsMutation';
import { useWhipContext } from '../../../../states/Whip';
import { IWhipFriend } from '../../../../states/Whip/types';
import { Size } from '../../../../theme/sizes';
import { toCurrency, toCurrencyV2, unmaskedCurrency } from '../../../../utils/masks';

export const RefundFriendFlow = ({
  onCancel,
  onSuccess,
  selectedFriend,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  selectedFriend: IWhipFriend;
}) => {
  const { whip } = useWhipContext();
  const { toggleLocker } = useViewLocker();

  const [amount, setAmount] = React.useState('');
  const [formattedAmount, setFormattedAmount] = React.useState('');

  const whipRefundFriendsMutation = useWhipRefundFriendsMutation({
    onError: () => {
      toggleLocker(false);
      onSuccess();
      Toast.show({
        type: 'error',
        text1: 'Friend refund failed',
        text2: 'The refund could not be created. Please try again.',
      });
    },
    onSuccess: () => {
      toggleLocker(false);
      onSuccess();
      Toast.show({
        type: 'success',
        text1: 'Friend refund created',
        text2: 'The refund has been successfully created.',
      });
    },
  });

  const handleAmount = (value: string) => {
    const masked = toCurrencyV2(value);
    const unmasked = unmaskedCurrency(masked);
    setFormattedAmount(masked);
    setAmount(unmasked);
  };

  const handleConfirmation = React.useCallback(() => {
    toggleLocker(true);
    whipRefundFriendsMutation.mutate([
      {
        fromAccountId: whip?.card.accountId,
        fromUserId: whip?.ownerId,
        toUserId: selectedFriend?.userId,
        whipId: whip?.id,
        amount: Number(amount),
        userDisplayName: selectedFriend?.displayName,
        userEmail: selectedFriend?.email,
        userPhoneNumber: selectedFriend?.phoneNumber,
      },
    ]);
  }, [amount, selectedFriend]);

  console.log(Number(amount), (whip.balance || 0), Number(amount) <= 0)

  return (
    <Section space={Size.xLarge}>
      <Section>
        <Heading>Refund {selectedFriend.displayName}</Heading>
        <LineSeparator />
        <Heading size="small">Participation Breakdown</Heading>
        <Paragraph><Bold>Deposits:</Bold> {toCurrency(selectedFriend.deposits || 0)}</Paragraph>
        <Paragraph><Bold>Refunds:</Bold> {toCurrency(selectedFriend.refunds || 0)}</Paragraph>
        <LineSeparator />
        <Paragraph>How much do you want to refund?</Paragraph>
        <Paragraph size="small">Max available amount to refund: {toCurrency(whip.balance || 0)}</Paragraph>
      </Section>
      <InputText
        value={formattedAmount}
        keyboardType="numbers-and-punctuation"
        onChange={value => handleAmount(value)}
        style={{ fontSize: 24, width: '100%', height: 50 }}
      />
      <Spacer size={Size.x2Small} />
      <Section direction="row">
        <BaseButton
          disabled={
            Number(amount) > (whip.balance || 0) || Number(amount) <= 0
          }
          grow
          onPress={handleConfirmation}
        >
          Confirm
        </BaseButton>
        <BaseButton variant="muted" onPress={onCancel}>
          Cancel
        </BaseButton>
      </Section>
    </Section>
  );
};
