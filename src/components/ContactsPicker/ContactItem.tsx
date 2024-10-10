import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import Contacts, { PhoneNumber } from 'react-native-contacts';
import { Bold, Paragraph } from '../../components/Typography';
import { Colors } from '../../theme/colors';
import { getAvatarInitials } from '../../utils/utilities';
import { SlideInMenu } from '../SlideInMenu';

export const ContactItem = ({
  data,
  onPress,
  selectedId,
}: {
  data: Contacts.Contact;
  onPress?: (selectedPhoneNumber: PhoneNumber) => void;
  selectedId?: string;
}) => {
  const menuRef = React.useRef<any>(null);
  const nameArray = [data?.givenName, data?.middleName, data?.familyName];
  const name = `${nameArray.filter(n => !!n).join(' ')}`;
  const phoneNumbers = data?.phoneNumbers.map(pn => pn.number).join(', ');
  const initials = getAvatarInitials(`${data.givenName} ${data.familyName}`);
  return (
    <Pressable
      onPress={() => {
        if (data?.phoneNumbers.length >= 2) {
          menuRef?.current?.open();
          return;
        }
        onPress(data?.phoneNumbers[0]);
      }}
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
                selectedId === data.recordID ? Colors.white : Colors.greyLight,
              borderRadius: 100,
              height: 40,
              justifyContent: 'center',
              marginRight: 10,
              overflow: 'hidden',
              width: 40,
            }}
          >
            {selectedId === data.recordID ? (
              <FontAwesomeIcon
                icon={faCircleCheck}
                color={Colors.success}
                size={40}
              />
            ) : (
              <>
                {data?.thumbnailPath ? (
                  <Image
                    source={{ uri: data?.thumbnailPath }}
                    style={{
                      alignSelf: 'stretch',
                      flex: 1,
                      height: undefined,
                      resizeMode: 'contain',
                      width: undefined,
                    }}
                  />
                ) : (
                  <Paragraph>
                    <Bold>{initials}</Bold>
                  </Paragraph>
                )}
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
            <Paragraph size="xSmall" ellipsizeMode="tail" numberOfLines={1}>
              {phoneNumbers}
            </Paragraph>
          </View>
        </View>
      </View>
      <SlideInMenu
        ref={menuRef}
        triggerTitle="Select Phone Number"
        options={[...data.phoneNumbers].map(pn => ({
          label: `${pn.number} (${pn.label || 'None'})`,
          onPress: () => onPress(pn),
        }))}
      />
    </Pressable>
  );
};
