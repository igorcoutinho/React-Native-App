import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStripe } from '@stripe/stripe-react-native';
import React from 'react';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Heading } from '../../../components/Typography';
import { useViewLocker } from '../../../components/ViewLocker';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { useUser } from '../../../states/User';
import { useWhipContext } from '../../../states/Whip';

export const WhipConfiguration = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const { toggleLocker } = useViewLocker();

  const [amount, setAmount] = React.useState('');
  const [formattedAmount, setFormattedAmount] = React.useState('');

  const { whip } = useWhipContext();
  const { user } = useUser();

  return (
    <>
      <ModalHeader
        onPress={() => {
          navigation.navigate('MyWhips');
        }}
      />
      <MainContainer>
        <Spacer />
        <Heading>Refund options:</Heading>
        <LineSeparator />
        <Section>
          {/* <Paragraph>Refund options</Paragraph>
          <BaseButton>Split Equally</BaseButton>
          <BaseButton>Split Equally Among Friends</BaseButton> */}
          <BaseButton>Move all Balance to my Personal Account</BaseButton>
          {/* <LineSeparator />
          <Section gap={Gap.x2Small}>
            <Paragraph>Owner: {user.displayName}</Paragraph>
            {whip?.friends?.map(friend => (
              <Paragraph key={friend.phoneNumbers[0].number}>
                Friend: {friend.givenName}
              </Paragraph>
            ))}
          </Section>
          <LineSeparator /> */}
        </Section>
        {/* <BaseButton variant="danger">Archive Whip</BaseButton> */}
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
