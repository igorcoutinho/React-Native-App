import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export function useUserSignUpMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (user: FirebaseAuthTypes.User) => void;
} = {}) {
  return useMutation({
    mutationFn: async ({
      email,
      fullName,
      password,
      phoneNumber,
    }: {
      email: string;
      fullName: string;
      password: string;
      phoneNumber?: string;
    }) => {
      try {
        const response = await FirebaseAuth().createUserWithEmailAndPassword(
          email,
          password,
        );
        await response.user.sendEmailVerification();
        await response.user?.updateProfile({ displayName: fullName });

        const collection = FirebaseFirestore().collection('Users');
        await collection.doc(response.user.uid).set(
          {
            email,
            displayName: fullName,
            phoneNumber: phoneNumber?.replace(/ /g, ''),
            createdAt: FirebaseFirestore.FieldValue.serverTimestamp(),
          },
          { merge: true },
        );

        return response.user;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useUserSignUpMutation',
          error: error,
          message: 'Error captured in sing up',
        });
        throw error;
      }
    },
    retry: false,
    onError,
    onSuccess,
    throwOnError: false,
  });
}
