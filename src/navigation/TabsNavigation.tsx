import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { TabsBar } from '../components/TabsBar';
import { TabsHeader } from '../components/TabsHeader';
import { Account } from '../screens/Account';
import { Inbox } from '../screens/Inbox';
import { MyWhips } from '../screens/MyWhips';
import { Settings } from '../screens/Settings';
import { VerifyInvitation } from '../screens/VerifyInvitation';

const Tab = createBottomTabNavigator();

export const TabsNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName='Wallet'
      tabBar={props => (
        <TabsBar {...props} blackList={['Inbox', 'VerifyInvitation']} />
      )}
      screenOptions={{ header: TabsHeader }}
    >
      <Tab.Screen
        component={MyWhips}
        name="MyWhips"
        options={{ title: 'My Whips' }}
      />
      {/* <Tab.Screen name="Dashboard" component={Dashboard} /> */}
      <Tab.Screen name="Wallet" component={Account} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Inbox" component={Inbox} />
      <Tab.Screen name="VerifyInvitation" component={VerifyInvitation} />
    </Tab.Navigator>
  );
};
