import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export function useUserVerifyPhoneNumberMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: ({
    confirmation,
    phoneNumber,
  }: {
    confirmation: FirebaseAuthTypes.ConfirmationResult;
    phoneNumber: string | null;
  }) => void;
} = {}) {
  return useMutation({
    mutationFn: async ({ phoneNumber }: { phoneNumber: string }) => {
      try {
        const confirmation = await FirebaseAuth()
          .verifyPhoneNumber(phoneNumber)
          .catch(Promise.reject);
        return { confirmation, phoneNumber };
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useUserVerifyPhoneNumberMutation',
          error: error,
          message: 'Error captured in verify phone number',
        });
        throw error;
      }
    },
    retry: false,
    onError,
    onSuccess,
  });
}
