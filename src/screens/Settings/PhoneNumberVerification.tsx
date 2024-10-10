import { VStack, useToast } from '@gluestack-ui/themed';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import {
  MainContainer,
  ScrollableContainer,
} from '../../components/MainContainer';
import { ToastComponent } from '../../components/Toast';
import { useUserConfirmPhoneNumberMutation } from '../../queries/User/useUserSignInWithPhoneNumberMutation';
import { useUser } from '../../states/User';
import { DelayedActivityIndicator } from '../SignIn/SignIn';
import { PhoneNumberVerificationForm } from '../SignIn/components/PhoneNumberVerificationForm';
import { SignInHeader } from '../SignIn/components/SignInHeader';

export const PhoneNumberVerification = () => {
  const toast = useToast();

  const { updateUserStorage } = useUser();

  const route = useRoute<RouteProp<any>>();
  const navigation = useNavigation<NavigationProp<any>>();

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
      updateUserStorage('phoneNumber', route.params?.phoneNumber);
      navigation.goBack();
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastComponent
            action="success"
            toastId={id}
            message="Phone number verified!"
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
          subTitle=""
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
          </VStack>
        </DelayedActivityIndicator>
      </ScrollableContainer>
    </MainContainer>
  );
};
