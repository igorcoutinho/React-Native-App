import {
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';
import {
  baseButtonIconTheme,
  baseButtonStyles,
  baseButtonTheme,
  styles,
} from './styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BaseButton = ({
  alignSelf = 'auto',
  children,
  disabled,
  flatten,
  onPress,
  rounded,
  selected,
  variant = 'primary',
  customColors,
  fullWidth,
  grow,

  style,

  ...rest
}: PressableProps & {
  alignSelf?: 'auto' | 'center' | 'flex-start' | 'flex-end' | 'stretch';
  children?: string | React.ReactNode;
  flatten?: boolean;
  rounded?: boolean;
  selected?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'danger'
    | 'light'
    | 'muted'
    | 'dark'
    | 'transparent'
    | 'custom';
  customColors?: {
    backgroundColor: string;
    backgroundColorDark: string;
  };
  fullWidth?: boolean;
  grow?: boolean;

  style?: StyleProp<ViewStyle>;
}) => {
  const progress = useSharedValue(0);

  const themeStyles = baseButtonTheme[variant as keyof typeof baseButtonTheme];

  const themeStylesDefault = baseButtonTheme.primary;

  const animatedStyle = useAnimatedStyle(() => {
    return variant !== 'transparent'
      ? {
          backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            variant === 'custom'
              ? [
                  customColors?.backgroundColor ||
                    themeStylesDefault.backgroundColor,
                  customColors?.backgroundColorDark ||
                    themeStylesDefault.backgroundColorDark,
                ]
              : [
                  themeStyles?.backgroundColor,
                  themeStyles?.backgroundColorDark,
                ],
          ),
        }
      : {
          opacity: interpolate(progress.value, [1, 0], [0.6, 1]),
        };
  });

  const buttonSize = flatten ? 28 : 46;

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        progress.value = withTiming(1, {
          duration: 30,
          easing: Easing.in(Easing.ease),
        });
      }}
      onPressOut={() => {
        progress.value = withTiming(0, {
          duration: 230,
          easing: Easing.out(Easing.ease),
        });
      }}
      style={[
        baseButtonStyles.base,
        { alignSelf },
        { opacity: disabled ? 0.6 : 1 },
        {
          width: rounded ? buttonSize : fullWidth ? '100%' : null,
          height: buttonSize,
        },
        { flexGrow: grow ? 1 : null },
        animatedStyle,
        style,
      ]}
    >
      <View
        style={{
          backgroundColor: selected
            ? themeStyles?.backgroundColorDark
            : 'transparent',
          width: '100%',
          height: '100%',
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          paddingHorizontal: rounded ? 0 : 16,
        }}
      >
        {typeof children === 'string' ? (
          <Text
            style={{
              ...styles.text,
              color: Colors.white,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </AnimatedPressable>
  );
};

export const BaseButtonInline = ({
  ariaLabel,
  alignSelf = 'center',
  children,
  color = Colors.pink,
  disabled,
  style,
  ...rest
}: PressableProps & {
  ariaLabel?: string;
  alignSelf?: 'auto' | 'center' | 'flex-start' | 'flex-end';
  children?: string;
  color?: Colors;
  style?: StyleProp<TextStyle>;
}) => {
  return (
    <Pressable
      {...rest}
      aria-label={ariaLabel || children}
      disabled={disabled}
      style={style}
    >
      <Text
        style={{
          ...styles.textInline,
          alignSelf,
          color: color,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export const BaseButtonIcon = ({
  disabled,
  icon = faPlus,
  ariaLabel,
  onPress,
  style,
  variant = 'inline',
  iconColor,
}: PressableProps & {
  icon?: IconProp;
  ariaLabel?: string;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'inline';
  iconColor?: Colors;
}) => {
  return (
    <Pressable
      aria-label={ariaLabel}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => {
        const theme =
          baseButtonIconTheme[variant as keyof typeof baseButtonIconTheme];
        const computedStyles = {
          ...theme,
          backgroundColor: pressed
            ? theme?.backgroundColorDark
            : theme?.backgroundColor,
          opacity: disabled ? 0.6 : 1,
        };
        return { ...(style as any), ...computedStyles };
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        color={variant === 'inline' ? iconColor || Colors.brand : Colors.white}
        size={FontSize.medium}
      />
    </Pressable>
  );
};
