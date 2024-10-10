import { useConfirmPayment } from '@stripe/stripe-react-native';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const usePaymentMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
} = {}) => {
  const { confirmPayment } = useConfirmPayment();

  return useMutation({
    mutationFn: async ({
      accountId,
      amount,
      userEmail,
      userId,
      userPhoneNumber,
      whipId,
    }: {
      accountId: string;
      amount: number;
      userEmail: string;
      userId: string;
      userPhoneNumber: string;
      whipId: string;
    }) => {
      try {
        const intent = await axios.post(setAPIUrl('createPaymentIntent'), {
          amount,
          metadata: {
            accountId,
            userId,
            userPhoneNumber,
            whipId,
          },
        });
        const { paymentIntent, error } = await confirmPayment(
          intent?.data?.client_secret,
          {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: {
                email: userEmail,
              },
            },
          },
        );
        if (error) {
          console.log(error);
          throw error;
        } else if (paymentIntent) {
          return paymentIntent;
        }
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'usePaymentMutation',
          error: error,
          message: 'Error captured in ErrorBoundary',
        });

        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
