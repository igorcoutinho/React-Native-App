import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import FirebaseStorage from '@react-native-firebase/storage';
import { useMutation } from '@tanstack/react-query';
import { CustomLogger } from '../../utils/CustomLogger';

export function useUserUpdateMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: () => void;
} = {}) {

  return useMutation({
    mutationFn: async ({
      displayName,
      attachment,
      userId,
    }: {
      userId?: string,
      displayName: string;
      attachment: {
        document: {
          documentType: string;
          path: string;
        }
      } | null;
    }) => {

      try {

        const collection = FirebaseFirestore().collection('Users');
        if (attachment && attachment.document && attachment.document.path) {
          const storageBasePath = `users/${FirebaseAuth().currentUser?.uid}/userAttachments/`;
          const documentImageRef = FirebaseStorage().ref(
            `${storageBasePath}/profileImage.jpg`,
          );

          await documentImageRef.putFile(attachment?.document.path, {
            customMetadata: {
              originalPath: attachment?.document.path
            },
          });

          const documentImageUrl = await documentImageRef.getDownloadURL();

          collection.doc(userId).update(
            {
              displayName: displayName,
              photoURL: documentImageUrl,
            }
          );

          return { displayName, attachment };

        } else {

          collection.doc(userId).update(
            {
              displayName: displayName,
            }
          );
        }
        return { displayName, attachment };
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useUserUpdateMutation',
          error: error,
          message: 'Error captured in update user profile',
        });
        console.log('useUserUpdateMutation', error)
        throw error;
      }

    },
    onError,
    onSuccess,
    retry: false,
    throwOnError: false,
  });
}
