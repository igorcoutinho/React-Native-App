import notifee, { AuthorizationStatus } from '@notifee/react-native';
import FirebaseMessaging from '@react-native-firebase/messaging';
import React from 'react';
import { Linking, Platform } from 'react-native';
import {
  check,
  checkMultiple, PERMISSIONS, request,
  requestMultiple, RESULTS
} from 'react-native-permissions';
import Toast from 'react-native-toast-message';

export interface IPermissionStatus {
  blocked?: boolean;
  granted: boolean | null;
  checking: boolean;
}

export interface IPermissionHook {
  blocked?: boolean;
  checking?: boolean;
  granted?: boolean;
  ready?: boolean;
  requestCameraPermission?: () => void;
  requestContactsPermission?: () => void;
  requestNotificationPermission?: () => void;
  requestGalleryPermission?: () => void;

}

const defaultStatus: IPermissionStatus = {
  blocked: false,
  granted: null,
  checking: true,
};

const isIos = Platform.OS === 'ios';

const handlePermissionDenial = (type: string) => {
  Toast.show({
    type: 'error',
    text1: `${type} permission blocked`,
    text2: 'Go to your device settings and allow it to continue.',
    onPress: () => {
      Linking.openSettings();
    },
  });
};

const handlePermissionError = () => {
  Toast.show({
    type: 'error',
    text1: 'Error while requesting permission',
    text2: 'Please try again later or contact support.',
  });
};

/**
 * Hook to check and request camera permissions.
 * @returns {Object} The camera permission status and request function.
 */
