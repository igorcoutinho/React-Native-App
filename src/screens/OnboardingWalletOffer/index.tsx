import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BaseButton } from '../../components/BaseButton';
import { FloatingBottom } from '../../components/FloatingBottom';
import {
  MainContainer,
  ScrollableContainer,
} from '../../components/MainContainer';
import { Heading, Paragraph } from '../../components/Typography';
import { Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { useAllCardsQuery } from '../../queries/Account/useAllCardsQuery';
import { useUser } from '../../states/User';
import { useWhipContext } from '../../states/Whip';
import { Colors } from '../../theme/colors';
import { Images } from '../../theme/images';
import { Gap } from '../../theme/sizes';
import {
  AddToAppleWallet,
  checkIfPassIsAlreadyAdded,
} from '../WhipDetails/WhipCard/AddToAppleWallet';

const Card = ({ card, user }: { card: any; user: any }) => {
  const [shouldHideCard, setShouldHide] = React.useState(false);

  React.useEffect(() => {
    checkIfPassIsAlreadyAdded(card?.maskedCardNumber?.slice(-4)).then(
      shouldHide => {
        setShouldHide(shouldHide);
      },
    );
  }, []);

  if (shouldHideCard) {
    return null;
  }

  return (
    <Section key={card?.id} direction="row" align="center">
      <View
        style={{
          alignItems: 'center',
          borderRadius: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          overflow: 'hidden',
          width: 60,
          height: 36,
          marginTop: 5,
        }}
      >
        <Image
          source={Images.virtualCard}
          style={{
            width: '100%',
            aspectRatio: 1.584,
            resizeMode: 'contain',
          }}
        />
      </View>
      <Section>
        <Paragraph size="small">
          •••• •••• •••• {card?.maskedCardNumber?.slice(-4)}
        </Paragraph>
        <AddToAppleWallet
          small
          cardholderName={
            user?.account?.firstName + ' ' + user?.account?.lastName
          }
          cardId={card?.id}
          cardSuffix={card?.maskedCardNumber?.slice(-4)}
          description={'Whipapp Card'}
        />
      </Section>
    </Section>
  );
};

export const OnboardingWalletOffer = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const { whip } = useWhipContext();
  const { user } = useUser();

  const allCardsQuery = useAllCardsQuery({
    customerId: user?.account?.provider?.customerId,
    enabled: !!user?.account?.provider?.customerId,
  });

  const allCards = allCardsQuery.data || [];

  return (
    <Animated.View style={{ flex: 1 }} entering={FadeInDown}>
      <MainContainer paddingBottom={0}>
        <View
          style={{
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              gap: 20,
              marginBottom: 20,
              marginTop: 80,
            }}
          >
            <View>
              <Heading align="center" size="large">
                Welcome to Whipapp
              </Heading>
            </View>
            <Paragraph
              color={Colors.mutedDark}
              align="center"
              size="small"
              style={{ maxWidth: 310 }}
            >
              You can add your cards to Apple Wallet
            </Paragraph>
          </View>
          <Spacer />
          <ScrollableContainer>
            {allCardsQuery.isLoading || allCardsQuery.isFetching ? (
              <ActivityIndicator />
            ) : (
              <Section align="center" gap={Gap.medium}>
                {allCards?.map((card: any) => (
                  <Card key={card?.id} card={card} user={user} />
                ))}
              </Section>
            )}
          </ScrollableContainer>
          <Spacer />
          <Spacer />
        </View>
      </MainContainer>
      <FloatingBottom defaultPadding>
        <BaseButton
          onPress={() => {
            // const whipsMetadata = safeJsonParse<any>(
            //   storage.getString('whipsMetadata'),
            // );
            // const metadata = (whipsMetadata || {})?.[whip?.id];
            // await storage.set(
            //   'whipsMetadata',
            //   safeJsonString({
            //     ...whipsMetadata,
            //     [whip?.id]: {
            //       ...metadata,
            //       hideAddToWalletSplashScreen: true,
            //     },
            //   }),
            // );
            navigation.navigate('Tabs');
          }}
          variant="muted"
        >
          Maybe Later
        </BaseButton>
      </FloatingBottom>
    </Animated.View>
  );
};
