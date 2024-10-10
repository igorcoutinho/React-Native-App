import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { useWhipContext } from '../../states/Whip';
import { CustomLogger } from '../../utils/CustomLogger';

export const useWhipBalanceSyncMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
} = {}) => {
  const { whip } = useWhipContext();
  return useMutation({
    mutationFn: async () => {
      try {
        await axios.post(setAPIUrl('whipBalanceSync'), {
          whipId: whip?.id,
          accountId: whip?.card?.accountId,
        });
        return true;
      } catch (error: Error | any) {

        CustomLogger({
          componentStack: 'useWhipBalanceSyncMutation',
          error: error,
          message: 'Error captured in whip balance sync',
        });


        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
