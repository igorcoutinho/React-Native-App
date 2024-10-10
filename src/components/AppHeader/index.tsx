import React from 'react';

import { getHeaderTitle } from '@react-navigation/elements';
import { StackHeaderProps } from '@react-navigation/stack';

import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Platform, Pressable, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { commonProps } from '../../theme/commonProps';
import { styles } from './styles';

interface IAppHeaderProps extends StackHeaderProps {
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
}

export const AppHeader = ({
  back,
  navigation,
  options,
  route,
  leftAccessory,
  rightAccessory,
}: IAppHeaderProps): React.ReactNode => {
  const title = getHeaderTitle(options, route.name);

  const insets = useSafeAreaInsets();

  const safePaddings = {
    paddingBottom: 15,
    paddingTop: insets.top + (Platform.OS === 'ios' ? 10 : 25),
  };

  const shouldShowBackButton =
    back && navigation.canGoBack() && options.headerBackTitleVisible;

  return (
    <View style={{ ...styles.container, ...safePaddings }}>
      <StatusBar
        animated
        backgroundColor={Colors.brandSecondaryDark}
        barStyle="light-content"
      />
      {!shouldShowBackButton ? (
        <View style={styles.leftSection}>{leftAccessory}</View>
      ) : null}
      {shouldShowBackButton ? (
        <View style={styles.leftSection}>
          <Pressable
            accessibilityLabel="Back"
            onPress={navigation.goBack}
            style={styles.backButton}
            hitSlop={commonProps.hitSlopBase}
          >
            <FontAwesomeIcon icon={faArrowLeft} color={Colors.white} />
          </Pressable>
        </View>
      ) : null}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.rightSection}>{rightAccessory}</View>
    </View>
  );
};
