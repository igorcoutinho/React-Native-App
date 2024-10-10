import { StyleSheet } from 'react-native';
import { FontFamily, FontSize } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  title: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.default,
  },
  leftSection: {
    width: 60,
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 60,
    alignItems: 'flex-end',
  },
});
