import React from 'react';
import { PhoneNumberVerification } from '../screens/Settings/PhoneNumberVerification';
import { SettingsAccount } from '../screens/Settings/SettingsAccount';
import { SettingsFAQs } from '../screens/Settings/SettingsFAQs';
import { SettingsPermissions } from '../screens/Settings/SettingsPermissions';
import { SettingsPrivacyPolicy } from '../screens/Settings/SettingsPrivacyPolicy';
import { SettingsProfile } from '../screens/Settings/SettingsProfile';
import { SettingsSupport } from '../screens/Settings/SettingsSupport';
import { MainNavigationCommonOptions, MainStack } from './MainNavigation';
import { InternalNavigationNames, PublicNavigationNames } from './types';

export const SettingsNavigation = (
  <MainStack.Group>
    <MainStack.Screen
      name={InternalNavigationNames.SettingsProfile}
      component={SettingsProfile}
      options={{ ...MainNavigationCommonOptions, title: 'Profile' }}
    />
    <MainStack.Screen
      name={InternalNavigationNames.SettingsAccount}
      component={SettingsAccount}
      options={{ ...MainNavigationCommonOptions, title: 'Account' }}
    />
    <MainStack.Screen
      name={InternalNavigationNames.SettingsPermissions}
      component={SettingsPermissions}
      options={{ ...MainNavigationCommonOptions, title: 'Permissions' }}
    />
    <MainStack.Screen
      name={InternalNavigationNames.SettingsSupport}
      component={SettingsSupport}
      options={{ ...MainNavigationCommonOptions, title: 'Support' }}
    />
    <MainStack.Screen
      name={InternalNavigationNames.SettingsFAQs}
      component={SettingsFAQs}
      options={{ ...MainNavigationCommonOptions, title: 'FAQs' }}
    />
    <MainStack.Screen
      name={InternalNavigationNames.SettingsPrivacyPolicy}
      component={SettingsPrivacyPolicy}
      options={{ ...MainNavigationCommonOptions, title: 'Privacy Policy' }}
    />

    <MainStack.Screen
      name={PublicNavigationNames.PhoneNumberVerification}
      component={PhoneNumberVerification}
      options={{ ...MainNavigationCommonOptions, title: 'Phone Number Verification' }}
    />


  </MainStack.Group>
);
