import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Colors } from '../../theme/colors';
import { commonProps } from '../../theme/commonProps';
import { styles } from './styles';

interface IModalHeaderProps {
  action?: 'close' | 'back';
  onPress?: () => void;
  rightAccessory?: React.ReactNode;
}

export const ModalHeader = ({
  action = 'close',
  onPress,
  rightAccessory,
}: IModalHeaderProps): React.ReactNode => {
  const navigation = useNavigation<NavigationProp<any>>();

  const renderBack = (
    <TouchableOpacity
      activeOpacity={0.6}
      accessibilityLabel="Back"
      onPress={onPress ? onPress : navigation.goBack}
      style={styles.button}
      hitSlop={commonProps.hitSlopBase}
    >
      <FontAwesomeIcon color={Colors.dark} icon={faArrowLeft} size={22} />
    </TouchableOpacity>
  );
  const renderClose = (
    <TouchableOpacity
      activeOpacity={0.6}
      accessibilityLabel="Back"
      onPress={onPress ? onPress : navigation.goBack}
      style={styles.button}
      hitSlop={commonProps.hitSlopBase}
    >
      <FontAwesomeIcon color={Colors.dark} icon={faXmark} size={22} />
    </TouchableOpacity>
  );
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 20,
        width: '100%',
        zIndex: 100,
      }}
    >
      {action === 'back' ? renderBack : renderClose}
      {rightAccessory ? (
        <View style={styles.rightAccessory}>{rightAccessory}</View>
      ) : null}
    </View>
  );
};
