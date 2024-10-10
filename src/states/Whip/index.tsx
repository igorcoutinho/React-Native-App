import React, { createContext } from 'react';
import { View } from 'react-native';
import { ViewLocker } from '../../components/ViewLocker';
import {
  resetWhipDetailsQuery,
  useWhipDetailsQuery,
} from '../../queries/Whip/useWhipDetailsQuery';
import {
  resetWhipFriendsQuery,
  useWhipFriendsQuery,
} from '../../queries/Whip/useWhipFriendsQuery';
import { useWhipHistoryQuery } from '../../queries/Whip/useWhipHistoryQuery';
import { invalidateWhipPagedListQuery } from '../../queries/Whip/useWhipPagedListQuery';
import { useUser } from '../User';
import { IWhip, IWhipEvent, IWhipFriend } from './types';

export const WhipContext = createContext<{
  friends: IWhipFriend[];
  history: IWhipEvent[];
  isAllowed?: boolean;
  isArchived?: boolean;
  isFetched: boolean;
  isFetching: boolean;
  isLoading: boolean;
  me: IWhipFriend;
  whip: IWhip;
}>({
  friends: null,
  history: null,
  isAllowed: null,
  isArchived: false,
  isFetched: false,
  isFetching: false,
  isLoading: null,
  me: null,
  whip: null,
});

export function WhipContextProvider({
  children,
  whipId,
}: {
  children: React.ReactNode;
  whipId: string;
}) {
  const { user } = useUser();

  const whipDetailsQuery = useWhipDetailsQuery({
    whipId,
  });

  const whipHistoryQuery = useWhipHistoryQuery({
    enabled: whipId && whipDetailsQuery?.isFetched,
    whipId,
  });

  const whipFriendsQuery = useWhipFriendsQuery({
    enabled: whipId && whipDetailsQuery?.isFetched,
    whipId,
  });

  const isAllowed = Boolean(whipDetailsQuery?.data?.friends?.find?.(email => email === user.email));
  const isArchived = Boolean(whipDetailsQuery?.data?.archived);
  const isOwner = whipDetailsQuery?.data?.ownerId === user.uid;
  const isArchivedButVisible = isOwner && isArchived;

  React.useEffect(() => {
    return () => {
      resetWhipDetailsQuery(whipId);
      resetWhipFriendsQuery(whipId);
    };
  }, []);

  React.useEffect(() => {
    if (!!whipFriendsQuery?.data && !isAllowed) {
      invalidateWhipPagedListQuery();
    }
  }, [isAllowed, whipFriendsQuery?.data]);

  const myFriendStatus = React.useMemo(() => {
    return whipFriendsQuery?.data?.find?.(f => f.userId === user?.uid || f.email === user?.email);
  }, [whipFriendsQuery?.data]);

  const haveSubscription = whipDetailsQuery?.data?.subscription?.type !== undefined;
  const subscriptionActive = whipDetailsQuery?.data?.subscription?.status === 'ACTIVE';
  const subscriptionPending = whipDetailsQuery?.data?.subscription?.status === 'PENDING' || whipDetailsQuery?.data?.subscription?.type === undefined;
  const subscriptionExpired = whipDetailsQuery?.data?.subscription?.status === 'EXPIRED';

  return (
    <WhipContext.Provider
      value={{
        isFetched: whipFriendsQuery?.isFetched,
        isFetching: whipFriendsQuery?.isFetching,
        isLoading: whipFriendsQuery?.isLoading,
        isAllowed,
        isArchived,
        whip: {
          ...whipDetailsQuery?.data,
          isOwner,
          subscriptionActive,
          subscriptionPending,
          subscriptionExpired,
        },
        history: whipHistoryQuery?.data as IWhipEvent[] || [],
        friends: whipFriendsQuery?.data as IWhipFriend[] || [],
        me: myFriendStatus as IWhipFriend,
      }}
    >
      <View
        style={{
          opacity: isArchived ? 0.8 : 1,
          flex: 1,
        }}
      >
        {whipFriendsQuery?.isLoading &&
          whipDetailsQuery?.data?.friends === undefined ? (
          <ViewLocker />
        ) : null}
        {children}
      </View>
    </WhipContext.Provider>
  );
}

export const useWhipContext = () => {
  const context = React.useContext(WhipContext);
  return context;
};
