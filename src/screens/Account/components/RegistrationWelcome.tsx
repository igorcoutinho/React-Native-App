import {
  faCheck,
  faFileLines,
  faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { storage } from '../../..';
import { AccountBadge } from '../../../components/AccountBanner';
import { BaseButton } from '../../../components/BaseButton';
import { DialogV2 } from '../../../components/DialogV2';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { useTabsBarBottomSize } from '../../../components/TabsBar';
import { Bold, Heading, Paragraph } from '../../../components/Typography';
import { Box, Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { InternalNavigationNames } from '../../../navigation/types';
import { Colors } from '../../../theme/colors';
import { Gap, Size } from '../../../theme/sizes';
import { DescriptiveButton } from '../../WhipDetails/components';

export const RegistrationWelcome = ({
  onPressToSubmit,
}: {
  onPressToSubmit: () => void;
}) => {
  const [visible, setVisible] = React.useState(false);
  const [accountReady, setAccountReady] = React.useState<any>(null);

  const navigation = useNavigation<NavigationProp<any>>();

  const submitReady = accountReady;

  React.useEffect(() => {
    const listener = storage.addOnValueChangedListener((key: string) => {
      if (key === 'accountData') {
        setAccountReady(true);
      }
    });
    setAccountReady(!!storage.getString('accountData'));
    return () => listener.remove();
  }, []);

  return (
    <>
      <MainContainer paddingBottom={useTabsBarBottomSize()}>
        <Section gap={Gap.large} spaceVertical={Size.large}>
          <AccountBadge
            color={Colors.brand}
            icon={faPlayCircle}
            style={{ alignSelf: 'center', transform: [{ scale: 1.5 }] }}
          />
          <Section>
            <Heading size="small" color={Colors.brandDark} align="center">
              ACCOUNT REGISTRATION
            </Heading>
            <Spacer size={0} />
            <Box>
              <Section>
                <Paragraph size="small">
                  Register your Account to create <Bold>Virtual Cards</Bold> to
                  your <Bold>Whips</Bold> and pay everywhere with your friends.
                  {'\n'}
                  <Bold>More features are coming soon. ;)</Bold>
                </Paragraph>
                <BaseButton
                  flatten
                  variant="secondary"
                  onPress={() => setVisible(true)}
                  fullWidth
                >
                  Before you start
                </BaseButton>
              </Section>
            </Box>
            <DescriptiveButton
              title="Registration form"
              onPress={() =>
                navigation.navigate(InternalNavigationNames.CreateAccountModal)
              }
              success={accountReady}
              icon={accountReady ? faCheck : faFileLines}
            />
          </Section>
          <Spacer size={Size.large} />
        </Section>
        <DialogV2
          autoHeight
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <>
            <Box space={Size.xLarge} color="transparent">
              <Section>
                <Heading size="small">
                  Please, make sure you have the following:
                </Heading>
                <Paragraph>
                  <Bold>1.</Bold> I am 18 years old.{'\n'}
                  <Bold>2.</Bold> I am in United Kingdom.{'\n'}
                  <Bold>3.</Bold> I have a valid UK address.{'\n'}
                  <Bold>4.</Bold> I have a valid UK phone number.{'\n'}
                  <Bold>5.</Bold> I have a valid UK ID.
                </Paragraph>
              </Section>
              <Spacer size={Size.large} />
              <BaseButton
                variant="muted"
                onPress={() => setVisible(false)}
                fullWidth
              >
                Ok, I'm ready
              </BaseButton>
            </Box>
          </>
        </DialogV2>
      </MainContainer>
      {submitReady ? (
        <FloatingBottom animated>
          <BaseButton variant={'primary'} onPress={onPressToSubmit}>
            <Bold color={Colors.white}>Submit Registration</Bold>
          </BaseButton>
          <View style={{ height: 70 }} />
        </FloatingBottom>
      ) : null}
    </>
  );
};
