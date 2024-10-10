import { faStar, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Pressable, View } from 'react-native';
import { IUser } from '../../states/User/types';
import { Colors } from '../../theme/colors';
import { getAvatarInitials } from '../../utils/utilities';
import { AvatarImage } from '../AvatarImage';
import { Bold, Paragraph } from '../Typography';

export const UserItem = ({
  data,
  selectedId,
  onPress,
  isRecent
}: {
  data: IUser;
  selectedId?: string;
  onPress: (item: IUser) => void;
  isRecent?: boolean
}) => {
  const name = data?.displayName;
  const initials = data?.displayName ? getAvatarInitials(`${data?.displayName}`) : '';

  return (
    <Pressable
      style={{
        alignItems: 'center',
        backgroundColor: Colors.light,
        borderRadius: 12,
        flex: 1,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        padding: 10,
        width: '100%',
      }}
      onPress={() => {
        onPress(data);
      }}
    >
      <View
        style={{
          alignItems: 'flex-end',
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              alignItems: 'center',
              backgroundColor:
                selectedId === data?.uid ? Colors.white : Colors.greyLight,
              borderRadius: 100,
              height: 40,
              justifyContent: 'center',
              marginRight: 10,
              overflow: 'hidden',
              width: 40,
            }}
          >
            {data?.photoURL ? (
              <AvatarImage
                value={data?.photoURL}
                borderRadius={100}
                useIcon
                icon={faUser}
                iconSize={20}
              />
            ) : (
              <>
                <Paragraph>
                  <Bold>{initials}</Bold>
                </Paragraph>
              </>
            )}
          </View>
          <View style={{ gap: 2, flex: 1 }}>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                gap: 5,
              }}
            >
              <Paragraph
                color={Colors.mutedDark}
                ellipsizeMode="tail"
                numberOfLines={1}
                size="small"
                style={{ flex: 1 }}
              >
                <Bold>{name}</Bold>
              </Paragraph>
            </View>


          </View>

          {isRecent &&
            <View
              style={{
                alignItems: 'center',
                height: 40,
              }}
            >
              <FontAwesomeIcon
                icon={faStar}
                color={Colors.attention}
                size={10}
              />
            </View>
          }

        </View>
      </View>
    </Pressable>
  );
};
