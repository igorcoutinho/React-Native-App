import { faPoundSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import { useWhipContext } from "../../states/Whip";
import { Colors } from "../../theme/colors";
import { toCurrencyV2, unmaskedCurrency } from "../../utils/masks";
import { Paragraph } from "../Typography";
import { Section } from "../elements/Section";
import { FormFieldTitle } from "../form/FormFieldTitle";
import { InputText } from "../form/InputText";

export const WhipFundsAmountInput = ({
  onChange,
}: {
  onChange: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');

  const { me } = useWhipContext();

  const myBudget = Number(me?.budget || 0);
  const myDeposits = Number(me?.deposits || 0);

  const budgetLeft = myBudget - myDeposits;
  const haveBudgetLeft = budgetLeft > 0;

  const handleAmount = (value: string, decimalZeroPadding?: boolean) => {
    const masked = toCurrencyV2(value, true, decimalZeroPadding);
    const unmasked = unmaskedCurrency(masked);
    setFormattedAmount(masked);
    setInputValue(unmasked);
    onChange?.(unmasked);
  };

  useEffect(() => {
    if (haveBudgetLeft) {
      const masked = toCurrencyV2((budgetLeft).toString(), true);
      setInputValue((budgetLeft).toString());
      setFormattedAmount(masked);
    }
  }, [haveBudgetLeft, budgetLeft]);

  const hideInput = myBudget > 0 && myDeposits >= myBudget;

  if (hideInput) {
    return (
      <Section>
        <Paragraph color={Colors.mutedDark}>
          You have reached your budget limit!
        </Paragraph>
      </Section>
    );
  }

  return (
    <Section>
      <Section gap={0}>
        <FormFieldTitle title="How much do you want to add?" />
        <Paragraph size="xSmall">
          {myBudget ? `The Whip Master configured £${budgetLeft} for you to upload` : 'Minimum £2, maximum £1,000'}
        </Paragraph>
      </Section>
      <InputText
        leftAccessory={<FontAwesomeIcon icon={faPoundSign} size={20} />}
        keyboardType="numbers-and-punctuation"
        value={formattedAmount}
        onChange={value => handleAmount(value)}
        style={{ fontSize: 24, width: 220, height: 50 }}
        onBlur={() => handleAmount(inputValue, true)}
      />
    </Section>
  );
};
