/* eslint-disable react-hooks/exhaustive-deps */
import {
  faCircleCheck,
  faIdCard,
  faPassport,
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
import { InputSelect } from './InputSelect';

export const FileUploader = ({
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
        gap: 5,
        flex: 1,
      }}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          style={() => {
            return {
              alignItems: 'center',
              backgroundColor: '#f2f2f2',
              borderColor: 'transparent',
              borderRadius: 12,
              borderWidth: 2,
              flex: 1,
              justifyContent: 'center',
              height: 80,
              // height: 93,
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
              <View>
                <FontAwesomeIcon
                  icon={
                    value?.documentType === 'drivingLicense'
                      ? faIdCard
                      : value?.documentType === 'passport'
                      ? faPassport
                      : faIdCard
                  }
                  color={selected ? Colors.success : Colors.grey}
                  size={30}
                />
              </View>
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
                    left: -8,
                    position: 'absolute',
                    top: -2,
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
                  right: -27,
                  top: -8,
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
      <InputSelect
        value={value?.documentType}
        onChange={documentType => onChange({ ...value, documentType })}
        placeholder="Select an option"
        options={[
          { label: 'Driving License', value: 'drivingLicense' },
          { label: 'Passport', value: 'passport' },
        ]}
        leftAccessory={
          <Paragraph style={{ marginRight: -5 }}>
            <Bold>Document Type:</Bold>
          </Paragraph>
        }
        rightAccessory={
          value?.documentType ? (
            <FontAwesomeIcon
              icon={faCircleCheck}
              color={Colors.success}
              size={20}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                backgroundColor: value?.documentType
                  ? Colors.white
                  : Colors.brandSecondary,
                borderRadius: 100,
                height: 20,
                justifyContent: 'center',
                width: 20,
              }}
            >
              <Paragraph color={Colors.white}>
                <Bold>!</Bold>
              </Paragraph>
            </View>
          )
        }
      />
    </View>
  );
};
