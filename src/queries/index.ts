import NetInfo from '@react-native-community/netinfo';
import FirebaseFirestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import {
  NotifyOnChangeProps,
  QueryClient,
  focusManager,
  onlineManager,
} from '@tanstack/react-query';
import React from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';

export const queryClient = new QueryClient();

console.log(queryClient);

export function useFocusNotifyOnChangeProps(
  notifyOnChangeProps?: NotifyOnChangeProps,
) {
  const focusedRef = React.useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      focusedRef.current = true;
      return () => {
        focusedRef.current = false;
      };
    }, []),
  );
  return () => {
    if (!focusedRef.current) {
      return [];
    }
    if (typeof notifyOnChangeProps === 'function') {
      return notifyOnChangeProps();
    }
    return notifyOnChangeProps || [];
  };
}

export const useSetupReactQuery = () => {
  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }
  React.useEffect(() => {
    onlineManager.setEventListener(setOnline => {
      return NetInfo.addEventListener(state => {
        setOnline(!!state.isConnected);
      });
    });
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
};

export interface ISubscribeToFirestoreParams<T> {
  onSuccess: (value: T) => void;
  docId?: string;
  query?: {
    field: string;
    operator: FirebaseFirestoreTypes.WhereFilterOp;
    value: string;
  };
  path: string;
  orderBy?: string;
  asc?: boolean;
  limit?: number;
  startAfter?: FirebaseFirestoreTypes.DocumentSnapshot;
}

export function subscribeToFirestore<T>({
  onSuccess,
  docId,
  query,
  path,
  orderBy = 'createdAt',
  asc = true,
  limit,
  startAfter,
}: ISubscribeToFirestoreParams<T>) {
  let collection = FirebaseFirestore().collection(path);

  const listenerCallback = (
    snapshot:
      | FirebaseFirestoreTypes.QuerySnapshot
      | FirebaseFirestoreTypes.DocumentSnapshot,
  ) => {
    if (query) {
      onSuccess((snapshot as FirebaseFirestoreTypes.QuerySnapshot)?.docs as T);
    } else {
      onSuccess(snapshot as FirebaseFirestoreTypes.DocumentSnapshot as T);
    }
  };

  if (query) {
    collection = collection.where(
      query.field,
      query.operator,
      query.value,
    ) as FirebaseFirestoreTypes.CollectionReference;
  }

  collection = collection.orderBy(
    orderBy,
    asc ? 'asc' : 'desc',
  ) as FirebaseFirestoreTypes.CollectionReference;

  if (startAfter) {
    collection = collection.startAfter(
      startAfter,
    ) as FirebaseFirestoreTypes.CollectionReference;
  }

  if (limit) {
    collection = collection.limit(
      limit,
    ) as FirebaseFirestoreTypes.CollectionReference;
  }

  const subscriber = query
    ? collection.onSnapshot(listenerCallback, error => {
      console.log(error);
    })
    : collection.doc(docId).onSnapshot(listenerCallback);
  return subscriber;
}
