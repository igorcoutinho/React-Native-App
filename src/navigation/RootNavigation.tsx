import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { NotFound } from '../screens/NotFound';
import { useUser } from '../states/User';
import { MainNavigation } from './MainNavigation';
import { PublicNavigation } from './PublicNavigation';
import { DelayedScreenFallback } from './components';

const Stack = createStackNavigator();

export const RootNavigation: React.FC = () => {
  const { isSignedIn } = useUser();

  const cardStyleInterpolator = ({ current }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <>
      <DelayedScreenFallback />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <Stack.Screen
            name="Internal"
            component={MainNavigation}
            options={{
              cardStyleInterpolator,
              headerBackTitleVisible: false,
            }}
          />
        ) : (
          <Stack.Screen
            name="Public"
            component={PublicNavigation}
            options={{
              animationTypeForReplace: 'pop',
              cardStyleInterpolator,
              headerBackTitleVisible: false,
            }}
          />
        )}
        <Stack.Screen
          name="NotFound"
          component={NotFound}
          options={{
            animationTypeForReplace: 'pop',
            cardStyleInterpolator,
          }}
        />
      </Stack.Navigator>
    </>
  );
};
