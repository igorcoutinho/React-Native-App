import FirebaseAuth from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { IWhipEventData } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const useWhipPaymentTransferMutation = ({
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

        const amountToPayWithPersonalBalance = data.transactionDetails.amountToPayWithPersonalBalance;

        const personalAccountId = data?.transactionDetails?.personalBalanceAccountId;

        const transfer = await axios.post(
          setAPIUrl('whipCreateTransfer'),
          {
            ...data,
            fromAccountId: personalAccountId,
            transactionDetails: {
              ...data.transactionDetails,
              amount: amountToPayWithPersonalBalance,
            },
          },
          {
            headers: {
              authorization: userIdToken,
            },
          },
        );
        return data;

      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipPaymentTransferMutation',
          error: error,
          message: 'Error captured in whip payment transfer',
        });

        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
