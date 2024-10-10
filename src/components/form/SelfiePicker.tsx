/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCircleCheck,
  faImagePortrait,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useToast } from '@gluestack-ui/themed';
import React from 'react';
import { Pressable, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../theme/colors';
import { useCameraPermission } from '../../utils/permission';
import { ToastComponent } from '../Toast';
import { Bold, Paragraph } from '../Typography';

export const SelfiePicker = ({
  value,
  onChange,
}: {
  value: any;
  onChange: (value: any) => void;
}) => {
  const permission = useCameraPermission();
  const toast = useToast();

  const onRequestCamera = React.useCallback(async () => {
    try {
      let result;
      if (__DEV__) {
        result = await launchImageLibrary({
          includeBase64: true,
          mediaType: 'photo',
          quality: 0.4,
        });
      } else {
        result = await launchCamera({
          cameraType: 'front',
          includeBase64: true,
          mediaType: 'photo',
          quality: 0.4,
          saveToPhotos: true,
        });
      }
      if (result.didCancel) {
        return;
      }
      if (result.errorCode) {
        throw result;
      }
      onChange({
        image: result?.assets?.[0],
      });
    } catch (error: any) {
      console.log('onRequestCamera', error);
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastComponent
            action="error"
            toastId={id}
            message={error?.errorCode}
          />
        ),
      });
    }
  }, [value]);

  const selected = Boolean(value?.image?.uri);

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={() => {
            return {
              alignItems: 'center',
              backgroundColor: '#f2f2f2',
              borderColor: selected ? 'transparent' : 'transparent',
              borderRadius: 12,
              borderWidth: 2,
              height: 120,
              // height: 140,
              justifyContent: 'center',
            };
          }}
          onPress={
            permission.ready
              ? onRequestCamera
              : permission.requestCameraPermission
          }
        >
          {permission.ready ? (
            <View>
              <FontAwesomeIcon
                icon={faImagePortrait}
                color={selected ? Colors.success : Colors.grey}
                size={35}
              />
              {selected ? (
                <View
                  style={{
                    alignItems: 'center',
                    backgroundColor: Colors.white,
                    borderColor: Colors.grey,
                    borderRadius: 100,
                    borderWidth: 2,
                    height: 18,
                    justifyContent: 'center',
                    left: -3,
                    position: 'absolute',
                    top: -6,
                    width: 18,
                  }}
                >
                  <FontAwesomeIcon
                    size={10}
                    icon={faRotate}
                    color={Colors.grey}
                  />
                </View>
              ) : null}
              <View
                style={{
                  alignItems: 'center',
                  backgroundColor: selected
                    ? Colors.white
                    : Colors.brandSecondary,
                  borderRadius: 100,
                  height: 22,
                  justifyContent: 'center',
                  position: 'absolute',
                  right: -20,
                  top: -18,
                  width: 22,
                }}
              >
                {selected ? (
                  <FontAwesomeIcon
                    size={22}
                    icon={faCircleCheck}
                    color={Colors.success}
                  />
                ) : (
                  <Paragraph color={Colors.white}>
                    <Bold>!</Bold>
                  </Paragraph>
                )}
              </View>
            </View>
          ) : (
            <Paragraph align="center" color={Colors.attentionDark} size="small">
              You need to allow camera{'\n'}permission to continue.
            </Paragraph>
          )}
        </Pressable>
      </View>
    </View>
  );
};
