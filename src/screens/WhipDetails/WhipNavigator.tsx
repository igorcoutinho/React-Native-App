import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { InternalNavigationNames } from '../../navigation/types';
import { useWhipContext } from '../../states/Whip';
import {
  cardStyleInterpolator,
  defaultScreenOptions,
} from '../../theme/commonProps';
import { WhipFundsV2 } from '../Whip/WhipFunds';
import { WhipNotAllowed } from '../Whip/WhipNotAllowed';
import { WhipSearchFriends } from '../Whip/WhipSearchFriends';
import { InAppWalletOffer } from './InAppWalletOffer';
import { WhipCard } from './WhipCard';
import { WhipConfigurations } from './WhipConfigurations';
import { WhipDetailsMain } from './WhipDetailsMain';

const Stack = createStackNavigator();

export const WhipNavigator = () => {
  const { isAllowed, whip } = useWhipContext();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName={InternalNavigationNames.WhipDetailsMain}
    >
      {isAllowed ? (
        <>
          <Stack.Screen
            component={WhipDetailsMain}
            name={InternalNavigationNames.WhipDetailsMain}
            options={defaultScreenOptions}
          />
          <Stack.Screen
            component={WhipFundsV2}
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
          <Stack.Screen
            component={WhipSearchFriends}
            name={'WhipSearchFriends'}
            options={defaultScreenOptions}
          />
          <Stack.Screen
            component={InAppWalletOffer}
            name={'InAppWalletOffer'}
            options={{
              cardStyleInterpolator,
              transitionSpec: {
                open: { animation: 'timing', config: { duration: 160 } },
                close: { animation: 'timing', config: { duration: 160 } },
              },
            }}
          />
        </>
        // ) : (
        //   <Stack.Screen
        //     component={WhipFundsV2}
        //     name={InternalNavigationNames.WhipFunds}
        //     options={defaultScreenOptions}
        //   />
      ) : (
        <Stack.Screen
          component={WhipNotAllowed}
          name={InternalNavigationNames.WhipNotAllowed}
          options={defaultScreenOptions}
        />
      )}
    </Stack.Navigator>
  );
};
