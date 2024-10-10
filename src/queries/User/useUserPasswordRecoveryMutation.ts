import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export function useUserPasswordRecoveryMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: () => void;
}) {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      try {
        const response = await FirebaseAuth().sendPasswordResetEmail(email);
        return response;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAccountBalanceSyncMutation',
          error: error,
          message: 'Error recovery user password',
        });

        throw error;
      }
    },
    retry: false,
    onError,
    onSuccess,
  });
}
