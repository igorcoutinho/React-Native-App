import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { queryClient } from '..';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const WhipCardInfoQueryKey = 'WhipCardInfoQuery';

export const useWhipCardInfoQuery = ({
  cardId,
  enabled = false,
}: {
  cardId?: string;
  enabled?: boolean;
} = {}) => {
  return useQuery({
    enabled,
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${setAPIUrl('getCardInfo')}?cardId=${cardId}`,
        );
        return response.data;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipCardInfoQuery',
          error: error,
          message: 'Error captured in whip card info',
        });

        console.log(': ', error);
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    queryKey: [WhipCardInfoQueryKey, cardId],
  });
};

export const resetWhipCardInfoQuery = () =>
  queryClient.resetQueries({ queryKey: [WhipCardInfoQueryKey] });
