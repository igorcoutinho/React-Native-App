import React from 'react';
import { View } from 'react-native';
import { Colors } from '../../theme/colors';
import { Gap, Size } from '../../theme/sizes';
import { Heading } from '../Typography';

export interface ISectionProps {
  align?: 'center' | 'flex-start' | 'flex-end';
  children?: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: Gap | 0;
  grow?: boolean;
  fullWidth?: boolean;

  space?: Size | 0;

  spaceHorizontal?: Size | 0;
  spaceVertical?: Size | 0;

  spaceInside?: boolean;

  style?: any;
}

export const Section = ({
  align,
  children,
  direction,
  gap = Gap.small,
  grow,
  fullWidth,

  space = 0,

  spaceHorizontal,
  spaceVertical,

  spaceInside,

  style,
}: ISectionProps) => {
  const location = spaceInside ? 'padding' : 'margin';

  return (
    <View
      style={{
        [`${location}`]: space ? space : null,
        [`${location}Horizontal`]: spaceHorizontal ? spaceHorizontal : null,
        [`${location}Vertical`]: spaceVertical ? spaceVertical : null,
        alignItems: !direction ? align || null : null,
        justifyContent: direction === 'row' ? align || null : null,
        flexDirection: direction || null,
        flex: grow ? 1 : null,
        width: fullWidth ? '100%' : null,
        gap,
        ...style,
      }}
    >
      {children}
    </View>
  );
};

export const Box = ({
  children,
  color = Colors.light,
  borderColor,
  space = Size.regular,
  ...rest
}: ISectionProps & {
  color?: string;
  borderColor?: string;
}) => {
  return (
    <Section
      gap={0}
      space={space}
      spaceInside
      style={{
        backgroundColor: color,
        borderColor: borderColor,
        borderRadius: 12,
        borderWidth: borderColor ? 2 : 0,
      }}
      {...rest}
    >
      {children}
    </Section>
  );
};

export const SectionHeader = ({
  alignText,
  rightAccessory,
  style,
  title,
}: {
  alignText?: 'center' | 'left' | 'right';
  rightAccessory?: React.ReactNode;
  style?: any;
  title: string;
}) => {
  return (
    <View
      style={{
        alignItems: 'center',
        borderBottomColor: Colors.light,
        borderBottomWidth: 1,
        flexDirection: !!alignText ? null : 'row',
        gap: 5,
        justifyContent: 'space-between',
        paddingBottom: 10,
      }}
    >
      <Heading
        align={alignText}
        color={Colors.brandSecondary}
        size="small"
        style={{ textTransform: 'uppercase', marginBottom: 5 }}
      >
        {title}
      </Heading>
      {rightAccessory}
    </View>
  );
};
