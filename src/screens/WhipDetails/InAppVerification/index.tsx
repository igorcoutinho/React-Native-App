import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
import {
  Alert,
  Image,
  NativeModules,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuthScreenLocker } from '../../../components/AuthScreenLocker';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { Heading, Paragraph } from '../../../components/Typography';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { setAPIUrl } from '../../../constants';
import { InternalNavigationNames } from '../../../navigation/types';
import { useUser } from '../../../states/User';
import { Images } from '../../../theme/images';
import { useAppStateFocus } from '../../../utils/hooks/useAppStateFocus';
import { combinePassesByDeviceId } from '../WhipCard/AddToAppleWallet';
import { ErrorScreen } from './ErrorScreen';
import { SuccessScreen } from './SuccessScreen';
import { VerifyingScreen } from './VerifyingScreen';

const { MyWalletModule } = NativeModules;

export const InAppVerification = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  const { status, showAuthScreen } = useAuthScreenLocker();
  const { isSignedIn } = useUser();

  useAppStateFocus(showAuthScreen, isSignedIn, true);

  const { user } = useUser();

  const [error, setError] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);
  const [verifying, setVerifying] = React.useState<boolean>(true);

  const [haveMoreThanOnePass, setHaveMoreThanOnePass] =
    React.useState<any>(null);

  useAppStateFocus(() => {
    setError(false);
    setSuccess(false);
    setVerifying(false);
    setHaveMoreThanOnePass(null);
  });

  const handleActivation = React.useCallback(() => {
    MyWalletModule.getAllPaymentPassesRequiringActivation()
      .then((passes: any) => {
        const serialNumber = route?.params?.serialNumber;
        const filteredPasses = passes?.filter(
          (pass: any) => pass?.serialNumber === serialNumber,
        );
        const pendingPasses = combinePassesByDeviceId(filteredPasses || []);
        const moreThanOnePass = pendingPasses.length > 1;
        if (moreThanOnePass) {
          setHaveMoreThanOnePass(pendingPasses);
          return;
        }
        activatePasses(pendingPasses);
      })
      .catch((error: any) => {
        Alert.alert('An error occurred. Please try again or contact support.');
      });
  }, [route?.params?.serialNumber]);

  const activatePasses = React.useCallback((passes: any) => {
    setVerifying(true);
    const activationPromises = passes.map((pass: any) => {
      return new Promise((resolve, reject) => {
        FirebaseFirestore()
          .collection('Whips')
          .where(
            'card.maskedCardNumber',
            '==',
            String(pass?.primaryAccountNumberSuffix),
          )
          .where('ownerId', '==', user?.uid)
          .get()
          .then(whip => {
            activatePaymentPass({
              cardId: whip?.docs?.[0]?.data()?.card?.cardId,
              deviceAccountIdentifier: pass?.deviceAccountIdentifier,
            })
              .then(activationResult => {
                resolve(activationResult);
              })
              .catch(reject);
          })
          .catch(reject);
      });
    });
    Promise.all(activationPromises)
      .then(() => {
        setError(false);
        setSuccess(true);
        setVerifying(false);
      })
      .catch(() => {
        Alert.alert('An error occurred. Please try again or contact support.');
        setError(true);
        setSuccess(false);
        setVerifying(false);
      });
  }, []);

  React.useEffect(() => {
    if (status === 'success') {
      if (!route?.params?.serialNumber) {
        navigation.navigate(InternalNavigationNames.Tabs, {
          screen: 'MyWhips',
        });
        return;
      }
      handleActivation();
    }
    if (status === 'error') {
      Alert.alert('Card Verification', 'Verification failed. Please try again.');
    }
    if (status === 'cancelled') {
      Alert.alert('Card Verification.', 'Verification cancelled. To try again start all over.');
      navigation.navigate(InternalNavigationNames.Tabs, {
        screen: 'MyWhips',
      });
    }
  }, [status]);

  React.useEffect(() => {
    setError(false);
    setSuccess(false);
    setVerifying(false);
    setHaveMoreThanOnePass(null);
    if (!!(route?.params?.serialNumber && route?.params?.isInternal)) {
      handleActivation();
    }
  }, []);

  return (
    <>
      <MainContainer paddingBottom={0}>
        {haveMoreThanOnePass && !success && !error && !verifying ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Section>
              <Heading align="center">Select a card to verify</Heading>
              <LineSeparator />
              {/* 
              deviceAccountIdentifier
              deviceAccountNumberSuffix
              deviceName
              passActivationState
              primaryAccountIdentifier
              primaryAccountNumberSuffix
              serialNumber
              */}
              {haveMoreThanOnePass.map((pass: any) => (
                <TouchableOpacity
                  key={pass?.primaryAccountNumberSuffix}
                  onPress={() => {
                    activatePasses([pass]);
                  }}
                >
                  <Section direction="row">
                    <View
                      style={{
                        alignItems: 'center',
                        borderRadius: 4,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        width: 80,
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
                      <Heading size="small">{pass?.deviceName}</Heading>
                      <Paragraph>
                        •••• •••• •••• {pass?.primaryAccountNumberSuffix}
                      </Paragraph>
                    </Section>
                  </Section>
                </TouchableOpacity>
              ))}
            </Section>
          </View>
        ) : (
          <>
            {error ? <ErrorScreen /> : null}
            {success ? <SuccessScreen /> : null}
            {verifying ? <VerifyingScreen /> : null}
          </>
        )}
      </MainContainer>
      {success || error || !!route?.params?.isInternal ? (
        <FloatingBottom>
          <BaseButton
            onPress={() =>
              navigation.navigate(InternalNavigationNames.Tabs, {
                screen: 'MyWhips',
              })
            }
          >
            Leave
          </BaseButton>
        </FloatingBottom>
      ) : null}
    </>
  );
};

const activatePaymentPass = async ({
  cardId,
  deviceAccountIdentifier,
}: {
  cardId: string;
  deviceAccountIdentifier: string;
}) => {
  try {
    const idToken = await FirebaseAuth().currentUser?.getIdToken();
    const response = await axios.post(
      `${setAPIUrl('whipVerifyCardFromWallet')}?cardId=${cardId}`,
      {
        headers: {
          authorization: idToken,
        },
      },
    );
    await MyWalletModule.activatePaymentPass(
      deviceAccountIdentifier,
      response?.data?.activationData,
    );
    return true;
  } catch (error) {
    throw new Error('Error activating payment pass.');
  }
};
