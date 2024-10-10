import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ScrollableContainer } from '../../../components/MainContainer';
import { Bold, Paragraph } from '../../../components/Typography';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Box, Section } from '../../../components/elements/Section';
import { FormFieldTitle } from '../../../components/form/FormFieldTitle';
import { useUser } from '../../../states/User';
import { useWhipContext } from '../../../states/Whip';
import { Colors } from '../../../theme/colors';
import { Gap } from '../../../theme/sizes';
import { toCurrencyPresentation } from '../../../utils/masks';
const TransferMoneyIllustration =
  require('../../../assets/transferMoneyIllustration.svg').default;

export const feeAmount = (amount: number) => {
  const percentageAddition = amount * 0;
  const fixedAddition = 0;
  const result = amount + percentageAddition + fixedAddition;
  return (amount > 0 ? result - amount : amount).toFixed(2);
};

export const FundsUploadDetails = ({
  howMuchIWantToUpload,
}: {
  howMuchIWantToUpload: number;
}) => {
  const [contentHeight, setContentHeight] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const [scrollEnd, setScrollEnd] = React.useState(true);

  const { whip } = useWhipContext();
  const { user } = useUser();

  const whipBalance = useMemo(() => whip?.balance || 0, []);
  const myPersonalBalance = Number(user?.account?.balance || 0);

  const uploadFeeFixed = user.admin?.fees?.uploadFeeFixed;
  const uploadFeeMultiplier = user.admin?.fees?.uploadFeeMultiplier;
  const subscriptionMonthlyFee = user.admin?.fees?.subscriptionMonthlyFee;

  const haveSubscription = whip.subscription?.type !== undefined;
  const subscriptionType = whip.subscription?.type;
  const subscriptionActive = whip.subscription?.status === 'ACTIVE';
  const subscriptionPending = whip.subscription?.status === 'PENDING';

  console.log(uploadFeeFixed, uploadFeeMultiplier, subscriptionMonthlyFee, subscriptionActive, subscriptionPending, subscriptionType, haveSubscription);

  const haveScroll = contentHeight >= containerHeight;

  if (howMuchIWantToUpload <= 0) {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: Gap.large,
        }}>
        <TransferMoneyIllustration height={120} />
        <Paragraph color={Colors.muted}>
          You haven't input any amount yet
        </Paragraph>
      </View>
    );
  }

  return (
    <>
      <View style={{ height: 1 }}>
        {haveScroll && scrollEnd ? (
          <FontAwesomeIcon color={Colors.muted} icon={faChevronDown} style={{ position: 'absolute', top: containerHeight, right: '50%' }} />
        ) : null}
      </View>
      <ScrollableContainer
        onLayout={(event) => {
          setContainerHeight(event.nativeEvent.layout.height)
        }}
        onContentSizeChange={(width, height) => {
          setContentHeight(height);
        }}
        onScroll={(event) => {
          setScrollEnd(event.nativeEvent.contentOffset.y <= 2);
        }}
      >
        <View
          onLayout={(event) => {
            console.log(event.nativeEvent.layout.height)
            setContentHeight(event.nativeEvent.layout.height);
          }}
        >
          <Section style={{ backgroundColor: 'white', paddingBottom: 10 }}>
            <FormFieldTitle title="Checkout" />
            <Paragraph size="small" color={Colors.muted} style={{ marginTop: -5 }}>
              Funds are transferred from personal balance to Whip.
            </Paragraph>
          </Section>
          <Section>
            <Section direction="row">
              <Paragraph size="small" color={Colors.brandSecondaryDark}>
                <Bold>My personal balance:</Bold>
              </Paragraph>
              <Paragraph size="small" color={Colors.brandSecondary}>
                <Bold>{toCurrencyPresentation(myPersonalBalance)}</Bold>
              </Paragraph>
            </Section>
            {myPersonalBalance <= 0 ? (
              <Paragraph size="small" color={Colors.muted} style={{ marginTop: -5 }}>
                Don't worry! You don't have to leave this screen to add funds to your personal balance. You can do it right here.
              </Paragraph>
            ) : null}
            <Section direction="row">
              <Paragraph size="small" color={Colors.brandDark}>
                <Bold>Whip Balance Now:</Bold>
              </Paragraph>
              <Paragraph size="small" color={Colors.brand}>
                <Bold>{toCurrencyPresentation(whipBalance)}</Bold>
              </Paragraph>
            </Section>
            {howMuchIWantToUpload > 0 ? (
              <>
                <Section direction="row">
                  <Paragraph size="small">
                    <Bold>You are Uploading:</Bold>
                  </Paragraph>
                  <Paragraph size="small">
                    {toCurrencyPresentation(howMuchIWantToUpload.toString())}
                  </Paragraph>
                </Section>
                <Section direction="row">
                  <Paragraph color={Colors.brandDark}>
                    <Bold>Whip Balance After:</Bold>
                  </Paragraph>
                  <Paragraph color={Colors.brand}>
                    <Bold>{toCurrencyPresentation(((whipBalance || 0) + howMuchIWantToUpload).toString())}</Bold>
                  </Paragraph>
                </Section>
                <LineSeparator />
                {(haveSubscription && subscriptionPending) ? (
                  <>
                    <Section>
                      <Paragraph color={Colors.brandSecondary}>
                        Whip Cost only {toCurrencyPresentation(subscriptionMonthlyFee)} <Bold>per month</Bold>.
                      </Paragraph>
                      <Paragraph size="small" color={Colors.mutedDark} style={{ marginTop: -5 }}>
                        Why should I pay for a Whip? Your subscription helps us to keep the Whipapp up and running while we continue to improve our services and develop new features.
                      </Paragraph>
                    </Section>
                    <Box gap={Gap.xSmall}>
                      <Paragraph color={Colors.mutedDark}>
                        Total: <Bold>{toCurrencyPresentation(howMuchIWantToUpload + subscriptionMonthlyFee)}</Bold>
                      </Paragraph>
                      <Paragraph size="small" color={Colors.mutedDark}>
                        (You will pay {toCurrencyPresentation(howMuchIWantToUpload)} + Monthly Fee {toCurrencyPresentation(subscriptionMonthlyFee)})
                      </Paragraph>
                    </Box>
                  </>
                ) : (
                  <Box color={Colors.success} gap={Gap.xSmall}>
                    <Paragraph color={Colors.white}>
                      <Bold>This Whip Monthly Subscription is Active!</Bold>
                    </Paragraph>
                  </Box>
                )}
              </>
            ) : null}
          </Section>
        </View>
      </ScrollableContainer>
    </>
  );
};
