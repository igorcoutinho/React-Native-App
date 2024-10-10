import {
  faCog,
  faReceipt,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { analytics } from '../../..';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Paragraph } from '../../../components/Typography';
import { Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { useWhipActiveFriendMutation } from '../../../queries/Whip/useWhipActiveFriendMutation';
import { useWhipRequestCardMutation } from '../../../queries/Whip/useWhipRequestCardMutation';
import { useUser } from '../../../states/User';
import { useWhipContext } from '../../../states/Whip';
import { WhipFriendInviteStatus } from '../../../states/Whip/types';
import { Colors } from '../../../theme/colors';
import { defaultScreenOptions } from '../../../theme/commonProps';
import { toNumericFormat } from '../../../utils/masks';
import { BalanceDisplay, WhipItemWrapper } from '../components';
import { FriendsSection } from './FriendsSection';
import { HistorySection } from './HistorySection';

const Stack = createStackNavigator();

export function useInterval(callback: any, delay: any) {
  const savedCallback = React.useRef<any>();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback?.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const HistorySectionScreen = () => {
  const { history, me } = useWhipContext();
  return <HistorySection history={history} userId={me?.userId} />;
};

export const WhipDetailsMain = () => {
  const navigation = useNavigation<NavigationProp<any>>();

  const { whip, me, isLoading, isArchived } = useWhipContext();
  const { user } = useUser();

  const whipRequestCardMutation = useWhipRequestCardMutation();
  const insets = useSafeAreaInsets();

  const route = useRoute<RouteProp<any>>();

  const [currentTab, setCurrentTab] = React.useState<'History' | 'Friends'>(route.params?.tab || 'Friends');

  const cardBlocked = whip?.card?.status === 'BLOCKED';
  const cardPending = whip?.card?.status === 'PENDING';
  const cardProcessing = whip?.card?.status === 'PROCESSING';
  const cardReady = whip?.card?.status === 'READY' || whip?.card?.status === 'BLOCKED' && whip?.card?.status !== 'CLOSED';
  const userAccountCreated = !!user?.account?.provider?.accountId;
  const isCreatingCard = cardProcessing;

  // const accountQuery = useAccountQuery({
  //   accountId: whip?.card?.accountId,
  //   enabled: !!whip?.card?.accountId,
  // });

  // const whipsMetadata = safeJsonParse<any>(storage.getString('whipsMetadata'));
  // const metadata = (whipsMetadata || {})?.[whip?.id];

  // const hideAddToWalletBanner = metadata?.hideAddToWalletBanner;
  // const handleAddToWalletBanner = async () => {
  //   await storage.set(
  //     'whipsMetadata',
  //     safeJsonString({
  //       ...whipsMetadata,
  //       [whip?.id]: {
  //         ...metadata,
  //         hideAddToWalletBanner: true,
  //       },
  //     }),
  //   );
  // };

  // Sentry.captureException(new Error('First error'));

  const whipActiveFriendMutation = useWhipActiveFriendMutation({
    userId: user?.uid,
    onSuccess: async (userId) => {
      try {
        await analytics().logJoinGroup({ group_id: whip?.id });
      } catch (error) { }
    },
  });

  React.useEffect(() => {
    if (!me?.active && me?.invite === WhipFriendInviteStatus.CONFIRMED) {
      whipActiveFriendMutation.mutate(me.id);
    }
  }, [me?.invite, me?.active]);

  // console.log(me?.id, isLoading);

  // const [shouldHideBanner, setShouldHideBanner] =
  //   React.useState<boolean>(false);

  // useInterval(
  //   React.useCallback(() => {
  //     try {
  //       if (whip?.card?.maskedCardNumber) {
  //         checkIfPassIsAlreadyAdded(whip?.card?.maskedCardNumber).then(
  //           shouldHide => {
  //             setShouldHideBanner(!shouldHide);
  //           },
  //         );
  //       }
  //     } catch (error) {}
  //   }, [whip?.card?.maskedCardNumber]),
  //   300,
  // );

  const shouldShowAddToWalletBanner = false;
  // const shouldShowAddToWalletBanner = shouldHideBanner;
  // cardReady && !shouldHideBanner && !hideAddToWalletBanner && !cardBlocked;

  const balance = toNumericFormat(whip.balance || 0);
  const deposits = toNumericFormat((whip.deposits || 0) - (whip?.refunds || 0));
  const spent = toNumericFormat(((whip?.deposits || 0) - (whip?.refunds || 0)) - whip.balance || 0);

  console.log('isCreatingCard', whip?.card)
  return (
    <>
      <ModalHeader
        onPress={() => {
          navigation.navigate('MyWhips');
        }}
        rightAccessory={(
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {whip?.archived ?
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: Colors.dangerDark,
                  borderRadius: 12,
                  padding: 1,
                  paddingHorizontal: 5,
                  minWidth: 70,
                  marginRight: 30,
                }}
              >
                <Paragraph color={Colors.white} size="small">
                  Archived
                </Paragraph>
              </View>
              : whip?.isOwner && (
                <BaseButton
                  rounded
                  variant="transparent"
                  flatten
                  onPress={() => navigation.navigate('WhipConfigurations')}
                >
                  <FontAwesomeIcon icon={faCog} size={18} color={Colors.dark} />
                </BaseButton>
              )}
          </View>
        )}
      />
      <MainContainer paddingBottom={0}>
        <View>
          <WhipItemWrapper
            whip={whip}
            onPressCTA={(
              isCreatingCard ?
                null :
                () => userAccountCreated && cardReady ?
                  navigation.navigate('WhipFunds') :
                  userAccountCreated ?
                    Alert.alert('You need to request a card first') :
                    navigation.navigate('Account')
            )}
          />
          <BalanceDisplay
            balance={balance}
            deposits={deposits}
            spent={spent}
          // disabled={isArchived}
          // onPress={
          //   !!whip?.isOwner
          //     ? isCreatingCard
          //       ? null
          //       : () =>
          //         userAccountCreated && cardReady
          //           ? navigation.navigate('WhipFunds')
          //           : userAccountCreated
          //             ? Alert.alert(whip.subscriptionActive ? 'You need to request a card first' : 'Activate this Whip first')
          //             : navigation.navigate('Account')
          //     : null
          // }
          />
        </View>
        <View style={{ flex: 1, marginTop: 5 }}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName={'Friends'}
          >
            <Stack.Screen
              component={HistorySectionScreen}
              name={'History'}
              listeners={{
                focus: () => setCurrentTab('History'),
              }}
              options={defaultScreenOptions}
            />
            <Stack.Screen
              component={FriendsSection}
              name={'Friends'}
              listeners={{
                focus: () => setCurrentTab('Friends'),
              }}
              options={defaultScreenOptions}
            />
          </Stack.Navigator>
        </View>
      </MainContainer>
      <FloatingBottom>
        {shouldShowAddToWalletBanner ? (
          <>
            {/* <AddToWalletBanner onPressToDismiss={handleAddToWalletBanner} /> */}
            <Spacer />
          </>
        ) : null}
        <Section direction="row" style={{ justifyContent: 'center' }}>
          {whip?.isOwner && !isArchived ? (
            whip.subscriptionActive ? (
              <BaseButton
                disabled={isCreatingCard}
                onPress={() => {
                  // if (!cardReady && userAccountCreated) {
                  //   whipRequestCardMutation.mutate({
                  //     whipId: whip?.id,
                  //   });
                  // }
                  if (cardReady) {
                    navigation.navigate('WhipCard');
                  } else if (!userAccountCreated) {
                    navigation.navigate('Account');
                  }
                }}
                grow
              >
                {cardReady
                  ? 'Whip Card'
                  : isCreatingCard
                    ? 'Creating Card...'
                    : !userAccountCreated
                      ? 'Create Account'
                      : 'Request Card'}
              </BaseButton>
            ) : <BaseButton onPress={() => navigation.navigate('WhipFunds')} grow>Activate Whip</BaseButton>
          ) : null}
          <BaseButton
            onPress={() => navigation.navigate('History')}
            variant="secondary"
            selected={currentTab === 'History'}
            rounded
          >
            {currentTab === 'History' ? (
              <FontAwesomeIcon icon={faReceipt} color={Colors.white} />
            ) : (
              <FontAwesomeIcon icon={faReceipt} color={Colors.white} />
            )}
          </BaseButton>
          <BaseButton
            onPress={() => navigation.navigate('Friends')}
            variant="secondary"
            selected={currentTab === 'Friends'}
            rounded
          >
            {currentTab === 'Friends' ? (
              <FontAwesomeIcon icon={faUsers} color={Colors.white} />
            ) : (
              <FontAwesomeIcon icon={faUsers} color={Colors.white} />
            )}
          </BaseButton>
          {/* <BaseButton
            onPress={() => navigation.navigate('Chat')}
            variant="secondary"
            selected={currentTab === 'Chat'}
            rounded
          >
            {currentTab === 'Chat' ? (
              <FontAwesomeIcon icon={faComments} color={Colors.white} />
            ) : (
              <FontAwesomeIcon icon={faComments} color={Colors.white} />
            )}
          </BaseButton> */}
        </Section>
      </FloatingBottom>
    </>
  );
};
