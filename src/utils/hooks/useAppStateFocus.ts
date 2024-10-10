import React from 'react';
import { AppState } from 'react-native';
import { storage } from '../..';

export const useAppStateFocus = (
  onFocus: () => void,
  runOnStartup: boolean | undefined = true,
  useFirstLogin: boolean | undefined = false,
) => {
  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const firstLogin = storage.getString('firstLogin');
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        onFocus?.();
      }
      appState.current = nextAppState;
    });
    if (useFirstLogin) {
      if (!!firstLogin) {
        if (runOnStartup) {
          onFocus?.();
        }
      }
    } else {
      if (runOnStartup) {
        onFocus?.();
      }
    }
    return () => {
      subscription?.remove();
    };
  }, []);

  return appState.current;
};
