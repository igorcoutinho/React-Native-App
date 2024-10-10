import { faExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
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

export const RegistrationError = ({
  onPressToSubmit,
  logs,
}: {
  onPressToSubmit: () => void;
  logs?: any;
}) => {
  const [visible, setVisible] = React.useState(false);

  const navigation = useNavigation<NavigationProp<any>>();

  let w2DataEkycUK005Errors = [];

  try {
    w2DataEkycUK005Errors = logs?.map((l: any) => {
      if (l?.errors?.w2_DATA_EKYC_UK_005) {
        return l?.errors?.w2_DATA_EKYC_UK_005.map((l2: any) => l2);
      }
      return null;
    }).flat().filter((e: any) => e !== null);
  } catch (error) { }

  return (
    <>
      <MainContainer paddingBottom={useTabsBarBottomSize()}>
        <Section gap={Gap.large} spaceVertical={Size.large}>
          <AccountBadge
            color={Colors.danger}
            icon={faXmark}
            style={{ alignSelf: 'center', transform: [{ scale: 1.5 }] }}
          />
          <Section>
            <Heading size="small" color={Colors.danger} align="center">
              REGISTRATION ERROR
            </Heading>
            <Spacer size={0} />
            <Box>
              <Paragraph size="small" color={Colors.dark}>
                Your submission contain critical errors. such as bad information
                regarding your identity.{'\n'}
                <Bold>Please review and try again.</Bold>
              </Paragraph>
            </Box>
            {logs && w2DataEkycUK005Errors?.length > 0 ? (
              <BaseButton flatten variant='danger' onPress={() => setVisible(true)}>
                See details
              </BaseButton>
            ) : null}
            <Box color={Colors.mutedDark} direction="column">
              <Section>
                <Heading color={Colors.white} size="small">
                  Please, make sure you have the following:
                </Heading>
                <Paragraph color={Colors.white}>
                  <Bold>1.</Bold> I am 18 years old.{'\n'}
                  <Bold>2.</Bold> I am in United Kingdom.{'\n'}
                  <Bold>3.</Bold> I have a valid UK address.{'\n'}
                  <Bold>4.</Bold> I have a valid UK phone number.{'\n'}
                  <Bold>5.</Bold> I have a valid UK ID.
                </Paragraph>
              </Section>
            </Box>
            <DescriptiveButton
              title="Review Registration form"
              attention
              onPress={() =>
                navigation.navigate(InternalNavigationNames.CreateAccountModal)
              }
              icon={faExclamation}
            />
            <DialogV2
              autoHeight
              visible={visible}
              onRequestClose={() => setVisible(false)}
            >
              <>
                <Box space={Size.xLarge} color="transparent">
                  <Section>
                    <Heading>
                      Fix the errors below to proceed:
                    </Heading>
                    <Paragraph>
                      {w2DataEkycUK005Errors?.map((e: any, index: number) => (
                        <React.Fragment key={index}><Bold color={Colors.danger}>{index + 1}.</Bold> {e}</React.Fragment>
                      ))}
                    </Paragraph>
                  </Section>
                  <Spacer size={Size.large} />
                  <BaseButton
                    variant="muted"
                    onPress={() => setVisible(false)}
                    fullWidth
                  >
                    Got it!
                  </BaseButton>
                </Box>
              </>
            </DialogV2>
          </Section>
        </Section>
      </MainContainer>
      <FloatingBottom animated>
        <BaseButton variant={'primary'} onPress={onPressToSubmit}>
          <Bold color={Colors.white}>Submit Registration</Bold>
        </BaseButton>
        <View style={{ height: 70 }} />
      </FloatingBottom>
    </>
  );
};
