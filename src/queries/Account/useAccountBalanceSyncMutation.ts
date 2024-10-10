import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { setAPIUrl } from '../../constants';
import { useUser } from '../../states/User';
import { CustomLogger } from '../../utils/CustomLogger';

export const useAccountBalanceSyncMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
} = {}) => {
  const { user } = useUser();
  return useMutation({
    mutationFn: async () => {
      try {
        await axios.post(setAPIUrl('accountBalanceSync'), {
          userId: user?.uid,
          accountId: user?.account?.provider?.accountId,
        });
        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAccountBalanceSyncMutation',
          error: error,
          loggedUser: user,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
  });
};
