import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { Text } from 'react-native';
import { useUser } from '../../states/User';
import { BaseButton } from '../BaseButton';
import { Dialog } from '../Dialog';
import { MainContainer } from '../MainContainer';
import { onboardings } from './onboardings';

export const OnboardingWhatIsAWhip = () => {
  const DialogRef = React.useRef<any>(null);
  const { user, isFetched, updateUserProperty } = useUser();

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.properties?.onboarding?.WhatIsAWhip && isFetched) {
        DialogRef?.current?.onOpen();
      }
    }, [user?.properties?.onboarding?.WhatIsAWhip, isFetched]),
  );

  const onboarding = onboardings.find(o => o.name === 'WhatIsAWhip');

  return (
    <Dialog ref={DialogRef}>
      <MainContainer>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {onboarding?.title}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {onboarding?.message}
        </Text>
        <BaseButton
          onPress={() => {
            updateUserProperty('properties.onboarding', {
              WhatIsAWhip: true,
            }).then(DialogRef?.current?.onDismiss);
          }}
          flatten
          label="Lets create your first Whip!"
          variant="secondary"
        />
      </MainContainer>
    </Dialog>
  );
};
