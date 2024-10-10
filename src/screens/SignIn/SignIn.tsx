import { HStack, VStack, useToast } from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { analytics } from '../..';
import { BaseButtonInline } from '../../components/BaseButton';
import {
  MainContainer,
  ScrollableContainer,
} from '../../components/MainContainer';
import { ToastComponent } from '../../components/Toast';
import { Paragraph } from '../../components/Typography';
import { PublicNavigationNames } from '../../navigation/types';
import { useUserSignInMutation } from '../../queries/User/useUserSignInMutation';
import { useUserSignInWithPhoneNumberMutation } from '../../queries/User/useUserSignInWithPhoneNumberMutation';
import { useUser } from '../../states/User';
import { SignInForm } from './components/SignInForm';
import { SignInHeader } from './components/SignInHeader';

export const DelayedActivityIndicator = ({
  children,
  isLoading,
}: {
  children?: React.ReactNode;
  isLoading?: boolean;
}) => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    if (isLoading) {
      setShow(true);
      return;
    }
    const timeout = setTimeout(() => {
      setShow(false);
    }, 1100);
    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  return (
    <>
      {show ? (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            height: '100%',
            justifyContent: 'center',
            position: 'absolute',
            width: '100%',
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color="#867bdf" />
        </View>
      ) : null}
      {children}
    </>
  );
};

export const FormFieldsWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, paddingBottom: 20 }}
    >
      <TouchableWithoutFeedback accessible={false} onPress={Keyboard.dismiss}>
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export const SignIn = () => {
  const [updatePhoneNumber, setUpdatePhoneNumber] = React.useState(false);

  const toast = useToast();

  const { updateUserStorage, getUserStorage } = useUser();

  const navigation = useNavigation<NavigationProp<any>>();

  const onError = (error: any) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <ToastComponent action="error" toastId={id} message={error.message} />
      ),
    });
  };

  const useUserVerifyPhoneNumber = useUserSignInWithPhoneNumberMutation({
    onError,
    onSuccess: confirmation => {
      navigation.navigate('PhoneNumberVerification', {
        confirmation: confirmation?.confirmation,
        phoneNumber: confirmation?.phoneNumber,
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

  const userSignInMutation = useUserSignInMutation({
    onError,
    onSuccess: async (data) => {
      try {
        await analytics().logLogin({ method: 'email' });
      } catch (error) { }
      updateUserStorage('signedInAt', new Date().toISOString());
      updateUserStorage('verified', true); // TODO: remove this!
      // const phoneNumber = data?.phoneNumber || getUserStorage()?.phoneNumber;
      // if (phoneNumber) {
      //   useUserVerifyPhoneNumber.mutate({
      //     phoneNumber,
      //   });
      //   return;
      // }
      // setUpdatePhoneNumber(true);
    },
  });

  return (
    <MainContainer>
      <ScrollableContainer>
        <SignInHeader
          title="Welcome"
          subTitle="Use the form below to Sign In"
        />
        <DelayedActivityIndicator isLoading={userSignInMutation.isPending}>
          <VStack space="2xl">
            <SignInForm
              enablePhoneNumberVerification={updatePhoneNumber}
              onClickForgotPassword={currentEmail => {
                navigation.navigate(PublicNavigationNames.ForgotPassword, {
                  currentEmail,
                });
              }}
              onSubmit={formData => {
                if (formData?.phoneNumber) {
                  updateUserStorage('phoneNumber', formData?.phoneNumber);
                }
                userSignInMutation.mutate({
                  email: formData.email,
                  password: formData.password,
                });
              }}
            />
            <HStack justifyContent="center">
              <Paragraph>Do you want an account?</Paragraph>
              <BaseButtonInline
                onPress={() =>
                  navigation.navigate(PublicNavigationNames.SignUp)
                }
              >
                Create one here!
              </BaseButtonInline>
            </HStack>
          </VStack>
        </DelayedActivityIndicator>
      </ScrollableContainer>
    </MainContainer>
  );
};
