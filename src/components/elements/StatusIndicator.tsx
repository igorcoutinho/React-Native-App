/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors, ColorsKeys } from '../../theme/colors';

export const StatusIndicator = ({
  animated = true,
  variant = 'brand',
  visible = true,
  positioning,
}: {
  animated?: boolean;
  variant?: 'brand' | 'danger' | 'success';
  visible?: boolean;
  positioning?: [top: number, left: number, bottom?: number, right?: number];
}) => {
  const animation = useSharedValue(1);

  React.useEffect(() => {
    if (!animated) {
      animation.value = 1;
      return;
    }
    animation.value = 1;
    animation.value = withRepeat(
      withTiming(1.4, {
        duration: 200,
      }),
      4,
      true,
    );
  }, [animated, variant, visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animation.value }],
    };
  });

  const position: any = positioning
    ? {
        top: positioning[0],
        left: positioning[1],
        bottom: positioning[2],
        right: positioning[3],
        position: 'absolute',
      }
    : {
        position: 'initial',
      };

  return (
    <Animated.View
      style={[
        {
          backgroundColor: visible
            ? Colors[variant as ColorsKeys]
            : 'transparent',
          borderRadius: 100,
          height: 6,
          marginLeft: 2,
          marginTop: 0,
          width: 6,
          ...position,
        },
        animatedStyle,
      ]}
    />
  );
};
