import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export function useUserSignInWithPhoneNumberMutation({
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
    mutationFn: async ({ phoneNumber }: { phoneNumber?: string | null }) => {
      try {
        const confirmation = await FirebaseAuth().signInWithPhoneNumber(
          phoneNumber,
        );
        return { confirmation, phoneNumber };
      } catch (error) {
        throw error;
      }
    },
    retry: false,
    onError,
    onSuccess,
  });
}

export function useUserConfirmPhoneNumberMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: () => void;
} = {}) {
  return useMutation({
    mutationFn: async ({
      code,
      confirmation,
      origin,
      phoneNumber,
    }: {
      code: string;
      confirmation: FirebaseAuthTypes.ConfirmationResult;
      origin: string;
      phoneNumber: string | null;
    }) => {
      if (origin === 'SignUp') {
        try {
          const credential = FirebaseAuth.PhoneAuthProvider.credential(
            confirmation.verificationId,
            code,
          );
          await FirebaseAuth().currentUser?.linkWithCredential(credential);

          const collection = FirebaseFirestore().collection('Users');
          await collection.doc(FirebaseAuth().currentUser?.uid).set(
            {
              phoneNumber,
              updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );

          return FirebaseAuth().currentUser;
        } catch (error: Error | any) {
          CustomLogger({
            componentStack: 'useUserConfirmPhoneNumberMutation',
            error: error,
            message: 'Error captured in Confirm phone number',
          });
          throw error;
        }
      }
      if (origin === 'Profile') {
        try {
          const credential = FirebaseAuth.PhoneAuthProvider.credential(
            confirmation.verificationId,
            code,
          );

          const collection = FirebaseFirestore().collection('Users');
          await collection.doc(FirebaseAuth().currentUser?.uid).set(
            {
              phoneNumber,
              updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );

          return FirebaseAuth().currentUser;
        } catch (error) {
          throw error;
        }
      }

      else {
        try {
          await confirmation.confirm(code);
          return FirebaseAuth().currentUser;
        } catch (error) {
          throw error;
        }
      }
    },
    retry: false,
    onError,
    onSuccess,
  });
}
