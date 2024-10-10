import { NavigationProp, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React from 'react';
import { Alert, View } from 'react-native';
import { useAuthScreenLocker } from '../../components/AuthScreenLocker';
import { BaseButton } from '../../components/BaseButton';
import { DialogV2 } from '../../components/DialogV2';
import { LineSeparator } from '../../components/elements/LineSeparator';
import { Box, Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import { MainContainer, ScrollableContainer } from '../../components/MainContainer';
import { Bold, Heading, Paragraph } from '../../components/Typography';
import { useAccountCloseMutation } from '../../queries/Account/useAccountCloseMutation';
import { useUser } from '../../states/User';
import { Colors } from '../../theme/colors';
import { Gap, Size } from '../../theme/sizes';
import { Field } from '../Account/components/AccountSettings';

export const supportEmail = 'help@mywhipapp.com';

export const SettingsAccount = () => {
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const navigation = useNavigation<NavigationProp<any>>();

  const { status, showAuthScreen } = useAuthScreenLocker();

  const { user } = useUser();
  const dob = user?.account.dob?.toDate?.() ? format(user?.account.dob?.toDate?.(), 'dd/MM/yyyy') : '';

  const closeAccount = useAccountCloseMutation({
    onError: (error) => {
      Alert.alert('Close Account', 'Error occurred while closing the account. Please try again later.');
      setIsDialogVisible(false);
    },
    onSuccess: (status) => {
      Alert.alert('Close Account', 'Your request to close the account has been successfully submitted. We will process your request within two business days.');
      setIsDialogVisible(false);
    },
  });

  React.useEffect(() => {
    if (status === 'success') {
      setIsDialogVisible(true);
    }
    if (status === 'error') { }
    if (status === 'cancelled') { }
  }, [status]);

  return (
    <MainContainer>
      <ScrollableContainer>
        <Section>
          <Section gap={Gap.large}>
            <Section>
              <Section gap={0}>
                <Heading
                  color={Colors.brandSecondary}
                  size="small"
                  style={{ textTransform: 'uppercase' }}
                >
                  Registration
                </Heading>
                <Spacer size={Gap.xSmall} />
                <Paragraph size="xSmall" color={Colors.mutedDark}>
                  Account ID: <Bold>{user?.account.provider.accountId}</Bold>
                </Paragraph>
                <LineSeparator />
              </Section>
              <Field
                label="Name"
                value={`${user?.account.firstName} ${user?.account.lastName}`}
              />
              <Section direction="row">
                <Field label="Email" value={user?.account.email} grow />
                <Field label="Phone Number" value={user?.account.phoneNumber} />
              </Section>
              <Section direction="row">
                <Field label="Date of Birth" value={dob} grow />
                <Field
                  label="Source of Funds"
                  value={user?.account.sourceOfFunds}
                  grow
                />
              </Section>
              <Field
                label="Address Line 1"
                value={user?.account.address.addressLine1}
                grow
              />
              {user?.account.address.addressLine2 ? (
                <Field
                  label="Address Line 2"
                  value={user?.account.address.addressLine2}
                />
              ) : null}
              <Section direction="row">
                <Field
                  label="House Name"
                  value={user?.account.address.houseName || ''}
                  grow
                />
                <Field
                  label="House Number"
                  value={String(user?.account.address.houseNumber || '')}
                  grow
                />
              </Section>
              <Section direction="row">
                <Field
                  label="Postal Code"
                  value={user?.account.address.postalCode}
                  grow
                />
                <Field label="City" value={user?.account.address.city} grow />
              </Section>
            </Section>
          </Section>
          <LineSeparator />
          <Section>
            <Section gap={0}>
              <Heading
                color={Colors.brandSecondary}
                size="small"
                style={{ textTransform: 'uppercase' }}
              >
                Account Options
              </Heading>
              <LineSeparator />
            </Section>
            <Box color={Colors.muted}>
              <Paragraph size="xSmall" color={Colors.white}>
                Currently you cannot change your personal details. If you need
                to change your personal details, please contact us at{'\n'}
                <Bold>https://mywhipapp.com</Bold>
              </Paragraph>
            </Box>
            <View style={{ gap: 10, marginBottom: 26 }}>
              <LineSeparator color={Colors.dangerDark} />
              <BaseButton
                grow
                variant="danger"
                onPress={() => {
                  showAuthScreen();
                }}
              >
                Close Account
              </BaseButton>
            </View>
          </Section>
        </Section>
        <DialogV2 visible={isDialogVisible}>
          <Section gap={Gap.large} space={Size.xLarge}>
            <Heading>Close Account</Heading>
            <Paragraph>
              Are you sure you want to close your account?
            </Paragraph>
            <Paragraph>
              Once you confirm, the process will take up to two business days to complete. During this time, we will process your request and check for any pending balances or transactions linked to your account.
            </Paragraph>
            {/* <Paragraph>
              Please be aware that, in compliance with UK Anti-Money Laundering (AML) regulations, we are required to retain certain records even after an account has been closed. This is to ensure compliance with legal and regulatory obligations.
            </Paragraph> */}
            <Paragraph>
              If you have any further questions or need assistance, please do not hesitate to contact us.
            </Paragraph>
            <Paragraph>
              To proceed with closing your account, please confirm by pressing the button below.
            </Paragraph>
            <BaseButton
              variant="danger"
              onPress={() => {
                Alert.alert('Close Account', 'Are you sure you want to request to close your account?', [
                  {
                    text: 'Proceed',
                    style: 'destructive',
                    onPress: async () => {
                      closeAccount.mutate();
                      // await Linking.openURL(
                      //   `mailto:${supportEmail}?subject=Close%20Account&body=I%20want%20to%20close%20my%20Whip%20App%20account%20and%20transfer%20the%20remaining%20balance%20amount%20to%20another%20bank%20account.`,
                      // );
                    },
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ]);
              }}
            >
              Close Account
            </BaseButton>
          </Section>
        </DialogV2>
      </ScrollableContainer>
    </MainContainer>
  );
};
