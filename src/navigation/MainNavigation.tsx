import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { MenuProvider } from 'react-native-popup-menu';
import { storage } from '..';
import { AppHeader } from '../components/AppHeader';
import { useAuthScreenLocker } from '../components/AuthScreenLocker';
import { Authenticate3DS } from '../screens/Authenticate3DS';
import { OnboardingWalletOffer } from '../screens/OnboardingWalletOffer';
import { InAppVerification } from '../screens/WhipDetails/InAppVerification';
import { useUser } from '../states/User';
import { defaultScreenOptions } from '../theme/commonProps';
import ErrorBoundary from '../utils/ErrorBoundary';
import { ModalNavigation } from './ModalNavigation';
import { SettingsNavigation } from './SettingsNavigation';
import { TabsNavigation } from './TabsNavigation';
import { DelayedScreenFallback } from './components';
import { InternalNavigationNames } from './types';

export const MainStack = createStackNavigator();

export const MainNavigationCommonOptions = {
  header: AppHeader,
  headerBackTitleVisible: true,
  headerShown: true,
};

export const MainNavigation = () => {
  const { showAuthScreen } = useAuthScreenLocker();
  const { isSignedIn } = useUser();

  // useAppStateFocus(showAuthScreen, isSignedIn, true);

  React.useEffect(() => {
    if (isSignedIn && !storage.getString('firstLogin')) {
      storage.set('firstLogin', 'YES');
    }
  }, [isSignedIn]);

  return (
    <ErrorBoundary>
      <MenuProvider
        customStyles={{ backdrop: { backgroundColor: 'black', opacity: 0.5 } }}
      >
        <AutocompleteDropdownContextProvider>
          <DelayedScreenFallback />
          <MainStack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={InternalNavigationNames.Tabs}
          >
            <MainStack.Screen
              name={'Authenticate3DS'}
              component={Authenticate3DS}
              options={defaultScreenOptions}
            />
            <MainStack.Screen
              name={'InAppVerification'}
              component={InAppVerification}
              options={defaultScreenOptions}
            />
            <MainStack.Screen
              name={'OnboardingWalletOffer'}
              component={OnboardingWalletOffer}
              options={defaultScreenOptions}
            />
            <MainStack.Screen
              name={InternalNavigationNames.Tabs}
              component={TabsNavigation}
            />
            {SettingsNavigation}
            {ModalNavigation}
          </MainStack.Navigator>
        </AutocompleteDropdownContextProvider>
      </MenuProvider>
    </ErrorBoundary>
  );
};
