import FirebaseMessaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';
import React from 'react';
import { AppRegistry, Linking } from 'react-native';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';
import App from './src';

Sentry.init({
  dsn: '',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
});

FirebaseMessaging().setOpenSettingsForNotificationsHandler(() => {
  Linking.openURL('whipapp://goto/settings');
});

FirebaseMessaging()
  .getDidOpenSettingsForNotification()
  .then(didOpenSettingsForNotification => {
    if (didOpenSettingsForNotification) {
      Linking.openURL('whipapp://goto/settings');
    }
  });

FirebaseMessaging().setBackgroundMessageHandler(msg => {
  // TODO: Add msg to Inbox using mmkv
  console.log('Message received in background: ', msg);
});

FirebaseMessaging().onNotificationOpenedApp(msg => {
  if (msg?.category.includes('whipapp://')) {
    Linking.openURL(msg?.category);
  }
});

const AppWithSentry = Sentry.wrap(App);

function WithHeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return null;
  }
  return <AppWithSentry />;
}

AppRegistry.registerComponent(appName, () => WithHeadlessCheck);
