import { faSearch, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';
import React from 'react';
import { FlatList } from 'react-native';
import { storage } from '../..';
import { BaseButton } from '../../components/BaseButton';
import { useUsersListQuery } from '../../queries/User/useUserListQuery';
import { IUser } from '../../states/User/types';
import { Gap, Size } from '../../theme/sizes';
import { HeaderWithImage } from '../elements/HeaderWithImage';
import { Section } from '../elements/Section';
import { Spacer } from '../elements/Spacer';
import { EmptyState } from '../EmptyState';
import { FloatingBottom } from '../FloatingBottom';
import { FormFieldTitle } from '../form/FormFieldTitle';
import { InputText } from '../form/InputText';
import { MainContainer } from '../MainContainer';
import { UserItem } from './UserItem';

const ContactSearchIllustration =
  require('../../assets/contactSearchIllustration.svg').default;

export const SearchFriends = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: (user: IUser, fromSearchFriend?: boolean) => void;
}) => {
  const [selected, setSelected] = React.useState<IUser | null>(null);
  const { isLoading, isError, data } = useUsersListQuery({ enabled: true });
  const [value, setValue] = React.useState('');
  const [items, setItems] = React.useState<{ label: string; value: string }[]>([]);
  const [filteredList, setFilteredList] = React.useState<IUser[]>([]);
  const [recentFriends, setRecentFriends] = React.useState<IUser[]>([]);

  React.useEffect(() => {
    if (!isLoading && data) {
      const transformedArray = data.map(item => ({
        label: `${item?.displayName} - ${item?.email}`,
        value: item.uid
      }));
      setItems(transformedArray);
    }
  }, [isLoading, data]);

  const handleSearch = React.useCallback(
    debounce((text: string) => {
      if (!text) {
        setSelected(null);
        findRecent();
        return;
      }

      const filteredResults: IUser[] = data?.filter(user =>
        user?.displayName?.toLowerCase?.()?.includes(text?.toLowerCase?.()) ||
        user?.email?.toLowerCase?.()?.includes(text?.toLowerCase?.())
      ) || [];
      setFilteredList(filteredResults);
      console.log('filteredResults', filteredResults);
    }, 300),
    [data]
  );

  const handleSearchChange = (text: string) => {
    setValue(text);
    handleSearch(text);
  };

  const findSelected = (item: IUser) => {
    if (data && items) {
      const foundItem = data.find(u => u.uid === item.uid);
      if (foundItem) {
        onConfirm(foundItem, true);
        storeRecentFriend(foundItem);
      } else {
        setSelected(null);
      }
    }
  };

  const storeRecentFriend = (newFriend: IUser) => {
    const recentFriendsString = storage.getString('recentFriends');
    let recentFriends: IUser[] = recentFriendsString ? JSON.parse(recentFriendsString) : [];

    if (recentFriends.some(friend => friend.uid === newFriend.uid)) {
      return;
    }

    recentFriends.unshift(newFriend);

    if (recentFriends.length > 10) {
      recentFriends.pop();
    }

    storage.set('recentFriends', JSON.stringify(recentFriends));
  };

  const findRecent = async () => {
    const recentFriendsString = storage.getString('recentFriends');
    let recentFriends = recentFriendsString ? await JSON.parse(recentFriendsString) : [];
    if (recentFriends.length > 0) {
      setRecentFriends(recentFriends);
      setFilteredList(recentFriends);
    } else {
      setFilteredList([]);
    }

    console.log('filtered', filteredList)
  };

  React.useEffect(() => {
    if (selected === null) {
      findRecent();
    }
  }, [selected]);

  return (
    <>
      <MainContainer paddingBottom={0}>
        <HeaderWithImage
          title="Search Friends"
          description="Find your friends and invite them to your whip"
        />
        <Section>
          <InputText
            autoComplete="email"
            keyboardType="email-address"
            onChange={e => handleSearchChange(e)}
            placeholder="Find by Name or Email"
            value={value}
            leftIcon={faSearch}
          />
        </Section>
        <Spacer size={Gap.small} />

        {recentFriends.length > 0 && !value && (
          <>
            <FormFieldTitle title="Recent" />
          </>
        )}
        <FlatList<IUser>
          data={filteredList}
          ItemSeparatorComponent={() => <Spacer size={Size.xSmall} />}
          ListFooterComponent={() => <Spacer size={Size.xLarge} />}
          refreshing={isLoading}
          extraData={filteredList}
          ListEmptyComponent={() => (
            <EmptyState
              placeholderImage={faUserFriends}
              label={'No users found'}
            />
          )}
          renderItem={({ item }) => (
            <UserItem
              data={item}
              selectedId={selected?.uid}
              onPress={() => findSelected(item)}
              isRecent={recentFriends?.some(friend => friend.uid === item.uid)}
            />
          )}
          keyExtractor={item => item.uid}
        />
      </MainContainer>

      <FloatingBottom defaultPadding>
        <Section direction="row">
          <BaseButton grow variant="muted" onPress={onCancel}>
            Cancel
          </BaseButton>
        </Section>
      </FloatingBottom>
    </>
  );
};
