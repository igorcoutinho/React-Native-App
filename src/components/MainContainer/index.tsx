import React from 'react';
import { ScrollViewProps, View, ViewProps } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { styles } from './styles';

export const MainContainer = ({
  children,
  style,
  paddingBottom,
  ...rest
}: ViewProps & {
  children: React.ReactNode;
  style?: any;
  paddingBottom?: number;
}) => {
  return (
    <>
      <Toast visibilityTime={5000} />
      <View
        style={{
          ...styles.container,
          paddingBottom,
          ...style,
        }}
        {...rest}
      >
        {children}
      </View>
    </>
  );
};

export const ScrollableContainer = ({
  animated,
  ...rest
}: ScrollViewProps & {
  animated?: boolean;
}) => {
  return (
    <Animated.ScrollView
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="never"
      entering={
        animated
          ? FadeInDown.delay(250)
              .duration(400)
              .withInitialValues({
                transform: [{ translateY: 20 }],
              })
          : undefined
      }
      {...rest}
    >
      {rest.children}
    </Animated.ScrollView>
  );
};
