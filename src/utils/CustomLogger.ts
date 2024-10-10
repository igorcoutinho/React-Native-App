import crashlytics from '@react-native-firebase/crashlytics';
import * as Sentry from "@sentry/react-native";
import { IUser } from "../states/User/types";

export const CustomLogger = async ({
  componentStack,
  error,
  loggedUser,
  message,
}: {
  componentStack?: string;
  error: Error;
  loggedUser?: IUser;
  message?: string;
}) => {

  if (__DEV__) {
    console.log('log:', componentStack, error, loggedUser, message);
    return true;
  }
  Sentry.captureMessage(message || 'An error occurred');
  Sentry.captureException(error);
  Sentry.setTag('userEmail', loggedUser?.email || 'Undefined');
  Sentry.setTag('componentStack', componentStack || 'Undefined');
  Sentry.setTag('userId', loggedUser?.uid || 'Undefined');

  crashlytics().log(message || 'An error occurred');
  crashlytics().recordError(error);

  await Promise.all([
    crashlytics().setUserId(loggedUser?.uid || 'Undefined'),
    crashlytics().setAttributes({
      userEmail: loggedUser?.email || 'Undefined',
      componentStack: componentStack || 'Undefined',
    }),
  ]);

  return true;
};
