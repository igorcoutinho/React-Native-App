import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import Toast from 'react-native-toast-message';
import { BaseButton } from '../../../components/BaseButton';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Heading, Paragraph } from '../../../components/Typography';
import { useAccountBalanceSyncMutation } from '../../../queries/Account/useAccountBalanceSyncMutation';

export const AccountHelpDialog = ({
  onPressToDismiss,
}: {
  onPressToDismiss?: () => void;
}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const accountBalanceSyncMutation = useAccountBalanceSyncMutation({
    onError: error => {
      Toast.show({
        type: 'error',
        text1: 'Balance Reconciliation Failed',
        text2: error.message,
      });
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Balance Reconciliation Success',
        text2: 'If there are any discrepancies, please contact support.',
      });
    },
  });

  return (
    <>
      <ModalHeader onPress={onPressToDismiss} />
      <MainContainer>
        <Section>
          <Heading align="center">Whip Account Help</Heading>
          <Paragraph align="center">
            Need help? Please contact us for assistance.
          </Paragraph>
          <BaseButton
            flatten
            onPress={() => {
              onPressToDismiss();
              navigation.navigate('SettingsSupport');
            }}
          >
            Support
          </BaseButton>
          <LineSeparator />
          {/* <Paragraph align="center">
            If you find your balance is incorrect, please click on the button
            below.
          </Paragraph>
          <BaseButton
            variant="secondary"
            disabled={accountBalanceSyncMutation.isPending}
            onPress={() => accountBalanceSyncMutation.mutate()}
          >
            {accountBalanceSyncMutation.isPending
              ? 'Please Wait'
              : 'Reconciliate Balance'}
          </BaseButton> */}
        </Section>
      </MainContainer>
      <FloatingBottom defaultPadding>
        <BaseButton variant="muted" onPress={onPressToDismiss}>
          Close
        </BaseButton>
      </FloatingBottom>
    </>
  );
};
