import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { queryClient } from '..';
import { setAPIUrl } from '../../constants';
import { CustomLogger } from '../../utils/CustomLogger';

export const LookupAddressQueryKey = 'LookupAddressQuery';

export interface ILookupAddressData {
  complete: boolean;
  address: string;
  addressComponents: {
    componentName: string;
    componentType: string;
    confirmationLevel: string;
  }[];
  missingComponentTypes: string[];
  unconfirmedComponentTypes: string[];
}

export const useLookupAddressQuery = ({
  address,
  enabled = false,
}: {
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    flatNumber?: string | null;
    houseName?: string | null;
    houseNumber?: string | null;
    postalCode?: string;
  };
  enabled?: boolean;
} = {}) => {
  return useQuery({
    enabled,
    queryFn: async (): Promise<ILookupAddressData> => {
      try {
        const result = await axios.post(`${setAPIUrl('lookupAddress')}`, {
          address,
        });
        return result.data;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useLookupAddressQuery',
          error: error,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    queryKey: [LookupAddressQueryKey],
  });
};

export const resetUseLookupAddressQuery = () => queryClient.resetQueries({ queryKey: [LookupAddressQueryKey] });