export const useCameraPermission = (): IPermissionHook => {
  const [status, setStatus] = React.useState<IPermissionStatus>(defaultStatus);

  const permissions = isIos
    ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]
    : [
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ];

  const checkBlocked = (result: any) => {
    return isIos
      ? result[PERMISSIONS.IOS.CAMERA] === RESULTS.BLOCKED ||
      result[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.BLOCKED
      : result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.BLOCKED ||
      result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.BLOCKED ||
      result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.BLOCKED;
  };

  const checkGranted = (result: any) => {
    return isIos
      ? result[PERMISSIONS.IOS.CAMERA] === RESULTS.GRANTED &&
      result[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.GRANTED
      : result[PERMISSIONS.ANDROID.CAMERA] === RESULTS.GRANTED &&
      result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
      result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED;
  };

  const requestPermission = async () => {
    try {
      const result = await requestMultiple(permissions);
      setStatus({
        blocked: checkBlocked(result),
        granted: checkGranted(result),
        checking: false,
      });
      if (checkBlocked(result)) {
        handlePermissionDenial('Camera');
      }
    } catch (error) {
      handlePermissionError();
      setStatus({ checking: false, granted: false });
    }
  };


  React.useEffect(() => {
    checkMultiple(permissions).then(statuses => {
      if (!checkGranted(statuses)) {
        requestPermission();
        return;
      }
      setStatus({ checking: false, granted: checkGranted(statuses) });
    });
  }, []);

  return {
    ...status,
    ready: status.granted && !status.checking,
    requestCameraPermission: requestPermission,
  };
};

export const useGalleryPermission = (): IPermissionHook => {
  const [status, setStatus] = React.useState<IPermissionStatus>(defaultStatus);

  const permissions = isIos
    ? [PERMISSIONS.IOS.PHOTO_LIBRARY]
    : [
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ];

  const checkBlocked = (result: any) => {
    return isIos
      ? result[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.BLOCKED
      : result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.BLOCKED ||
      result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.BLOCKED;
  };

  const checkGranted = (result: any) => {
    return isIos
      ? result[PERMISSIONS.IOS.PHOTO_LIBRARY] === RESULTS.GRANTED
      : result[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === RESULTS.GRANTED &&
      result[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === RESULTS.GRANTED;
  };

  const requestPermission = async () => {
    try {
      const result = await requestMultiple(permissions);
      setStatus({
        blocked: checkBlocked(result),
        granted: checkGranted(result),
        checking: false,
      });
      if (checkBlocked(result)) {
        handlePermissionDenial('Gallery');
      }
    } catch (error) {
      handlePermissionError();
      setStatus({ checking: false, granted: false });
    }
  };

  React.useEffect(() => {
    checkMultiple(permissions).then(statuses => {
      if (!checkGranted(statuses)) {
        requestPermission();
        return;
      }
      setStatus({ checking: false, granted: checkGranted(statuses) });
    });
  }, []);

  return {
    ...status,
    ready: status.granted && !status.checking,
    requestGalleryPermission: requestPermission,
  };
};
/**
 * Hook to check and request contacts permissions.
 * @returns {Object} The contacts permission status and request function.
 */
export const useContactsPermission = (): IPermissionHook => {
  const [status, setStatus] = React.useState<IPermissionStatus>(defaultStatus);

  const permission = isIos
    ? PERMISSIONS.IOS.CONTACTS
    : PERMISSIONS.ANDROID.READ_CONTACTS;

  const requestPermission = async () => {
    try {
      const result = await request(permission, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
        buttonPositive: 'Please accept',
      });
      setStatus({
        blocked: result === RESULTS.BLOCKED,
        granted: result === RESULTS.GRANTED,
        checking: false,
      });
      if (result === RESULTS.BLOCKED) {
        handlePermissionDenial('Contacts');
      }
    } catch (error) {
      handlePermissionError();
      setStatus({ checking: false, granted: false });
    }
  };

  React.useEffect(() => {
    check(permission).then(status => {
      const granted = status === RESULTS.GRANTED;
      if (!granted) {
        requestPermission();
        return;
      }
      setStatus({ checking: false, granted });
    });
  }, []);

  return {
    ...status,
    ready: status.granted && !status.checking,
    requestContactsPermission: requestPermission,
  };
};

/**
 * Hook to check and request notification permissions.
 * @returns {Object} The notification permission status and request function.
 */
export const useNotificationPermission = (): IPermissionHook => {
  const [status, setStatus] = React.useState<IPermissionStatus>(defaultStatus);

  const checkPermission = async () => {
    try {
      let firebaseAllowed = true;
      let notifeeAllowed = true;
      let androidAllowed = true;

      // Check Firebase Messaging permission
      const firebasePermission = await FirebaseMessaging().hasPermission();
      if (!firebasePermission) {
        const firebaseAuthorizationStatus = await FirebaseMessaging().requestPermission();
        firebaseAllowed = firebaseAuthorizationStatus === FirebaseMessaging.AuthorizationStatus.AUTHORIZED;
      }

      // Check Notifee permission
      const notifeePermission = await notifee.getNotificationSettings();
      notifeeAllowed =
        notifeePermission.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        notifeePermission.authorizationStatus === AuthorizationStatus.PROVISIONAL;
      if (!notifeeAllowed) {
        const notifeeAuthorizationStatus = await notifee.requestPermission();
        notifeeAllowed =
          notifeeAuthorizationStatus.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
          notifeeAuthorizationStatus.authorizationStatus === AuthorizationStatus.PROVISIONAL;
      }

      // Check Android specific notification permission
      if (!isIos) {
        const androidPermission = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        androidAllowed = androidPermission === RESULTS.GRANTED;
        if (!androidAllowed) {
          const androidAuthorizationStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
          androidAllowed = androidAuthorizationStatus === RESULTS.GRANTED;
        }
      }

      return firebaseAllowed && notifeeAllowed && androidAllowed;
    } catch (error) {
      return false;
    }
  };

  React.useEffect(() => {
    checkPermission().then(granted => {
      if (!granted) {
        handlePermissionDenial('Notification');
        return;
      }
      setStatus({ checking: false, granted });
    });
  }, []);

  return {
    ...status,
    ready: status.granted && !status.checking,
    requestNotificationPermission: () => checkPermission(),
  };
};
