import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React from 'react';
import { AccountBadge } from '../../../components/AccountBanner';
import { BaseButton } from '../../../components/BaseButton';
import { FloatingBottom } from '../../../components/FloatingBottom';
import {
  MainContainer,
  ScrollableContainer,
} from '../../../components/MainContainer';
import { ModalHeader } from '../../../components/ModalHeader';
import { Bold, Heading, Paragraph } from '../../../components/Typography';
import { LineSeparator } from '../../../components/elements/LineSeparator';
import { Box, Section } from '../../../components/elements/Section';
import { Spacer } from '../../../components/elements/Spacer';
import { useUser } from '../../../states/User';
import { Colors } from '../../../theme/colors';
import { Gap, Size } from '../../../theme/sizes';

export const AccountSettings = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { user } = useUser();
  const dob = format(user.account.dob?.toDate?.(), 'dd/MM/yyyy');
  return (
    <>
      <ModalHeader />
      <MainContainer paddingBottom={0}>
        <ScrollableContainer>
          <AccountBadge
            color={Colors.success}
            icon={faCheck}
            style={{
              alignSelf: 'center',
              transform: [{ scale: 1.5 }],
              marginBottom: 30,
              marginTop: 15,
            }}
          />
          <Section gap={Gap.large}>
            <Section>
              <Section gap={0}>
                <Heading
                  color={Colors.brandSecondary}
                  size="small"
                  style={{ textTransform: 'uppercase' }}
                >
                  Personal Details
                </Heading>
                <Spacer size={Gap.xSmall} />
                <Paragraph size="xSmall" color={Colors.mutedDark}>
                  Account ID: <Bold>{user.account.provider.accountId}</Bold>
                </Paragraph>
                <LineSeparator />
              </Section>
              <Field
                label="Name"
                value={`${user.account.firstName} ${user.account.lastName}`}
              />
              <Section direction="row">
                <Field label="Email" value={user.account.email} grow />
                <Field label="Phone Number" value={user.account.phoneNumber} />
              </Section>

              <Section direction="row">
                <Field label="Date of Birth" value={dob} grow />
                <Field
                  label="Source of Funds"
                  value={user.account.sourceOfFunds}
                  grow
                />
              </Section>
            </Section>
            <Section>
              <Section gap={0}>
                <Heading
                  color={Colors.brandSecondary}
                  size="small"
                  style={{ textTransform: 'uppercase' }}
                >
                  Address
                </Heading>
                <LineSeparator />
              </Section>
              <Section direction="row">
                <Field
                  label="Address Line 1"
                  value={user.account.address.addressLine1}
                  grow
                />
                <Field
                  label="Number"
                  value={String(user.account.address.houseNumber)}
                />
              </Section>
              {user.account.address.addressLine2 ? (
                <Field
                  label="Address Line 2"
                  value={user.account.address.addressLine2}
                />
              ) : null}
              <Section direction="row">
                <Field
                  label="Postal Code"
                  value={user.account.address.postalCode}
                  grow
                />
                <Field label="City" value={user.account.address.city} grow />
              </Section>
              <LineSeparator />
              <Box color={Colors.muted}>
                <Paragraph size="xSmall" color={Colors.white}>
                  Currently you cannot change your personal details. If you need
                  to change your personal details, please contact us at{'\n'}
                  <Bold>https://mywhipapp.com</Bold>
                </Paragraph>
              </Box>
            </Section>
          </Section>
          <Spacer size={Size.xLarge} />
        </ScrollableContainer>
      </MainContainer>
      <FloatingBottom>
        <BaseButton variant="muted" onPress={() => navigation.goBack()}>
          Close
        </BaseButton>
      </FloatingBottom>
    </>
  );
};

export const Field = ({
  label,
  value,
  grow,
}: {
  label: string;
  value: string;
  grow?: boolean;
}) => {
  return (
    <Section grow={grow} gap={Gap.xSmall}>
      <Heading
        color={Colors.brandSecondary}
        size="xSmall"
        style={{ textTransform: 'uppercase' }}
      >
        {label}
      </Heading>
      <Box>
        <Paragraph size="small">{value}</Paragraph>
      </Box>
    </Section>
  );
};
