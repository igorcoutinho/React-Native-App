import FirebaseAuth from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { IWhipEventData } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const useWhipPaymentIntentMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
} = {}) => {
  return useMutation({
    mutationFn: async (data: IWhipEventData) => {
      const userIdToken = await FirebaseAuth().currentUser?.getIdToken();
      try {

        const amountToPayWithMoney = data.transactionDetails.amountToPayWithMoney;
        const amountToPayWithPersonalBalance = data.transactionDetails.amountToPayWithPersonalBalance;

        const intent = await axios.post(
          setAPIUrl('whipCreatePaymentIntent'),
          {
            ...data,
            transactionDetails: {
              ...data.transactionDetails,
              amount: amountToPayWithMoney,
            },
          },
          {
            headers: {
              authorization: userIdToken,
            },
          },
        );

        if (amountToPayWithPersonalBalance > 0 && intent.data) {
          intent.data.transferData = data;
        }

        return intent?.data;

      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipPaymentIntentMutation',
          error: error,
          message: 'Error captured in whip payment intent',
        });

        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
