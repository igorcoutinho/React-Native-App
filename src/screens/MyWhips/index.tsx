import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { MainContainer } from '../../components/MainContainer';
import { useTabsBarBottomSize } from '../../components/TabsBar';
import { InternalNavigationNames } from '../../navigation/types';
import { useWhipPagedListQuery } from '../../queries/Whip/useWhipPagedListQuery';
import { useUser } from '../../states/User';
import { IWhip, WhipFilterButton } from '../../states/Whip/types';
import WhipFilterButtons, {
  FabButton,
  ItemSeparator,
  renderEmptyState,
  renderItem
} from './components';

export const MyWhips = () => {
  const flatListRef = React.useRef<FlatList>(null);

  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any>>();

  const whipPagedListQuery = useWhipPagedListQuery();
  const { user } = useUser();
  const [filteredItems, setFilteredItems] = useState<IWhip[] | [] | null>(null);
  const [items, setItems] = useState<IWhip[]>([]);

  const [buttons] = useState<WhipFilterButton[]>(Object.values(WhipFilterButton));
  const [buttonIndex, setButtonIndex] = useState<WhipFilterButton>(WhipFilterButton.All);

  useFocusEffect(
    React.useCallback(() => {
      if (flatListRef?.current && route.params?.newWhipId) {
        try {
          flatListRef?.current?.scrollToIndex({ animated: true, index: 0 });
        } catch (error) {
          console.log(error);
        }
      }
    }, [flatListRef, route.params?.newWhipId]),
  );

  const isLoading =
    whipPagedListQuery.isFetching ||
    whipPagedListQuery.isLoading ||
    whipPagedListQuery.isPending;

  React.useEffect(() => {
    if (whipPagedListQuery.data) {
      const updatedItems = whipPagedListQuery.data.pages.map((i: IWhip) => {
        if (i.ownerId === user?.uid) {
          return { ...i, isOwner: true };
        }
        return i;
      });
      setItems(updatedItems);
    }
  }, [whipPagedListQuery.data, user?.uid]);

  const handleFilterPress = () => {
    let filteredItems: IWhip[];
    switch (buttonIndex) {
      case WhipFilterButton.All:
        filteredItems = items.filter(item => !item?.archived);
        break;
      case WhipFilterButton.Master:
        filteredItems = items.filter(item => user.uid === item.ownerId && !item?.archived);
        break;
      case WhipFilterButton.Invited:
        filteredItems = items.filter(item => user.uid !== item.ownerId && !item?.archived);
        break;
      case WhipFilterButton.Archived:
        filteredItems = items.filter(item => !!item?.archived);
        break;
      default:
        filteredItems = items;
    }
    setFilteredItems(filteredItems);
  };

  React.useEffect(() => {
    handleFilterPress();
  }, [buttonIndex]);

  React.useEffect(() => {
    handleFilterPress();
  }, [items]);

  return (
    <MainContainer paddingBottom={useTabsBarBottomSize()}>

      <WhipFilterButtons
        buttons={buttons}
        selectedIndex={buttonIndex}
        onPress={setButtonIndex}
      />

      <FlatList
        ref={flatListRef}
        data={filteredItems}
        refreshing={false}
        onRefresh={whipPagedListQuery.refetch}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={ItemSeparator}
        ListFooterComponent={<View style={{ height: 20 }} />}
        ListEmptyComponent={renderEmptyState(isLoading, () => {
          navigation.navigate(InternalNavigationNames.CreateWhipModal);
        })}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          if (!whipPagedListQuery.isFetching) {
            whipPagedListQuery.fetchNextPage();
          }
        }}
        renderItem={info =>
          renderItem(info, () => {
            navigation.navigate(InternalNavigationNames.WhipDetailsModal, {
              whipId: info.item.id,
            });
          })
        }
        keyExtractor={item => item.id || ''}
      />
      <FabButton />
    </MainContainer>
  );
};
