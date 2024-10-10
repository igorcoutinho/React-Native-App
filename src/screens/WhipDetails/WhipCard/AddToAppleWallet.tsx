import { faWallet } from '@fortawesome/free-solid-svg-icons';
import {
  NavigationProp,
  useLinkTo,
  useNavigation,
} from '@react-navigation/native';
import React from 'react';
import { Alert, NativeModules, Pressable } from 'react-native';
import { Section } from '../../../components/elements/Section';
import { useAppStateFocus } from '../../../utils/hooks/useAppStateFocus';
import { DescriptiveButton } from '../components';

const AddToAppleWalletButton =
  require('../../../assets/addToAppleWallet.svg').default;

const { MyWalletModule } = NativeModules;

export const AddToAppleWallet = ({
  small,
  cardholderName,
  cardId,
  cardSuffix,
  description,
  shouldGoBack,
}: {
  small?: boolean;
  cardholderName: string;
  cardId: string;
  cardSuffix: string;
  description: string;
  shouldGoBack?: boolean;
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const [visible, setVisible] = React.useState<boolean>(false);

  const [cardsPending, setCardsPending] = React.useState<any[]>(null);

  const linkTo = useLinkTo();

  React.useEffect(() => {
    try {
      if (cardSuffix) {
        checkIfPassIsAlreadyAdded(cardSuffix).then(shouldHide => {
          setVisible(!shouldHide);
        });
        lookForPendingActivationPasses(cardSuffix).then(pendingPasses => {
          setCardsPending(
            pendingPasses && pendingPasses?.length > 0 ? pendingPasses : null,
          );
        });
      }
    } catch (error) {}
  }, [cardSuffix]);

  useAppStateFocus(() => {
    try {
      if (cardSuffix) {
        checkIfPassIsAlreadyAdded(cardSuffix).then(shouldHide => {
          setVisible(!shouldHide);
        });
        lookForPendingActivationPasses(cardSuffix).then(pendingPasses => {
          setCardsPending(
            pendingPasses && pendingPasses?.length > 0 ? pendingPasses : null,
          );
        });
      }
    } catch (error) {}
  });

  const handleAddToWallet = async () => {
    try {
      const currentPasses = await MyWalletModule.getAllPaymentPassesBySuffix(
        cardSuffix,
      );
      if (currentPasses?.[0]?.primaryAccountIdentifier) {
        await MyWalletModule.provisionCardToDeviceWithPrimaryAccountIdentifier(
          currentPasses?.[0]?.primaryAccountIdentifier,
          {
            cardholderName,
            cardId,
            description,
            cardSuffix,
          },
        );
      } else {
        await MyWalletModule.provisionCardToDevice({
          cardholderName,
          cardId,
          description,
          cardSuffix,
        });
      }

      Alert.alert('Card added to wallet successfully!');

      const shouldHide = await checkIfPassIsAlreadyAdded(cardSuffix);

      if (shouldHide) {
        setVisible(!shouldHide);
        if (shouldGoBack) {
          navigation.goBack();
        }
      }

      return true;
    } catch (error) {
      // Alert.alert('Error adding card to wallet. Please try again.');
      throw error;
    }
  };

  return (
    <Section align="center">
      {visible ? (
        <Pressable
          onPress={handleAddToWallet}
          style={{
            margin: small ? 0 : 10,
            width: small ? '100%' : null,
          }}
        >
          <AddToAppleWalletButton
            width={small ? 102 : 146}
            height={small ? 32 : 46}
          />
        </Pressable>
      ) : null}
      {cardsPending && !small ? (
        <DescriptiveButton
          description="Your card is pending for activation."
          icon={faWallet}
          onPress={() => {
            linkTo(
              `/goto/inAppVerification?serialNumber=${cardsPending[0]?.serialNumber}&isInternal=true`,
            );
          }}
          external
          attention
          title="Activate Card"
        />
      ) : null}
    </Section>
  );
};

export const combinePassesByDeviceId = (passes: any[]) => {
  const passesByDeviceIdentifier: any = [];
  passes?.forEach((pass: any) => {
    const deviceAccountIdentifier = pass?.deviceAccountIdentifier;
    if (
      passesByDeviceIdentifier?.find(
        (p: any) => p?.deviceAccountIdentifier === deviceAccountIdentifier,
      )
    ) {
      return;
    }
    passesByDeviceIdentifier.push(pass);
  });
  return passesByDeviceIdentifier;
};

export const checkIfPassIsAlreadyAdded = async (cardSuffix: string) => {
  try {
    let isAppleWatchPaired = false;
    try {
      isAppleWatchPaired = await MyWalletModule.isAppleWatchPaired();
    } catch (error) {}
    const allPasses = await MyWalletModule.getAllPaymentPassesBySuffix(
      cardSuffix,
    );

    const passesByDeviceAccountIdentifier = combinePassesByDeviceId(
      allPasses || [],
    );

    const filteredByActivationState = passesByDeviceAccountIdentifier;
    // const filteredByActivationState = passesByDeviceAccountIdentifier?.filter(
    //   (pass: any) => pass?.passActivationState === 0,
    // );

    const numberOfDevicesToBeProvisioned = isAppleWatchPaired ? 2 : 1;
    const shouldHide =
      filteredByActivationState?.length == numberOfDevicesToBeProvisioned;

    return shouldHide;
  } catch (error) {
    Alert.alert('Error checking if pass is already added.');
    throw error;
  }
};

export const lookForPendingActivationPasses = async (cardSuffix: string) => {
  try {
    const allPasses = await MyWalletModule.getAllPaymentPassesBySuffix(
      cardSuffix,
    );

    const passesByDeviceAccountIdentifier = combinePassesByDeviceId(
      allPasses || [],
    );

    const filteredByActivationState = passesByDeviceAccountIdentifier?.filter(
      (pass: any) => pass?.passActivationState === 1,
    );

    return filteredByActivationState;
  } catch (error) {
    // Alert.alert('Error lookForPendingActivationPasses.');
    throw error;
  }
};

// [
//   {
//     deviceAccountIdentifier: 'DNITHE382405947348963326',
//     deviceAccountNumberSuffix: '0369',
//     deviceName: 'iPhone',
//     passActivationState: 1,
//     primaryAccountIdentifier: 'V-5824047583007899510682',
//     primaryAccountNumberSuffix: '6099',
//     serialNumber: 'pr.prod.pod5_ee6970001c934bf18eeadfa3000480c8',
//   },
//   {
//     deviceAccountIdentifier: 'DNITHE382405947411228798',
//     deviceAccountNumberSuffix: '0377',
//     deviceName: 'Christian’s Apple Watch',
//     passActivationState: 0, // ACTIVE
//     primaryAccountIdentifier: 'V-5824047583007899510682',
//     primaryAccountNumberSuffix: '6099',
//     serialNumber: 'pr.prod.pod5_ee6970001c934bf18eeadfa3000480c8',
//   },
//   {
//     deviceAccountIdentifier: 'DNITHE382405947348963326',
//     deviceAccountNumberSuffix: '0369',
//     deviceName: 'iPhone',
//     passActivationState: 1, // PENDING
//     primaryAccountIdentifier: 'V-5824047583007899510682',
//     primaryAccountNumberSuffix: '6099',
//     serialNumber: 'pr.prod.pod5_ee6970001c934bf18eeadfa3000480c8',
//   },
// ];

// Whip Card 1	7666	Feb-27	806

// Whip Card 2	4887	Feb-27	732

// Whip Card 3	3831	Feb-27	397
// Whip Card 4	5509	Feb-27	820
// Whip Card 5	6259	Feb-27	927
// Whip Card 6	5132	Feb-27	202
// Whip Card 7	5050	Feb-27	891
// Whip Card 8	8921	Feb-27	491
// Whip Card 9	0656	Feb-27	493
// Whip Card 10 9457	Feb-27	465

// Whip Card 1	4567 3900 1018

// Whip Card 2	4567 3900 1505

// Whip Card 3	4567 3900 1835
// Whip Card 4	4567 3900 1880
// Whip Card 5	4567 3900 1765
// Whip Card 6	4567 3900 1562
// Whip Card 7	4567 3900 1404
// Whip Card 8	4567 3900 1819
// Whip Card 9	4567 3900 1585
// Whip Card 10	4567 3900 1223

// import { NavigationProp, useNavigation } from '@react-navigation/native';
// import React from 'react';
// import { Alert, NativeModules, Pressable, View } from 'react-native';
// import { Paragraph } from '../../../components/Typography';
// import { Section } from '../../../components/elements/Section';
// import { useWhipContext } from '../../../states/Whip';
// import { Colors } from '../../../theme/colors';
// const AddToAppleWalletButton =
//   require('../../../assets/addToAppleWallet.svg').default;
// const ApplePayLogo = require('../../../assets/applePayLogo.svg').default;
// const Contactless = require('../../../assets/contactless.svg').default;

// const { MyWalletModule } = NativeModules;

// const combinePasses = (passes: any) => {
//   const passesByDeviceAccountIdentifier: any = [];
//   passes?.forEach((pass: any) => {
//     const deviceAccountIdentifier = pass?.deviceAccountIdentifier;
//     if (
//       passesByDeviceAccountIdentifier.find(
//         (p: any) => p?.deviceAccountIdentifier === deviceAccountIdentifier,
//       )
//     ) {
//       return;
//     }
//     passesByDeviceAccountIdentifier.push(pass);
//   });
//   return passesByDeviceAccountIdentifier;
// };

// export const checkIfPassIsAlreadyAdded = async (cardSuffix: any) => {
//   const allPasses = await MyWalletModule.getAllPaymentPassesBySuffix(
//     cardSuffix,
//   );
//   const passesByDeviceAccountIdentifier = combinePasses(allPasses);
//   const shouldHide = passesByDeviceAccountIdentifier.length >= 2;
//   return shouldHide;
// };

// export const getAllPaymentPassesBySuffix = async (cardSuffix: any) => {
//   const allPasses = await MyWalletModule.getAllPaymentPassesBySuffix(
//     cardSuffix,
//   );
//   const passesByDeviceAccountIdentifier = combinePasses(allPasses);
//   return passesByDeviceAccountIdentifier;
// };

// export const AddToAppleWallet = ({
//   cardholderName,
//   cardId,
//   cardSuffix,
//   description,
// }: {
//   cardholderName: string;
//   cardId: string;
//   cardSuffix: string;
//   description: string;
// }) => {
//   const navigation = useNavigation<NavigationProp<any>>();

//   const [visible, setVisible] = React.useState<boolean>(false);
//   const { whip } = useWhipContext();
//   // const { user } = useUser();

//   // const whipsMetadata = safeJsonParse<any>(storage.getString('whipsMetadata'));
//   // const metadata = (whipsMetadata || {})?.[whip?.id];
//   // const walletStatus = metadata?.walletStatus;

//   React.useEffect(() => {
//     checkIfPassIsAlreadyAdded(cardSuffix).then(shouldHide => {
//       setVisible(!shouldHide);
//     });
//   }, []);

//   const handleAddToWallet = async () => {
//     try {
//       const currentPasses = await getAllPaymentPassesBySuffix(cardSuffix);

//       Alert.alert('currentPasses', JSON.stringify(currentPasses));
//       if (currentPasses?.[0]?.primaryAccountIdentifier) {
//         await MyWalletModule.provisionCardToDeviceWithPrimaryAccountIdentifier(
//           currentPasses?.[0]?.primaryAccountIdentifier,
//           {
//             cardholderName,
//             cardId,
//             description,
//             cardSuffix,
//           },
//         );
//       } else {
//         await MyWalletModule.provisionCardToDevice({
//           cardholderName,
//           cardId,
//           description,
//           cardSuffix,
//         });
//       }

//       Alert.alert('Card added to wallet successfully!');

//       const shouldHide = await checkIfPassIsAlreadyAdded(cardSuffix);

//       if (shouldHide) {
//         setVisible(!shouldHide);
//         navigation.goBack();
//       }

//       return true;
//     } catch (error) {
//       Alert.alert('Error adding card to wallet. Please try again.');
//       throw error;
//     }
//   };

//   // /Users/cspilhere/projects/whipapp/ios/whipapp/whipapp.entitlements
//   // /Users/cspilhere/projects/whipapp/ios/whipapp/whipappRelease.entitlements

//   // A1B2C3D4E5.com.meawallet.app.IssuerNonUIExtension
//   // A1B2C3D4E5.com.meawallet.app.IssuerUIExtension

//   // F25TL3BPG5.org.whipapp.IssuerNonUIExtension
//   // F25TL3BPG5.org.whipapp.IssuerUIExtension

//   // 4567 3900 1585 0656
//   // Feb-27
//   // 493

//   // useFocusEffect(
//   //   React.useCallback(() => {
//   //     Alert.alert('useFocusEffect focused');
//   //   }, []),
//   // );

//   // useAppStateFocus(
//   //   React.useCallback(() => {
//   //     Alert.alert('useAppStateFocus focused');
//   //   }, []),
//   // );

//   // if (!visible) {
//   //   return null;
//   // }

//   return (
//     <Section align="center">
//       <Pressable onPress={handleAddToWallet} style={{ margin: 10 }}>
//         {visible ? (
//           <AddToAppleWalletButton width={146} height={46} />
//         ) : (
//           <Section>
//             <Paragraph
//               color={Colors.mutedDark}
//               align="center"
//               style={{ marginBottom: 10 }}
//               size="xSmall"
//             >
//               Use Apple Pay wherever you see one of these symbols:
//             </Paragraph>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 gap: 10,
//                 alignItems: 'center',
//               }}
//             >
//               <Contactless width={39} height={38} />
//               <ApplePayLogo width={42} height={37} />
//             </View>
//           </Section>
//         )}
//       </Pressable>
//     </Section>
//   );
// };
