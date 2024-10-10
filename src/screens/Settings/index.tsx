import {
  faGears,
  faIdCardClip,
  faInfo,
  faLifeRing,
  faUserGear,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, View } from 'react-native';
import { BaseButton, BaseButtonInline } from '../../components/BaseButton';
import { LineSeparator } from '../../components/elements/LineSeparator';
import { Section } from '../../components/elements/Section';
import { Spacer } from '../../components/elements/Spacer';
import {
  MainContainer,
  ScrollableContainer
} from '../../components/MainContainer';
import { useTabsBarBottomSize } from '../../components/TabsBar';
import { Paragraph } from '../../components/Typography';
import { useUser } from '../../states/User';
import { Colors } from '../../theme/colors';
import { Gap, Size } from '../../theme/sizes';
import { TPLTermsAndConditions } from '../CreateAccount/TPLTermsAndConditions';
import { WhipAppTermsAndConditions } from '../CreateAccount/WhipAppTermsAndConditions';
import { DescriptiveButton } from '../WhipDetails/components';

export const Settings = () => {
  const { user, signOut } = useUser();
  const TPLTermsAndConditionsRef = React.useRef<any>(null);
  const WhipAppTermsAndConditionsRef = React.useRef<any>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  const openTPLTermsAndConditions = React.useCallback(
    () => TPLTermsAndConditionsRef?.current?.onOpen(),
    [TPLTermsAndConditionsRef],
  );

  const openWhipAppTermsAndConditions = React.useCallback(
    () => WhipAppTermsAndConditionsRef?.current?.onOpen(),
    [WhipAppTermsAndConditionsRef],
  );

  return (
    <MainContainer paddingBottom={useTabsBarBottomSize()}>
      <ScrollableContainer>
        {/* <Section>
          <View
            style={{
              alignItems: 'center',
              alignSelf: 'center',
              backgroundColor: Colors.greyLight,
              borderRadius: 100,
              height: 120,
              justifyContent: 'center',
              width: 120,
            }}
          >
            <AvatarImage
              value={user?.photoURL}
              borderRadius={100}
              useIcon
              icon={faUser}
              iconSize={60}
            />
          </View>
          <Heading align="center" size="medium">
            {user?.displayName}
          </Heading>
        </Section>

        <Spacer /> */}

        <Spacer />

        <Section>
          <DescriptiveButton
            title="Profile"
            onPress={() => navigation.navigate('SettingsProfile')}
            icon={faUserGear}
          />
          <DescriptiveButton
            title="Account"
            muted
            onPress={() => navigation.navigate('SettingsAccount')}
            icon={faIdCardClip}
          />
          <DescriptiveButton
            title="Permissions"
            onPress={() => navigation.navigate('SettingsPermissions')}
            icon={faGears}
            attention
          />
          <View
            style={{
              backgroundColor: Colors.light,
              borderRadius: 22,
            }}
          >
            <DescriptiveButton
              title="FAQs"
              muted
              onPress={() => navigation.navigate('SettingsFAQs')}
              icon={faInfo}
            />
            <DescriptiveButton
              title="Support"
              muted
              onPress={() => navigation.navigate('SettingsSupport')}
              icon={faLifeRing}
            />
          </View>
          <DescriptiveButton
            title="Privacy Policy"
            muted
            onPress={() => navigation.navigate('SettingsPrivacyPolicy')}
            icon={faUserShield}
          />
        </Section>

        <WhipAppTermsAndConditions ref={WhipAppTermsAndConditionsRef} />
        <TPLTermsAndConditions ref={TPLTermsAndConditionsRef} />

        <Spacer /><Spacer />

        <Section gap={Gap.regular}>
          <BaseButtonInline onPress={() => openWhipAppTermsAndConditions()}>
            Whip App Terms and Conditions
          </BaseButtonInline>
          <BaseButtonInline onPress={() => openTPLTermsAndConditions()}>
            TPL Terms and Conditions
          </BaseButtonInline>
        </Section>

        <Section spaceVertical={Size.xSmall}>
          <LineSeparator />
          <BaseButton
            onPress={() => {
              Alert.alert('Sign Out', 'Are you sure you want to leave?', [
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: () => signOut(),
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
              ]);
            }}
            flatten
            variant="danger"
          >
            Sign Out
          </BaseButton>
          <Paragraph align="center" size="xSmall" color={Colors.muted}>
            App Version 1.0.0
          </Paragraph>
        </Section>
        <Spacer size={Size.large} />
      </ScrollableContainer>
    </MainContainer>
  );
};
