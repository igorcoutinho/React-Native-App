import { HStack, useToast, VStack } from '@gluestack-ui/themed';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import { analytics } from '../..';
import { BaseButtonInline } from '../../components/BaseButton';
import { ScrollableContainer } from '../../components/MainContainer';
import { ToastComponent } from '../../components/Toast';
import { PublicNavigationNames } from '../../navigation/types';
import { useUserSignUpMutation } from '../../queries/User/useUserSignUpMutation';
import { useUserVerifyPhoneNumberMutation } from '../../queries/User/useUserVerifyPhoneNumberMutation';
import { useUser } from '../../states/User';
import { cleanExtraBlankSpaces } from '../../utils/utilities';
import { SignInHeader } from './components/SignInHeader';
import { SignUpForm } from './components/SignUpForm';
import { DelayedActivityIndicator } from './SignIn';

export const SignUp = () => {
  const [userAlreadyExists, setUserAlreadyExists] = React.useState(false);
  const toast = useToast();

  const navigation = useNavigation<NavigationProp<any>>();

  const { updateUserStorage } = useUser();

  const onError = (error: any) => {
    if (error.code === 'auth/email-already-in-use') {
      setUserAlreadyExists(true);
    }
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <ToastComponent action="error" toastId={id} message={error?.message} />
      ),
    });
  };

  const userSignUpMutation = useUserSignUpMutation();

  const useUserVerifyPhoneNumber = useUserVerifyPhoneNumberMutation({
    onError,
    onSuccess: ({ confirmation, phoneNumber }) => {
      navigation.navigate('PhoneNumberVerification', {
        confirmation,
        origin: 'SignUp',
        phoneNumber,
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
    <ScrollableContainer>
      <SignInHeader title="Sign Up" subTitle="" />
      <DelayedActivityIndicator isLoading={userSignUpMutation.isPending}>
        <VStack space="2xl">
          <SignUpForm
            onSubmit={formData => {

              const editForm = { ...formData, fullName: cleanExtraBlankSpaces(formData.fullName) }

              userSignUpMutation
                .mutateAsync(editForm)
                .then(async () => {
                  try {
                    await analytics().logSignUp({ method: 'email' });
                  } catch (error) { }
                  updateUserStorage('signedInAt', new Date().toISOString());
                  updateUserStorage('verified', true); // TODO: remove this!
                  // updateUserStorage('phoneNumber', formData.phoneNumber);
                  // useUserVerifyPhoneNumber.mutate({
                  //   phoneNumber: formData.phoneNumber,
                  // });
                })
                .catch(onError);
            }}
          />
          {userAlreadyExists ? (
            <VStack alignItems="center" space="sm">
              <Text>Looks like you already have an account.</Text>
              <BaseButtonInline
                onPress={() =>
                  navigation.navigate(PublicNavigationNames.SignIn)
                }
              >
                Click here to Sign In
              </BaseButtonInline>
            </VStack>
          ) : (
            <HStack justifyContent="center">
              <Text>Already have an account? </Text>
              <BaseButtonInline
                onPress={() =>
                  navigation.navigate(PublicNavigationNames.SignIn)
                }
              >
                Sign In
              </BaseButtonInline>
            </HStack>
          )}
        </VStack>
      </DelayedActivityIndicator>
    </ScrollableContainer>
  );
};
