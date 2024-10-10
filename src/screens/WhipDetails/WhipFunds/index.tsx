import { faPoundSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  CheckIcon,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import React from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { analytics } from '../../..';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Paragraph } from '../../../components/Typography';
import { useViewLocker } from '../../../components/ViewLocker';
import { HeaderWithImage } from '../../../components/elements/HeaderWithImage';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { FormFieldTitle } from '../../../components/form/FormFieldTitle';
import { InputText } from '../../../components/form/InputText';
import { useWhipPaymentIntentMutation } from '../../../queries/Whip/useWhipPaymentIntentMutation';
import { useWhipPaymentTransferMutation } from '../../../queries/Whip/useWhipPaymentTransferMutation';
import { useUser } from '../../../states/User';
import { useWhipContext } from '../../../states/Whip';
import { IWhipEventData } from '../../../states/Whip/types';
import { Colors } from '../../../theme/colors';
import { toCurrencyV2, toNumericFormat, unmaskedCurrency } from '../../../utils/masks';
import { AddFundsLocked } from './AddFundsLocked';
import { FundsUploadDetails } from './FundsUploadDetails';
const TransferMoneyIllustration =
  require('../../../assets/transferMoneyIllustration.svg').default;

export const WhipFunds = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const navigation = useNavigation<NavigationProp<any>>();

  const [usePersonalBalanceToPay, setUsePersonalBalanceToPay] = React.useState(false);

  const { toggleLocker } = useViewLocker();

  const [amount, setAmount] = React.useState('');
  const [formattedAmount, setFormattedAmount] = React.useState('');

  const amountAsNumber = Number(amount);

  const { whip, me } = useWhipContext();
  const { user } = useUser();

  const budget = Number(me?.budget || 0);
  const deposits = Number(me?.deposits || 0);

  const userBalance = Number(user?.account?.balance || 0);
  const desiredAmount = Number(amount || 0);

  const withBudget = budget > 0;
  const haveBudgetLeft = budget - deposits > 0;
  const budgetLeft = budget - deposits;

  const disabled = withBudget ? amountAsNumber < budgetLeft : amountAsNumber < 1 || amountAsNumber > 1000;

  const willUsePersonalBalance = usePersonalBalanceToPay && userBalance > 0;

  const amountToPayWithMoney = willUsePersonalBalance ? desiredAmount - userBalance > 0 ? desiredAmount - userBalance : 0 : desiredAmount;
  const amountToPayWithPersonalBalance = willUsePersonalBalance ? (desiredAmount - amountToPayWithMoney) % userBalance || userBalance : 0;

  const whipPaymentTransferMutation = useWhipPaymentTransferMutation({
    onError: error => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'An error occurred: ' + error?.message + '. Please try again.',
      });
      toggleLocker(false);
    },
    onSuccess: async data => {
      Alert.alert('Success', 'Your order is confirmed!');
      toggleLocker(false);
      try {
        await analytics().logPurchase({
          value: data?.transactionDetails?.amount,
          currency: 'gbp',
          items: [
            {
              item_id: whip.id,
              item_name: whip.name,
              item_category: 'Whip',
              quantity: 1,
            },
          ],
        });
      } catch (error) { }
      navigation.goBack();
    },
  });

  const whipPaymentIntentMutation = useWhipPaymentIntentMutation({
    onError: error => {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'An error occurred: ' + error?.message + '. Please try again.',
      });
      toggleLocker(false);
    },
    onSuccess: async data => {
      if (data?.client_secret) {
        await initPaymentSheet({
          merchantDisplayName: 'Whipapp',
          paymentIntentClientSecret: data.client_secret,
          allowsDelayedPaymentMethods: true,
          returnURL: 'whipapp://goto/myWhips',
          billingDetailsCollectionConfiguration: {
            name: 'always' as any,
            email: 'always' as any,
            phone: 'always' as any,
            address: 'always' as any,
          },
          defaultBillingDetails: {
            name: user.account.firstName + ' ' + user.account.lastName,
            email: user.account.email,
            phone: user.account.phoneNumber,
            address: {
              city: user.account.address.city,
              line1: user.account.address.addressLine1,
              postalCode: user.account.address.postalCode.replace(/\s/g, ''),
            },
          },
          applePay: {
            merchantCountryCode: 'US',
          },
        });
        openPaymentSheet(data?.transferData);
        return;
      }
      toggleLocker(false);
    },
  });

  const openPaymentSheet = async (transferData: IWhipEventData) => {
    const response = await presentPaymentSheet();
    const { error } = response;
    if (error) {
      Alert.alert(`Operation ${error.code}`, error.message);
      toggleLocker(false);
    } else {
      if (transferData) {
        await whipPaymentTransferMutation.mutate(transferData);
      } else {
        Alert.alert('Success', 'Your order is confirmed!');
        toggleLocker(false);
        try {
          await analytics().logPurchase({
            value: transferData?.transactionDetails?.amount,
            currency: 'gbp',
            items: [
              {
                item_id: whip.id,
                item_name: whip.name,
                item_category: 'Whip',
                quantity: 1,
              },
            ],
          });
        } catch (error) { }
        navigation.goBack();
      }
    }
  };

  const handleAmount = (value: string) => {
    const masked = toCurrencyV2(value, true);
    const unmasked = unmaskedCurrency(masked);
    setFormattedAmount(masked);
    setAmount(unmasked);
  };

  React.useEffect(() => {
    if (budget - deposits > 0) {
      const masked = toCurrencyV2((budget - deposits).toString(), true);
      setAmount((budget - deposits).toString());
      setFormattedAmount(masked);
    }
  }, [budget]);

  const balance = {
    before: `£${toNumericFormat(userBalance)}`,
    after: `£${toNumericFormat(userBalance - desiredAmount < 0 ? 0 : userBalance - desiredAmount) || '0.00'}`,
  };

  if (budget > 0 && deposits >= budget) {
    return <AddFundsLocked />;
  }

  const handlePayments = React.useCallback(async () => {

    toggleLocker(true);

    try {
      await analytics().logBeginCheckout({
        value: desiredAmount,
        currency: 'gbp',
        items: [
          {
            item_id: whip.id,
            item_name: whip.name,
            item_category: 'Whip',
            quantity: 1,
          },
        ],
      });
    } catch (error) { }

    const isTransferOnly = amountToPayWithMoney <= 0 && amountToPayWithPersonalBalance > 0;
    const isTransferAndPayment = amountToPayWithMoney > 0 && amountToPayWithPersonalBalance > 0;
    const isPaymentOnly = amountToPayWithMoney > 0 && amountToPayWithPersonalBalance <= 0;

    const transactionData = {
      accountId: whip.card.accountId,
      whipId: whip.id,
      userId: user.uid,
      userPhoneNumber: user.phoneNumber,
      userEmail: user.email,
      userDisplayName: user.displayName,
      transactionDetails: {
        amount: desiredAmount,
        amountToPayWithMoney,
        amountToPayWithPersonalBalance,
        personalBalanceAccountId: user.account?.provider?.accountId,
      }
    };

    if (isTransferOnly) {
      whipPaymentTransferMutation.mutate(transactionData);
    }

    if (isPaymentOnly || isTransferAndPayment) {
      whipPaymentIntentMutation.mutate(transactionData);
    }

  }, [amountToPayWithMoney, amountToPayWithPersonalBalance]);

  return (
    <>
      <ModalHeader
        onPress={() => {
          navigation.navigate('MyWhips');
        }}
      />
      <MainContainer>
        <HeaderWithImage
          title={`Add Money to ${whip?.name}`}
          renderImage={<TransferMoneyIllustration height={120} />}
          description="Upload funds to spend among your friends."
        />
        <LineSeparator />
        <Spacer />
        <Section>
          <Section gap={0}>
            <FormFieldTitle title="How much do you want to add?" />
            <Paragraph size="xSmall">
              {budget ? `The Whip Master configured £${budget - deposits} for you to upload` : 'Minimum £2, maximum £1,000'}
            </Paragraph>
          </Section>
          <InputText
            leftAccessory={<FontAwesomeIcon icon={faPoundSign} size={20} />}
            keyboardType="numbers-and-punctuation"
            disabled={withBudget && haveBudgetLeft}
            value={formattedAmount}
            onChange={value => handleAmount(value)}
            style={{ fontSize: 24, width: 220, height: 50 }}
          />
          {user.account.balance > 0 ? (
            <Section>
              <Checkbox
                onChange={isSelected => {
                  setUsePersonalBalanceToPay(isSelected);
                }}
                isDisabled={disabled}
                size="sm"
                value={usePersonalBalanceToPay as any}
                alignItems="flex-start"
                aria-label="Use my personal balance"
              >
                <CheckboxIndicator mr="$2" borderColor="orange">
                  <CheckboxIcon
                    as={CheckIcon}
                    color="white"
                    backgroundColor="orange"
                  />
                </CheckboxIndicator>
                <CheckboxLabel size="sm" style={{ marginTop: -2 }} as="">
                  Use my personal balance to pay
                </CheckboxLabel>
              </Checkbox>
              <Paragraph size="small" color={Colors.brand} style={{ marginLeft: 25, marginTop: -8 }}>
                {balance.before} Available {usePersonalBalanceToPay ? `/ After: ${balance.after}` : ''}
              </Paragraph>
            </Section>
          ) : null}
        </Section>

        <Spacer />
        <LineSeparator />
        <Spacer />

        <FundsUploadDetails
          desiredAmount={amountAsNumber}
          amountToPayWithMoney={amountToPayWithMoney}
          amountToPayWithPersonalBalance={amountToPayWithPersonalBalance}
        />

      </MainContainer>
      <FloatingBottom>
        <Section>
          {/* <Box align="center" direction="row" space={Size.x2Small} gap={Gap.xSmall}>
            <FontAwesomeIcon icon={faInfoCircle} color={Colors.brandSecondary} />
            <Paragraph size="small" color={Colors.mutedDark}>
              Hey there! We use <Bold>STRIPE</Bold> to secure your payments.
            </Paragraph>
          </Box> */}
          <Section direction="row">
            <BaseButton
              grow
              disabled={disabled}
              onPress={() => {
                handlePayments();
              }}
            >
              Pay Now
            </BaseButton>
            <BaseButton variant="muted" onPress={() => navigation.goBack()}>
              Back
            </BaseButton>
          </Section>
        </Section>
      </FloatingBottom>
    </>
  );
};
