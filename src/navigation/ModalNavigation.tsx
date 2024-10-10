import React from 'react';
import { AccountAddFunds } from '../screens/Account/components/AccountAddFunds';
import { AccountBalance } from '../screens/Account/components/AccountBalance';
import { AccountSettings } from '../screens/Account/components/AccountSettings';
import { CreateAccount } from '../screens/CreateAccount';
import { CreateWhip } from '../screens/CreateWhip';
import { KYCManualVerification } from '../screens/KYCManualVerification';
import { WhipDetails } from '../screens/WhipDetails';
import { MainStack } from './MainNavigation';
import { InternalNavigationNames } from './types';

export const ModalNavigation = (
  <MainStack.Group screenOptions={{ presentation: 'modal' }}>
    <MainStack.Screen
      name={InternalNavigationNames.KYCManualVerificationModal}
      component={KYCManualVerification}
    />
    <MainStack.Screen
      name={InternalNavigationNames.CreateAccountModal}
      component={CreateAccount}
    />
    <MainStack.Screen
      name={InternalNavigationNames.CreateWhipModal}
      component={CreateWhip}
    />
    <MainStack.Screen
      name={InternalNavigationNames.WhipDetailsModal}
      component={WhipDetails}
    />
    <MainStack.Screen component={AccountBalance} name={'ManageBalance'} />
    <MainStack.Screen component={AccountAddFunds} name={'AccountAddFunds'} />
    <MainStack.Screen component={AccountSettings} name={'AccountSettings'} />
  </MainStack.Group>
);
