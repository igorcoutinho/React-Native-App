import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../states/User';
import { CustomLogger } from '../../utils/CustomLogger';

const collection = FirebaseFirestore().collection('Users');

export const useAccountCloseMutation = ({
  onError,
  onSuccess,
}: {
  onError?: (error: any) => void;
  onSuccess?: (status: boolean) => void;
} = {}) => {
  const { user } = useUser();
  return useMutation({
    mutationFn: async () => {
      try {
        await collection.doc(user.uid).set(
          {
            closeRequest: true,
          },
          { merge: true },
        );
        return true;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAccountCloseMutation',
          error: error,
          message: 'Error captured in useAccountCloseMutation',
        });
        return false;
      }
    },
    onError,
    onSuccess,
  });
};
