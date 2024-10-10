import FirebaseFirestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import {
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery
} from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '..';
import { useUser } from '../../states/User';
import { IWhip } from '../../states/Whip/types';
import { CustomLogger } from '../../utils/CustomLogger';

export const WhipPagedListQueryKey = 'WhipPagedListQuery';

const collection = FirebaseFirestore().collection('Whips');

type FirebaseSnapshot =
  FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData> & {
    isNew?: boolean;
  };

export const useWhipPagedListQuery = () => {
  const unsubscribe = React.useRef<any>([]);

  React.useEffect(() => {
    return () => {
      unsubscribe.current?.forEach((u: any) => u());
    };
  }, []);

  const { user } = useUser();

  return useInfiniteQuery({
    enabled: !!user.signedInAt && !!user.verified && !!user?.uid,
    initialPageParam: null,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam = null }: { pageParam: any }) => {
      return new Promise<FirebaseSnapshot[]>((resolve, reject) => {
        const subscriber = collection
          .where('friends', 'array-contains', user?.email)
          .orderBy('createdAt', 'desc')
          .startAfter(pageParam || '')
          .limit(5)
          .onSnapshot(
            snapshot => {
              resolve(snapshot.docs);
            },
            error => {
              CustomLogger({
                componentStack: 'useWhipPagedListQuery',
                error: error,
                loggedUser: user,
                message: 'Error captured in whip paged list',
              });
              reject(error);
            },
          );
        unsubscribe.current.push(subscriber);
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage
        ? lastPage[lastPage.length - 1 || 0]
        : allPages[0][allPages[0].length - 1];
    },
    select: data => ({
      pages: [...data.pages.flat()].flat().map((doc: FirebaseSnapshot) => ({
        ...doc.data(),
        id: doc.id,
        isNew: doc.isNew,
      })),
      pageParams: data.pageParams[1]?.id,
    }),
    refetchOnWindowFocus: true,
    queryKey: [WhipPagedListQueryKey],
  });
};

export const manuallyUpdateWhipPagedListQuery = (
  newData: FirebaseFirestoreTypes.DocumentSnapshot<
    FirebaseFirestoreTypes.DocumentData & IWhip
  >,
) => {
  queryClient.setQueryData(
    [WhipPagedListQueryKey],
    (data: InfiniteData<any>) => {
      data.pages[0].unshift(newData);
      return {
        pages: data.pages,
        pageParams: data.pageParams,
      };
    },
  );
};

export const invalidateWhipPagedListQuery = async () =>
  await queryClient.invalidateQueries({ queryKey: [WhipPagedListQueryKey] });
