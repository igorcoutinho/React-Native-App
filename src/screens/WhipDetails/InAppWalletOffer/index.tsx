import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { Heading, Paragraph } from '../../../components/Typography';
import { VirtualCard } from '../../../components/VirtualCard';
import { Section } from '../../../components/elements/Section';
import { useUser } from '../../../states/User';
import { useWhipContext } from '../../../states/Whip';
import { Colors } from '../../../theme/colors';
import { Gap } from '../../../theme/sizes';
import { AddToAppleWallet } from '../WhipCard/AddToAppleWallet';
import { AddToGoogleWallet } from '../WhipCard/AddToGoogleWallet';

const ApplePayLogo = require('../../../assets/applePayLogo.svg').default;
const Contactless = require('../../../assets/contactless.svg').default;

export const InAppWalletOffer = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { whip } = useWhipContext();
  const { user } = useUser();

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeInDown}>
      <MainContainer paddingBottom={0}>
        <View
          style={{
            flex: 1,
            gap: Gap.medium,
            justifyContent: 'center',
            marginBottom: 20,
            marginTop: 20,
          }}
        >
          <Section gap={Gap.medium}>
            <VirtualCard cardNumber={whip?.card?.maskedCardNumber} />
            <Section gap={0}>
              <Heading align="center" size="large">
                Start using your card
              </Heading>
              <Heading align="center" size="medium">
                {'•• ' + whip?.card?.maskedCardNumber} with Apple Pay
              </Heading>
            </Section>
            <Paragraph color={Colors.mutedDark} align="center" size="small">
              Enjoy all the benefits of your Whipapp Card using Apple Pay. It's
              the easy, secure and private way to pay.
            </Paragraph>
          </Section>
          <Section align="center" gap={0}>
            <Paragraph color={Colors.mutedDark} align="center" size="xSmall">
              Use Apple Pay wherever you see one of these symbols:
            </Paragraph>
            <Section direction="row" align="center">
              <Contactless width={39} height={38} />
              <ApplePayLogo width={42} height={37} />
            </Section>
          </Section>
          {Platform.OS === 'ios' ? (
            <AddToAppleWallet
              cardholderName={
                user?.account?.firstName + ' ' + user?.account?.lastName
              }
              cardId={whip?.card?.cardId}
              cardSuffix={whip?.card?.maskedCardNumber}
              description={'Whipapp Card'}
              shouldGoBack
            />
          ) : (
            <AddToGoogleWallet />
          )}
        </View>
      </MainContainer>
      <FloatingBottom defaultPadding>
        <BaseButton onPress={navigation.goBack} variant="muted">
          Maybe Later
        </BaseButton>
      </FloatingBottom>
    </Animated.View>
  );
};
