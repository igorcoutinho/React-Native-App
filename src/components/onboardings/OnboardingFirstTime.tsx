import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import { useUser } from '../../states/User';
import { BaseButton } from '../BaseButton';
import { Dialog } from '../Dialog';
import { MainContainer } from '../MainContainer';
import { onboardings } from './onboardings';

export const OnboardingFirstTime = () => {
  const DialogRef = React.useRef<any>(null);
  const { user, isFetched, updateUserProperty } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.properties?.onboarding?.FirstTimeOnboarding && isFetched) {
        DialogRef?.current?.onOpen();
      }
    }, [user?.properties?.onboarding?.FirstTimeOnboarding, isFetched]),
  );

  const onboarding = onboardings.find(o => o.name === 'FirstTimeOnboarding');

  return (
    <Dialog ref={DialogRef}>
      <MainContainer>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {onboarding?.title}
        </Text>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {onboarding?.message}
        </Text>
        <BaseButton
          onPress={() => {
            updateUserProperty('properties.onboarding', {
              FirstTimeOnboarding: true,
            }).then(DialogRef?.current?.onDismiss);
          }}
          flatten
          label="Dismiss"
          variant="secondary"
        />
      </MainContainer>
    </Dialog>
  );
};
