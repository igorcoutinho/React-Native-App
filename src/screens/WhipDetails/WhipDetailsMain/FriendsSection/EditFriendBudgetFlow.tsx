import React from 'react';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../../../components/BaseButton';
import { Heading, Paragraph } from '../../../../components/Typography';
import { useViewLocker } from '../../../../components/ViewLocker';
import { Section } from '../../../../components/elements/Section';
import { Spacer } from '../../../../components/elements/Spacer';
import { InputText } from '../../../../components/form/InputText';
import { useWhipEditFriendBudgetMutation } from '../../../../queries/Whip/useWhipEditFriendBudgetMutation';
import { IWhipFriend } from '../../../../states/Whip/types';
import { Size } from '../../../../theme/sizes';
import { toCurrencyV2, unmaskedCurrency } from '../../../../utils/masks';

export const EditFriendBudgetFlow = ({
  onCancel,
  onSuccess,
  selectedFriend,
}: {
  onCancel: () => void;
  onSuccess: () => void;
  selectedFriend: IWhipFriend;
}) => {
  const { toggleLocker } = useViewLocker();

  const [amount, setAmount] = React.useState('');
  const [formattedAmount, setFormattedAmount] = React.useState('');

  const budget = Number(selectedFriend.budget);
  const budgetString = budget > 0 ? budget.toString() : '';

  const whipEditFriendBudgetMutation = useWhipEditFriendBudgetMutation({
    onError: () => {
      toggleLocker(false);
      onSuccess();
      Toast.show({
        type: 'error',
        text1: 'Budget not updated',
        text2: 'The budget could not be updated. Please try again.',
      });
    },
    onSuccess: () => {
      toggleLocker(false);
      onSuccess();
      Toast.show({
        type: 'success',
        text1: 'Budget updated',
        text2: 'The budget has been successfully updated.',
      });
    },
  });

  const handleAmount = (value: string) => {
    const masked = toCurrencyV2(value);
    const unmasked = unmaskedCurrency(masked);
    setFormattedAmount(masked);
    setAmount(unmasked);
  };

  React.useEffect(() => {
    if (budget > 0) {
      setAmount(budgetString);
      const masked = toCurrencyV2(budgetString);
      setFormattedAmount(masked);
    }
  }, [budget]);

  const handleConfirmation = React.useCallback(() => {
    toggleLocker(true);
    whipEditFriendBudgetMutation.mutate({
      friendId: selectedFriend.id,
      budget: amount ? Number(amount) : null,
    });
  }, [amount, selectedFriend]);

  return (
    <Section space={Size.xLarge}>
      <Section>
        <Heading>Edit Budget</Heading>
        <Paragraph>How much do you want to configure?</Paragraph>
        <Paragraph size="small">Leave it empty to remove budget limitation.</Paragraph>
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
