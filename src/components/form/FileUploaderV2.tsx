import { faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';
import { useCameraPermission, useGalleryPermission } from '../../utils/permission';
import { AvatarImage } from '../AvatarImage';
import { BaseButton } from '../BaseButton';
import { ToastComponent } from '../Toast';
import { Paragraph } from '../Typography';

export const FileUploaderV2 = ({
  value,
  onChange,
  showSelfieIllustration = false,
  showGalleryButton = false,
  showCameraButton = false,
  icon = faUser,
  cameraType = 'back',
  borderRadius = 100,
}: {
  /**
  * 
  * Represents the current value of the file uploaded.
  */
  value: string;
  /**
  * Callback function triggered when the value of the file uploader changes.
  */
  onChange: (value: any) => void;
  /**
  * Determines whether to display an illustration for taking a selfie.
  */
  showSelfieIllustration?: boolean;
  /**
   * Controls the visibility of the button to open the gallery for selecting an image.
   */
  showGalleryButton?: boolean;
  /**
  * Controls the visibility of the button to open the camera for capturing an image.
  */
  showCameraButton?: boolean;
  /**
  * Control the radius size of the image.
  */
  borderRadius?: number;
  /**
  * Specifies the icon to be displayed in the file uploader if no image is selected.
  */
  icon?: IconDefinition;
  /**
  * Specifies the default camera to be used when opening the camera. Can be either 'front' or 'back'.
  */
  cameraType?: 'front' | 'back';
}) => {
  const permission = useCameraPermission();
  const galleryPermission = useGalleryPermission();
  const toast = useToast();
  const [image, setImage] = useState<string>();

  const onRequestCamera = React.useCallback(
    async (source: 'camera' | 'gallery') => {
      try {
        let result;
        if (source === 'camera') {
          result = await launchCamera({
            includeBase64: true,
            mediaType: 'photo',
            quality: 0.4,
            saveToPhotos: true,
            cameraType: cameraType
          });
        } else if (source === 'gallery') {
          result = await launchImageLibrary({
            includeBase64: true,
            mediaType: 'photo',
            quality: 0.4
          });
        }

        if (result.didCancel) {
          return;
        }
        if (result.errorCode) {
          throw result;
        }
        onChange(result?.assets?.[0]);
        if (result?.assets?.[0]?.uri) {
          setImage(result?.assets?.[0]?.uri);
        }
      } catch (error: any) {
        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastComponent action="error" toastId={id} message={error?.errorCode} />
          ),
        });
      }
    },
    [value]
  );

  return (
    <View style={{ gap: 5 }}>
      <View>
        <View
          style={
            showSelfieIllustration
              ? {
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: '#f2f2f2',
                borderRadius: 100,
                height: 130,
                justifyContent: 'center',
                width: 130,
              }
              : {
                backgroundColor: '#f2f2f2',
                borderColor: 'transparent',
                borderRadius: 12,
                borderWidth: 2,
                height: 200,
              }
          }
        >
          {permission.ready || galleryPermission.ready ? (
            <AvatarImage
              value={image || value}
              borderRadius={borderRadius}
              useIcon
              icon={icon}
              iconSize={60}
            />
          ) : (
            <Paragraph align="center" color={Colors.attentionDark} size="small">
              You need to allow camera or gallery {'\n'}permission to continue
            </Paragraph>
          )}
        </View>
      </View>

      {(showGalleryButton || showCameraButton) && (
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {showGalleryButton && galleryPermission.ready && (
            <BaseButton
              flatten variant='secondary' onPress={() =>
                galleryPermission.ready ? onRequestCamera('gallery') : permission.requestCameraPermission
              }
            >
              Gallery
            </BaseButton>
          )}

          {showCameraButton && permission.ready && (
            <BaseButton
              flatten variant='secondary' style={{ marginLeft: showGalleryButton && showCameraButton ? Gap.regular : 0 }}
              onPress={() =>
                permission.ready ? onRequestCamera('camera') : permission.requestCameraPermission
              }
            >
              Camera
            </BaseButton>

          )}
        </View>
      )}
    </View>
  );
};
