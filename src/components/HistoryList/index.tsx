import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { Spacer } from '../../components/elements/Spacer';
import { IWhipEvent } from '../../states/Whip/types';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';
import { HistoryItem } from './HistoryItem';

export const HistoryList = ({ data }: { data: IWhipEvent[] }) => {
  const renderSeparator = React.useCallback(
    () => (
      <View
        style={{
          height: 1,
          marginVertical: 0,
          backgroundColor: Colors.greyLight,
        }}
      />
    ),
    [],
  );

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<any>) => <HistoryItem data={item} />,
    [data],
  );

  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={
        <EmptyState label="History Entries" placeholderImage={faReceipt} />
      }
      ListFooterComponent={<Spacer size={Gap.small} />}
      ListHeaderComponent={<Spacer size={Gap.small} />}
      renderItem={renderItem}
    />
  );
};
