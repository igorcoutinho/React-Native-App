import { StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { FontFamily, FontSize } from '../../theme/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.brandSecondaryDark,
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
  },
  backButton: {
    width: 22,
    paddingTop: 2,
  },
  title: {
    color: Colors.white,
    fontSize: FontSize.medium,
    fontFamily: FontFamily.default,
  },
  leftSection: {
    width: 60,
    height: 26,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  titleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
