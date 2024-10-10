import {
  faCheck,
  faExclamation,
  faFileLines,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import { storage } from '../../..';
import { AccountBadge } from '../../../components/AccountBanner';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import { MainContainer } from '../../../components/MainContainer';
import { useTabsBarBottomSize } from '../../../components/TabsBar';
import { Bold, Heading, Paragraph } from '../../../components/Typography';
import { Box, Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { InternalNavigationNames } from '../../../navigation/types';
import { useUser } from '../../../states/User';
import { Colors } from '../../../theme/colors';
import { Gap, Size } from '../../../theme/sizes';
import { DescriptiveButton } from '../../WhipDetails/components';

export const RegistrationInconclusive = ({
  onPressToSubmit,
  logs,
}: {
  onPressToSubmit: () => void;
  logs?: any;
}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  const [accountReady, setAccountReady] = React.useState<any>(null);
  const [attachmentsReady, setAttachmentsReady] = React.useState<any>(null);

  const { user } = useUser();

  const inconclusive = user?.account?.verification?.inconclusive;

  React.useEffect(() => {
    const listener = storage.addOnValueChangedListener((key: string) => {
      if (key === 'accountData') {
        setAccountReady(true);
      }
      if (key === 'accountAttachments') {
        setAttachmentsReady(true);
      }
    });
    setAccountReady(!!storage.getString('accountData'));
    setAttachmentsReady(!!storage.getString('accountAttachments'));
    return () => listener.remove();
  }, []);

  const submitReady = inconclusive
    ? accountReady && attachmentsReady
    : accountReady;

  return (
    <>
      <MainContainer paddingBottom={useTabsBarBottomSize()}>
        <Section gap={Gap.large} spaceVertical={Size.large}>
          <AccountBadge
            color={Colors.attention}
            icon={faExclamation}
            style={{ alignSelf: 'center', transform: [{ scale: 1.5 }] }}
          />
          <Section>
            <Heading size="small" color={Colors.attentionDark} align="center">
              REGISTRATION NEEDS ATTENTION
            </Heading>
            <Spacer size={0} />
            <Box>
              <Paragraph size="small">
                <Bold>Don't worry!</Bold> We just found some information we want
                to double check with you. :)
              </Paragraph>
            </Box>
            <DescriptiveButton
              title="Registration form"
              onPress={() =>
                navigation.navigate(InternalNavigationNames.CreateAccountModal)
              }
              success={accountReady}
              icon={accountReady ? faCheck : faFileLines}
            />
            <Box>
              <Paragraph size="small">
                To continue send us a selfie and a photo of your ID.
              </Paragraph>
            </Box>
            <DescriptiveButton
              title="Selfie and ID"
              onPress={() =>
                navigation.navigate(
                  InternalNavigationNames.KYCManualVerificationModal,
                )
              }
              success={attachmentsReady}
              icon={attachmentsReady ? faCheck : faUpload}
            />
          </Section>
          <Spacer size={Size.large} />
        </Section>
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
