/* eslint-disable react-hooks/exhaustive-deps */
import FirebaseAuth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import FirebaseMessaging from '@react-native-firebase/messaging';
import { differenceInSeconds, toDate } from 'date-fns';
import React, { createContext } from 'react';
import { Linking, NativeModules } from 'react-native';
import { analytics, storage } from '../..';
import { safeJsonString } from '../../utils/utilities';
import { IUser, IUserContext } from './types';

const collection = FirebaseFirestore().collection('Users');

export const UserContext = createContext<IUserContext>({
  isFetched: false,
  isFetching: false,
  isPending: true,
  isSignedIn: false,
  user: null,
});

interface IUserStateProps {
  isFetched?: boolean;
  isFetching?: boolean;
  isPending?: boolean;
}

const defaultState: any = {
  isFetched: false,
  isFetching: false,
  isPending: true,
};

const { MySharedStorage } = NativeModules;

export function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = React.useState<
    IUser & IUserStateProps & IUserContext
  >(defaultState);

  React.useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const subscriber = collection
      .doc(user?.uid)
      .onSnapshot(async documentSnapshot => {
        if (!documentSnapshot?.data()?.email) {
          const collection = FirebaseFirestore().collection('Users');
          collection.doc(user.uid).set(
            {
              email: user?.email,
              displayName: user?.displayName,
              phoneNumber: user?.phoneNumber,
              updatedAt: FirebaseFirestore.FieldValue.serverTimestamp(),
            },
            { merge: true },
          );
        }
        const admin = await FirebaseFirestore().collection('Admin').doc('Settings').get();
        const userData: any = {
          ...FirebaseAuth().currentUser?.toJSON(),
          ...documentSnapshot?.data(),
          isFetched: true,
          isFetching: false,
          admin: __DEV__ ? {
            fees: {
              subscriptionMonthlyFee: 1.6,
              uploadFeeDiscount: 100,
              uploadFeeFixed: 0.2,
              uploadFeeMultiplier: 0.016,
            }
          } : (admin?.data() || {}),
        };
        updateUserState(userData);
        try {
          await analytics().setUserId(user?.uid);
          await analytics().setUserProperty('email', user?.email);
        } catch (error) { }
        try {
          const idToken = await FirebaseAuth().currentUser.getIdToken();
          if (userData?.account?.provider?.customerId) {
            await MySharedStorage?.setValue(
              String(userData?.account?.provider?.customerId),
              'customerId',
            );
          }
          if (userData?.account?.firstName && userData?.account?.lastName) {
            await MySharedStorage?.setValue(
              String(
                `${userData?.account?.firstName} ${userData?.account?.lastName}`,
              ),
              'fullName',
            );
          }
          if (user?.uid) {
            await MySharedStorage?.setValue(String(user?.uid), 'uid');
          }
          if (idToken) {
            await MySharedStorage?.setValue(String(idToken), 'idToken');
          }
        } catch (error) { }
      });

    const ticketsSubscriber = FirebaseFirestore().collection('Tickets')
      .where('userId', '==', user?.uid)
      .where('expired', '==', false)
      .where('type', '==', '3DS_AUTHENTICATION')
      .onSnapshot(async documentSnapshot => {
        const doc: any = documentSnapshot?.docs?.[0]?.data?.();
        const docId: any = documentSnapshot?.docs?.[0]?.id;
        if (!doc) return;
        const diff = differenceInSeconds(new Date(), toDate(doc?.createdAt?.seconds * 1000));
        if (diff < 150) {
          Linking.openURL(`whipapp://goto/3ds/${docId}`);
        }
      }, error => {
        console.log('ticketsSubscriber', error);
      });

    return () => {
      ticketsSubscriber();
      subscriber();
    };
  }, [user?.uid]);

  React.useEffect(() => {
    if (!user?.uid || user?.isFetching) {
      return;
    }
    FirebaseMessaging()
      .getToken()
      .then(token => {
        if (user?.properties?.deviceToken !== token) {
          collection
            .doc(user.uid)
            .set({ properties: { deviceToken: token } }, { merge: true });
        }
      })
      .catch(error => {
        console.log('FirebaseMessaging().getToken()', error);
      });
  }, [user?.uid, user?.isFetching]);

  const onAuthStateChanged: FirebaseAuthTypes.AuthListenerCallback =
    React.useCallback(
      async auth => {
        if (auth?.uid && !user?.uid) {
          setUser({
            ...user,
            ...auth?.toJSON(),
            isFetching: true,
            isPending: false,
            signedInAt: getUserStorage()?.signedInAt || null,
            verified: getUserStorage()?.verified || false,
          });
        }
      },
      [user],
    );

  React.useEffect(() => {
    const subscribeOnAuthStateChanged =
      FirebaseAuth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscribeOnAuthStateChanged();
    };
  }, []);

  const signOut = async () => {
    try {
      await FirebaseAuth().signOut();
    } catch (error) { }
    try {
      await FirebaseFirestore().clearPersistence();
      await MySharedStorage?.clearStorage();
    } catch (error) { }
    storage.clearAll();
    setUser(defaultState);
  };

  const updateUserProperty = async (key: string, value: any) => {
    const update = {};
    return await collection.doc(user?.uid).set(update, { merge: true });
  };

  const getUserStorage = (): IUser => {
    const metadata = JSON.parse(storage.getString('user') || '{}');
    return metadata;
  };

  const updateUserStorage = React.useCallback(
    (key: string, value: any) => {
      const metadata: any = getUserStorage();
      metadata[key] = value;
      storage.set('user', safeJsonString(metadata));
      setUser({
        ...user,
        ...FirebaseAuth()?.currentUser?.toJSON(),
        ...metadata,
      });
      return metadata;
    },
    [user],
  );

  const updateUserState = React.useCallback(
    (value: any) => {
      const metadata: any = getUserStorage();
      setUser({
        ...user,
        ...metadata,
        ...FirebaseAuth()?.currentUser?.toJSON(),
        ...value,
      });
      return value;
    },
    [user],
  );

  const isSignedIn = Boolean(
    !!user.uid && !!user.signedInAt && !!user.verified,
  );

  return (
    <UserContext.Provider
      value={{
        getUserStorage,
        isFetched: user.isFetched,
        isFetching: user.isFetching,
        isPending: user.isPending,
        isSignedIn,
        signOut,
        updateUserProperty,
        updateUserStorage,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = React.useContext(UserContext);
  return context;
};
