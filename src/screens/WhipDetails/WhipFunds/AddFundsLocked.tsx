import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Paragraph } from '../../../components/Typography';
import { HeaderWithImage } from '../../../components/elements/HeaderWithImage';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { useWhipContext } from '../../../states/Whip';
import { toCurrencyPresentation } from '../../../utils/masks';
const FundsLockedIllustration =
  require('../../../assets/fundsLockedIllustration.svg').default;

export const AddFundsLocked = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { me } = useWhipContext();

  return (
    <>
      <ModalHeader
        onPress={() => {
          navigation.navigate('MyWhips');
        }}
      />
      <MainContainer>
        <HeaderWithImage
          title="No Budget Left"
          renderImage={<FundsLockedIllustration height={120} />}
          description="You have reached your budget for this Whip."
        />
        <LineSeparator />
        <Spacer />
        <Section>
          <Paragraph>The Whip Master configured {toCurrencyPresentation((me?.budget || 0).toString())} of budget for your participation.</Paragraph>
          <Paragraph size="xSmall">
            If you think you should be able to upload more funds, please contact the Whip Master.
          </Paragraph>
        </Section>
      </MainContainer>
      <FloatingBottom>
        <Section>
          <BaseButton variant="muted" onPress={() => navigation.goBack()}>
            Back
          </BaseButton>
        </Section>
      </FloatingBottom>
    </>
  );
};
