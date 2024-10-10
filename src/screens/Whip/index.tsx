import { RouteProp, useRoute } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { WhipContextProvider } from '../../states/Whip';

const Stack = createStackNavigator();

export const Whip = () => {
  const route = useRoute<RouteProp<any>>();

  return (
    <WhipContextProvider whipId={route.params?.whipId}>
      <></>
      {/* <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName={InternalNavigationNames.WhipDetailsMain}
      >
        <Stack.Screen
          component={WhipDetailsMain}
          name={InternalNavigationNames.WhipDetailsMain}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          component={WhipFunds}
          name={InternalNavigationNames.WhipFunds}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          component={WhipCard}
          name={InternalNavigationNames.WhipCard}
          options={defaultScreenOptions}
        />
        <Stack.Screen
          component={WhipConfigurations}
          name={InternalNavigationNames.WhipConfigurations}
          options={defaultScreenOptions}
        />
      </Stack.Navigator> */}
    </WhipContextProvider>
  );
};
