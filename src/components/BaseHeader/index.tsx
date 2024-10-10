import React from 'react';

import {
  Platform,
  StatusBar,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { styles } from './styles';

interface IBaseHeaderProps {
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
  title?: string | undefined;
}

export const BaseHeader = ({
  leftAccessory,
  rightAccessory,
  style = {},
  textColor = Colors.white,
  title,
}: IBaseHeaderProps): React.ReactNode => {
  const insets = useSafeAreaInsets();

  const containerStyle = {
    backgroundColor: Colors.brandSecondaryDark,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 25),
    ...(style as any),
  };

  return (
    <>
      <StatusBar
        animated
        backgroundColor={Colors.brandSecondaryDark}
        barStyle="light-content"
      />
      <View
        style={{
          ...styles.container,
          ...containerStyle,
        }}
      >
        <View style={styles.leftSection}>{leftAccessory}</View>
        <View style={styles.titleSection}>
          <Text style={{ ...styles.title, color: textColor }}>{title}</Text>
        </View>
        <View style={styles.rightSection}>{rightAccessory}</View>
      </View>
    </>
  );
};
