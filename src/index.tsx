import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed/build/components/Provider';
import notifee, { EventType } from '@notifee/react-native';
import FirebaseAnalytics from '@react-native-firebase/analytics';
import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import FirebaseMessaging from '@react-native-firebase/messaging';
import { DefaultTheme, NavigationContainer, NavigationContainerRefWithCurrent } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Linking, LogBox, Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthScreenLockerContextProvider } from './components/AuthScreenLocker';
import { ViewLockerContextProvider } from './components/ViewLocker';
import { keys } from './constants';
import { RootNavigation } from './navigation/RootNavigation';
import { queryClient, useSetupReactQuery } from './queries';
import { NotificationsContextProvider } from './states/Notifications';
import { UserContextProvider } from './states/User';
import { Colors } from './theme/colors';
import ErrorBoundary from './utils/ErrorBoundary';
import { useNotificationPermission } from './utils/permission';

LogBox.ignoreLogs([
  'Sending...',
  'Sending',
  'Non-serializable values were found in the navigation state',
]);

const isAndroid = Platform.OS === 'android';

FirebaseFirestore().settings({ persistence: !__DEV__ });

if (__DEV__ && !isAndroid) {
  FirebaseFirestore().useEmulator('localhost', 8082);
}

FirebaseAuth().settings.forceRecaptchaFlowForTesting = __DEV__;

export const storage = new MMKV();

export const analytics = FirebaseAnalytics;

export default function App() {
  const routeNameRef = React.useRef<any>();
  const navigationRef = React.useRef<NavigationContainerRefWithCurrent<any>>();

  useNotificationPermission();
  useSetupReactQuery();

  React.useEffect(() => {
    FirebaseMessaging().onMessage(async message => {
      const link: string =
        message?.category || message?.notification?.android?.clickAction || '';
      await notifee.displayNotification({
        body: message.notification?.body,
        data: {
          link,
        },
        title: message.notification?.title,
      });
    });

    return notifee.onForegroundEvent(({ type, detail }) => {
      const link: string = (detail?.notification?.data?.link as string) || '';
      switch (type) {
        case EventType.DISMISSED:
          // TODO: Add msg to Inbox using mmkv
          break;
        case EventType.PRESS:
          if (link.includes('whipapp://')) {
            Linking.openURL(link);
          }
          break;
      }
    });
  }, []);

  const navTheme = DefaultTheme;
  navTheme.colors.background = Colors.appBackgroundColor;

  const linking = {
    config: {
      screens: {
        Internal: {
          path: 'goto',
          screens: {
            InAppVerification: 'inAppVerification',
            Authenticate3DS: '3ds/:ticketId',
            Tabs: {
              screens: {
                MyWhips: 'myWhips',
                Account: 'account',
                Settings: 'settings',
                VerifyInvitation: 'invite/:whipId/join/:hashCode',
              },
            },
            WhipDetailsModal: 'whip/:whipId',
          },
        },
        NotFound: '*',
      },
    },
    prefixes: ['whipapp://'],
  };

  return (
    <SafeAreaProvider>
      <GluestackUIProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <UserContextProvider>
            <ErrorBoundary>
              <NotificationsContextProvider>
                <StripeProvider
                  publishableKey={keys.stripePublishableKey}
                  merchantIdentifier="">
                  <AuthScreenLockerContextProvider>
                    <ViewLockerContextProvider>
                      <NavigationContainer
                        ref={navigationRef}
                        onReady={() => {
                          routeNameRef.current = navigationRef?.current?.getCurrentRoute().name;
                        }}
                        onStateChange={async () => {
                          const previousRouteName = routeNameRef.current;
                          const currentRouteName = navigationRef?.current?.getCurrentRoute().name;
                          if (previousRouteName !== currentRouteName) {
                            await analytics().logScreenView({
                              screen_name: currentRouteName,
                              screen_class: currentRouteName,
                            });
                          }
                          routeNameRef.current = currentRouteName;
                        }}
                        linking={linking}
                        theme={navTheme}>
                        <RootNavigation />
                      </NavigationContainer>
                    </ViewLockerContextProvider>
                  </AuthScreenLockerContextProvider>
                </StripeProvider>
              </NotificationsContextProvider>
            </ErrorBoundary>
          </UserContextProvider>
        </QueryClientProvider>
      </GluestackUIProvider>
    </SafeAreaProvider>
  );
}
