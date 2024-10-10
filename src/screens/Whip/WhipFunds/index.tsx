import { NavigationProp, useNavigation } from '@react-navigation/native';
import { differenceInMinutes, format } from 'date-fns';
import React, { useEffect } from 'react';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Bold, Paragraph } from '../../../components/Typography';
import { HeaderWithImage } from '../../../components/elements/HeaderWithImage';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Box, Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { SubscriptionFlag } from '../../../components/payment/SubscriptionFlag';
import { WhipFundsAmountInput } from '../../../components/payment/WhipFundsAmountInput';
import { WhipFundsCheckout } from '../../../components/payment/WhipFundsCheckout';
import { ICheckoutData, useWhipFundsCheckout } from '../../../components/payment/useWhipFundsCheckout';
import { useWhipInitiateUpload } from '../../../components/payment/useWhipInitiateUpload';
import { resetWhipUploadsQuery, useWhipUploadsQuery } from '../../../queries/Whip/useWhipUploadsQuery';
import { useWhipContext } from '../../../states/Whip';
import { Colors } from '../../../theme/colors';
import { toCurrencyPresentation } from '../../../utils/masks';

export const WhipFundsV2 = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [desiredAmount, setDesiredAmount] = React.useState(0);

  const whipUploadsQuery = useWhipUploadsQuery();

  const pendingUploads = whipUploadsQuery.data?.map((d: any) => {
    return {
      ...d,
      checkout: d?.checkout as ICheckoutData,
      timeLeft: differenceInMinutes(new Date(), d?.createdAt?.seconds * 1000),
    };
  });

  useEffect(() => {
    return () => {
      resetWhipUploadsQuery();
      setDesiredAmount(0);
    };
  }, []);

  const handleInputChange = (value: string) => {
    setDesiredAmount(Number(value));
  };

  if (whipUploadsQuery.isFetching) {
    return null;
  }

  if (whipUploadsQuery.data?.length > 0) {
    return (
      <>
        <ModalHeader
          onPress={() => {
            navigation.navigate('MyWhips');
          }}
        />
        <MainContainer>
          <Section>
            <Spacer />
            <HeaderWithImage
              title="You have an Upload in progress"
              description="Please wait until the Upload is processed."
            />
            {pendingUploads.map((upload: { id: string, createdAt: any, checkout: ICheckoutData }) => {
              try {
                const getPaymentGatewayFee = (amount: number) => {
                  const percentageAddition = amount * upload?.checkout?.details?.uploadFeeMultiplier;
                  const result = amount + percentageAddition + upload?.checkout?.details?.uploadFeeFixed;
                  return Number((amount > 0 ? result - amount : amount).toFixed(2));
                };
                return (
                  <Box key={upload.id}>
                    <Section>
                      {upload?.checkout?.details?.differenceToPayByPersonalBalance ? (
                        <>
                          <Paragraph size="small" color={Colors.text}>
                            Pay using my Personal Balance: <Bold>{toCurrencyPresentation(upload?.checkout?.details?.differenceToPayByPersonalBalance)}</Bold>
                          </Paragraph>
                        </>
                      ) : null}

                      {upload?.checkout?.details?.differenceToPayByGateway ? (
                        <>
                          <Paragraph size="small" color={Colors.text}>
                            Pay directly (Credit Card): <Bold>{toCurrencyPresentation(upload?.checkout?.details?.differenceToPayByGateway)}</Bold>
                          </Paragraph>
                          <Paragraph size="xSmall" color={Colors.mutedDark}>
                            Transaction Fees ({upload?.checkout?.details?.uploadFeeMultiplier * 100}% + {upload?.checkout?.details?.uploadFeeFixed}0p) + {toCurrencyPresentation(getPaymentGatewayFee(upload?.checkout?.details?.differenceToPayByGateway))}
                          </Paragraph>
                          {upload?.checkout?.details?.uploadFeeDiscount > 0 ? (
                            <Paragraph size="xSmall" color={Colors.mutedDark}>
                              Discount Transaction Fee ({upload?.checkout?.details?.uploadFeeDiscount}%) - {toCurrencyPresentation(getPaymentGatewayFee(upload?.checkout?.details?.differenceToPayByGateway))}
                            </Paragraph>
                          ) : null}
                        </>
                      ) : null}

                      <Paragraph>
                        Total to pay: <Bold>{toCurrencyPresentation(upload?.checkout?.details?.totalToPay)}</Bold>
                      </Paragraph>

                      <Paragraph size="small" color={Colors.text}>
                        Whip will receive: <Bold>{toCurrencyPresentation(upload?.checkout?.details?.whipWillReceive)}</Bold>
                      </Paragraph>
                      <Paragraph color={Colors.mutedDark} size="xSmall">
                        Created at: {upload?.createdAt?.seconds
                          ? format(upload?.createdAt?.seconds * 1000, 'MMM dd, yyyy hh:mm a')
                          : ''}
                      </Paragraph>
                    </Section>
                  </Box>
                );
              } catch (error) {
                return null;
              }
            })}
          </Section>
        </MainContainer>
        <FloatingBottom>
          <Section>
            <BaseButton variant="muted" onPress={() => navigation.goBack()}>
              Close
            </BaseButton>
          </Section>
        </FloatingBottom>
      </>
    );
  }

  return (
    <>
      <ModalHeader
        onPress={() => {
          navigation.navigate('MyWhips');
        }}
      />
      <MainContainer>
        <ScreenTitle />
        <SubscriptionFlag />
        <LineSeparator />
        <WhipFundsAmountInput onChange={handleInputChange} />
        <LineSeparator />
        <WhipFundsCheckout howMuchIWantToUpload={desiredAmount} />
      </MainContainer>
      <FloatingBottom>
        <Section>
          <Section direction="row">
            <ConfirmationButton howMuchIWantToUpload={desiredAmount} />
            <BaseButton variant="muted" onPress={() => navigation.goBack()}>
              Cancel
            </BaseButton>
          </Section>
        </Section>
      </FloatingBottom>
    </>
  );
};

const ScreenTitle = () => {
  const { whip } = useWhipContext();
  return (
    <HeaderWithImage
      title={`Add Money to ${whip?.name}`}
      description="Upload funds to spend among your friends."
    />
  );
};

const ConfirmationButton = ({ howMuchIWantToUpload }: { howMuchIWantToUpload: number }) => {
  const checkout = useWhipFundsCheckout(howMuchIWantToUpload);
  const { initiateUpload } = useWhipInitiateUpload(checkout);
  return (
    <BaseButton
      grow
      disabled={howMuchIWantToUpload <= 0}
      onPress={() => initiateUpload()}
    >
      Proceed
    </BaseButton>
  );
};
