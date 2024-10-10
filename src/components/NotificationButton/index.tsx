import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { useNotifications } from '../../states/Notifications';
import { Colors } from '../../theme/colors';
import { BaseButton } from '../BaseButton';
import { StatusIndicator } from '../elements/StatusIndicator';

export const NotificationButton = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const { unread } = useNotifications();
  return (
    <BaseButton
      flatten
      variant="transparent"
      rounded
      onPress={() => navigation.navigate('Inbox')}
      style={{
        height: 26,
        width: 26,
      }}
    >
      <StatusIndicator
        variant="brand"
        visible={unread > 0}
        positioning={[0, 0]}
      />
      <FontAwesomeIcon color={Colors.brandSecondary} icon={faBell} size={22} />
    </BaseButton>
  );
};
