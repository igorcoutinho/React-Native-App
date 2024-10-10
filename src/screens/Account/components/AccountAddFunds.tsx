import { faPoundSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import React from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Bold, Paragraph } from '../../../components/Typography';
import { useViewLocker } from '../../../components/ViewLocker';
import { HeaderWithImage } from '../../../components/elements/HeaderWithImage';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { FormFieldTitle } from '../../../components/form/FormFieldTitle';
import { InputText } from '../../../components/form/InputText';
import { useWhipPaymentIntentMutation } from '../../../queries/Whip/useWhipPaymentIntentMutation';
import { useUser } from '../../../states/User';
import { Colors } from '../../../theme/colors';
import { Size } from '../../../theme/sizes';
import { toCurrencyPresentation, toCurrencyV2, unmaskedCurrency } from '../../../utils/masks';
import { feeAmount } from '../../WhipDetails/WhipFunds/FundsUploadDetails';
const AddMoneyToMyAccount =
  require('../../../assets/addMoneyToMyAccount.svg').default;

export const AccountAddFunds = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const navigation = useNavigation<NavigationProp<any>>();

  const { toggleLocker } = useViewLocker();

  const [amount, setAmount] = React.useState('');
  const [formattedAmount, setFormattedAmount] = React.useState('');

  const amountAsNumber = Number(amount);

  const { user } = useUser();

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
        openPaymentSheet();
        return;
      }
      Alert.alert('Success', 'Your order is confirmed!');
      toggleLocker(false);
    },
  });

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Operation ${error.code}`, error.message);
      toggleLocker(false);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
      toggleLocker(false);
      navigation.goBack();
    }
  };

  const handleAmount = (value: string) => {
    const masked = toCurrencyV2(value, true);
    const unmasked = unmaskedCurrency(masked);
    setFormattedAmount(masked);
    setAmount(unmasked);
  };

  const disabled = amountAsNumber < 1 || amountAsNumber > 1000;

  return (
    <>
      <ModalHeader />
      <MainContainer>
        <HeaderWithImage
          title="Add Money to my Account"
          renderImage={<AddMoneyToMyAccount height={120} />}
          description="Add money to your Whip Personal Account."
        />
        <LineSeparator />
        <Spacer />
        <Section>
          <Section gap={0}>
            <FormFieldTitle title="How much do you want to add?" />
            <Paragraph size="xSmall">
              Minimum £2, maximum £1,000
            </Paragraph>
          </Section>
          <InputText
            leftAccessory={<FontAwesomeIcon icon={faPoundSign} size={20} />}
            keyboardType="numbers-and-punctuation"
            value={formattedAmount}
            onChange={value => handleAmount(value)}
            style={{ fontSize: 24, width: 220, height: 50 }}
          />
        </Section>

        <Spacer size={Size.large} />

        <LineSeparator />
        <Spacer />
        {amountAsNumber > 0 ? (
          <Section>
            <FormFieldTitle title="Details" />
            <Section direction="row">
              <Paragraph size="small">
                <Bold>You are Uploading:</Bold>
              </Paragraph>
              <Paragraph size="small">
                {toCurrencyPresentation(amount.toString())}
              </Paragraph>
            </Section>
            {amountAsNumber > 0 ? (
              <Section>
                <Section gap={0} style={{ marginTop: -8 }}>
                  {amountAsNumber > 0 ? (
                    <Paragraph size="small" color={Colors.brandSecondary}>
                      • You will pay {toCurrencyPresentation(amountAsNumber.toString())} + <Bold>Promo Upload Fee {toCurrencyPresentation(0)}</Bold>
                    </Paragraph>
                  ) : null}
                </Section>
                <Section direction="row">
                  <Paragraph size="small" align="right" color={Colors.mutedDark}>
                    <Bold>Total:</Bold>
                  </Paragraph>
                  <Paragraph size="small">
                    <Bold>{toCurrencyPresentation((Number(feeAmount(amountAsNumber)) + amountAsNumber).toString())}{'\n'}</Bold>
                  </Paragraph>
                </Section>
              </Section>
            ) : null}
          </Section>
        ) : null}

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
                toggleLocker(true);
                whipPaymentIntentMutation.mutate({
                  accountId: user.account.provider.accountId,
                  userId: user.uid,
                  userPhoneNumber: user.phoneNumber,
                  userEmail: user.email,
                  userDisplayName: user.displayName,
                  transactionDetails: {
                    amount: Number(amount),
                    amountToPayWithMoney: Number(amount),
                  },
                });
              }}
            >
              Pay now
            </BaseButton>
            <BaseButton variant="muted" onPress={() => navigation.goBack()}>
              Close
            </BaseButton>
          </Section>
        </Section>
      </FloatingBottom>
    </>
  );
};
