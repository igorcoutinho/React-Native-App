import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { queryClient } from '..';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const AccountQueryKey = 'AccountQuery';

export const useAccountQuery = ({
  accountId,
  enabled = false,
}: {
  accountId?: string;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    enabled,
    queryFn: async () => {
      try {
        const result = await axios.get(
          `${setAPIUrl('getAccountInfo')}?accountId=${accountId}`,
        );
        return result.data;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAccountQuery',
          error: error,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    retry: true,
    refetchOnWindowFocus: true,
    queryKey: [AccountQueryKey, accountId],
  });
};

export const resetAccountQuery = (accountId: string) =>
  queryClient.resetQueries({ queryKey: [AccountQueryKey, accountId] });
