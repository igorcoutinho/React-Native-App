import FirebaseAuth from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { NativeModules } from 'react-native';
import { setAPIUrl } from '../../constants';
import { useUser } from '../../states/User';
import { CustomLogger } from '../../utils/CustomLogger';

const { GooglePayIssuer } = NativeModules;

export const useWhipAddCardToWalletMutation = ({
  accountId,
  cardId,
  onError,
  onSuccess,
}: {
  accountId?: string | undefined;
  cardId?: string | undefined;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
} = {}) => {
  const { user } = useUser();
  return useMutation({
    mutationFn: async () => {
      try {
        const hardwareId = await GooglePayIssuer.getStableHardwareId();
        const userIdToken = await FirebaseAuth().currentUser?.getIdToken();
        const response = await axios.post(
          setAPIUrl('addCardToWallet'),
          {
            accountId,
            cardId,
            hardwareId,
            walletType: 'GooglePay',
          },
          {
            headers: {
              authorization: userIdToken,
            },
          },
        );
        return response?.data;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipAddCardToWalletMutation',
          error: error,
          loggedUser: user,
          message: 'Error captured in add cart to wallet',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
