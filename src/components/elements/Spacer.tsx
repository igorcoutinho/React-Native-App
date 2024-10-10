import React from 'react';
import { View } from 'react-native';
import { Size } from '../../theme/sizes';

export const Spacer = ({
  horizontal,
  size = Size.small,
}: {
  horizontal?: boolean;
  size?: Size | number;
}) => {
  return <View style={horizontal ? { width: size } : { height: size }} />;
};
