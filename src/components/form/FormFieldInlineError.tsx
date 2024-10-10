import React from 'react';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { Paragraph } from '../Typography';

export const FormFieldInlineError = ({
  message,
  attached,
}: {
  message?: string;
  attached?: boolean;
}) => {
  return message ? (
    <Animated.View
      entering={FadeInDown.duration(300).withInitialValues({
        transform: [{ translateY: 5 }],
      })}
      exiting={FadeOut.duration(200)}
    >
      <Paragraph
        color={Colors.danger}
        size="xSmall"
        style={
          attached ? { bottom: -15, position: 'absolute' } : { marginTop: 3 }
        }
      >
        {message}
      </Paragraph>
    </Animated.View>
  ) : null;
};
