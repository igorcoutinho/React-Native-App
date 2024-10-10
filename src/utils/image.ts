import { Image } from 'react-native';
import ImageResizer from 'react-native-image-resizer';

export const checkAndResizeImage = async (imageUri: string) => {
  try {
    const { width, height } = await getImageDimensions(imageUri);

    if (width > 536 || height > 356) {
      const resizedImage = await ImageResizer.createResizedImage(
        imageUri,
        536,
        356,
        'JPEG',
        100
      );

        return resizedImage;
    } else {
        return imageUri;
    }
  } catch (error) {
  }
};

const getImageDimensions = (imageUri: string) => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      imageUri,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => {
        reject(error);
      }
    );
  });
};
