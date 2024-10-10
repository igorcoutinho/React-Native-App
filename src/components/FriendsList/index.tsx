import { faUsers } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { IWhipFriend, WhipFriendActionType } from '../../states/Whip/types';
import { Gap } from '../../theme/sizes';
import { sortByField } from '../../utils/utilities';
import { Spacer } from '../elements/Spacer';
import { EmptyState } from '../EmptyState';
import { FriendItem } from './FriendItem';

export const FriendsList = ({
  data,
  onPress,
}: {
  data: IWhipFriend[];
  onPress?: (event: { action: WhipFriendActionType; data: any }) => void;
}) => {

  const orderedData = sortByField(data, 'createdAt');

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<IWhipFriend>) => (
      <FriendItem data={item} onPress={onPress} />
    ),
    [onPress],
  );
  return (
    <FlatList
      data={orderedData}
      ItemSeparatorComponent={() => <Spacer size={Gap.small} />}
      ListEmptyComponent={
        <EmptyState label="Whip Friends" placeholderImage={faUsers} />
      }
      ListFooterComponent={<Spacer size={Gap.small} />}
      ListHeaderComponent={<Spacer size={Gap.small} />}
      renderItem={renderItem}
    />
  );
};
