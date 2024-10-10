import React from 'react';
import { Alert, NativeModules, Pressable } from 'react-native';
import { ViewLocker } from '../../../components/ViewLocker';
import { useWhipAddCardToWalletMutation } from '../../../queries/Whip/useWhipAddCardToWalletMutation';
import { useUser } from '../../../states/User';
import { useWhipContext } from '../../../states/Whip';
const AddToGoogleWalletButton =
  require('../../../assets/addToGoogleWallet.svg').default;

const { GooglePayIssuer } = NativeModules;

export const AddToGoogleWallet = () => {
  const [viewLocker, setViewLocker] = React.useState<boolean>(false);

  const { whip } = useWhipContext();
  const { user } = useUser();

  const handleAddToWallet = async ({
    digitizationData,
  }: {
    digitizationData: string;
  }) => {
    try {
      const walletId = await GooglePayIssuer.getActiveWalletId();
      const hardwareId = await GooglePayIssuer.getStableHardwareId();

      if (!walletId || !hardwareId) {
        return Alert.alert(
          'Please config your Google Wallet Application before adding the card.',
        );
      }

      const opc = digitizationData;
      const tsp = 'VISA';
      const clientName = 'WhipApp';
      const lastDigits = whip.card.maskedCardNumber;
      const userAddress = user.account.address;
      const address = {
        name: `${user.account.firstName} ${user.account.lastName}`,
        address: userAddress.addressLine1,
        locality: userAddress.city,
        countryCode: 'GB',
        postalCode: userAddress.postalCode,
        phoneNumber: user.account.phoneNumber,
      };

      GooglePayIssuer.pushProvision(opc, tsp, clientName, lastDigits, address)
        .then((result: any) => {
          console.log(JSON.stringify(result, null, 2));
          // Alert.alert('Card added to your Google Wallet.');
        })
        .catch((error: any) => {
          console.log(JSON.stringify(error, null, 2));
          // setViewLocker(false);
        });
    } catch (error) {
      Alert.alert('Card NOT added to your Google Wallet.');
      // setViewLocker(false);
    }
  };

  const addVirtualCardToWalletMutation = useWhipAddCardToWalletMutation({
    accountId: whip?.card?.accountId,
    cardId: whip?.card?.cardId,
    onError(error) {
      console.log('onError', error);
      setViewLocker(false);
    },
    onSuccess(data) {
      console.log('onSuccess', data);
      setViewLocker(false);
      handleAddToWallet({ digitizationData: data.digitizationData });
    },
  });

  React.useEffect(() => {
    GooglePayIssuer?.config();
  }, []);

  return (
    <>
      {viewLocker ? <ViewLocker showLoading={true} /> : null}
      <Pressable
        onPress={() => {
          setViewLocker(true);
          addVirtualCardToWalletMutation.mutate();
        }}
        style={{
          margin: 10,
        }}
      >
        <AddToGoogleWalletButton />
      </Pressable>
    </>
  );
};
