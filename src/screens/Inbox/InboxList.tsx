import { faMailBulk } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { Spacer } from '../../components/elements/Spacer';
import { EmptyState } from '../../components/EmptyState';
import {
  INotification
} from '../../states/Notifications/types';
import { Gap } from '../../theme/sizes';
import { InboxListItem } from './InboxListItem';

export const InboxList = ({
  listData,
  onRenderBody,
  onRenderBottomRight,
  onPress,
  customOptions,
}: {
  listData: INotification[];
  onRenderBody?: (item: INotification) => React.ReactNode;
  onRenderBottomRight?: (item: INotification) => React.ReactNode;
  /**
 * 
 * Responsible to generate Options View and Hide Notification
 */
  onPress?: (event: {
    action: string;
    data: any;
  }) => void;
  customOptions?: (item: INotification) => {
    label: string;
    onPress: (item: INotification) => void;
  }[] | {
    label: string;
    onPress: (item: INotification) => void;
  }[];
}) => {

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<INotification>) => {
      return <InboxListItem
        item={item}
        onRenderBody={onRenderBody}
        onRenderBottomRight={onRenderBottomRight}
        onPress={onPress}
        customOptions={customOptions}
      />;
    },
    []
  );

  return (
    <FlatList
      data={listData}
      ItemSeparatorComponent={() => <Spacer size={Gap.small} />}
      ListEmptyComponent={
        <EmptyState label="Notifications" placeholderImage={faMailBulk} />
      }
      ListFooterComponent={<Spacer size={Gap.small} />}
      ListHeaderComponent={<Spacer size={Gap.small} />}
      renderItem={renderItem}
    />
  );
};
