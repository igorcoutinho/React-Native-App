import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainContainer } from '../../components/MainContainer';
import { Heading, Paragraph } from '../../components/Typography';
const UnderConstructionIllustration =
  require('../../assets/underConstructionIllustration.svg').default;

export const Dashboard = () => {
  const insets = useSafeAreaInsets();
  return (
    <MainContainer>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <View
          style={{ alignItems: 'center', marginTop: -(insets.bottom + 70) }}
        >
          <UnderConstructionIllustration
            height={140}
            style={{ marginBottom: 10 }}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Heading align="center">Come back here soon!</Heading>
          <Paragraph align="center">
            We are build an awesome dashboard for you. Lots of cool features,
            insights and more.
          </Paragraph>
        </View>
      </View>
    </MainContainer>
  );
};
