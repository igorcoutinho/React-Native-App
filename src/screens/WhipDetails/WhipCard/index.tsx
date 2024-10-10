import {
  faBan,
  faCreditCard,
  faHandHoldingDollar,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Platform, View } from 'react-native';
import { useAuthScreenLocker } from '../../../components/AuthScreenLocker';
import { BaseButton } from '../../../components/BaseButton';
import { Section } from '../../../components/elements/Section';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Heading } from '../../../components/Typography';
import { useViewLocker } from '../../../components/ViewLocker';
import { VirtualCard } from '../../../components/VirtualCard';
import { useWhipBlockCardMutation } from '../../../queries/Whip/useWhipBlockCardMutation';
import { useWhipCardInfoQuery } from '../../../queries/Whip/useWhipCardInfoQuery';
import { useWhipUnblockCardMutation } from '../../../queries/Whip/useWhipUnblockCardMutation';
import { useUser } from '../../../states/User';
import { useWhipContext } from '../../../states/Whip';
import { Gap } from '../../../theme/sizes';
import { DescriptiveButton } from '../components';
import { AddToAppleWallet } from './AddToAppleWallet';
import { AddToGoogleWallet } from './AddToGoogleWallet';

export const WhipCard = () => {
  const [shouldGetCardInfo, setGetCardInfo] = React.useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const { whip } = useWhipContext();
  const { user } = useUser();
  const { toggleLocker } = useViewLocker();

  const virtualCardQuery = useWhipCardInfoQuery({
    cardId: whip?.card?.cardId,
    enabled: shouldGetCardInfo,
  });

  const isBlocked = whip?.card?.status === 'BLOCKED';
  const isReady = whip?.card?.status === 'READY';

  const whipBlockCardMutation = useWhipBlockCardMutation({
    onError: error => {
      Alert.alert('Error', error.message);
      toggleLocker(false);
    },
    onSuccess: () => {
      toggleLocker(false);
      navigation.goBack();
    },
  });

  const whipUnblockCardMutation = useWhipUnblockCardMutation({
    onError: error => {
      Alert.alert('Error', error.message);
      toggleLocker(false);
    },
    onSuccess: () => {
      toggleLocker(false);
      // navigation.goBack();
    },
  });

  const { status, showAuthScreen } = useAuthScreenLocker();

  React.useEffect(() => {
    if (status === 'success') {
      setGetCardInfo(true);
    }
  }, [status]);

  return (
    <>
      <ModalHeader
        onPress={() => {
          navigation.navigate('MyWhips');
        }}
      />
      <MainContainer>
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
            <VirtualCard
              cardNumber={
                virtualCardQuery?.data?.cardNumber ||
                whip?.card?.maskedCardNumber
              }
              cardCvv={virtualCardQuery?.data?.cardCvv}
              cardExpDate={virtualCardQuery?.data?.cardExpDate}
              isLoading={virtualCardQuery.isLoading}
            />
            <Section gap={0}>
              <Heading align="center" size="medium">
                This is your Whipapp Card
              </Heading>
              <Heading align="center" size="regular">
                You can use it to pay everywhere.
              </Heading>
            </Section>
          </Section>
          {!isBlocked ? (
            Platform.OS === 'ios' ? (
              <AddToAppleWallet
                cardholderName={
                  user?.account?.firstName + ' ' + user?.account?.lastName
                }
                cardId={whip?.card?.cardId}
                cardSuffix={whip?.card?.maskedCardNumber}
                description={'Whipapp Card'}
              />
            ) : (
              <AddToGoogleWallet />
            )
          ) : null}
          <Section gap={Gap.small}>
            <DescriptiveButton
              danger
              description={
                isBlocked
                  ? 'Unblock your Whipapp Card'
                  : 'Block your Whipapp Card.'
              }
              icon={isBlocked ? faUndo : faBan}
              onPress={() => {
                Alert.alert(
                  isBlocked ? 'Unblock Card' : 'Block Card',
                  `Are you sure you want to ${isBlocked ? 'unblock' : 'block'
                  } this card?`,
                  [
                    {
                      text: isBlocked ? 'Unblock' : 'Block',
                      style: 'destructive',
                      onPress: () => {
                        toggleLocker(true);
                        isBlocked
                          ? whipUnblockCardMutation.mutate({ whipId: whip?.id })
                          : whipBlockCardMutation.mutate({ whipId: whip?.id });
                      },
                    },
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                  ],
                );
              }}
              title={isBlocked ? 'Unblock Card' : 'Block Card'}
            />
            {isBlocked ? null : (
              <>
                <DescriptiveButton
                  description="Card number, CVV and expiry date."
                  icon={faCreditCard}
                  onPress={() => showAuthScreen(true)}
                  title="View Card Details"
                />
                <DescriptiveButton
                  description="Add money to spent with your card."
                  icon={faHandHoldingDollar}
                  onPress={() => {
                    navigation.navigate('WhipFunds');
                  }}
                  title="Add Funds"
                  disabled={whip.disabled}
                />
              </>
            )}
          </Section>
        </View>
      </MainContainer>
      <FloatingBottom>
        <Section>
          <BaseButton variant="muted" onPress={() => navigation.goBack()}>
            Back
          </BaseButton>
        </Section>
      </FloatingBottom>
    </>
  );
};
