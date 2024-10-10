import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import FirebaseStorage from '@react-native-firebase/storage';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '../../states/User';
import { IUser, IUserAccount } from '../../states/User/types';
import { CustomLogger } from '../../utils/CustomLogger';

export function useAccountUpdateMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (data: IUser) => void;
} = {}) {
  const { user } = useUser();

  const collection = FirebaseFirestore().collection('Users');

  return useMutation({
    mutationFn: async ({
      account,
      attachments,
    }: {
      account: IUserAccount;
      attachments: {
        document: {
          documentType: string;
          files: string[];
        };
        selfie: {
          files: string[];
        };
      } | null;
    }) => {
      try {
        let attachmentsPayload;

        await collection.doc(user?.uid).set(
          {
            account: {
              status: 'PROCESSING',
              provider: user?.account?.provider || null,
              verification: user?.account?.verification || null,
            },
          },
          { merge: true },
        );

        if (attachments) {
          const storageBasePath = `users/${user?.uid}/accountAttachments/`;
          const documentImageRef = FirebaseStorage().ref(
            `${storageBasePath}/documentImage.jpg`,
          );
          const selfieImageRef = FirebaseStorage().ref(
            `${storageBasePath}/selfieImage.jpg`,
          );
          await documentImageRef.putFile(attachments?.document.files[0], {
            customMetadata: {
              originalPath: attachments?.document.files[0],
            },
          });
          await selfieImageRef.putFile(attachments?.selfie.files[0], {
            customMetadata: {
              originalPath: attachments?.selfie.files[0],
            },
          });
          const documentImageUrl = await documentImageRef.getDownloadURL();
          const selfieImageUrl = await selfieImageRef.getDownloadURL();
          attachmentsPayload = {
            documentType: attachments?.document.documentType,
            documentImage: documentImageUrl,
            selfieImage: selfieImageUrl,
          };
        }

        await collection.doc(user?.uid).set(
          {
            account: {
              ...account,
              attachments: attachments ? attachmentsPayload : null,
              retry: true,
            },
          },
          { merge: true },
        );
        return user as IUser;
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useAccountUpdateMutation',
          error: error,
          loggedUser: user,
          message: 'Error captured in ErrorBoundary',
        });
        throw error;
      }
    },
    onError,
    onSuccess,
    retry: false,
    throwOnError: false,
  });
}

export function useForceW2VerificationMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (data: IUser) => void;
} = {}) {
  const { user } = useUser();
  const collection = FirebaseFirestore().collection(`Users/${user?.uid}/admin`);
  return useMutation({
    mutationFn: async () => {
      try {
        await collection.doc('w2Verification').set({
          verified: true,
        });
        return user as IUser;
      } catch (error) {
        throw error;
      }
    },
    onError,
    onSuccess,
    retry: false,
    throwOnError: false,
  });
}
