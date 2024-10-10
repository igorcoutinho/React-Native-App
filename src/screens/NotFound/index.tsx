import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { BaseButton } from '../../components/BaseButton';
import { MainContainer } from '../../components/MainContainer';
import { Heading } from '../../components/Typography';

export const NotFound = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
    <MainContainer>
      <View
        style={{
          alignItems: 'center',
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Heading>Oops... I think you are lost.</Heading>
        <BaseButton
          alignSelf="stretch"
          onPress={() => navigation.navigate('Internal')}
        >
          Go back
        </BaseButton>
      </View>
    </MainContainer>
  );
};
