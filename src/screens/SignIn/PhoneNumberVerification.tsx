import { HStack, VStack, useToast } from '@gluestack-ui/themed';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import { BaseButtonInline } from '../../components/BaseButton';
import {
  MainContainer,
  ScrollableContainer,
} from '../../components/MainContainer';
import { ToastComponent } from '../../components/Toast';
import { PublicNavigationNames } from '../../navigation/types';
import { useUserConfirmPhoneNumberMutation } from '../../queries/User/useUserSignInWithPhoneNumberMutation';
import { useUser } from '../../states/User';
import { DelayedActivityIndicator } from './SignIn';
import { PhoneNumberVerificationForm } from './components/PhoneNumberVerificationForm';
import { SignInHeader } from './components/SignInHeader';

export const PhoneNumberVerification = () => {
  const toast = useToast();

  const { updateUserStorage } = useUser();

  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  const onError = (error: any) => {
    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <ToastComponent action="error" toastId={id} message={error.message} />
      ),
    });
  };

  const useUserVerifyPhoneNumberCode = useUserConfirmPhoneNumberMutation({
    onError,
    onSuccess: () => {
      updateUserStorage('verified', true);
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastComponent
            action="success"
            toastId={id}
            message="Phone number verified, you're in!"
          />
        ),
      });
    },
  });

  return (
    <MainContainer>
      <ScrollableContainer>
        <SignInHeader
          title="Verify your phone number"
          subTitle="Don't worry, last step, verify your app message to get the code!"
        />
        <DelayedActivityIndicator
          isLoading={useUserVerifyPhoneNumberCode.isPending}
        >
          <VStack space="2xl">
            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
              SMS sent to: {route.params?.phoneNumber}
            </Text>
            <PhoneNumberVerificationForm
              onSubmit={formData => {
                useUserVerifyPhoneNumberCode.mutate({
                  code: formData.code,
                  confirmation: route.params?.confirmation,
                  origin: route.params?.origin,
                  phoneNumber: route.params?.phoneNumber,
                });
              }}
            />
            <HStack justifyContent="center">
              <Text>Already verified? </Text>
              <BaseButtonInline
                onPress={() =>
                  navigation.navigate(PublicNavigationNames.SignIn)
                }
              >
                Sign In
              </BaseButtonInline>
            </HStack>
          </VStack>
        </DelayedActivityIndicator>
      </ScrollableContainer>
    </MainContainer>
  );
};
