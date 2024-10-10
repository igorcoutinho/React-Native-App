import { faChevronDown, faSquareMinus, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { ScrollableContainer } from '../../components/MainContainer';
import { Bold, Paragraph } from '../../components/Typography';
import { Section } from '../../components/elements/Section';
import { useWhipContext } from '../../states/Whip';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';
import { toCurrencyPresentation } from '../../utils/masks';
import { LineSeparator } from '../elements/LineSeparator';
import { FormFieldTitle } from '../form/FormFieldTitle';
import { useWhipFundsCheckout } from './useWhipFundsCheckout';
const TransferMoneyIllustration =
  require('../../assets/transferMoneyIllustration.svg').default;

export const WhipFundsCheckout = ({
  howMuchIWantToUpload,
}: {
  howMuchIWantToUpload: number;
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(true);

  const [collapsible, setCollapsible] = useState({
    subscription: true,
    personalBalance: true,
    payByGateway: true,
  });

  const haveScroll = contentHeight >= containerHeight;

  const { whip } = useWhipContext();

  const checkout = useWhipFundsCheckout(howMuchIWantToUpload);

  const {
    myPersonalBalance,

    differenceToPayByPersonalBalance,
    differenceToPayByGateway,

    totalToPayByGateway,
    differenceToPayByGatewayFee,
    totalToPay,

    whipBalanceNow,
    whipWillReceive,

    currentSubscriptionFee,

    uploadFeeDiscount,

    uploadFeeFixed,
    uploadFeeMultiplier,
  } = checkout?.details;

  const subscriptionActive = whip.subscription?.status === 'ACTIVE';

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
        {!subscriptionActive ? (
          <>
            <Section gap={0}>
              <Paragraph align="center">
                Whipapp is a social payment platform from <Bold>UK</Bold> ❤️.
              </Paragraph>
              <Paragraph align="center" size="small">
                We are happy to help you to organize your group expenses while you and your friends have all the fun.
              </Paragraph>
            </Section>
            <Paragraph align="center" color={Colors.brandSecondary} size="large">
              It's <Bold>just {toCurrencyPresentation(1.6)}</Bold> per month per Whip
            </Paragraph>
          </>
        ) : (
          <Paragraph>
            Input the amount you want to upload above.
          </Paragraph>
        )}
      </View>
    );
  }

  const getPaymentGatewayFee = (amount: number) => {
    const percentageAddition = amount * uploadFeeMultiplier;
    const result = amount + percentageAddition + uploadFeeFixed;
    return Number((amount > 0 ? result - amount : amount).toFixed(2));
  };

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
            setContentHeight(event.nativeEvent.layout.height);
          }}
        >
          <Section>
            <Section gap={Gap.x2Small}>
              <Pressable onPress={() => setCollapsible({
                ...collapsible,
                personalBalance: !collapsible.personalBalance,
              })}>
                <Section direction="row">
                  <Paragraph size="small" color={Colors.brandSecondaryDark}>
                    <Bold>My personal balance:</Bold>
                  </Paragraph>
                  <Paragraph size="small" color={Colors.brandSecondary}>
                    <Bold>{toCurrencyPresentation(myPersonalBalance)}</Bold>
                  </Paragraph>
                  <FontAwesomeIcon color={Colors.muted} icon={collapsible.personalBalance ? faSquarePlus : faSquareMinus} />
                </Section>
              </Pressable>
              <Collapsible collapsed={collapsible.personalBalance}>
                <Paragraph size="small" color={Colors.mutedDark}>
                  Funds are transferred from personal balance to this Whip. But don't worry!
                  Even if you  don't have enough funds on your personal balance Account you don't have to leave this screen we will process the difference from here.
                </Paragraph>
              </Collapsible>
            </Section>

            <Section direction="row">
              <Paragraph color={Colors.brandBlueDark} size="small">
                <Bold>You want to upload:</Bold>
              </Paragraph>
              <Paragraph color={Colors.brandBlue} size="small">
                {toCurrencyPresentation(howMuchIWantToUpload.toString())}
              </Paragraph>
            </Section>

            {currentSubscriptionFee ? (
              <>
                <Section gap={Gap.x2Small}>
                  <Pressable onPress={() => setCollapsible({
                    ...collapsible,
                    subscription: !collapsible.subscription,
                  })}>
                    <Section direction="row">
                      <Paragraph color={Colors.successDark} size="small">
                        <Bold>Whip Monthly Charge:</Bold>
                      </Paragraph>
                      <Paragraph color={Colors.success} size="small">
                        <Bold>{toCurrencyPresentation(currentSubscriptionFee)}</Bold> (Per month)
                      </Paragraph>
                      <FontAwesomeIcon color={Colors.muted} icon={collapsible.subscription ? faSquarePlus : faSquareMinus} />
                    </Section>
                  </Pressable>
                  <Collapsible collapsed={collapsible.subscription}>
                    <Paragraph size="small" color={Colors.mutedDark}>
                      Why I am charged to use this Whip? Your charge helps us to keep the Whipapp up and running while we continue to improve our services and develop new features.
                    </Paragraph>
                  </Collapsible>
                </Section>
              </>
            ) : null}

            <LineSeparator margin={Gap.x2Small} />

            <Section style={{ backgroundColor: 'white' }}>
              <FormFieldTitle title="Checkout" />
            </Section>

            {differenceToPayByPersonalBalance ? (
              <>
                <Paragraph size="small" color={Colors.text}>
                  Pay using my Personal Balance: <Bold>{toCurrencyPresentation(differenceToPayByPersonalBalance)}</Bold>
                </Paragraph>
              </>
            ) : null}

            {differenceToPayByGateway ? (
              <>
                <Paragraph size="small" color={Colors.text}>
                  Pay directly (Credit Card): <Bold>{toCurrencyPresentation(differenceToPayByGateway)}</Bold>
                </Paragraph>
                <Paragraph size="xSmall" color={Colors.mutedDark}>
                  Transaction Fees ({uploadFeeMultiplier * 100}% + {uploadFeeFixed}0p) + {toCurrencyPresentation(getPaymentGatewayFee(differenceToPayByGateway))}
                </Paragraph>
                {uploadFeeDiscount > 0 ? (
                  <Paragraph size="xSmall" color={Colors.mutedDark}>
                    Discount Transaction Fee ({uploadFeeDiscount}%) - {toCurrencyPresentation(getPaymentGatewayFee(differenceToPayByGateway))}
                  </Paragraph>
                ) : null}
              </>
            ) : null}

            <Paragraph>
              Total to pay: <Bold>{toCurrencyPresentation(totalToPay)}</Bold>
            </Paragraph>

            <LineSeparator margin={Gap.x2Small} />

            <Paragraph size="small" color={Colors.text}>
              Whip Balance now: <Bold>{toCurrencyPresentation(whipBalanceNow)}</Bold>
            </Paragraph>

            <Paragraph size="small" color={Colors.text}>
              Whip will receive: <Bold>{toCurrencyPresentation(whipWillReceive)}</Bold>
            </Paragraph>
            {currentSubscriptionFee ? (
              <Paragraph size="xSmall" color={Colors.mutedDark}>
                ({toCurrencyPresentation(howMuchIWantToUpload)} - {toCurrencyPresentation(currentSubscriptionFee)} Monthly Charge Fee)
              </Paragraph>
            ) : null}

            <Section direction="row">
              <Paragraph color={Colors.brandDark}>
                <Bold>Whip Balance after:</Bold>
              </Paragraph>
              <Paragraph color={Colors.brand}>
                <Bold>{toCurrencyPresentation(whipBalanceNow + whipWillReceive)}</Bold>
              </Paragraph>
            </Section>

          </Section>
        </View>
      </ScrollableContainer>
    </>
  );
};
