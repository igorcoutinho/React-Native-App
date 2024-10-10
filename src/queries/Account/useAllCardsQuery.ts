import FirebaseFirestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { queryClient } from '..';
import { setAPIUrl } from '../../constants';
import { useUser } from '../../states/User';
import { IWhip } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const AllCardsQueryKey = 'AllCardsQuery';

const collection = FirebaseFirestore().collection('Whips');

export const useAllCardsQuery = ({
  customerId,
  enabled = false,
}: {
  customerId?: string;
  enabled?: boolean;
} = {}) => {
  const { user } = useUser();
  return useQuery({
    enabled,
    queryFn: async () => {
      try {
        const whips = await collection.where('ownerId', '==', user?.uid).get();
        const result = await axios.get(
          `${setAPIUrl('getCardsByCustomerId')}?customerId=${customerId}`,
        );
        const cardFilteredByStatus = (result?.data || [])?.filter(
          (card: any) => card?.status === 'CARD_OK',
        );
        const cardsFilteredByWhip = cardFilteredByStatus?.filter((card: any) =>
          whips.docs.find(
            (whip: FirebaseFirestoreTypes.DocumentSnapshot<IWhip>) =>
              whip?.data()?.card?.cardId === card?.id,
          ),
        );
        return cardsFilteredByWhip;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAllCardsQuery',
          error: error,
          loggedUser: user,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    retry: true,
    refetchOnWindowFocus: true,
    queryKey: [AllCardsQueryKey, customerId],
  });
};

export const resetAllCardsQuery = (customerId: string) =>
  queryClient.resetQueries({ queryKey: [AllCardsQueryKey, customerId] });
