import { faUsers } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { IWhipChat } from '../../states/Chat/types';
import { Gap } from '../../theme/sizes';
import { EmptyState } from '../EmptyState';
import { Spacer } from '../elements/Spacer';
import { ChatItem } from './ChatItem';

export const Chatlist = ({
  data,
}: {
  data: IWhipChat[];
}) => {
  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<IWhipChat>) => (
      <ChatItem data={item} />
    ),
    [],
  );
  return (
    <FlatList
      data={data}
      ItemSeparatorComponent={() => <Spacer size={Gap.small} />}
      ListEmptyComponent={
        <EmptyState label="Whip Chat" placeholderImage={faUsers} />
      }
      ListFooterComponent={<Spacer size={Gap.small} />}
      ListHeaderComponent={<Spacer size={Gap.small} />}
      renderItem={renderItem}
    />
  );
};
