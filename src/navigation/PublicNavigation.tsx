import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import { AppHeader } from '../components/AppHeader';
import { ForgotPassword } from '../screens/SignIn/ForgotPassword';
import { PhoneNumberVerification } from '../screens/SignIn/PhoneNumberVerification';
import { SignIn } from '../screens/SignIn/SignIn';
import { SignUp } from '../screens/SignIn/SignUp';
import { WelcomeToWhipApp } from '../screens/WelcomeToWhipApp';
import { PublicNavigationNames } from './types';

const Stack = createStackNavigator();

export const PublicNavigation = () => {
  return (
    <AutocompleteDropdownContextProvider>
      <Stack.Navigator>
        <Stack.Screen
          name={PublicNavigationNames.WelcomeToWhipApp}
          component={WelcomeToWhipApp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          component={SignIn}
          name={PublicNavigationNames.SignIn}
          options={{
            header: AppHeader,
            headerBackTitleVisible: false,
            title: 'Sign In',
          }}
        />
        <Stack.Screen
          component={SignUp}
          name={PublicNavigationNames.SignUp}
          options={{
            header: AppHeader,
            headerBackTitleVisible: false,
            title: 'New Account',
          }}
        />
        <Stack.Screen
          component={PhoneNumberVerification}
          name={PublicNavigationNames.PhoneNumberVerification}
          options={{
            gestureEnabled: false,
            header: AppHeader,
            headerBackTitleVisible: false,
            title: 'Phone Number Verification',
          }}
        />
        <Stack.Screen
          component={ForgotPassword}
          name={PublicNavigationNames.ForgotPassword}
          options={{
            header: AppHeader,
            headerBackTitleVisible: true,
            title: 'Password Recovery',
          }}
        />
      </Stack.Navigator>
    </AutocompleteDropdownContextProvider>
  );
};
