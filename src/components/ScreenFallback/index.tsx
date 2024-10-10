import React from 'react';
import { Image, useWindowDimensions } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import { Images } from '../../theme/images';
import { styles } from './styles';

export const ScreenFallback = () => {
  const { height, width } = useWindowDimensions();
  return (
    <Animated.View
      exiting={FadeOut}
      style={{
        ...styles.container,
        height,
        width,
      }}
    >
      <Image source={Images.logoSplash} style={styles.logo} />
    </Animated.View>
  );
};
