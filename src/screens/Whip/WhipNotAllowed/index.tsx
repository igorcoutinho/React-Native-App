import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Heading } from '../../../components/Typography';
import { Section } from '../../../components/elements/Section';
import { useWhipContext } from '../../../states/Whip';

export const WhipNotAllowed = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { isFetching } = useWhipContext();
  return (
    <>
      <ModalHeader
        onPress={() => {
          navigation.navigate('MyWhips');
        }}
      />
      <MainContainer>
        <Heading>{isFetching ? '...' : 'Not Allowed'}</Heading>
      </MainContainer>
      <FloatingBottom>
        <Section>
          {!isFetching ? (
            <BaseButton
              variant="muted"
              onPress={() => navigation.navigate('MyWhips')}
            >
              Leave
            </BaseButton>
          ) : null}
        </Section>
      </FloatingBottom>
    </>
  );
};
