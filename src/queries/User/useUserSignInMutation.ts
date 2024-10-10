import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { NativeModules } from 'react-native';
import { CustomLogger } from '../../utils/CustomLogger';
const { MySharedStorage } = NativeModules;

export function useUserSignInMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (user: FirebaseAuthTypes.UserCredential['user']) => void;
} = {}) {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
      phoneNumber?: string;
    }) => {
      try {
        const response = await FirebaseAuth().signInWithEmailAndPassword(
          email,
          password,
        );
        await MySharedStorage?.setValue(String(password), 'userPassword');
        return response.user;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useUserSignInMutation',
          error: error,
          message: 'Error captured in sign ',
        });
        throw error;
      }
    },
    retry: false,
    onError,
    onSuccess,
  });
}
