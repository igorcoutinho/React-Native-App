import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faCog,
  faDashboard,
  faHome,
  faTicket,
  faWallet
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { VStack } from '@gluestack-ui/themed';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as React from 'react';
import { Pressable, StyleProp, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import { styles } from './styles';

export const TabsBar = ({
  state,
  descriptors,
  navigation,
  blackList = [],
}: BottomTabBarProps & {
  blackList?: string[];
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ ...styles.container, paddingBottom: insets.bottom + 0 }}>
      <View style={styles.wrapper}>
        {state.routes.map((route, index) => {
          if (blackList.includes(route.name)) {
            return null;
          }

          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress',
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              target: route.key,
              type: 'tabLongPress',
            });
          };

          const iconsMap: Record<string, IconProp> = {
            Wallet: faWallet,
            Dashboard: faDashboard,
            MyWhips: faTicket,
            Settings: faCog,
          };

          const iconName = (iconsMap[route.name] || faHome) as IconProp;
          const iconColor = isFocused
            ? Colors.brand
            : Colors.brandSecondaryDark;
          const icon = (
            <FontAwesomeIcon
              icon={iconName}
              size={24}
              style={{ color: iconColor }}
            />
          );
          const iconDescStyle: StyleProp<any> = {
            color: isFocused ? Colors.brand : Colors.brandSecondaryDark,
            fontSize: 10,
          };
          return (
            <Pressable
              accessibilityLabel={options.tabBarAccessibilityLabel}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
              key={route.key}
              onLongPress={onLongPress}
              onPress={onPress}
              testID={options.tabBarTestID}
              style={{ padding: 5 }}
            >
              <VStack alignItems="center" space="xs">
                {icon}
                <Text style={iconDescStyle}>
                  {options?.title || route.name}
                </Text>
              </VStack>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export const useTabsBarBottomSize = () => {
  const insets = useSafeAreaInsets();
  return insets.bottom + 70;
};
