import { faMobileScreen } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../components/BaseButton';
import { DialogV2 } from '../../components/DialogV2';
import { Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { FileUploaderV2 } from '../../components/form/FileUploaderV2';
import { FormFieldTitle } from '../../components/form/FormFieldTitle';
import { InputText } from '../../components/form/InputText';
import { MainContainer } from '../../components/MainContainer';
import { ToastComponent } from '../../components/Toast';
import { useViewLocker } from '../../components/ViewLocker';
import { useUserUpdateMutation } from '../../queries/User/useUserUpdateMutation';
import { useUserVerifyPhoneNumberMutation } from '../../queries/User/useUserVerifyPhoneNumberMutation';
import { useUser } from '../../states/User';
import { Gap, Size } from '../../theme/sizes';
import { PhoneNumberForm } from './PhoneNumberForm';


export const SettingsProfile = () => {
  const toast = useToast();
  const [displayName, setDisplayName] = React.useState<string>();
  const [file, setFile] = React.useState<any>();
  const [phone, setPhone] = React.useState<string>();
  const { user } = useUser();
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation<NavigationProp<any>>();
  const { toggleLocker } = useViewLocker();

  React.useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setFile(user.photoURL);
      setPhone(user.phoneNumber)
    }
  }, [user]);

  const userUpdateMutation = useUserUpdateMutation({
    onError: error => {

      toggleLocker(false);
      Toast.show({
        type: 'error',
        text1: 'Profile updated failed',
        text2: error.message,
      });
    },
    onSuccess: () => {

      toggleLocker(false);
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
    },
  });

  const updateUserData = async () => {
    try {
      toggleLocker(true);
      let attachmentPayload = null;
      if (file?.uri) {
        attachmentPayload = file ? {
          document: {
            documentType: file?.type,
            path: file?.uri,
          },
        }
          : null;
      }
      await userUpdateMutation.mutate({
        displayName,
        attachment: attachmentPayload,
        userId: user.uid
      });
    }
    catch (e) {
      toggleLocker(false);
    }
  }

  const onError = (error: any) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <ToastComponent action="error" toastId={id} message={error.message} />
      ),
    });
  };

  const useUserVerifyPhoneNumber = useUserVerifyPhoneNumberMutation({
    onError,
    onSuccess: ({ confirmation, phoneNumber }) => {
      setVisible(false);
      navigation.navigate('PhoneNumberVerification', {
        confirmation,
        origin: 'Profile',
        phoneNumber
      });
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastComponent
            action="success"
            toastId={id}
            message="Check your messages app"
          />
        ),
      });
    },
  });

  return (
    <MainContainer>
      <View
        style={{
          flex: 1,
          display: 'flex',
        }}
      >
        <Section >
          <FormFieldTitle title={'User Photo'} />
          <FileUploaderV2
            onChange={setFile}
            value={file?.uri || file}
            showSelfieIllustration={true}
            showCameraButton
            showGalleryButton
            cameraType='front'
            borderRadius={100}
          />
        </Section>
        <View >
          <Spacer size={Size.regular} />

          <Section >
            <FormFieldTitle title={'Display Name'} />
            <InputText
              onChange={value => setDisplayName(value)}
              placeholder="Display Name"
              value={displayName}
              disabled
            />
          </Section>

          <Spacer size={Size.regular} />

          <Section>

            <FormFieldTitle title={'Phone Number'} />

            <TouchableOpacity>
              <InputText
                autoComplete="tel"
                keyboardType="phone-pad"
                onChange={value => setPhone(value)}
                placeholder="+## #### ### ####"
                value={phone || ""}
                leftIcon={faMobileScreen}
                disabled={true}
                onPressIn={() => setVisible(!visible)}
              />
            </TouchableOpacity>
          </Section>

        </View>

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, gap: Gap.medium }}>
          <BaseButton
            grow onPress={() => updateUserData()}
            disabled={userUpdateMutation.isPending}
          >
            Save
          </BaseButton>
        </View>
      </View>

      <DialogV2 autoHeight visible={visible}>
        <Section>
          <PhoneNumberForm
            enablePhoneNumberVerification
            onSubmit={formData => {
              useUserVerifyPhoneNumber.mutate({
                phoneNumber: formData.phoneNumber,
              });
            }}
            onCancel={() => setVisible(false)}
          />
        </Section>
      </DialogV2>
    </MainContainer>
  );
};
