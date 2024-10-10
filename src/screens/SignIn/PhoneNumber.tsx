import { HStack, VStack, useToast } from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { BaseButtonInline } from '../../components/BaseButton';
import {
  MainContainer,
  ScrollableContainer,
} from '../../components/MainContainer';
import { ToastComponent } from '../../components/Toast';
import { Paragraph } from '../../components/Typography';
import { PublicNavigationNames } from '../../navigation/types';
import { useUserSignInMutation } from '../../queries/User/useUserSignInMutation';
import { useUserVerifyPhoneNumberMutation } from '../../queries/User/useUserVerifyPhoneNumberMutation';
import { DelayedActivityIndicator } from './SignIn';
import { SignInForm } from './components/SignInForm';
import { SignInHeader } from './components/SignInHeader';

export const PhoneNumber = () => {
  const [updatePhoneNumber, setUpdatePhoneNumber] = React.useState(false);

  const toast = useToast();

  const navigation = useNavigation<NavigationProp<any>>();

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
    onSuccess: confirmation => {
      navigation.navigate('PhoneNumberVerification', {
        phoneNumber: confirmation?.phoneNumber,
        verificationId: (confirmation as any)?.verificationId,
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
    onSuccess: () => {},
  });

  return (
    <MainContainer>
      <ScrollableContainer>
        <SignInHeader
          title="Welcome"
          subTitle="Use the form below to Sign In"
        />
        <DelayedActivityIndicator
          isLoading={useUserVerifyPhoneNumber.isPending}
        >
          <VStack space="2xl">
            <SignInForm
              enablePhoneNumberVerification={updatePhoneNumber}
              onClickForgotPassword={currentEmail => {
                navigation.navigate(PublicNavigationNames.ForgotPassword, {
                  currentEmail,
                });
              }}
              onSubmit={formData => {
                userSignInMutation.mutate({
                  email: formData.email,
                  password: formData.password,
                });
              }}
            />
            <HStack justifyContent="center">
              <Paragraph>Don't have an account? </Paragraph>
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
