import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Heading } from '../../../components/Typography';
const UnderConstructionIllustration =
  require('../../../assets/underConstructionIllustration.svg').default;

export const AccountBalance = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const insets = useSafeAreaInsets();

  return (
    <>
      <ModalHeader />
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
          </View>
        </View>
      </MainContainer>
      <FloatingBottom>
        <BaseButton variant="muted" onPress={() => navigation.goBack()}>
          Close
        </BaseButton>
      </FloatingBottom>
    </>
  );
};
