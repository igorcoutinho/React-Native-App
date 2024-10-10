import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import FirebaseStorage from '@react-native-firebase/storage';
import { useMutation } from '@tanstack/react-query';
import { IWhip } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';
import { checkAndResizeImage } from '../../utils/image';
import { invalidateWhipPagedListQuery } from './useWhipPagedListQuery';

export function useWhipUpdateImageMutation({
  onError,
  onSuccess,
}: {
  onError?: (error: FirebaseAuthTypes.NativeFirebaseAuthError) => void;
  onSuccess?: (newWhip: IWhip) => void;
} = {}) {

  const collection = FirebaseFirestore().collection('Whips');

  return useMutation({
    mutationFn: async ({
      id,
      attachment,
      newWhipName
    }: {
      id: string;
      newWhipName?: string;
      attachment?: {
        document: {
          documentType: string;
          path: string;
        }
      } | null;
    }) => {
      try {

        if (attachment && attachment?.document) {
          const newImage = await checkAndResizeImage(attachment?.document.path);

          const storageBasePath = `whips/${id}/uploads//`;
          const documentImageRef = FirebaseStorage().ref(
            `${storageBasePath}/attachment.jpg`,
          );

          await documentImageRef.putFile(attachment?.document.path, {
            customMetadata: {
              originalPath: newImage.toString()
            },
          });

          const documentImageUrl = await documentImageRef.getDownloadURL();

          collection.doc(id).set(
            {
              attachment: documentImageUrl,
              name: newWhipName
            },
            { merge: true }
          )
        } else {
          collection.doc(id).update(
            {
              name: newWhipName
            }
          )
        }

        const whipSnapshot = await collection.doc(id).get();
        if (!whipSnapshot.exists) {
          throw new Error('Whip not found');
        }
        invalidateWhipPagedListQuery();
        return { whipSnapshot, id: whipSnapshot.id };
      } catch (error: Error | any) {
        CustomLogger({
          componentStack: 'useWhipUpdateImageMutation',
          error: error,
          message: 'Error captured in whip update image',
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
