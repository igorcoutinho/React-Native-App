import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Size } from '../../theme/sizes';
import { FontSize, TypographyFontSizeKeys } from '../../theme/typography';
import { styles } from './styles';

interface ITypographyProps {
  align?: 'left' | 'center' | 'right';
  children: string | React.ReactNode;
  color?: Colors;
  size?: TypographyFontSizeKeys | FontSize | 0 | Size;
  style?: StyleProp<TextStyle>;
}

export const Heading = ({
  align = 'left',
  children,
  color = Colors.heading,
  size = 'regular',
  style,
  ...rest
}: ITypographyProps & TextProps) => {
  return (
    <Text
      style={{
        ...styles.heading,
        color,
        fontSize:
          (typeof size === 'string' ? (FontSize[size] as any) : size) * 1.2,
        textAlign: align,
        ...(style as any),
      }}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Paragraph = ({
  align = 'left',
  children,
  color = Colors.paragraph,
  size = 'regular',
  style,
  ...rest
}: ITypographyProps & TextProps) => {
  return (
    <Text
      style={{
        ...styles.paragraph,
        color,
        fontSize: typeof size === 'string' ? (FontSize[size] as any) : size,
        textAlign: align,
        ...(style as any),
      }}
      {...rest}
    >
      {children}
    </Text>
  );
};

export const Bold = ({ children, color }: ITypographyProps & TextProps) => {
  return (
    <Text
      style={{
        color: color || null,
        fontWeight: 'bold',
      }}
    >
      {children}
    </Text>
  );
};
