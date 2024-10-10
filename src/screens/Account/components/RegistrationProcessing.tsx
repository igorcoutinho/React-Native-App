import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AccountBadge } from '../../../components/AccountBanner';
import { MainContainer } from '../../../components/MainContainer';
import { useTabsBarBottomSize } from '../../../components/TabsBar';
import { Heading } from '../../../components/Typography';
import { Section } from '../../../components/elements/Section';
import { Colors } from '../../../theme/colors';
import { Gap } from '../../../theme/sizes';

export const RegistrationProcessing = () => {
  return (
    <MainContainer paddingBottom={useTabsBarBottomSize()}>
      <Animated.View
        entering={FadeIn.delay(10).duration(230)}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Section gap={Gap.large}>
          <AccountBadge
            color={Colors.brandSecondary}
            icon="spinner"
            style={{ alignSelf: 'center', transform: [{ scale: 1.5 }] }}
          />
          <Heading
            size="small"
            color={Colors.brandSecondaryDark}
            align="center"
          >
            SUBMITTING REGISTRATION
          </Heading>
        </Section>
      </Animated.View>
    </MainContainer>
  );
};
