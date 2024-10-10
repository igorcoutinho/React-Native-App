import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { FontSize } from '../../theme/typography';

const paddingSize = 15;
const borderRadiusSize = 100;

export const baseButtonStyles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: borderRadiusSize,
    height: 46,
    justifyContent: 'center',
  },
});

export const baseButtonTheme = StyleSheet.create({
  primary: {
    backgroundColor: Colors.brand,
    backgroundColorDark: Colors.brandDark,
  },
  secondary: {
    backgroundColor: Colors.brandSecondary,
    backgroundColorDark: Colors.brandSecondaryDark,
  },
  tertiary: {
    backgroundColor: Colors.muted,
    backgroundColorDark: Colors.mutedDark,
  },
  muted: {
    backgroundColor: Colors.mutedDark,
    backgroundColorDark: Colors.muted,
  },
  light: {
    backgroundColor: Colors.light,
    backgroundColorDark: Colors.lightDark,
  },
  dark: {
    backgroundColor: Colors.dark,
    backgroundColorDark: Colors.mutedDark,
  },
  danger: {
    backgroundColor: Colors.danger,
    backgroundColorDark: Colors.dangerDark,
  },
});

export const baseButtonIconTheme = StyleSheet.create({
  primary: {
    alignItems: 'center',
    backgroundColor: Colors.brand,
    backgroundColorDark: Colors.brandDark,
    borderRadius: borderRadiusSize,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  secondary: {
    alignItems: 'center',
    backgroundColor: Colors.brandSecondary,
    backgroundColorDark: Colors.brandSecondaryDark,
    borderRadius: borderRadiusSize,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  inline: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    backgroundColorDark: 'transparent',
    borderRadius: borderRadiusSize,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
});

export const styles = StyleSheet.create({
  text: {
    color: Colors.white,
    fontSize: FontSize.regular,
  },
  textInline: {
    fontSize: FontSize.regular,
    fontWeight: 'bold',
  },

  flatten: {
    padding: paddingSize / 2,
  },
});
