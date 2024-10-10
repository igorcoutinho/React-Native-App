import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { useUser } from '../../states/User';
import { BaseButton } from '../BaseButton';
import { Heading } from '../Typography';
import { onboardings } from './onboardings';

import WelcomeToYourAccountIllustration from '../../assets/welcomeToYourAccountIllustration.svg';
import { Size } from '../../theme/sizes';
import { DialogV2 } from '../DialogV2';
import { Box, Section } from '../elements/Section';

export const OnboardingAccount = () => {
  const DialogRef = React.useRef<any>(null);

  const [visible, setVisible] = React.useState(false);

  const { user, isFetched, updateUserStorage, getUserStorage } = useUser();

  const metadata: any = getUserStorage();

  useFocusEffect(
    React.useCallback(() => {
      if (!metadata?.OnboardingNewAccount && isFetched) {
        setVisible(true);
      }
    }, [metadata?.OnboardingNewAccount, isFetched]),
  );

  const onboarding = onboardings.find(o => o.name === 'OnboardingAccount');

  return (
    <DialogV2 autoHeight visible={visible}>
      <Box color="transparent" space={Size.xLarge}>
        <Section>
          <WelcomeToYourAccountIllustration
            width={'100%'}
            height={120}
            style={{ marginBottom: 10 }}
          />
          <Heading align="center" size="regular">
            {onboarding?.title}
          </Heading>
          <BaseButton
            onPress={() => {
              updateUserStorage('OnboardingNewAccount', true);
              setVisible(false);
            }}
          >
            Woohoo!
          </BaseButton>
        </Section>
      </Box>
    </DialogV2>
  );
};
