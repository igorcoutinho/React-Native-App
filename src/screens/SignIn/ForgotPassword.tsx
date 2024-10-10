import { useToast } from '@gluestack-ui/themed';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React from 'react';
import { ScrollableContainer } from '../../components/MainContainer';
import { ToastComponent } from '../../components/Toast';
import { PublicNavigationNames } from '../../navigation/types';
import { useUserPasswordRecoveryMutation } from '../../queries/User/useUserPasswordRecoveryMutation';
import { DelayedActivityIndicator } from './SignIn';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { SignInHeader } from './components/SignInHeader';

export const ForgotPassword = () => {
  const toast = useToast();

  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  const userPasswordRecoveryMutation = useUserPasswordRecoveryMutation({
    onError: error => {
      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastComponent action="error" toastId={id} message={error.message} />
        ),
      });
    },
    onSuccess: () => {
      toast.show({
        onCloseComplete: () => {
          navigation.navigate(PublicNavigationNames.SignIn);
        },
        placement: 'top',
        render: ({ id }) => (
          <ToastComponent
            action="success"
            toastId={id}
            message="We have sent you a link to change your password in your email."
          />
        ),
      });
    },
  });

  return (
    <ScrollableContainer>
      <SignInHeader
        title="Password Recovery"
        subTitle="Check your email and click in the link to change your password"
      />
      <DelayedActivityIndicator
        isLoading={userPasswordRecoveryMutation.isPending}
      >
        <ForgotPasswordForm
          initialValues={{
            email: route.params?.currentEmail,
          }}
          onSubmit={formData => {
            userPasswordRecoveryMutation.mutate({
              email: formData.email,
            });
          }}
        />
      </DelayedActivityIndicator>
    </ScrollableContainer>
  );
};
