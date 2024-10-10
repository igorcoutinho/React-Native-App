import React from 'react';
import { View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Gap } from '../../theme/sizes';

export const LineSeparator = ({
  color,
  margin = Gap.small
}: {
  color?: Colors,
  margin?: Gap | 0
}) => {
  return (
    <View
      style={{
        height: 2,
        marginVertical: margin,
        backgroundColor: color || Colors.greyXLight,
      }}
    />
  );
};
